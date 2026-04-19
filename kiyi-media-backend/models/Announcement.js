// models/Announcement.js
const mongoose = require('mongoose');

const AnnouncementSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Lütfen duyuru başlığı giriniz'],
        trim: true
    },
    content: {
        type: String,
        required: [true, 'Lütfen duyuru içeriği giriniz']
    },
    isVisible: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Announcement', AnnouncementSchema);