const mongoose = require('mongoose');

const CustomerStatsSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            unique: true
        },

        socialMedia: [{
            month: String,
            posts: { type: Number, default: 0 },
            stories: { type: Number, default: 0 },
            reels: { type: Number, default: 0 },
            publishDates: [Date]
        }],

        adSpending: [{
            campaign: String,
            platform: String,
            amount: Number,
            currency: { type: String, default: 'TRY' },
            startDate: Date,
            endDate: Date
        }],

        websiteProgress: { type: Number, default: 0, min: 0, max: 100 },
        brandingProgress: { type: Number, default: 0, min: 0, max: 100 },

        contractDate: Date,
        projectStartDate: Date,
        shootingDates: [Date],

        driveLinks: [{
            label: String,
            url: String,
            type: { type: String, enum: ['photo', 'video', 'document'], default: 'photo' }
        }],

        websiteStages: [{
            name: String,
            completed: { type: Boolean, default: false },
            completedAt: Date
        }]
    },
    { timestamps: true }
);

module.exports = mongoose.model('CustomerStats', CustomerStatsSchema);
