import bcrypt from "bcryptjs"

export type MockUser = {
  id: string
  firstname: string
  lastname: string
  email: string
  phone?: string
  address?: string
  password: string
  termsAgreed: boolean
}

const mkHash = (plain: string) =>
  bcrypt.hashSync(plain, 10)

export const users: MockUser[] = [
  {
    id: "1",
    firstname: "Test",
    lastname: "User",
    email: "test@example.com",
    password: mkHash("password123"),
    termsAgreed: true,
    phone: "",
    address: "",
  },
]