const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Lütfen isim giriniz']
    },
    email: {
        type: String,
        required: [true, 'Lütfen email giriniz'],
        unique: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Geçersiz email adresi'
        ]
    },
    phone: { type: String, default: '' },
    profileImage: { type: String, default: '' },
    role: {
        type: String,
        enum: ['patron', 'yonetici', 'stajyer', 'musteri'],
        default: 'stajyer'
    },
    avatar: { type: String, default: null },
    department: { type: String, default: '' },
    isActive: { type: Boolean, default: true },
    lastLogin: { type: Date },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    password: {
        type: String,
        required: [true, 'Lütfen şifre giriniz'],
        minlength: 6,
        select: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    // YENİ: Başarısız Giriş Denemeleri
    failedLoginAttempts: {
        type: Number,
        default: 0
    },
    // YENİ: Hesap Kilidi Bitiş Süresi
    lockUntil: {
        type: Date
    }
});

// DÜZELTİLEN KISIM: next parametresi kaldırıldı ve return kullanıldı
UserSchema.pre('save', async function () {
    // Şifre değişmediyse (sadece giriş tarihi vs. güncellendiyse) hashleme yapma
    if (!this.isModified('password')) {
        return;
    }

    // Şifreyi hashle
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.getSignedJwtToken = function () {
    return jwt.sign(
        { id: this._id, role: this.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE || '30d' }
    );
};

UserSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);