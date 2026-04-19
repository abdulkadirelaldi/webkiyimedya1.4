// controllers/messageController.js
const Message = require('../models/Message');

// --- Mesajları Getir ---
exports.getMessages = async (req, res, next) => {
    try {
        // En yeniden en eskiye sırala
        const messages = await Message.find().sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: messages.length,
            data: messages
        });
    } catch (error) {
        console.error("Mesaj Getirme Hatası:", error);
        res.status(500).json({ success: false, error: 'Mesajlar yüklenemedi.' });
    }
};

// --- Yeni Mesaj Gönder ---
exports.addMessage = async (req, res, next) => {
    try {
        const { name, email, phone, subject, message } = req.body;

        const newMessage = await Message.create({
            name,
            email,
            phone,
            subject,
            message
        });

        res.status(201).json({
            success: true,
            data: newMessage
        });
    } catch (error) {
        console.error("Mesaj Gönderme Hatası:", error);
        res.status(500).json({ success: false, error: 'Mesaj gönderilemedi.' });
    }
};

// --- Mesaj Sil ---
exports.deleteMessage = async (req, res, next) => {
    try {
        const message = await Message.findById(req.params.id);

        if (!message) {
            return res.status(404).json({ success: false, error: 'Mesaj bulunamadı' });
        }

        await message.deleteOne();

        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Silme başarısız.' });
    }
};