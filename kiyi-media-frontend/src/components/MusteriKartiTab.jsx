import React, { useState, useEffect, useCallback } from 'react';
import { SERVER_URL } from '../config';
import axios from 'axios';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import {
    Box, Typography, Grid, Card, CardContent, Button, IconButton, Dialog,
    DialogTitle, DialogContent, DialogActions, TextField, Tabs, Tab, Stack,
    Chip, LinearProgress, Paper, Avatar, Tooltip, MenuItem, Select,
    FormControl, InputLabel, Switch, FormControlLabel, CircularProgress,
    Divider, Badge
} from '@mui/material';

import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import BusinessIcon from '@mui/icons-material/Business';
import PersonIcon from '@mui/icons-material/Person';
import EventIcon from '@mui/icons-material/Event';
import InstagramIcon from '@mui/icons-material/Instagram';
import WebIcon from '@mui/icons-material/Web';
import BrushIcon from '@mui/icons-material/Brush';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import WarningIcon from '@mui/icons-material/Warning';
import PaymentsIcon from '@mui/icons-material/Payments';
import ViewKanbanIcon from '@mui/icons-material/ViewKanban';
import SaveIcon from '@mui/icons-material/Save';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import FlagIcon from '@mui/icons-material/Flag';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import CampaignIcon from '@mui/icons-material/Campaign';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import MessageIcon from '@mui/icons-material/Message';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import CommentIcon from '@mui/icons-material/Comment';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ShareIcon from '@mui/icons-material/Share';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LinkIcon from '@mui/icons-material/Link';
import FolderIcon from '@mui/icons-material/Folder';
import YouTubeIcon from '@mui/icons-material/YouTube';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import FacebookIcon from '@mui/icons-material/Facebook';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import GridViewIcon from '@mui/icons-material/GridView';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import MovieIcon from '@mui/icons-material/Movie';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import ContactPageIcon from '@mui/icons-material/ContactPage';
import ArticleIcon from '@mui/icons-material/Article';
import SignpostIcon from '@mui/icons-material/Signpost';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';

const API = `${SERVER_URL}/api/customer-cards`;

const authHeader = () => {
    try {
        const u = JSON.parse(localStorage.getItem('user') || '{}');
        return { Authorization: `Bearer ${u.token || ''}` };
    } catch { return { Authorization: '' }; }
};

// ─── SABITLER ─────────────────────────────────────────────────────────────────

const COLUMNS = [
    { key: 'yapilacak',  label: 'Yapılacak',    color: '#64748B', bg: '#F8FAFC' },
    { key: 'devam',      label: 'Devam Ediyor', color: '#3B82F6', bg: '#EFF6FF' },
    { key: 'tamamlandi', label: 'Tamamlandı',   color: '#10B981', bg: '#F0FDF4' },
    { key: 'beklemede',  label: 'Beklemede',    color: '#F59E0B', bg: '#FFFBEB' },
];

const PRIORITY = {
    dusuk:  { label: 'Düşük',  color: '#94A3B8' },
    orta:   { label: 'Orta',   color: '#F59E0B' },
    yuksek: { label: 'Yüksek', color: '#EF4444' },
};

const PAY_STATUS = {
    bekliyor: { label: 'Bekliyor', color: '#3B82F6' },
    odendi:   { label: 'Ödendi',   color: '#10B981' },
    gecikti:  { label: 'Gecikti',  color: '#EF4444' },
};

const WORK_TYPES = ['toplanti', 'post', 'reels', 'story', 'web_teslim', 'kimlik_teslim', 'diger'];
const WORK_TYPE_LABELS = { toplanti: 'Toplantı', post: 'Post', reels: 'Reels', story: 'Story', web_teslim: 'Web Teslim', kimlik_teslim: 'Kimlik Teslim', diger: 'Diğer' };

const fmt = d => d ? new Date(d).toLocaleDateString('tr-TR') : '—';
const fmtMoney = n => n ? `₺${Number(n).toLocaleString('tr-TR')}` : '₺0';

// ─── TÜM HİZMETLER ───────────────────────────────────────────────────────────
const ALL_SERVICE_ITEMS = [
    { field: 'websiteActive',           prog: 'websiteProgress',           log: 'websiteProgressLog',           pkgField: 'websiteIncluded',           label: 'Web Sitesi',      color: '#10B981', icon: <WebIcon sx={{ color: '#10B981', fontSize: 18 }} /> },
    { field: 'corporateIdentityActive', prog: 'corporateIdentityProgress', log: 'corporateIdentityProgressLog', pkgField: 'corporateIdentityIncluded', label: 'Kurumsal Kimlik', color: '#F59E0B', icon: <BrushIcon sx={{ color: '#F59E0B', fontSize: 18 }} /> },
    { field: 'katalogActive',           prog: 'katalogProgress',           log: 'katalogProgressLog',           pkgField: 'katalogIncluded',           label: 'Katalog',         color: '#8B5CF6', icon: <MenuBookIcon sx={{ color: '#8B5CF6', fontSize: 18 }} /> },
    { field: 'qrMenuActive',            prog: 'qrMenuProgress',            log: 'qrMenuProgressLog',            pkgField: 'qrMenuIncluded',            label: 'QR Menü',         color: '#06B6D4', icon: <QrCode2Icon sx={{ color: '#06B6D4', fontSize: 18 }} /> },
    { field: 'kartvizitActive',         prog: 'kartvizitProgress',         log: 'kartvizitProgressLog',         pkgField: 'kartvizitIncluded',         label: 'Kartvizit',       color: '#3B82F6', icon: <ContactPageIcon sx={{ color: '#3B82F6', fontSize: 18 }} /> },
    { field: 'brosurActive',            prog: 'brosurProgress',            log: 'brosurProgressLog',            pkgField: 'brosurIncluded',            label: 'Broşür',          color: '#F97316', icon: <ArticleIcon sx={{ color: '#F97316', fontSize: 18 }} /> },
    { field: 'tabelaActive',            prog: 'tabelaProgress',            log: 'tabelaProgressLog',            pkgField: 'tabelaIncluded',            label: 'Tabela',          color: '#EF4444', icon: <SignpostIcon sx={{ color: '#EF4444', fontSize: 18 }} /> },
    { field: 'videoActive',             prog: 'videoProgress',             log: 'videoProgressLog',             pkgField: 'videoIncluded',             label: 'Video',           color: '#EC4899', icon: <VideoLibraryIcon sx={{ color: '#EC4899', fontSize: 18 }} /> },
];

const emptyCard = {
    businessName: '', sector: '', userId: '', packageRef: '', packageLabel: '', agreedPrice: 0,
    firstMeetingDate: '', agreementDate: '',
    contacts: [], payments: [], adCampaigns: [],
    currentPeriod: { posts: [], stories: [], reels: [], periodNo: 1, startDate: '', endDate: '' },
    socialHistory: [],
    websiteActive: false, websiteProgress: 0, websiteProgressLog: [],
    corporateIdentityActive: false, corporateIdentityProgress: 0, corporateIdentityProgressLog: [],
    katalogActive: false, katalogProgress: 0, katalogProgressLog: [],
    qrMenuActive: false, qrMenuProgress: 0, qrMenuProgressLog: [],
    kartvizitActive: false, kartvizitProgress: 0, kartvizitProgressLog: [],
    brosurActive: false, brosurProgress: 0, brosurProgressLog: [],
    tabelaActive: false, tabelaProgress: 0, tabelaProgressLog: [],
    videoActive: false, videoProgress: 0, videoProgressLog: [],
    meetings: [], revisions: [], kanban: [],
    kanbanPeriod: { periodNo: 1, startDate: '', endDate: '' },
    kanbanHistory: [],
    notes: '',
    driveLink: '', instagramLink: '', facebookLink: '', twitterLink: '',
    linkedinLink: '', tiktokLink: '', websiteLink: '', youtubeLink: ''
};

// ─── STRICT MODE DROPPABLE FIX ────────────────────────────────────────────────
const StrictModeDroppable = ({ children, ...props }) => {
    const [enabled, setEnabled] = useState(false);
    useEffect(() => {
        const id = requestAnimationFrame(() => setEnabled(true));
        return () => { cancelAnimationFrame(id); setEnabled(false); };
    }, []);
    if (!enabled) return null;
    return <Droppable {...props}>{children}</Droppable>;
};

// ─── ÖZET KART ────────────────────────────────────────────────────────────────
const SECTOR_COLORS = ['#3B82F6','#8B5CF6','#10B981','#F59E0B','#EF4444','#06B6D4','#EC4899'];
const sectorColor = (name) => SECTOR_COLORS[(name || '').charCodeAt(0) % SECTOR_COLORS.length];

const SummaryCard = ({ card, onClick, onDelete, readOnly }) => {
    const totalPaid = (card.payments || []).filter(p => p.status === 'odendi').reduce((s, p) => s + (p.amount || 0), 0);
    const overdue   = (card.payments || []).filter(p => p.status === 'gecikti').length;
    const kanbanDone  = (card.kanban || []).filter(k => k.column === 'tamamlandi').length;
    const kanbanTotal = (card.kanban || []).length;
    const accentColor = sectorColor(card.businessName);
    const initials = (card.businessName || '?').split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();

    return (
        <Card onClick={onClick} sx={{
            height: '100%', borderRadius: '16px', cursor: 'pointer', boxShadow: 'none',
            border: '1.5px solid #E8EDF5', transition: 'all 0.22s cubic-bezier(.4,0,.2,1)',
            '&:hover': { transform: 'translateY(-3px)', boxShadow: `0 12px 40px ${accentColor}18`, borderColor: accentColor }
        }}>
            <CardContent sx={{ p: 0, display: 'flex', flexDirection: 'column', height: '100%', '&:last-child': { pb: 0 } }}>
                {/* Renkli üst şerit */}
                <Box sx={{ height: 4, borderRadius: '16px 16px 0 0', background: `linear-gradient(90deg, ${accentColor}, ${accentColor}88)` }} />

                <Box sx={{ p: 2.5, display: 'flex', flexDirection: 'column', gap: 2, flex: 1 }}>
                    {/* Başlık satırı */}
                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                        <Stack direction="row" spacing={1.5} alignItems="center">
                            <Box sx={{ width: 42, height: 42, borderRadius: '12px', bgcolor: accentColor + '15',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                <Typography fontWeight={800} fontSize="0.95rem" sx={{ color: accentColor }}>{initials}</Typography>
                            </Box>
                            <Box>
                                <Typography fontWeight={700} fontSize="0.92rem" color="#0F172A" lineHeight={1.3}>{card.businessName}</Typography>
                                <Typography variant="caption" color="#94A3B8" fontWeight={500}>{card.sector || 'Sektör belirtilmedi'}</Typography>
                            </Box>
                        </Stack>
                        {!readOnly && (
                            <IconButton size="small" onClick={e => { e.stopPropagation(); onDelete(card._id); }}
                                sx={{ color: '#CBD5E1', '&:hover': { color: '#EF4444', bgcolor: '#FEF2F2' }, borderRadius: '8px' }}>
                                <DeleteIcon sx={{ fontSize: 16 }} />
                            </IconButton>
                        )}
                    </Stack>

                    {/* Paket chip */}
                    {card.packageLabel && (
                        <Chip label={card.packageLabel} size="small"
                            sx={{ bgcolor: accentColor + '12', color: accentColor, fontWeight: 600, fontSize: '0.7rem',
                                  borderRadius: '6px', alignSelf: 'flex-start', border: `1px solid ${accentColor}30` }} />
                    )}

                    {/* İlerleme çubukları — sadece aktif hizmetler */}
                    {ALL_SERVICE_ITEMS.some(s => card[s.field]) && (
                        <Stack spacing={1}>
                            {ALL_SERVICE_ITEMS.filter(s => card[s.field]).map(svc => (
                                <Box key={svc.field}>
                                    <Stack direction="row" justifyContent="space-between" mb={0.4}>
                                        <Typography variant="caption" color="#64748B" fontWeight={500}>{svc.label}</Typography>
                                        <Typography variant="caption" fontWeight={700} color={svc.color}>%{card[svc.prog] || 0}</Typography>
                                    </Stack>
                                    <LinearProgress variant="determinate" value={card[svc.prog] || 0}
                                        sx={{ height: 5, borderRadius: 3, bgcolor: svc.color + '18', '& .MuiLinearProgress-bar': { bgcolor: svc.color, borderRadius: 3 } }} />
                                </Box>
                            ))}
                        </Stack>
                    )}

                    {/* Alt bilgi satırı */}
                    <Stack direction="row" justifyContent="space-between" alignItems="center" mt="auto" pt={1.5}
                        sx={{ borderTop: '1px solid #F1F5F9' }}>
                        <Stack direction="row" spacing={1}>
                            {kanbanTotal > 0 && (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.4 }}>
                                    <ViewKanbanIcon sx={{ fontSize: 13, color: '#94A3B8' }} />
                                    <Typography variant="caption" color="#64748B" fontWeight={600}>{kanbanDone}/{kanbanTotal}</Typography>
                                </Box>
                            )}
                            {overdue > 0 && (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.4 }}>
                                    <WarningIcon sx={{ fontSize: 13, color: '#EF4444' }} />
                                    <Typography variant="caption" color="#EF4444" fontWeight={700}>{overdue} gecikmiş</Typography>
                                </Box>
                            )}
                        </Stack>
                        {card.agreedPrice > 0 && (
                            <Typography variant="caption" fontWeight={700} color="#64748B">
                                {fmtMoney(totalPaid)} <Box component="span" sx={{ opacity: 0.5 }}>/ {fmtMoney(card.agreedPrice)}</Box>
                            </Typography>
                        )}
                    </Stack>
                </Box>
            </CardContent>
        </Card>
    );
};

// ─── KANBAN BOARD ─────────────────────────────────────────────────────────────
const PRIORITY_ORDER = { yuksek: 0, orta: 1, dusuk: 2 };
const sortByPriority = (tasks) => [...tasks].sort((a, b) => {
    const diff = (PRIORITY_ORDER[a.priority] ?? 1) - (PRIORITY_ORDER[b.priority] ?? 1);
    return diff !== 0 ? diff : (a.order || 0) - (b.order || 0);
});

const emptyTask = { title: '', description: '', priority: 'orta', dueDate: '', dueTime: '', assignees: [] };

// ─── GÖREV FORMU (dışarıda tanımlanmalı — içeride tanımlanırsa her render'da yeniden mount olur) ──
const TaskForm = ({ value, setValue, onConfirm, onCancel, confirmLabel, users = [] }) => {
    const getUserName = (id) => {
        const u = users.find(u => u._id === id || u._id === (id?._id));
        return u ? u.name : null;
    };
    return (
        <Stack spacing={1.5}>
            <TextField fullWidth size="small" placeholder="Görev başlığı *" value={value.title} onChange={e => setValue({ ...value, title: e.target.value })} autoFocus />
            <TextField fullWidth size="small" placeholder="Açıklama (opsiyonel)" value={value.description || ''} onChange={e => setValue({ ...value, description: e.target.value })} multiline rows={2} />
            <Grid container spacing={1}>
                <Grid item xs={6}>
                    <FormControl fullWidth size="small">
                        <InputLabel>Öncelik</InputLabel>
                        <Select value={value.priority || 'orta'} onChange={e => setValue({ ...value, priority: e.target.value })} label="Öncelik">
                            <MenuItem value="yuksek"><Box component="span" sx={{ color: '#EF4444', fontWeight: 700 }}>● Yüksek</Box></MenuItem>
                            <MenuItem value="orta"><Box component="span" sx={{ color: '#F59E0B', fontWeight: 700 }}>● Orta</Box></MenuItem>
                            <MenuItem value="dusuk"><Box component="span" sx={{ color: '#94A3B8', fontWeight: 700 }}>● Düşük</Box></MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={6}>
                    <FormControl fullWidth size="small">
                        <InputLabel>Sütun</InputLabel>
                        <Select value={value.column || 'yapilacak'} onChange={e => setValue({ ...value, column: e.target.value })} label="Sütun">
                            {COLUMNS.map(c => <MenuItem key={c.key} value={c.key}>{c.label}</MenuItem>)}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={6}>
                    <TextField fullWidth size="small" type="date" label="Termin Tarihi" value={value.dueDate ? String(value.dueDate).substring(0, 10) : ''} onChange={e => setValue({ ...value, dueDate: e.target.value })} InputLabelProps={{ shrink: true }} />
                </Grid>
                <Grid item xs={6}>
                    <TextField fullWidth size="small" type="time" label="Saat" value={value.dueTime || ''} onChange={e => setValue({ ...value, dueTime: e.target.value })} InputLabelProps={{ shrink: true }} />
                </Grid>
            </Grid>
            {users.length > 0 && (
                <FormControl fullWidth size="small">
                    <InputLabel>Sorumlu Kullanıcılar</InputLabel>
                    <Select
                        multiple
                        value={value.assignees || []}
                        onChange={e => setValue({ ...value, assignees: e.target.value })}
                        label="Sorumlu Kullanıcılar"
                        renderValue={(selected) => (
                            <Stack direction="row" spacing={0.5} flexWrap="wrap">
                                {selected.map(id => {
                                    const name = getUserName(id);
                                    return name ? <Chip key={id} label={name} size="small" sx={{ height: 18, fontSize: '0.65rem' }} /> : null;
                                })}
                            </Stack>
                        )}
                    >
                        {users.map(u => <MenuItem key={u._id} value={u._id}>{u.name} — {u.role}</MenuItem>)}
                    </Select>
                </FormControl>
            )}
            <Stack direction="row" spacing={1}>
                <Button size="small" variant="contained" onClick={onConfirm} disabled={!value.title?.trim()} sx={{ flex: 1, bgcolor: '#0F172A', '&:hover': { bgcolor: '#1E293B' } }}>{confirmLabel}</Button>
                <Button size="small" onClick={onCancel}>İptal</Button>
            </Stack>
        </Stack>
    );

};

