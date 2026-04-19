// models/Portfolio.js
const mongoose = require('mongoose');

const PortfolioSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Proje adı zorunludur'],
        trim: true
    },
    slug: {
        type: String,
        unique: true
    },
    category: {
        type: [String], 
        default: []
    },
    description: {
        type: String,
        required: [true, 'Açıklama alanı zorunludur']
    },
    projectUrl: {
        type: String,
        default: ''
    },
    logo: { type: String, default: null },
    portray: { type: String, default: null },
    gallery: { type: [String], default: [] },
    video: { type: [String], default: [] },
    pdf: { type: [String], default: [] },
    featured: { type: Boolean, default: false },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Portfolio', PortfolioSchema);