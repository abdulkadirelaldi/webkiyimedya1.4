// models/Message.js
const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Lütfen isim giriniz']
    },
    email: {
        type: String,
        required: [true, 'Lütfen email giriniz']
    },
    phone: {
        type: String,
        required: [true, 'Lütfen telefon numaranızı giriniz']
    },
    subject: {
        type: String,
        default: 'Konusuz'
    },
    message: {
        type: String,
        required: [true, 'Lütfen mesajınızı yazınız']
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Message', MessageSchema);