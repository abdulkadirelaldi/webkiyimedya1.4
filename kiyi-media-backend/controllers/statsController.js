// controllers/statsController.js
const Visitor = require('../models/Visitor');

// Yardımcı Fonksiyon: Bugünün tarihini YYYY-MM-DD string'i olarak al
const getTodayString = () => {
    return new Date().toISOString().split('T')[0];
};

// @desc    Ziyaretçi kaydet ve 'Ben Buradayım' sinyali gönder
// @route   POST /api/stats/visit
exports.recordVisit = async (req, res) => {
    try {
        // Express'te IP adresini yakalama (Localhost'ta ::1 görünebilir, normaldir)
        const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
        const today = getTodayString();

        // 1. Bu IP bugün veritabanında var mı?
        let visitor = await Visitor.findOne({ ip: ip, visitDate: today });

        if (visitor) {
            // Zaten varsa, sadece son görülme zamanını güncelle (Online sayacı için)
            visitor.lastActive = Date.now();
            await visitor.save();
        } else {
            // Yoksa, bugünün tarihine yeni kayıt aç (Tekil ziyaretçi +1)
            visitor = await Visitor.create({
                ip: ip,
                visitDate: today,
                lastActive: Date.now()
            });
        }

        res.status(200).json({ success: true, message: 'Ziyaret işlendi' });

    } catch (error) {
        // "E11000 duplicate key" hatası alırsak (aynı anda istek gelirse) görmezden gel
        if (error.code === 11000) {
            return res.status(200).json({ success: true });
        }
        res.status(500).json({ success: false, error: error.message });
    }
};

// @desc    İstatistikleri Getir (Dashboard için)
// @route   GET /api/stats
exports.getStats = async (req, res) => {
    try {
        const today = getTodayString();

        // 1. Veritabanındaki GERÇEK sayı
        const realCount = await Visitor.countDocuments({ visitDate: today });

        // 2. Görünen Sayı (Gerçek Sayı + 10)
        // Eğer kimse girmemişse (0) -> 10 görünür.
        // 1 kişi girmişse -> 11 görünür.
        const dailyVisitors = realCount + 10;

        // 3. Online Kullanıcı Sayısı
        const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
        const realOnline = await Visitor.countDocuments({ 
            lastActive: { $gte: fiveMinutesAgo } 
        });

        // İstersen online sayısını da en az 1 veya 2 gösterebilirsin (Opsiyonel)
        // const onlineUsers = realOnline + 2; 
        const onlineUsers = realOnline; // Şimdilik gerçeği kalsın

        res.status(200).json({
            success: true,
            data: {
                dailyVisitors, // Frontend'e manipüle edilmiş sayıyı gönderiyoruz
                onlineUsers
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};