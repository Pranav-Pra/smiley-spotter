import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '@/lib/mongodb';
import { parse } from 'cookie';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  // Get username from cookies
  const cookies = parse(req.headers.cookie || '');
  const username = cookies.username;
  

  if (!username) {
    return res.status(401).json({ error: "Unauthorized: No username found in cookies" });
  }

  const { score, lat, lng, image } = req.body;

  if (typeof score !== 'number' || typeof lat !== 'number' || typeof lng !== 'number') {
    return res.status(400).json({ error: "Missing or invalid data" });
  }

  try {
    const client = await clientPromise;
    const db = client.db();

    await db.collection("users").updateOne(
      { username },
      {
        $inc: { totalPoints: score },
        $push: { pins: { lat, lng, image} } as any,
      },
      { upsert: true }
    );

    res.status(200).json({ success: true });
  } catch (err) {
    console.error("MongoDB update error:", err);
    res.status(500).json({ error: "Database error" });
  }
}