const KanbanBoard = ({ tasks, onChange, readOnly, users = [] }) => {
    const [addingCol, setAddingCol] = useState(null);
    const [newTask, setNewTask] = useState(emptyTask);
    const [editTask, setEditTask] = useState(null);

    const onDragEnd = (result) => {
        if (!result.destination || readOnly) return;
        const { draggableId, destination } = result;
        const updated = tasks.map(t =>
            t._id === draggableId || t.tempId === draggableId
                ? { ...t, column: destination.droppableId }
                : t
        );
        onChange(updated);
    };

    const addTask = (col) => {
        if (!newTask.title.trim()) return;
        const task = { ...newTask, column: col, tempId: Date.now().toString(), order: tasks.length };
        onChange([...tasks, task]);
        setNewTask(emptyTask);
        setAddingCol(null);
    };

    const removeTask = (id) => onChange(tasks.filter(t => (t._id || t.tempId) !== id));

    const saveEdit = () => {
        onChange(tasks.map(t => (t._id || t.tempId) === (editTask._id || editTask.tempId) ? editTask : t));
        setEditTask(null);
    };

    const isOverdue = (t) => t.dueDate && new Date(t.dueDate) < new Date() && t.column !== 'tamamlandi';

    const getUserName = (id) => {
        const u = users.find(u => u._id === id || u._id === (id?._id));
        return u ? u.name : null;
    };

    return (
        <>
            <DragDropContext onDragEnd={onDragEnd}>
                <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto', pb: 2, minHeight: 400 }}>
                    {COLUMNS.map(col => {
                        const colTasks = sortByPriority(tasks.filter(t => t.column === col.key));
                        return (
                            <Box key={col.key} sx={{ minWidth: 250, flex: 1 }}>
                                <Box sx={{ mb: 1.5, px: 1.5, py: 1, borderRadius: '10px', bgcolor: col.bg, border: `1px solid ${col.color}25` }}>
                                    <Stack direction="row" alignItems="center" justifyContent="space-between">
                                        <Stack direction="row" alignItems="center" spacing={1}>
                                            <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: col.color }} />
                                            <Typography fontWeight={700} fontSize="0.82rem" color={col.color}>{col.label}</Typography>
                                            <Box sx={{ bgcolor: col.color + '25', color: col.color, borderRadius: '5px', px: 0.8, py: 0.1 }}>
                                                <Typography fontSize="0.7rem" fontWeight={800}>{colTasks.length}</Typography>
                                            </Box>
                                        </Stack>
                                        {!readOnly && (
                                            <IconButton size="small" onClick={() => { setNewTask({ ...emptyTask, column: col.key }); setAddingCol(col.key); }}
                                                sx={{ color: col.color, bgcolor: col.color + '15', borderRadius: '6px', p: 0.4,
                                                      '&:hover': { bgcolor: col.color + '30' } }}>
                                                <AddIcon sx={{ fontSize: 16 }} />
                                            </IconButton>
                                        )}
                                    </Stack>
                                </Box>

                                <StrictModeDroppable droppableId={col.key}>
                                    {(provided, snapshot) => (
                                        <Box ref={provided.innerRef} {...provided.droppableProps}
                                            sx={{ minHeight: 200, borderRadius: 2, p: 1, bgcolor: snapshot.isDraggingOver ? col.bg : 'transparent', transition: 'background 0.2s', border: `2px dashed ${snapshot.isDraggingOver ? col.color : 'transparent'}` }}>
                                            {colTasks.map((task, idx) => {
                                                const overdue = isOverdue(task);
                                                const assigneeNames = (task.assignees || []).map(id => getUserName(id)).filter(Boolean);
                                                return (
                                                    <Draggable key={task._id || task.tempId} draggableId={task._id || task.tempId} index={idx} isDragDisabled={readOnly}>
                                                        {(prov, snap) => (
                                                            <Paper ref={prov.innerRef} {...prov.draggableProps}
                                                                sx={{ mb: 1.5, p: 1.5, borderRadius: '12px',
                                                                    borderLeft: `3px solid ${PRIORITY[task.priority]?.color || '#CBD5E1'}`,
                                                                    border: overdue ? `1px solid #FECACA` : '1px solid #EEF2F7',
                                                                    borderLeft: `3px solid ${PRIORITY[task.priority]?.color || '#CBD5E1'}`,
                                                                    bgcolor: snap.isDragging ? '#F8FBFF' : overdue ? '#FFF9F9' : '#fff',
                                                                    boxShadow: snap.isDragging ? '0 12px 32px rgba(15,23,42,0.15)' : '0 1px 3px rgba(15,23,42,0.04)',
                                                                    cursor: readOnly ? 'default' : 'grab' }}>
                                                                <Stack direction="row" alignItems="flex-start" justifyContent="space-between">
                                                                    {!readOnly && <Box {...prov.dragHandleProps} sx={{ color: '#CBD5E1', mr: 0.5, mt: 0.3 }}><DragIndicatorIcon fontSize="small" /></Box>}
                                                                    <Box flex={1} minWidth={0}>
                                                                        <Stack direction="row" alignItems="center" spacing={0.5} mb={0.3}>
                                                                            <FlagIcon sx={{ fontSize: 12, color: PRIORITY[task.priority]?.color || '#CBD5E1' }} />
                                                                            <Typography variant="body2" fontWeight={700} color="#0F172A" sx={{ wordBreak: 'break-word' }}>{task.title}</Typography>
                                                                        </Stack>
                                                                        {task.description && <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 0.5, pl: 2 }}>{task.description}</Typography>}
                                                                        <Stack direction="row" spacing={0.5} mt={0.5} alignItems="center" flexWrap="wrap" useFlexGap>
                                                                            {task.dueDate && (
                                                                                <Chip size="small"
                                                                                    label={`${fmt(task.dueDate)}${task.dueTime ? ' ' + task.dueTime : ''}`}
                                                                                    sx={{ height: 17, fontSize: '0.62rem', bgcolor: overdue ? '#FEF2F2' : '#F8FAFC', color: overdue ? '#EF4444' : '#64748B', fontWeight: overdue ? 700 : 400 }} />
                                                                            )}
                                                                        </Stack>
                                                                        {assigneeNames.length > 0 && (
                                                                            <Stack direction="row" spacing={0.4} mt={0.6} flexWrap="wrap">
                                                                                {assigneeNames.map((name, i) => (
                                                                                    <Chip key={i} avatar={<Box sx={{ width: 14, height: 14, borderRadius: '50%', bgcolor: '#3B82F6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Typography sx={{ fontSize: '0.55rem', color: '#fff', fontWeight: 800 }}>{name.charAt(0)}</Typography></Box>}
                                                                                        label={name} size="small"
                                                                                        sx={{ height: 18, fontSize: '0.62rem', bgcolor: '#EFF6FF', color: '#3B82F6' }} />
                                                                                ))}
                                                                            </Stack>
                                                                        )}
                                                                    </Box>
                                                                    {!readOnly && (
                                                                        <Stack>
                                                                            <IconButton size="small" onClick={() => setEditTask({ ...task, dueDate: task.dueDate ? String(task.dueDate).substring(0, 10) : '' })} sx={{ p: 0.3 }}><EditIcon sx={{ fontSize: 14, color: '#94A3B8' }} /></IconButton>
                                                                            <IconButton size="small" onClick={() => removeTask(task._id || task.tempId)} sx={{ p: 0.3 }}><DeleteIcon sx={{ fontSize: 14, color: '#EF4444' }} /></IconButton>
                                                                        </Stack>
                                                                    )}
                                                                </Stack>
                                                            </Paper>
                                                        )}
                                                    </Draggable>
                                                );
                                            })}
                                            {provided.placeholder}

                                            {addingCol === col.key && (
                                                <Paper sx={{ p: 1.5, borderRadius: '12px', border: '1px solid #3B82F6' }}>
                                                    <TaskForm value={newTask} setValue={setNewTask} onConfirm={() => addTask(col.key)} onCancel={() => setAddingCol(null)} confirmLabel="Ekle" users={users} />
                                                </Paper>
                                            )}
                                        </Box>
                                    )}
                                </StrictModeDroppable>
                            </Box>
                        );
                    })}
                </Box>
            </DragDropContext>

            {/* Görev Düzenleme Dialogu */}
            <Dialog open={Boolean(editTask)} onClose={() => setEditTask(null)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
                <DialogTitle fontWeight={800}>Görevi Düzenle</DialogTitle>
                <DialogContent>
                    {editTask && <TaskForm value={editTask} setValue={setEditTask} onConfirm={saveEdit} onCancel={() => setEditTask(null)} confirmLabel="Kaydet" users={users} />}
                </DialogContent>
            </Dialog>
        </>
    );
};

// ─── İLERLEME GÜNCELLEME FORMU ───────────────────────────────────────────────
const ProgressUpdateForm = ({ color, currentProg, onUpdate }) => {
    const [prog, setProg] = useState(currentProg);
    const [note, setNote] = useState('');

    useEffect(() => { setProg(currentProg); }, [currentProg]);

    const handle = () => {
        if (!note.trim()) return;
        onUpdate(prog, note.trim());
        setNote('');
    };

    return (
        <Paper sx={{ p: 2, borderRadius: 2, bgcolor: '#F8FAFC', border: `1px dashed ${color}60` }}>
            <Typography variant="caption" fontWeight={700} color="text.secondary" display="block" mb={1.5} textTransform="uppercase" letterSpacing="0.06em">İlerleme Güncelle</Typography>
            <Stack spacing={1.5}>
                <Stack direction="row" spacing={1.5} alignItems="center">
                    <TextField type="number" label="Yeni %" value={prog}
                        onChange={e => setProg(Math.min(100, Math.max(0, Number(e.target.value))))}
                        size="small" sx={{ width: 110 }} inputProps={{ min: 0, max: 100 }} />
                    <LinearProgress variant="determinate" value={prog}
                        sx={{ flex: 1, height: 8, borderRadius: 4, bgcolor: color + '20', '& .MuiLinearProgress-bar': { bgcolor: color } }} />
                    <Typography fontWeight={700} sx={{ color, minWidth: 36 }}>%{prog}</Typography>
                </Stack>
                <TextField fullWidth size="small" label="Ne yapıldı?" multiline rows={2}
                    value={note} onChange={e => setNote(e.target.value)}
                    placeholder="Bu aşamada yapılanları kısaca açıklayın..." />
                <Button variant="contained" onClick={handle} disabled={!note.trim()}
                    sx={{ alignSelf: 'flex-end', bgcolor: color, '&:hover': { bgcolor: color, filter: 'brightness(0.9)' }, fontWeight: 700 }}>
                    Güncelle
                </Button>
            </Stack>
        </Paper>
    );
};

