import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"

import connectDB from "@/lib/mongoDB"
import { normalizeEmail } from "@/lib/auth-mock"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const email = normalizeEmail(body.email || "")

    const code =
      typeof body.code === "string" ? body.code.trim() : ""

    const newPassword =
      typeof body.newPassword === "string"
        ? body.newPassword.trim()
        : ""

    if (!email || !code || !newPassword) {
      return NextResponse.json(
        {
          error: "Email, code and password are required",
        },
        { status: 400 }
      )
    }

    const connected = await connectDB()
    if (!connected) {
      return NextResponse.json(
        { error: "Database connection failed" },
        { status: 500 }
      )
    }

    const { client } = global.mongo!
    const db = client.db()
    const usersCollection = db.collection("users")

    // User existence + reset code validation
    const user = await usersCollection.findOne({ email })
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    const { passwordResetCodeHash, passwordResetExpiresAt } = user as any

    if (!passwordResetCodeHash || !passwordResetExpiresAt) {
      return NextResponse.json(
        { error: "Invalid or expired reset code" },
        { status: 400 }
      )
    }

    if (new Date(passwordResetExpiresAt) < new Date()) {
      // Clear expired code
      await usersCollection.updateOne(
        { email },
        {
          $unset: {
            passwordResetCodeHash: "",
            passwordResetExpiresAt: "",
          },
          $set: { updatedAt: new Date() },
        }
      )

      return NextResponse.json(
        { error: "Reset code expired" },
        { status: 400 }
      )
    }

    const codeValid = await bcrypt.compare(
      code,
      passwordResetCodeHash
    )

    if (!codeValid) {
      return NextResponse.json(
        { error: "Invalid reset code" },
        { status: 400 }
      )
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10)

    await usersCollection.updateOne(
      { email },
      {
        $set: { password: hashedPassword, updatedAt: new Date() },
        $unset: {
          passwordResetCodeHash: "",
          passwordResetExpiresAt: "",
        },
      }
    )

    return NextResponse.json({
      success: true,
      message: "Password reset successful",
    })
  } catch (error) {
    console.log(error)

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

