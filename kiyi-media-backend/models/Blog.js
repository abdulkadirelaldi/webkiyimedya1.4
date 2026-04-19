// models/Blog.js
const mongoose = require('mongoose');

const BlogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Blog başlığı zorunludur'],
        trim: true
    },
    // Slug alanımız burada duruyor (Bu sayede linkler oluşacak)
    slug: {
        type: String,
        unique: true
    },
    content: {
        type: String,
        required: [true, 'Blog içeriği zorunludur']
    },
    image: {
        type: String, 
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Blog', BlogSchema);