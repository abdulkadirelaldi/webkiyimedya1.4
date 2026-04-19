const express = require('express');
const router = express.Router();
const Package = require('../models/Package');
const { protect } = require('../middleware/authMiddleware');

router.get('/', async (req, res) => {
    try {
        const pkgs = await Package.find().sort({ createdAt: -1 });
        res.json({ success: true, data: pkgs });
    } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

router.post('/', protect, async (req, res) => {
    try {
        const pkg = await Package.create(req.body);
        res.status(201).json({ success: true, data: pkg });
    } catch (e) { res.status(400).json({ success: false, error: e.message }); }
});

router.put('/:id', protect, async (req, res) => {
    try {
        const pkg = await Package.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!pkg) return res.status(404).json({ success: false, error: 'Paket bulunamadı.' });
        res.json({ success: true, data: pkg });
    } catch (e) { res.status(400).json({ success: false, error: e.message }); }
});

router.delete('/:id', protect, async (req, res) => {
    try {
        await Package.findByIdAndDelete(req.params.id);
        res.json({ success: true, data: {} });
    } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

module.exports = router;
