const express = require('express');
const router = express.Router();
const {
    getNotes,
    addNote,
    deleteNote,
    togglePin,
    reactToNote
} = require('../controllers/teamNoteController');

router.get('/', getNotes);
router.post('/', addNote);
router.delete('/:id', deleteNote);
router.put('/:id/pin', togglePin);
router.post('/:id/react', reactToNote);

module.exports = router;
