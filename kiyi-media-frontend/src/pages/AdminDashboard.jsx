// src/pages/AdminDashboard.jsx
import React, { useState, useEffect, useRef } from 'react';
import { SERVER_URL } from '../config';
import {
    Typography, TextField, Button, IconButton, Box, Tabs, Tab,
    FormControl, InputLabel, Select, MenuItem, OutlinedInput, Chip, Stack, Card,
    Dialog, DialogTitle, DialogContent, DialogActions, LinearProgress, Paper,
    Grid, Tooltip, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Avatar, Switch, CircularProgress, Divider, List, ListItem, ListItemText,
    ListItemAvatar, Badge, Snackbar, Alert
} from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

import DeleteIcon from '@mui/icons-material/Delete';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import PhoneIcon from '@mui/icons-material/Phone';
import EditIcon from '@mui/icons-material/Edit';
import MailIcon from '@mui/icons-material/Mail';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import ViewKanbanIcon from '@mui/icons-material/ViewKanban';
import CalculateIcon from '@mui/icons-material/Calculate';
import BookIcon from '@mui/icons-material/Book';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ReplyIcon from '@mui/icons-material/Reply';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DesignServicesIcon from '@mui/icons-material/DesignServices';
import PeopleIcon from '@mui/icons-material/People';
import SendIcon from '@mui/icons-material/Send';
import PushPinIcon from '@mui/icons-material/PushPin';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LinkIcon from '@mui/icons-material/Link';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import BadgeIcon from '@mui/icons-material/Badge';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

import Accounting from '../components/Accounting';
import MusteriKartiTab from '../components/MusteriKartiTab';
import PaketlerTab from '../components/PaketlerTab';
import ProfilTab from '../components/ProfilTab';

const adminTheme = createTheme({
    palette: {
        mode: 'light',
        primary: { main: '#3B82F6' },
        background: { default: '#F8FAFC', paper: '#FFFFFF' },
        text: { primary: '#0F172A', secondary: '#64748B' },
        divider: 'rgba(0,0,0,0.08)',
    },
    typography: { fontFamily: "'Inter', 'Outfit', sans-serif" },
    shape: { borderRadius: 8 },
    components: {
        MuiPaper: { styleOverrides: { root: { backgroundImage: 'none' } } },
        MuiButton: { styleOverrides: { root: { textTransform: 'none', fontWeight: 600 } } },
    },
});

// ─── CONSTANTS ───────────────────────────────────────────────────────────────

const C = {
    sidebar: '#0F172A',
    sidebarHover: 'rgba(255,255,255,0.07)',
    sidebarActive: 'rgba(59,130,246,0.18)',
    content: '#F8FAFC',
    accent: '#3B82F6',
    white: '#FFFFFF',
    text: '#0F172A',
    textSec: '#64748B',
};

const authHeader = () => {
    try {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        return { Authorization: `Bearer ${user.token || ''}` };
    } catch {
        return { Authorization: '' };
    }
};

const roleBadge = (role) => {
    const map = {
        patron: { label: 'Patron', bg: '#7C3AED', color: '#fff' },
        yonetici: { label: 'Yönetici', bg: '#3B82F6', color: '#fff' },
        stajyer: { label: 'Stajyer', bg: '#F59E0B', color: '#fff' },
        musteri: { label: 'Müşteri', bg: '#10B981', color: '#fff' },
        admin: { label: 'Admin', bg: '#EF4444', color: '#fff' },
        editor: { label: 'Editör', bg: '#3B82F6', color: '#fff' },
        viewer: { label: 'İzleyici', bg: '#6B7280', color: '#fff' },
    };
    const r = map[role] || { label: role, bg: '#6B7280', color: '#fff' };
    return <Chip label={r.label} size="small" sx={{ bgcolor: r.bg, color: r.color, fontWeight: 700, fontSize: '0.7rem' }} />;
};

const serviceOptions = [
    'Web Tasarım & Yazılım', 'Dijital Pazarlama & SEO', 'Sosyal Medya Yönetimi',
    'Grafik Tasarım', 'Video Prodüksiyon', 'Kurumsal Kimlik', 'E-Ticaret Danışmanlığı'
];

// ─── SHARED: SIDEBAR ─────────────────────────────────────────────────────────

