const mongoose = require('mongoose');

const CustomerJobPlanSchema = new mongoose.Schema(
    {
        customerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        assignedTo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },

        customerCard: {
            companyName: String,
            contactPerson: String,
            phone: String,
            email: String,
            address: String,
            sector: String,
            notes: String,
            avatar: String
        },

        tasks: [{
            title: { type: String, required: true },
            description: String,
            status: {
                type: String,
                enum: ['todo', 'inprogress', 'review', 'done'],
                default: 'todo'
            },
            priority: {
                type: String,
                enum: ['low', 'medium', 'high', 'urgent'],
                default: 'medium'
            },
            assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            dueDate: Date,
            tags: [String],
            completedAt: Date,
            createdAt: { type: Date, default: Date.now }
        }],

        weeklyPlan: [{
            week: String,
            goals: [String],
            notes: String
        }]
    },
    { timestamps: true }
);

module.exports = mongoose.model('CustomerJobPlan', CustomerJobPlanSchema);
