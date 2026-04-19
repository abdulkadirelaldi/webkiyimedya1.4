const express = require('express');
const router = express.Router();
const { getPortfolios, addPortfolio, deletePortfolio, updatePortfolio, getPortfolioById } = require('../controllers/portfolioController');
const multer = require('multer');
const path = require('path');

// YENİ: RBAC Middleware ve İzinleri import et
const { protect, checkPermission } = require('../middleware/authMiddleware');
const { PERMISSIONS } = require('../config/permissions');
const cache = require('../middleware/cacheMiddleware'); // EKLENDİ

// --- MULTER AYARLARI ---
const storage = multer.diskStorage({
    destination: function (req, file, cb) { cb(null, 'public/uploads/'); },
    filename: function (req, file, cb) { cb(null, 'project-' + Date.now() + path.extname(file.originalname)); }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 2 * 1024 * 1024 * 1024 // 2GB Limit (Video için)
    }
});

const uploadFields = upload.fields([
    { name: 'logo', maxCount: 1 },
    { name: 'portray', maxCount: 1 },
    { name: 'gallery', maxCount: 20 },
    { name: 'video', maxCount: 10 },
    { name: 'pdf', maxCount: 5 }
]);

// --- ROTALAR ---

// 1. Portföyleri Listele (Herkes görebilir)
router.get('/', getPortfolios);

// 2. Portföy Ekle
// İzin: create_project (Admin ve Editor yapabilir)
router.post('/',
    protect,
    checkPermission(PERMISSIONS.CREATE_PROJECT),
    uploadFields,
    addPortfolio
);

// 3. Portföy Sil
// İzin: delete_project (Sadece Admin yapabilir)
router.delete('/:id',
    protect,
    checkPermission(PERMISSIONS.DELETE_PROJECT),
    deletePortfolio
);

// 4. Portföy Güncelle
// İzin: update_project (Admin ve Editor yapabilir)
router.put('/:id',
    protect,
    checkPermission(PERMISSIONS.UPDATE_PROJECT),
    uploadFields,
    updatePortfolio
);

module.exports = router;