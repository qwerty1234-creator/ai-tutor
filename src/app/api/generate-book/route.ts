import{NextResponse}from"next/server";
export async function POST(req:Request){
try{const{grade,subject,publisher}=await req.json();
const prompt=`請依據台灣108課綱與「${publisher}」教材架構，完整編寫一份「${grade} ${subject}」整學期完整虛擬課本講義，包含全冊章節目錄、每章核心定義、重要公式、標準例題與詳解步驟、常見易錯點提醒。使用繁體中文。`;
const r=await fetch("https://api.openai.com/v1/chat/completions",{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${(process.env.OPENAI_API_KEY||"").trim()}`},body:JSON.stringify({model:"gpt-4o-mini",messages:[{role:"user",content:prompt}]})});
const d=await r.json();if(!r.ok)throw new Error(d.error?.message||"OpenAI錯誤");
return NextResponse.json({content:d.choices[0].message.content});
}catch(e:any){return NextResponse.json({error:e.message||"生成失敗"},{status:500})}}