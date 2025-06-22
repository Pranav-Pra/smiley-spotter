import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import clientPromise from "@/lib/mongodb";
import { parse } from "cookie";
import { ObjectId } from "mongodb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const cookies = req.headers.cookie;
    if (!cookies) return res.status(401).json({ message: "No cookies" });

    const { userToken } = parse(cookies);
    if (!userToken) return res.status(401).json({ message: "No token in cookie" });

    const decoded = jwt.verify(userToken, process.env.JWT_SECRET!) as { id: string };

    const client = await clientPromise;
    const db = client.db();
    const user = await db.collection("users").findOne({ _id: new ObjectId(decoded.id) });

    if (!user) return res.status(404).json({ message: "User not found" });

    const totalPoints = user.totalPoints ?? 0;

    return res.status(200).json({ totalPoints });
  } catch (err) {
    console.error("Error in points API:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}