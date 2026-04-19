const express = require('express');
const { recordVisit, getStats } = require('../controllers/statsController');

// YENİ: RBAC Middleware ve İzinleri import et
const { protect, checkPermission } = require('../middleware/authMiddleware');
const { PERMISSIONS } = require('../config/permissions');

const router = express.Router();

// --- ROTALAR ---

// 1. Ziyaret Kaydet (Public)
// Siteye giren herkes (ziyaretçi) buraya istek atar. Token yok, koruma yok.
router.post('/visit', recordVisit);

// 2. İstatistikleri Getir (Private)
// Bu veriler iş zekası verisidir, sadece yetkili personel görmelidir.
// 'view_all_projects' izni Viewer, Editor ve Admin'de vardır.
router.get('/', 
    protect, 
    checkPermission(PERMISSIONS.VIEW_ALL_PROJECTS), 
    getStats
);

module.exports = router;