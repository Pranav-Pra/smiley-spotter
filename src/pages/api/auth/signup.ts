import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import clientPromise from '@/lib/mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const { username, password } = req.body;

  if (!username || !password) return res.status(400).json({ message: 'Missing fields' });

  const client = await clientPromise;
  const db = client.db();
  const existing = await db.collection('users').findOne({ username });

  if (existing) return res.status(409).json({ message: 'User already exists' });

  const hashedPassword = await bcrypt.hash(password, 10);

  await db.collection('users').insertOne({ username, password: hashedPassword });

  return res.status(201).json({ message: 'User created' });
}