const Sidebar = ({ user, logout, navigate, navItems, activeTab, setActiveTab }) => (
    <Box sx={{
        width: 260, height: '100vh', bgcolor: C.sidebar, display: 'flex',
        flexDirection: 'column', position: 'fixed', left: 0, top: 0, zIndex: 200,
        borderRight: '1px solid rgba(255,255,255,0.06)',
        boxShadow: '4px 0 24px rgba(0,0,0,0.15)'
    }}>
        {/* Logo */}
        <Box sx={{ px: 3, py: 2.5, borderBottom: '1px solid rgba(255,255,255,0.06)', flexShrink: 0 }}>
            <Typography variant="h6" fontWeight={800} sx={{ color: C.accent, letterSpacing: '-0.03em', fontSize: '1.1rem' }}>
                Kıyı Medya
            </Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.62rem', letterSpacing: '0.18em', fontWeight: 600, mt: 0.2 }}>
                YÖNETİM PANELİ
            </Typography>
        </Box>

        {/* User info */}
        <Box sx={{ px: 2.5, py: 2, borderBottom: '1px solid rgba(255,255,255,0.06)', flexShrink: 0 }}>
            <Stack direction="row" spacing={1.5} alignItems="center">
                <Avatar sx={{ bgcolor: C.accent, width: 34, height: 34, fontSize: '0.8rem', fontWeight: 700, flexShrink: 0 }}>
                    {user?.name?.charAt(0)?.toUpperCase()}
                </Avatar>
                <Box sx={{ minWidth: 0 }}>
                    <Typography variant="body2" fontWeight={700} sx={{ color: '#fff', lineHeight: 1.2, fontSize: '0.82rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.name}</Typography>
                    <Box mt={0.4}>{roleBadge(user?.role)}</Box>
                </Box>
            </Stack>
        </Box>

        {/* Nav */}
        <Box sx={{ flex: 1, py: 1.5, overflowY: 'auto', '&::-webkit-scrollbar': { width: 4 }, '&::-webkit-scrollbar-thumb': { bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 2 } }}>
            {navItems.map((item) => (
                <Box
                    key={item.key}
                    onClick={() => setActiveTab(item.key)}
                    sx={{
                        mx: 1.5, mb: 0.5, px: 2, py: 1.2, borderRadius: 1.5, cursor: 'pointer',
                        display: 'flex', alignItems: 'center', gap: 1.5,
                        bgcolor: activeTab === item.key ? C.sidebarActive : 'transparent',
                        borderLeft: activeTab === item.key ? `3px solid ${C.accent}` : '3px solid transparent',
                        transition: 'all 0.18s ease',
                        '&:hover': { bgcolor: activeTab === item.key ? C.sidebarActive : C.sidebarHover }
                    }}
                >
                    <Box sx={{ color: activeTab === item.key ? C.accent : 'rgba(255,255,255,0.45)', display: 'flex', flexShrink: 0 }}>
                        {item.icon}
                    </Box>
                    <Typography variant="body2" fontWeight={activeTab === item.key ? 700 : 400}
                        sx={{ color: activeTab === item.key ? '#fff' : 'rgba(255,255,255,0.55)', fontSize: '0.81rem', letterSpacing: 0.2, whiteSpace: 'nowrap' }}>
                        {item.label}
                    </Typography>
                </Box>
            ))}
        </Box>

        {/* Logout */}
        <Box sx={{ px: 2, py: 1.5, borderTop: '1px solid rgba(255,255,255,0.06)', flexShrink: 0 }}>
            <Button fullWidth startIcon={<LogoutIcon fontSize="small" />} onClick={() => { logout(); navigate('/admin/login'); }}
                sx={{ color: 'rgba(255,255,255,0.45)', justifyContent: 'flex-start', textTransform: 'none', fontWeight: 600, fontSize: '0.81rem', borderRadius: 1.5, py: 1, '&:hover': { color: '#EF4444', bgcolor: 'rgba(239,68,68,0.08)' } }}>
                Çıkış Yap
            </Button>
        </Box>
    </Box>
);

const PageHeader = ({ title, subtitle }) => (
    <Box sx={{
        bgcolor: '#fff',
        px: 4, py: 2.5,
        borderBottom: '1px solid #E2E8F0',
        position: 'sticky',
        top: 0,
        zIndex: 10,
        flexShrink: 0
    }}>
        <Typography variant="h5" fontWeight={800} color={C.text} sx={{ lineHeight: 1.2, letterSpacing: '-0.02em' }}>
            {title}
        </Typography>
        {subtitle && (
            <Typography variant="body2" color={C.textSec} sx={{ mt: 0.3 }}>{subtitle}</Typography>
        )}
    </Box>
);

const ContentArea = ({ children }) => (
    <Box sx={{
        ml: '260px',
        minHeight: '100vh',
        bgcolor: C.content,
        display: 'flex',
        flexDirection: 'column',
        width: 'calc(100% - 260px)',
        overflowX: 'hidden'
    }}>
        {children}
    </Box>
);

// ─── SHARED TABS: PORTFÖY ────────────────────────────────────────────────────

const PortfolyoTab = ({ setMsg }) => {
    const [portfolios, setPortfolios] = useState([]);
    const [services, setServices] = useState([]);
    const [form, setForm] = useState({ title: '', category: [], description: '', projectUrl: '', logo: null, image: null, video: null, gallery: [], pdf: null });
    const [isEdit, setIsEdit] = useState(false);
    const [editId, setEditId] = useState(null);
    const [progress, setProgress] = useState(0);
    const [uploading, setUploading] = useState(false);
    const [uploadLabel, setUploadLabel] = useState('');

    const load = async () => {
        try {
            const res = await axios.get(`${SERVER_URL}/api/portfolio`, { headers: authHeader() });
            if (res.data.success) setPortfolios(res.data.data);
        } catch { }
    };
    const loadServices = async () => {
        try {
            const res = await axios.get(`${SERVER_URL}/api/services`);
            if (res.data.data) setServices(res.data.data);
        } catch { }
    };
    useEffect(() => { load(); loadServices(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.title) return;
        setUploading(true); setProgress(0);
        const fd = new FormData();
        fd.append('title', form.title);
        fd.append('category', Array.isArray(form.category) ? form.category.join(',') : form.category);
        fd.append('description', form.description);
        if (form.projectUrl) fd.append('projectUrl', form.projectUrl);
        if (form.logo) fd.append('logo', form.logo);
        if (form.image) fd.append('portray', form.image);
        if (form.video?.length) Array.from(form.video).forEach(v => fd.append('video', v));
        if (form.gallery?.length) Array.from(form.gallery).forEach(g => fd.append('gallery', g));
        if (form.pdf?.length) Array.from(form.pdf).forEach(p => fd.append('pdf', p));

        const files = [
            form.logo && `Logo: ${form.logo.name}`,
            form.image && `Kapak: ${form.image.name}`,
            form.gallery?.length && `Galeri: ${form.gallery.length} dosya`,
            form.video?.length && `Video: ${form.video.length} dosya`,
            form.pdf?.length && `PDF: ${form.pdf.length} dosya`,
        ].filter(Boolean);
        setUploadLabel(files.length ? files.join(' · ') : 'Dosyalar');

        try {
            const cfg = {
                headers: { 'Content-Type': 'multipart/form-data', ...authHeader() },
                onUploadProgress: p => setProgress(Math.round(p.loaded * 100 / p.total))
            };
            if (isEdit) { await axios.put(`${SERVER_URL}/api/portfolio/${editId}`, fd, cfg); setMsg({ type: 'success', text: 'Güncellendi!' }); }
            else { await axios.post(`${SERVER_URL}/api/portfolio`, fd, cfg); setMsg({ type: 'success', text: 'Yüklendi!' }); }
            setForm({ title: '', category: [], description: '', projectUrl: '', logo: null, image: null, video: null, gallery: [], pdf: null });
            setIsEdit(false); setEditId(null); setProgress(0); setUploadLabel(''); load();
        } catch (err) { setMsg({ type: 'error', text: err.response?.data?.error || err.message }); setProgress(0); }
        finally { setUploading(false); }
    };

    const handleEdit = (item) => { setIsEdit(true); setEditId(item._id); setForm({ title: item.title, category: item.category || [], description: item.description || '', projectUrl: item.projectUrl || '', logo: null, image: null, video: null, gallery: [], pdf: null }); };
    const handleDelete = async (id) => { if (window.confirm('Silinsin mi?')) { await axios.delete(`${SERVER_URL}/api/portfolio/${id}`, { headers: authHeader() }); load(); } };
    const toggleFeatured = async (id, val) => {
        try { await axios.put(`${SERVER_URL}/api/portfolio/${id}`, { featured: !val }, { headers: authHeader() }); load(); }
        catch { setMsg({ type: 'error', text: 'Güncelleme başarısız.' }); }
    };

    return (
        <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
                <Paper sx={{ p: 3, borderRadius: 2, boxShadow: '0 1px 6px rgba(0,0,0,0.06)' }}>
                    <Typography variant="h6" fontWeight={700} mb={2} color={C.text}>{isEdit ? 'Projeyi Düzenle' : 'Yeni Proje'}</Typography>
                    <form onSubmit={handleSubmit}>
                        <TextField fullWidth label="Başlık" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} margin="dense" required size="small" />
                        <FormControl fullWidth margin="dense" size="small">
                            <InputLabel>Kategoriler</InputLabel>
                            <Select multiple value={form.category} onChange={e => setForm({ ...form, category: typeof e.target.value === 'string' ? e.target.value.split(',') : e.target.value })} input={<OutlinedInput label="Kategoriler" />} renderValue={s => s.join(', ')}>
                                {services.length === 0
                                    ? <MenuItem disabled><em>Henüz hizmet eklenmedi</em></MenuItem>
                                    : services.map(s => <MenuItem key={s._id} value={s.title}>{s.title}</MenuItem>)
                                }
                            </Select>
                        </FormControl>
                        <TextField fullWidth label="Açıklama" multiline rows={2} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} margin="dense" size="small" />
                        <TextField fullWidth label="Proje URL" value={form.projectUrl} onChange={e => setForm({ ...form, projectUrl: e.target.value })} margin="dense" size="small" />
                        <Stack spacing={1} mt={1.5}>
                            {[
                                { label: 'Kapak Görseli', field: 'image', accept: 'image/*', multiple: false },
                                { label: 'Logo', field: 'logo', accept: 'image/*', multiple: false },
                                { label: 'Galeri (Çoklu)', field: 'gallery', accept: 'image/*', multiple: true },
                                { label: 'Video (Çoklu)', field: 'video', accept: 'video/*', multiple: true },
                                { label: 'PDF Dosyası (Çoklu)', field: 'pdf', accept: '.pdf,application/pdf', multiple: true },
                            ].map(({ label, field, accept, multiple }) => (
                                <Box key={field}>
                                    <Button component="label" variant="outlined" size="small" fullWidth startIcon={<CloudUploadIcon />}
                                        color={form[field] ? 'success' : 'primary'}
                                        sx={{ justifyContent: 'flex-start' }}>
                                        {form[field]
                                            ? (multiple ? `${form[field].length} dosya seçildi` : form[field].name)
                                            : label}
                                        <input hidden type="file" accept={accept} multiple={multiple}
                                            onChange={e => setForm({ ...form, [field]: multiple ? e.target.files : e.target.files[0] })} />
                                    </Button>
                                </Box>
                            ))}
                        </Stack>
                        {uploading && (
                            <Box mt={1.5}>
                                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                                    Yükleniyor: {uploadLabel} — %{progress}
                                </Typography>
                                <LinearProgress variant="determinate" value={progress} />
                            </Box>
                        )}
                        <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }} disabled={uploading}>
                            {uploading ? `Yükleniyor %${progress}...` : isEdit ? 'GÜNCELLE' : 'YÜKLE'}
                        </Button>
                        {isEdit && <Button fullWidth color="error" size="small" sx={{ mt: 0.5 }} onClick={() => { setIsEdit(false); setEditId(null); setForm({ title: '', category: [], description: '', projectUrl: '', logo: null, image: null, video: null, gallery: [] }); }}>İPTAL</Button>}
                    </form>
                </Paper>
            </Grid>
            <Grid item xs={12} md={8}>
                {portfolios.length === 0 ? <Box textAlign="center" py={6}><Typography color="text.secondary">Henüz proje yok.</Typography></Box> :
                    portfolios.map(item => (
                        <Card key={item._id} sx={{ mb: 1.5, p: 2, display: 'flex', alignItems: 'center', gap: 2, borderRadius: 2, boxShadow: '0 1px 6px rgba(0,0,0,0.06)', border: '1px solid #F1F5F9' }}>
                            <Avatar src={`${SERVER_URL}${item.logo}`} variant="rounded" sx={{ width: 48, height: 48 }} />
                            <Box flex={1}>
                                <Typography variant="subtitle2" fontWeight={700}>{item.title}</Typography>
                                <Typography variant="caption" color="text.secondary">{Array.isArray(item.category) ? item.category.join(', ') : item.category}</Typography>
                            </Box>
                            <Tooltip title={item.featured ? 'Öne Çıkarıldı' : 'Öne Çıkar'}>
                                <IconButton size="small" onClick={() => toggleFeatured(item._id, item.featured)} sx={{ color: item.featured ? '#F59E0B' : 'inherit' }}>
                                    {item.featured ? <StarIcon /> : <StarBorderIcon />}
                                </IconButton>
                            </Tooltip>
                            <IconButton size="small" onClick={() => handleEdit(item)}><EditIcon fontSize="small" color="primary" /></IconButton>
                            <IconButton size="small" onClick={() => handleDelete(item._id)}><DeleteIcon fontSize="small" color="error" /></IconButton>
                        </Card>
                    ))}
            </Grid>
        </Grid>
    );
};