// ─── DETAY SAYFASI ────────────────────────────────────────────────────────────
const CardDetail = ({ card: initialCard, onBack, onSaved, users, readOnly }) => {
    const [card, setCard] = useState(initialCard);
    const [packages, setPackages] = useState([]);
    const [tab, setTab] = useState(0);
    const [saving, setSaving] = useState(false);
    const [dirty, setDirty] = useState(false);
    const [meetingDialog, setMeetingDialog] = useState(false);
    const [editingMeeting, setEditingMeeting] = useState(null);
    const emptyMeeting = { date: '', time: '', location: '', title: '', notes: '', isPast: false };
    const [revisionDialog, setRevisionDialog] = useState(false);
    const [editingRevision, setEditingRevision] = useState(null);
    const emptyRevision = { receivedAt: '', description: '', dueDate: '', category: 'diger' };
    const [adDialog, setAdDialog] = useState(false);
    const [editingAd, setEditingAd] = useState(null);
    const emptyAd = { name: '', platform: 'Instagram', startDate: '', endDate: '', budget: 0, spent: 0, results: { followers: 0, messages: 0, likes: 0, comments: 0, views: 0, shares: 0, sales: 0, salesAmount: 0 } };
    const [newSocialForms, setNewSocialForms] = useState({ posts: { sharedAt: '', note: '' }, stories: { sharedAt: '', note: '' }, reels: { sharedAt: '', note: '' } });
    const [editingSocialEntry, setEditingSocialEntry] = useState(null);

    useEffect(() => {
        axios.get(`${SERVER_URL}/api/packages`).then(r => { if (r.data.success) setPackages(r.data.data); }).catch(() => {});
    }, []);

    // Seçili paketin datasını card'a ekle (kota gösterimi için)
    useEffect(() => {
        if (!packages.length) return;
        const pkgId = card.packageRef?._id || card.packageRef;
        const found = packages.find(p => p._id === pkgId);
        setCard(d => ({ ...d, _packageData: found || null }));
    }, [packages, card.packageRef]);

    const set = (field, val) => { setCard(d => ({ ...d, [field]: val })); setDirty(true); };
    const setNested = (parent, val) => { setCard(d => ({ ...d, [parent]: val })); setDirty(true); };

    const save = async () => {
        setSaving(true);
        try {
            const { _packageData, ...rest } = card;
            const payload = { ...rest };
            if (!payload.userId) payload.userId = null;
            if (!payload.packageRef) payload.packageRef = null;
            const r = await axios.put(`${API}/${card._id}`, payload, { headers: authHeader() });
            setCard(r.data.data);
            setDirty(false);
            onSaved('Kaydedildi');
        } catch (e) { onSaved(null, e.response?.data?.error || e.message); }
        finally { setSaving(false); }
    };

    // contacts helpers
    const addContact = () => set('contacts', [...(card.contacts || []), { name: '', surname: '', title: '', email: '', phone: '' }]);
    const upContact = (i, f, v) => { const a = [...card.contacts]; a[i] = { ...a[i], [f]: v }; set('contacts', a); };
    const delContact = (i) => set('contacts', card.contacts.filter((_, idx) => idx !== i));

    // social helpers
    const setPeriodField = (f, v) => { setCard(d => ({ ...d, currentPeriod: { ...d.currentPeriod, [f]: v } })); setDirty(true); };
    const handleAddSocialEntry = (type) => {
        const form = newSocialForms[type];
        const cp = { ...card.currentPeriod };
        cp[type] = [...(cp[type] || []), { sharedAt: form.sharedAt, note: form.note }];
        setPeriodField(type, cp[type]);
        setNewSocialForms(p => ({ ...p, [type]: { sharedAt: '', note: '' } }));
    };
    const upSocialEntry = (type, i, f, v) => { const cp = { ...card.currentPeriod }; const a = [...(cp[type] || [])]; a[i] = { ...a[i], [f]: v }; setPeriodField(type, a); };
    const saveEditSocialEntry = () => {
        if (!editingSocialEntry) return;
        const { type, idx, data } = editingSocialEntry;
        const cp = { ...card.currentPeriod };
        const a = [...(cp[type] || [])];
        a[idx] = { ...a[idx], sharedAt: data.sharedAt, note: data.note };
        setPeriodField(type, a);
        setEditingSocialEntry(null);
    };
    const delSocialEntry = (type, i) => { if (!window.confirm('Silinsin mi?')) return; const cp = { ...card.currentPeriod }; cp[type] = (cp[type] || []).filter((_, idx) => idx !== i); setPeriodField(type, cp[type]); };
    const openRevisionFromSocial = (type, entry) => {
        const catMap = { posts: 'post', stories: 'story', reels: 'reels' };
        setEditingRevision({ idx: -1, data: { ...emptyRevision, category: catMap[type] || 'diger', description: entry.note || '', receivedAt: entry.sharedAt ? entry.sharedAt.substring(0, 10) : '' } });
        setRevisionDialog(true);
    };

    const closePeriod = async () => {
        if (!window.confirm('Mevcut dönem geçmişe taşınsın mı? Sosyal medya verileri sıfırlanacak.')) return;
        const history = [...(card.socialHistory || []), { ...card.currentPeriod }];
        const nextNo = (card.currentPeriod?.periodNo || 1) + 1;
        const newPeriod = { posts: [], stories: [], reels: [], periodNo: nextNo, startDate: card.currentPeriod?.endDate || null, endDate: null };
        const updated = { ...card, socialHistory: history, currentPeriod: newPeriod };
        setCard(updated); setDirty(true);
    };

    // meeting helpers
    const openAddMeeting = () => { setEditingMeeting({ idx: -1, data: { ...emptyMeeting } }); setMeetingDialog(true); };
    const openEditMeeting = (i) => { setEditingMeeting({ idx: i, data: { ...(card.meetings[i]) } }); setMeetingDialog(true); };
    const saveMeeting = () => {
        if (!editingMeeting.data.title?.trim()) return;
        const meetings = [...(card.meetings || [])];
        if (editingMeeting.idx === -1) meetings.push(editingMeeting.data);
        else meetings[editingMeeting.idx] = editingMeeting.data;
        set('meetings', meetings);
        setMeetingDialog(false);
    };
    const delMeeting = (i) => { if (!window.confirm('Toplantı silinsin mi?')) return; set('meetings', card.meetings.filter((_, idx) => idx !== i)); };

    // revision helpers
    const openAddRevision = () => { setEditingRevision({ idx: -1, data: { ...emptyRevision } }); setRevisionDialog(true); };
    const openEditRevision = (i) => { setEditingRevision({ idx: i, data: { ...(card.revisions[i]) } }); setRevisionDialog(true); };
    const saveRevision = () => {
        if (!editingRevision.data.description?.trim()) return;
        const revisions = [...(card.revisions || [])];
        if (editingRevision.idx === -1) revisions.push(editingRevision.data);
        else revisions[editingRevision.idx] = editingRevision.data;
        set('revisions', revisions);
        setRevisionDialog(false);
    };
    const delRevision = (i) => { if (!window.confirm('Revizyon silinsin mi?')) return; set('revisions', card.revisions.filter((_, idx) => idx !== i)); };

    // payment helpers
    const addPayment = () => set('payments', [...(card.payments || []), { label: '', amount: 0, dueDate: '', paidAt: '', status: 'bekliyor' }]);

    // ad helpers
    const openAddAd = () => { setEditingAd({ idx: -1, data: { ...emptyAd } }); setAdDialog(true); };
    const openEditAd = (i) => { setEditingAd({ idx: i, data: { ...(card.adCampaigns[i]), results: { ...card.adCampaigns[i].results } } }); setAdDialog(true); };
    const saveAd = () => {
        if (!editingAd.data.name?.trim()) return;
        const ads = [...(card.adCampaigns || [])];
        if (editingAd.idx === -1) ads.push(editingAd.data);
        else ads[editingAd.idx] = editingAd.data;
        set('adCampaigns', ads);
        setAdDialog(false);
    };
    const delAd = (i) => { if (!window.confirm('Kampanya silinsin mi?')) return; set('adCampaigns', (card.adCampaigns || []).filter((_, idx) => idx !== i)); };
    const setAdField = (f, v) => setEditingAd(prev => ({ ...prev, data: { ...prev.data, [f]: v } }));
    const setAdResult = (f, v) => setEditingAd(prev => ({ ...prev, data: { ...prev.data, results: { ...prev.data.results, [f]: Number(v) } } }));
    const upPayment = (i, f, v) => { const a = [...card.payments]; a[i] = { ...a[i], [f]: v }; set('payments', a); };
    const delPayment = (i) => set('payments', card.payments.filter((_, idx) => idx !== i));

    // stats
    const paidTotal = (card.payments || []).filter(p => p.status === 'odendi').reduce((s, p) => s + (p.amount || 0), 0);
    const pendingTotal = (card.payments || []).filter(p => p.status === 'bekliyor').reduce((s, p) => s + (p.amount || 0), 0);
    const overdueTotal = (card.payments || []).filter(p => p.status === 'gecikti').reduce((s, p) => s + (p.amount || 0), 0);

    const kanbanStats = COLUMNS.map(c => ({ ...c, count: (card.kanban || []).filter(t => t.column === c.key).length }));
    const upcomingMeetings = (card.meetings || []).filter(m => !m.isPast).sort((a, b) => new Date(a.date) - new Date(b.date));
    const pastMeetings = (card.meetings || []).filter(m => m.isPast).sort((a, b) => new Date(b.date) - new Date(a.date));

    const ALL_TABS = [
        { label: 'Özet',        icon: <TrendingUpIcon fontSize="small" /> },
        { label: 'Genel',       icon: <BusinessIcon fontSize="small" /> },
        { label: 'İletişim',    icon: <PersonIcon fontSize="small" /> },
        { label: 'Finansal',    icon: <PaymentsIcon fontSize="small" /> },
        { label: 'Kanban',      icon: <ViewKanbanIcon fontSize="small" /> },
        { label: 'Sosyal',      icon: <InstagramIcon fontSize="small" /> },
        { label: 'İlerleme',    icon: <WebIcon fontSize="small" /> },
        { label: 'Toplantılar', icon: <EventIcon fontSize="small" /> },
        { label: 'Revizyonlar', icon: <BrushIcon fontSize="small" /> },
        { label: 'Reklamlar',   icon: <CampaignIcon fontSize="small" /> },
    ];
    const TABS = readOnly ? ALL_TABS.slice(0, 1) : ALL_TABS;

    const accentCol = sectorColor(card.businessName);
    const initials2 = (card.businessName || '?').split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();

    return (
        <Box>
            {/* Header */}
            <Box sx={{ mb: 3, p: 3, borderRadius: '16px', bgcolor: '#fff', border: '1.5px solid #E8EDF5',
                        boxShadow: '0 2px 12px rgba(15,23,42,0.05)' }}>
                <Stack direction="row" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={2}>
                    <Stack direction="row" alignItems="center" spacing={2}>
                        {onBack && (
                            <IconButton onClick={onBack}
                                sx={{ bgcolor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '10px',
                                      '&:hover': { bgcolor: '#F1F5F9' } }}>
                                <ArrowBackIcon sx={{ fontSize: 20 }} />
                            </IconButton>
                        )}
                        <Box sx={{ width: 48, height: 48, borderRadius: '14px', bgcolor: accentCol + '15',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <Typography fontWeight={900} fontSize="1.1rem" sx={{ color: accentCol }}>{initials2}</Typography>
                        </Box>
                        <Box>
                            <Typography variant="h6" fontWeight={800} color="#0F172A" letterSpacing="-0.01em" lineHeight={1.2}>
                                {card.businessName}
                            </Typography>
                            <Stack direction="row" spacing={1} alignItems="center" mt={0.3}>
                                {card.sector && <Typography variant="caption" color="#64748B">{card.sector}</Typography>}
                                {card.packageLabel && (
                                    <Chip label={card.packageLabel} size="small"
                                        sx={{ bgcolor: accentCol + '12', color: accentCol, fontWeight: 700,
                                              fontSize: '0.68rem', borderRadius: '6px', border: `1px solid ${accentCol}25`, height: 20 }} />
                                )}
                                {dirty && <Chip label="Kaydedilmemiş değişiklik" size="small"
                                    sx={{ bgcolor: '#FFFBEB', color: '#D97706', fontSize: '0.68rem', borderRadius: '6px', height: 20, fontWeight: 600 }} />}
                            </Stack>
                        </Box>
                    </Stack>
                    {!readOnly && (
                        <Button variant="contained" startIcon={<SaveIcon sx={{ fontSize: 16 }} />} onClick={save}
                            disabled={saving || !dirty}
                            sx={{ bgcolor: dirty ? '#0F172A' : '#94A3B8', '&:hover': { bgcolor: '#1E293B' },
                                  borderRadius: '10px', fontWeight: 700, px: 2.5,
                                  boxShadow: dirty ? '0 4px 14px rgba(15,23,42,0.25)' : 'none',
                                  transition: 'all 0.2s' }}>
                            {saving ? 'Kaydediliyor...' : dirty ? 'Kaydet' : 'Kaydedildi'}
                        </Button>
                    )}
                </Stack>
            </Box>

            {/* Tabs */}
            <Box sx={{ mb: 3, bgcolor: '#fff', borderRadius: '12px', border: '1.5px solid #E8EDF5',
                        boxShadow: '0 2px 8px rgba(15,23,42,0.04)' }}>
                <Tabs value={tab} onChange={(_, v) => setTab(v)} variant="scrollable" scrollButtons="auto"
                    sx={{
                        px: 1,
                        '& .MuiTab-root': { minWidth: 'auto', px: 1.8, py: 1.5, fontSize: '0.76rem', fontWeight: 600,
                            color: '#94A3B8', borderRadius: '8px', mx: 0.3, transition: 'all 0.15s',
                            '&.Mui-selected': { color: '#0F172A', bgcolor: '#F8FAFC' } },
                        '& .MuiTabs-indicator': { bgcolor: '#0F172A', height: 2.5, borderRadius: '2px' }
                    }}>
                    {TABS.map((t, i) => <Tab key={i} label={t.label} icon={t.icon} iconPosition="start" />)}
                </Tabs>
            </Box>

            {/* ── TAB 0: ÖZET ─────────────────────────────────────────────── */}
            {tab === 0 && (() => {
                const primaryContact = (card.contacts || [])[0];
                const socialLinks = [
                    { label: 'Instagram', href: card.instagramLink, icon: <InstagramIcon sx={{ fontSize: 18, color: '#E1306C' }} /> },
                    { label: 'Facebook',  href: card.facebookLink,  icon: <FacebookIcon  sx={{ fontSize: 18, color: '#1877F2' }} /> },
                    { label: 'Twitter/X', href: card.twitterLink,   icon: <LinkIcon       sx={{ fontSize: 18, color: '#1DA1F2' }} /> },
                    { label: 'LinkedIn',  href: card.linkedinLink,  icon: <LinkedInIcon  sx={{ fontSize: 18, color: '#0A66C2' }} /> },
                    { label: 'TikTok',   href: card.tiktokLink,    icon: <MovieIcon      sx={{ fontSize: 18, color: '#010101' }} /> },
                    { label: 'YouTube',  href: card.youtubeLink,   icon: <YouTubeIcon   sx={{ fontSize: 18, color: '#FF0000' }} /> },
                    { label: 'Web Sitesi', href: card.websiteLink, icon: <WebIcon        sx={{ fontSize: 18, color: '#10B981' }} /> },
                ].filter(l => l.href);

                const postsDone   = (card.currentPeriod?.posts   || []).filter(e => e.sharedAt).length;
                const storiesDone = (card.currentPeriod?.stories || []).filter(e => e.sharedAt).length;
                const reelsDone   = (card.currentPeriod?.reels   || []).filter(e => e.sharedAt).length;
                const postsTotal   = card._packageData?.posts   || 0;
                const storiesTotal = card._packageData?.stories || 0;
                const reelsTotal   = card._packageData?.reels   || 0;
                const hasSocial = postsTotal > 0 || storiesTotal > 0 || reelsTotal > 0;
                const activeServices = ALL_SERVICE_ITEMS.filter(s => card[s.field]);

                // ilerleme notları yardımcıları
                const webLogs  = [...(card.websiteProgressLog || [])].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 3);
                const corpLogs = [...(card.corporateIdentityProgressLog || [])].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 3);

                // sosyal notlar (not alanı dolu olanlar)
                const socialNotes = {
                    post:  (card.currentPeriod?.posts   || []).filter(e => e.note),
                    story: (card.currentPeriod?.stories || []).filter(e => e.note),
                    reels: (card.currentPeriod?.reels   || []).filter(e => e.note),
                };

                const REV_CATS_MAP = {
                    post: { label: 'Post', color: '#3B82F6', bg: '#EFF6FF' },
                    story: { label: 'Story', color: '#8B5CF6', bg: '#F5F3FF' },
                    reels: { label: 'Reels', color: '#EC4899', bg: '#FDF2F8' },
                    web: { label: 'Web', color: '#10B981', bg: '#ECFDF5' },
                    kurumsal: { label: 'Kurumsal', color: '#F59E0B', bg: '#FFFBEB' },
                    diger: { label: 'Diğer', color: '#64748B', bg: '#F8FAFC' },
                };

                const PLATFORM_COLOR = {
                    Instagram: '#E1306C', Facebook: '#1877F2', Google: '#4285F4',
                    TikTok: '#010101', YouTube: '#FF0000', 'Twitter/X': '#1DA1F2',
                    LinkedIn: '#0A66C2', Diğer: '#64748B',
                };

                // ilerleme notu satırı
                const LogRow = ({ log }) => (
                    <Stack direction="row" spacing={1} alignItems="flex-start" sx={{ py: 0.6, borderBottom: '1px solid #F1F5F9', '&:last-child': { borderBottom: 'none' } }}>
                        <Box sx={{ mt: 0.3, width: 28, height: 18, borderRadius: '5px', bgcolor: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <Typography sx={{ fontSize: '0.6rem', fontWeight: 800, color: '#64748B' }}>%{log.progress}</Typography>
                        </Box>
                        <Box sx={{ minWidth: 0 }}>
                            <Typography variant="caption" color="#0F172A" fontWeight={600} sx={{ display: 'block', lineHeight: 1.3 }}>{log.note || '—'}</Typography>
                            <Typography sx={{ fontSize: '0.65rem', color: '#94A3B8' }}>{log.date ? new Date(log.date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric' }) : ''}</Typography>
                        </Box>
                    </Stack>
                );

                // sosyal not satırı
                const SocialNoteRow = ({ item }) => (
                    <Stack direction="row" spacing={1} alignItems="flex-start" sx={{ py: 0.5, borderBottom: '1px solid #F1F5F9', '&:last-child': { borderBottom: 'none' } }}>
                        <Typography sx={{ fontSize: '0.65rem', color: '#94A3B8', flexShrink: 0, mt: 0.2 }}>
                            {item.sharedAt ? new Date(item.sharedAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' }) : '—'}
                        </Typography>
                        <Typography variant="caption" color="#374151" sx={{ lineHeight: 1.3 }}>{item.note}</Typography>
                    </Stack>
                );

                return (
                <Stack spacing={2.5}>

                    {/* Kimlik Başlık Kartı */}
                    <Paper sx={{ p: 3, borderRadius: '14px', background: 'linear-gradient(135deg, #0F172A 0%, #1E3A5F 100%)', color: '#fff' }}>
                        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" flexWrap="wrap" gap={2}>
                            <Box>
                                <Typography variant="h5" fontWeight={900} letterSpacing="-0.02em">{card.businessName}</Typography>
                                {card.sector && <Typography variant="body2" sx={{ opacity: 0.7, mt: 0.5 }}>{card.sector}</Typography>}
                                <Stack direction="row" spacing={1} mt={1.5} flexWrap="wrap" gap={0.5}>
                                    {card.packageLabel && <Chip label={card.packageLabel} size="small" sx={{ bgcolor: 'rgba(59,130,246,0.3)', color: '#93C5FD', fontWeight: 700, fontSize: '0.72rem' }} />}
                                    {card.agreementDate && <Chip label={`Anlaşma: ${fmt(card.agreementDate)}`} size="small" sx={{ bgcolor: 'rgba(255,255,255,0.1)', color: '#E2E8F0', fontSize: '0.72rem' }} />}
                                    {card.firstMeetingDate && <Chip label={`İlk Görüşme: ${fmt(card.firstMeetingDate)}`} size="small" sx={{ bgcolor: 'rgba(255,255,255,0.1)', color: '#E2E8F0', fontSize: '0.72rem' }} />}
                                </Stack>
                            </Box>
                            <Box textAlign="right">
                                <Typography variant="caption" sx={{ opacity: 0.6 }}>Anlaşılan Tutar</Typography>
                                <Typography variant="h5" fontWeight={900} color="#60A5FA">{fmtMoney(card.agreedPrice)}</Typography>
                                <Typography variant="caption" sx={{ opacity: 0.6 }}>/ ay</Typography>
                            </Box>
                        </Stack>
                    </Paper>

                    <Grid container spacing={2}>
                        {/* ── Sol kolon ── */}
                        <Grid item xs={12} md={7}>
                            <Stack spacing={2}>

                                {/* Finansal Durum */}
                                <Paper sx={{ p: 2.5, borderRadius: '14px' }}>
                                    <Typography fontWeight={700} mb={2} fontSize="0.85rem" color="text.secondary" textTransform="uppercase" letterSpacing="0.08em">Finansal Durum</Typography>
                                    <Grid container spacing={1.5}>
                                        {[
                                            { label: 'Tahsil Edildi', value: fmtMoney(paidTotal),   color: '#10B981', bg: '#F0FDF4' },
                                            { label: 'Bekleyen',      value: fmtMoney(pendingTotal), color: '#F59E0B', bg: '#FFFBEB' },
                                            { label: 'Geciken',       value: fmtMoney(overdueTotal), color: '#EF4444', bg: '#FEF2F2' },
                                        ].map((s, i) => (
                                            <Grid item xs={4} key={i}>
                                                <Box sx={{ p: 1.5, bgcolor: s.bg, borderRadius: 2, textAlign: 'center' }}>
                                                    <Typography fontWeight={800} fontSize="1rem" color={s.color}>{s.value}</Typography>
                                                    <Typography variant="caption" color="text.secondary">{s.label}</Typography>
                                                </Box>
                                            </Grid>
                                        ))}
                                    </Grid>
                                    {card.agreedPrice > 0 && (
                                        <Box mt={1.5}>
                                            <LinearProgress variant="determinate" value={Math.min((paidTotal / card.agreedPrice) * 100, 100)}
                                                sx={{ height: 6, borderRadius: 3, bgcolor: '#F1F5F9', '& .MuiLinearProgress-bar': { bgcolor: '#10B981' } }} />
                                            <Typography variant="caption" color="text.secondary" mt={0.5} display="block">
                                                Tahsilat: %{Math.min(Math.round((paidTotal / card.agreedPrice) * 100), 100)}
                                            </Typography>
                                        </Box>
                                    )}
                                </Paper>

                                {/* Sosyal Medya Kotası + Notlar */}
                                {hasSocial && (
                                    <Paper sx={{ p: 2.5, borderRadius: '14px' }}>
                                        <Typography fontWeight={700} mb={2} fontSize="0.85rem" color="text.secondary" textTransform="uppercase" letterSpacing="0.08em">
                                            Sosyal Medya — Dönem {card.currentPeriod?.periodNo || 1}
                                        </Typography>
                                        <Stack spacing={2}>
                                            {[
                                                { key: 'post',  label: 'Post',  done: postsDone,   total: postsTotal,   color: '#3B82F6', bg: '#EFF6FF',  icon: <GridViewIcon    sx={{ fontSize: 14, color: '#3B82F6' }} />, notes: socialNotes.post  },
                                                { key: 'story', label: 'Story', done: storiesDone, total: storiesTotal, color: '#8B5CF6', bg: '#F5F3FF',  icon: <AutoStoriesIcon sx={{ fontSize: 14, color: '#8B5CF6' }} />, notes: socialNotes.story },
                                                { key: 'reels', label: 'Reels', done: reelsDone,   total: reelsTotal,   color: '#EC4899', bg: '#FDF2F8',  icon: <MovieIcon       sx={{ fontSize: 14, color: '#EC4899' }} />, notes: socialNotes.reels },
                                            ].filter(r => r.total > 0).map(r => (
                                                <Box key={r.key}>
                                                    <Stack direction="row" justifyContent="space-between" mb={0.5}>
                                                        <Stack direction="row" alignItems="center" spacing={0.5}>{r.icon}<Typography variant="caption" fontWeight={700}>{r.label}</Typography></Stack>
                                                        <Typography variant="caption" color="text.secondary">{r.done}/{r.total}</Typography>
                                                    </Stack>
                                                    <LinearProgress variant="determinate" value={Math.min((r.done / r.total) * 100, 100)}
                                                        sx={{ height: 7, borderRadius: 3, bgcolor: r.bg, '& .MuiLinearProgress-bar': { bgcolor: r.color } }} />
                                                    {r.notes.length > 0 && (
                                                        <Box mt={1} pl={0.5}>
                                                            {r.notes.slice(0, 3).map((n, ni) => <SocialNoteRow key={ni} item={n} />)}
                                                        </Box>
                                                    )}
                                                </Box>
                                            ))}
                                        </Stack>
                                    </Paper>
                                )}

                                {/* Proje İlerleme + Notlar */}
                                {activeServices.length > 0 && (
                                    <Paper sx={{ p: 2.5, borderRadius: '14px' }}>
                                        <Typography fontWeight={700} mb={2} fontSize="0.85rem" color="text.secondary" textTransform="uppercase" letterSpacing="0.08em">Proje İlerleme</Typography>
                                        <Stack spacing={2}>
                                            {activeServices.map(svc => {
                                                const logs = [...(card[svc.log] || [])].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 3);
                                                return (
                                                    <Box key={svc.field}>
                                                        <Stack direction="row" justifyContent="space-between" mb={0.5}>
                                                            <Stack direction="row" alignItems="center" spacing={0.5}>
                                                                {React.cloneElement(svc.icon, { sx: { fontSize: 14, color: svc.color } })}
                                                                <Typography variant="caption" fontWeight={700}>{svc.label}</Typography>
                                                            </Stack>
                                                            <Typography variant="caption" fontWeight={800} color={svc.color}>%{card[svc.prog] || 0}</Typography>
                                                        </Stack>
                                                        <LinearProgress variant="determinate" value={card[svc.prog] || 0}
                                                            sx={{ height: 7, borderRadius: 3, bgcolor: svc.color + '20', '& .MuiLinearProgress-bar': { bgcolor: svc.color } }} />
                                                        {logs.length > 0 && (
                                                            <Box mt={1} pl={0.5}>
                                                                {logs.map((log, li) => <LogRow key={li} log={log} />)}
                                                            </Box>
                                                        )}
                                                    </Box>
                                                );
                                            })}
                                        </Stack>
                                    </Paper>
                                )}

                                {/* Reklamlar */}
                                {(card.adCampaigns || []).length > 0 && (
                                    <Paper sx={{ p: 2.5, borderRadius: '14px' }}>
                                        <Typography fontWeight={700} mb={2} fontSize="0.85rem" color="text.secondary" textTransform="uppercase" letterSpacing="0.08em">
                                            Reklam Kampanyaları ({card.adCampaigns.length})
                                        </Typography>
                                        <Stack spacing={1.5}>
                                            {card.adCampaigns.map((ad, i) => {
                                                const pc = PLATFORM_COLOR[ad.platform] || '#64748B';
                                                const pct = ad.budget > 0 ? Math.min(100, Math.round((ad.spent / ad.budget) * 100)) : 0;
                                                return (
                                                    <Box key={i} sx={{ p: 1.5, borderRadius: '10px', border: `1.5px solid ${pc}25`, bgcolor: pc + '08' }}>
                                                        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={0.8}>
                                                            <Stack direction="row" spacing={1} alignItems="center">
                                                                <Chip label={ad.platform || 'Instagram'} size="small"
                                                                    sx={{ bgcolor: pc + '20', color: pc, fontWeight: 700, fontSize: '0.62rem', height: 17, borderRadius: '5px' }} />
                                                                <Typography variant="body2" fontWeight={700} color="#0F172A">{ad.name || `Kampanya #${i + 1}`}</Typography>
                                                            </Stack>
                                                            <Typography variant="caption" fontWeight={800} color={ad.spent > ad.budget && ad.budget > 0 ? '#EF4444' : pc}>
                                                                %{pct}
                                                            </Typography>
                                                        </Stack>
                                                        <Stack direction="row" spacing={2} mb={0.8}>
                                                            <Typography variant="caption" color="text.secondary">Bütçe: <Box component="span" fontWeight={700} color="#0F172A">{fmtMoney(ad.budget)}</Box></Typography>
                                                            <Typography variant="caption" color="text.secondary">Harcanan: <Box component="span" fontWeight={700} color="#EF4444">{fmtMoney(ad.spent)}</Box></Typography>
                                                            {(ad.results?.followers || 0) > 0 && (
                                                                <Typography variant="caption" color="text.secondary">Takipçi: <Box component="span" fontWeight={700} color="#8B5CF6">+{ad.results.followers.toLocaleString('tr-TR')}</Box></Typography>
                                                            )}
                                                        </Stack>
                                                        {ad.budget > 0 && (
                                                            <LinearProgress variant="determinate" value={pct}
                                                                sx={{ height: 5, borderRadius: 3, bgcolor: '#F1F5F9', '& .MuiLinearProgress-bar': { bgcolor: ad.spent > ad.budget ? '#EF4444' : pc } }} />
                                                        )}
                                                    </Box>
                                                );
                                            })}
                                        </Stack>
                                    </Paper>
                                )}
                            </Stack>
                        </Grid>

                        {/* ── Sağ kolon ── */}
                        <Grid item xs={12} md={5}>
                            <Stack spacing={2}>

                                {/* Birincil İletişim */}
                                {primaryContact && (
                                    <Paper sx={{ p: 2.5, borderRadius: '14px', border: '1px solid #EEF2F7' }}>
                                        <Typography fontWeight={700} mb={1.5} fontSize="0.85rem" color="text.secondary" textTransform="uppercase" letterSpacing="0.08em">Birincil İletişim</Typography>
                                        <Stack direction="row" spacing={1.5} alignItems="center" mb={1}>
                                            <Box sx={{ width: 38, height: 38, borderRadius: '50%', bgcolor: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                                <Typography fontWeight={800} color="#3B82F6">{(primaryContact.name || '?').charAt(0).toUpperCase()}</Typography>
                                            </Box>
                                            <Box>
                                                <Typography fontWeight={700} fontSize="0.9rem">{primaryContact.name} {primaryContact.surname}</Typography>
                                                {primaryContact.title && <Typography variant="caption" color="text.secondary">{primaryContact.title}</Typography>}
                                            </Box>
                                        </Stack>
                                        {primaryContact.email && (
                                            <Stack direction="row" spacing={1} alignItems="center" mb={0.5}>
                                                <EmailIcon sx={{ fontSize: 14, color: '#64748B' }} />
                                                <Typography variant="caption" color="text.secondary" sx={{ wordBreak: 'break-all' }}>{primaryContact.email}</Typography>
                                            </Stack>
                                        )}
                                        {primaryContact.phone && (
                                            <Stack direction="row" spacing={1} alignItems="center">
                                                <PhoneIcon sx={{ fontSize: 14, color: '#64748B' }} />
                                                <Typography variant="caption" color="text.secondary">{primaryContact.phone}</Typography>
                                            </Stack>
                                        )}
                                    </Paper>
                                )}

                                {/* Dijital Varlıklar */}
                                <Paper sx={{ p: 2.5, borderRadius: '14px', border: '1px solid #EEF2F7' }}>
                                    <Typography fontWeight={700} mb={1.5} fontSize="0.85rem" color="text.secondary" textTransform="uppercase" letterSpacing="0.08em">Dijital Varlıklar</Typography>
                                    {card.driveLink && (
                                        <Box mb={0.75}>
                                            <Button variant="outlined" size="small" startIcon={<FolderIcon sx={{ color: '#FBBC04' }} />}
                                                href={card.driveLink} target="_blank" rel="noopener noreferrer"
                                                sx={{ borderColor: '#E2E8F0', color: '#0F172A', textTransform: 'none', fontWeight: 600, width: '100%', justifyContent: 'flex-start' }}>
                                                Google Drive Klasörü
                                            </Button>
                                        </Box>
                                    )}
                                    {socialLinks.length > 0 ? (
                                        <Stack spacing={0.6}>
                                            {socialLinks.map((l, i) => (
                                                <Button key={i} variant="outlined" size="small" startIcon={l.icon}
                                                    href={l.href} target="_blank" rel="noopener noreferrer"
                                                    sx={{ borderColor: '#E2E8F0', color: '#374151', textTransform: 'none', fontWeight: 500, justifyContent: 'flex-start', fontSize: '0.78rem' }}>
                                                    {l.label}
                                                </Button>
                                            ))}
                                        </Stack>
                                    ) : !card.driveLink && (
                                        <Typography variant="caption" color="text.secondary">Henüz link eklenmedi.</Typography>
                                    )}
                                </Paper>

                                {/* Toplantılar */}
                                {(card.meetings || []).length > 0 && (
                                    <Paper sx={{ p: 2.5, borderRadius: '14px', border: '1px solid #EEF2F7' }}>
                                        <Typography fontWeight={700} mb={1.5} fontSize="0.85rem" color="text.secondary" textTransform="uppercase" letterSpacing="0.08em">
                                            Toplantılar ({card.meetings.length})
                                        </Typography>
                                        <Stack spacing={1}>
                                            {[...card.meetings]
                                                .sort((a, b) => new Date(a.date) - new Date(b.date))
                                                .slice(0, 5)
                                                .map((m, i) => {
                                                    const isPast = m.isPast || new Date(m.date) < new Date();
                                                    return (
                                                        <Stack key={i} direction="row" spacing={1.5} alignItems="flex-start"
                                                            sx={{ p: 1.2, borderRadius: '10px', bgcolor: isPast ? '#F8FAFC' : '#EFF6FF', border: `1px solid ${isPast ? '#E2E8F0' : '#BFDBFE'}` }}>
                                                            <Box sx={{ width: 36, flexShrink: 0, textAlign: 'center' }}>
                                                                <Typography sx={{ fontSize: '0.7rem', fontWeight: 800, color: isPast ? '#94A3B8' : '#3B82F6', lineHeight: 1 }}>
                                                                    {m.date ? new Date(m.date).toLocaleDateString('tr-TR', { day: '2-digit', month: 'short' }) : '—'}
                                                                </Typography>
                                                                {m.time && <Typography sx={{ fontSize: '0.62rem', color: '#94A3B8' }}>{m.time}</Typography>}
                                                            </Box>
                                                            <Box sx={{ minWidth: 0 }}>
                                                                <Typography variant="caption" fontWeight={700} color={isPast ? '#64748B' : '#1E40AF'} sx={{ display: 'block', lineHeight: 1.2 }}>
                                                                    {m.title || 'Toplantı'}
                                                                </Typography>
                                                                {m.location && <Typography sx={{ fontSize: '0.65rem', color: '#94A3B8' }}>{m.location}</Typography>}
                                                            </Box>
                                                            {isPast && <Chip label="Geçti" size="small" sx={{ bgcolor: '#F1F5F9', color: '#94A3B8', fontSize: '0.6rem', height: 16, ml: 'auto !important', flexShrink: 0 }} />}
                                                        </Stack>
                                                    );
                                                })}
                                        </Stack>
                                    </Paper>
                                )}

                                {/* Revizyonlar */}
                                {(card.revisions || []).length > 0 && (
                                    <Paper sx={{ p: 2.5, borderRadius: '14px', border: '1px solid #EEF2F7' }}>
                                        <Typography fontWeight={700} mb={1.5} fontSize="0.85rem" color="text.secondary" textTransform="uppercase" letterSpacing="0.08em">
                                            Revizyonlar ({card.revisions.length})
                                        </Typography>
                                        <Stack spacing={1}>
                                            {[...card.revisions]
                                                .sort((a, b) => new Date(b.receivedAt) - new Date(a.receivedAt))
                                                .slice(0, 5)
                                                .map((r, i) => {
                                                    const cat = REV_CATS_MAP[r.category] || REV_CATS_MAP.diger;
                                                    return (
                                                        <Stack key={i} direction="row" spacing={1.5} alignItems="flex-start"
                                                            sx={{ p: 1.2, borderRadius: '10px', bgcolor: cat.bg, border: `1px solid ${cat.color}20` }}>
                                                            <Chip label={cat.label} size="small"
                                                                sx={{ bgcolor: cat.color + '20', color: cat.color, fontWeight: 700, fontSize: '0.6rem', height: 18, borderRadius: '5px', flexShrink: 0, mt: 0.2 }} />
                                                            <Box sx={{ minWidth: 0 }}>
                                                                <Typography variant="caption" fontWeight={600} color="#374151" sx={{ display: 'block', lineHeight: 1.3 }}>
                                                                    {r.description}
                                                                </Typography>
                                                                {r.receivedAt && <Typography sx={{ fontSize: '0.65rem', color: '#94A3B8' }}>{new Date(r.receivedAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric' })}</Typography>}
                                                            </Box>
                                                        </Stack>
                                                    );
                                                })}
                                        </Stack>
                                    </Paper>
                                )}
                            </Stack>
                        </Grid>
                    </Grid>

                    {/* Notlar */}
                    {card.notes && (
                        <Paper sx={{ p: 2.5, borderRadius: '14px', bgcolor: '#FFFBEB', border: '1px solid #FDE68A' }}>
                            <Typography fontWeight={700} mb={1} fontSize="0.85rem" color="#92400E" textTransform="uppercase" letterSpacing="0.08em">Notlar</Typography>
                            <Typography variant="body2" color="#78350F" sx={{ whiteSpace: 'pre-wrap' }}>{card.notes}</Typography>
                        </Paper>
                    )}
                </Stack>
                );
            })()}

            {/* ── TAB 1: GENEL ────────────────────────────────────────────── */}
            {tab === 1 && (
                <Paper sx={{ p: 3, borderRadius: '16px', border: '1.5px solid #EEF2F7', boxShadow: 'none' }}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}><TextField fullWidth label="İşletme Adı *" value={card.businessName || ''} onChange={e => set('businessName', e.target.value)} size="small" disabled={readOnly} /></Grid>
                    <Grid item xs={12} sm={6}><TextField fullWidth label="Sektör" value={card.sector || ''} onChange={e => set('sector', e.target.value)} size="small" disabled={readOnly} /></Grid>
                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth size="small" disabled={readOnly}>
                            <InputLabel>Paket Seç</InputLabel>
                            <Select value={card.packageRef?._id || card.packageRef || ''} onChange={e => {
                                const pkg = packages.find(p => p._id === e.target.value);
                                const activeFlags = {};
                                if (pkg) ALL_SERVICE_ITEMS.forEach(item => { if (pkg[item.pkgField]) activeFlags[item.field] = true; });
                                setCard(d => ({ ...d, packageRef: e.target.value, packageLabel: pkg?.name || '', ...(pkg?.price ? { agreedPrice: pkg.price } : {}), ...activeFlags }));
                                setDirty(true);
                            }} label="Paket Seç">
                                <MenuItem value=""><em>Paket yok</em></MenuItem>
                                {packages.map(p => <MenuItem key={p._id} value={p._id}>{p.name}</MenuItem>)}
                            </Select>
                        </FormControl>
                    </Grid>
                    {!readOnly && (
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth size="small">
                                <InputLabel>Bağlı Müşteri Hesabı</InputLabel>
                                <Select value={card.userId?._id || card.userId || ''} onChange={e => set('userId', e.target.value)} label="Bağlı Müşteri Hesabı">
                                    <MenuItem value=""><em>Bağlı değil</em></MenuItem>
                                    {users.filter(u => u.role === 'musteri').map(u => <MenuItem key={u._id} value={u._id}>{u.name} — {u.email}</MenuItem>)}
                                </Select>
                            </FormControl>
                        </Grid>
                    )}
                    <Grid item xs={12} sm={6}><TextField fullWidth label="İlk Toplantı Tarihi" type="date" value={card.firstMeetingDate ? card.firstMeetingDate.substring(0, 10) : ''} onChange={e => set('firstMeetingDate', e.target.value)} size="small" InputLabelProps={{ shrink: true }} disabled={readOnly} /></Grid>
                    <Grid item xs={12} sm={6}><TextField fullWidth label="Anlaşma Tarihi" type="date" value={card.agreementDate ? card.agreementDate.substring(0, 10) : ''} onChange={e => set('agreementDate', e.target.value)} size="small" InputLabelProps={{ shrink: true }} disabled={readOnly} /></Grid>

                    {/* Dijital Varlık Linkleri */}
                    <Grid item xs={12}>
                        <Divider sx={{ my: 0.5 }}><Typography variant="caption" color="text.secondary">Dijital Varlıklar & Linkler</Typography></Divider>
                    </Grid>
                    <Grid item xs={12} sm={6}><TextField fullWidth size="small" label="Google Drive Klasör Linki" value={card.driveLink || ''} onChange={e => set('driveLink', e.target.value)} disabled={readOnly} InputProps={{ startAdornment: <FolderIcon sx={{ fontSize: 16, color: '#FBBC04', mr: 1 }} /> }} /></Grid>
                    <Grid item xs={12} sm={6}><TextField fullWidth size="small" label="Web Sitesi URL" value={card.websiteLink || ''} onChange={e => set('websiteLink', e.target.value)} disabled={readOnly} InputProps={{ startAdornment: <WebIcon sx={{ fontSize: 16, color: '#10B981', mr: 1 }} /> }} /></Grid>
                    <Grid item xs={12} sm={6}><TextField fullWidth size="small" label="Instagram Linki" value={card.instagramLink || ''} onChange={e => set('instagramLink', e.target.value)} disabled={readOnly} InputProps={{ startAdornment: <InstagramIcon sx={{ fontSize: 16, color: '#E1306C', mr: 1 }} /> }} /></Grid>
                    <Grid item xs={12} sm={6}><TextField fullWidth size="small" label="Facebook Linki" value={card.facebookLink || ''} onChange={e => set('facebookLink', e.target.value)} disabled={readOnly} InputProps={{ startAdornment: <FacebookIcon sx={{ fontSize: 16, color: '#1877F2', mr: 1 }} /> }} /></Grid>
                    <Grid item xs={12} sm={6}><TextField fullWidth size="small" label="Twitter / X Linki" value={card.twitterLink || ''} onChange={e => set('twitterLink', e.target.value)} disabled={readOnly} InputProps={{ startAdornment: <LinkIcon sx={{ fontSize: 16, color: '#1DA1F2', mr: 1 }} /> }} /></Grid>
                    <Grid item xs={12} sm={6}><TextField fullWidth size="small" label="LinkedIn Linki" value={card.linkedinLink || ''} onChange={e => set('linkedinLink', e.target.value)} disabled={readOnly} InputProps={{ startAdornment: <LinkedInIcon sx={{ fontSize: 16, color: '#0A66C2', mr: 1 }} /> }} /></Grid>
                    <Grid item xs={12} sm={6}><TextField fullWidth size="small" label="TikTok Linki" value={card.tiktokLink || ''} onChange={e => set('tiktokLink', e.target.value)} disabled={readOnly} InputProps={{ startAdornment: <MovieIcon sx={{ fontSize: 16, color: '#010101', mr: 1 }} /> }} /></Grid>
                    <Grid item xs={12} sm={6}><TextField fullWidth size="small" label="YouTube Linki" value={card.youtubeLink || ''} onChange={e => set('youtubeLink', e.target.value)} disabled={readOnly} InputProps={{ startAdornment: <YouTubeIcon sx={{ fontSize: 16, color: '#FF0000', mr: 1 }} /> }} /></Grid>

                    <Grid item xs={12}><TextField fullWidth label="Genel Notlar" multiline rows={4} value={card.notes || ''} onChange={e => set('notes', e.target.value)} size="small" disabled={readOnly} /></Grid>
                </Grid>
                </Paper>
            )}

            {/* ── TAB 2: İLETİŞİM ─────────────────────────────────────────── */}
            {tab === 2 && (
                <Stack spacing={2}>
                    {(card.contacts || []).map((c, i) => (
                        <Paper key={i} sx={{ p: 3, borderRadius: '16px', position: 'relative', border: '1.5px solid #EEF2F7', boxShadow: 'none' }}>
                            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
                                <Stack direction="row" alignItems="center" spacing={1.5}>
                                    <Box sx={{ width: 36, height: 36, borderRadius: '10px', bgcolor: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Typography fontWeight={800} color="#3B82F6" fontSize="0.85rem">
                                            {(c.name || '#')[0].toUpperCase()}
                                        </Typography>
                                    </Box>
                                    <Typography variant="body2" fontWeight={700} color="#0F172A">
                                        {c.name && c.surname ? `${c.name} ${c.surname}` : `Kişi #${i + 1}`}
                                        {c.title && <Box component="span" sx={{ color: '#94A3B8', fontWeight: 500, ml: 1 }}>· {c.title}</Box>}
                                    </Typography>
                                </Stack>
                                {!readOnly && <IconButton size="small" onClick={() => delContact(i)}
                                    sx={{ color: '#CBD5E1', '&:hover': { color: '#EF4444', bgcolor: '#FEF2F2' }, borderRadius: '8px' }}><CloseIcon fontSize="small" /></IconButton>}
                            </Stack>
                            <Grid container spacing={1.5}>
                                <Grid item xs={6} sm={3}><TextField fullWidth size="small" label="Ad" value={c.name || ''} onChange={e => upContact(i, 'name', e.target.value)} disabled={readOnly} /></Grid>
                                <Grid item xs={6} sm={3}><TextField fullWidth size="small" label="Soyad" value={c.surname || ''} onChange={e => upContact(i, 'surname', e.target.value)} disabled={readOnly} /></Grid>
                                <Grid item xs={12} sm={6}><TextField fullWidth size="small" label="Ünvan" value={c.title || ''} onChange={e => upContact(i, 'title', e.target.value)} disabled={readOnly} /></Grid>
                                <Grid item xs={12} sm={6}><TextField fullWidth size="small" label="E-posta" value={c.email || ''} onChange={e => upContact(i, 'email', e.target.value)} disabled={readOnly} /></Grid>
                                <Grid item xs={12} sm={6}><TextField fullWidth size="small" label="Telefon" value={c.phone || ''} onChange={e => upContact(i, 'phone', e.target.value)} disabled={readOnly} /></Grid>
                            </Grid>
                        </Paper>
                    ))}
                    {!readOnly && (
                        <Button startIcon={<AddIcon />} variant="outlined" onClick={addContact}
                            sx={{ alignSelf: 'flex-start', borderRadius: '10px', fontWeight: 600,
                                  borderColor: '#E2E8F0', color: '#374151', '&:hover': { bgcolor: '#F8FAFC', borderColor: '#CBD5E1' } }}>
                            Kişi Ekle
                        </Button>
                    )}
                    {readOnly && (card.contacts || []).length === 0 && <Typography color="text.secondary">İletişim kişisi eklenmemiş.</Typography>}
                </Stack>
            )}

            {/* ── TAB 3: FİNANSAL ─────────────────────────────────────────── */}
            {tab === 3 && (
                <Stack spacing={3}>
                    <Paper sx={{ p: 3, borderRadius: '14px' }}>
                        <Typography fontWeight={700} mb={2}>Anlaşma Bedeli</Typography>
                        <TextField size="small" label="Toplam Anlaşılan Tutar (₺)" type="number" value={card.agreedPrice || 0} onChange={e => set('agreedPrice', Number(e.target.value))} disabled={readOnly} sx={{ width: 260 }} />
                        <Stack direction="row" spacing={2} mt={2} flexWrap="wrap" useFlexGap>
                            <Paper sx={{ p: 1.5, borderRadius: 2, bgcolor: '#F0FDF4', flex: 1, minWidth: 120 }}>
                                <Typography variant="caption" color="text.secondary">Tahsil</Typography>
                                <Typography fontWeight={800} color="#10B981">{fmtMoney(paidTotal)}</Typography>
                            </Paper>
                            <Paper sx={{ p: 1.5, borderRadius: 2, bgcolor: '#FFFBEB', flex: 1, minWidth: 120 }}>
                                <Typography variant="caption" color="text.secondary">Bekleyen</Typography>
                                <Typography fontWeight={800} color="#F59E0B">{fmtMoney(pendingTotal)}</Typography>
                            </Paper>
                            <Paper sx={{ p: 1.5, borderRadius: 2, bgcolor: '#FEF2F2', flex: 1, minWidth: 120 }}>
                                <Typography variant="caption" color="text.secondary">Geciken</Typography>
                                <Typography fontWeight={800} color="#EF4444">{fmtMoney(overdueTotal)}</Typography>
                            </Paper>
                        </Stack>
                    </Paper>

                    <Box>
                        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1.5}>
                            <Typography fontWeight={700}>Ödeme Planı</Typography>
                            {!readOnly && <Button size="small" startIcon={<AddIcon />} onClick={addPayment}>Taksit Ekle</Button>}
                        </Stack>
                        <Stack spacing={1.5}>
                            {(card.payments || []).map((p, i) => (
                                <Paper key={i} sx={{ p: 2, borderRadius: 2, border: `1px solid ${PAY_STATUS[p.status]?.color}40`, position: 'relative' }}>
                                    {!readOnly && <IconButton size="small" onClick={() => delPayment(i)} sx={{ position: 'absolute', top: 6, right: 6, color: 'error.main' }}><CloseIcon fontSize="small" /></IconButton>}
                                    <Grid container spacing={1.5} alignItems="center">
                                        <Grid item xs={12} sm={3}><TextField fullWidth size="small" label="Açıklama" value={p.label || ''} onChange={e => upPayment(i, 'label', e.target.value)} disabled={readOnly} /></Grid>
                                        <Grid item xs={6} sm={2}><TextField fullWidth size="small" label="Tutar (₺)" type="number" value={p.amount || 0} onChange={e => upPayment(i, 'amount', Number(e.target.value))} disabled={readOnly} /></Grid>
                                        <Grid item xs={6} sm={2}><TextField fullWidth size="small" label="Vade" type="date" value={p.dueDate ? p.dueDate.substring(0, 10) : ''} onChange={e => upPayment(i, 'dueDate', e.target.value)} InputLabelProps={{ shrink: true }} disabled={readOnly} /></Grid>
                                        <Grid item xs={6} sm={2}><TextField fullWidth size="small" label="Ödeme Tarihi" type="date" value={p.paidAt ? p.paidAt.substring(0, 10) : ''} onChange={e => upPayment(i, 'paidAt', e.target.value)} InputLabelProps={{ shrink: true }} disabled={readOnly} /></Grid>
                                        <Grid item xs={6} sm={2}>
                                            <FormControl fullWidth size="small" disabled={readOnly}>
                                                <InputLabel>Durum</InputLabel>
                                                <Select value={p.status || 'bekliyor'} onChange={e => upPayment(i, 'status', e.target.value)} label="Durum">
                                                    <MenuItem value="bekliyor">Bekliyor</MenuItem>
                                                    <MenuItem value="odendi">Ödendi</MenuItem>
                                                    <MenuItem value="gecikti">Gecikti</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12} sm={1}>
                                            <Chip size="small" label={PAY_STATUS[p.status]?.label} sx={{ bgcolor: PAY_STATUS[p.status]?.color + '20', color: PAY_STATUS[p.status]?.color, fontWeight: 700 }} />
                                        </Grid>
                                    </Grid>
                                </Paper>
                            ))}
                            {(card.payments || []).length === 0 && <Typography color="text.secondary" variant="body2">Ödeme planı eklenmemiş.</Typography>}
                        </Stack>
                    </Box>
                </Stack>
            )}

            {/* ── TAB 4: KANBAN ────────────────────────────────────────────── */}
            {tab === 4 && (() => {
                const kp = card.kanbanPeriod || { periodNo: 1, startDate: '', endDate: '' };
                const kHistory = card.kanbanHistory || [];

                const closeKanbanPeriod = () => {
                    if (!window.confirm('Mevcut dönem geçmişe taşınsın mı? Görevler arşivlenecek ve yeni dönem başlayacak.')) return;
                    const archived = {
                        periodNo: kp.periodNo,
                        startDate: kp.startDate,
                        endDate: new Date().toISOString(),
                        tasks: card.kanban || []
                    };
                    const nextNo = (kp.periodNo || 1) + 1;
                    setCard(d => ({
                        ...d,
                        kanban: [],
                        kanbanPeriod: { periodNo: nextNo, startDate: new Date().toISOString(), endDate: '' },
                        kanbanHistory: [...kHistory, archived]
                    }));
                    setDirty(true);
                };

                return (
                    <Stack spacing={3}>
                        {/* Dönem Başlığı */}
                        <Paper sx={{ p: 2, borderRadius: '14px', bgcolor: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                            <Stack direction="row" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={1}>
                                <Stack direction="row" alignItems="center" spacing={1.5}>
                                    <Chip label={`Dönem ${kp.periodNo}`} sx={{ bgcolor: '#0F172A', color: '#fff', fontWeight: 700 }} />
                                    <Stack>
                                        {kp.startDate && <Typography variant="caption" color="text.secondary">Başlangıç: {fmt(kp.startDate)}</Typography>}
                                        <Typography variant="caption" color="text.secondary">
                                            {(card.kanban || []).length} görev · {(card.kanban || []).filter(t => t.column === 'tamamlandi').length} tamamlandı
                                        </Typography>
                                    </Stack>
                                </Stack>
                                {!readOnly && (
                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <TextField size="small" type="date" label="Dönem Başlangıcı" value={kp.startDate ? String(kp.startDate).substring(0, 10) : ''} onChange={e => { setCard(d => ({ ...d, kanbanPeriod: { ...kp, startDate: e.target.value } })); setDirty(true); }} InputLabelProps={{ shrink: true }} sx={{ width: 160 }} />
                                        <Button variant="outlined" size="small" color="warning" onClick={closeKanbanPeriod} sx={{ whiteSpace: 'nowrap', fontWeight: 700 }}>
                                            Dönemi Kapat →
                                        </Button>
                                    </Stack>
                                )}
                            </Stack>
                        </Paper>

                        {/* Kanban Board */}
                        <KanbanBoard
                            tasks={card.kanban || []}
                            onChange={(tasks) => { set('kanban', tasks); }}
                            readOnly={readOnly}
                            users={users}
                        />

                        {/* Geçmiş Dönemler */}
                        {kHistory.length > 0 && (
                            <Box>
                                <Typography fontWeight={700} mb={2} color="text.secondary" fontSize="0.85rem" textTransform="uppercase" letterSpacing="0.08em">
                                    Geçmiş Dönemler ({kHistory.length})
                                </Typography>
                                <Stack spacing={2}>
                                    {[...kHistory].reverse().map((h, i) => {
                                        const done = (h.tasks || []).filter(t => t.column === 'tamamlandi').length;
                                        const total = (h.tasks || []).length;
                                        return (
                                            <Paper key={i} sx={{ p: 2.5, borderRadius: '14px', border: '1px solid #EEF2F7' }}>
                                                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1.5}>
                                                    <Stack direction="row" spacing={1} alignItems="center">
                                                        <Chip label={`${h.periodNo}. Dönem`} size="small" sx={{ bgcolor: '#F1F5F9', fontWeight: 700 }} />
                                                        <Typography variant="caption" color="text.secondary">
                                                            {h.startDate ? fmt(h.startDate) : '—'} → {h.endDate ? fmt(h.endDate) : '—'}
                                                        </Typography>
                                                    </Stack>
                                                    <Typography variant="caption" fontWeight={700} color={done === total && total > 0 ? '#10B981' : '#64748B'}>
                                                        {done}/{total} tamamlandı
                                                    </Typography>
                                                </Stack>
                                                {total > 0 && (
                                                    <Grid container spacing={1}>
                                                        {COLUMNS.map(col => {
                                                            const colTasks = sortByPriority((h.tasks || []).filter(t => t.column === col.key));
                                                            if (colTasks.length === 0) return null;
                                                            return (
                                                                <Grid item xs={12} sm={6} md={3} key={col.key}>
                                                                    <Typography variant="caption" fontWeight={700} color={col.color} display="block" mb={0.5}>{col.label} ({colTasks.length})</Typography>
                                                                    {colTasks.map((t, ti) => (
                                                                        <Box key={ti} sx={{ mb: 0.5, p: 1, bgcolor: col.bg, borderRadius: 1.5, borderLeft: `2px solid ${PRIORITY[t.priority]?.color || col.color}` }}>
                                                                            <Typography variant="caption" fontWeight={600} display="block">{t.title}</Typography>
                                                                            {t.dueDate && <Typography variant="caption" color="text.secondary">{fmt(t.dueDate)}{t.dueTime ? ' ' + t.dueTime : ''}</Typography>}
                                                                        </Box>
                                                                    ))}
                                                                </Grid>
                                                            );
                                                        })}
                                                    </Grid>
                                                )}
                                            </Paper>
                                        );
                                    })}
                                </Stack>
                            </Box>
                        )}
                    </Stack>
                );
            })()}

            {/* ── TAB 5: SOSYAL MEDYA ──────────────────────────────────────── */}
            {tab === 5 && (() => {
                const pkg = card._packageData || null;
                const cp = card.currentPeriod || { posts: [], stories: [], reels: [], periodNo: 1 };
                const history = card.socialHistory || [];

                const TYPES = [
                    { key: 'posts',   label: 'Post',  quota: pkg?.posts   || 0, color: '#3B82F6', icon: '📄' },
                    { key: 'stories', label: 'Story', quota: pkg?.stories || 0, color: '#8B5CF6', icon: '📖' },
                    { key: 'reels',   label: 'Reels', quota: pkg?.reels   || 0, color: '#EC4899', icon: '🎬' },
                ];

                return (
                    <Stack spacing={3}>
                        {/* Dönem başlığı ve kontroller */}
                        <Paper sx={{ p: 2.5, borderRadius: '14px', border: '1px solid #EEF2F7', bgcolor: '#F8FAFC' }}>
                            <Stack direction="row" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={1} mb={2}>
                                <Typography fontWeight={800} fontSize="1rem">
                                    {cp.periodNo || 1}. Dönem
                                    {pkg && <Chip size="small" label={pkg.name} sx={{ ml: 1, bgcolor: '#EFF6FF', color: '#3B82F6', fontWeight: 700 }} />}
                                </Typography>
                                {!readOnly && (
                                    <Button size="small" variant="outlined" color="warning" onClick={closePeriod}>
                                        Dönemi Kapat → Geçmişe Taşı
                                    </Button>
                                )}
                            </Stack>
                            <Grid container spacing={1.5}>
                                <Grid item xs={12} sm={6}>
                                    <TextField fullWidth size="small" label="Dönem Başlangıcı" type="date" value={cp.startDate ? cp.startDate.substring(0, 10) : ''} onChange={e => setPeriodField('startDate', e.target.value)} InputLabelProps={{ shrink: true }} disabled={readOnly} />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField fullWidth size="small" label="Dönem Bitişi" type="date" value={cp.endDate ? cp.endDate.substring(0, 10) : ''} onChange={e => setPeriodField('endDate', e.target.value)} InputLabelProps={{ shrink: true }} disabled={readOnly} />
                                </Grid>
                            </Grid>
                        </Paper>

                        {/* Her tip için kota + liste */}
                        {TYPES.map(({ key, label, quota, color, icon }) => {
                            const entries = cp[key] || [];
                            const done = entries.filter(e => e.sharedAt).length;
                            const pct = quota > 0 ? Math.min(100, Math.round((done / quota) * 100)) : 0;
                            const nsf = newSocialForms[key];
                            return (
                                <Paper key={key} sx={{ p: 2.5, borderRadius: '14px', border: `1px solid ${color}30` }}>
                                    <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1.5}>
                                        <Typography fontWeight={700}>{icon} {label}</Typography>
                                        <Typography variant="caption" sx={{ color, fontWeight: 700 }}>{done}{quota > 0 ? ` / ${quota}` : ''} paylaşım</Typography>
                                    </Stack>

                                    {quota > 0 && (
                                        <Box mb={2}>
                                            <Stack direction="row" justifyContent="space-between" mb={0.5}>
                                                <Typography variant="caption" color="text.secondary">Kota İlerlemesi</Typography>
                                                <Typography variant="caption" fontWeight={800} sx={{ color }}>
                                                    {done} / {quota} {done >= quota ? '✅' : `(${quota - done} kaldı)`}
                                                </Typography>
                                            </Stack>
                                            <LinearProgress variant="determinate" value={pct}
                                                sx={{ height: 8, borderRadius: 4, bgcolor: color + '20', '& .MuiLinearProgress-bar': { bgcolor: color } }} />
                                        </Box>
                                    )}

                                    <Stack spacing={1}>
                                        {entries.map((item, i) => (
                                            editingSocialEntry?.type === key && editingSocialEntry?.idx === i ? (
                                                /* ── Düzenleme satırı ── */
                                                <Paper key={i} sx={{ p: 1.5, borderRadius: 2, border: `2px solid ${color}60`, bgcolor: color + '06' }}>
                                                    <Grid container spacing={1.5} alignItems="center">
                                                        <Grid item xs={12} sm={4}>
                                                            <TextField fullWidth label="Tarih" type="date" size="small"
                                                                value={editingSocialEntry.data.sharedAt ? editingSocialEntry.data.sharedAt.substring(0, 10) : ''}
                                                                onChange={e => setEditingSocialEntry(p => ({ ...p, data: { ...p.data, sharedAt: e.target.value } }))}
                                                                InputLabelProps={{ shrink: true }} />
                                                        </Grid>
                                                        <Grid item xs={12} sm={6}>
                                                            <TextField fullWidth label="Not" size="small"
                                                                value={editingSocialEntry.data.note || ''}
                                                                onChange={e => setEditingSocialEntry(p => ({ ...p, data: { ...p.data, note: e.target.value } }))} />
                                                        </Grid>
                                                        <Grid item xs={12} sm={2}>
                                                            <Stack direction="row" justifyContent="center">
                                                                <Tooltip title="Kaydet"><IconButton size="small" onClick={saveEditSocialEntry} sx={{ color }}><CheckCircleIcon fontSize="small" /></IconButton></Tooltip>
                                                                <Tooltip title="İptal"><IconButton size="small" onClick={() => setEditingSocialEntry(null)}><CloseIcon fontSize="small" /></IconButton></Tooltip>
                                                            </Stack>
                                                        </Grid>
                                                    </Grid>
                                                </Paper>
                                            ) : (
                                                /* ── Görüntü satırı ── */
                                                <Paper key={i} sx={{ p: 1.5, borderRadius: 2, border: `1px solid ${item.sharedAt ? color + '40' : '#E2E8F0'}`, bgcolor: item.sharedAt ? color + '06' : '#fff' }}>
                                                    <Stack direction="row" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={1}>
                                                        <Stack direction="row" spacing={1.5} alignItems="center" flex={1} minWidth={0}>
                                                            <Typography variant="body2" fontWeight={600} sx={{ color: item.sharedAt ? color : '#94A3B8', whiteSpace: 'nowrap' }}>
                                                                {item.sharedAt ? fmt(item.sharedAt) : 'Tarih yok'}
                                                            </Typography>
                                                            {item.note && (
                                                                <Typography variant="body2" color="text.secondary" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                                    — {item.note}
                                                                </Typography>
                                                            )}
                                                        </Stack>
                                                        {!readOnly && (
                                                            <Stack direction="row" spacing={0}>
                                                                <Tooltip title="Revize Ekle">
                                                                    <IconButton size="small" onClick={() => openRevisionFromSocial(key, item)} sx={{ color: '#F59E0B' }}>
                                                                        <BrushIcon fontSize="small" />
                                                                    </IconButton>
                                                                </Tooltip>
                                                                <Tooltip title="Düzenle">
                                                                    <IconButton size="small" onClick={() => setEditingSocialEntry({ type: key, idx: i, data: { ...item } })}>
                                                                        <EditIcon fontSize="small" color="primary" />
                                                                    </IconButton>
                                                                </Tooltip>
                                                                <Tooltip title="Sil">
                                                                    <IconButton size="small" onClick={() => delSocialEntry(key, i)}>
                                                                        <DeleteIcon fontSize="small" color="error" />
                                                                    </IconButton>
                                                                </Tooltip>
                                                            </Stack>
                                                        )}
                                                    </Stack>
                                                </Paper>
                                            )
                                        ))}
                                        {entries.length === 0 && <Typography variant="body2" color="text.secondary" sx={{ py: 1 }}>Bu dönem henüz {label} eklenmedi.</Typography>}

                                        {/* ── Yeni Ekle Formu ── */}
                                        {!readOnly && (
                                            <Paper sx={{ p: 1.5, borderRadius: 2, border: `2px dashed ${color}40`, bgcolor: color + '04' }}>
                                                <Grid container spacing={1.5} alignItems="center">
                                                    <Grid item xs={12} sm={4}>
                                                        <TextField fullWidth label="Tarih" type="date" size="small"
                                                            value={nsf.sharedAt}
                                                            onChange={e => setNewSocialForms(p => ({ ...p, [key]: { ...p[key], sharedAt: e.target.value } }))}
                                                            InputLabelProps={{ shrink: true }} />
                                                    </Grid>
                                                    <Grid item xs={12} sm={6}>
                                                        <TextField fullWidth label="Not" size="small"
                                                            value={nsf.note}
                                                            onChange={e => setNewSocialForms(p => ({ ...p, [key]: { ...p[key], note: e.target.value } }))}
                                                            placeholder={`${label} notu...`} />
                                                    </Grid>
                                                    <Grid item xs={12} sm={2}>
                                                        <Button variant="contained" size="small" fullWidth startIcon={<AddIcon />}
                                                            onClick={() => handleAddSocialEntry(key)}
                                                            sx={{ bgcolor: color, '&:hover': { bgcolor: color, opacity: 0.88 }, fontWeight: 700 }}>
                                                            Ekle
                                                        </Button>
                                                    </Grid>
                                                </Grid>
                                            </Paper>
                                        )}
                                    </Stack>
                                </Paper>
                            );
                        })}

                        {/* GEÇMİŞ DÖNEMLER */}
                        {history.length > 0 && (
                            <Box>
                                <Typography fontWeight={700} mb={1.5} color="text.secondary">📁 Geçmiş Dönemler</Typography>
                                <Stack spacing={1.5}>
                                    {[...history].reverse().map((period, idx) => {
                                        const no = history.length - idx;
                                        const totalDone = (period.posts?.length || 0) + (period.stories?.length || 0) + (period.reels?.length || 0);
                                        return (
                                            <Paper key={idx} sx={{ borderRadius: '14px', border: '1px solid #EEF2F7', overflow: 'hidden' }}>
                                                <Box sx={{ p: 2, bgcolor: '#F8FAFC', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <Typography fontWeight={700}>{period.periodNo || no}. Dönem</Typography>
                                                    <Stack direction="row" spacing={1} alignItems="center">
                                                        <Typography variant="caption" color="text.secondary">
                                                            {fmt(period.startDate)} — {fmt(period.endDate)}
                                                        </Typography>
                                                        <Chip size="small" label={`${totalDone} paylaşım`} sx={{ bgcolor: '#EFF6FF', color: '#3B82F6', fontSize: '0.7rem' }} />
                                                    </Stack>
                                                </Box>
                                                <Box sx={{ p: 2 }}>
                                                    <Grid container spacing={2}>
                                                        {[{ key: 'posts', label: 'Post', color: '#3B82F6' }, { key: 'stories', label: 'Story', color: '#8B5CF6' }, { key: 'reels', label: 'Reels', color: '#EC4899' }].map(({ key, label, color }) => (
                                                            (period[key]?.length || 0) > 0 && (
                                                                <Grid item xs={12} sm={4} key={key}>
                                                                    <Typography variant="caption" fontWeight={700} sx={{ color }}>{label} ({period[key].length})</Typography>
                                                                    <Stack spacing={0.5} mt={0.5}>
                                                                        {period[key].map((e, ei) => (
                                                                            <Typography key={ei} variant="caption" color="text.secondary" display="block">
                                                                                • {e.sharedAt ? fmt(e.sharedAt) : 'Tarihi yok'} {e.note ? `— ${e.note}` : ''}
                                                                            </Typography>
                                                                        ))}
                                                                    </Stack>
                                                                </Grid>
                                                            )
                                                        ))}
                                                        {totalDone === 0 && <Grid item xs={12}><Typography variant="body2" color="text.secondary">Bu dönemde paylaşım kaydı yok.</Typography></Grid>}
                                                    </Grid>
                                                </Box>
                                            </Paper>
                                        );
                                    })}
                                </Stack>
                            </Box>
                        )}
                    </Stack>
                );
            })()}

            {/* ── TAB 6: İLERLEME ─────────────────────────────────────────── */}
            {tab === 6 && (() => {
                const sortedItems = [...ALL_SERVICE_ITEMS].sort((a, b) => (card[b.field] ? 1 : 0) - (card[a.field] ? 1 : 0));
                return (
                    <Stack spacing={3}>
                        {sortedItems.map(item => {
                            const logEntries = [...(card[item.log] || [])].reverse();
                            return (
                                <Paper key={item.field} sx={{ p: 3, borderRadius: '14px', border: '1px solid #EEF2F7' }}>
                                    {/* Başlık + aktif switch */}
                                    <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
                                        <Typography fontWeight={700} fontSize="1rem" display="flex" alignItems="center" gap={1}>{item.icon} {item.label}</Typography>
                                        {!readOnly
                                            ? <FormControlLabel control={<Switch checked={!!card[item.field]} onChange={e => set(item.field, e.target.checked)} />} label="Aktif" />
                                            : <Chip size="small" label={card[item.field] ? 'Aktif' : 'Pasif'} sx={{ bgcolor: card[item.field] ? item.color + '20' : '#F1F5F9', color: card[item.field] ? item.color : '#64748B', fontWeight: 700 }} />
                                        }
                                    </Stack>

                                    {card[item.field] && (
                                        <Stack spacing={2.5}>
                                            {/* İlerleme çubuğu */}
                                            <Box>
                                                <Stack direction="row" justifyContent="space-between" mb={1}>
                                                    <Typography variant="body2" color="text.secondary">Tamamlanma</Typography>
                                                    <Typography fontWeight={900} fontSize="1.1rem" sx={{ color: item.color }}>%{card[item.prog] || 0}</Typography>
                                                </Stack>
                                                <LinearProgress variant="determinate" value={card[item.prog] || 0}
                                                    sx={{ height: 14, borderRadius: 7, bgcolor: item.color + '20', '& .MuiLinearProgress-bar': { bgcolor: item.color, borderRadius: 7 } }} />
                                            </Box>

                                            {/* İlerleme Güncelleme Formu */}
                                            {!readOnly && (
                                                <ProgressUpdateForm
                                                    color={item.color}
                                                    currentProg={card[item.prog] || 0}
                                                    onUpdate={(prog, note) => {
                                                        const newEntry = { progress: prog, note, date: new Date().toISOString() };
                                                        setCard(d => ({
                                                            ...d,
                                                            [item.prog]: prog,
                                                            [item.log]: [...(d[item.log] || []), newEntry]
                                                        }));
                                                        setDirty(true);
                                                    }}
                                                />
                                            )}

                                            {/* Geçmiş İlerleme Notları */}
                                            {logEntries.length > 0 && (
                                                <Box>
                                                    <Typography variant="caption" fontWeight={700} color="text.secondary" textTransform="uppercase" letterSpacing="0.06em" display="block" mb={1.5}>
                                                        İlerleme Geçmişi ({logEntries.length} kayıt)
                                                    </Typography>
                                                    <Stack spacing={1}>
                                                        {logEntries.map((entry, i) => (
                                                            <Box key={i} sx={{ display: 'flex', gap: 1.5 }}>
                                                                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', pt: 0.5 }}>
                                                                    <Box sx={{ width: 28, height: 28, borderRadius: '50%', bgcolor: item.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                                                        <Typography sx={{ fontSize: '0.6rem', fontWeight: 900, color: '#fff' }}>%{entry.progress}</Typography>
                                                                    </Box>
                                                                    {i < logEntries.length - 1 && <Box sx={{ width: 2, flex: 1, bgcolor: '#E2E8F0', mt: 0.5 }} />}
                                                                </Box>
                                                                <Box sx={{ pb: 1.5, flex: 1 }}>
                                                                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                                                                        <Typography variant="body2" fontWeight={600} sx={{ color: '#0F172A' }}>{entry.note || '—'}</Typography>
                                                                        <Typography variant="caption" color="text.secondary" sx={{ ml: 1, flexShrink: 0 }}>{fmt(entry.date)}</Typography>
                                                                    </Stack>
                                                                </Box>
                                                            </Box>
                                                        ))}
                                                    </Stack>
                                                </Box>
                                            )}
                                            {logEntries.length === 0 && (
                                                <Typography variant="caption" color="text.secondary">Henüz ilerleme notu eklenmedi.</Typography>
                                            )}
                                        </Stack>
                                    )}
                                </Paper>
                            );
                        })}
                    </Stack>
                );
            })()}

            {/* ── TAB 7: TOPLANTILER ───────────────────────────────────────── */}
            {tab === 7 && (
                <Stack spacing={2.5}>
                    {/* Header */}
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Box>
                            <Typography fontWeight={800} fontSize="1rem" color="#0F172A">Toplantılar</Typography>
                            <Typography variant="caption" color="#94A3B8">
                                {(card.meetings || []).length} toplantı · {upcomingMeetings.length} yaklaşan
                            </Typography>
                        </Box>
                        {!readOnly && (
                            <Button variant="contained" startIcon={<AddIcon />} onClick={openAddMeeting}
                                sx={{ bgcolor: '#0F172A', '&:hover': { bgcolor: '#1E293B' }, borderRadius: '10px',
                                      fontWeight: 700, px: 2, boxShadow: '0 4px 14px rgba(15,23,42,0.2)' }}>
                                Toplantı Ekle
                            </Button>
                        )}
                    </Stack>

                    {/* Yaklaşan */}
                    {upcomingMeetings.length > 0 && (
                        <Box>
                            <Stack direction="row" alignItems="center" spacing={1} mb={1.5}>
                                <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#3B82F6' }} />
                                <Typography variant="caption" fontWeight={800} color="#3B82F6" textTransform="uppercase" letterSpacing="0.08em">
                                    Yaklaşan · {upcomingMeetings.length}
                                </Typography>
                            </Stack>
                            <Stack spacing={1.5}>
                                {upcomingMeetings.map((m, i) => {
                                    const realIdx = card.meetings.indexOf(m);
                                    const isToday = m.date && new Date(m.date).toDateString() === new Date().toDateString();
                                    return (
                                        <Paper key={i} sx={{
                                            borderRadius: '14px', overflow: 'hidden', boxShadow: 'none',
                                            border: '1.5px solid #EEF2F7',
                                            '&:hover': { borderColor: '#3B82F6', boxShadow: '0 4px 20px rgba(59,130,246,0.1)' },
                                            transition: 'all 0.18s'
                                        }}>
                                            {/* Renk şeridi */}
                                            <Box sx={{ height: 3, bgcolor: isToday ? '#10B981' : '#3B82F6' }} />
                                            <Box sx={{ p: 2.5 }}>
                                                <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                                                    <Stack direction="row" spacing={2} alignItems="flex-start" flex={1} minWidth={0}>
                                                        {/* Tarih kutusu */}
                                                        <Box sx={{ textAlign: 'center', minWidth: 52, bgcolor: '#F8FAFC', borderRadius: '10px', p: 1, border: '1px solid #EEF2F7', flexShrink: 0 }}>
                                                            <Typography fontWeight={900} fontSize="1.3rem" color="#0F172A" lineHeight={1}>
                                                                {m.date ? new Date(m.date).getDate() : '—'}
                                                            </Typography>
                                                            <Typography variant="caption" color="#94A3B8" fontWeight={600} fontSize="0.62rem" textTransform="uppercase">
                                                                {m.date ? new Date(m.date).toLocaleString('tr-TR', { month: 'short' }) : ''}
                                                            </Typography>
                                                        </Box>
                                                        {/* İçerik */}
                                                        <Box flex={1} minWidth={0}>
                                                            <Stack direction="row" alignItems="center" spacing={1} mb={0.5} flexWrap="wrap">
                                                                <Typography fontWeight={700} fontSize="0.95rem" color="#0F172A">
                                                                    {m.title || 'Başlıksız Toplantı'}
                                                                </Typography>
                                                                {isToday && <Chip label="Bugün" size="small" sx={{ bgcolor: '#ECFDF5', color: '#059669', fontWeight: 700, fontSize: '0.65rem', height: 20, borderRadius: '6px' }} />}
                                                            </Stack>
                                                            <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
                                                                {m.time && (
                                                                    <Stack direction="row" alignItems="center" spacing={0.5}>
                                                                        <AccessTimeIcon sx={{ fontSize: 13, color: '#94A3B8' }} />
                                                                        <Typography variant="caption" color="#64748B" fontWeight={600}>{m.time}</Typography>
                                                                    </Stack>
                                                                )}
                                                                {m.location && (
                                                                    <Stack direction="row" alignItems="center" spacing={0.5}>
                                                                        <LinkIcon sx={{ fontSize: 13, color: '#94A3B8' }} />
                                                                        <Typography variant="caption" color="#64748B" sx={{ maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                                            {m.location}
                                                                        </Typography>
                                                                    </Stack>
                                                                )}
                                                            </Stack>
                                                            {m.notes && (
                                                                <Typography variant="caption" color="#94A3B8" mt={0.8} display="block"
                                                                    sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                                    {m.notes}
                                                                </Typography>
                                                            )}
                                                        </Box>
                                                    </Stack>
                                                    {!readOnly && (
                                                        <Stack direction="row" spacing={0.5} ml={1} flexShrink={0}>
                                                            <IconButton size="small" onClick={() => openEditMeeting(realIdx)}
                                                                sx={{ bgcolor: '#EFF6FF', color: '#3B82F6', borderRadius: '8px', '&:hover': { bgcolor: '#DBEAFE' } }}>
                                                                <EditIcon sx={{ fontSize: 15 }} />
                                                            </IconButton>
                                                            <IconButton size="small" onClick={() => delMeeting(realIdx)}
                                                                sx={{ bgcolor: '#FEF2F2', color: '#EF4444', borderRadius: '8px', '&:hover': { bgcolor: '#FECACA' } }}>
                                                                <DeleteIcon sx={{ fontSize: 15 }} />
                                                            </IconButton>
                                                        </Stack>
                                                    )}
                                                </Stack>
                                            </Box>
                                        </Paper>
                                    );
                                })}
                            </Stack>
                        </Box>
                    )}

                    {/* Geçmiş */}
                    {pastMeetings.length > 0 && (
                        <Box>
                            <Stack direction="row" alignItems="center" spacing={1} mb={1.5}>
                                <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#CBD5E1' }} />
                                <Typography variant="caption" fontWeight={800} color="#94A3B8" textTransform="uppercase" letterSpacing="0.08em">
                                    Geçmiş · {pastMeetings.length}
                                </Typography>
                            </Stack>
                            <Stack spacing={1.5}>
                                {pastMeetings.map((m, i) => {
                                    const realIdx = card.meetings.indexOf(m);
                                    return (
                                        <Paper key={i} sx={{
                                            borderRadius: '14px', overflow: 'hidden', boxShadow: 'none',
                                            border: '1.5px solid #F1F5F9', opacity: 0.8
                                        }}>
                                            <Box sx={{ height: 3, bgcolor: '#E2E8F0' }} />
                                            <Box sx={{ p: 2.5 }}>
                                                <Stack direction="row" justifyContent="space-between" alignItems="center">
                                                    <Stack direction="row" spacing={2} alignItems="center" flex={1} minWidth={0}>
                                                        <Box sx={{ textAlign: 'center', minWidth: 52, bgcolor: '#F8FAFC', borderRadius: '10px', p: 1, border: '1px solid #EEF2F7', flexShrink: 0 }}>
                                                            <Typography fontWeight={900} fontSize="1.3rem" color="#94A3B8" lineHeight={1}>
                                                                {m.date ? new Date(m.date).getDate() : '—'}
                                                            </Typography>
                                                            <Typography variant="caption" color="#CBD5E1" fontWeight={600} fontSize="0.62rem" textTransform="uppercase">
                                                                {m.date ? new Date(m.date).toLocaleString('tr-TR', { month: 'short' }) : ''}
                                                            </Typography>
                                                        </Box>
                                                        <Box flex={1} minWidth={0}>
                                                            <Typography fontWeight={700} fontSize="0.9rem" color="#64748B">
                                                                {m.title || 'Başlıksız Toplantı'}
                                                            </Typography>
                                                            <Stack direction="row" spacing={2} mt={0.3} flexWrap="wrap" useFlexGap>
                                                                {m.time && <Typography variant="caption" color="#94A3B8">{m.time}</Typography>}
                                                                {m.location && <Typography variant="caption" color="#94A3B8" sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.location}</Typography>}
                                                            </Stack>
                                                        </Box>
                                                    </Stack>
                                                    {!readOnly && (
                                                        <Stack direction="row" spacing={0.5} ml={1}>
                                                            <IconButton size="small" onClick={() => openEditMeeting(realIdx)}
                                                                sx={{ color: '#CBD5E1', borderRadius: '8px', '&:hover': { bgcolor: '#EFF6FF', color: '#3B82F6' } }}>
                                                                <EditIcon sx={{ fontSize: 15 }} />
                                                            </IconButton>
                                                            <IconButton size="small" onClick={() => delMeeting(realIdx)}
                                                                sx={{ color: '#CBD5E1', borderRadius: '8px', '&:hover': { bgcolor: '#FEF2F2', color: '#EF4444' } }}>
                                                                <DeleteIcon sx={{ fontSize: 15 }} />
                                                            </IconButton>
                                                        </Stack>
                                                    )}
                                                </Stack>
                                            </Box>
                                        </Paper>
                                    );
                                })}
                            </Stack>
                        </Box>
                    )}

                    {/* Boş durum */}
                    {(card.meetings || []).length === 0 && (
                        <Box textAlign="center" py={8} sx={{ border: '2px dashed #E2E8F0', borderRadius: '16px' }}>
                            <Box sx={{ width: 56, height: 56, borderRadius: '16px', bgcolor: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2 }}>
                                <EventIcon sx={{ fontSize: 28, color: '#CBD5E1' }} />
                            </Box>
                            <Typography color="#94A3B8" fontWeight={600}>Henüz toplantı eklenmemiş</Typography>
                            {!readOnly && (
                                <Button variant="outlined" startIcon={<AddIcon />} onClick={openAddMeeting} sx={{ mt: 2, borderRadius: '10px', fontWeight: 600 }}>
                                    İlk Toplantıyı Ekle
                                </Button>
                            )}
                        </Box>
                    )}
                </Stack>
            )}

            {/* ── TOPLANTI DIALOG ───────────────────────────────────────────── */}
            <Dialog open={meetingDialog} onClose={() => setMeetingDialog(false)} maxWidth="sm" fullWidth
                PaperProps={{ sx: { borderRadius: '20px', boxShadow: '0 24px 64px rgba(15,23,42,0.18)' } }}>
                <DialogTitle sx={{ pb: 0, pt: 3, px: 3 }}>
                    <Typography fontWeight={800} fontSize="1.05rem" color="#0F172A">
                        {editingMeeting?.idx === -1 ? 'Yeni Toplantı' : 'Toplantıyı Düzenle'}
                    </Typography>
                    <Typography variant="body2" color="#94A3B8" mt={0.3}>Toplantı bilgilerini doldurun</Typography>
                </DialogTitle>
                <DialogContent sx={{ px: 3, pt: 2.5, pb: 1 }}>
                    {editingMeeting && (
                        <Stack spacing={2}>
                            <TextField fullWidth size="small" label="Toplantı Başlığı *" autoFocus
                                value={editingMeeting.data.title || ''}
                                onChange={e => setEditingMeeting(p => ({ ...p, data: { ...p.data, title: e.target.value } }))}
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }} />
                            <Grid container spacing={1.5}>
                                <Grid item xs={6}>
                                    <TextField fullWidth size="small" label="Tarih" type="date"
                                        value={editingMeeting.data.date ? String(editingMeeting.data.date).substring(0, 10) : ''}
                                        onChange={e => setEditingMeeting(p => ({ ...p, data: { ...p.data, date: e.target.value } }))}
                                        InputLabelProps={{ shrink: true }}
                                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }} />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField fullWidth size="small" label="Saat" type="time"
                                        value={editingMeeting.data.time || ''}
                                        onChange={e => setEditingMeeting(p => ({ ...p, data: { ...p.data, time: e.target.value } }))}
                                        InputLabelProps={{ shrink: true }}
                                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }} />
                                </Grid>
                            </Grid>
                            <TextField fullWidth size="small" label="Konum / Bağlantı"
                                value={editingMeeting.data.location || ''}
                                onChange={e => setEditingMeeting(p => ({ ...p, data: { ...p.data, location: e.target.value } }))}
                                placeholder="Ofis adresi, Zoom linki, Google Meet..."
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }} />
                            <TextField fullWidth size="small" label="Notlar" multiline rows={3}
                                value={editingMeeting.data.notes || ''}
                                onChange={e => setEditingMeeting(p => ({ ...p, data: { ...p.data, notes: e.target.value } }))}
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }} />
                            <FormControlLabel
                                control={<Switch checked={!!editingMeeting.data.isPast}
                                    onChange={e => setEditingMeeting(p => ({ ...p, data: { ...p.data, isPast: e.target.checked } }))} />}
                                label={<Typography variant="body2" fontWeight={600} color="#374151">Geçmiş toplantı olarak işaretle</Typography>} />
                        </Stack>
                    )}
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 3, pt: 1.5, gap: 1 }}>
                    <Button onClick={() => setMeetingDialog(false)}
                        sx={{ borderRadius: '10px', color: '#64748B', fontWeight: 600 }}>İptal</Button>
                    <Button variant="contained" onClick={saveMeeting}
                        disabled={!editingMeeting?.data?.title?.trim()}
                        sx={{ borderRadius: '10px', bgcolor: '#0F172A', '&:hover': { bgcolor: '#1E293B' },
                              fontWeight: 700, px: 3, boxShadow: '0 4px 14px rgba(15,23,42,0.25)' }}>
                        {editingMeeting?.idx === -1 ? 'Ekle' : 'Güncelle'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* ── TAB 8: REVİZYONLAR ──────────────────────────────────────── */}
            {tab === 8 && (() => {
                const REV_CATS = [
                    { key: 'post',      label: 'Post',             color: '#3B82F6', bg: '#EFF6FF',  icon: <GridViewIcon sx={{ fontSize: 15 }} /> },
                    { key: 'story',     label: 'Story',            color: '#8B5CF6', bg: '#F5F3FF',  icon: <AutoStoriesIcon sx={{ fontSize: 15 }} /> },
                    { key: 'reels',     label: 'Reels',            color: '#EC4899', bg: '#FDF2F8',  icon: <MovieIcon sx={{ fontSize: 15 }} /> },
                    { key: 'web',       label: 'Web Sitesi',       color: '#10B981', bg: '#ECFDF5',  icon: <WebIcon sx={{ fontSize: 15 }} /> },
                    { key: 'kurumsal',  label: 'Kurumsal Kimlik',  color: '#F59E0B', bg: '#FFFBEB',  icon: <BrushIcon sx={{ fontSize: 15 }} /> },
                    { key: 'diger',     label: 'Diğer',            color: '#64748B', bg: '#F8FAFC',  icon: <LinkIcon sx={{ fontSize: 15 }} /> },
                ];
                const getCat = (key) => REV_CATS.find(c => c.key === key) || REV_CATS[5];
                const revisions = card.revisions || [];
                const isOverdueRev = (r) => r.dueDate && new Date(r.dueDate) < new Date();

                return (
                    <Stack spacing={2.5}>
                        {/* Header */}
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                            <Box>
                                <Typography fontWeight={800} fontSize="1rem" color="#0F172A">Revizyonlar</Typography>
                                <Typography variant="caption" color="#94A3B8">
                                    {revisions.length} revizyon kaydı
                                </Typography>
                            </Box>
                            {!readOnly && (
                                <Button variant="contained" startIcon={<AddIcon />} onClick={openAddRevision}
                                    sx={{ bgcolor: '#0F172A', '&:hover': { bgcolor: '#1E293B' }, borderRadius: '10px',
                                          fontWeight: 700, px: 2, boxShadow: '0 4px 14px rgba(15,23,42,0.2)' }}>
                                    Revizyon Ekle
                                </Button>
                            )}
                        </Stack>

                        {/* Kategori özet şeridi */}
                        {revisions.length > 0 && (
                            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                                {REV_CATS.map(cat => {
                                    const count = revisions.filter(r => (r.category || 'diger') === cat.key).length;
                                    if (count === 0) return null;
                                    return (
                                        <Chip key={cat.key}
                                            icon={<Box sx={{ color: cat.color, display: 'flex', ml: '6px !important' }}>{cat.icon}</Box>}
                                            label={`${cat.label} · ${count}`}
                                            size="small"
                                            sx={{ bgcolor: cat.bg, color: cat.color, fontWeight: 700, fontSize: '0.72rem',
                                                  borderRadius: '8px', border: `1px solid ${cat.color}30` }} />
                                    );
                                })}
                            </Stack>
                        )}

                        {/* Revizyon kartları */}
                        {revisions.length > 0 ? (
                            <Stack spacing={1.5}>
                                {revisions.map((r, i) => {
                                    const cat = getCat(r.category || 'diger');
                                    const overdue = isOverdueRev(r);
                                    return (
                                        <Paper key={i} sx={{
                                            borderRadius: '14px', overflow: 'hidden', boxShadow: 'none',
                                            border: overdue ? '1.5px solid #FECACA' : '1.5px solid #EEF2F7',
                                            transition: 'all 0.18s',
                                            '&:hover': { borderColor: cat.color, boxShadow: `0 4px 16px ${cat.color}15` }
                                        }}>
                                            <Box sx={{ height: 3, bgcolor: cat.color }} />
                                            <Box sx={{ p: 2.5 }}>
                                                <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                                                    <Stack direction="row" spacing={2} alignItems="flex-start" flex={1} minWidth={0}>
                                                        {/* Kategori ikonu */}
                                                        <Box sx={{ width: 40, height: 40, borderRadius: '10px', bgcolor: cat.bg,
                                                            border: `1px solid ${cat.color}30`,
                                                            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: cat.color }}>
                                                            {cat.icon}
                                                        </Box>
                                                        {/* İçerik */}
                                                        <Box flex={1} minWidth={0}>
                                                            <Stack direction="row" alignItems="center" spacing={1} mb={0.5} flexWrap="wrap">
                                                                <Chip label={cat.label} size="small"
                                                                    sx={{ bgcolor: cat.bg, color: cat.color, fontWeight: 700,
                                                                          fontSize: '0.65rem', height: 20, borderRadius: '6px',
                                                                          border: `1px solid ${cat.color}30` }} />
                                                                {overdue && <Chip label="Süresi Geçmiş" size="small"
                                                                    sx={{ bgcolor: '#FEF2F2', color: '#EF4444', fontWeight: 700,
                                                                          fontSize: '0.65rem', height: 20, borderRadius: '6px' }} />}
                                                            </Stack>
                                                            <Typography fontWeight={600} fontSize="0.88rem" color="#0F172A" mb={0.8}
                                                                sx={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                                                {r.description || '—'}
                                                            </Typography>
                                                            <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
                                                                {r.receivedAt && (
                                                                    <Stack direction="row" alignItems="center" spacing={0.5}>
                                                                        <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#94A3B8' }} />
                                                                        <Typography variant="caption" color="#64748B">
                                                                            Alındı: <Box component="span" fontWeight={700}>{fmt(r.receivedAt)}</Box>
                                                                        </Typography>
                                                                    </Stack>
                                                                )}
                                                                {r.dueDate && (
                                                                    <Stack direction="row" alignItems="center" spacing={0.5}>
                                                                        <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: overdue ? '#EF4444' : '#94A3B8' }} />
                                                                        <Typography variant="caption" color={overdue ? '#EF4444' : '#64748B'} fontWeight={overdue ? 700 : 400}>
                                                                            Termin: <Box component="span" fontWeight={700}>{fmt(r.dueDate)}</Box>
                                                                        </Typography>
                                                                    </Stack>
                                                                )}
                                                            </Stack>
                                                        </Box>
                                                    </Stack>
                                                    {!readOnly && (
                                                        <Stack direction="row" spacing={0.5} ml={1} flexShrink={0}>
                                                            <IconButton size="small" onClick={() => openEditRevision(i)}
                                                                sx={{ bgcolor: '#EFF6FF', color: '#3B82F6', borderRadius: '8px', '&:hover': { bgcolor: '#DBEAFE' } }}>
                                                                <EditIcon sx={{ fontSize: 15 }} />
                                                            </IconButton>
                                                            <IconButton size="small" onClick={() => delRevision(i)}
                                                                sx={{ bgcolor: '#FEF2F2', color: '#EF4444', borderRadius: '8px', '&:hover': { bgcolor: '#FECACA' } }}>
                                                                <DeleteIcon sx={{ fontSize: 15 }} />
                                                            </IconButton>
                                                        </Stack>
                                                    )}
                                                </Stack>
                                            </Box>
                                        </Paper>
                                    );
                                })}
                            </Stack>
                        ) : (
                            <Box textAlign="center" py={8} sx={{ border: '2px dashed #E2E8F0', borderRadius: '16px' }}>
                                <Box sx={{ width: 56, height: 56, borderRadius: '16px', bgcolor: '#F1F5F9',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2 }}>
                                    <BrushIcon sx={{ fontSize: 28, color: '#CBD5E1' }} />
                                </Box>
                                <Typography color="#94A3B8" fontWeight={600}>Henüz revizyon kaydı yok</Typography>
                                {!readOnly && (
                                    <Button variant="outlined" startIcon={<AddIcon />} onClick={openAddRevision}
                                        sx={{ mt: 2, borderRadius: '10px', fontWeight: 600 }}>
                                        İlk Revizyonu Ekle
                                    </Button>
                                )}
                            </Box>
                        )}
                    </Stack>
                );
            })()}

            {/* ── REVİZYON DIALOG ───────────────────────────────────────────── */}
            <Dialog open={revisionDialog} onClose={() => setRevisionDialog(false)} maxWidth="sm" fullWidth
                PaperProps={{ sx: { borderRadius: '20px', boxShadow: '0 24px 64px rgba(15,23,42,0.18)' } }}>
                <DialogTitle sx={{ pb: 0, pt: 3, px: 3 }}>
                    <Typography fontWeight={800} fontSize="1.05rem" color="#0F172A">
                        {editingRevision?.idx === -1 ? 'Yeni Revizyon' : 'Revizyonu Düzenle'}
                    </Typography>
                    <Typography variant="body2" color="#94A3B8" mt={0.3}>Revizyon detaylarını girin</Typography>
                </DialogTitle>
                <DialogContent sx={{ px: 3, pt: 2.5, pb: 1 }}>
                    {editingRevision && (
                        <Stack spacing={2}>
                            {/* Kategori seçimi */}
                            <Box>
                                <Typography variant="caption" fontWeight={700} color="#64748B" display="block" mb={1} textTransform="uppercase" letterSpacing="0.06em">Kategori</Typography>
                                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                                    {[
                                        { key: 'post',     label: 'Post',            color: '#3B82F6', bg: '#EFF6FF' },
                                        { key: 'story',    label: 'Story',           color: '#8B5CF6', bg: '#F5F3FF' },
                                        { key: 'reels',    label: 'Reels',           color: '#EC4899', bg: '#FDF2F8' },
                                        { key: 'web',      label: 'Web Sitesi',      color: '#10B981', bg: '#ECFDF5' },
                                        { key: 'kurumsal', label: 'Kurumsal Kimlik', color: '#F59E0B', bg: '#FFFBEB' },
                                        { key: 'diger',    label: 'Diğer',           color: '#64748B', bg: '#F8FAFC' },
                                    ].map(cat => {
                                        const selected = (editingRevision.data.category || 'diger') === cat.key;
                                        return (
                                            <Chip key={cat.key} label={cat.label} onClick={() => setEditingRevision(p => ({ ...p, data: { ...p.data, category: cat.key } }))}
                                                sx={{
                                                    cursor: 'pointer', fontWeight: 700, fontSize: '0.75rem', borderRadius: '8px',
                                                    bgcolor: selected ? cat.color : cat.bg,
                                                    color: selected ? '#fff' : cat.color,
                                                    border: `1.5px solid ${selected ? cat.color : cat.color + '40'}`,
                                                    transition: 'all 0.15s',
                                                    '&:hover': { bgcolor: cat.color, color: '#fff' }
                                                }} />
                                        );
                                    })}
                                </Stack>
                            </Box>

                            <TextField fullWidth size="small" label="Revizyon Açıklaması *" multiline rows={3} autoFocus
                                value={editingRevision.data.description || ''}
                                onChange={e => setEditingRevision(p => ({ ...p, data: { ...p.data, description: e.target.value } }))}
                                placeholder="Müşterinin talep ettiği değişiklikleri açıklayın..."
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }} />

                            <Grid container spacing={1.5}>
                                <Grid item xs={6}>
                                    <TextField fullWidth size="small" label="Alınma Tarihi" type="date"
                                        value={editingRevision.data.receivedAt ? String(editingRevision.data.receivedAt).substring(0, 10) : ''}
                                        onChange={e => setEditingRevision(p => ({ ...p, data: { ...p.data, receivedAt: e.target.value } }))}
                                        InputLabelProps={{ shrink: true }}
                                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }} />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField fullWidth size="small" label="Termin Tarihi" type="date"
                                        value={editingRevision.data.dueDate ? String(editingRevision.data.dueDate).substring(0, 10) : ''}
                                        onChange={e => setEditingRevision(p => ({ ...p, data: { ...p.data, dueDate: e.target.value } }))}
                                        InputLabelProps={{ shrink: true }}
                                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }} />
                                </Grid>
                            </Grid>
                        </Stack>
                    )}
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 3, pt: 1.5, gap: 1 }}>
                    <Button onClick={() => setRevisionDialog(false)}
                        sx={{ borderRadius: '10px', color: '#64748B', fontWeight: 600 }}>İptal</Button>
                    <Button variant="contained" onClick={saveRevision}
                        disabled={!editingRevision?.data?.description?.trim()}
                        sx={{ borderRadius: '10px', bgcolor: '#0F172A', '&:hover': { bgcolor: '#1E293B' },
                              fontWeight: 700, px: 3, boxShadow: '0 4px 14px rgba(15,23,42,0.25)' }}>
                        {editingRevision?.idx === -1 ? 'Ekle' : 'Güncelle'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* ── TAB 9: REKLAMLAR ─────────────────────────────────────────── */}
            {tab === 9 && (() => {
                const ads = card.adCampaigns || [];
                const totalSpent      = ads.reduce((s, a) => s + (a.spent || 0), 0);
                const totalSalesAmt   = ads.reduce((s, a) => s + (a.results?.salesAmount || 0), 0);
                const totalFollowers  = ads.reduce((s, a) => s + (a.results?.followers || 0), 0);
                const totalViews      = ads.reduce((s, a) => s + (a.results?.views || 0), 0);

                const PLATFORM_COLOR = {
                    Instagram: '#E1306C', Facebook: '#1877F2', Google: '#4285F4',
                    TikTok: '#010101', YouTube: '#FF0000', 'Twitter/X': '#1DA1F2',
                    LinkedIn: '#0A66C2', Diğer: '#64748B',
                };

                const RESULT_FIELDS = [
                    { key: 'followers',   label: 'Takipçi',      icon: <PeopleAltIcon />,    color: '#8B5CF6' },
                    { key: 'messages',    label: 'Mesaj',        icon: <MessageIcon />,       color: '#3B82F6' },
                    { key: 'likes',       label: 'Beğeni',       icon: <ThumbUpIcon />,       color: '#EC4899' },
                    { key: 'comments',    label: 'Yorum',        icon: <CommentIcon />,       color: '#F59E0B' },
                    { key: 'views',       label: 'İzlenme',      icon: <VisibilityIcon />,    color: '#06B6D4' },
                    { key: 'shares',      label: 'Paylaşım',     icon: <ShareIcon />,         color: '#10B981' },
                    { key: 'sales',       label: 'Satış (adet)', icon: <ShoppingCartIcon />,  color: '#EF4444' },
                    { key: 'salesAmount', label: 'Satış (₺)',    icon: <PaymentsIcon />,      color: '#10B981' },
                ];

                return (
                    <Stack spacing={3}>
                        {/* Özet kartlar */}
                        <Grid container spacing={2}>
                            {[
                                { label: 'Toplam Harcama',    value: fmtMoney(totalSpent),                            color: '#EF4444' },
                                { label: 'Satış Geliri',      value: fmtMoney(totalSalesAmt),                         color: '#10B981' },
                                { label: 'Kazanılan Takipçi', value: totalFollowers.toLocaleString('tr-TR'),          color: '#8B5CF6' },
                                { label: 'Toplam İzlenme',    value: totalViews.toLocaleString('tr-TR'),              color: '#06B6D4' },
                            ].map((s, i) => (
                                <Grid item xs={6} sm={3} key={i}>
                                    <Paper sx={{ p: 2, borderRadius: '14px', borderTop: `3px solid ${s.color}`, textAlign: 'center', boxShadow: '0 2px 8px rgba(15,23,42,0.05)' }}>
                                        <Typography fontWeight={800} fontSize="1.1rem" color={s.color}>{s.value}</Typography>
                                        <Typography variant="caption" color="text.secondary">{s.label}</Typography>
                                    </Paper>
                                </Grid>
                            ))}
                        </Grid>

                        {/* Başlık + ekle butonu */}
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                            <Box>
                                <Typography fontWeight={800} color="#0F172A">Reklam Kampanyaları</Typography>
                                <Typography variant="caption" color="#94A3B8">{ads.length} kampanya</Typography>
                            </Box>
                            {!readOnly && (
                                <Button variant="contained" size="small" startIcon={<AddIcon />} onClick={openAddAd}
                                    sx={{ borderRadius: '10px', bgcolor: '#0F172A', '&:hover': { bgcolor: '#1E293B' }, fontWeight: 700, px: 2.5, boxShadow: '0 4px 14px rgba(15,23,42,0.2)' }}>
                                    Kampanya Ekle
                                </Button>
                            )}
                        </Stack>

                        {/* Boş durum */}
                        {ads.length === 0 && (
                            <Paper sx={{ p: 5, borderRadius: '14px', border: '1.5px dashed #E2E8F0', textAlign: 'center' }}>
                                <CampaignIcon sx={{ fontSize: 40, color: '#CBD5E1', mb: 1 }} />
                                <Typography color="text.secondary" fontWeight={600}>Henüz reklam kampanyası eklenmemiş.</Typography>
                                {!readOnly && <Typography variant="caption" color="#94A3B8">Kampanya Ekle butonuna tıklayarak başlayın.</Typography>}
                            </Paper>
                        )}

                        {/* Kampanya kartları */}
                        {ads.map((ad, i) => {
                            const pColor = PLATFORM_COLOR[ad.platform] || '#64748B';
                            const budgetPct = ad.budget > 0 ? Math.min(100, Math.round((ad.spent / ad.budget) * 100)) : 0;
                            const overBudget = ad.spent > ad.budget && ad.budget > 0;
                            return (
                                <Paper key={i} sx={{ borderRadius: '16px', overflow: 'hidden', border: '1.5px solid #E8EDF5', boxShadow: '0 2px 12px rgba(15,23,42,0.05)' }}>
                                    {/* Renkli üst şerit */}
                                    <Box sx={{ height: 5, bgcolor: pColor }} />

                                    <Box sx={{ p: 2.5 }}>
                                        {/* Kart başlığı */}
                                        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={2}>
                                            <Stack direction="row" spacing={1.5} alignItems="center">
                                                <Box sx={{ width: 36, height: 36, borderRadius: '10px', bgcolor: pColor + '18', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <CampaignIcon sx={{ fontSize: 18, color: pColor }} />
                                                </Box>
                                                <Box>
                                                    <Typography fontWeight={800} color="#0F172A" fontSize="0.95rem" lineHeight={1.2}>
                                                        {ad.name || `Kampanya #${i + 1}`}
                                                    </Typography>
                                                    <Stack direction="row" spacing={0.8} alignItems="center" mt={0.4}>
                                                        <Chip label={ad.platform || 'Instagram'} size="small"
                                                            sx={{ bgcolor: pColor + '18', color: pColor, fontWeight: 700, fontSize: '0.65rem', height: 18, borderRadius: '5px' }} />
                                                        {(ad.startDate || ad.endDate) && (
                                                            <Typography variant="caption" color="#94A3B8" fontSize="0.7rem">
                                                                {ad.startDate ? new Date(ad.startDate).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric' }) : '?'}
                                                                {' → '}
                                                                {ad.endDate ? new Date(ad.endDate).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Devam ediyor'}
                                                            </Typography>
                                                        )}
                                                    </Stack>
                                                </Box>
                                            </Stack>
                                            {!readOnly && (
                                                <Stack direction="row" spacing={0.5}>
                                                    <Tooltip title="Düzenle">
                                                        <IconButton size="small" onClick={() => openEditAd(i)}
                                                            sx={{ bgcolor: '#EFF6FF', color: '#3B82F6', borderRadius: '8px', '&:hover': { bgcolor: '#DBEAFE' } }}>
                                                            <EditIcon sx={{ fontSize: 15 }} />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title="Sil">
                                                        <IconButton size="small" onClick={() => delAd(i)}
                                                            sx={{ bgcolor: '#FEF2F2', color: '#EF4444', borderRadius: '8px', '&:hover': { bgcolor: '#FEE2E2' } }}>
                                                            <DeleteIcon sx={{ fontSize: 15 }} />
                                                        </IconButton>
                                                    </Tooltip>
                                                </Stack>
                                            )}
                                        </Stack>

                                        {/* Bütçe barı */}
                                        <Box mb={2.5}>
                                            <Stack direction="row" justifyContent="space-between" mb={0.8}>
                                                <Stack direction="row" spacing={2}>
                                                    <Box>
                                                        <Typography variant="caption" color="#94A3B8" fontSize="0.68rem">BÜTÇE</Typography>
                                                        <Typography fontWeight={800} color="#0F172A" fontSize="0.9rem">{fmtMoney(ad.budget)}</Typography>
                                                    </Box>
                                                    <Box>
                                                        <Typography variant="caption" color="#94A3B8" fontSize="0.68rem">HARCANAN</Typography>
                                                        <Typography fontWeight={800} color={overBudget ? '#EF4444' : '#10B981'} fontSize="0.9rem">{fmtMoney(ad.spent)}</Typography>
                                                    </Box>
                                                </Stack>
                                                <Box textAlign="right">
                                                    <Typography variant="caption" color="#94A3B8" fontSize="0.68rem">KULLANIM</Typography>
                                                    <Typography fontWeight={800} color={overBudget ? '#EF4444' : pColor} fontSize="0.9rem">%{budgetPct}</Typography>
                                                </Box>
                                            </Stack>
                                            {ad.budget > 0 && (
                                                <LinearProgress variant="determinate" value={budgetPct}
                                                    sx={{ height: 7, borderRadius: 4, bgcolor: '#F1F5F9',
                                                        '& .MuiLinearProgress-bar': { bgcolor: overBudget ? '#EF4444' : pColor, borderRadius: 4 } }} />
                                            )}
                                        </Box>

                                        {/* Sonuç metrikleri */}
                                        <Typography variant="caption" color="#94A3B8" fontWeight={700} sx={{ textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: '0.65rem' }}>
                                            Kampanya Sonuçları
                                        </Typography>
                                        <Grid container spacing={1} mt={0.5}>
                                            {RESULT_FIELDS.map(({ key, label, icon, color }) => {
                                                const val = ad.results?.[key] || 0;
                                                if (val === 0 && readOnly) return null;
                                                return (
                                                    <Grid item xs={6} sm={3} key={key}>
                                                        <Paper sx={{ p: 1.2, borderRadius: '10px', bgcolor: color + '0D', border: `1px solid ${color}25`, textAlign: 'center' }}>
                                                            <Box sx={{ color, display: 'flex', justifyContent: 'center', mb: 0.3, '& svg': { fontSize: 15 } }}>{icon}</Box>
                                                            <Typography fontWeight={800} color={color} fontSize="0.85rem">
                                                                {key === 'salesAmount' ? fmtMoney(val) : val.toLocaleString('tr-TR')}
                                                            </Typography>
                                                            <Typography variant="caption" color="#94A3B8" fontSize="0.62rem">{label}</Typography>
                                                        </Paper>
                                                    </Grid>
                                                );
                                            })}
                                        </Grid>
                                    </Box>
                                </Paper>
                            );
                        })}
                    </Stack>
                );
            })()}

            {/* ── KAMPANYA DIALOG ─────────────────────────────────────────── */}
            <Dialog open={adDialog} onClose={() => setAdDialog(false)} maxWidth="sm" fullWidth
                PaperProps={{ sx: { borderRadius: '20px', boxShadow: '0 24px 64px rgba(15,23,42,0.18)' } }}>
                <DialogTitle sx={{ pt: 3, px: 3, pb: 1.5, borderBottom: '1px solid #F1F5F9' }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Box>
                            <Typography fontWeight={800} fontSize="1.05rem" color="#0F172A">
                                {editingAd?.idx === -1 ? 'Yeni Kampanya' : 'Kampanyayı Düzenle'}
                            </Typography>
                            <Typography variant="caption" color="#94A3B8">Reklam kampanyası bilgileri</Typography>
                        </Box>
                        <IconButton size="small" onClick={() => setAdDialog(false)}
                            sx={{ bgcolor: '#F8FAFC', borderRadius: '8px', '&:hover': { bgcolor: '#F1F5F9' } }}>
                            <CloseIcon fontSize="small" />
                        </IconButton>
                    </Stack>
                </DialogTitle>
                <DialogContent sx={{ px: 3, pt: 2.5, pb: 1 }}>
                    <Stack spacing={2}>
                        {/* Temel bilgiler */}
                        <Grid container spacing={1.5}>
                            <Grid item xs={12} sm={7}>
                                <TextField fullWidth size="small" label="Kampanya Adı *" value={editingAd?.data?.name || ''}
                                    onChange={e => setAdField('name', e.target.value)}
                                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }} />
                            </Grid>
                            <Grid item xs={12} sm={5}>
                                <FormControl fullWidth size="small">
                                    <InputLabel>Platform</InputLabel>
                                    <Select value={editingAd?.data?.platform || 'Instagram'}
                                        onChange={e => setAdField('platform', e.target.value)} label="Platform"
                                        sx={{ borderRadius: '10px' }}>
                                        {['Instagram', 'Facebook', 'Google', 'TikTok', 'YouTube', 'Twitter/X', 'LinkedIn', 'Diğer'].map(p => (
                                            <MenuItem key={p} value={p}>{p}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={6}>
                                <TextField fullWidth size="small" label="Başlangıç Tarihi" type="date"
                                    value={editingAd?.data?.startDate ? editingAd.data.startDate.substring(0, 10) : ''}
                                    onChange={e => setAdField('startDate', e.target.value)}
                                    InputLabelProps={{ shrink: true }} sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }} />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField fullWidth size="small" label="Bitiş Tarihi" type="date"
                                    value={editingAd?.data?.endDate ? editingAd.data.endDate.substring(0, 10) : ''}
                                    onChange={e => setAdField('endDate', e.target.value)}
                                    InputLabelProps={{ shrink: true }} sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }} />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField fullWidth size="small" label="Bütçe (₺)" type="number"
                                    value={editingAd?.data?.budget || 0}
                                    onChange={e => setAdField('budget', Number(e.target.value))}
                                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }} />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField fullWidth size="small" label="Harcanan (₺)" type="number"
                                    value={editingAd?.data?.spent || 0}
                                    onChange={e => setAdField('spent', Number(e.target.value))}
                                    InputProps={{ sx: { color: '#EF4444', fontWeight: 700 } }}
                                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }} />
                            </Grid>
                        </Grid>

                        <Divider><Typography variant="caption" color="#94A3B8" fontWeight={700} sx={{ textTransform: 'uppercase', letterSpacing: 1, fontSize: '0.65rem' }}>Kampanya Sonuçları</Typography></Divider>

                        <Grid container spacing={1.5}>
                            {[
                                { key: 'followers',   label: 'Takipçi',      color: '#8B5CF6' },
                                { key: 'messages',    label: 'Mesaj',        color: '#3B82F6' },
                                { key: 'likes',       label: 'Beğeni',       color: '#EC4899' },
                                { key: 'comments',    label: 'Yorum',        color: '#F59E0B' },
                                { key: 'views',       label: 'İzlenme',      color: '#06B6D4' },
                                { key: 'shares',      label: 'Paylaşım',     color: '#10B981' },
                                { key: 'sales',       label: 'Satış (adet)', color: '#EF4444' },
                                { key: 'salesAmount', label: 'Satış (₺)',    color: '#10B981' },
                            ].map(({ key, label, color }) => (
                                <Grid item xs={6} sm={3} key={key}>
                                    <TextField fullWidth size="small" label={label} type="number"
                                        value={editingAd?.data?.results?.[key] || 0}
                                        onChange={e => setAdResult(key, e.target.value)}
                                        InputProps={{ sx: { color, fontWeight: 700 } }}
                                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }} />
                                </Grid>
                            ))}
                        </Grid>
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ px: 3, py: 2.5, borderTop: '1px solid #F1F5F9', gap: 1 }}>
                    <Button onClick={() => setAdDialog(false)}
                        sx={{ borderRadius: '10px', color: '#64748B', fontWeight: 600 }}>İptal</Button>
                    <Button variant="contained" onClick={saveAd}
                        disabled={!editingAd?.data?.name?.trim()}
                        sx={{ borderRadius: '10px', bgcolor: '#0F172A', '&:hover': { bgcolor: '#1E293B' },
                              fontWeight: 700, px: 3, boxShadow: '0 4px 14px rgba(15,23,42,0.25)' }}>
                        {editingAd?.idx === -1 ? 'Ekle' : 'Güncelle'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

// ─── YENİ KART DIALOGU ───────────────────────────────────────────────────────
const NewCardDialog = ({ open, onClose, onCreate, users }) => {
    const [form, setForm] = useState({ businessName: '', sector: '', packageRef: '', packageLabel: '', userId: '', agreedPrice: 0 });
    const [packages, setPackages] = useState([]);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (open) axios.get(`${SERVER_URL}/api/packages`).then(r => { if (r.data.success) setPackages(r.data.data); }).catch(() => {});
    }, [open]);

    const handle = async () => {
        if (!form.businessName.trim()) return;
        setSaving(true);
        try {
            const payload = { ...emptyCard, ...form };
            if (!payload.userId) payload.userId = null;
            if (!payload.packageRef) payload.packageRef = null;
            const r = await axios.post(API, payload, { headers: authHeader() });
            onCreate(r.data.data);
            setForm({ businessName: '', sector: '', packageRef: '', packageLabel: '', userId: '', agreedPrice: 0 });
            onClose();
        } catch (e) { alert(e.response?.data?.error || e.message); }
        finally { setSaving(false); }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth
            PaperProps={{ sx: { borderRadius: '20px', boxShadow: '0 24px 64px rgba(15,23,42,0.18)' } }}>
            <DialogTitle sx={{ pb: 0, pt: 3, px: 3 }}>
                <Typography fontWeight={800} fontSize="1.1rem" color="#0F172A">Yeni Müşteri Kartı</Typography>
                <Typography variant="body2" color="#94A3B8" mt={0.3}>Temel bilgileri girerek kart oluşturun</Typography>
            </DialogTitle>
            <DialogContent sx={{ px: 3, pt: 2.5, pb: 1 }}>
                <Stack spacing={2}>
                    <TextField fullWidth size="small" label="İşletme Adı *" value={form.businessName}
                        onChange={e => setForm({ ...form, businessName: e.target.value })} autoFocus
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }} />
                    <TextField fullWidth size="small" label="Sektör" value={form.sector}
                        onChange={e => setForm({ ...form, sector: e.target.value })}
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }} />
                    <FormControl fullWidth size="small">
                        <InputLabel>Paket Seç</InputLabel>
                        <Select value={form.packageRef}
                            onChange={e => { const pkg = packages.find(p => p._id === e.target.value); setForm({ ...form, packageRef: e.target.value, packageLabel: pkg?.name || '', agreedPrice: pkg?.price || 0 }); }}
                            label="Paket Seç" sx={{ borderRadius: '10px' }}>
                            <MenuItem value=""><em>Paket yok</em></MenuItem>
                            {packages.map(p => <MenuItem key={p._id} value={p._id}>{p.name} {p.price ? `— ${fmtMoney(p.price)}/ay` : ''}</MenuItem>)}
                        </Select>
                    </FormControl>
                    <FormControl fullWidth size="small">
                        <InputLabel>Bağlı Müşteri Hesabı</InputLabel>
                        <Select value={form.userId} onChange={e => setForm({ ...form, userId: e.target.value })}
                            label="Bağlı Müşteri Hesabı" sx={{ borderRadius: '10px' }}>
                            <MenuItem value=""><em>Bağlı değil</em></MenuItem>
                            {(users || []).filter(u => u.role === 'musteri').map(u => <MenuItem key={u._id} value={u._id}>{u.name} — {u.email}</MenuItem>)}
                        </Select>
                    </FormControl>
                </Stack>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 3, pt: 1.5, gap: 1 }}>
                <Button onClick={onClose} sx={{ borderRadius: '10px', color: '#64748B', fontWeight: 600 }}>İptal</Button>
                <Button variant="contained" onClick={handle} disabled={saving || !form.businessName.trim()}
                    sx={{ borderRadius: '10px', bgcolor: '#0F172A', '&:hover': { bgcolor: '#1E293B' },
                          fontWeight: 700, px: 3, boxShadow: '0 4px 14px rgba(15,23,42,0.25)' }}>
                    {saving ? 'Oluşturuluyor...' : 'Oluştur'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

// ─── ANA BİLEŞEN ─────────────────────────────────────────────────────────────
const MusteriKartiTab = ({ setMsg, readOnly = false, singleCard = false }) => {
    const [cards, setCards] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeCard, setActiveCard] = useState(null);
    const [newDialogOpen, setNewDialogOpen] = useState(false);

    const load = useCallback(async () => {
        setLoading(true);
        try {
            if (singleCard) {
                const r = await axios.get(`${API}/me`, { headers: authHeader() });
                if (r.data.success) setCards([r.data.data]);
                else setCards([]);
            } else {
                const r = await axios.get(API, { headers: authHeader() });
                if (r.data.success) setCards(r.data.data);
            }
        } catch { setCards([]); }
        finally { setLoading(false); }
    }, [singleCard]);

    const loadUsers = useCallback(async () => {
        try {
            const r = await axios.get(`${SERVER_URL}/api/users`, { headers: authHeader() });
            if (r.data.data) setUsers(r.data.data);
        } catch { }
    }, []);

    useEffect(() => { load(); if (!readOnly) loadUsers(); }, [load, loadUsers, readOnly]);

    // Müşteri görünümü: sadece kendi kartı varsa direkt detaya git
    useEffect(() => {
        if (singleCard && cards.length === 1 && !activeCard) {
            setActiveCard(cards[0]);
        }
    }, [singleCard, cards, activeCard]);

    const handleDelete = async (id) => {
        if (!window.confirm('Bu müşteri kartı silinsin mi?')) return;
        try {
            await axios.delete(`${API}/${id}`, { headers: authHeader() });
            setMsg({ type: 'success', text: 'Kart silindi.' });
            if (activeCard?._id === id) setActiveCard(null);
            load();
        } catch { setMsg({ type: 'error', text: 'Silinemedi.' }); }
    };

    const handleSaved = (successMsg, errMsg) => {
        if (errMsg) { setMsg({ type: 'error', text: errMsg }); return; }
        setMsg({ type: 'success', text: successMsg });
        load();
    };

    if (loading) return <Box textAlign="center" py={10}><CircularProgress /></Box>;

    // Detay görünümü
    if (activeCard) {
        // Güncel versiyon kartı cards listesinden al
        const freshCard = cards.find(c => c._id === activeCard._id) || activeCard;
        return (
            <CardDetail
                card={freshCard}
                onBack={singleCard ? undefined : () => setActiveCard(null)}
                onSaved={handleSaved}
                users={users}
                readOnly={readOnly}
            />
        );
    }

    // Liste görünümü
    return (
        <Box>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
                <Box>
                    <Typography variant="h5" fontWeight={800} color="#0F172A" letterSpacing="-0.02em">Müşteri Kartları</Typography>
                    <Typography variant="body2" color="#94A3B8">{cards.length} müşteri · aktif takip</Typography>
                </Box>
                {!readOnly && (
                    <Button variant="contained" startIcon={<AddIcon />} onClick={() => setNewDialogOpen(true)}
                        sx={{ bgcolor: '#0F172A', '&:hover': { bgcolor: '#1E293B' }, borderRadius: '10px',
                              fontWeight: 700, px: 2.5, py: 1, boxShadow: '0 4px 14px rgba(15,23,42,0.25)' }}>
                        Yeni Kart
                    </Button>
                )}
            </Stack>

            {cards.length === 0 ? (
                <Box textAlign="center" py={12} sx={{ border: '2px dashed #E2E8F0', borderRadius: '20px', bgcolor: '#FAFBFC' }}>
                    <Box sx={{ width: 72, height: 72, borderRadius: '20px', bgcolor: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2 }}>
                        <BusinessIcon sx={{ fontSize: 36, color: '#CBD5E1' }} />
                    </Box>
                    <Typography color="#94A3B8" fontWeight={600} mb={0.5}>Henüz müşteri kartı yok</Typography>
                    <Typography variant="body2" color="#CBD5E1" mb={3}>İlk müşteri kartını oluşturarak başlayın</Typography>
                    {!readOnly && <Button variant="contained" startIcon={<AddIcon />} onClick={() => setNewDialogOpen(true)}
                        sx={{ bgcolor: '#0F172A', borderRadius: '10px', fontWeight: 700 }}>İlk Kartı Oluştur</Button>}
                </Box>
            ) : (
                <Grid container spacing={2.5}>
                    {cards.map(card => (
                        <Grid item xs={12} sm={6} lg={4} key={card._id}>
                            <SummaryCard card={card} onClick={() => setActiveCard(card)} onDelete={handleDelete} readOnly={readOnly} />
                        </Grid>
                    ))}
                </Grid>
            )}

            <NewCardDialog
                open={newDialogOpen}
                onClose={() => setNewDialogOpen(false)}
                onCreate={(card) => { setCards(prev => [card, ...prev]); setMsg({ type: 'success', text: 'Kart oluşturuldu.' }); }}
                users={users}
            />
        </Box>
    );
};

export default MusteriKartiTab;
