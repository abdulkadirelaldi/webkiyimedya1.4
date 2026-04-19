const User = require('../models/User');
const CustomerStats = require('../models/CustomerStats');
const CustomerJobPlan = require('../models/CustomerJobPlan');
const bcrypt = require('bcryptjs');

exports.getUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password').sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: users.length, data: users });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Kullanıcılar getirilemedi.', error: error.message });
    }
};

exports.createUser = async (req, res) => {
    try {
        const { name, email, password, role, department, phone } = req.body;

        const existing = await User.findOne({ email });
        if (existing) return res.status(400).json({ success: false, message: 'Bu e-posta zaten kayıtlı.' });

        const user = await User.create({ name, email, password, role, department, phone });
        const userObj = user.toObject();
        delete userObj.password;

        res.status(201).json({ success: true, data: userObj });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Kullanıcı oluşturulamadı.', error: error.message });
    }
};

exports.updateUser = async (req, res) => {
    try {
        const { password, ...updateData } = req.body;

        if (password) {
            const salt = await bcrypt.genSalt(10);
            updateData.password = await bcrypt.hash(password, salt);
        }

        const user = await User.findByIdAndUpdate(req.params.id, updateData, {
            new: true,
            runValidators: true
        }).select('-password');

        if (!user) return res.status(404).json({ success: false, message: 'Kullanıcı bulunamadı.' });
        res.status(200).json({ success: true, data: user });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Kullanıcı güncellenemedi.', error: error.message });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ success: false, message: 'Kullanıcı bulunamadı.' });
        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Kullanıcı silinemedi.', error: error.message });
    }
};

exports.getUserPanel = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) return res.status(404).json({ success: false, message: 'Kullanıcı bulunamadı.' });

        let panelData = null;

        if (user.role === 'musteri') {
            panelData = await CustomerStats.findOne({ userId: user._id });
        } else if (user.role === 'stajyer') {
            panelData = await CustomerJobPlan.find({ assignedTo: user._id })
                .populate('customerId', 'name email avatar');
        }

        res.status(200).json({ success: true, data: { user, panelData } });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Panel verisi getirilemedi.', error: error.message });
    }
};
