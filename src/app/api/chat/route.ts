import{GoogleGenAI}from"@google/genai";
import{NextResponse}from"next/server";
const ai=new GoogleGenAI({apiKey:process.env.GEMINI_API_KEY});
export async function POST(req:Request){
try{const{messages,grade,publisher,subject,textbook}=await req.json();
const contents=messages.map((m:any)=>{const parts:any[]=[];if(m.image){const[meta,data]=m.image.split(",");const mimeType=meta.match(/:(.*?);/)?.[1]||"image/jpeg";parts.push({inlineData:{mimeType,data}})}if(m.text)parts.push({text:m.text});return{role:m.role==="user"?"user":"model",parts}});
const tbRule=textbook&&textbook.trim()?`\n\n【目前導入的虛擬課本/講義內容】：\n${textbook}\n\n請「優先且嚴格」依據上方【虛擬課本/講義內容】中的定義、公式、專有名詞與解題邏輯進行蘇格拉底式引導；若題目超出虛擬課本範圍，再輔以台灣108課綱該版本規範說明。`:"";
const sys=`你是一位台灣專業的一對一蘇格拉底式AI家教。目前學生年級為「${grade||"國中一年級"}」、科目為「${subject||"數學"}」、教科書版本為「${publisher||"翰林版"}」。請嚴格依照台灣108課綱與該版本章節進度引導（絕不使用超綱公式）。不直接給最終答案，先點出核心觀念與卡關點，並給出第一步引導問題。使用繁體中文回覆。${tbRule}`;
const res=await ai.models.generateContent({model:"gemini-2.5-flash",contents,config:{systemInstruction:sys}});
return NextResponse.json({reply:res.text});
}catch(e:any){return NextResponse.json({error:e.message||"AI服務暫時無法回應"},{status:500})}}