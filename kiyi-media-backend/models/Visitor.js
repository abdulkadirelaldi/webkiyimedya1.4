const mongoose = require('mongoose');

const VisitorSchema = new mongoose.Schema({
    // Kullanıcıyı tanımak için IP adresi şart
    ip: {
        type: String,
        required: true
    },
    // En son ne zaman girdiğini tutuyoruz (24 saat kontrolü için)
    lastVisit: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Visitor', VisitorSchema);