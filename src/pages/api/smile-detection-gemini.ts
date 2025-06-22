import type { NextApiRequest, NextApiResponse } from 'next';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");


export const config = {
  api: {
    bodyParser: {
      sizeLimit: '5mb',
    },
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {


  if (req.method !== 'POST') return res.status(405).end();

  const { imageBase64 } = req.body;

console.log("Received imageBase64:", imageBase64?.substring(0, 50));

if (!imageBase64 || !imageBase64.startsWith("data:image/")) {
  return res.status(400).json({ error: "Invalid or missing imageBase64" });
}

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent([
      {
        inlineData: {
          mimeType: "image/jpeg",
           data: imageBase64.split(",")[1],
        },
      }, 
      {
        text: `
        You are an image analysis assistant. Your job is to examine an image and rate how much one object in the image resembles a human face on a scale from 0 to 10. Follow these rules strictly:

1. If the image contains a **real person or real animal**, return a score of **0**.
2. If the image is **animated, illustrated, AI-generated**, or otherwise not a **real photo taken by a camera**, return **0**.
3. If the image contains **multiple objects** that resemble faces, rate **only the one object** that most resembles a face, and return that score from 0 to 10.
4. If the image includes a real person or animal **alongside** an object that resembles a face (e.g. electrical outlet, cloud, food), **ignore the person/animal** and rate only the **non-living object**.
5. If **nothing** in the image resembles a face-like pattern, return **0**.

### Scoring Criteria:
- 0: No face-like resemblance
- 1–3: Very minimal resemblance (e.g. two dots on a wall)
- 4–6: Moderate resemblance (e.g. cloud, burnt toast, mildly face-shaped food)
- 7–9: Strong face-like features (e.g. symmetry, eyes/nose/mouth pattern)
- 10: Extremely face-like, almost indistinguishable from a human face but not a real person or animal

Return **only a single whole number from 0 to 10**. Do not include any explanation, punctuation, units, or text — just the number. `,
      },
    ]);

    const response = await result.response.text();
    const score = parseInt(response.trim(), 10);

    res.status(200).json({ score });
  } catch (err) {
    console.error("Gemini error:", err);
    res.status(500).json({ error: "Failed to analyze image." });
  }
}