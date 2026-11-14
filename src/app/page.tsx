'use client';
import { useState } from 'react';

export default function Home() {
  const [messages, setMessages] = useState<{role:string;text:string;image?:string}[]>([
    { role: 'model', text: '你好！我是你的專屬 AI 一對一家教。請輸入題目，或直接上傳題目照片、手寫算式，我們一起一步步解開它！' }
  ]);
  const [input, setInput] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImage(reader.result as string);
    reader.readAsDataURL(file);
  };

  const send = async () => {
    if ((!input.trim() && !image) || loading) return;
    const next = [...messages, { role: 'user', text: input || '請幫我解析這張題目圖片', image: image || undefined }];
    setMessages(next);
    setInput('');
    setImage(null);
    setLoading(true);
    try {
      const res = await fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messages: next }) });
      const data = await res.json();
      setMessages([...next, { role: 'model', text: data.reply || ('錯誤：' + data.error) }]);
    } catch {
      setMessages([...next, { role: 'model', text: '連線發生錯誤，請稍後再試。' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col items-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col h-[88vh]">
        <header className="p-4 border-b font-bold text-lg text-slate-800 flex justify-between items-center">
          <span>AI 一對一蘇格拉底家教</span>
          <span className="text-xs font-normal text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">支援拍照辨識</span>
        </header>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[82%] rounded-2xl p-3.5 text-sm whitespace-pre-wrap leading-relaxed ${m.role === 'user' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-800'}`}>
                {m.image && <img src={m.image} alt="題目圖片" className="max-h-56 rounded-lg mb-2" />}
                {m.text}
              </div>
            </div>
          ))}
          {loading && <div className="text-xs text-slate-400">AI 家教正在思考引導步驟...</div>}
        </div>
        {image && (
          <div className="px-4 pt-2 flex items-center gap-2">
            <img src={image} alt="預覽" className="h-14 rounded border" />
            <button onClick={() => setImage(null)} className="text-xs text-red-500">移除圖片</button>
          </div>
        )}
        <div className="p-3 border-t flex gap-2 items-center">
          <label className="cursor-pointer px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-sm text-slate-700">
            📷 傳題目
            <input type="file" accept="image/*" onChange={handleFile} className="hidden" />
          </label>
          <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()} placeholder="輸入題目或你的想法..." className="flex-1 border rounded-xl px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <button onClick={send} disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 disabled:opacity-50">送出</button>
        </div>
      </div>
    </main>
  );
}
