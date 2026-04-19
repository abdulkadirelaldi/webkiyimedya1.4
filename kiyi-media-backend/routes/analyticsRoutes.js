// routes/analyticsRoutes.js
const express = require('express');
const router = express.Router();

// Controller'dan fonksiyonları süslü parantez ile çekiyoruz
const { 
    trackVisit, 
    getDashboardStats, 
    trackServiceClick 
} = require('../controllers/analyticsController');

// --- ROTALAR ---

// 1. Ziyaretçi Sayacı
// Eğer trackVisit fonksiyonu yoksa 'handler must be a function' hatası verir.
router.post('/visit', trackVisit);

// 2. Admin Paneli İstatistikleri
router.get('/dashboard', getDashboardStats);

// 3. Hizmet Tıklama
router.post('/service-click', trackServiceClick);

module.exports = router;