// ─── SHARED TABS: HİZMETLER ──────────────────────────────────────────────────

const HizmetlerTab = ({ setMsg }) => {
    const [services, setServices] = useState([]);
    const [form, setForm] = useState({ title: '', description: '', tags: '', matchKey: '', order: 0, image: null });
    const [isEdit, setIsEdit] = useState(false);
    const [editId, setEditId] = useState(null);
    const [progress, setProgress] = useState(0);
    const [uploading, setUploading] = useState(false);

    const load = async () => {
        try { const r = await axios.get(`${SERVER_URL}/api/services`); if (r.data.data) setServices(r.data.data); } catch { }
    };
    useEffect(() => { load(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.title) return;
        setUploading(true); setProgress(0);
        const fd = new FormData();
        fd.append('title', form.title); fd.append('description', form.description);
        fd.append('tags', JSON.stringify(form.tags.split(',').map(t => t.trim()).filter(Boolean)));
        fd.append('matchKey', form.matchKey); fd.append('order', form.order);
        if (form.image) fd.append('image', form.image);
        try {
            const cfg = {
                headers: { 'Content-Type': 'multipart/form-data', ...authHeader() },
                onUploadProgress: p => setProgress(Math.round(p.loaded * 100 / p.total))
            };
            if (isEdit) { await axios.put(`${SERVER_URL}/api/services/${editId}`, fd, cfg); setMsg({ type: 'success', text: 'Güncellendi!' }); }
            else { await axios.post(`${SERVER_URL}/api/services`, fd, cfg); setMsg({ type: 'success', text: 'Eklendi!' }); }
            setForm({ title: '', description: '', tags: '', matchKey: '', order: 0, image: null }); setIsEdit(false); setEditId(null); setProgress(0); load();
        } catch (err) { setMsg({ type: 'error', text: err.response?.data?.error || err.message }); setProgress(0); }
        finally { setUploading(false); }
    };

    const handleEdit = (item) => { setIsEdit(true); setEditId(item._id); setForm({ title: item.title, description: item.description || '', tags: Array.isArray(item.tags) ? item.tags.join(', ') : (item.tags || ''), matchKey: item.matchKey || '', order: item.order || 0, image: null }); };
    const handleDelete = async (id) => { if (window.confirm('Silinsin mi?')) { await axios.delete(`${SERVER_URL}/api/services/${id}`, { headers: authHeader() }); load(); } };

    return (
        <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
                <Paper sx={{ p: 3, borderRadius: 2, boxShadow: '0 1px 6px rgba(0,0,0,0.06)' }}>
                    <Typography variant="h6" fontWeight={700} mb={2} color={C.text}>{isEdit ? 'Düzenle' : 'Yeni Hizmet'}</Typography>
                    <form onSubmit={handleSubmit}>
                        <TextField fullWidth label="Başlık" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} margin="dense" size="small" required />
                        <TextField fullWidth label="Açıklama" multiline rows={2} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} margin="dense" size="small" />
                        <TextField fullWidth label="Etiketler (virgülle)" value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })} margin="dense" size="small" placeholder="Web, SEO" />
                        <TextField fullWidth label="Eşleşme Anahtarı" value={form.matchKey} onChange={e => setForm({ ...form, matchKey: e.target.value })} margin="dense" size="small" />
                        <TextField fullWidth label="Sıra" type="number" value={form.order} onChange={e => setForm({ ...form, order: Number(e.target.value) })} margin="dense" size="small" />
                        <Button component="label" variant="outlined" size="small" fullWidth sx={{ mt: 1 }}
                            startIcon={<CloudUploadIcon />} color={form.image ? 'success' : 'primary'}>
                            {form.image ? form.image.name : 'Resim Seç'}
                            <input hidden type="file" accept="image/*" onChange={e => setForm({ ...form, image: e.target.files[0] })} />
                        </Button>
                        {uploading && (
                            <Box mt={1}>
                                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                                    {form.image ? `Yükleniyor: ${form.image.name}` : 'Yükleniyor...'} — %{progress}
                                </Typography>
                                <LinearProgress variant="determinate" value={progress} />
                            </Box>
                        )}
                        <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }} disabled={uploading}>
                            {uploading ? `Yükleniyor %${progress}...` : isEdit ? 'GÜNCELLE' : 'KAYDET'}
                        </Button>
                        {isEdit && <Button fullWidth color="error" size="small" sx={{ mt: 0.5 }} onClick={() => { setIsEdit(false); setEditId(null); setForm({ title: '', description: '', tags: '', matchKey: '', order: 0, image: null }); }}>İPTAL</Button>}
                    </form>
                </Paper>
            </Grid>
            <Grid item xs={12} md={8}>
                <TableContainer component={Paper} sx={{ overflowX: 'auto', borderRadius: 2, boxShadow: '0 1px 6px rgba(0,0,0,0.06)' }}>
                    <Table size="small" sx={{ minWidth: 500 }}>
                        <TableHead><TableRow sx={{ bgcolor: '#F8FAFC' }}><TableCell sx={{ fontWeight: 700 }}>Resim</TableCell><TableCell sx={{ fontWeight: 700 }}>Başlık</TableCell><TableCell sx={{ fontWeight: 700 }}>Etiketler</TableCell><TableCell sx={{ fontWeight: 700 }}>Anahtar</TableCell><TableCell sx={{ fontWeight: 700 }}>Sıra</TableCell><TableCell align="right" sx={{ fontWeight: 700 }}>İşlem</TableCell></TableRow></TableHead>
                        <TableBody>
                            {services.map(item => (
                                <TableRow key={item._id} hover>
                                    <TableCell><Box component="img" src={item.image ? `${SERVER_URL}${item.image}` : 'https://via.placeholder.com/60x40'} sx={{ width: 56, height: 36, objectFit: 'cover', borderRadius: 1 }} /></TableCell>
                                    <TableCell><Typography variant="body2" fontWeight={600}>{item.title}</Typography></TableCell>
                                    <TableCell><Stack direction="row" flexWrap="wrap" gap={0.5}>{(Array.isArray(item.tags) ? item.tags : []).map((t, i) => <Chip key={i} label={t} size="small" />)}</Stack></TableCell>
                                    <TableCell>{item.matchKey}</TableCell>
                                    <TableCell>{item.order}</TableCell>
                                    <TableCell align="right">
                                        <IconButton size="small" onClick={() => handleEdit(item)}><EditIcon fontSize="small" color="primary" /></IconButton>
                                        <IconButton size="small" onClick={() => handleDelete(item._id)}><DeleteIcon fontSize="small" color="error" /></IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Grid>
        </Grid>
    );
};

// ─── SHARED TABS: BLOG ───────────────────────────────────────────────────────

const BlogTab = ({ setMsg }) => {
    const [blogs, setBlogs] = useState([]);
    const [form, setForm] = useState({ title: '', content: '', image: null });
    const [isEdit, setIsEdit] = useState(false);
    const [editId, setEditId] = useState(null);
    const [progress, setProgress] = useState(0);
    const [uploading, setUploading] = useState(false);

    const load = async () => { try { const r = await axios.get(`${SERVER_URL}/api/blogs`, { headers: authHeader() }); if (r.data.success) setBlogs(r.data.data); } catch { } };
    useEffect(() => { load(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUploading(true); setProgress(0);
        const fd = new FormData();
        fd.append('title', form.title); fd.append('content', form.content);
        if (form.image) fd.append('image', form.image);
        try {
            const cfg = {
                headers: { 'Content-Type': 'multipart/form-data', ...authHeader() },
                onUploadProgress: p => setProgress(Math.round(p.loaded * 100 / p.total))
            };
            if (isEdit) await axios.put(`${SERVER_URL}/api/blogs/${editId}`, fd, cfg);
            else await axios.post(`${SERVER_URL}/api/blogs`, fd, cfg);
            setMsg({ type: 'success', text: isEdit ? 'Güncellendi!' : 'Yayınlandı!' });
            setForm({ title: '', content: '', image: null }); setIsEdit(false); setEditId(null); setProgress(0); load();
        } catch (err) { setMsg({ type: 'error', text: err.message }); setProgress(0); }
        finally { setUploading(false); }
    };

    return (
        <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
                <Paper sx={{ p: 3, borderRadius: 2, boxShadow: '0 1px 6px rgba(0,0,0,0.06)' }}>
                    <Typography variant="h6" fontWeight={700} mb={2} color={C.text}>{isEdit ? 'Düzenle' : 'Yeni Blog'}</Typography>
                    <form onSubmit={handleSubmit}>
                        <TextField fullWidth label="Başlık" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} margin="dense" size="small" />
                        <TextField fullWidth multiline rows={4} label="İçerik" value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} margin="dense" size="small" />
                        <Box mt={1.5}>
                            <Button variant="outlined" fullWidth component="label"
                                color={form.image ? 'success' : 'primary'}
                                startIcon={form.image ? <CheckCircleIcon /> : <CloudUploadIcon />}
                                sx={{ justifyContent: 'flex-start', textTransform: 'none', fontSize: '0.8rem' }}>
                                {form.image ? form.image.name : 'Kapak Resmi Seç'}
                                <input type="file" hidden accept="image/*" onChange={e => setForm({ ...form, image: e.target.files[0] })} />
                            </Button>
                        </Box>
                        {uploading && (
                            <Box mt={1.5}>
                                <Typography variant="caption" color="text.secondary">
                                    Yükleniyor: {form.image?.name} — %{progress}
                                </Typography>
                                <LinearProgress variant="determinate" value={progress} sx={{ mt: 0.5, borderRadius: 1 }} />
                            </Box>
                        )}
                        <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }} disabled={uploading}>
                            {uploading ? `Yükleniyor %${progress}...` : 'KAYDET'}
                        </Button>
                        {isEdit && <Button fullWidth color="error" size="small" sx={{ mt: 0.5 }} onClick={() => { setIsEdit(false); setEditId(null); setForm({ title: '', content: '', image: null }); }}>İPTAL</Button>}
                    </form>
                </Paper>
            </Grid>
            <Grid item xs={12} md={8}>
                {blogs.length === 0 ? <Box textAlign="center" py={6}><Typography color="text.secondary">Henüz blog yok.</Typography></Box> :
                    blogs.map(b => (
                        <Card key={b._id} sx={{ mb: 1.5, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderRadius: 2, boxShadow: '0 1px 6px rgba(0,0,0,0.06)', border: '1px solid #F1F5F9' }}>
                            <Typography variant="body2" fontWeight={600}>{b.title}</Typography>
                            <Stack direction="row">
                                <IconButton size="small" onClick={() => { setIsEdit(true); setEditId(b._id); setForm({ title: b.title, content: b.content, image: null }); }}><EditIcon fontSize="small" color="primary" /></IconButton>
                                <IconButton size="small" onClick={async () => { if (window.confirm('Silinsin mi?')) { await axios.delete(`${SERVER_URL}/api/blogs/${b._id}`, { headers: authHeader() }); load(); } }}><DeleteIcon fontSize="small" color="error" /></IconButton>
                            </Stack>
                        </Card>
                    ))}
            </Grid>
        </Grid>
    );
};

