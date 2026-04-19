const mongoose = require('mongoose');

const ServiceLogSchema = new mongoose.Schema({
    serviceName: { type: String, required: true }, // Örn: "Web Tasarım"
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ServiceLog', ServiceLogSchema);