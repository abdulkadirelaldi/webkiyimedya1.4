const mongoose = require('mongoose');

const SocialEntrySchema = new mongoose.Schema({
    sharedAt: { type: Date, default: null },
    note:     { type: String, default: '' }
}, { _id: true });

const PeriodSchema = new mongoose.Schema({
    startDate:  Date,
    endDate:    Date,
    periodNo:   { type: Number, default: 1 },
    posts:   [SocialEntrySchema],
    stories: [SocialEntrySchema],
    reels:   [SocialEntrySchema]
}, { _id: true });

const CustomerCardSchema = new mongoose.Schema({
    businessName: { type: String, required: [true, 'İşletme adı zorunludur'], trim: true },
    sector:       { type: String, trim: true, default: '' },
    userId:       { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    packageRef:   { type: mongoose.Schema.Types.ObjectId, ref: 'Package', default: null },
    packageLabel: { type: String, default: '' }, // cache for display

    contacts: [{
        name: String, surname: String, title: String, email: String, phone: String
    }],

    firstMeetingDate: { type: Date, default: null },
    agreementDate:    { type: Date, default: null },
    agreedPrice:      { type: Number, default: 0 },

    payments: [{
        label:  String,
        amount: Number,
        dueDate: Date,
        paidAt:  { type: Date, default: null },
        status:  { type: String, enum: ['bekliyor', 'odendi', 'gecikti'], default: 'bekliyor' }
    }],

    // Aktif dönem sosyal medya takibi
    currentPeriod: { type: PeriodSchema, default: () => ({ posts: [], stories: [], reels: [], periodNo: 1 }) },

    // Kapatılmış geçmiş dönemler
    socialHistory: [PeriodSchema],

    websiteProgress:            { type: Number, default: 0, min: 0, max: 100 },
    websiteActive:              { type: Boolean, default: false },
    websiteProgressLog:         [{ progress: Number, note: String, date: { type: Date, default: Date.now } }],

    corporateIdentityProgress:  { type: Number, default: 0, min: 0, max: 100 },
    corporateIdentityActive:    { type: Boolean, default: false },
    corporateIdentityProgressLog: [{ progress: Number, note: String, date: { type: Date, default: Date.now } }],

    katalogProgress:    { type: Number, default: 0, min: 0, max: 100 },
    katalogActive:      { type: Boolean, default: false },
    katalogProgressLog: [{ progress: Number, note: String, date: { type: Date, default: Date.now } }],

    qrMenuProgress:    { type: Number, default: 0, min: 0, max: 100 },
    qrMenuActive:      { type: Boolean, default: false },
    qrMenuProgressLog: [{ progress: Number, note: String, date: { type: Date, default: Date.now } }],

    kartvizitProgress:    { type: Number, default: 0, min: 0, max: 100 },
    kartvizitActive:      { type: Boolean, default: false },
    kartvizitProgressLog: [{ progress: Number, note: String, date: { type: Date, default: Date.now } }],

    brosurProgress:    { type: Number, default: 0, min: 0, max: 100 },
    brosurActive:      { type: Boolean, default: false },
    brosurProgressLog: [{ progress: Number, note: String, date: { type: Date, default: Date.now } }],

    tabelaProgress:    { type: Number, default: 0, min: 0, max: 100 },
    tabelaActive:      { type: Boolean, default: false },
    tabelaProgressLog: [{ progress: Number, note: String, date: { type: Date, default: Date.now } }],

    videoProgress:    { type: Number, default: 0, min: 0, max: 100 },
    videoActive:      { type: Boolean, default: false },
    videoProgressLog: [{ progress: Number, note: String, date: { type: Date, default: Date.now } }],

    meetings: [{
        date: Date, time: { type: String, default: '' }, location: { type: String, default: '' },
        title: String, notes: String, isPast: { type: Boolean, default: false }
    }],

    revisions: [{
        receivedAt: Date, description: String, dueDate: Date,
        category: { type: String, default: 'diger' }
    }],

    adCampaigns: [{
        name:      { type: String, default: '' },
        platform:  { type: String, default: 'Instagram' },
        startDate: Date,
        endDate:   Date,
        budget:    { type: Number, default: 0 },
        spent:     { type: Number, default: 0 },
        results: {
            followers:   { type: Number, default: 0 },
            messages:    { type: Number, default: 0 },
            likes:       { type: Number, default: 0 },
            comments:    { type: Number, default: 0 },
            views:       { type: Number, default: 0 },
            shares:      { type: Number, default: 0 },
            sales:       { type: Number, default: 0 },
            salesAmount: { type: Number, default: 0 }
        }
    }],

    kanban: [{
        title:       { type: String, required: true },
        description: { type: String, default: '' },
        column:      { type: String, enum: ['yapilacak', 'devam', 'tamamlandi', 'beklemede'], default: 'yapilacak' },
        priority:    { type: String, enum: ['dusuk', 'orta', 'yuksek'], default: 'orta' },
        dueDate:     { type: Date, default: null },
        dueTime:     { type: String, default: '' },
        assignees:   [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
        order:       { type: Number, default: 0 }
    }],

    kanbanPeriod: {
        periodNo:  { type: Number, default: 1 },
        startDate: { type: Date, default: null },
        endDate:   { type: Date, default: null }
    },

    kanbanHistory: [{
        periodNo:  Number,
        startDate: Date,
        endDate:   Date,
        tasks:     { type: mongoose.Schema.Types.Mixed, default: [] }
    }],

    notes: { type: String, default: '' },

    // Müşteri dijital varlıkları
    driveLink:     { type: String, default: '' },
    instagramLink: { type: String, default: '' },
    facebookLink:  { type: String, default: '' },
    twitterLink:   { type: String, default: '' },
    linkedinLink:  { type: String, default: '' },
    tiktokLink:    { type: String, default: '' },
    websiteLink:   { type: String, default: '' },
    youtubeLink:   { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('CustomerCard', CustomerCardSchema);