// ─── SHARED TABS: GELEN KUTUSU ───────────────────────────────────────────────

const GelenKutusuTab = ({ setMsg }) => {
    const [messages, setMessages] = useState([]);
    const [selected, setSelected] = useState(null);

    const load = async () => { try { const r = await axios.get(`${SERVER_URL}/api/messages`, { headers: authHeader() }); if (r.data.success) setMessages(r.data.data); } catch { } };
    useEffect(() => { load(); }, []);

    const handleDelete = async (id) => { if (window.confirm('Silinsin mi?')) { await axios.delete(`${SERVER_URL}/api/messages/${id}`, { headers: authHeader() }); load(); setSelected(null); } };

    return (
        <>
            <TableContainer component={Paper} sx={{ overflowX: 'auto', borderRadius: 2, boxShadow: '0 1px 6px rgba(0,0,0,0.06)' }}>
                <Table sx={{ minWidth: 500 }}>
                    <TableHead><TableRow sx={{ bgcolor: '#F8FAFC' }}><TableCell sx={{ fontWeight: 700, fontSize: '0.78rem', color: C.textSec, textTransform: 'uppercase', letterSpacing: 0.5 }}>Tarih</TableCell><TableCell sx={{ fontWeight: 700, fontSize: '0.78rem', color: C.textSec, textTransform: 'uppercase', letterSpacing: 0.5 }}>İsim</TableCell><TableCell sx={{ fontWeight: 700, fontSize: '0.78rem', color: C.textSec, textTransform: 'uppercase', letterSpacing: 0.5 }}>Konu</TableCell><TableCell align="right" sx={{ fontWeight: 700, fontSize: '0.78rem', color: C.textSec, textTransform: 'uppercase', letterSpacing: 0.5 }}>İşlem</TableCell></TableRow></TableHead>
                    <TableBody>
                        {messages.length === 0 ? <TableRow><TableCell colSpan={4} align="center"><Typography color="text.secondary" py={3}>Gelen kutusu boş.</Typography></TableCell></TableRow> :
                            messages.map(msg => (
                                <TableRow key={msg._id} hover onClick={() => setSelected(msg)} sx={{ cursor: 'pointer' }}>
                                    <TableCell>{new Date(msg.createdAt).toLocaleDateString('tr-TR')}</TableCell>
                                    <TableCell>{msg.name}</TableCell>
                                    <TableCell>{msg.subject}</TableCell>
                                    <TableCell align="right"><IconButton size="small" onClick={e => { e.stopPropagation(); handleDelete(msg._id); }}><DeleteIcon fontSize="small" color="error" /></IconButton></TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={Boolean(selected)} onClose={() => setSelected(null)} fullWidth maxWidth="sm">
                <DialogTitle sx={{ bgcolor: C.accent, color: '#fff' }}>{selected?.subject}</DialogTitle>
                <DialogContent sx={{ mt: 2 }}>
                    <Stack spacing={2} sx={{ mt: 1 }}>
                        <Box><Typography variant="caption" color="text.secondary">Gönderen</Typography><Typography variant="h6">{selected?.name}</Typography></Box>
                        <Stack direction="row" spacing={2}>
                            <Box display="flex" alignItems="center" gap={1}><AlternateEmailIcon color="action" fontSize="small" /><Typography>{selected?.email}</Typography></Box>
                            {selected?.phone && <Box display="flex" alignItems="center" gap={1}><PhoneIcon color="action" fontSize="small" /><Typography>{selected?.phone}</Typography></Box>}
                        </Stack>
                        <Box display="flex" alignItems="center" gap={1}><AccessTimeIcon color="action" fontSize="small" /><Typography>{selected?.createdAt ? new Date(selected.createdAt).toLocaleString('tr-TR') : ''}</Typography></Box>
                        <Paper elevation={0} sx={{ p: 2, bgcolor: '#f5f5f5', borderRadius: 2 }}>
                            <Typography variant="caption" color="text.secondary" display="block" mb={1}>Mesaj</Typography>
                            <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>{selected?.message}</Typography>
                        </Paper>
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={() => setSelected(null)} color="inherit">Kapat</Button>
                    <Button variant="contained" startIcon={<ReplyIcon />} href={`mailto:${selected?.email}`}>Yanıtla</Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

// ─── SHARED TABS: EKİP NOTLARI ───────────────────────────────────────────────

// ─── PATRON: KULLANICI YÖNETİMİ ──────────────────────────────────────────────

const KullaniciYonetimiTab = ({ user: currentUser, setMsg }) => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editUser, setEditUser] = useState(null);
    const [form, setForm] = useState({ name: '', email: '', password: '', role: 'stajyer', department: '', phone: '' });
    const [panelDialog, setPanelDialog] = useState(null);

    const load = async () => {
        try { const r = await axios.get(`${SERVER_URL}/api/users`, { headers: authHeader() }); if (r.data.data || r.data.success) setUsers(r.data.data || []); }
        catch { } finally { setLoading(false); }
    };
    useEffect(() => { load(); }, []);

    const openNew = () => { setEditUser(null); setForm({ name: '', email: '', password: '', role: 'stajyer', department: '', phone: '' }); setDialogOpen(true); };
    const openEdit = (u) => { setEditUser(u); setForm({ name: u.name, email: u.email, password: '', role: u.role, department: u.department || '', phone: u.phone || '' }); setDialogOpen(true); };

    const handleSave = async () => {
        try {
            const payload = { name: form.name, email: form.email, role: form.role, department: form.department, phone: form.phone };
            if (form.password) payload.password = form.password;
            if (editUser) { await axios.put(`${SERVER_URL}/api/users/${editUser._id}`, payload, { headers: authHeader() }); setMsg({ type: 'success', text: 'Güncellendi!' }); }
            else { await axios.post(`${SERVER_URL}/api/users`, { ...payload, password: form.password }, { headers: authHeader() }); setMsg({ type: 'success', text: 'Kullanıcı oluşturuldu!' }); }
            setDialogOpen(false); load();
        } catch (err) { setMsg({ type: 'error', text: err.response?.data?.error || err.message }); }
    };

    const handleDelete = async (id) => { if (window.confirm('Silinsin mi?')) { await axios.delete(`${SERVER_URL}/api/users/${id}`, { headers: authHeader() }); load(); } };

    const handleToggleActive = async (u) => {
        try { await axios.put(`${SERVER_URL}/api/users/${u._id}`, { isActive: !u.isActive }, { headers: authHeader() }); load(); }
        catch { setMsg({ type: 'error', text: 'Güncellenemedi.' }); }
    };

    if (loading) return <Box textAlign="center" py={6}><CircularProgress /></Box>;

    return (
        <>
            <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={1} mb={3}>
                <Box>
                    <Typography variant="h6" fontWeight={700} color={C.text}>Kullanıcılar</Typography>
                    <Typography variant="body2" color={C.textSec}>{users.length} kayıtlı kullanıcı</Typography>
                </Box>
                <Button variant="contained" startIcon={<AddIcon />} onClick={openNew} sx={{ borderRadius: 1.5 }}>Yeni Kullanıcı</Button>
            </Box>

            <TableContainer component={Paper} sx={{ overflowX: 'auto', borderRadius: 2, boxShadow: '0 1px 6px rgba(0,0,0,0.06)' }}>
                <Table sx={{ minWidth: 650 }}>
                    <TableHead>
                        <TableRow sx={{ bgcolor: '#F8FAFC' }}>
                            <TableCell sx={{ fontWeight: 700, fontSize: '0.78rem', color: C.textSec, textTransform: 'uppercase', letterSpacing: 0.5 }}>Kullanıcı</TableCell>
                            <TableCell sx={{ fontWeight: 700, fontSize: '0.78rem', color: C.textSec, textTransform: 'uppercase', letterSpacing: 0.5 }}>E-Posta</TableCell>
                            <TableCell sx={{ fontWeight: 700, fontSize: '0.78rem', color: C.textSec, textTransform: 'uppercase', letterSpacing: 0.5 }}>Rol</TableCell>
                            <TableCell sx={{ fontWeight: 700, fontSize: '0.78rem', color: C.textSec, textTransform: 'uppercase', letterSpacing: 0.5 }}>Departman</TableCell>
                            <TableCell sx={{ fontWeight: 700, fontSize: '0.78rem', color: C.textSec, textTransform: 'uppercase', letterSpacing: 0.5 }}>Aktif</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 700, fontSize: '0.78rem', color: C.textSec, textTransform: 'uppercase', letterSpacing: 0.5 }}>İşlem</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map(u => (
                            <TableRow key={u._id} hover>
                                <TableCell>
                                    <Stack direction="row" spacing={1.5} alignItems="center">
                                        <Avatar
                                            src={u.profileImage ? `${SERVER_URL}${u.profileImage}` : undefined}
                                            sx={{ width: 32, height: 32, bgcolor: C.accent, fontSize: '0.8rem' }}
                                        >{!u.profileImage && u.name?.charAt(0)}</Avatar>
                                        <Typography variant="body2" fontWeight={600}>{u.name}</Typography>
                                    </Stack>
                                </TableCell>
                                <TableCell><Typography variant="body2">{u.email}</Typography></TableCell>
                                <TableCell>{roleBadge(u.role)}</TableCell>
                                <TableCell><Typography variant="body2" color="text.secondary">{u.department || '—'}</Typography></TableCell>
                                <TableCell><Switch checked={Boolean(u.isActive)} size="small" onChange={() => handleToggleActive(u)} /></TableCell>
                                <TableCell align="right">
                                    <Tooltip title="Panele Gir">
                                        <IconButton size="small" onClick={() => setPanelDialog(u)}><RemoveRedEyeIcon fontSize="small" sx={{ color: C.accent }} /></IconButton>
                                    </Tooltip>
                                    <IconButton size="small" onClick={() => openEdit(u)}><EditIcon fontSize="small" color="primary" /></IconButton>
                                    {u._id !== currentUser?._id && <IconButton size="small" onClick={() => handleDelete(u._id)}><DeleteIcon fontSize="small" color="error" /></IconButton>}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth maxWidth="sm">
                <DialogTitle>{editUser ? 'Kullanıcıyı Düzenle' : 'Yeni Kullanıcı'}</DialogTitle>
                <DialogContent>
                    <Stack spacing={2} mt={1}>
                        <TextField label="Ad Soyad" fullWidth value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required size="small" />
                        <TextField label="E-Posta" type="email" fullWidth value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required size="small" />
                        <TextField label={editUser ? 'Yeni Şifre (boş bırakılırsa değişmez)' : 'Şifre'} type="password" fullWidth value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required={!editUser} size="small" />
                        <FormControl fullWidth size="small">
                            <InputLabel>Rol</InputLabel>
                            <Select value={form.role} label="Rol" onChange={e => setForm({ ...form, role: e.target.value })}>
                                <MenuItem value="patron">Patron</MenuItem>
                                <MenuItem value="yonetici">Yönetici</MenuItem>
                                <MenuItem value="stajyer">Stajyer</MenuItem>
                                <MenuItem value="musteri">Müşteri</MenuItem>
                            </Select>
                        </FormControl>
                        <TextField label="Departman" fullWidth value={form.department} onChange={e => setForm({ ...form, department: e.target.value })} size="small" />
                        <TextField label="Telefon" fullWidth value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} size="small" />
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDialogOpen(false)} color="inherit">İptal</Button>
                    <Button variant="contained" onClick={handleSave}>Kaydet</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={Boolean(panelDialog)} onClose={() => setPanelDialog(null)} fullWidth maxWidth="sm">
                <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
                    <Typography variant="h6" fontWeight={700}>Kullanıcı Profili</Typography>
                    <IconButton onClick={() => setPanelDialog(null)} size="small"><CloseIcon /></IconButton>
                </DialogTitle>
                <DialogContent sx={{ pt: 0 }}>
                    {panelDialog && (() => {
                        const u = panelDialog;
                        const roleColors = { patron: '#7C3AED', yonetici: '#0EA5E9', stajyer: '#10B981', musteri: '#F59E0B' };
                        const roleLabels = { patron: 'Patron', yonetici: 'Yönetici', stajyer: 'Stajyer', musteri: 'Müşteri' };
                        return (
                            <Box>
                                {/* Avatar + temel bilgi */}
                                <Box display="flex" flexDirection="column" alignItems="center" py={3} gap={1.5}>
                                    <Avatar
                                        src={u.profileImage ? `${SERVER_URL}${u.profileImage}` : undefined}
                                        sx={{ width: 96, height: 96, bgcolor: C.accent, fontSize: '2rem', border: '3px solid #E2E8F0' }}
                                    >{!u.profileImage && u.name?.charAt(0)}</Avatar>
                                    <Box textAlign="center">
                                        <Typography variant="h6" fontWeight={700} color={C.text}>{u.name}</Typography>
                                        <Chip
                                            label={roleLabels[u.role] || u.role}
                                            size="small"
                                            sx={{ bgcolor: roleColors[u.role] + '20', color: roleColors[u.role], fontWeight: 700, mt: 0.5 }}
                                        />
                                    </Box>
                                    <Chip
                                        label={u.isActive ? 'Aktif' : 'Pasif'}
                                        size="small"
                                        sx={{ bgcolor: u.isActive ? '#D1FAE5' : '#FEE2E2', color: u.isActive ? '#065F46' : '#991B1B', fontWeight: 600 }}
                                    />
                                </Box>

                                <Divider sx={{ mb: 2 }} />

                                {/* Detay alanları */}
                                <Stack spacing={1.5} sx={{ px: 1 }}>
                                    {[
                                        { label: 'E-Posta', value: u.email, icon: <AlternateEmailIcon fontSize="small" color="action" /> },
                                        { label: 'Telefon', value: u.phone || '—', icon: <PhoneIcon fontSize="small" color="action" /> },
                                        { label: 'Departman', value: u.department || '—', icon: <BadgeIcon fontSize="small" color="action" /> },
                                        { label: 'Kayıt Tarihi', value: u.createdAt ? new Date(u.createdAt).toLocaleDateString('tr-TR') : '—', icon: <AccessTimeIcon fontSize="small" color="action" /> },
                                        { label: 'Son Giriş', value: u.lastLogin ? new Date(u.lastLogin).toLocaleString('tr-TR') : 'Henüz giriş yapılmadı', icon: <AccessTimeIcon fontSize="small" color="action" /> },
                                    ].map(row => (
                                        <Box key={row.label} display="flex" alignItems="center" gap={1.5} sx={{ p: 1.5, borderRadius: 2, bgcolor: '#F8FAFC' }}>
                                            {row.icon}
                                            <Box>
                                                <Typography variant="caption" color="text.secondary" display="block" lineHeight={1.2}>{row.label}</Typography>
                                                <Typography variant="body2" fontWeight={500}>{row.value}</Typography>
                                            </Box>
                                        </Box>
                                    ))}
                                </Stack>
                            </Box>
                        );
                    })()}
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={() => setPanelDialog(null)} variant="outlined" color="inherit" size="small">Kapat</Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

// ─── YÖNETİCİ MUHASEBE ───────────────────────────────────────────────────────

const MuhasebeSekme = ({ setMsg }) => {
    return (
        <Box>
            <Accounting />
        </Box>
    );
};


// ─── PATRON PANELİ ───────────────────────────────────────────────────────────

const PatronPanel = ({ user: initialUser, logout, navigate }) => {
    const [activeTab, setActiveTab] = useState('kullanici');
    const [msg, setMsg] = useState(null);
    const [user, setUser] = useState(initialUser);

    const navItems = [
        { key: 'kullanici',   label: 'Kullanıcı Yönetimi', icon: <PeopleIcon fontSize="small" /> },
        { key: 'musterikart', label: 'Müşteri Kartları',   icon: <BadgeIcon fontSize="small" /> },
        { key: 'paketler',    label: 'Paketler',           icon: <CalculateIcon fontSize="small" /> },
        { key: 'portfolyo',   label: 'Portföy',            icon: <PhotoLibraryIcon fontSize="small" /> },
        { key: 'hizmetler',   label: 'Hizmetler',          icon: <DesignServicesIcon fontSize="small" /> },
        { key: 'blog',        label: 'Blog',               icon: <BookIcon fontSize="small" /> },
        { key: 'kutu',        label: 'Gelen Kutusu',       icon: <MailIcon fontSize="small" /> },
        { key: 'muhasebe',    label: 'Muhasebe',           icon: <CalculateIcon fontSize="small" /> },
        { key: 'profil',      label: 'Profilim',           icon: <AccountCircleIcon fontSize="small" /> },
    ];

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: C.content }}>
            <Sidebar user={user} logout={logout} navigate={navigate} navItems={navItems} activeTab={activeTab} setActiveTab={setActiveTab} />
            <ContentArea>
                <PageHeader title={navItems.find(n => n.key === activeTab)?.label} />
                <Box sx={{ p: 4, flex: 1 }}>
                    {msg && <Alert severity={msg.type} sx={{ mb: 3 }} onClose={() => setMsg(null)}>{msg.text}</Alert>}
                    {activeTab === 'kullanici'   && <KullaniciYonetimiTab user={user} setMsg={setMsg} />}
                    {activeTab === 'musterikart' && <MusteriKartiTab setMsg={setMsg} />}
                    {activeTab === 'paketler'    && <PaketlerTab setMsg={setMsg} />}
                    {activeTab === 'portfolyo'   && <PortfolyoTab setMsg={setMsg} />}
                    {activeTab === 'hizmetler'   && <HizmetlerTab setMsg={setMsg} />}
                    {activeTab === 'blog'        && <BlogTab setMsg={setMsg} />}
                    {activeTab === 'kutu'        && <GelenKutusuTab setMsg={setMsg} />}
                    {activeTab === 'muhasebe'    && <MuhasebeSekme setMsg={setMsg} />}
                    {activeTab === 'profil'      && <ProfilTab user={user} onUserUpdate={setUser} />}
                </Box>
            </ContentArea>
        </Box>
    );
};

