const CustomerCard = require('../models/CustomerCard');

// GET /api/customer-cards  — tümü (patron/yonetici/stajyer)
exports.getAll = async (req, res) => {
    try {
        const cards = await CustomerCard.find().sort({ createdAt: -1 }).populate('userId', 'name email');
        res.json({ success: true, data: cards });
    } catch (e) {
        res.status(500).json({ success: false, error: 'Kartlar yüklenemedi.' });
    }
};

// GET /api/customer-cards/me  — müşteri kendi kartını görür
exports.getMyCard = async (req, res) => {
    try {
        const card = await CustomerCard.findOne({ userId: req.user._id });
        if (!card) return res.status(404).json({ success: false, error: 'Kartınız bulunamadı.' });
        res.json({ success: true, data: card });
    } catch (e) {
        res.status(500).json({ success: false, error: 'Kart yüklenemedi.' });
    }
};

// GET /api/customer-cards/:id
exports.getById = async (req, res) => {
    try {
        const card = await CustomerCard.findById(req.params.id).populate('userId', 'name email');
        if (!card) return res.status(404).json({ success: false, error: 'Kart bulunamadı.' });
        res.json({ success: true, data: card });
    } catch (e) {
        res.status(500).json({ success: false, error: 'Kart yüklenemedi.' });
    }
};

const sanitize = (body) => {
    const data = { ...body };
    if (!data.userId) data.userId = null;
    if (!data.packageRef) data.packageRef = null;
    if (Array.isArray(data.kanban)) {
        data.kanban = data.kanban.map(task => ({
            ...task,
            assignees: (task.assignees || []).filter(id => id && String(id).length === 24)
        }));
    }
    return data;
};

// POST /api/customer-cards
exports.create = async (req, res) => {
    try {
        const card = await CustomerCard.create(sanitize(req.body));
        res.status(201).json({ success: true, data: card });
    } catch (e) {
        res.status(400).json({ success: false, error: e.message });
    }
};

// PUT /api/customer-cards/:id  — tam güncelleme
exports.update = async (req, res) => {
    try {
        const card = await CustomerCard.findByIdAndUpdate(req.params.id, sanitize(req.body), { new: true, runValidators: true });
        if (!card) return res.status(404).json({ success: false, error: 'Kart bulunamadı.' });
        res.json({ success: true, data: card });
    } catch (e) {
        res.status(400).json({ success: false, error: e.message });
    }
};

// DELETE /api/customer-cards/:id
exports.remove = async (req, res) => {
    try {
        const card = await CustomerCard.findByIdAndDelete(req.params.id);
        if (!card) return res.status(404).json({ success: false, error: 'Kart bulunamadı.' });
        res.json({ success: true, data: {} });
    } catch (e) {
        res.status(500).json({ success: false, error: 'Silinemedi.' });
    }
};
