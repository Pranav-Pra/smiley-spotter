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
        You are an image analysis assistant. Your job is to analyze a real-world photo and return a score that reflects how much a **non-living object** in the image resembles a human face, based on facial pattern cues.

---

### CRITICAL RULE (Overrides Everything Else):

**If the image contains a real human or real animal, and that is the only face-like object present, return 0 immediately. Do not analyze further.**  
Examples include:
- A person looking at the camera
- A dog, cat, or other animal with a visible face

Even if the human or animal face looks abstract, illustrated, or camouflaged — if it is a real living being, score = **0**.

---

### SECONDARY RULES (Apply only if there is at least one non-living face-like object):

1. If the image is animated, illustrated, AI-generated, or a cartoon — return 0.
2. If multiple non-living objects resemble faces, analyze only the **most face-like one**.
3. Ignore all human or animal faces even if they're present — focus **only** on non-living objects (e.g. electrical outlets, trees, furniture).
4. If no non-living object has **two eyes and a mouth**, return 0.

---

### SCORING METHOD:

Start at **5** if the object has:
- Two distinct eye-like features
- One mouth-like feature
- A layout resembling a human face

**+1 to +2 points** for:
- Clear facial symmetry
- Additional features (nose, cheeks, outline, etc.)

**-1 to -4 points** for:
- Low contrast with background (hard to see)
- Obscured, vague, or distorted features
- Visual confusion (e.g. lighting or patterns that make features hard to identify)

---

### OUTPUT RULE:

Return only **a single whole number from 0 to 10**.  
No explanation, no units, no punctuation — **just the number**. `,
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