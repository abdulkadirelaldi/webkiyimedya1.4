const mongoose = require('mongoose');

const TeamNoteSchema = new mongoose.Schema(
    {
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        content: {
            type: String,
            required: [true, 'Not içeriği zorunludur'],
            maxlength: [1000, 'Not 1000 karakteri geçemez']
        },
        mentions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
        isPinned: { type: Boolean, default: false },
        reactions: [{
            userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            emoji: String
        }]
    },
    { timestamps: true }
);

module.exports = mongoose.model('TeamNote', TeamNoteSchema);
