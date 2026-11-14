import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { grade, subject, publisher } = await req.json();
    const apiKey = (process.env.OPENAI_API_KEY || "").trim();

    const prompt = `你現在是台灣「${publisher}」教科書編輯委員會的總編輯。請依據台灣108課綱與「${publisher}」現行最新課本目錄架構，編寫一本與實體課本內容、深度、題量別無二致的「${grade} ${subject}（${publisher}）」【完整全冊教科書】。

【最高編寫鐵則 — 嚴格遵守，絕不可違反】：
1. **絕對禁止任何省略、摘要或跳過**：嚴禁出現「以下略」、「以此類推」、「讀者自行練習」、「略」等字眼。整學期所有單元（第1章到最後一章，包含每章的所有小節 1-1, 1-2...）都必須 100% 完整寫出。
2. **結構與實體課本完全一致**：每一個小節都必須完整包含以下六大板塊：
   - 【一、課文概念與原理詳述】：完整講解背景引入、核心定義、公理/定理推導過程、生活情境連結（用文字完整描述圖形、表格與數線結構）。
   - 【二、重點整理與公式歸納】：條列出該節所有必考公式、性質與注意事項。
   - 【三、標準例題與逐步驟詳解】（每小節至少 3 題，涵蓋基礎、進階、素養應用題）：每題皆須附上「題目」、「解題思路分析」與「完整逐步計算/推論過程」。
   - 【四、隨堂練習與完整解答】（對應每道例題各附 1 題類題）：必須附上完整計算過程與最終答案，不可只給答案不給過程。
   - 【五、易錯觀念診斷室】：點出學生在該節最常犯的錯誤與破解方法。
   - 【六、章末自我評量與習題詳解】（每章結束時附上 5 題綜合練習題，含選擇、填充、計算/非選題，並逐題附上完整詳解）。
3. **格式與排版**：使用清晰繁體中文、標準數學/科學符號與階層標題（第X章、X-X節），確保匯出成 Word 檔後可直接當作正式課本印出上課。

現在請從目錄開始，逐章、逐節完整編寫整冊課本內容：`;

    const r = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        max_tokens: 16384,
        temperature: 0.3,
        messages: [
          {
            role: "system",
            content: "你是台灣教科書專業編審，負責產出字字完整、題題詳解、絕無任何刪減或省略的108課綱完整全冊課本。",
          },
          { role: "user", content: prompt },
        ],
      }),
    });

    const d = await r.json();
    if (!r.ok) throw new Error(d.error?.message || "OpenAI API 錯誤");

    return NextResponse.json({ content: d.choices[0].message.content });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "生成失敗" }, { status: 500 });
  }
}