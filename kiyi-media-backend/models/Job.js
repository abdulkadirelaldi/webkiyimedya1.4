const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Lütfen iş başlığı giriniz'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Lütfen açıklama giriniz']
    },
    status: {
        type: String,
        // Frontend'deki ID'lerle birebir aynı olmalı:
        enum: ['yapilacaklar', 'yapiliyor', 'tamamlandi'], 
        default: 'yapilacaklar'
    },
    category: {
        type: String,
        required: true,
        // Frontend'deki Select menüsündeki seçeneklerle aynı olmalı:
        enum: [
            'Genel', 
            'Video Çekim', 
            'Fotoğraf Çekim', 
            'Post Tasarım', 
            'Story Tasarım', 
            'Reels Montaj', 
            'Web Tasarım', 
            'Teklif', 
            'Revize', 
            'Not'
        ],
        default: 'Genel'
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium'
    },
    dueDate: {
        type: Date
    },
    portfolioId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Portfolio',
        required: false // Müşteri seçimi zorunlu değil
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Job', JobSchema);