const express = require('express');
const router = express.Router();
const Blog = require('../models/Blog');
const Portfolio = require('../models/Portfolio');

// Sitemap herkese açık olmalıdır (SEO için), bu yüzden 'protect' middleware'i EKLEMİYORUZ.
router.get('/', async (req, res) => {
    try {
        // Canlı site adresini .env dosyasından al, yoksa manuel yazılanı kullan
        const baseUrl = process.env.CLIENT_URL || 'https://www.kiyimedya.com'; 

        const urls = [];

        // 1. Sabit Sayfalar
        urls.push({ url: '/', changefreq: 'daily', priority: 1.0 });
        urls.push({ url: '/services', changefreq: 'weekly', priority: 0.8 });
        urls.push({ url: '/portfolio', changefreq: 'weekly', priority: 0.8 });
        urls.push({ url: '/blog', changefreq: 'weekly', priority: 0.8 });
        urls.push({ url: '/contact', changefreq: 'monthly', priority: 0.5 });

        // 2. Dinamik Blog Yazıları
        const blogs = await Blog.find({}, 'slug updatedAt');
        blogs.forEach(blog => {
            if(blog.slug) {
                urls.push({
                    url: `/blog/${blog.slug}`,
                    changefreq: 'weekly',
                    priority: 0.7,
                    lastmod: blog.updatedAt
                });
            }
        });

        // 3. Dinamik Projeler
        const projects = await Portfolio.find({}, 'slug createdAt');
        projects.forEach(project => {
            if(project.slug) {
                urls.push({
                    url: `/portfolio/${project.slug}`,
                    changefreq: 'weekly',
                    priority: 0.7,
                    lastmod: project.createdAt
                });
            }
        });

        // XML Oluşturma
        let xml = '<?xml version="1.0" encoding="UTF-8"?>';
        xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';

        urls.forEach(u => {
            xml += '<url>';
            xml += `<loc>${baseUrl}${u.url}</loc>`;
            xml += `<changefreq>${u.changefreq}</changefreq>`;
            xml += `<priority>${u.priority}</priority>`;
            if(u.lastmod) {
                 xml += `<lastmod>${new Date(u.lastmod).toISOString()}</lastmod>`;
            }
            xml += '</url>';
        });

        xml += '</urlset>';

        // Yanıtı XML olarak gönder
        res.header('Content-Type', 'application/xml');
        res.send(xml);

    } catch (error) {
        console.error("Sitemap Hatası:", error);
        res.status(500).end();
    }
});

module.exports = router;