// ─── YÖNETİCİ PANELİ ─────────────────────────────────────────────────────────

const YoneticiPanel = ({ user: initialUser, logout, navigate }) => {
    const [activeTab, setActiveTab] = useState('portfolyo');
    const [msg, setMsg] = useState(null);
    const [user, setUser] = useState(initialUser);

    const navItems = [
        { key: 'musterikart', label: 'Müşteri Kartları', icon: <BadgeIcon fontSize="small" /> },
        { key: 'paketler',    label: 'Paketler',         icon: <CalculateIcon fontSize="small" /> },
        { key: 'portfolyo',   label: 'Portföy',          icon: <PhotoLibraryIcon fontSize="small" /> },
        { key: 'hizmetler',   label: 'Hizmetler',        icon: <DesignServicesIcon fontSize="small" /> },
        { key: 'blog',        label: 'Blog',             icon: <BookIcon fontSize="small" /> },
        { key: 'kutu',        label: 'Gelen Kutusu',     icon: <MailIcon fontSize="small" /> },
        { key: 'muhasebe',    label: 'Muhasebe',         icon: <CalculateIcon fontSize="small" /> },
        { key: 'profil',      label: 'Profilim',         icon: <AccountCircleIcon fontSize="small" /> },
    ];

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: C.content }}>
            <Sidebar user={user} logout={logout} navigate={navigate} navItems={navItems} activeTab={activeTab} setActiveTab={setActiveTab} />
            <ContentArea>
                <PageHeader title={navItems.find(n => n.key === activeTab)?.label} />
                <Box sx={{ p: 4, flex: 1 }}>
                    {msg && <Alert severity={msg.type} sx={{ mb: 3 }} onClose={() => setMsg(null)}>{msg.text}</Alert>}
                    {activeTab === 'musterikart' && <MusteriKartiTab setMsg={setMsg} />}
                    {activeTab === 'paketler'    && <PaketlerTab setMsg={setMsg} />}
                    {activeTab === 'portfolyo'   && <PortfolyoTab setMsg={setMsg} />}
                    {activeTab === 'hizmetler'   && <HizmetlerTab setMsg={setMsg} />}
                    {activeTab === 'blog'        && <BlogTab setMsg={setMsg} />}
                    {activeTab === 'kutu'        && <GelenKutusuTab setMsg={setMsg} />}
                    {activeTab === 'muhasebe'    && <MuhasebeSekme setMsg={setMsg} />}
                    {activeTab === 'profil'      && <ProfilTab user={user} onUserUpdate={setUser} />}
                </Box>
            </ContentArea>
        </Box>
    );
};

