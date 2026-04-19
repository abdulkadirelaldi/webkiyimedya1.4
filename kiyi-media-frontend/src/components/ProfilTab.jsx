// src/components/ProfilTab.jsx
import React, { useState, useRef } from 'react';
import { SERVER_URL } from '../config';
import axios from 'axios';
import {
    Box, Paper, Typography, Stack, Avatar, Button, TextField,
    Divider, Alert, IconButton, Tooltip, CircularProgress, Grid
} from '@mui/material';

import CameraAltIcon from '@mui/icons-material/CameraAlt';
import SaveIcon from '@mui/icons-material/Save';
import LockIcon from '@mui/icons-material/Lock';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import WorkIcon from '@mui/icons-material/Work';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

const authHeader = () => {
    try {
        const u = JSON.parse(localStorage.getItem('user') || '{}');
        return { Authorization: `Bearer ${u.token || ''}` };
    } catch { return { Authorization: '' }; }
};

const ROLE_LABELS = {
    patron: 'Patron',
    yonetici: 'Yönetici',
    stajyer: 'Stajyer',
    musteri: 'Müşteri',
};

const ROLE_COLORS = {
    patron:   { bg: '#7C3AED20', color: '#7C3AED' },
    yonetici: { bg: '#3B82F620', color: '#3B82F6' },
    stajyer:  { bg: '#F59E0B20', color: '#F59E0B' },
};

