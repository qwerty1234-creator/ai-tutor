import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const contents = messages.map((m: any) => {
      const parts: any[] = [];
      if (m.image) {
        const [meta, data] = m.image.split(',');
        const mimeType = meta.match(/:(.*?);/)?.[1] || 'image/jpeg';
        parts.push({ inlineData: { mimeType, data } });
      }
      if (m.text) parts.push({ text: m.text });
      return { role: m.role === 'user' ? 'user' : 'model', parts };
    });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents,
      config: {
        systemInstruction: '你是一位專業的一對一蘇格拉底式 AI 家教。看到題目或手寫算式圖片時，不要直接給最終答案，而是先拆解核心概念、指出學生可能的卡關點，並給出第一步引導提示與確認問題，帶領學生自己算出答案。使用繁體中文回覆。'
      }
    });
    return NextResponse.json({ reply: response.text });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'AI 服務暫時無法回應' }, { status: 500 });
  }
}
