// controllers/announcementController.js
const Announcement = require('../models/Announcement');

// --- Duyuruları Getir ---
exports.getAnnouncements = async (req, res, next) => {
    try {
        // En yeniden en eskiye sırala
        const announcements = await Announcement.find().sort({ createdAt: -1 });
        
        res.status(200).json({
            success: true,
            count: announcements.length,
            data: announcements
        });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Duyurular yüklenemedi.' });
    }
};

// --- Yeni Duyuru Ekle ---
exports.addAnnouncement = async (req, res, next) => {
    try {
        const announcement = await Announcement.create(req.body);

        res.status(201).json({
            success: true,
            data: announcement
        });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Duyuru eklenemedi.' });
    }
};

// --- Duyuru Sil ---
exports.deleteAnnouncement = async (req, res, next) => {
    try {
        const announcement = await Announcement.findById(req.params.id);

        if (!announcement) {
            return res.status(404).json({ success: false, error: 'Duyuru bulunamadı' });
        }

        await announcement.deleteOne();

        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Silme işlemi başarısız.' });
    }
};

// --- Duyuru Güncelle (YENİ) ---
exports.updateAnnouncement = async (req, res, next) => {
    try {
        let announcement = await Announcement.findById(req.params.id);

        if (!announcement) {
            return res.status(404).json({ success: false, error: 'Duyuru bulunamadı' });
        }

        announcement = await Announcement.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({ success: true, data: announcement });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Güncelleme başarısız.' });
    }
};