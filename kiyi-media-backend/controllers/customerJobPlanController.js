const CustomerJobPlan = require('../models/CustomerJobPlan');

exports.getAllPlans = async (req, res) => {
    try {
        const plans = await CustomerJobPlan.find()
            .populate('customerId', 'name email avatar')
            .populate('assignedTo', 'name avatar role')
            .sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: plans.length, data: plans });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Planlar getirilemedi.', error: error.message });
    }
};

exports.getPlanByCustomer = async (req, res) => {
    try {
        const plan = await CustomerJobPlan.findOne({ customerId: req.params.customerId })
            .populate('customerId', 'name email avatar')
            .populate('assignedTo', 'name avatar role')
            .populate('tasks.assignedTo', 'name avatar');
        if (!plan) return res.status(404).json({ success: false, message: 'Plan bulunamadı.' });
        res.status(200).json({ success: true, data: plan });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Plan getirilemedi.', error: error.message });
    }
};

exports.createPlan = async (req, res) => {
    try {
        const plan = await CustomerJobPlan.create(req.body);
        res.status(201).json({ success: true, data: plan });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Plan oluşturulamadı.', error: error.message });
    }
};

exports.updatePlan = async (req, res) => {
    try {
        const plan = await CustomerJobPlan.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!plan) return res.status(404).json({ success: false, message: 'Plan bulunamadı.' });
        res.status(200).json({ success: true, data: plan });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Plan güncellenemedi.', error: error.message });
    }
};

exports.addTask = async (req, res) => {
    try {
        const plan = await CustomerJobPlan.findById(req.params.id);
        if (!plan) return res.status(404).json({ success: false, message: 'Plan bulunamadı.' });

        plan.tasks.push(req.body);
        await plan.save();
        res.status(201).json({ success: true, data: plan.tasks });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Görev eklenemedi.', error: error.message });
    }
};

exports.updateTask = async (req, res) => {
    try {
        const plan = await CustomerJobPlan.findById(req.params.id);
        if (!plan) return res.status(404).json({ success: false, message: 'Plan bulunamadı.' });

        const task = plan.tasks.id(req.params.taskId);
        if (!task) return res.status(404).json({ success: false, message: 'Görev bulunamadı.' });

        Object.assign(task, req.body);

        if (req.body.status === 'done' && !task.completedAt) {
            task.completedAt = new Date();
        } else if (req.body.status && req.body.status !== 'done') {
            task.completedAt = undefined;
        }

        await plan.save();
        res.status(200).json({ success: true, data: task });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Görev güncellenemedi.', error: error.message });
    }
};

exports.deleteTask = async (req, res) => {
    try {
        const plan = await CustomerJobPlan.findById(req.params.id);
        if (!plan) return res.status(404).json({ success: false, message: 'Plan bulunamadı.' });

        plan.tasks.pull({ _id: req.params.taskId });
        await plan.save();
        res.status(200).json({ success: true, data: plan.tasks });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Görev silinemedi.', error: error.message });
    }
};

exports.deletePlan = async (req, res) => {
    try {
        const plan = await CustomerJobPlan.findByIdAndDelete(req.params.id);
        if (!plan) return res.status(404).json({ success: false, message: 'Plan bulunamadı.' });
        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Plan silinemedi.', error: error.message });
    }
};
