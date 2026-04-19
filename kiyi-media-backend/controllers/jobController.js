const Job = require('../models/Job');
const Notification = require('../models/Notification'); // Bildirim Modeli
const User = require('../models/User'); // Kullanıcıları çekmek için

// --- YARDIMCI: Bildirim Oluştur ve Logla ---
// Gerçek SMS/WhatsApp entegrasyonu için buraya Twilio kodu eklenecek
const createNotification = async (recipientId, message, type, link) => {
    try {
        await Notification.create({
            recipient: recipientId, // null ise herkese
            message,
            type,
            link
        });
        
        // --- BURASI SMS/WHATSAPP ENTEGRASYON YERİ ---
        // Eğer recipientId null ise (tüm ekip), User.find() ile herkesin telefonunu çekip döngüye sokacağız.
        // Şimdilik sadece konsola basıyoruz.
        console.log(`[BİLDİRİM - ${type}] -> ${recipientId ? recipientId : 'TÜM EKİP'}: ${message}`);
        
    } catch (error) {
        console.error("Bildirim oluşturulamadı:", error);
    }
};

exports.getJobsByPortfolio = async (req, res) => {
    try {
        const jobs = await Job.find({ portfolioId: req.params.portfolioId }).sort({ createdAt: 1 });
        res.status(200).json({ success: true, data: jobs });
    } catch (error) {
        res.status(500).json({ success: false, error: 'İşler yüklenemedi.' });
    }
};

exports.addJob = async (req, res) => {
    try {
        const job = await Job.create(req.body);

        // --- BİLDİRİM TETİKLEME ---
        
        // SENARYO 1: EKİP NOTU (Category: 'Not')
        if (job.category === 'Not') {
            const senderName = job.title; // Frontend'den notu yazan kişinin ismi title olarak geliyor
            await createNotification(
                null, // null = Tüm Ekip
                `📢 Yeni Ekip Notu (${senderName}): ${job.description.substring(0, 50)}...`,
                'team_note',
                '/admin/dashboard'
            );
        }
        // SENARYO 2: YENİ İŞ ATANDI
        else {
            // "Sorumlu Kişi" description içinde [Ahmet] formatında ise veya assignedTo alanı varsa
            // Şimdilik admin ve editorlere genel bildirim atalım
            await createNotification(
                null, 
                `🆕 Yeni İş Eklendi: ${job.title}`, 
                'new_job',
                '/admin/dashboard'
            );
        }

        res.status(201).json({ success: true, data: job });
    } catch (error) {
        res.status(400).json({ success: false, error: 'Görev eklenemedi.' });
    }
};

exports.updateJob = async (req, res) => {
    try {
        const job = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });

        // SENARYO 3: REVİZE GELDİ
        if (req.body.category === 'Revize') {
             await createNotification(
                null,
                `⚠️ DİKKAT: "${job.title}" işi için revize geldi!`,
                'revision',
                '/admin/dashboard'
            );
        }

        res.status(200).json({ success: true, data: job });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Güncelleme hatası.' });
    }
};

exports.deleteJob = async (req, res) => {
    try {
        await Job.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Silme hatası.' });
    }
};

exports.getAllJobs = async (req, res) => {
    try {
        const jobs = await Job.find().populate('portfolioId', 'title logo').sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: jobs });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Hata oluştu' });
    }
};