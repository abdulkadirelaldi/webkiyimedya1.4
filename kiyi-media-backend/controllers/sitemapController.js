// controllers/sitemapController.js

exports.getSitemap = async (req, res) => {
    try {
        // 1. Sitenizin canlıdaki adresi (Domain)
        // Localhost'ta test ederken http://localhost:3000 kalabilir ama canlıda değiştirmelisin.
        const baseUrl = 'https://kiyimedya.com'; 

        // 2. Statik Sayfalarımız
        const staticPages = [
            '',           // Anasayfa
            'services',   // Hizmetler
            'portfolio',  // Portföy
            'about',      // Kurumsal
            'contact'     // İletişim
        ];

        // 3. XML Başlangıcı
        let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

        // 4. Statik Sayfaları Ekle
        staticPages.forEach(page => {
            xml += `
    <url>
        <loc>${baseUrl}/${page}</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>${page === '' ? '1.0' : '0.8'}</priority>
    </url>`;
        });

        // NOT: İleride "Blog Detay" veya "Proje Detay" sayfaları yaparsan,
        // veritabanından çekip döngü ile buraya ekleyebilirsin.
        // Örn: Portfolio.find()... map -> <loc>/portfolio/${item._id}</loc>

        // 5. XML Bitişi
        xml += `
</urlset>`;

        // 6. Yanıtı XML Olarak Gönder
        res.header('Content-Type', 'application/xml');
        res.send(xml);

    } catch (error) {
        console.error(error);
        res.status(500).send('Sitemap oluşturulamadı.');
    }
};