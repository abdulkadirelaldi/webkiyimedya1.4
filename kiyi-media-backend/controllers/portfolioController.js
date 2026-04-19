const Portfolio = require('../models/Portfolio');
const slugify = require('slugify');
const fs = require('fs');
const path = require('path');

// --- Hepsini Getir ---
exports.getPortfolios = async (req, res, next) => {
    try {
        const filter = req.query.featured === 'true' ? { featured: true } : {};
        const portfolios = await Portfolio.find(filter).sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: portfolios.length, data: portfolios });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Projeler yüklenemedi.' });
    }
};

// --- Tekil Getir ---
exports.getPortfolioById = async (req, res, next) => {
    try {
        const portfolio = await Portfolio.findById(req.params.id);
        if (!portfolio) return res.status(404).json({ success: false, error: 'Proje bulunamadı' });
        res.status(200).json({ success: true, data: portfolio });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Proje getirilemedi.' });
    }
};

// --- Yeni Ekle ---
exports.addPortfolio = async (req, res, next) => {
    try {
        // clientName ve status alanlarını da alıyoruz (Kanban için gerekli)
        const { title, description, projectUrl, clientName, status } = req.body;

        // Kategoriler
        let categories = [];
        if (req.body.category) {
            categories = Array.isArray(req.body.category) ? req.body.category : req.body.category.split(',');
        }

        // Dosyalar
        const files = req.files || {};
        const logo = files['logo'] ? `/uploads/${files['logo'][0].filename}` : null;
        const portray = files['portray'] ? `/uploads/${files['portray'][0].filename}` : null;
        const gallery = files['gallery'] ? files['gallery'].map(f => `/uploads/${f.filename}`) : [];
        const videos = files['video'] ? files['video'].map(f => `/uploads/${f.filename}`) : [];
        const pdfs = files['pdf'] ? files['pdf'].map(f => `/uploads/${f.filename}`) : [];

        // --- SLUG OLUŞTURMA ---
        let slug = null;
        if (title) {
            slug = slugify(title, { lower: true, strict: true, locale: 'tr' });
        }

        const portfolio = await Portfolio.create({
            title,
            clientName: clientName || title, // Eğer müşteri adı girilmezse başlığı kullan
            status: status || 'Yapılacak',   // Varsayılan durum
            slug,
            category: categories,
            description: description || "Açıklama girilmedi.",
            projectUrl,
            logo,
            portray,
            gallery,
            video: videos,
            pdf: pdfs
        });

        res.status(201).json({ success: true, data: portfolio });

    } catch (error) {
        console.error("Proje Ekleme Hatası:", error);
        if (error.code === 11000) return res.status(400).json({ success: false, error: 'Bu proje adı zaten var.' });
        res.status(500).json({ success: false, error: 'Proje eklenemedi.' });
    }
};

// --- Güncelle ---
exports.updatePortfolio = async (req, res, next) => {
    try {
        let portfolio = await Portfolio.findById(req.params.id);
        if (!portfolio) return res.status(404).json({ success: false, error: 'Proje bulunamadı' });

        const { title, description, projectUrl, clientName, status, featured } = req.body;

        if (title) {
            portfolio.title = title;
            portfolio.slug = slugify(title, { lower: true, strict: true, locale: 'tr' });
        }

        if (featured !== undefined) portfolio.featured = featured === 'true' || featured === true;

        // Kanban alanlarını güncelle
        if (clientName) portfolio.clientName = clientName;
        if (status) portfolio.status = status;

        if (description) portfolio.description = description;
        if (projectUrl) portfolio.projectUrl = projectUrl;

        if (req.body.category) {
            portfolio.category = Array.isArray(req.body.category) ? req.body.category : req.body.category.split(',');
        }

        const files = req.files || {};
        // Eğer yeni dosya geldiyse eskisini değiştirebiliriz (Gelişmiş versiyonda eskisi silinebilir)
        if (files['logo']) portfolio.logo = `/uploads/${files['logo'][0].filename}`;
        if (files['portray']) portfolio.portray = `/uploads/${files['portray'][0].filename}`;

        // Galeri ve Video için ekleme mantığı (Mevcutların üzerine yazar)
        if (files['gallery']) portfolio.gallery = files['gallery'].map(f => `/uploads/${f.filename}`);
        if (files['video']) portfolio.video = files['video'].map(f => `/uploads/${f.filename}`);

        await portfolio.save();
        res.status(200).json({ success: true, data: portfolio });
    } catch (error) {
        if (error.code === 11000) return res.status(400).json({ success: false, error: 'Bu proje adı zaten var.' });
        res.status(500).json({ success: false, error: 'Güncelleme başarısız.' });
    }
};

// --- SİLME FONKSİYONU (GÜVENLİ MOD - CRASH ENGELLEYİCİ) ---
exports.deletePortfolio = async (req, res, next) => {
    try {
        const portfolio = await Portfolio.findById(req.params.id);
        if (!portfolio) {
            return res.status(404).json({ success: false, error: 'Proje bulunamadı' });
        }

        // Yardımcı Fonksiyon: Dosya varsa sil, yoksa hata verme devam et
        const safeDelete = (filePath) => {
            if (!filePath) return;
            // Veritabanındaki URL'i (/uploads/...) fiziksel yola çevir
            const absolutePath = path.join(__dirname, '..', 'public', filePath);

            try {
                if (fs.existsSync(absolutePath)) {
                    fs.unlinkSync(absolutePath);
                }
            } catch (err) {
                console.error(`Dosya silme hatası (${filePath}):`, err.message);
                // Dosya bulunamasa bile durma, devam et
            }
        };

        // Bağlı tüm dosyaları güvenli şekilde sil
        safeDelete(portfolio.logo);
        safeDelete(portfolio.portray);

        if (portfolio.gallery && portfolio.gallery.length > 0) {
            portfolio.gallery.forEach(img => safeDelete(img));
        }

        if (portfolio.video && portfolio.video.length > 0) {
            portfolio.video.forEach(vid => safeDelete(vid));
        }

        // Veritabanı kaydını sil
        await portfolio.deleteOne();

        res.status(200).json({ success: true, data: {} });

    } catch (error) {
        console.error("Silme İşlemi Hatası:", error);
        res.status(500).json({ success: false, error: 'Silme işlemi başarısız oldu.' });
    }
};

// --- Sadece Durum Güncelle (Frontend Sürükle-Bırak İçin Hızlı API) ---
exports.updateStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const portfolio = await Portfolio.findByIdAndUpdate(req.params.id, { status }, { new: true });
        res.status(200).json({ success: true, data: portfolio });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Durum güncellenemedi.' });
    }
};