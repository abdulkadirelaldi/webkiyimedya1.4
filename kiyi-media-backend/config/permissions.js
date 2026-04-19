const PERMISSIONS = {
    MANAGE_USERS: 'manage_users',
    CREATE_PROJECT: 'create_project',
    UPDATE_PROJECT: 'update_project',
    DELETE_PROJECT: 'delete_project',
    UPLOAD_FILE: 'upload_file',
    DELETE_FILE: 'delete_file',
    VIEW_ALL_PROJECTS: 'view_all_projects',
    VIEW_OWN_PROJECTS: 'view_own_projects',
    VIEW_PRICES: 'view_prices',
    MANAGE_SETTINGS: 'manage_settings',
    MANAGE_ACCOUNTING: 'manage_accounting',
    VIEW_ALL_JOBPLANS: 'view_all_jobplans',
    MANAGE_TEAM_NOTES: 'manage_team_notes',
    VIEW_OWN_STATS: 'view_own_stats',
    VIEW_OWN_JOBPLAN: 'view_own_jobplan',
    VIEW_ALL_PANELS: 'view_all_panels'
};

const ROLES = {
    PATRON: 'patron',
    YONETICI: 'yonetici',
    STAJYER: 'stajyer',
    MUSTERI: 'musteri'
};

module.exports = { PERMISSIONS, ROLES };
