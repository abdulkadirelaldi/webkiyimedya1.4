// src/components/JobPlanning.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { SERVER_URL } from '../config';
import {
    Box, Typography, Grid, Card, CardContent, Button, IconButton,
    Dialog, DialogTitle, DialogContent, Stack, Chip, TextField, MenuItem,
    FormControl, InputLabel, Select, Paper, DialogActions,
    Tooltip, Fade, Tab, Tabs, List, LinearProgress, Alert, Zoom,
    Avatar, Divider, useTheme
} from '@mui/material';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import axios from 'axios';

// Context ve İzinler
import { useAuth } from '../context/AuthContext';
import { PERMISSIONS } from '../config/permissions';

// İKONLAR
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ViewKanbanIcon from '@mui/icons-material/ViewKanban';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import FilterListIcon from '@mui/icons-material/FilterList';
import BusinessIcon from '@mui/icons-material/Business';
import AssessmentIcon from '@mui/icons-material/Assessment';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import WarningIcon from '@mui/icons-material/Warning';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import NoteAltIcon from '@mui/icons-material/NoteAlt';
import SendIcon from '@mui/icons-material/Send';
import FolderIcon from '@mui/icons-material/Folder';
import DashboardCustomizeIcon from '@mui/icons-material/DashboardCustomize';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PieChartIcon from '@mui/icons-material/PieChart';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import CategoryIcon from '@mui/icons-material/Category';
import RateReviewIcon from '@mui/icons-material/RateReview';

// --- STRICT MODE DROPPABLE FIX ---
// React 18'de sürükle-bırak sorunu çözen özel bileşen
export const StrictModeDroppable = ({ children, ...props }) => {
    const [enabled, setEnabled] = useState(false);
    useEffect(() => {
        const animation = requestAnimationFrame(() => setEnabled(true));
        return () => {
            cancelAnimationFrame(animation);
            setEnabled(false);
        };
    }, []);
    if (!enabled) {
        return null;
    }
    return <Droppable {...props}>{children}</Droppable>;
};
// ---------------------------------

