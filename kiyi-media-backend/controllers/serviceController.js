const Service = require('../models/Service');
const fs = require('fs');
const path = require('path');

const safeDeleteFile = (filePath) => {
    if (!filePath) return;
    const absolutePath = path.join(__dirname, '..', 'public', filePath);
    try {
        if (fs.existsSync(absolutePath)) fs.unlinkSync(absolutePath);
    } catch (err) {
        console.error(`Dosya silme hatası (${filePath}):`, err.message);
    }
};

exports.getServices = async (req, res) => {
    try {
        const services = await Service.find().sort({ order: 1, createdAt: -1 });
        res.status(200).json({ success: true, count: services.length, data: services });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Hizmetler yüklenemedi.' });
    }
};

exports.addService = async (req, res) => {
    try {
        const { title, description, matchKey, order } = req.body;

        let tags = [];
        if (req.body.tags) {
            tags = Array.isArray(req.body.tags) ? req.body.tags : req.body.tags.split(',').map(t => t.trim());
        }

        const image = req.file ? `/uploads/${req.file.filename}` : null;

        const service = await Service.create({
            title,
            description,
            tags,
            image,
            matchKey,
            order: order !== undefined ? Number(order) : 0
        });

        res.status(201).json({ success: true, data: service });
    } catch (error) {
        console.error('Hizmet Ekleme Hatası:', error);
        res.status(500).json({ success: false, error: error.message || 'Hizmet eklenemedi.' });
    }
};

exports.updateService = async (req, res) => {
    try {
        const service = await Service.findById(req.params.id);
        if (!service) return res.status(404).json({ success: false, error: 'Hizmet bulunamadı.' });

        const { title, description, matchKey, order } = req.body;

        if (title !== undefined) service.title = title;
        if (description !== undefined) service.description = description;
        if (matchKey !== undefined) service.matchKey = matchKey;
        if (order !== undefined) service.order = Number(order);

        if (req.body.tags !== undefined) {
            service.tags = Array.isArray(req.body.tags)
                ? req.body.tags
                : req.body.tags.split(',').map(t => t.trim());
        }

        if (req.file) {
            safeDeleteFile(service.image);
            service.image = `/uploads/${req.file.filename}`;
        }

        await service.save();
        res.status(200).json({ success: true, data: service });
    } catch (error) {
        console.error('Hizmet Güncelleme Hatası:', error);
        res.status(500).json({ success: false, error: 'Hizmet güncellenemedi.' });
    }
};

exports.deleteService = async (req, res) => {
    try {
        const service = await Service.findById(req.params.id);
        if (!service) return res.status(404).json({ success: false, error: 'Hizmet bulunamadı.' });

        safeDeleteFile(service.image);
        await service.deleteOne();

        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        console.error('Hizmet Silme Hatası:', error);
        res.status(500).json({ success: false, error: 'Hizmet silinemedi.' });
    }
};
