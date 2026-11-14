import{GoogleGenAI}from"@google/genai";
import{NextResponse}from"next/server";
const ai=new GoogleGenAI({apiKey:process.env.GEMINI_API_KEY});
export async function POST(req:Request){
try{const{messages,grade,publisher,subject}=await req.json();
const contents=messages.map((m:any)=>{const parts:any[]=[];if(m.image){const[meta,data]=m.image.split(",");const mimeType=meta.match(/:(.*?);/)?.[1]||"image/jpeg";parts.push({inlineData:{mimeType,data}})}if(m.text)parts.push({text:m.text});return{role:m.role==="user"?"user":"model",parts}});
const sys=`你是一位台灣專業的一對一蘇格拉底式AI家教。目前學生年級為「${grade||"國中一年級"}」、科目為「${subject||"數學"}」、教科書版本為「${publisher||"翰林版"}」。你必須嚴格依照台灣108課綱以及「${publisher||"翰林版"}」課本的章節進度、課本定義、公式推導方式、專有名詞與課本標準解題步驟進行回答與引導（絕不使用未教過的超綱公式或跳躍解法）。回答時請先點出本題對應的課本核心觀念與定義，拆解學生可能的卡關點，並透過蘇格拉底式提問給予第一步引導提示，不直接給出最終答案。使用繁體中文回覆。`;
const res=await ai.models.generateContent({model:"gemini-2.5-flash",contents,config:{systemInstruction:sys}});
return NextResponse.json({reply:res.text});
}catch(e:any){return NextResponse.json({error:e.message||"AI服務暫時無法回應"},{status:500})}}