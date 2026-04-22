import React, { useState, useEffect } from 'react';
import { SERVER_URL } from '../config';
import axios from 'axios';
import {
    Box, Typography, Grid, Card, CardContent, Button, IconButton, Stack,
    Dialog, DialogTitle, DialogContent, DialogActions, TextField, Paper,
    Chip, Divider
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import GridViewIcon from '@mui/icons-material/GridView';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import MovieIcon from '@mui/icons-material/Movie';
import MiscellaneousServicesIcon from '@mui/icons-material/MiscellaneousServices';

const API = `${SERVER_URL}/api/packages`;

const authHeader = () => {
    try { const u = JSON.parse(localStorage.getItem('user') || '{}'); return { Authorization: `Bearer ${u.token || ''}` }; }
    catch { return { Authorization: '' }; }
};

const empty = { name: '', description: '', posts: 0, stories: 0, reels: 0, price: 0, extraServices: [] };

const fmtMoney = n => n ? `₺${Number(n).toLocaleString('tr-TR')}` : '₺0';

const PaketlerTab = ({ setMsg }) => {
    const [packages, setPackages] = useState([]);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [form, setForm] = useState(empty);
    const [editId, setEditId] = useState(null);
    const [newService, setNewService] = useState('');

    const load = async () => {
        try { const r = await axios.get(API); if (r.data.success) setPackages(r.data.data); } catch { }
    };
    useEffect(() => { load(); }, []);

    const openNew = () => { setForm(empty); setEditId(null); setNewService(''); setDialogOpen(true); };
    const openEdit = (pkg) => {
        setForm({ ...empty, ...pkg, extraServices: pkg.extraServices || [] });
        setEditId(pkg._id);
        setNewService('');
        setDialogOpen(true);
    };

    const handleSave = async () => {
        if (!form.name.trim()) return;
        try {
            const payload = { ...form };
            if (editId) await axios.put(`${API}/${editId}`, payload, { headers: authHeader() });
            else await axios.post(API, payload, { headers: authHeader() });
            setMsg({ type: 'success', text: editId ? 'Paket güncellendi.' : 'Paket oluşturuldu.' });
            setDialogOpen(false); load();
        } catch (e) { setMsg({ type: 'error', text: e.response?.data?.error || e.message }); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Bu paket silinsin mi?')) return;
        try { await axios.delete(`${API}/${id}`, { headers: authHeader() }); setMsg({ type: 'success', text: 'Silindi.' }); load(); }
        catch { setMsg({ type: 'error', text: 'Silinemedi.' }); }
    };

    const set = (f, v) => setForm(p => ({ ...p, [f]: v }));

    const addService = () => {
        const trimmed = newService.trim();
        if (!trimmed) return;
        const already = (form.extraServices || []).some(s => s.label.toLowerCase() === trimmed.toLowerCase());
        if (already) return;
        setForm(p => ({ ...p, extraServices: [...(p.extraServices || []), { label: trimmed }] }));
        setNewService('');
    };

    const removeService = (idx) => {
        setForm(p => ({ ...p, extraServices: p.extraServices.filter((_, i) => i !== idx) }));
    };

    return (
        <Box>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h6" fontWeight={700}>Paketler ({packages.length})</Typography>
                <Button variant="contained" startIcon={<AddIcon />} onClick={openNew}
                    sx={{ bgcolor: '#0F172A', '&:hover': { bgcolor: '#1E293B' }, borderRadius: 2 }}>
                    Yeni Paket
                </Button>
            </Stack>

            {packages.length === 0 ? (
                <Box textAlign="center" py={10}>
                    <LocalOfferIcon sx={{ fontSize: 64, color: '#CBD5E1', mb: 2 }} />
                    <Typography color="text.secondary" fontWeight={600}>Henüz paket oluşturulmadı.</Typography>
                    <Button variant="outlined" startIcon={<AddIcon />} sx={{ mt: 2 }} onClick={openNew}>İlk Paketi Oluştur</Button>
                </Box>
            ) : (
                <Grid container spacing={2.5}>
                    {packages.map(pkg => (
                        <Grid item xs={12} sm={6} lg={4} key={pkg._id}>
                            <Card sx={{ borderRadius: 3, border: '1px solid #E2E8F0', height: '100%',
                                transition: '0.2s', '&:hover': { borderColor: '#3B82F6', boxShadow: '0 4px 20px rgba(59,130,246,0.1)' } }}>
                                <CardContent sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2, height: '100%' }}>
                                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                                        <Box>
                                            <Typography fontWeight={800} fontSize="1rem" color="#0F172A">{pkg.name}</Typography>
                                            {pkg.description && <Typography variant="caption" color="text.secondary">{pkg.description}</Typography>}
                                        </Box>
                                        <Stack direction="row" spacing={0.5}>
                                            <IconButton size="small" onClick={() => openEdit(pkg)} sx={{ color: '#3B82F6' }}><EditIcon fontSize="small" /></IconButton>
                                            <IconButton size="small" onClick={() => handleDelete(pkg._id)} sx={{ color: '#EF4444' }}><DeleteIcon fontSize="small" /></IconButton>
                                        </Stack>
                                    </Stack>

                                    {pkg.price > 0 && (
                                        <Chip label={fmtMoney(pkg.price) + ' / ay'} size="small"
                                            sx={{ bgcolor: '#EFF6FF', color: '#3B82F6', fontWeight: 700, alignSelf: 'flex-start' }} />
                                    )}

                                    <Divider />

                                    <Stack spacing={1}>
                                        {pkg.posts > 0 && (
                                            <Stack direction="row" alignItems="center" spacing={1}>
                                                <GridViewIcon sx={{ fontSize: 18, color: '#3B82F6' }} />
                                                <Typography variant="body2" fontWeight={600}>{pkg.posts} Post</Typography>
                                            </Stack>
                                        )}
                                        {pkg.stories > 0 && (
                                            <Stack direction="row" alignItems="center" spacing={1}>
                                                <AutoStoriesIcon sx={{ fontSize: 18, color: '#8B5CF6' }} />
                                                <Typography variant="body2" fontWeight={600}>{pkg.stories} Story</Typography>
                                            </Stack>
                                        )}
                                        {pkg.reels > 0 && (
                                            <Stack direction="row" alignItems="center" spacing={1}>
                                                <MovieIcon sx={{ fontSize: 18, color: '#EC4899' }} />
                                                <Typography variant="body2" fontWeight={600}>{pkg.reels} Reels</Typography>
                                            </Stack>
                                        )}
                                        {(pkg.extraServices || []).length > 0 && (
                                            <>
                                                <Divider sx={{ my: 0.5 }} />
                                                <Stack direction="row" flexWrap="wrap" gap={0.5}>
                                                    {pkg.extraServices.map((s, i) => (
                                                        <Chip key={i} label={s.label} size="small" icon={<MiscellaneousServicesIcon sx={{ fontSize: '14px !important' }} />}
                                                            sx={{ bgcolor: '#F0FDF4', color: '#10B981', fontWeight: 600, fontSize: '0.72rem' }} />
                                                    ))}
                                                </Stack>
                                            </>
                                        )}
                                    </Stack>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}

            {/* Paket Dialog */}
            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
                <DialogTitle sx={{ fontWeight: 800 }}>{editId ? 'Paketi Düzenle' : 'Yeni Paket'}</DialogTitle>
                <DialogContent>
                    <Stack spacing={2} mt={1}>
                        <TextField fullWidth size="small" label="Paket Adı *" value={form.name} onChange={e => set('name', e.target.value)} autoFocus />
                        <TextField fullWidth size="small" label="Açıklama" value={form.description} onChange={e => set('description', e.target.value)} />
                        <TextField fullWidth size="small" label="Aylık Fiyat (₺)" type="number" value={form.price} onChange={e => set('price', Number(e.target.value))} />
                        <Divider><Typography variant="caption" color="text.secondary">Sosyal Medya Kotaları</Typography></Divider>
                        <Grid container spacing={1.5}>
                            <Grid item xs={4}>
                                <TextField fullWidth size="small" label="Post" type="number" value={form.posts} onChange={e => set('posts', Number(e.target.value))} inputProps={{ min: 0 }} />
                            </Grid>
                            <Grid item xs={4}>
                                <TextField fullWidth size="small" label="Story" type="number" value={form.stories} onChange={e => set('stories', Number(e.target.value))} inputProps={{ min: 0 }} />
                            </Grid>
                            <Grid item xs={4}>
                                <TextField fullWidth size="small" label="Reels" type="number" value={form.reels} onChange={e => set('reels', Number(e.target.value))} inputProps={{ min: 0 }} />
                            </Grid>
                        </Grid>
                        <Divider><Typography variant="caption" color="text.secondary">Ek Hizmetler</Typography></Divider>

                        {/* Servis ekleme */}
                        <Stack direction="row" spacing={1}>
                            <TextField
                                fullWidth size="small" label="Hizmet adı yaz..." value={newService}
                                onChange={e => setNewService(e.target.value)}
                                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addService(); } }}
                            />
                            <Button variant="outlined" onClick={addService} disabled={!newService.trim()}
                                sx={{ flexShrink: 0, minWidth: 64, borderRadius: 2, fontWeight: 700 }}>
                                Ekle
                            </Button>
                        </Stack>

                        {/* Eklenen servisler */}
                        {(form.extraServices || []).length > 0 && (
                            <Paper variant="outlined" sx={{ p: 1.5, borderRadius: 2 }}>
                                <Stack direction="row" flexWrap="wrap" gap={0.8}>
                                    {form.extraServices.map((s, i) => (
                                        <Chip key={i} label={s.label} size="small"
                                            onDelete={() => removeService(i)}
                                            deleteIcon={<CloseIcon sx={{ fontSize: '14px !important' }} />}
                                            sx={{ bgcolor: '#F0FDF4', color: '#10B981', fontWeight: 600, '& .MuiChip-deleteIcon': { color: '#10B981' } }}
                                        />
                                    ))}
                                </Stack>
                            </Paper>
                        )}
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ px: 3, py: 2 }}>
                    <Button onClick={() => setDialogOpen(false)} color="inherit">İptal</Button>
                    <Button variant="contained" onClick={handleSave} disabled={!form.name.trim()} sx={{ bgcolor: '#0F172A', '&:hover': { bgcolor: '#1E293B' } }}>
                        {editId ? 'Güncelle' : 'Oluştur'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default PaketlerTab;
