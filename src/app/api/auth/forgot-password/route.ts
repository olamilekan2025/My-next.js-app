import { NextRequest, NextResponse } from "next/server"
import crypto from "crypto"
import bcrypt from "bcryptjs"

import connectDB from "@/lib/mongoDB"
import { sendPasswordResetCode } from "@/lib/mailer"
import { normalizeEmail } from "@/lib/auth-mock"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const email = normalizeEmail(body.email || "")

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
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

    // Check user existence in MongoDB
    const user = await usersCollection.findOne({ email })
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    // Generate a 6-digit code
    const code = crypto
      .randomInt(100000, 1000000)
      .toString()
      .padStart(6, "0")

    // Store reset code in DB (hashing avoids leaking code if DB is exposed)
    const passwordResetCodeHash = await bcrypt.hash(code, 10)
    const passwordResetExpiresAt = new Date(Date.now() + 5 * 60 * 1000)

    await usersCollection.updateOne(
      { email },
      {
        $set: {
          passwordResetCodeHash,
          passwordResetExpiresAt,
          updatedAt: new Date(),
        },
      }
    )

    const sent = await sendPasswordResetCode(email, code)

    if (!sent) {
      return NextResponse.json(
        { error: "Failed to send reset code" },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: "Reset code sent",
    })
  } catch (error) {
    console.log(error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
