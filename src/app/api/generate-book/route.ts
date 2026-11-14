import{GoogleGenAI}from"@google/genai";
import{NextResponse}from"next/server";
const ai=new GoogleGenAI({apiKey:process.env.GEMINI_API_KEY});
export async function POST(req:Request){
try{const{grade,subject,publisher}=await req.json();
const prompt=`請依據台灣108課綱與「${publisher}」教材架構，完整編寫一份「${grade} ${subject}」整學期完整虛擬課本講義。必須包含：1. 全冊完整章節目錄（第1章至最後一章）；2. 每一章節的【核心觀念與定義】、【重要公式與定理】、【課本標準例題與詳解步驟】、【常見易錯點提醒】。請寫得詳盡、專業、結構清晰，可直接作為學生自學與AI家教引導的完整課本教材。使用繁體中文。`;
const res=await ai.models.generateContent({model:"gemini-2.5-flash",contents:prompt});
return NextResponse.json({content:res.text});
}catch(e:any){return NextResponse.json({error:e.message||"生成失敗"},{status:500})}}