import type { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

type ResponseData = {
  result?: string;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { base64Image } = req.body;

    if (!base64Image) {
      return res.status(400).json({ error: 'No image provided' });
    }

    // Using the environment variable with the name you provided
    const openai = new OpenAI({
      apiKey: process.env.OPENOPENAI_API_KEY,
    });

    // Split the base64 string to remove data URL prefix if present
    const base64Data = base64Image.includes('base64,')
      ? base64Image.split('base64,')[1]
      : base64Image;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: "Analyze this image and describe what you see in detail. If there's any text visible in the image, please transcribe it." },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${base64Data}`,
              },
            },
          ],
        },
      ],
      max_tokens: 500,
    });

    const result = response.choices[0]?.message?.content || 'No analysis result';
    return res.status(200).json({ result });

  } catch (error: any) {
    console.error('Error analyzing image:', error);
    return res.status(500).json({ error: error.message || 'Failed to analyze image' });
  }
} 