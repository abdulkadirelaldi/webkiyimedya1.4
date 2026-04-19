const express = require('express');
const router = express.Router();
const { getAllBlogs, getBlogBySlug, addBlog, updateBlog, deleteBlog } = require('../controllers/blogController');
const multer = require('multer');
const path = require('path');

// YENİ: RBAC Middleware ve İzinleri import et
const { protect, checkPermission } = require('../middleware/authMiddleware');
const { PERMISSIONS } = require('../config/permissions');
const cache = require('../middleware/cacheMiddleware'); // EKLENDİ

// --- MULTER AYARLARI ---
const storage = multer.diskStorage({
    destination: function (req, file, cb) { cb(null, 'public/uploads/'); },
    filename: function (req, file, cb) {
        // Türkçe karakter ve boşluk temizliği
        const safeName = file.originalname.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9.\-_]/g, '');
        cb(null, 'blog-' + Date.now() + '-' + safeName);
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB Limit
});

// --- ROTALAR ---

// 1. Blogları Listele (Herkes görebilir)
router.get('/', cache(3600), getAllBlogs);

// 2. Tekil Blog (Slug)
router.get('/:slug', cache(3600), getBlogBySlug);

// 2. Blog Ekle
// Sadece 'manage_settings' izni olanlar (Admin/Patron) yapabilir
router.post('/',
    protect,
    checkPermission(PERMISSIONS.MANAGE_SETTINGS),
    upload.single('image'),
    addBlog
);

// 3. Blog Güncelle
// Sadece 'manage_settings' izni olanlar (Admin/Patron) yapabilir
router.put('/:id',
    protect,
    checkPermission(PERMISSIONS.MANAGE_SETTINGS),
    upload.single('image'),
    updateBlog
);

// 4. Blog Sil
// Sadece 'manage_settings' izni olanlar (Admin/Patron) yapabilir
router.delete('/:id',
    protect,
    checkPermission(PERMISSIONS.MANAGE_SETTINGS),
    deleteBlog
);

module.exports = router;