// ─── STAJYERİ PANELİ ─────────────────────────────────────────────────────────

const StajyerPanel = ({ user: initialUser, logout, navigate }) => {
    const [activeTab, setActiveTab] = useState('musterikart');
    const [msg, setMsg] = useState(null);
    const [user, setUser] = useState(initialUser);

    const navItems = [
        { key: 'musterikart', label: 'Müşteri Kartları', icon: <BadgeIcon fontSize="small" /> },
        { key: 'profil',      label: 'Profilim',         icon: <AccountCircleIcon fontSize="small" /> },
    ];

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: C.content }}>
            <Sidebar user={user} logout={logout} navigate={navigate} navItems={navItems} activeTab={activeTab} setActiveTab={setActiveTab} />
            <ContentArea>
                <PageHeader
                    title={navItems.find(n => n.key === activeTab)?.label}
                    subtitle={`Merhaba, ${user?.name}`}
                />
                <Box sx={{ p: 4, flex: 1 }}>
                    {msg && <Alert severity={msg.type} sx={{ mb: 3 }} onClose={() => setMsg(null)}>{msg.text}</Alert>}
                    {activeTab === 'musterikart' && <MusteriKartiTab setMsg={setMsg} />}
                    {activeTab === 'profil'      && <ProfilTab user={user} onUserUpdate={setUser} />}
                </Box>
            </ContentArea>
        </Box>
    );
};

