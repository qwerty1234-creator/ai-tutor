import{GoogleGenAI}from"@google/genai";
import{NextResponse}from"next/server";
const ai=new GoogleGenAI({apiKey:process.env.GEMINI_API_KEY});
export async function POST(req:Request){
try{const{messages,grade,publisher,subject}=await req.json();
const contents=messages.map((m:any)=>{const parts:any[]=[];if(m.image){const[meta,data]=m.image.split(",");const mimeType=meta.match(/:(.*?);/)?.[1]||"image/jpeg";parts.push({inlineData:{mimeType,data}})}if(m.text)parts.push({text:m.text});return{role:m.role==="user"?"user":"model",parts}});
const sys=`你是一位台灣專業的一對一蘇格拉底式AI家教。目前學生年級為「${grade||"國中一年級"}」、科目為「${subject||"數學"}」、教科書版本為「${publisher||"翰林版"}」。請嚴格依據台灣108課綱與該年級、科目、版本的知識範圍進行引導（絕不使用超綱公式或觀念）。看到題目或手寫算式圖片時，不要直接給最終答案，而是先拆解核心概念、指出可能的卡關點，並給出第一步引導提示與確認問題，帶領學生自己找出答案。使用繁體中文回覆。`;
const res=await ai.models.generateContent({model:"gemini-2.5-flash",contents,config:{systemInstruction:sys}});
return NextResponse.json({reply:res.text});
}catch(e:any){return NextResponse.json({error:e.message||"AI服務暫時無法回應"},{status:500})}}