const express = require('express');
const router = express.Router();
const {
    getCustomerStats,
    updateCustomerStats,
    addSocialMonth,
    addAdSpending,
    deleteAdSpending,
    addDriveLink,
    deleteDriveLink
} = require('../controllers/customerStatsController');

router.get('/:userId', getCustomerStats);
router.put('/:userId', updateCustomerStats);
router.post('/:userId/social', addSocialMonth);
router.post('/:userId/ad', addAdSpending);
router.delete('/:userId/ad/:adId', deleteAdSpending);
router.post('/:userId/drive', addDriveLink);
router.delete('/:userId/drive/:linkId', deleteDriveLink);

module.exports = router;
