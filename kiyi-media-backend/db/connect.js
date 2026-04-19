// db/connect.js
const mongoose = require('mongoose');

const connectDB = (url) => {
    // StrictQuery uyarısını kapatmak ve yeni bağlantı mantığını kullanmak için
    mongoose.set('strictQuery', false);
    
    return mongoose.connect(url)
        .then(() => console.log('✅ MongoDB Bağlantısı Başarılı!'))
        .catch((err) => {
            console.error('❌ MongoDB Bağlantı Hatası:', err);
            process.exit(1); // Kritik hata varsa uygulamayı durdur
        });
};

module.exports = connectDB;