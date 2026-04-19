const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false // Eğer null ise "Herkese" gönderilmiş demektir
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    type: {
        type: String,
        enum: ['new_job', 'team_note', 'revision', 'system'],
        default: 'system'
    },
    message: {
        type: String,
        required: true
    },
    link: {
        type: String // Tıklandığında gideceği sayfa (örn: /admin/jobs)
    },
    isRead: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Notification', NotificationSchema);