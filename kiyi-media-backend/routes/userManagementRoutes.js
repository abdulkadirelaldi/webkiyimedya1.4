const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');
const {
    getUsers,
    createUser,
    updateUser,
    deleteUser,
    getUserPanel
} = require('../controllers/userManagementController');

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'public/uploads/'),
    filename: (req, file, cb) => cb(null, `avatar-${req.params.id}-${Date.now()}${path.extname(file.originalname)}`)
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 }, fileFilter: (req, file, cb) => {
    cb(null, /image\/(jpeg|jpg|png|gif|webp)/.test(file.mimetype));
}});

router.get('/', getUsers);
router.post('/', createUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);
router.get('/:id/panel', getUserPanel);

router.post('/:id/profile-image', upload.single('avatar'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ success: false, error: 'Dosya yüklenmedi.' });
        const User = require('../models/User');
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { profileImage: `/uploads/${req.file.filename}` },
            { new: true }
        ).select('-password');
        if (!user) return res.status(404).json({ success: false, error: 'Kullanıcı bulunamadı.' });
        res.json({ success: true, data: user });
    } catch (e) {
        res.status(500).json({ success: false, error: e.message });
    }
});

module.exports = router;
