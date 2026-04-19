// server.js (Güncel ve Sorunsuz Hali)
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors'); // <-- CORS paketi
const connectDB = require('./db/connect');
const path = require('path');
const cookieParser = require('cookie-parser');
const http = require('http');
const { Server } = require("socket.io");
const mongoose = require('mongoose');
const User = require('./models/User');
const Role = require('./models/Role'); // EKLENDİ
const { PERMISSIONS, ROLES } = require('./config/permissions'); // EKLENDİ
const rateLimit = require('express-rate-limit'); // EKLENDİ
const Sentry = require('@sentry/node');
const { nodeProfilingIntegration } = require('@sentry/profiling-node');

// --- SENTRY INIT ---
Sentry.init({
    dsn: process.env.SENTRY_DSN,
    integrations: [
        nodeProfilingIntegration(),
    ],
    tracesSampleRate: 1.0, // Development için %100, Prod'da düşürülmeli
    profilesSampleRate: 1.0,
});

// --- RATE LIMITERS ---
const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 dakika
    max: 100, // 15 dakikada maksimum 100 istek
    message: { success: false, error: "Çok fazla istek gönderdiniz, lütfen 15 dakika sonra tekrar deneyin." },
    standardHeaders: true,
    legacyHeaders: false,
});

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 dakika
    max: 5, // 15 dakikada 5 hatalı giriş denemesi (Login/Register için)
    message: { success: false, error: "Çok fazla giriş denemesi yaptınız, lütfen 15 dakika bekleyin." },
    standardHeaders: true,
    legacyHeaders: false,
});

// --- Güvenlik Paketleri ---
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');

