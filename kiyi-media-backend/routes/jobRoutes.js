const express = require('express');
const router = express.Router();
const { 
    getJobsByPortfolio, 
    getAllJobs, 
    addJob, 
    updateJob, 
    deleteJob 
} = require('../controllers/jobController');

// YENİ: RBAC Middleware ve İzinleri import et
const { protect, checkPermission } = require('../middleware/authMiddleware');
const { PERMISSIONS } = require('../config/permissions');

/**
 * @route   GET /api/jobs/all
 * @desc    Tüm markaların işlerini getir
 * @access  Private (İzin: view_all_projects)
 */
router.get('/all', 
    protect, 
    checkPermission(PERMISSIONS.VIEW_ALL_PROJECTS), 
    getAllJobs
);

/**
 * @route   GET /api/jobs/:portfolioId
 * @desc    Belirli bir markaya ait işleri getir
 * @access  Private (İzin: view_all_projects)
 */
router.get('/:portfolioId', 
    protect, 
    checkPermission(PERMISSIONS.VIEW_ALL_PROJECTS), 
    getJobsByPortfolio
);

/**
 * @route   POST /api/jobs
 * @desc    Yeni bir görev/iş ekle
 * @access  Private (İzin: create_project - Admin ve Editor)
 */
router.post('/', 
    protect, 
    checkPermission(PERMISSIONS.CREATE_PROJECT), 
    addJob
);

/**
 * @route   PUT /api/jobs/:id
 * @desc    İşin statüsünü veya detaylarını güncelle
 * @access  Private (İzin: update_project - Admin ve Editor)
 */
router.put('/:id', 
    protect, 
    checkPermission(PERMISSIONS.UPDATE_PROJECT), 
    updateJob
);

/**
 * @route   DELETE /api/jobs/:id
 * @desc    Görevi tamamen sil
 * @access  Private (İzin: delete_project - Sadece Admin)
 */
router.delete('/:id', 
    protect, 
    checkPermission(PERMISSIONS.DELETE_PROJECT), 
    deleteJob
);

module.exports = router;