import type { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { parse } from 'cookie';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).end();

  try {
    // Read token from cookie
    const cookies = req.headers.cookie ? parse(req.headers.cookie) : {};
    const token = cookies.userToken;

    if (!token) return res.status(401).json({ message: "Unauthorized: No token" });

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };

    const client = await clientPromise;
    const db = client.db();

    const user = await db.collection('users').findOne({ _id: new ObjectId(decoded.id) });

    if (!user) return res.status(404).json({ message: "User not found" });

    return res.status(200).json({ pins: user.pins ?? [] });
  } catch (err) {
    console.error("Error fetching pins:", err);
    return res.status(500).json({ message: "Failed to fetch pins" });
  }
}