const JobPlanning = () => {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';

    // --- DİNAMİK RENK PALETİ ---
    const colors = {
        primary: theme.palette.primary.main,
        secondary: theme.palette.secondary.main,
        bg: theme.palette.background.default,
        paper: theme.palette.background.paper,
        textPrimary: theme.palette.text.primary,
        textSecondary: theme.palette.text.secondary,
        success: isDark ? '#66bb6a' : '#2e7d32',
        warning: isDark ? '#ffa726' : '#ed6c02',
        danger: isDark ? '#ef5350' : '#d32f2f',
        info: isDark ? '#42a5f5' : '#0288d1',
        cardBorder: theme.palette.divider,
        folderBg: isDark ? 'rgba(255,255,255,0.05)' : 'white',
        columnBg: isDark ? 'rgba(255,255,255,0.02)' : '#f4f6f8',
        charts: ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d']
    };

    // --- AUTH & PERMISSIONS ---
    const { hasPermission } = useAuth();
    const canCreate = hasPermission(PERMISSIONS.CREATE_PROJECT);
    const canUpdate = hasPermission(PERMISSIONS.UPDATE_PROJECT);
    const canDelete = hasPermission(PERMISSIONS.DELETE_PROJECT);

    // --- STATE ---
    const [currentTab, setCurrentTab] = useState(0);
    const [allJobs, setAllJobs] = useState({ yapilacaklar: [], yapiliyor: [], tamamlandi: [] });
    const [brands, setBrands] = useState([]);
    const [viewMode, setViewMode] = useState('projects');
    const [selectedBrand, setSelectedBrand] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [currentJobId, setCurrentJobId] = useState(null);
    const [taskForm, setTaskForm] = useState({ title: '', category: 'Genel', description: '', dueDate: '', status: 'yapilacaklar', portfolioId: '', assignedTo: '' });
    const [noteInput, setNoteInput] = useState('');
    const [editingNoteId, setEditingNoteId] = useState(null);
    const [allNotes, setAllNotes] = useState([]);

    useEffect(() => { fetchJobs(); fetchBrands(); fetchNotes(); }, []);

    // --- API CALLS ---
    const fetchJobs = async () => {
        try {
            const res = await axios.get(`${SERVER_URL}/api/jobs/all`);
            const organized = { yapilacaklar: [], yapiliyor: [], tamamlandi: [] };
            res.data.data.forEach(job => {
                if (job.category !== 'Not' && organized[job.status]) organized[job.status].push(job);
            });
            setAllJobs(organized);
        } catch (err) { console.error(err); }
    };

    const fetchBrands = async () => {
        try { const res = await axios.get(`${SERVER_URL}/api/portfolio`); setBrands(res.data.data); } catch (err) { console.error(err); }
    };

    const fetchNotes = async () => {
        try {
            const res = await axios.get(`${SERVER_URL}/api/jobs/all`);
            setAllNotes(res.data.data.filter(j => j.category === 'Not').sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
        } catch (err) { console.error(err); }
    };

    // --- JOB CARD ---
    const JobCard = ({ job, index, onEdit, onDelete, canEdit, canDelete, canDrag }) => {
        const isOverdue = job.dueDate && new Date(job.dueDate) < new Date() && job.status !== 'tamamlandi';
        const assignedUser = job.description.match(/^\[(.*?)\]/);
        const cleanDesc = job.description.replace(/^\[(.*?)\]/, '').trim();
        const userInitial = assignedUser ? assignedUser[1].charAt(0).toUpperCase() : '?';

        // DraggableID string olmak zorunda. Job ID'yi string'e çeviriyoruz.
        const dragId = String(job._id);

        return (
            <Draggable draggableId={dragId} index={index} isDragDisabled={!canDrag}>
                {(provided, snapshot) => (
                    <Card
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        sx={{
                            mb: 1.5, borderRadius: 3, bgcolor: colors.paper,
                            boxShadow: snapshot.isDragging ? 6 : 1,
                            borderLeft: `5px solid ${isOverdue ? colors.danger : (job.category === 'Revize' ? colors.warning : colors.primary)}`,
                            opacity: canDrag ? 1 : 0.9,
                            cursor: canDrag ? 'grab' : 'default',
                            // Sürüklerken pozisyon bozulmaması için:
                            ...provided.draggableProps.style,
                            '&:hover': { transform: canDrag ? 'translateY(-2px)' : 'none', transition: '0.2s', bgcolor: theme.palette.action.hover }
                        }}
                    >
                        <CardContent sx={{ p: '12px !important' }}>
                            <Stack direction="row" justifyContent="space-between" mb={1}>
                                {job.portfolioId ? (
                                    <Chip icon={<BusinessIcon sx={{ fontSize: 10 }} />} label={job.portfolioId.title} size="small" sx={{ height: 20, fontSize: 9, fontWeight: 'bold', bgcolor: isDark ? 'rgba(21, 101, 192, 0.2)' : '#e3f2fd', color: isDark ? '#90caf9' : colors.primary }} />
                                ) : <Chip label="Genel" size="small" sx={{ height: 20, fontSize: 9 }} />}
                                <Tooltip title={assignedUser ? `Sorumlu: ${assignedUser[1]}` : 'Atanmadı'}>
                                    <Avatar sx={{ width: 20, height: 20, fontSize: 10, bgcolor: assignedUser ? colors.secondary : theme.palette.action.disabledBackground }}>{userInitial}</Avatar>
                                </Tooltip>
                            </Stack>
                            <Typography variant="subtitle2" fontWeight="bold" color={colors.textPrimary} gutterBottom sx={{ lineHeight: 1.2 }}>{job.title}</Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', mb: 1 }}>{cleanDesc}</Typography>
                            <Stack direction="row" justifyContent="space-between" alignItems="center" mt={1} pt={1} borderTop={`1px solid ${theme.palette.divider}`}>
                                {job.dueDate ? (
                                    <Chip
                                        icon={<AccessTimeIcon sx={{ fontSize: 10 }} />}
                                        label={new Date(job.dueDate).toLocaleDateString('tr-TR', { month: 'short', day: 'numeric' })}
                                        size="small"
                                        sx={{
                                            height: 20, fontSize: 10,
                                            bgcolor: isOverdue ? (isDark ? 'rgba(211, 47, 47, 0.2)' : '#ffebee') : (isDark ? 'rgba(46, 125, 50, 0.2)' : '#f0f4c3'),
                                            color: isOverdue ? colors.danger : colors.success
                                        }}
                                    />
                                ) : <Box />}
                                <Box>
                                    {canEdit && <IconButton size="small" onClick={() => onEdit(job)}><EditIcon fontSize="small" color="action" /></IconButton>}
                                    {canDelete && <IconButton size="small" onClick={() => onDelete(job._id)}><DeleteIcon fontSize="small" color="disabled" /></IconButton>}
                                </Box>
                            </Stack>
                        </CardContent>
                    </Card>
                )}
            </Draggable>
        );
    };

    // --- HELPER COMPONENTS ---
    const StatCard = ({ title, value, icon, color, subtext }) => (
        <Card sx={{ height: '100%', borderRadius: 3, bgcolor: colors.paper, boxShadow: theme.shadows[2], position: 'relative', overflow: 'hidden', border: `1px solid ${colors.cardBorder}` }}>
            <Box sx={{ position: 'absolute', right: -10, top: -10, opacity: 0.1, transform: 'scale(1.5)', color: color }}>{icon}</Box>
            <CardContent>
                <Typography variant="overline" fontWeight="bold" color="text.secondary">{title}</Typography>
                <Typography variant="h4" fontWeight="900" sx={{ color: color, my: 1 }}>{value}</Typography>
                <Typography variant="caption" color="text.secondary">{subtext}</Typography>
            </CardContent>
        </Card>
    );

    const ProjectFolderCard = ({ title, count, onClick, isGeneral = false }) => (
        <Card
            onClick={onClick}
            sx={{
                height: '100%', borderRadius: 4, cursor: 'pointer',
                border: isGeneral ? `2px solid ${colors.primary}` : `1px solid ${colors.cardBorder}`,
                bgcolor: isGeneral ? (isDark ? 'rgba(21, 101, 192, 0.1)' : '#e3f2fd') : colors.folderBg,
                transition: 'all 0.3s ease',
                '&:hover': { transform: 'translateY(-5px)', boxShadow: theme.shadows[4] }
            }}
        >
            <CardContent sx={{ textAlign: 'center', py: 4 }}>
                <Avatar
                    sx={{
                        width: 60, height: 60, mx: 'auto', mb: 2,
                        bgcolor: isGeneral ? colors.primary : (isDark ? 'rgba(255,255,255,0.1)' : '#f5f5f5'),
                        color: isGeneral ? 'white' : colors.textPrimary
                    }}
                >
                    {isGeneral ? <DashboardCustomizeIcon fontSize="large" /> : <FolderIcon fontSize="large" />}
                </Avatar>
                <Typography variant="h6" fontWeight="bold" color={colors.textPrimary} gutterBottom>{title}</Typography>
                <Chip label={`${count} Aktif İş`} size="small" color={isGeneral ? "primary" : "default"} variant={isGeneral ? "filled" : "outlined"} sx={{ fontWeight: 'bold' }} />
            </CardContent>
        </Card>
    );

    // --- HANDLERS ---
    const handleOpenBrand = (brand) => { setSelectedBrand(brand); setViewMode('board'); };
    const handleBackToProjects = () => { setSelectedBrand(null); setViewMode('projects'); };

    const filteredJobs = useMemo(() => {
        if (selectedBrand === 'all') return allJobs;
        if (selectedBrand && typeof selectedBrand === 'object') {
            return {
                yapilacaklar: allJobs.yapilacaklar.filter(j => j.portfolioId?._id === selectedBrand._id),
                yapiliyor: allJobs.yapiliyor.filter(j => j.portfolioId?._id === selectedBrand._id),
                tamamlandi: allJobs.tamamlandi.filter(j => j.portfolioId?._id === selectedBrand._id),
            };
        }
        return { yapilacaklar: [], yapiliyor: [], tamamlandi: [] };
    }, [allJobs, selectedBrand]);

    const handleSaveTask = async () => {
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            const config = { headers: { Authorization: `Bearer ${user?.token}` } };
            let finalDesc = taskForm.description;
            if (taskForm.assignedTo) {
                finalDesc = finalDesc.replace(/^\[.*?\]\s*/, '');
                finalDesc = `[${taskForm.assignedTo}] ${finalDesc}`;
            }
            const payload = { ...taskForm, description: finalDesc, portfolioId: taskForm.portfolioId === '' ? null : taskForm.portfolioId };

            if (isEditMode) await axios.put(`${SERVER_URL}/api/jobs/${currentJobId}`, payload, config);
            else await axios.post(`${SERVER_URL}/api/jobs`, payload, config);

            setOpenModal(false);
            fetchJobs();
        } catch (err) { alert("İşlem başarısız: " + (err.response?.data?.error || err.message)); }
    };

    const handleDeleteTask = async (id, isNote = false) => {
        if (!canDelete) return alert("Silme yetkiniz yok.");
        if (window.confirm("Bu kaydı silmek istediğinize emin misiniz?")) {
            try {
                await axios.delete(`${SERVER_URL}/api/jobs/${id}`);
                if (isNote) { fetchNotes(); if (editingNoteId === id) setEditingNoteId(null); setNoteInput(''); }
                else { fetchJobs(); }
            } catch (err) { alert("Silme başarısız."); }
        }
    };

    const handleDragEnd = async (result) => {
        if (!canUpdate) return;
        const { source, destination, draggableId } = result;

        if (!destination) return;
        if (source.droppableId === destination.droppableId && source.index === destination.index) return;

        // İyimser UI Güncellemesi
        const newAllJobs = { ...allJobs };

        let movedJob;
        // Kaynak listeden sil (Ana liste üzerinden işlem yapıyoruz)
        // DİKKAT: Filtrelenmiş görünümde indeksler farklı olabilir, bu yüzden ID ile buluyoruz.
        const sourceList = newAllJobs[source.droppableId];
        const jobIndex = sourceList.findIndex(j => String(j._id) === draggableId);

        if (jobIndex > -1) {
            movedJob = sourceList[jobIndex];
            sourceList.splice(jobIndex, 1);
        } else {
            // Eğer ID ile bulunamadıysa (nadiren olur)
            return;
        }

        movedJob.status = destination.droppableId;
        newAllJobs[destination.droppableId].splice(destination.index, 0, movedJob);

        setAllJobs(newAllJobs);

        try {
            await axios.put(`${SERVER_URL}/api/jobs/${draggableId}`, { status: destination.droppableId });
        } catch (err) {
            console.error(err);
            fetchJobs(); // Hata varsa geri al
        }
    };

    const handleSendNote = async () => {
        if (!canUpdate) return alert("Not ekleme yetkiniz yok.");
        if (!noteInput.trim()) return;
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            const config = { headers: { Authorization: `Bearer ${user?.token}` } };
            if (editingNoteId) {
                await axios.put(`${SERVER_URL}/api/jobs/${editingNoteId}`, { description: noteInput }, config);
                setEditingNoteId(null);
            } else {
                await axios.post(`${SERVER_URL}/api/jobs`, { title: user?.name || 'Anonim', category: 'Not', description: noteInput, status: 'tamamlandi', dueDate: new Date() }, config);
            }
            setNoteInput('');
            fetchNotes();
        } catch (err) { alert("Not işlemi başarısız."); }
    };

    const openEdit = (job) => {
        if (!canUpdate) return;
        setIsEditMode(true);
        setCurrentJobId(job._id);
        const assignedMatch = job.description.match(/^\[(.*?)\]/);
        const cleanDesc = job.description.replace(/^\[.*?\]\s*/, '');
        setTaskForm({
            title: job.title, category: job.category, description: cleanDesc,
            dueDate: job.dueDate ? new Date(job.dueDate).toISOString().split('T')[0] : '',
            status: job.status, portfolioId: job.portfolioId?._id || '',
            assignedTo: assignedMatch ? assignedMatch[1] : ''
        });
        setOpenModal(true);
    };

    const openAdd = () => {
        if (!canCreate) return;
        setIsEditMode(false);
        setTaskForm({ title: '', category: 'Genel', description: '', dueDate: '', status: 'yapilacaklar', portfolioId: (selectedBrand && selectedBrand !== 'all') ? selectedBrand._id : '', assignedTo: '' });
        setOpenModal(true);
    }

    const flatJobs = useMemo(() => [...allJobs.yapilacaklar, ...allJobs.yapiliyor, ...allJobs.tamamlandi], [allJobs]);
    const stats = {
        total: flatJobs.length,
        active: flatJobs.filter(j => j.status !== 'tamamlandi').length,
        overdue: flatJobs.filter(j => j.dueDate && new Date(j.dueDate) < new Date() && j.status !== 'tamamlandi').length,
        revisions: flatJobs.filter(j => j.category === 'Revize' && j.status !== 'tamamlandi').length,
        completedMonth: flatJobs.filter(j => j.status === 'tamamlandi' && new Date(j.updatedAt).getMonth() === new Date().getMonth()).length
    };

    // Pipeline jobs useMemo
    const pipelineJobs = useMemo(() => ({
        yapilacaklar: allJobs.yapilacaklar.filter(j => j.category === 'Teklif'),
        yapiliyor: allJobs.yapiliyor.filter(j => j.category === 'Teklif'),
        tamamlandi: allJobs.tamamlandi.filter(j => j.category === 'Teklif')
    }), [allJobs]);


    return (
        <Box sx={{ width: '100%', minHeight: '100vh', pb: 5, bgcolor: colors.bg }}>
            <Paper elevation={0} sx={{ borderRadius: 0, borderBottom: `1px solid ${colors.cardBorder}`, px: 3, pt: 2, bgcolor: colors.paper }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                    <Box><Typography variant="h5" fontWeight="900" color={colors.primary}>Ajans Yönetim</Typography><Typography variant="body2" color="text.secondary">Tüm operasyon tek ekranda.</Typography></Box>
                    {canCreate && <Button variant="contained" startIcon={<AddIcon />} onClick={() => { setIsEditMode(false); setOpenModal(true); }} sx={{ bgcolor: colors.primary, borderRadius: 3 }}>Yeni İş Ekle</Button>}
                </Stack>
                <Tabs value={currentTab} onChange={(e, val) => setCurrentTab(val)} variant="scrollable" scrollButtons="auto" textColor="primary" indicatorColor="primary">
                    <Tab icon={<DashboardIcon fontSize="small" />} iconPosition="start" label="Dashboard" />
                    <Tab icon={<ViewKanbanIcon fontSize="small" />} iconPosition="start" label="Aktif İşler" />
                    <Tab icon={<CalendarMonthIcon fontSize="small" />} iconPosition="start" label="Aylık Takvim" />
                    <Tab icon={<FilterListIcon fontSize="small" />} iconPosition="start" label="Pipeline" />
                    <Tab icon={<RateReviewIcon fontSize="small" />} iconPosition="start" label="Revizeler" />
                    <Tab icon={<NoteAltIcon fontSize="small" />} iconPosition="start" label="Ekip Notları" />
                    <Tab icon={<AssessmentIcon fontSize="small" />} iconPosition="start" label="Raporlama" />
                </Tabs>
            </Paper>

            <Box sx={{ p: 3 }}>
                <Fade in={true} key={currentTab}>
                    <Box>
                        {/* 0. DASHBOARD */}
                        {currentTab === 0 && (
                            <Grid container spacing={3}>
                                <Grid item xs={6} md={3}><StatCard title="AKTİF İŞLER" value={stats.active} icon={<ViewKanbanIcon />} color={colors.primary} subtext="Mevcut Yük" /></Grid>
                                <Grid item xs={6} md={3}><StatCard title="GECİKEN" value={stats.overdue} icon={<WarningIcon />} color={colors.danger} subtext="Acil!" /></Grid>
                                <Grid item xs={6} md={3}><StatCard title="REVİZELER" value={stats.revisions} icon={<AssessmentIcon />} color={colors.warning} subtext="Bekleyen" /></Grid>
                                <Grid item xs={6} md={3}><StatCard title="BU AY BİTEN" value={stats.completedMonth} icon={<CheckCircleIcon />} color={colors.success} subtext="Başarılı" /></Grid>
                            </Grid>
                        )}

                        {/* 1. ACTIVE JOBS (KANBAN) */}
                        {currentTab === 1 && (
                            viewMode === 'projects' ? (
                                <Box>
                                    <Typography variant="h6" fontWeight="bold" color="text.secondary" mb={2}>Proje Klasörleri</Typography>
                                    <Grid container spacing={3}>
                                        <Grid item xs={12} sm={6} md={4} lg={3}><ProjectFolderCard title="GENEL BAKIŞ (TÜMÜ)" count={flatJobs.length} isGeneral={true} onClick={() => handleOpenBrand('all')} /></Grid>
                                        {brands.map(brand => {
                                            const count = allJobs.yapilacaklar.filter(j => j.portfolioId?._id === brand._id).length + allJobs.yapiliyor.filter(j => j.portfolioId?._id === brand._id).length;
                                            return <Grid item xs={12} sm={6} md={4} lg={3} key={brand._id}><Zoom in={true}><Box height="100%"><ProjectFolderCard title={brand.title} count={count} onClick={() => handleOpenBrand(brand)} /></Box></Zoom></Grid>;
                                        })}
                                    </Grid>
                                </Box>
                            ) : (
                                <Box>
                                    <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                                        <Stack direction="row" alignItems="center" spacing={2}><IconButton onClick={handleBackToProjects} sx={{ bgcolor: colors.paper }}><ArrowBackIcon /></IconButton><Typography variant="h5" fontWeight="bold" color={colors.primary}>{selectedBrand === 'all' ? 'Tüm İşler' : selectedBrand.title}</Typography></Stack>
                                        {canCreate && <Button variant="contained" startIcon={<AddIcon />} onClick={openAdd} sx={{ bgcolor: colors.primary, borderRadius: 3 }}>Yeni Görev</Button>}
                                    </Stack>

                                    {/* --- KANBAN BOARD --- */}
                                    <DragDropContext onDragEnd={handleDragEnd}>
                                        <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto', pb: 2 }}>
                                            {[{ id: 'yapilacaklar', title: '📋 Yapılacaklar', color: colors.danger }, { id: 'yapiliyor', title: '⚡ Devam Edenler', color: colors.info }, { id: 'tamamlandi', title: '✅ Tamamlananlar', color: colors.success }].map(col => (
                                                <Paper key={col.id} sx={{ minWidth: 320, bgcolor: colors.columnBg, borderRadius: 3, p: 2, border: `1px solid ${colors.cardBorder}` }}>
                                                    <Stack direction="row" mb={2}><Typography variant="subtitle2" fontWeight="bold" flexGrow={1} color={col.color}>{col.title}</Typography><Chip label={filteredJobs[col.id].length} size="small" /></Stack>

                                                    {/* BURADA STRICT MODE DROPPABLE KULLANIYORUZ */}
                                                    <StrictModeDroppable droppableId={col.id}>
                                                        {(provided) => (
                                                            <Box ref={provided.innerRef} {...provided.droppableProps} sx={{ minHeight: 100 }}>
                                                                {filteredJobs[col.id].map((job, index) => <JobCard key={job._id} job={job} index={index} onEdit={openEdit} onDelete={handleDeleteTask} canEdit={canUpdate} canDelete={canDelete} canDrag={canUpdate} />)}
                                                                {provided.placeholder}
                                                            </Box>
                                                        )}
                                                    </StrictModeDroppable>

                                                </Paper>
                                            ))}
                                        </Box>
                                    </DragDropContext>
                                </Box>
                            )
                        )}

                        {/* 2. MONTHLY CALENDAR */}
                        {currentTab === 2 && (
                            <Grid container spacing={1}>
                                {Array.from({ length: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate() }, (_, i) => i + 1).map(day => {
                                    const dayJobs = flatJobs.filter(j => j.dueDate && new Date(j.dueDate).getDate() === day && new Date(j.dueDate).getMonth() === new Date().getMonth());
                                    return <Grid item xs={12} sm={6} md={4} lg={2} key={day}><Paper sx={{ minHeight: 120, p: 1, bgcolor: dayJobs.length > 0 ? (isDark ? 'rgba(255,255,255,0.05)' : '#fcfcfc') : colors.paper, border: `1px solid ${colors.cardBorder}` }}><Typography align="right" fontWeight="bold" color="text.secondary">{day}</Typography><Stack spacing={0.5}>{dayJobs.map(job => <Tooltip key={job._id} title={job.title}><Chip label={job.title} size="small" onClick={() => canUpdate && openEdit(job)} sx={{ height: 22, fontSize: '0.7rem', justifyContent: 'flex-start', bgcolor: job.category === 'Revize' ? (isDark ? 'rgba(237, 108, 2, 0.2)' : '#ffebee') : (isDark ? 'rgba(2, 136, 209, 0.2)' : '#e3f2fd'), cursor: canUpdate ? 'pointer' : 'default', color: colors.textPrimary }} /></Tooltip>)}</Stack></Paper></Grid>;
                                })}
                            </Grid>
                        )}

                        {/* 3. PIPELINE VIEW */}
                        {currentTab === 3 && (
                            <DragDropContext onDragEnd={handleDragEnd}>
                                <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto', pb: 2 }}>{[{ id: 'yapilacaklar', title: '📞 Görüşülüyor' }, { id: 'yapiliyor', title: '💼 Teklif Aşamasında' }, { id: 'tamamlandi', title: '🤝 Anlaşıldı' }].map(col => (
                                    <Paper key={col.id} sx={{ minWidth: 300, bgcolor: colors.bg, borderRadius: 3, p: 2 }}>
                                        <Stack direction="row" mb={2}><Typography variant="subtitle2" fontWeight="bold" flexGrow={1}>{col.title}</Typography><Chip label={pipelineJobs[col.id].length} size="small" /></Stack>

                                        {/* BURADA DA STRICT MODE DROPPABLE */}
                                        <StrictModeDroppable droppableId={col.id}>
                                            {(provided) => (
                                                <Box ref={provided.innerRef} {...provided.droppableProps} sx={{ minHeight: 100 }}>
                                                    {pipelineJobs[col.id].map((job, index) => <JobCard key={job._id} job={job} index={index} onEdit={openEdit} onDelete={handleDeleteTask} canEdit={canUpdate} canDelete={canDelete} canDrag={canUpdate} />)}
                                                    {provided.placeholder}
                                                </Box>
                                            )}
                                        </StrictModeDroppable>

                                    </Paper>
                                ))}</Box>
                            </DragDropContext>
                        )}

                        {/* 4. REVISIONS */}
                        {currentTab === 4 && (
                            <Box>
                                <Grid container spacing={3}>
                                    <Grid item xs={12} md={3}><StatCard title="BEKLEYEN REVİZE" value={flatJobs.filter(j => j.category === 'Revize' && j.status !== 'tamamlandi').length} icon={<WarningIcon />} color={colors.warning} subtext="Acil ilgilenilmesi gereken" /></Grid>
                                    <Grid item xs={12} md={9}>
                                        <Box sx={{ bgcolor: colors.paper, p: 2, borderRadius: 2 }}>
                                            <Typography variant="h6" fontWeight="bold" gutterBottom color={colors.textPrimary}>⚠️ Bekleyen Revizeler</Typography>
                                            {flatJobs.filter(j => j.category === 'Revize' && j.status !== 'tamamlandi').map(job => (
                                                <Card key={job._id} sx={{ mb: 2, borderLeft: `6px solid ${colors.warning}`, bgcolor: colors.paper }}>
                                                    <CardContent>
                                                        <Grid container spacing={2} alignItems="center">
                                                            <Grid item xs={12} md={4}>
                                                                <Stack direction="row" spacing={1} mb={1}>
                                                                    {job.portfolioId ? <Chip label={job.portfolioId.title} size="small" sx={{ bgcolor: colors.primary, color: 'white', fontWeight: 'bold' }} /> : <Chip label="Genel" size="small" />}
                                                                    <Chip label="Düzeltme Bekliyor" size="small" color="warning" variant="outlined" />
                                                                </Stack>
                                                                <Typography variant="h6" fontWeight="bold" color={colors.textPrimary}>{job.title}</Typography>
                                                            </Grid>
                                                            <Grid item xs={12} md={5}>
                                                                <Paper elevation={0} sx={{ p: 2, bgcolor: isDark ? 'rgba(237, 108, 2, 0.1)' : '#fff3e0', borderRadius: 2 }}>
                                                                    <Typography variant="subtitle2" fontWeight="bold" color={colors.secondary} gutterBottom><WarningIcon sx={{ fontSize: 16, verticalAlign: 'middle', mr: 1 }} />İstenen Revize:</Typography>
                                                                    <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>{job.description.replace(/^\[.*?\]\s*/, '').trim()}</Typography>
                                                                </Paper>
                                                            </Grid>
                                                            <Grid item xs={12} md={3} sx={{ textAlign: { xs: 'left', md: 'right' } }}>
                                                                <Stack direction="row" justifyContent={{ xs: 'flex-start', md: 'flex-end' }} spacing={1}>
                                                                    {canUpdate && <IconButton onClick={() => openEdit(job)} color="primary" sx={{ bgcolor: isDark ? 'rgba(21, 101, 192, 0.2)' : '#e3f2fd' }}><EditIcon /></IconButton>}
                                                                    {canUpdate && (
                                                                        <Button variant="contained" size="small" color="success" startIcon={<CheckCircleIcon />} onClick={async () => {
                                                                            if (window.confirm('Revize tamamlandı olarak işaretlensin mi?')) {
                                                                                try { await axios.put(`${SERVER_URL}/api/jobs/${job._id}`, { status: 'tamamlandi' }); fetchJobs(); } catch (err) { alert('Hata oluştu'); }
                                                                            }
                                                                        }}>Tamamla</Button>
                                                                    )}
                                                                </Stack>
                                                            </Grid>
                                                        </Grid>
                                                    </CardContent>
                                                </Card>
                                            ))}
                                            {flatJobs.filter(j => j.category === 'Revize' && j.status !== 'tamamlandi').length === 0 && <Alert severity="success" sx={{ mb: 2 }}>Harika! Bekleyen revize bulunmuyor.</Alert>}
                                        </Box>
                                    </Grid>
                                </Grid>
                            </Box>
                        )}

                        {/* 5. TEAM NOTES */}
                        {currentTab === 5 && (
                            <Grid container spacing={3}>
                                {canUpdate && (
                                    <Grid item xs={12} md={4}>
                                        <Paper sx={{ p: 2, height: '100%', border: editingNoteId ? `2px solid ${colors.secondary}` : `1px solid ${colors.cardBorder}`, bgcolor: colors.paper }}>
                                            <Stack direction="row" justifyContent="space-between" mb={1}><Typography variant="h6" fontWeight="bold" color={colors.textPrimary}>{editingNoteId ? 'Notu Düzenle' : 'Yeni Not'}</Typography>{editingNoteId && <Button size="small" onClick={() => { setNoteInput(''); setEditingNoteId(null); }} color="error">İptal</Button>}</Stack>
                                            <TextField fullWidth multiline rows={4} placeholder="Notunuz..." value={noteInput} onChange={(e) => setNoteInput(e.target.value)} sx={{ mb: 2 }} />
                                            <Button fullWidth variant="contained" endIcon={<SendIcon />} onClick={handleSendNote}>{editingNoteId ? "Güncelle" : "Gönder"}</Button>
                                        </Paper>
                                    </Grid>
                                )}
                                <Grid item xs={12} md={canUpdate ? 8 : 12}><Paper sx={{ p: 3, maxHeight: 600, overflowY: 'auto', bgcolor: isDark ? 'rgba(255,255,255,0.05)' : '#fffde7' }}><List>{allNotes.map(note => <Paper key={note._id} elevation={1} sx={{ mb: 2, p: 2, borderLeft: `4px solid ${colors.primary}`, bgcolor: colors.paper }}><Stack direction="row" justifyContent="space-between" mb={1}><Stack direction="row" spacing={1}><Avatar sx={{ width: 24, height: 24, fontSize: 12 }}>{note.title.charAt(0)}</Avatar><Typography variant="subtitle2" fontWeight="bold" color={colors.textPrimary}>{note.title}</Typography></Stack><Typography variant="caption" color={colors.textSecondary}>{new Date(note.createdAt).toLocaleString('tr-TR')}</Typography></Stack><Typography variant="body2" color={colors.textPrimary} sx={{ whiteSpace: 'pre-wrap', mb: 1 }}>{note.description}</Typography><Stack direction="row" justifyContent="flex-end">{canUpdate && <IconButton size="small" onClick={() => { setNoteInput(note.description); setEditingNoteId(note._id); }}><EditIcon fontSize="small" /></IconButton>}{canDelete && <IconButton size="small" onClick={() => handleDeleteTask(note._id, true)}><DeleteIcon fontSize="small" /></IconButton>}</Stack></Paper>)}</List></Paper></Grid>
                            </Grid>
                        )}

                        {/* 6. REPORTING MODULE */}
                        {currentTab === 6 && (
                            <Box>
                                <Paper sx={{ p: 2, mb: 3, bgcolor: colors.paper, borderRadius: 3, border: `1px solid ${colors.cardBorder}` }}>
                                    <Stack direction="row" spacing={2} alignItems="center">
                                        <AssessmentIcon color="primary" fontSize="large" />
                                        <FormControl fullWidth variant="standard">
                                            <InputLabel sx={{ color: colors.textSecondary }}>Raporlanacak Firma / Müşteri Seçin</InputLabel>
                                            <Select
                                                defaultValue="all"
                                                label="Raporlanacak Firma"
                                                sx={{ color: colors.textPrimary }}
                                                onChange={() => { }}
                                            >
                                                <MenuItem value="all"><em>Tüm Ajans (Genel Bakış)</em></MenuItem>
                                                {brands.map(b => <MenuItem key={b._id} value={b._id}>{b.title}</MenuItem>)}
                                            </Select>
                                        </FormControl>
                                    </Stack>
                                </Paper>
                                <Alert severity="info">Raporlama modülü şu an sadece genel verileri göstermektedir.</Alert>
                            </Box>
                        )}
                    </Box>
                </Fade>
            </Box>

            <Dialog open={openModal} onClose={() => setOpenModal(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { bgcolor: colors.paper } }}>
                <DialogTitle sx={{ bgcolor: colors.primary, color: 'white' }}>{isEditMode ? 'Düzenle' : 'Yeni İş Ekle'}</DialogTitle>
                <DialogContent sx={{ mt: 2 }}>
                    <Stack spacing={3} mt={1}>
                        <TextField label="İş Başlığı" fullWidth required value={taskForm.title} onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })} />
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <FormControl fullWidth>
                                    <InputLabel>Tür</InputLabel>
                                    <Select value={taskForm.category} label="Tür" onChange={(e) => setTaskForm({ ...taskForm, category: e.target.value })}>
                                        <MenuItem value="Genel">📌 Genel</MenuItem>
                                        <MenuItem value="Video Çekim">🎥 Video Çekim</MenuItem>
                                        <MenuItem value="Fotoğraf Çekim">📸 Fotoğraf Çekim</MenuItem>
                                        <MenuItem value="Post Tasarım">🟦 Post Tasarım</MenuItem>
                                        <MenuItem value="Story Tasarım">🤳 Story Tasarım</MenuItem>
                                        <MenuItem value="Reels Montaj">🎬 Reels Montaj</MenuItem>
                                        <MenuItem value="Web Tasarım">🌐 Web Tasarım</MenuItem>
                                        <MenuItem value="Teklif">💰 Teklif</MenuItem>
                                        <MenuItem value="Revize">📝 Revize</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={6}>
                                <FormControl fullWidth>
                                    <InputLabel>Müşteri</InputLabel>
                                    <Select value={taskForm.portfolioId} label="Müşteri" onChange={(e) => setTaskForm({ ...taskForm, portfolioId: e.target.value })}>
                                        <MenuItem value="">-- Yok --</MenuItem>
                                        {brands.map(b => <MenuItem key={b._id} value={b._id}>{b.title}</MenuItem>)}
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>
                        <TextField label="Sorumlu Kişi" fullWidth value={taskForm.assignedTo} onChange={(e) => setTaskForm({ ...taskForm, assignedTo: e.target.value })} />
                        <TextField type="date" label="Termin" fullWidth InputLabelProps={{ shrink: true }} value={taskForm.dueDate} onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })} />
                        <TextField label="Açıklama" multiline rows={3} fullWidth value={taskForm.description} onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })} />
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={() => setOpenModal(false)} sx={{ color: colors.textSecondary }}>İptal</Button>
                    <Button variant="contained" onClick={handleSaveTask} sx={{ bgcolor: colors.primary }}>Kaydet</Button>
                </DialogActions>
            </Dialog >
        </Box >
    );
};

export default JobPlanning;