// ─── MÜŞTERİ PANELİ ──────────────────────────────────────────────────────────

const MusteriPanel = ({ user, logout, navigate }) => {
    const [msg, setMsg] = useState(null);

    return (
        <Box sx={{ bgcolor: C.content, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            {/* Top bar */}
            <Box sx={{
                bgcolor: C.sidebar,
                px: 4, py: 0,
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                height: 60, flexShrink: 0,
                boxShadow: '0 2px 12px rgba(0,0,0,0.18)',
                position: 'sticky', top: 0, zIndex: 100
            }}>
                <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar sx={{ bgcolor: C.accent, fontWeight: 700, width: 34, height: 34, fontSize: '0.85rem' }}>
                        {user?.name?.charAt(0)}
                    </Avatar>
                    <Box>
                        <Typography variant="body2" fontWeight={700} sx={{ color: '#fff', lineHeight: 1.1 }}>{user?.name}</Typography>
                        <Typography sx={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.68rem', letterSpacing: '0.1em' }}>MÜŞTERİ PANELİ</Typography>
                    </Box>
                </Stack>
                <Stack direction="row" spacing={1} alignItems="center">
                    <Typography sx={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem', mr: 1 }}>Kıyı Medya</Typography>
                    <Button size="small" startIcon={<LogoutIcon fontSize="small" />} onClick={() => { logout(); navigate('/admin/login'); }}
                        sx={{ color: 'rgba(255,255,255,0.5)', textTransform: 'none', fontWeight: 600, fontSize: '0.78rem', '&:hover': { color: '#EF4444', bgcolor: 'rgba(239,68,68,0.08)' } }}>
                        Çıkış
                    </Button>
                </Stack>
            </Box>

            {/* Content */}
            <Box sx={{ flex: 1, p: 4, maxWidth: 1200, mx: 'auto', width: '100%' }}>
                {msg && <Alert severity={msg.type} sx={{ mb: 3 }} onClose={() => setMsg(null)}>{msg.text}</Alert>}
                <MusteriKartiTab setMsg={setMsg} readOnly={true} singleCard={true} />
            </Box>
        </Box>
    );
};

// ─── ANA COMPONENT ────────────────────────────────────────────────────────────

const AdminDashboard = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    useEffect(() => {
        if (!user) { navigate('/admin/login'); return; }
        axios.defaults.headers.common['Authorization'] = `Bearer ${user.token || localStorage.getItem('token')}`;
    }, [user, navigate]);

    if (!user) return <ThemeProvider theme={adminTheme}><Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" sx={{ bgcolor: '#F8FAFC' }}><CircularProgress /></Box></ThemeProvider>;

    const role = user.role;

    return (
        <ThemeProvider theme={adminTheme}>
            {role === 'patron'   && <PatronPanel   user={user} logout={logout} navigate={navigate} />}
            {role === 'yonetici' && <YoneticiPanel user={user} logout={logout} navigate={navigate} />}
            {role === 'stajyer'  && <StajyerPanel  user={user} logout={logout} navigate={navigate} />}
            {role === 'musteri'  && <MusteriPanel  user={user} logout={logout} navigate={navigate} />}
            {!['patron','yonetici','stajyer','musteri'].includes(role) && (
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" flexDirection="column" gap={2} sx={{ bgcolor: '#F8FAFC' }}>
                    <Typography variant="h6" color="text.secondary">Bilinmeyen rol: <strong>{role}</strong></Typography>
                    <Button variant="outlined" onClick={() => { logout(); navigate('/admin/login'); }}>Çıkış Yap</Button>
                </Box>
            )}
        </ThemeProvider>
    );
};

export default AdminDashboard;
