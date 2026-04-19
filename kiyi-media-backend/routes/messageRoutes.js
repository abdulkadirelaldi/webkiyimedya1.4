const express = require('express');
const router = express.Router();

const { getMessages, addMessage, deleteMessage } = require('../controllers/messageController');

// YENİ: RBAC Middleware ve İzinleri import et
const { protect, checkPermission } = require('../middleware/authMiddleware');
const { PERMISSIONS } = require('../config/permissions');

// --- ROTALAR ---

// 1. Mesajları Listele
// Sadece 'manage_settings' izni olanlar (Admin/Patron) görebilir
router.get('/', 
    protect, 
    checkPermission(PERMISSIONS.MANAGE_SETTINGS), 
    getMessages
);

// 2. Mesaj Gönder 
// Herkes gönderebilir (Public - İletişim Formu için)
// Buraya protect eklemiyoruz çünkü ziyaretçiler token sahibi değildir.
router.post('/', addMessage); 

// 3. Mesaj Sil
// Sadece 'manage_settings' izni olanlar (Admin/Patron) silebilir
router.delete('/:id', 
    protect, 
    checkPermission(PERMISSIONS.MANAGE_SETTINGS), 
    deleteMessage
);

module.exports = router;