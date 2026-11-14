import{NextResponse}from"next/server";
export async function POST(req:Request){
try{const{messages,grade,publisher,subject,textbook}=await req.json();
const tbRule=textbook&&textbook.trim()?`\n\n【虛擬課本內容】：\n${textbook}\n\n請嚴格依據上方虛擬課本的定義、公式與步驟進行蘇格拉底式引導。`:"";
const sys=`你是一位台灣專業的一對一蘇格拉底式AI家教。學生年級「${grade||"國中一年級"}」、科目「${subject||"數學"}」、版本「${publisher||"翰林版"}」。嚴格依台灣108課綱與該版本進度引導，不直接給答案，先點出核心觀念與卡關點並給出第一步提示。使用繁體中文。${tbRule}`;
const oaiMsgs=[{role:"system",content:sys},...messages.map((m:any)=>{const content:any[]=[];if(m.text)content.push({type:"text",text:m.text});if(m.image)content.push({type:"image_url",image_url:{url:m.image}});return{role:m.role==="user"?"user":"assistant",content}})];
const r=await fetch("https://api.openai.com/v1/chat/completions",{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${process.env.OPENAI_API_KEY}`},body:JSON.stringify({model:"gpt-4o-mini",messages:oaiMsgs})});
const d=await r.json();if(!r.ok)throw new Error(d.error?.message||"OpenAI錯誤");
return NextResponse.json({reply:d.choices[0].message.content});
}catch(e:any){return NextResponse.json({error:e.message||"服務錯誤"},{status:500})}}