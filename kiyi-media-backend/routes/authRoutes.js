const express = require('express');
const { register, login, logout, getMe, updateDetails, updatePassword } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// Resim Yükleme İçin Multer
const multer = require('multer');
const path = require('path');

// Depolama Ayarı
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/'); // Resimler bu klasöre kaydedilecek
    },
    filename: function (req, file, cb) {
        // Dosya ismini benzersiz yap (avatar-zaman-random.jpg)
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'avatar-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true);
    } else {
        cb(new Error('Lütfen sadece resim dosyası yükleyin.'), false);
    }
};

const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB Limit
});

const router = express.Router();

// --- ROTALAR ---
router.post('/register', register);
router.post('/login', login);
router.get('/logout', logout);
router.get('/me', protect, getMe);

// Profil ve Şifre Güncelleme
// 'profileImage' anahtarını frontend form-data içinde bekler
router.put('/updatedetails', protect, upload.single('profileImage'), updateDetails);
router.put('/updatepassword', protect, updatePassword);

module.exports = router;