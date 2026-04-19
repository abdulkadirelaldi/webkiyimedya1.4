// utils/fileUpload.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// 1. DİSK DEPOLAMA AYARLARI
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Hata riskini sıfıra indirmek için tam yol (absolute path) kullanıyoruz
        // __dirname = utils klasörü. Buradan bir üst klasöre (..) çıkıp public/uploads'a gidiyoruz.
        const uploadPath = path.join(__dirname, '../public/uploads');

        // Klasör yoksa OTOMATİK OLUŞTUR (Recursive: true iç içe klasörleri de oluşturur)
        if (!fs.existsSync(uploadPath)){
            fs.mkdirSync(uploadPath, { recursive: true });
        }

        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        // Dosya isimleri çakışmasın diye benzersiz bir isim üretiyoruz
        // Örn: logo-1678234234-98432.png
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname); // Dosya uzantısını al (.jpg, .mp4)
        
        cb(null, file.fieldname + '-' + uniqueSuffix + ext);
    }
});

// 2. DOSYA FİLTRESİ (GÜNCELLENDİ: Video Desteği Eklendi)
const fileFilter = (req, file, cb) => {
    // mimetype: 'image/jpeg', 'image/png', 'video/mp4', 'video/webm' vb.
    
    if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
        // Resim veya Video ise kabul et
        cb(null, true);
    } else {
        // Başka bir tür ise reddet
        cb(new Error('Desteklenmeyen dosya türü! Sadece Resim ve Video yükleyebilirsiniz.'), false);
    }
};

// 3. MULTER AYARLARI
const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: { 
        fileSize: 2 * 1024 * 1024 * 1024 // 2GB Limit (Byte cinsinden)
    } 
});

module.exports = upload;