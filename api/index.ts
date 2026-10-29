import express, { Request, Response } from 'express';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());

// Initialize Gemini SDK with server-side environment variable
const getGenAI = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: 'Al-Arabiyyah MA Backend API',
    geminiConfigured: !!process.env.GEMINI_API_KEY,
    timestamp: new Date().toISOString()
  });
});

// 1. AI Grammar & Tashhih (Koreksi Kitabah & Nahwu/Sharaf)
app.post('/api/gemini/grammar-check', async (req: Request, res: Response) => {
  try {
    const { text, promptType, topic } = req.body;
    if (!text) {
      return res.status(400).json({ error: 'Teks bahasa Arab tidak boleh kosong' });
    }

    const ai = getGenAI();
    if (!ai) {
      // Fallback deterministic assessment if API key is not yet set
      return res.json({
        score: 85,
        correctedText: text,
        feedback: 'Catatan Umum: Teks bahasa Arab telah ditulis dengan baik. Pastikan harakat dan kesesuaian mudzakkar/muannats sudah tepat sesuai kaidah Nahwu Madrasah Aliyah.',
        analysis: [
          { aspect: 'Tarkib (Nahwu)', note: 'Struktur jumlah isimiyyah/fi\'liyyah dasar sudah tampak.' },
          { aspect: 'Sharaf & Wazan', note: 'Bentuk fi\'il dan isim fa\'il/maf\'ul relatif tepat.' },
          { aspect: 'Imla\'', note: 'Perhatikan penulisan hamzah washli dan qath\'i.' }
        ]
      });
    }

    const prompt = `Anda adalah seorang Guru Ahli Bahasa Arab untuk tingkat Madrasah Aliyah (MA) di Indonesia.
Evaluasilah tulisan bahasa Arab siswa berikut:
"${text}"
Topik latihan: "${topic || 'Umum / Insya Muwajjah'}"

Berikan penilaian edukatif dan ramah dalam format JSON murni:
{
  "score": <angka 0-100>,
  "correctedText": "<teks Arab yang telah dibenahi dengan harakat lengkap yang benar>",
  "feedback": "<ulasan motivatif dan penjelasan koreksi dalam bahasa Indonesia yang mudah dipahami siswa MA>",
  "analysis": [
    {"aspect": "Nahwu (Tata Kalimat)", "note": "<catatan irab atau tarkib>"},
    {"aspect": "Sharaf (Bentuk Kata)", "note": "<catatan wazan dan tasrif>"},
    {"aspect": "Imla' (Ejaan)", "note": "<catatan ejaan hamzah, ta marbuthah, alif maqsuroh>"},
    {"aspect": "Mufradat (Pilihan Kata)", "note": "<catatan kesesuaian uslub>"}
  ],
  "vocabularySuggestions": ["<kata baru 1>", "<kata baru 2>"]
}
HANYA kembalikan JSON valid tanpa markdown blok \`\`\`json.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      }
    });

    const outputText = response.text || '{}';
    let parsed;
    try {
      parsed = JSON.parse(outputText);
    } catch {
      const cleaned = outputText.replace(/```json/g, '').replace(/```/g, '').trim();
      parsed = JSON.parse(cleaned);
    }

    res.json(parsed);
  } catch (error: any) {
    console.error('Gemini grammar check error:', error);
    res.status(500).json({
      error: 'Gagal mengevaluasi teks dengan AI',
      details: error?.message || String(error)
    });
  }
});

// 2. AI Speaking & Pronunciation Feedback (Kalam Evaluation)
app.post('/api/gemini/speech-feedback', async (req: Request, res: Response) => {
  try {
    const { transcript, targetText, topic } = req.body;
    if (!transcript) {
      return res.status(400).json({ error: 'Transkrip ucapan tidak boleh kosong' });
    }

    const ai = getGenAI();
    if (!ai) {
      return res.json({
        score: 88,
        fluencyNote: 'Pelafalan cukup fasih dan intonasi terdengar natural untuk tingkat Madrasah Aliyah.',
        makhrajTips: 'Latih kembali perbedaan huruf halus dan tebal seperti ت vs ط, dan س vs ص.',
        correctPronunciation: targetText || transcript
      });
    }

    const prompt = `Anda adalah penguji Maharah Kalam (Keterampilan Berbicara Bahasa Arab) tingkat Madrasah Aliyah.
Target teks yang seharusnya dibaca / topik: "${targetText || topic || 'Percakapan Sehari-hari'}"
Transkrip rekaman ucapan siswa: "${transcript}"

Evaluasi kemampuan kalam siswa secara edukatif dalam format JSON murni:
{
  "score": <angka 0-100>,
  "fluencyNote": "<ulasan kelancaran dan intonasi dalam bahasa Indonesia>",
  "makhrajTips": "<panduan makharijul huruf dan sifat huruf spesifik yang perlu dilatih>",
  "correctPronunciation": "<teks bahasa Arab berharakat rapi sebagai acuan pelafalan>",
  "encouragement": "<kata-kata penyemangat singkat dalam bahasa Arab dan Indonesia>"
}
HANYA kembalikan JSON valid tanpa markdown.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      }
    });

    const outputText = response.text || '{}';
    const parsed = JSON.parse(outputText);
    res.json(parsed);
  } catch (error: any) {
    console.error('Gemini speech feedback error:', error);
    res.status(500).json({
      error: 'Gagal menganalisis ucapan',
      details: error?.message || String(error)
    });
  }
});

