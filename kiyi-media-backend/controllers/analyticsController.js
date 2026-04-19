// controllers/analyticsController.js
const Stats = require('../models/Stats');
const Visitor = require('../models/Visitor');

// --- 1. ZİYARETÇİ SAYACI (IP + 24 SAAT KORUMALI) ---
exports.trackVisit = async (req, res) => {
    try {
        // Kullanıcının IP adresini al
        let ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
        
        // 24 Saat (Milisaniye cinsinden)
        const ONE_DAY = 24 * 60 * 60 * 1000;
        
        // Bu IP veritabanında var mı?
        let visitor = await Visitor.findOne({ ip: ip });

        if (visitor) {
            // Ziyaretçi daha önce gelmiş. Son ziyaretinden 24 saat geçmiş mi?
            if (Date.now() - new Date(visitor.lastVisit).getTime() > ONE_DAY) {
                // 24 saat geçmiş -> Sayacı arttır ve tarihi güncelle
                await Stats.findOneAndUpdate({}, { $inc: { totalVisitors: 1, dailyVisitors: 1 } }, { upsert: true });
                visitor.lastVisit = Date.now();
                await visitor.save();
                console.log(`📈 Tekrar Hoşgeldin (Süre Doldu): ${ip}`);
            } else {
                // 24 saat geçmemiş -> Sayma
                // console.log(`zzz Ziyaret sayılmadı (Spam Koruması): ${ip}`);
            }
        } else {
            // Ziyaretçi ilk kez geliyor -> Sayacı arttır ve IP'yi kaydet
            await Stats.findOneAndUpdate({}, { $inc: { totalVisitors: 1, dailyVisitors: 1 } }, { upsert: true });
            await Visitor.create({ ip: ip });
            console.log(`🎉 YENİ ZİYARETÇİ (Yeni IP): ${ip}`);
        }

        res.status(200).json({ success: true });
    } catch (error) {
        console.error("Sayaç Hatası:", error);
        // Hata olsa bile frontend'i bozma
        res.status(200).json({ success: false }); 
    }
};

// --- 2. ADMIN PANELİ İSTATİSTİKLERİNİ GETİR ---
exports.getDashboardStats = async (req, res) => {
    try {
        const stats = await Stats.findOne();
        res.status(200).json({ 
            success: true, 
            data: stats || { totalVisitors: 0, dailyVisitors: 0, totalProjects: 0 } 
        });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Veri çekilemedi' });
    }
};

// --- 3. HİZMET TIKLAMA (404 Hatası Vermesin Diye) ---
exports.trackServiceClick = async (req, res) => {
    // İstersen burada tıklamaları veritabanına kaydedebilirsin.
    // Şimdilik boş dönüyoruz ki hata almayasın.
    res.status(200).json({ success: true });
};