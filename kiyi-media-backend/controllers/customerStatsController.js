const CustomerStats = require('../models/CustomerStats');

exports.getCustomerStats = async (req, res) => {
    try {
        const stats = await CustomerStats.findOne({ userId: req.params.userId });
        if (!stats) return res.status(404).json({ success: false, message: 'İstatistik bulunamadı.' });
        res.status(200).json({ success: true, data: stats });
    } catch (error) {
        res.status(500).json({ success: false, message: 'İstatistikler getirilemedi.', error: error.message });
    }
};

exports.updateCustomerStats = async (req, res) => {
    try {
        const stats = await CustomerStats.findOneAndUpdate(
            { userId: req.params.userId },
            { ...req.body, userId: req.params.userId },
            { new: true, upsert: true, runValidators: true }
        );
        res.status(200).json({ success: true, data: stats });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Güncelleme başarısız.', error: error.message });
    }
};

exports.addSocialMonth = async (req, res) => {
    try {
        const { month, posts, stories, reels, publishDates } = req.body;
        let stats = await CustomerStats.findOne({ userId: req.params.userId });

        if (!stats) {
            stats = await CustomerStats.create({ userId: req.params.userId });
        }

        const existingIndex = stats.socialMedia.findIndex(s => s.month === month);
        if (existingIndex > -1) {
            stats.socialMedia[existingIndex] = { month, posts, stories, reels, publishDates };
        } else {
            stats.socialMedia.push({ month, posts, stories, reels, publishDates });
        }

        await stats.save();
        res.status(200).json({ success: true, data: stats.socialMedia });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Sosyal medya verisi eklenemedi.', error: error.message });
    }
};

exports.addAdSpending = async (req, res) => {
    try {
        let stats = await CustomerStats.findOne({ userId: req.params.userId });
        if (!stats) stats = await CustomerStats.create({ userId: req.params.userId });

        stats.adSpending.push(req.body);
        await stats.save();
        res.status(201).json({ success: true, data: stats.adSpending });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Reklam kaydı eklenemedi.', error: error.message });
    }
};

exports.deleteAdSpending = async (req, res) => {
    try {
        const stats = await CustomerStats.findOne({ userId: req.params.userId });
        if (!stats) return res.status(404).json({ success: false, message: 'İstatistik bulunamadı.' });

        stats.adSpending.pull({ _id: req.params.adId });
        await stats.save();
        res.status(200).json({ success: true, data: stats.adSpending });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Reklam silinemedi.', error: error.message });
    }
};

exports.addDriveLink = async (req, res) => {
    try {
        let stats = await CustomerStats.findOne({ userId: req.params.userId });
        if (!stats) stats = await CustomerStats.create({ userId: req.params.userId });

        stats.driveLinks.push(req.body);
        await stats.save();
        res.status(201).json({ success: true, data: stats.driveLinks });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Drive linki eklenemedi.', error: error.message });
    }
};

exports.deleteDriveLink = async (req, res) => {
    try {
        const stats = await CustomerStats.findOne({ userId: req.params.userId });
        if (!stats) return res.status(404).json({ success: false, message: 'İstatistik bulunamadı.' });

        stats.driveLinks.pull({ _id: req.params.linkId });
        await stats.save();
        res.status(200).json({ success: true, data: stats.driveLinks });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Drive linki silinemedi.', error: error.message });
    }
};
