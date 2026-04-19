const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Gemini İstemci Yapılandırması
// NOT: .env dosyasında GEMINI_API_KEY tanımlı olmalıdır.
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const SYSTEM_PROMPT = `
1. KİMLİK VE ROL
Sen, "Kıyı Medya" web sitesinin yapay zeka asistanısın. Adın "Kıyı Asistan". Amacın, site ziyaretçilerine haberleri bulmalarında yardımcı olmak, içerikleri özetlemek, site içi navigasyonu kolaylaştırmak ve okuyucularla samimi ama profesyonel bir bağ kurmaktır. Sen bir gazeteci titizliğiyle çalışır, ancak bir rehber samimiyetiyle konuşursun.

2. TON VE ÜSLUP
Profesyonel ve Güvenilir: Medya etiğine uygun, net ve anlaşılır bir Türkçe kullan.
Yerel ve Samimi: Bölge halkına hitap eden sıcak bir dil kullan, ancak laubali olma.
Yardımsever: Kullanıcının sorusunu en kısa ve en doğru yoldan çözmeye odaklan.
Objektif: Haberlerle ilgili sorularda yorum katmadan, sadece var olan bilgiyi aktar.

3. GÖREVLERİN
İçerik Bulma: Kullanıcı belirli bir konuda haber aradığında, en güncel ve alakalı içerikleri bul ve özetle.
Yönlendirme: Kullanıcı reklam vermek, basın bülteni göndermek veya editörle görüşmek isterse, onları "İletişim" veya "Reklam" sayfasına/mail adresine yönlendir.
Özetleme: Uzun bir makale veya haber hakkında soru sorulursa, okuyucu için ana fikri özetle.
Site Rehberliği: Hava durumu, nöbetçi eczaneler veya etkinlik takvimi gibi özel bölümlere hızlı erişim sağla.

4. KISITLAMALAR VE KURALLAR (ÇOK ÖNEMLİ)
Link Uydurma: Asla var olmayan bir URL (link) paylaşma. 
Siyasi Tarafsızlık: Politik konularda taraf tutma, sadece haberi aktar.
Rakip Analizi: Başka haber sitelerinden veya rakiplerden bahsetme, kullanıcıyı site içinde tut.
Bilgi Yoksa: Eğer sorulan soru hakkında sitende bir bilgi yoksa, dürüstçe "Şu an bu konuda sitemizde bir haber bulunmuyor ancak editörlerimize bu konuyu iletebilirim," de.
`;

// @route   POST /api/chat
// @desc    Chatbot ile konuş (Google Gemini Base)
// @access  Public
router.post('/', async (req, res) => {
    try {
        const { message, history } = req.body;

        if (!message) {
            return res.status(400).json({ success: false, error: 'Mesaj boş olamaz.' });
        }

        // Gemini Modeli Seçimi
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        // Gemini Chat History Formatı
        // history = [{ role: "user", parts: "..." }, { role: "model", parts: "..." }]
        let chatHistory = [];

        // İlk Mesaj Olarak Sistemi Tanıt (Context Injection)
        // Gemini Pro'da system prompt'u ilk user mesajının başına eklemek etkili bir yöntemdir.

        let promptToSend = message;

        if (history && Array.isArray(history) && history.length > 0) {
            // Frontend'den gelen format: { role: 'user' | 'assistant', content: '...' }
            // Gemini formatına çevir: { role: 'user' | 'model', parts: [{ text: '...' }] }

            chatHistory = history.map(msg => ({
                role: msg.role === 'user' ? 'user' : 'model',
                parts: [{ text: msg.content }]
            }));

            // System prompt'u history'nin en başına user rolüyle "Instruction" olarak ekleyebiliriz
            // Veya chat oturumu başlatırken history'ye ekleyebiliriz.
            // Ancak en garantisi, her turun başında sisteme kim olduğunu hatırlatmaktır veya
            // Context'i ilk mesaja gömmektir.

            // Yöntem: History varsa, history'yi başlat.
            // System prompt'u "Pre-instruction" olarak history'nin başına eklemiyoruz çünkü
            // Gemini history'de user/model sırasını katı ister.
        }



        // Gemini History Validation Fix
        // System initialization ends with "model". Next message MUST be "user".
        // Frontend often sends initial "assistant" (model) welcome message.
        if (chatHistory.length > 0 && chatHistory[0].role === 'model') {
            // Remove the first message if it is from the model to maintain the turn order
            console.log("Fixing History Sequence: Removing initial model message.");
            chatHistory.shift();
        }

        // --- Double Check for Alternating Roles ---
        // Gemini strict alternating User/Model check
        // If we still have issues, we might need to filter more aggressively.
        // For now, removing the initial welcome message usually solves it.

        // Chat Oturumunu Başlat
        const chat = model.startChat({
            history: [
                {
                    role: "user",
                    parts: [{ text: `SYSTEM INSTRUCTIONS:\n${SYSTEM_PROMPT}\n\nCONFIRM YOU UNDERSTAND.` }],
                },
                {
                    role: "model",
                    parts: [{ text: "Anlaşıldı. Ben Kıyı Asistanım, Kıyı Medya web sitesinin yapay zeka asistanıyım. Ziyaretçilere haber bulma, özetleme ve site içi yönlendirme konularında yardımcı olmaya hazırım." }],
                },
                ...chatHistory
            ],
            generationConfig: {
                maxOutputTokens: 500,
            },
        });

        const result = await chat.sendMessage(message);
        const response = await result.response;
        const text = response.text();

        res.status(200).json({
            success: true,
            reply: text
        });

    } catch (error) {
        console.error('Gemini API Hatası:', error);
        res.status(500).json({
            success: false,
            error: 'Asistan şu an yanıt veremiyor. Lütfen daha sonra tekrar deneyin.',
            details: error.message
        });
    }
});

module.exports = router;