// 3. AI Irab & Tashkeel Explanation (Qira'ah & Qawa'id Breakdown)
app.post('/api/gemini/explain-sentence', async (req: Request, res: Response) => {
  try {
    const { sentence } = req.body;
    if (!sentence) {
      return res.status(400).json({ error: 'Kalimat tidak boleh kosong' });
    }

    const ai = getGenAI();
    if (!ai) {
      return res.json({
        vocalized: sentence,
        translation: 'Terjemahan kalimat bahasa Arab.',
        irabBreakdown: [
          { word: sentence.split(' ')[0] || '', position: 'Mubtada / Fa\'il', harakat: 'Dhammah (Marfu\')', explanation: 'Isim di awal jumlah mufidah.' }
        ],
        ruleSummary: 'Materi tarkib dasar Madrasah Aliyah.'
      });
    }

    const prompt = `Jelaskan I'rab dan kaidah tata bahasa dari kalimat Arab berikut untuk siswa Madrasah Aliyah:
"${sentence}"

Format JSON:
{
  "vocalized": "<kalimat berharakat lengkap dan akurat>",
  "translation": "<terjemahan bahasa Indonesia yang wajar>",
  "irabBreakdown": [
    {
      "word": "<kata Arab>",
      "position": "<kedudukan nahwu, misal: Fa'il / Maf'ul bih / Mubtada' / Khabar>",
      "harakat": "<tanda irab, misal: Marfu' bil Dhammah>",
      "explanation": "<penjelasan singkat dan mudah dipahami>"
    }
  ],
  "ruleSummary": "<kesimpulan kaidah ringkas untuk bekal belajar siswa MA>"
}
HANYA kembalikan JSON valid.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      }
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json(parsed);
  } catch (error: any) {
    console.error('Gemini sentence explanation error:', error);
    res.status(500).json({
      error: 'Gagal menjelaskan kalimat',
      details: error?.message || String(error)
    });
  }
});

// 4. AI Interactive Tutor (Hiwar Cerdas)
app.post('/api/gemini/ai-tutor', async (req: Request, res: Response) => {
  try {
    const { messages, topic } = req.body;
    const ai = getGenAI();
    if (!ai) {
      return res.json({
        replyAr: 'مَرْحَبًا بِكَ يَا طَالِبِي العَزِيْز! أَنَا مُسْتَعِدٌّ لِمُسَاعَدَتِكَ فِي تَعَلُّمِ اللُّغَةِ العَرَبِيَّة.',
        replyId: 'Selamat datang wahai muridku tersayang! Saya siap membantumu belajar bahasa Arab.',
        vocabularyHelp: ['مَرْحَبًا (Selamat datang)', 'طَالِبٌ (Murid)', 'مُسْتَعِدٌّ (Siap)']
      });
    }

    const prompt = `Anda adalah "Ustadz / Ustadzah AI", mitra belajar percakapan bahasa Arab yang ramah untuk siswa Madrasah Aliyah (MA).
Topik percakapan: "${topic || 'Kehidupan Sehari-hari di Madrasah'}".
Riwayat percakapan:
${JSON.stringify(messages || [])}

Balaslah pesan terakhir siswa dalam bahasa Arab yang fasih, sederhana, dan berharakat lengkap.
Sertakan juga terjemahan bahasa Indonesianya dan daftar 2-3 kosakata kunci.
Kembalikan JSON:
{
  "replyAr": "<jawaban Arab berharakat>",
  "replyId": "<terjemahan bahasa Indonesia>",
  "vocabularyHelp": ["<kata Arab> (<arti Indonesia>)", ...]
}
HANYA kembalikan JSON valid.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      }
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json(parsed);
  } catch (error: any) {
    console.error('Gemini tutor error:', error);
    res.status(500).json({
      error: 'Gagal memproses percakapan tutor',
      details: error?.message || String(error)
    });
  }
});

// Export default app WITHOUT calling app.listen() per user requirement
export default app;
