import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import clientPromise from '@/lib/mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: "Missing email or password" });
  }

  try {
    const client = await clientPromise;
    const db = client.db();
    const users = db.collection("users");

    // Check if user already exists
    const existingUser = await users.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user with default fields
    await users.insertOne({
      username,
      password: hashedPassword,
      totalPoints: 0,
      pins: [],
    });

    res.status(201).json({ success: true });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}