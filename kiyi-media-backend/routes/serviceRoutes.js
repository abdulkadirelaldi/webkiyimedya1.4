const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { getServices, addService, updateService, deleteService } = require('../controllers/serviceController');

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'public/uploads/'),
    filename: (req, file, cb) => cb(null, 'service-' + Date.now() + path.extname(file.originalname))
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }
});

router.get('/', getServices);
router.post('/', upload.single('image'), addService);
router.put('/:id', upload.single('image'), updateService);
router.delete('/:id', deleteService);

module.exports = router;