const ProfilTab = ({ user, onUserUpdate }) => {
    const fileRef = useRef();

    const [info, setInfo] = useState({
        name:       user?.name       || '',
        email:      user?.email      || '',
        phone:      user?.phone      || '',
        department: user?.department || '',
    });
    const [infoMsg, setInfoMsg]   = useState(null);
    const [infoSaving, setInfoSaving] = useState(false);

    const [pw, setPw] = useState({ current: '', next: '', confirm: '' });
    const [showPw, setShowPw] = useState({ current: false, next: false, confirm: false });
    const [pwMsg, setPwMsg]   = useState(null);
    const [pwSaving, setPwSaving] = useState(false);

    const [avatarLoading, setAvatarLoading] = useState(false);
    const [avatarMsg, setAvatarMsg] = useState(null);
    const [localAvatar, setLocalAvatar] = useState(user?.profileImage || '');

    const roleStyle = ROLE_COLORS[user?.role] || { bg: '#64748B20', color: '#64748B' };
    const initials  = (user?.name || '?').split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
    const avatarSrc = localAvatar ? `${SERVER_URL}${localAvatar}` : '';

    // ── Profil resmi yükle ──────────────────────────────────────────
    const handleAvatarChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (file.size > 5 * 1024 * 1024) { setAvatarMsg({ type: 'error', text: 'Dosya 5MB\'dan büyük olamaz.' }); return; }

        setAvatarLoading(true);
        setAvatarMsg(null);
        const fd = new FormData();
        fd.append('avatar', file);
        try {
            const res = await axios.post(
                `${SERVER_URL}/api/users/${user._id}/profile-image`,
                fd,
                { headers: { 'Content-Type': 'multipart/form-data', ...authHeader() } }
            );
            const updated = res.data.data;
            setLocalAvatar(updated.profileImage);
            onUserUpdate?.(updated);
            setAvatarMsg({ type: 'success', text: 'Profil fotoğrafı güncellendi.' });
        } catch (err) {
            setAvatarMsg({ type: 'error', text: err.response?.data?.error || 'Yükleme başarısız.' });
        } finally {
            setAvatarLoading(false);
            e.target.value = '';
        }
    };

    // ── Bilgi kaydet ───────────────────────────────────────────────
    const saveInfo = async () => {
        if (!info.name.trim()) { setInfoMsg({ type: 'error', text: 'Ad Soyad zorunludur.' }); return; }
        if (!info.email.trim()) { setInfoMsg({ type: 'error', text: 'E-posta zorunludur.' }); return; }
        setInfoSaving(true);
        setInfoMsg(null);
        try {
            const res = await axios.put(
                `${SERVER_URL}/api/users/${user._id}`,
                { name: info.name, email: info.email, phone: info.phone, department: info.department },
                { headers: authHeader() }
            );
            onUserUpdate?.(res.data.data);
            setInfoMsg({ type: 'success', text: 'Bilgiler güncellendi.' });
        } catch (err) {
            setInfoMsg({ type: 'error', text: err.response?.data?.error || err.response?.data?.message || 'Güncelleme başarısız.' });
        } finally {
            setInfoSaving(false);
        }
    };

    // ── Şifre değiştir ─────────────────────────────────────────────
    const savePw = async () => {
        if (!pw.current) { setPwMsg({ type: 'error', text: 'Mevcut şifreyi girin.' }); return; }
        if (pw.next.length < 6) { setPwMsg({ type: 'error', text: 'Yeni şifre en az 6 karakter olmalıdır.' }); return; }
        if (pw.next !== pw.confirm) { setPwMsg({ type: 'error', text: 'Yeni şifreler eşleşmiyor.' }); return; }
        setPwSaving(true);
        setPwMsg(null);
        try {
            await axios.put(
                `${SERVER_URL}/api/users/${user._id}`,
                { password: pw.next },
                { headers: authHeader() }
            );
            setPw({ current: '', next: '', confirm: '' });
            setPwMsg({ type: 'success', text: 'Şifre başarıyla değiştirildi.' });
        } catch (err) {
            setPwMsg({ type: 'error', text: err.response?.data?.error || err.response?.data?.message || 'Şifre değiştirilemedi.' });
        } finally {
            setPwSaving(false);
        }
    };

    const PwField = ({ field, label }) => (
        <TextField
            fullWidth size="small" label={label} type={showPw[field] ? 'text' : 'password'}
            value={pw[field]} onChange={e => setPw(p => ({ ...p, [field]: e.target.value }))}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
            InputProps={{
                endAdornment: (
                    <IconButton size="small" onClick={() => setShowPw(s => ({ ...s, [field]: !s[field] }))}>
                        {showPw[field] ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                    </IconButton>
                )
            }}
        />
    );

    return (
        <Grid container spacing={3} alignItems="flex-start">

            {/* ── Sol: Avatar + özet ── */}
            <Grid item xs={12} md={4}>
                <Paper sx={{ p: 3, borderRadius: '16px', border: '1.5px solid #E8EDF5', boxShadow: '0 2px 12px rgba(15,23,42,0.05)', textAlign: 'center' }}>

                    {/* Avatar */}
                    <Box sx={{ position: 'relative', display: 'inline-block', mb: 2 }}>
                        <Avatar
                            src={avatarSrc}
                            sx={{ width: 96, height: 96, bgcolor: '#0F172A', fontSize: '2rem', fontWeight: 800,
                                  border: '3px solid #E2E8F0', boxShadow: '0 4px 16px rgba(15,23,42,0.12)' }}
                        >
                            {!avatarSrc && initials}
                        </Avatar>
                        <Tooltip title="Fotoğraf değiştir">
                            <IconButton
                                size="small"
                                onClick={() => fileRef.current?.click()}
                                disabled={avatarLoading}
                                sx={{
                                    position: 'absolute', bottom: 0, right: 0,
                                    bgcolor: '#3B82F6', color: '#fff', width: 30, height: 30,
                                    border: '2px solid #fff',
                                    '&:hover': { bgcolor: '#2563EB' },
                                    '&:disabled': { bgcolor: '#94A3B8' }
                                }}
                            >
                                {avatarLoading ? <CircularProgress size={14} color="inherit" /> : <CameraAltIcon sx={{ fontSize: 15 }} />}
                            </IconButton>
                        </Tooltip>
                        <input ref={fileRef} type="file" accept="image/*" hidden onChange={handleAvatarChange} />
                    </Box>

                    {avatarMsg && (
                        <Alert severity={avatarMsg.type} sx={{ mb: 1.5, borderRadius: '10px', py: 0.5 }} onClose={() => setAvatarMsg(null)}>
                            {avatarMsg.text}
                        </Alert>
                    )}

                    <Typography variant="h6" fontWeight={800} color="#0F172A" letterSpacing="-0.01em">{user?.name}</Typography>
                    <Typography variant="body2" color="#64748B" mt={0.3}>{user?.email}</Typography>

                    <Box sx={{ display: 'inline-block', mt: 1.5, px: 1.5, py: 0.4, borderRadius: '8px', bgcolor: roleStyle.bg }}>
                        <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: roleStyle.color }}>
                            {ROLE_LABELS[user?.role] || user?.role}
                        </Typography>
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    <Stack spacing={1} textAlign="left">
                        {user?.department && (
                            <Stack direction="row" spacing={1} alignItems="center">
                                <WorkIcon sx={{ fontSize: 15, color: '#94A3B8' }} />
                                <Typography variant="body2" color="#64748B">{user.department}</Typography>
                            </Stack>
                        )}
                        {user?.phone && (
                            <Stack direction="row" spacing={1} alignItems="center">
                                <PhoneIcon sx={{ fontSize: 15, color: '#94A3B8' }} />
                                <Typography variant="body2" color="#64748B">{user.phone}</Typography>
                            </Stack>
                        )}
                        <Stack direction="row" spacing={1} alignItems="center">
                            <EmailIcon sx={{ fontSize: 15, color: '#94A3B8' }} />
                            <Typography variant="body2" color="#64748B" sx={{ wordBreak: 'break-all' }}>{user?.email}</Typography>
                        </Stack>
                    </Stack>

                    <Box mt={2}>
                        <Typography variant="caption" color="#94A3B8">
                            Fotoğraf değiştirmek için kamera ikonuna tıklayın (maks. 5MB)
                        </Typography>
                    </Box>
                </Paper>
            </Grid>

            {/* ── Sağ: Formlar ── */}
            <Grid item xs={12} md={8}>
                <Stack spacing={3}>

                    {/* Kişisel Bilgiler */}
                    <Paper sx={{ p: 3, borderRadius: '16px', border: '1.5px solid #E8EDF5', boxShadow: '0 2px 12px rgba(15,23,42,0.05)' }}>
                        <Stack direction="row" alignItems="center" spacing={1.5} mb={2.5}>
                            <Box sx={{ width: 36, height: 36, borderRadius: '10px', bgcolor: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <PersonIcon sx={{ fontSize: 18, color: '#3B82F6' }} />
                            </Box>
                            <Box>
                                <Typography fontWeight={800} color="#0F172A" fontSize="0.95rem">Kişisel Bilgiler</Typography>
                                <Typography variant="caption" color="#94A3B8">Ad, e-posta, telefon ve departman bilgilerinizi düzenleyin</Typography>
                            </Box>
                        </Stack>

                        {infoMsg && (
                            <Alert severity={infoMsg.type} sx={{ mb: 2, borderRadius: '10px' }} onClose={() => setInfoMsg(null)}>
                                {infoMsg.text}
                            </Alert>
                        )}

                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField fullWidth size="small" label="Ad Soyad"
                                    value={info.name} onChange={e => setInfo(s => ({ ...s, name: e.target.value }))}
                                    InputProps={{ startAdornment: <PersonIcon sx={{ fontSize: 16, color: '#94A3B8', mr: 0.5 }} /> }}
                                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }} />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField fullWidth size="small" label="E-posta" type="email"
                                    value={info.email} onChange={e => setInfo(s => ({ ...s, email: e.target.value }))}
                                    InputProps={{ startAdornment: <EmailIcon sx={{ fontSize: 16, color: '#94A3B8', mr: 0.5 }} /> }}
                                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }} />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField fullWidth size="small" label="Telefon"
                                    value={info.phone} onChange={e => setInfo(s => ({ ...s, phone: e.target.value }))}
                                    InputProps={{ startAdornment: <PhoneIcon sx={{ fontSize: 16, color: '#94A3B8', mr: 0.5 }} /> }}
                                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }} />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField fullWidth size="small" label="Departman"
                                    value={info.department} onChange={e => setInfo(s => ({ ...s, department: e.target.value }))}
                                    InputProps={{ startAdornment: <WorkIcon sx={{ fontSize: 16, color: '#94A3B8', mr: 0.5 }} /> }}
                                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }} />
                            </Grid>
                        </Grid>

                        <Box mt={2.5} display="flex" justifyContent="flex-end">
                            <Button variant="contained" startIcon={infoSaving ? <CircularProgress size={14} color="inherit" /> : <SaveIcon sx={{ fontSize: 16 }} />}
                                onClick={saveInfo} disabled={infoSaving}
                                sx={{ bgcolor: '#0F172A', '&:hover': { bgcolor: '#1E293B' }, borderRadius: '10px', fontWeight: 700, px: 3,
                                      boxShadow: '0 4px 14px rgba(15,23,42,0.2)' }}>
                                {infoSaving ? 'Kaydediliyor...' : 'Kaydet'}
                            </Button>
                        </Box>
                    </Paper>

                    {/* Şifre Değiştir */}
                    <Paper sx={{ p: 3, borderRadius: '16px', border: '1.5px solid #E8EDF5', boxShadow: '0 2px 12px rgba(15,23,42,0.05)' }}>
                        <Stack direction="row" alignItems="center" spacing={1.5} mb={2.5}>
                            <Box sx={{ width: 36, height: 36, borderRadius: '10px', bgcolor: '#FEF2F2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <LockIcon sx={{ fontSize: 18, color: '#EF4444' }} />
                            </Box>
                            <Box>
                                <Typography fontWeight={800} color="#0F172A" fontSize="0.95rem">Şifre Değiştir</Typography>
                                <Typography variant="caption" color="#94A3B8">Güvenliğiniz için şifrenizi düzenli olarak güncelleyin</Typography>
                            </Box>
                        </Stack>

                        {pwMsg && (
                            <Alert severity={pwMsg.type} sx={{ mb: 2, borderRadius: '10px' }} onClose={() => setPwMsg(null)}>
                                {pwMsg.text}
                            </Alert>
                        )}

                        <Stack spacing={2}>
                            <PwField field="current" label="Mevcut Şifre" />
                            <PwField field="next"    label="Yeni Şifre" />
                            <PwField field="confirm" label="Yeni Şifre (Tekrar)" />
                        </Stack>

                        <Box mt={2.5} display="flex" justifyContent="flex-end">
                            <Button variant="contained" startIcon={pwSaving ? <CircularProgress size={14} color="inherit" /> : <LockIcon sx={{ fontSize: 16 }} />}
                                onClick={savePw} disabled={pwSaving}
                                sx={{ bgcolor: '#EF4444', '&:hover': { bgcolor: '#DC2626' }, borderRadius: '10px', fontWeight: 700, px: 3,
                                      boxShadow: '0 4px 14px rgba(239,68,68,0.2)' }}>
                                {pwSaving ? 'Değiştiriliyor...' : 'Şifreyi Değiştir'}
                            </Button>
                        </Box>
                    </Paper>

                </Stack>
            </Grid>

        </Grid>
    );
};

export default ProfilTab;
