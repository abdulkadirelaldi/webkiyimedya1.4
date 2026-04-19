const express = require('express');
const router = express.Router();
const {
    getAllPlans,
    getPlanByCustomer,
    createPlan,
    updatePlan,
    addTask,
    updateTask,
    deleteTask,
    deletePlan
} = require('../controllers/customerJobPlanController');

router.get('/', getAllPlans);
router.post('/', createPlan);
router.get('/:customerId', getPlanByCustomer);
router.put('/:id', updatePlan);
router.delete('/:id', deletePlan);
router.post('/:id/tasks', addTask);
router.put('/:id/tasks/:taskId', updateTask);
router.delete('/:id/tasks/:taskId', deleteTask);

module.exports = router;
