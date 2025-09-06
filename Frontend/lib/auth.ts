import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production"

export interface User {
  user_id: number
  name: string
  email: string
  role: "admin" | "member"
  password?: string
  created_at?: string
}

// Mock database - replace with actual database in production
const users: User[] = [
  {
    user_id: 1,
    name: "System Administrator",
    email: "admin@synergysphere.com",
    role: "admin",
    password: "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // password123
    created_at: "2025-09-06T10:00:00.000Z",
  },
  {
    user_id: 2,
    name: "Team Member",
    email: "member@synergysphere.com",
    role: "member",
    password: "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // password123
    created_at: "2025-09-06T10:15:00.000Z",
  },
]

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

export function generateToken(user: Omit<User, "password">): string {
  return jwt.sign(
    {
      user_id: user.user_id,
      email: user.email,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: "24h" },
  )
}

export function verifyToken(token: string): any {
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch (error) {
    return null
  }
}

export function findUserByEmail(email: string): User | undefined {
  return users.find((user) => user.email === email)
}

export function findUserById(id: number): User | undefined {
  return users.find((user) => user.user_id === id)
}

export function createUser(userData: Omit<User, "user_id" | "created_at">): User {
  const newUser: User = {
    user_id: users.length + 1,
    ...userData,
    created_at: new Date().toISOString(),
  }
  users.push(newUser)
  return newUser
}

export function getAllUsers(): Omit<User, "password">[] {
  return users.map(({ password, ...user }) => user)
}
