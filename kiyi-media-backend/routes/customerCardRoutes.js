const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/customerCardController');
const { protect, checkPermission } = require('../middleware/authMiddleware');
const { PERMISSIONS } = require('../config/permissions');

// Müşteri: kendi kartı
router.get('/me', protect, ctrl.getMyCard);

// Patron / Yönetici / Stajyer: tümü
router.get('/', protect, ctrl.getAll);
router.get('/:id', protect, ctrl.getById);
router.post('/', protect, ctrl.create);
router.put('/:id', protect, ctrl.update);
router.delete('/:id', protect, ctrl.remove);

module.exports = router;
