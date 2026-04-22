const mongoose = require('mongoose');

const PackageSchema = new mongoose.Schema({
    name:        { type: String, required: [true, 'Paket adı zorunludur'], trim: true },
    description: { type: String, default: '' },
    posts:       { type: Number, default: 0 },
    stories:     { type: Number, default: 0 },
    reels:       { type: Number, default: 0 },
    websiteIncluded:            { type: Boolean, default: false },
    corporateIdentityIncluded:  { type: Boolean, default: false },
    katalogIncluded:            { type: Boolean, default: false },
    qrMenuIncluded:             { type: Boolean, default: false },
    kartvizitIncluded:          { type: Boolean, default: false },
    brosurIncluded:             { type: Boolean, default: false },
    tabelaIncluded:             { type: Boolean, default: false },
    videoIncluded:              { type: Boolean, default: false },
    extraServices: [{ label: { type: String, trim: true } }],
    price:       { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Package', PackageSchema);
