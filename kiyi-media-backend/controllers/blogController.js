// controllers/blogController.js
const Blog = require('../models/Blog');
const fs = require('fs');
const path = require('path');
const slugify = require('slugify');

// --- Hepsini Getir ---
// --- Hepsini Getir ---
exports.getAllBlogs = async (req, res, next) => { // İsmi düzelttim: getBlogs -> getAllBlogs
    try {
        const blogs = await Blog.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: blogs.length, data: blogs });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Blog yazıları yüklenemedi.' });
    }
};

// --- Tekil Getir (Slug ile) ---
exports.getBlogBySlug = async (req, res, next) => {
    try {
        const blog = await Blog.findOne({ slug: req.params.slug });
        if (!blog) return res.status(404).json({ success: false, error: 'Yazı bulunamadı' });
        res.status(200).json({ success: true, data: blog });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Yazı getirilemedi.' });
    }
};

// --- Yeni Blog Ekle ---
exports.addBlog = async (req, res, next) => {
    try {
        const { title, content } = req.body;

        let imagePath = null;
        if (req.file) {
            imagePath = `/uploads/${req.file.filename}`;
        }

        // Slug oluşturma
        let slug = null;
        if (title) {
            slug = slugify(title, { lower: true, strict: true, locale: 'tr' });
        }

        const blog = await Blog.create({
            title,
            slug,
            content,
            image: imagePath
        });

        res.status(201).json({ success: true, data: blog });
    } catch (error) {
        console.error("Blog Ekleme Hatası:", error);
        if (error.code === 11000) {
            return res.status(400).json({ success: false, error: 'Bu başlıkta bir yazı zaten var.' });
        }
        res.status(500).json({ success: false, error: 'Blog eklenemedi.' });
    }
};

// --- Blog Güncelle ---
exports.updateBlog = async (req, res, next) => {
    try {
        let blog = await Blog.findById(req.params.id);
        if (!blog) return res.status(404).json({ success: false, error: 'Blog bulunamadı' });

        const { title, content } = req.body;

        if (title) {
            blog.title = title;
            blog.slug = slugify(title, { lower: true, strict: true, locale: 'tr' });
        }

        if (content) blog.content = content;

        // Eğer yeni resim yüklendiyse
        if (req.file) {
            // 1. Önce eski resmi güvenli şekilde sil (Safe Delete Mantığı)
            if (blog.image) {
                const oldPath = path.join(__dirname, '..', 'public', blog.image);
                try {
                    if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
                } catch (err) {
                    console.log("Eski resim zaten yok veya silinemedi, devam ediliyor.");
                }
            }
            // 2. Yeni resmi kaydet
            blog.image = `/uploads/${req.file.filename}`;
        }

        await blog.save();
        res.status(200).json({ success: true, data: blog });
    } catch (error) {
        console.error("Güncelleme Hatası:", error);
        if (error.code === 11000) {
            return res.status(400).json({ success: false, error: 'Bu başlık kullanımda.' });
        }
        res.status(500).json({ success: false, error: 'Güncelleme başarısız.' });
    }
};

// --- Blog Sil (GÜVENLİ SİLME MODU) ---
exports.deleteBlog = async (req, res, next) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) return res.status(404).json({ success: false, error: 'Blog bulunamadı' });

        // --- SAFE DELETE FONKSİYONU ---
        // Dosya fiziksel olarak yoksa bile (sildiğin public klasörü yüzünden)
        // kodun çökmesini engeller ve veritabanı kaydını siler.
        const safeDelete = (filePath) => {
            if (!filePath) return;
            const absolutePath = path.join(__dirname, '..', 'public', filePath);
            try {
                if (fs.existsSync(absolutePath)) {
                    fs.unlinkSync(absolutePath);
                }
            } catch (err) {
                console.error(`Dosya silinemedi (${filePath}):`, err.message);
                // Hata olsa bile durma, devam et.
            }
        };

        // Blog resmini silmeye çalış
        safeDelete(blog.image);

        // Veritabanı kaydını sil
        await blog.deleteOne();
        res.status(200).json({ success: true, data: {} });

    } catch (error) {
        console.error("Silme Hatası:", error);
        res.status(500).json({ success: false, error: 'Silme başarısız.' });
    }
};