// --- Route Dosyaları ---
const authRoutes = require('./routes/authRoutes');
const announcementRoutes = require('./routes/announcementRoutes');
const statsRoutes = require('./routes/statsRoutes');
const portfolioRoutes = require('./routes/portfolioRoutes');
const messageRoutes = require('./routes/messageRoutes');
const jobRoutes = require('./routes/jobRoutes');
const accountingRoutes = require('./routes/accountingRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const blogRoutes = require('./routes/blogRoutes');
const sitemapRoutes = require('./routes/sitemapRoutes');
const userRoutes = require('./routes/userRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const customerStatsRoutes = require('./routes/customerStatsRoutes');
const teamNoteRoutes = require('./routes/teamNoteRoutes');
const customerJobPlanRoutes = require('./routes/customerJobPlanRoutes');
const userManagementRoutes = require('./routes/userManagementRoutes');
const customerCardRoutes = require('./routes/customerCardRoutes');
const packageRoutes = require('./routes/packageRoutes');

dotenv.config();
const app = express();
const server = http.createServer(app);

// ------------------------------------------------------------
// 1. İZİN VERİLEN SİTELER (WHITELIST)
// ------------------------------------------------------------
const allowedOrigins = [
    "http://localhost:3000",
    "https://kiyi-media.vercel.app",
    "https://www.kiyimedya.com",
    "https://kiyimedya.com" // <--- EKLENDİ (Burası önemli)
];

// ------------------------------------------------------------
// 2. SOCKET.IO AYARLARI
// ------------------------------------------------------------
const io = new Server(server, {
    cors: {
        origin: allowedOrigins, // Yukarıdaki listeyi kullanıyoruz
        methods: ["GET", "POST"],
        credentials: true
    },
    pingTimeout: 60000,
});

io.on("connection", (socket) => {
    io.emit("onlineCount", io.engine.clientsCount);
    socket.on("disconnect", () => {
        io.emit("onlineCount", io.engine.clientsCount);
    });
});

app.use((req, res, next) => {
    req.io = io;
    next();
});

// ------------------------------------------------------------
// 3. MIDDLEWARE AYARLARI

app.use(helmet({
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: false
}));

// CORS Ayarları (GÜNCELLENDİ: Daha Garantili Yöntem)
app.use(cors({
    origin: function (origin, callback) {
        // origin null ise (Postman veya sunucu içi istekler) izin ver
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            console.log("CORS Engellendi:", origin);
            callback(new Error('Bu domaine CORS izni yok!'));
        }
    },
    credentials: true, // Cookie gönderimine izin ver
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json({ limit: '2.5gb' }));
app.use(express.urlencoded({ limit: '2.5gb', extended: true }));
app.use(cookieParser());

app.use((req, res, next) => {
    try {
        if (req.body) req.body = mongoSanitize.sanitize(req.body);
        if (req.params) req.params = mongoSanitize.sanitize(req.params);
        if (req.query) req.query = mongoSanitize.sanitize(req.query);
    } catch (error) { console.error("Sanitize Hatası:", error); }
    next();
});

app.use(hpp());

// ------------------------------------------------------------
// 4. STATİK DOSYALAR
// ------------------------------------------------------------
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));
app.use(express.static(path.join(__dirname, 'public')));

// ------------------------------------------------------------
// 5. ROTALAR
// ------------------------------------------------------------
// Global Rate Limiter Uygula (Tüm API rotalarına)
app.use('/api', globalLimiter);

// Auth Limiter (Sadece Auth rotalarına özel)
app.use('/api/auth', authLimiter); // Bu rota global limitin üstüne ekstra katman ekler
app.use('/api/auth', authRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/accounting', accountingRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/chat', require('./routes/chatRoutes'));
app.use('/sitemap.xml', sitemapRoutes);
app.use('/api/users', userManagementRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/customer-stats', customerStatsRoutes);
app.use('/api/team-notes', teamNoteRoutes);
app.use('/api/job-plans', customerJobPlanRoutes);
app.use('/api/customer-cards', customerCardRoutes);
app.use('/api/packages', packageRoutes);

app.get('/', (req, res) => { res.send('Kıyı Medya API Sunucusu Çalışıyor... 🚀'); });

// ------------------------------------------------------------
// 6. HATA YAKALAMA
// ------------------------------------------------------------
// ------------------------------------------------------------
// 6. HATA YAKALAMA
// ------------------------------------------------------------
// Sentry Error Handler (v8+ için otomatik kurulum)
Sentry.setupExpressErrorHandler(app);

app.use((err, req, res, next) => {
    console.error("🔥 HATA DETAYI:", err); // Konsola tam hatayı basar

    // Hata kodunu al (Yoksa 500 yap)
    let statusCode = err.statusCode || (res.statusCode !== 200 ? res.statusCode : 500);
    let message = err.message || 'Sunucu Hatası';

    // Mongoose CastError (Geçersiz ID)
    if (err.name === 'CastError') {
        message = `Geçersiz ID formatı: ${err.value}`;
        statusCode = 404;
    }

    // Mongoose Duplicate Key (Tekrarlanan Veri)
    if (err.code === 11000) {
        message = 'Bu veri zaten kayıtlı (Tekrarlanan Alan)';
        statusCode = 400;
    }

    // Mongoose Validation Error (Doğrulama Hatası)
    if (err.name === 'ValidationError') {
        message = Object.values(err.errors).map(val => val.message).join(', ');
        statusCode = 400;
    }

    res.status(statusCode).json({
        success: false,
        error: message,
        details: err.message // Frontend'de görmek için ekledik
    });
});

// ------------------------------------------------------------
// 7. BAŞLATMA
// ------------------------------------------------------------
const PORT = process.env.PORT || 5002;

const seedRoles = async () => {
    const rolesData = [
        {
            name: 'patron',
            permissions: ['manage_users', 'view_all_panels', 'manage_settings', 'create_project', 'update_project', 'delete_project', 'view_all_projects', 'view_prices', 'manage_accounting', 'view_all_jobplans', 'manage_team_notes'],
            description: 'Tam yetkili patron'
        },
        {
            name: 'yonetici',
            permissions: ['manage_settings', 'create_project', 'update_project', 'delete_project', 'view_all_projects', 'view_prices', 'manage_accounting', 'view_all_jobplans', 'manage_team_notes'],
            description: 'Yönetici'
        },
        {
            name: 'stajyer',
            permissions: ['view_own_jobplan'],
            description: 'Stajyer'
        },
        {
            name: 'musteri',
            permissions: ['view_own_stats'],
            description: 'Müşteri'
        }
    ];

    for (const role of rolesData) {
        // Upsert mantığı: Varsa güncelle, yoksa oluştur
        await Role.findOneAndUpdate(
            { name: role.name },
            { permissions: role.permissions, description: role.description },
            { upsert: true, new: true }
        );
    }
    console.log("✅ Roller ve İzinler Senkronize Edildi.");
};

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI);
        console.log("✅ MongoDB Bağlantısı Başarılı!");

        // --- ROLLERİ OLUŞTUR ---
        await seedRoles();

        // --- PATRON HESABI KONTROLÜ / OLUŞTURMA ---
        const adminEmail = "patron@kiyimedya.com";
        const adminPassword = process.env.ADMIN_PASSWORD || "Basak.0125";

        let user = await User.findOne({ email: adminEmail });

        if (!user) {
            await User.create({
                name: "Patron",
                email: adminEmail,
                password: adminPassword,
                role: "patron"
            });
            console.log(`👑 PATRON Hesabı SIFIRDAN Oluşturuldu (Rol: Patron).`);
        } else {
            user.password = adminPassword;
            user.role = "patron";
            await user.save();
            console.log(`👑 PATRON Hesabı Güncellendi (Rol: Patron).`);
        }

        // --- ESKİ INDEX TEMİZLİĞİ ---
        try {
            await mongoose.connection.db.collection('services').dropIndex('slug_1');
            console.log("🧹 Eski 'slug_1' index silindi.");
        } catch (e) {
            if (e.code !== 27) console.warn("slug_1 index silinemedi (zaten yok olabilir):", e.message);
        }

        // --- ROL MİGRASYONU ---
        const roleMigration = { 'admin': 'patron', 'editor': 'yonetici', 'viewer': 'stajyer' };
        for (const [oldRole, newRole] of Object.entries(roleMigration)) {
            const result = await User.updateMany({ role: oldRole }, { $set: { role: newRole } });
            if (result.modifiedCount > 0) {
                console.log(`🔄 ${result.modifiedCount} kullanıcı: '${oldRole}' → '${newRole}'`);
            }
        }

        // --- SUNUCUYU BAŞLAT ---
        const httpServer = server.listen(PORT, () => {
            console.log(`✅ Sunucu ${PORT} portunda çalışıyor.`);
        });

        httpServer.setTimeout(30 * 60 * 1000);

    } catch (error) {
        console.error("❌ Sunucu Başlatma Hatası:", error);
        process.exit(1);
    }
};

start();