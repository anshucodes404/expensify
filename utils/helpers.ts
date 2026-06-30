import { IUser } from '@/models/user';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

type DecodedToken = {
  _id: string
}

export function generateToken(user: IUser): string {
  const payload = { _id: user._id } as jwt.JwtPayload
  const secret = process.env.JWT_SECRET as jwt.Secret
  const signInOptions = { expiresIn: process.env.JWT_EXPIRY || '3d' } as jwt.SignOptions

  return jwt.sign(payload, secret, signInOptions)
}


export async function verifyToken() {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value

  if (!token) throw new Error("Unauthorized")

  const decoded = jwt.verify(token, process.env.JWT_SECRET as jwt.Secret)

  if(!decoded) throw new Error("Invalid token")
  
  return decoded as DecodedToken
}