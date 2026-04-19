const Message = require('../models/Message'); // Model isminin Message olduğundan emin olacağız

// 1. Tüm Mesajları Getir (Admin için)
exports.getMessages = async (req, res) => {
    try {
        const messages = await Message.find().sort({ createdAt: -1 }); // En yeniden eskiye
        res.status(200).json({ success: true, data: messages });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// 2. Yeni Mesaj Gönder (Ziyaretçiler için)
exports.createMessage = async (req, res) => {
    try {
        // phone alanını da alıyoruz
        const { name, email, phone, subject, message } = req.body;

        // Validasyon: Sadece İsim ve Mesaj zorunlu olsun
        // (İsteğe bağlı: En azından telefon YA DA email dolu olsun kontrolü eklenebilir ama şimdilik basit tuttum)
        if (!name || !message) {
            return res.status(400).json({ success: false, error: 'Lütfen İsim ve Mesaj alanlarını doldurun.' });
        }

        const newMessage = await Message.create({
            name,
            email,
            phone, // Telefonu kaydediyoruz
            subject,
            message
        });

        res.status(201).json({ success: true, data: newMessage });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// 3. Mesaj Sil (Admin için)
exports.deleteMessage = async (req, res) => {
    try {
        await Message.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: 'Mesaj silindi.' });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};