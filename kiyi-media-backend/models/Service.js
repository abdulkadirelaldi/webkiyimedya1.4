const mongoose = require('mongoose');

const ServiceSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Hizmet başlığı zorunludur'],
            trim: true,
            maxlength: [200, 'Başlık 200 karakteri geçemez']
        },
        description: {
            type: String,
            default: '',
            trim: true
        },
        tags: [{ type: String, trim: true }],
        image: { type: String },
        matchKey: { type: String, trim: true },
        order: { type: Number, default: 0 }
    },
    { timestamps: true }
);

module.exports = mongoose.model('Service', ServiceSchema);
