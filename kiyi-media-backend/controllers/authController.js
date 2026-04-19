const User = require('../models/User');
const Role = require('../models/Role');
const ErrorResponse = require('../utils/errorResponse');

// --- KAYIT OL (Register) ---
exports.register = async (req, res, next) => {
    try {
        const { name, email, password, role, phone } = req.body;

        const user = await User.create({
            name,
            email,
            password,
            phone, // Telefon kaydediliyor
            role: role || 'viewer' // Rol gelmezse varsayılan 'viewer'
        });

        await sendTokenResponse(user, 200, res);
    } catch (error) {
        next(error);
    }
};

// --- GİRİŞ YAP (Login) ---
exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return next(new ErrorResponse('Lütfen email ve şifre giriniz', 400));
        }

        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return next(new ErrorResponse('Geçersiz kimlik bilgileri', 401));
        }

        // EĞER ESKİ KULLANICIDA BU ALAN YOKSA UNDEFINED GELEBİLİR, KONTROL EDELİM
        if (user.failedLoginAttempts === undefined) {
            user.failedLoginAttempts = 0;
        }

        console.log(`Login attempt for ${email}. Failed attempts: ${user.failedLoginAttempts}. Lock until: ${user.lockUntil}`);

        // 1. Hesap Kilitli mi?
        if (user.lockUntil && user.lockUntil > Date.now()) {
            const minutesLeft = Math.ceil((user.lockUntil - Date.now()) / 60000);
            return next(new ErrorResponse(`Hesabınız çok fazla başarısız giriş denemesi nedeniyle kilitlendi. Lütfen ${minutesLeft} dakika sonra tekrar deneyiniz.`, 429));
        }

        const isMatch = await user.matchPassword(password);

        // 2. Şifre Yanlışsa
        if (!isMatch) {
            // Hatalı giriş sayısını artır
            user.failedLoginAttempts += 1;
            console.log(`Password mismatch. New failed attempts: ${user.failedLoginAttempts}`);

            // 5. hatadaysa kilitle
            if (user.failedLoginAttempts >= 5) {
                user.lockUntil = Date.now() + 5 * 60 * 1000; // 5 dakika
                await user.save();
                return next(new ErrorResponse('Hesabınız 5 başarısız giriş denemesi nedeniyle 5 dakika süreyle kilitlendi.', 429));
            }

            await user.save();
            return next(new ErrorResponse(`Geçersiz kimlik bilgileri. Kalan hakkınız: ${5 - user.failedLoginAttempts}`, 401));
        }

        // 3. Hesap Aktif mi?
        if (!user.isActive) {
            return next(new ErrorResponse('Hesabınız pasif durumda. Lütfen yöneticinizle iletişime geçin.', 403));
        }

        // 4. Giriş Başarılıysa - Kilidi ve Sayacı Sıfırla
        user.failedLoginAttempts = 0;
        user.lockUntil = undefined;
        await user.save();

        await sendTokenResponse(user, 200, res);

    } catch (error) {
        next(error);
    }
};

// --- ÇIKIŞ YAP (Logout) ---
exports.logout = async (req, res, next) => {
    res.cookie('token', 'none', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
    });
    res.status(200).json({ success: true, data: {} });
};

// --- GÜNCEL KULLANICIYI GETİR (Me) ---
exports.getMe = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        const userRole = await Role.findOne({ name: user.role });
        const permissions = userRole ? userRole.permissions : [];

        res.status(200).json({
            success: true,
            data: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                phone: user.phone, // Telefonu da gönderiyoruz
                profileImage: user.profileImage, // Profil fotosunu da
                permissions: permissions
            }
        });
    } catch (error) {
        next(error);
    }
};

// --- PROFİL BİLGİLERİNİ GÜNCELLE ---
exports.updateDetails = async (req, res, next) => {
    try {
        const fieldsToUpdate = {
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone
        };

        // 1. Eğer Dosya Yüklendiyse (Multer ile)
        if (req.file) {
            fieldsToUpdate.profileImage = `/uploads/${req.file.filename}`;
        }
        // 2. Eğer Silme İsteği Geldiyse (Frontend'den deleteImage: 'true')
        else if (req.body.deleteImage === 'true') {
            fieldsToUpdate.profileImage = '';
        }

        const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
            new: true,
            runValidators: true
        });

        res.status(200).json({ success: true, data: user });
    } catch (error) {
        next(error);
    }
};

// --- ŞİFRE GÜNCELLE ---
exports.updatePassword = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id).select('+password');

        if (!(await user.matchPassword(req.body.currentPassword))) {
            return next(new ErrorResponse('Mevcut şifre yanlış', 401));
        }

        user.password = req.body.newPassword;
        await user.save();

        sendTokenResponse(user, 200, res);
    } catch (error) {
        next(error);
    }
};

// --- TOKEN YARDIMCISI ---
const sendTokenResponse = async (user, statusCode, res) => {
    const token = user.getSignedJwtToken();
    const userRole = await Role.findOne({ name: user.role });
    const permissions = userRole ? userRole.permissions : [];

    const options = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
        httpOnly: true
    };

    if (process.env.NODE_ENV === 'production') {
        options.secure = true;
    }

    res
        .status(statusCode)
        .cookie('token', token, options)
        .json({
            success: true,
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                phone: user.phone,
                profileImage: user.profileImage,
                permissions: permissions
            }
        });
};