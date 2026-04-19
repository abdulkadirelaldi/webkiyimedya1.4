const express = require('express');
const router = express.Router();

// Controller fonksiyonlarını import et
const { 
    getAnnouncements, 
    addAnnouncement, 
    deleteAnnouncement, 
    updateAnnouncement 
} = require('../controllers/announcementController');

// YENİ: RBAC Middleware ve İzinleri import et
// (Eski 'authorize' fonksiyonu kaldırıldı)
const { protect, checkPermission } = require('../middleware/authMiddleware');
const { PERMISSIONS } = require('../config/permissions');

// --- ROTALAR ---

// 1. Duyuruları Getir (Herkes görebilir)
router.get('/', getAnnouncements);

// 2. Duyuru Ekle
// Sadece 'manage_settings' izni olanlar (Admin/Patron) yapabilir
router.post('/', 
    protect, 
    checkPermission(PERMISSIONS.MANAGE_SETTINGS), 
    addAnnouncement
);

// 3. Duyuru Sil
// Sadece 'manage_settings' izni olanlar (Admin/Patron) yapabilir
router.delete('/:id', 
    protect, 
    checkPermission(PERMISSIONS.MANAGE_SETTINGS), 
    deleteAnnouncement
);

// 4. Duyuru Güncelle
// Sadece 'manage_settings' izni olanlar (Admin/Patron) yapabilir
router.put('/:id', 
    protect, 
    checkPermission(PERMISSIONS.MANAGE_SETTINGS), 
    updateAnnouncement
);

module.exports = router;