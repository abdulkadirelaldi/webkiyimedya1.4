const express = require('express');
const router = express.Router();
const { getCustomers, addCustomer, deleteCustomer } = require('../controllers/customerController');

// YENİ: RBAC Middleware ve İzinleri import et
const { protect, checkPermission } = require('../middleware/authMiddleware');
const { PERMISSIONS } = require('../config/permissions');

// --- MULTER AYARLARI (Resim Yükleme) ---
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/'); 
    },
    filename: function (req, file, cb) {
        // Dosya adı çakışmasını önlemek için tarih ve temizlenmiş isim ekliyoruz
        const safeName = file.originalname.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9.\-_]/g, '');
        cb(null, 'customer-' + Date.now() + '-' + safeName);
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
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB Limit (Opsiyonel güvenlik)
});

// --- ROTALAR ---

// 1. Müşterileri/Referansları Getir (Herkes görebilir)
router.get('/', getCustomers);

// 2. Müşteri Ekle
// Sadece 'manage_settings' yetkisi olanlar (Admin/Patron) yapabilir
router.post('/', 
    protect, 
    checkPermission(PERMISSIONS.MANAGE_SETTINGS), 
    upload.single('logo'), 
    addCustomer
);

// 3. Müşteri Sil
// Sadece 'manage_settings' yetkisi olanlar (Admin/Patron) yapabilir
router.delete('/:id', 
    protect, 
    checkPermission(PERMISSIONS.MANAGE_SETTINGS), 
    deleteCustomer
);

module.exports = router;