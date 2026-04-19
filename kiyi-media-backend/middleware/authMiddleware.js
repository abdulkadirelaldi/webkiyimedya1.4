const jwt = require('jsonwebtoken');
const User = require('../models/User');
const asyncHandler = require('express-async-handler');

const ROLE_PERMISSIONS = {
    patron: [
        'manage_users', 'view_all_panels', 'manage_settings',
        'create_project', 'update_project', 'delete_project',
        'view_all_projects', 'view_prices', 'manage_accounting',
        'view_all_jobplans', 'manage_team_notes', 'upload_file', 'delete_file'
    ],
    yonetici: [
        'manage_settings', 'create_project', 'update_project', 'delete_project',
        'view_all_projects', 'view_prices', 'manage_accounting',
        'view_all_jobplans', 'manage_team_notes', 'upload_file', 'delete_file'
    ],
    stajyer: ['view_own_jobplan', 'manage_team_notes'],
    musteri: ['view_own_stats']
};

const protect = asyncHandler(async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select('-password');
            next();
        } catch (error) {
            const err = new Error('Yetkisiz erişim, token geçersiz');
            err.statusCode = 401;
            throw err;
        }
    }

    if (!token) {
        const err = new Error('Token bulunamadı, yetkisiz erişim');
        err.statusCode = 401;
        throw err;
    }
});

const checkPermission = (requiredPermission) => {
    return asyncHandler(async (req, res, next) => {
        if (!req.user) {
            const err = new Error('Kullanıcı bulunamadı');
            err.statusCode = 401;
            throw err;
        }

        const role = req.user.role;

        if (role === 'patron') {
            return next();
        }

        const permissions = ROLE_PERMISSIONS[role] || [];

        if (permissions.includes(requiredPermission)) {
            next();
        } else {
            const err = new Error(`Bu işlem için yetkiniz yok: ${requiredPermission}`);
            err.statusCode = 403;
            throw err;
        }
    });
};

module.exports = { protect, checkPermission };
