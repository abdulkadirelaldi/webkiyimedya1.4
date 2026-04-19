const TeamNote = require('../models/TeamNote');

exports.getNotes = async (req, res) => {
    try {
        const notes = await TeamNote.find()
            .sort({ isPinned: -1, createdAt: -1 })
            .limit(100)
            .populate('author', 'name avatar role')
            .populate('mentions', 'name avatar');
        res.status(200).json({ success: true, count: notes.length, data: notes });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Notlar getirilemedi.', error: error.message });
    }
};

exports.addNote = async (req, res) => {
    try {
        const { author, content, mentions } = req.body;
        const note = await TeamNote.create({ author, content, mentions: mentions || [] });
        await note.populate('author', 'name avatar role');
        res.status(201).json({ success: true, data: note });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Not eklenemedi.', error: error.message });
    }
};

exports.deleteNote = async (req, res) => {
    try {
        const note = await TeamNote.findByIdAndDelete(req.params.id);
        if (!note) return res.status(404).json({ success: false, message: 'Not bulunamadı.' });
        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Not silinemedi.', error: error.message });
    }
};

exports.togglePin = async (req, res) => {
    try {
        const note = await TeamNote.findById(req.params.id);
        if (!note) return res.status(404).json({ success: false, message: 'Not bulunamadı.' });

        note.isPinned = !note.isPinned;
        await note.save();
        res.status(200).json({ success: true, data: note });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Pin durumu değiştirilemedi.', error: error.message });
    }
};

exports.reactToNote = async (req, res) => {
    try {
        const { userId, emoji } = req.body;
        const note = await TeamNote.findById(req.params.id);
        if (!note) return res.status(404).json({ success: false, message: 'Not bulunamadı.' });

        const existingIndex = note.reactions.findIndex(
            r => r.userId.toString() === userId && r.emoji === emoji
        );

        if (existingIndex > -1) {
            note.reactions.splice(existingIndex, 1);
        } else {
            note.reactions.push({ userId, emoji });
        }

        await note.save();
        res.status(200).json({ success: true, data: note.reactions });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Reaction güncellenemedi.', error: error.message });
    }
};
