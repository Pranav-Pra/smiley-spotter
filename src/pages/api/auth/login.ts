import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import clientPromise from '@/lib/mongodb';
import { serialize } from 'cookie';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const { username, password } = req.body;

  const client = await clientPromise;
  const db = client.db();
  const user = await db.collection('users').findOne({ username });

  if (!user) return res.status(404).json({ message: 'User not found' });

  const isValid = await bcrypt.compare(password, user.password);

  if (!isValid) return res.status(401).json({ message: 'Invalid credentials' });

  const token = jwt.sign(
    { username: user.username, id: user._id },
    process.env.JWT_SECRET!,
    { expiresIn: '7d' }
  );

 // cookie-based authentiction

  const cookie = serialize("userToken", token, {
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 7, 
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  res.setHeader("Set-Cookie", cookie);

  const usernameCookie = serialize("username", username, {
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  res.setHeader("Set-Cookie", [cookie, usernameCookie]);

  return res.status(200).json({ message: "Login successful" });
}