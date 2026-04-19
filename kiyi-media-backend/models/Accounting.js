const mongoose = require('mongoose');

const AccountingSchema = new mongoose.Schema({
    title: { type: String, required: true },
    amount: { type: Number, required: true },
    type: {
        type: String,
        enum: ['income', 'expense', 'receivable', 'payable'],
        required: true
    },
    date: { type: Date, default: Date.now },
    status: {
        type: String,
        enum: ['paid', 'pending'],
        default: 'paid'
    },
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    category: {
        type: String,
        enum: ['sosyal_medya', 'web', 'grafik', 'video', 'reklam', 'diger'],
        default: 'diger'
    },
    month: { type: String },
    invoiceNumber: { type: String },
    isPaid: { type: Boolean, default: false },
    paidAt: { type: Date },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Accounting', AccountingSchema);
