// src/components/Accounting.jsx
import React, { useState, useEffect } from 'react';
import { SERVER_URL } from '../config';
import {
    Box, Grid, Paper, Typography, Button, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Chip, IconButton, Dialog,
    DialogTitle, DialogContent, DialogActions, TextField, MenuItem,
    Select, FormControl, InputLabel, Divider, Stack, InputAdornment, Tooltip,
    Fade, Grow, useTheme, alpha
} from '@mui/material';

import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import MoneyOffIcon from '@mui/icons-material/MoneyOff';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import FilterListIcon from '@mui/icons-material/FilterList';
import ReceiptIcon from '@mui/icons-material/Receipt';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import BarChartIcon from '@mui/icons-material/BarChart';

import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { PERMISSIONS } from '../config/permissions';

const TR_MONTHS = ['Ocak','Şubat','Mart','Nisan','Mayıs','Haziran','Temmuz','Ağustos','Eylül','Ekim','Kasım','Aralık'];

const toMonthKey = (dateStr) => {
    const d = new Date(dateStr);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
};

const monthLabel = (key) => {
    if (!key) return 'Tüm Zamanlar';
    const [y, m] = key.split('-');
    return `${TR_MONTHS[parseInt(m) - 1]} ${y}`;
};

const formatCurrency = (amount) =>
    new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(amount || 0);

const computeStats = (list) => {
    let totalIncome = 0, totalExpense = 0, pendingIncome = 0, pendingExpense = 0;
    list.forEach(t => {
        const amt = t.grandTotal || t.amount || 0;
        if (t.type === 'gelir') {
            if (t.status === 'odendi') totalIncome += amt;
            else if (t.status === 'bekliyor') pendingIncome += amt;
        } else {
            if (t.status === 'odendi') totalExpense += amt;
            else if (t.status === 'bekliyor') pendingExpense += amt;
        }
    });
    return { totalIncome, totalExpense, netProfit: totalIncome - totalExpense, pendingIncome, pendingExpense };
};

const Accounting = () => {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';
    const { hasPermission } = useAuth();
    const canManage = hasPermission(PERMISSIONS.MANAGE_SETTINGS);

    const [transactions, setTransactions] = useState([]);
    const [filterType, setFilterType] = useState('hepsi');
    const [selectedMonth, setSelectedMonth] = useState(toMonthKey(new Date()));

    const [open, setOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [currentId, setCurrentId] = useState(null);
    const [formType, setFormType] = useState('gelir');
    const [formData, setFormData] = useState({
        contactName: '',
        date: new Date().toISOString().split('T')[0],
        dueDate: '',
        status: 'bekliyor',
        category: '',
        description: '',
        items: [{ description: '', quantity: 1, unitPrice: 0, taxRate: 20 }]
    });

    const colors = {
        incomeText:   isDark ? '#66bb6a' : '#2e7d32',
        incomeBg:     isDark ? 'rgba(46,125,50,0.15)' : '#e8f5e9',
        incomeBorder: isDark ? 'rgba(46,125,50,0.3)' : '#c8e6c9',
        expenseText:   isDark ? '#ef5350' : '#c62828',
        expenseBg:     isDark ? 'rgba(198,40,40,0.15)' : '#ffebee',
        expenseBorder: isDark ? 'rgba(198,40,40,0.3)' : '#ffcdd2',
        pendingIncomeText:   isDark ? '#42a5f5' : '#1565c0',
        pendingIncomeBg:     isDark ? 'rgba(21,101,192,0.15)' : '#e3f2fd',
        pendingIncomeBorder: isDark ? 'rgba(21,101,192,0.3)' : '#bbdefb',
        pendingExpenseText:   isDark ? '#ffa726' : '#e65100',
        pendingExpenseBg:     isDark ? 'rgba(230,81,0,0.15)' : '#fff3e0',
        pendingExpenseBorder: isDark ? 'rgba(230,81,0,0.3)' : '#ffe0b2',
        paperBg:      theme.palette.background.paper,
        tableHeadBg:  isDark ? 'rgba(255,255,255,0.05)' : '#F8FAFC',
        itemRowBg:    isDark ? 'rgba(255,255,255,0.03)' : '#f9f9f9',
        borderColor:  theme.palette.divider,
        textPrimary:  theme.palette.text.primary,
        textSecondary:theme.palette.text.secondary
    };

    useEffect(() => { fetchData(); }, []);

    const fetchData = async () => {
        try {
            const res = await axios.get(`${SERVER_URL}/api/accounting`);
            if (res.data.success) {
                const sorted = res.data.data.sort((a, b) => new Date(b.date) - new Date(a.date));
                setTransactions(sorted);
            }
        } catch (e) { console.error('Muhasebe veri hatası:', e); }
    };

    // ── Aylık yapılar ──────────────────────────────────────────────────────────

    const availableMonths = [...new Set(transactions.map(t => toMonthKey(t.date)))].sort().reverse();

    const navigateMonth = (dir) => {
        if (!selectedMonth) {
            setSelectedMonth(availableMonths[0] || toMonthKey(new Date()));
            return;
        }
        const idx = availableMonths.indexOf(selectedMonth);
        if (dir === 'prev' && idx < availableMonths.length - 1) setSelectedMonth(availableMonths[idx + 1]);
        if (dir === 'next' && idx > 0) setSelectedMonth(availableMonths[idx - 1]);
    };

    const monthTransactions = selectedMonth
        ? transactions.filter(t => toMonthKey(t.date) === selectedMonth)
        : transactions;

    const stats = computeStats(monthTransactions);

    const monthlyBreakdown = availableMonths.map(key => ({
        key,
        label: monthLabel(key),
        ...computeStats(transactions.filter(t => toMonthKey(t.date) === key)),
        count: transactions.filter(t => toMonthKey(t.date) === key).length
    }));

    // ── Tip filtresi ───────────────────────────────────────────────────────────

    const filteredData = monthTransactions.filter(t => {
        if (filterType === 'hepsi') return true;
        if (filterType === 'gelir')  return t.type === 'gelir'  && t.status === 'odendi';
        if (filterType === 'gider')  return t.type === 'gider'  && t.status === 'odendi';
        if (filterType === 'alacak') return t.type === 'gelir'  && t.status === 'bekliyor';
        if (filterType === 'borc')   return t.type === 'gider'  && t.status === 'bekliyor';
        return true;
    });

    // ── Form işlemleri ─────────────────────────────────────────────────────────

    const handleItemChange = (i, field, value) => {
        const items = [...formData.items];
        items[i][field] = value;
        setFormData({ ...formData, items });
    };
    const addItemLine = () => setFormData({ ...formData, items: [...formData.items, { description: '', quantity: 1, unitPrice: 0, taxRate: 20 }] });
    const removeItemLine = (i) => setFormData({ ...formData, items: formData.items.filter((_, idx) => idx !== i) });

    const calculateTotal = () => {
        let sub = 0, tax = 0;
        formData.items.forEach(item => {
            const t = item.quantity * item.unitPrice;
            sub += t;
            tax += t * (item.taxRate / 100);
        });
        return { sub, tax, grand: sub + tax };
    };

    const handleSubmit = async () => {
        if (!canManage) return alert('Yetkiniz yok.');
        try {
            const payload = { ...formData, type: formType };
            if (isEdit) await axios.put(`${SERVER_URL}/api/accounting/${currentId}`, payload);
            else        await axios.post(`${SERVER_URL}/api/accounting`, payload);
            setOpen(false); resetForm(); fetchData();
        } catch (e) { alert('İşlem başarısız: ' + (e.response?.data?.error || e.message)); }
    };

    const handleEdit = (t) => {
        if (!canManage) return;
        setIsEdit(true); setCurrentId(t._id); setFormType(t.type);
        setFormData({
            contactName: t.contactName,
            date: new Date(t.date).toISOString().split('T')[0],
            dueDate: t.dueDate ? new Date(t.dueDate).toISOString().split('T')[0] : '',
            status: t.status, category: t.category, description: t.description,
            items: t.items?.length ? t.items : [{ description: t.description, quantity: 1, unitPrice: t.amount || 0, taxRate: 0 }]
        });
        setOpen(true);
    };

    const handleDelete = async (id) => {
        if (!canManage) return alert('Yetkiniz yok.');
        if (!window.confirm('Bu kayıt silinsin mi?')) return;
        try { await axios.delete(`${SERVER_URL}/api/accounting/${id}`); fetchData(); }
        catch { alert('Silme başarısız.'); }
    };

    const resetForm = () => {
        setFormData({ contactName: '', date: new Date().toISOString().split('T')[0], dueDate: '', status: 'bekliyor', category: '', description: '', items: [{ description: '', quantity: 1, unitPrice: 0, taxRate: 20 }] });
        setIsEdit(false); setCurrentId(null);
    };

    const totals = calculateTotal();

    return (
        <Box sx={{ width: '100%', pb: 6 }}>

            {/* ── 1. AY NAVİGASYON ── */}
            <Paper elevation={0} sx={{ p: 2, mb: 3, borderRadius: 2, border: `1px solid ${colors.borderColor}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
                <Stack direction="row" alignItems="center" spacing={1}>
                    <CalendarMonthIcon sx={{ color: '#3B82F6', fontSize: 20 }} />
                    <Typography variant="subtitle2" fontWeight={700} color="text.secondary" sx={{ letterSpacing: 1, fontSize: '0.75rem', textTransform: 'uppercase' }}>
                        Dönem Seçimi
                    </Typography>
                </Stack>

                <Stack direction="row" alignItems="center" spacing={1} sx={{ overflowX: 'auto', pb: { xs: 1, md: 0 } }}>
                    <Button
                        size="small"
                        onClick={() => setSelectedMonth(null)}
                        sx={{
                            borderRadius: 1.5, px: 2, fontWeight: 700, fontSize: '0.75rem', textTransform: 'none', flexShrink: 0,
                            bgcolor: !selectedMonth ? '#0F172A' : 'transparent',
                            color: !selectedMonth ? '#fff' : 'text.secondary',
                            border: `1px solid ${!selectedMonth ? '#0F172A' : colors.borderColor}`,
                            '&:hover': { bgcolor: !selectedMonth ? '#1E293B' : alpha('#0F172A', 0.06) }
                        }}
                    >
                        Tüm Zamanlar
                    </Button>

                    {availableMonths.map(key => (
                        <Button
                            key={key}
                            size="small"
                            onClick={() => setSelectedMonth(key)}
                            sx={{
                                borderRadius: 1.5, px: 2, fontWeight: 700, fontSize: '0.75rem', textTransform: 'none', flexShrink: 0,
                                bgcolor: selectedMonth === key ? '#3B82F6' : 'transparent',
                                color: selectedMonth === key ? '#fff' : 'text.secondary',
                                border: `1px solid ${selectedMonth === key ? '#3B82F6' : colors.borderColor}`,
                                '&:hover': { bgcolor: selectedMonth === key ? '#2563EB' : alpha('#3B82F6', 0.07), color: selectedMonth === key ? '#fff' : '#3B82F6' }
                            }}
                        >
                            {monthLabel(key)}
                        </Button>
                    ))}
                </Stack>

                {selectedMonth && (
                    <Stack direction="row" alignItems="center" spacing={0.5}>
                        <IconButton size="small" onClick={() => navigateMonth('prev')} disabled={availableMonths.indexOf(selectedMonth) >= availableMonths.length - 1}>
                            <ChevronLeftIcon fontSize="small" />
                        </IconButton>
                        <Typography variant="body2" fontWeight={700} sx={{ minWidth: 110, textAlign: 'center', color: '#3B82F6' }}>
                            {monthLabel(selectedMonth)}
                        </Typography>
                        <IconButton size="small" onClick={() => navigateMonth('next')} disabled={availableMonths.indexOf(selectedMonth) <= 0}>
                            <ChevronRightIcon fontSize="small" />
                        </IconButton>
                    </Stack>
                )}
            </Paper>

            {/* ── 2. İSTATİSTİK KARTLARI ── */}
            <Grid container spacing={3} mb={4}>
                <Grid item xs={12} md={4}>
                    <Paper elevation={0} sx={{
                        p: 3, borderRadius: 2, height: '100%',
                        background: 'linear-gradient(135deg, #133D67 0%, #0a2540 100%)',
                        color: 'white', position: 'relative', overflow: 'hidden',
                        border: '1px solid rgba(255,255,255,0.08)'
                    }}>
                        <AccountBalanceWalletIcon sx={{ position: 'absolute', right: -15, bottom: -15, fontSize: 120, opacity: 0.1 }} />
                        <Typography sx={{ opacity: 0.7, letterSpacing: '0.12em', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase' }}>
                            {selectedMonth ? `Net Kasa — ${monthLabel(selectedMonth)}` : 'Net Kasa — Tüm Zamanlar'}
                        </Typography>
                        <Typography variant="h3" fontWeight={900} sx={{ mt: 1, fontSize: { xs: '1.8rem', md: '2.2rem' } }}>
                            {formatCurrency(stats.netProfit)}
                        </Typography>
                        <Typography sx={{ opacity: 0.5, fontSize: '0.75rem', mt: 0.5 }}>
                            {monthTransactions.length} işlem
                        </Typography>
                    </Paper>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Stack spacing={2} height="100%">
                        <Paper elevation={0} sx={{ p: 2, borderRadius: 2, bgcolor: colors.incomeBg, color: colors.incomeText, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexGrow: 1, border: `1px solid ${colors.incomeBorder}` }}>
                            <Box>
                                <Typography sx={{ fontSize: '0.68rem', fontWeight: 800, opacity: 0.8, letterSpacing: '0.1em' }}>TOPLAM GELİR</Typography>
                                <Typography variant="h5" fontWeight={800}>{formatCurrency(stats.totalIncome)}</Typography>
                            </Box>
                            <Box sx={{ p: 1, bgcolor: 'rgba(255,255,255,0.7)', borderRadius: '50%' }}><TrendingUpIcon sx={{ color: '#2e7d32' }} /></Box>
                        </Paper>
                        <Paper elevation={0} sx={{ p: 2, borderRadius: 2, bgcolor: colors.expenseBg, color: colors.expenseText, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexGrow: 1, border: `1px solid ${colors.expenseBorder}` }}>
                            <Box>
                                <Typography sx={{ fontSize: '0.68rem', fontWeight: 800, opacity: 0.8, letterSpacing: '0.1em' }}>TOPLAM GİDER</Typography>
                                <Typography variant="h5" fontWeight={800}>{formatCurrency(stats.totalExpense)}</Typography>
                            </Box>
                            <Box sx={{ p: 1, bgcolor: 'rgba(255,255,255,0.7)', borderRadius: '50%' }}><TrendingDownIcon sx={{ color: '#c62828' }} /></Box>
                        </Paper>
                    </Stack>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Stack spacing={2} height="100%">
                        <Paper elevation={0} sx={{ p: 2, borderRadius: 2, bgcolor: colors.pendingIncomeBg, color: colors.pendingIncomeText, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexGrow: 1, border: `1px solid ${colors.pendingIncomeBorder}` }}>
                            <Box>
                                <Typography sx={{ fontSize: '0.68rem', fontWeight: 800, opacity: 0.8, letterSpacing: '0.1em' }}>ALACAKLAR</Typography>
                                <Typography variant="h5" fontWeight={800}>{formatCurrency(stats.pendingIncome)}</Typography>
                            </Box>
                            <Box sx={{ p: 1, bgcolor: 'rgba(255,255,255,0.7)', borderRadius: '50%' }}><AttachMoneyIcon sx={{ color: '#1565c0' }} /></Box>
                        </Paper>
                        <Paper elevation={0} sx={{ p: 2, borderRadius: 2, bgcolor: colors.pendingExpenseBg, color: colors.pendingExpenseText, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexGrow: 1, border: `1px solid ${colors.pendingExpenseBorder}` }}>
                            <Box>
                                <Typography sx={{ fontSize: '0.68rem', fontWeight: 800, opacity: 0.8, letterSpacing: '0.1em' }}>ÖDENECEKLER</Typography>
                                <Typography variant="h5" fontWeight={800}>{formatCurrency(stats.pendingExpense)}</Typography>
                            </Box>
                            <Box sx={{ p: 1, bgcolor: 'rgba(255,255,255,0.7)', borderRadius: '50%' }}><MoneyOffIcon sx={{ color: '#e65100' }} /></Box>
                        </Paper>
                    </Stack>
                </Grid>
            </Grid>

            {/* ── 3. AYLIK ÖZET TABLOSU (sadece "Tüm Zamanlar"da görünür) ── */}
            {!selectedMonth && monthlyBreakdown.length > 0 && (
                <Fade in>
                    <Box mb={4}>
                        <Stack direction="row" alignItems="center" spacing={1} mb={2}>
                            <BarChartIcon sx={{ color: '#3B82F6', fontSize: 20 }} />
                            <Typography variant="subtitle1" fontWeight={800} color="text.primary">Aylık Özet</Typography>
                        </Stack>
                        <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 2, border: `1px solid ${colors.borderColor}`, overflowX: 'auto' }}>
                            <Table size="small" sx={{ minWidth: 600 }}>
                                <TableHead>
                                    <TableRow sx={{ bgcolor: colors.tableHeadBg }}>
                                        {['Ay', 'İşlem', 'Gelir', 'Gider', 'Net', 'Alacak', 'Ödenecek'].map(h => (
                                            <TableCell key={h} sx={{ fontWeight: 700, fontSize: '0.72rem', color: 'text.secondary', textTransform: 'uppercase', letterSpacing: 0.5 }}>{h}</TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {monthlyBreakdown.map(row => (
                                        <TableRow
                                            key={row.key}
                                            hover
                                            onClick={() => setSelectedMonth(row.key)}
                                            sx={{ cursor: 'pointer', '&:hover': { bgcolor: alpha('#3B82F6', 0.04) } }}
                                        >
                                            <TableCell>
                                                <Typography variant="body2" fontWeight={700} color="#3B82F6">{row.label}</Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Chip label={row.count} size="small" sx={{ bgcolor: '#F1F5F9', fontWeight: 700, fontSize: '0.72rem' }} />
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2" fontWeight={700} sx={{ color: colors.incomeText }}>{formatCurrency(row.totalIncome)}</Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2" fontWeight={700} sx={{ color: colors.expenseText }}>{formatCurrency(row.totalExpense)}</Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2" fontWeight={800} sx={{ color: row.netProfit >= 0 ? colors.incomeText : colors.expenseText }}>
                                                    {row.netProfit >= 0 ? '+' : ''}{formatCurrency(row.netProfit)}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2" sx={{ color: colors.pendingIncomeText }}>{formatCurrency(row.pendingIncome)}</Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2" sx={{ color: colors.pendingExpenseText }}>{formatCurrency(row.pendingExpense)}</Typography>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                </Fade>
            )}

            {/* ── 4. FİLTRE & İŞLEM BUTONLARI ── */}
            <Paper elevation={0} sx={{
                p: 2, mb: 3, borderRadius: 2,
                border: `1px solid ${colors.borderColor}`,
                display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: 'center', gap: 2
            }}>
                <Stack direction="row" spacing={1} sx={{ overflowX: 'auto', pb: { xs: 1, md: 0 }, flexShrink: 0 }}>
                    {[
                        { id: 'hepsi',  label: 'Tümü',      color: theme.palette.primary.main },
                        { id: 'gelir',  label: 'Gelirler',  color: isDark ? '#66bb6a' : '#2e7d32' },
                        { id: 'gider',  label: 'Giderler',  color: isDark ? '#ef5350' : '#c62828' },
                        { id: 'alacak', label: 'Alacaklar', color: isDark ? '#42a5f5' : '#1565c0' },
                        { id: 'borc',   label: 'Borçlar',   color: isDark ? '#ffa726' : '#ef6c00' }
                    ].map(btn => (
                        <Button
                            key={btn.id}
                            size="small"
                            startIcon={btn.id === 'hepsi' ? <FilterListIcon fontSize="small" /> : null}
                            onClick={() => setFilterType(btn.id)}
                            sx={{
                                borderRadius: 1.5, px: 2, fontWeight: 700, textTransform: 'none', fontSize: '0.78rem', flexShrink: 0,
                                bgcolor: filterType === btn.id ? btn.color : 'transparent',
                                color: filterType === btn.id ? '#fff' : colors.textSecondary,
                                border: `1px solid ${filterType === btn.id ? btn.color : colors.borderColor}`,
                                '&:hover': { bgcolor: filterType === btn.id ? btn.color : alpha(btn.color, 0.08), color: filterType === btn.id ? '#fff' : btn.color }
                            }}
                        >
                            {btn.label}
                        </Button>
                    ))}
                </Stack>

                {canManage && (
                    <Stack direction="row" spacing={1.5} flexShrink={0}>
                        <Button variant="contained" color="error" size="small" startIcon={<AddIcon />}
                            onClick={() => { resetForm(); setFormType('gider'); setOpen(true); }}
                            sx={{ borderRadius: 1.5, fontWeight: 700, fontSize: '0.78rem' }}>
                            Gider Ekle
                        </Button>
                        <Button variant="contained" color="success" size="small" startIcon={<AddIcon />}
                            onClick={() => { resetForm(); setFormType('gelir'); setOpen(true); }}
                            sx={{ borderRadius: 1.5, fontWeight: 700, fontSize: '0.78rem' }}>
                            Gelir Ekle
                        </Button>
                    </Stack>
                )}
            </Paper>

            {/* ── 5. İŞLEM TABLOSU ── */}
            <Fade in>
                <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 2, border: `1px solid ${colors.borderColor}`, overflowX: 'auto' }}>
                    <Table sx={{ minWidth: 700 }}>
                        <TableHead sx={{ bgcolor: colors.tableHeadBg }}>
                            <TableRow>
                                {['Tarih', 'Tür', 'Cari / Açıklama', 'Kategori', 'Durum', 'Tutar', canManage && 'İşlem'].filter(Boolean).map(h => (
                                    <TableCell key={h} align={h === 'Tutar' || h === 'İşlem' ? 'right' : 'left'}
                                        sx={{ fontWeight: 700, fontSize: '0.72rem', color: 'text.secondary', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                                        {h}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredData.length > 0 ? filteredData.map((row) => (
                                <TableRow key={row._id} hover sx={{ transition: '0.15s' }}>
                                    <TableCell sx={{ fontFamily: 'monospace', fontWeight: 600, fontSize: '0.82rem', color: 'text.secondary', whiteSpace: 'nowrap' }}>
                                        {new Date(row.date).toLocaleDateString('tr-TR')}
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={row.type === 'gelir' ? 'GELİR' : 'GİDER'}
                                            size="small"
                                            sx={{
                                                bgcolor: row.type === 'gelir' ? colors.incomeBg : colors.expenseBg,
                                                color:  row.type === 'gelir' ? colors.incomeText  : colors.expenseText,
                                                fontWeight: 800, fontSize: '0.68rem', borderRadius: 1
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2" fontWeight={700}>{row.contactName}</Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {row.items?.length ? row.items[0].description : row.description}
                                            {row.items?.length > 1 && ` (+${row.items.length - 1} kalem)`}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Chip label={row.category || 'Genel'} size="small" variant="outlined" sx={{ borderColor: colors.borderColor, color: colors.textSecondary, fontSize: '0.72rem' }} />
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={row.status === 'odendi' ? 'TAMAMLANDI' : row.status === 'bekliyor' ? 'BEKLİYOR' : 'İPTAL'}
                                            size="small"
                                            icon={row.status === 'odendi' ? <ReceiptIcon sx={{ fontSize: '13px !important' }} /> : <PendingActionsIcon sx={{ fontSize: '13px !important' }} />}
                                            sx={{
                                                fontWeight: 700, borderRadius: 1, fontSize: '0.68rem',
                                                bgcolor: row.status === 'odendi' ? alpha(theme.palette.info.main, 0.1) : row.status === 'bekliyor' ? alpha(theme.palette.warning.main, 0.1) : alpha(theme.palette.action.disabled, 0.1),
                                                color: row.status === 'odendi' ? 'info.main' : row.status === 'bekliyor' ? 'warning.main' : 'text.disabled'
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell align="right">
                                        <Typography variant="body2" fontWeight={800} sx={{ color: row.type === 'gelir' ? colors.incomeText : colors.expenseText, whiteSpace: 'nowrap' }}>
                                            {row.type === 'gider' ? '-' : '+'}{formatCurrency(row.grandTotal || row.amount)}
                                        </Typography>
                                    </TableCell>
                                    {canManage && (
                                        <TableCell align="right">
                                            <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                                                <Tooltip title="Düzenle">
                                                    <IconButton size="small" onClick={() => handleEdit(row)} sx={{ color: 'primary.main', bgcolor: alpha(theme.palette.primary.main, 0.08), '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.16) } }}>
                                                        <EditIcon sx={{ fontSize: 15 }} />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Sil">
                                                    <IconButton size="small" onClick={() => handleDelete(row._id)} sx={{ color: 'error.main', bgcolor: alpha(theme.palette.error.main, 0.08), '&:hover': { bgcolor: alpha(theme.palette.error.main, 0.16) } }}>
                                                        <DeleteIcon sx={{ fontSize: 15 }} />
                                                    </IconButton>
                                                </Tooltip>
                                            </Stack>
                                        </TableCell>
                                    )}
                                </TableRow>
                            )) : (
                                <TableRow>
                                    <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                                        <CalendarMonthIcon sx={{ fontSize: 36, color: 'text.disabled', mb: 1 }} />
                                        <Typography variant="body2" color="text.secondary">
                                            {selectedMonth ? `${monthLabel(selectedMonth)} döneminde kayıt yok.` : 'Kayıt bulunamadı.'}
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Fade>

            {/* ── 6. FORM MODALI ── */}
            <Dialog
                open={open} onClose={() => setOpen(false)}
                maxWidth="md" fullWidth
                PaperProps={{ sx: { borderRadius: 3 } }}
                TransitionComponent={Grow}
            >
                <DialogTitle sx={{ bgcolor: formType === 'gelir' ? '#2e7d32' : '#c62828', color: 'white', py: 2 }}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                        {formType === 'gelir' ? <TrendingUpIcon /> : <TrendingDownIcon />}
                        <Typography variant="h6" fontWeight={800}>
                            {isEdit ? (formType === 'gelir' ? 'Geliri Düzenle' : 'Gideri Düzenle') : (formType === 'gelir' ? 'Yeni Gelir Ekle' : 'Yeni Gider Ekle')}
                        </Typography>
                    </Stack>
                </DialogTitle>
                <DialogContent sx={{ mt: 2 }}>
                    <Grid container spacing={2} sx={{ mt: 0.5, mb: 3 }}>
                        <Grid item xs={12} md={6}>
                            <TextField fullWidth label="Cari Ünvanı / Adı" value={formData.contactName} onChange={e => setFormData({ ...formData, contactName: e.target.value })} size="small" />
                        </Grid>
                        <Grid item xs={6} md={3}>
                            <TextField fullWidth type="date" label="İşlem Tarihi" InputLabelProps={{ shrink: true }} value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} size="small" />
                        </Grid>
                        <Grid item xs={6} md={3}>
                            <FormControl fullWidth size="small">
                                <InputLabel>Durum</InputLabel>
                                <Select value={formData.status} label="Durum" onChange={e => setFormData({ ...formData, status: e.target.value })}>
                                    <MenuItem value="odendi">✅ Ödendi / Tahsil Edildi</MenuItem>
                                    <MenuItem value="bekliyor">⏳ Bekliyor (Vadeli)</MenuItem>
                                    <MenuItem value="iptal">🚫 İptal</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField fullWidth size="small" label="Kategori (Örn: Maaş, Kira, Web Tasarım)" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} />
                        </Grid>
                    </Grid>

                    <Divider textAlign="left" sx={{ mb: 2 }}>
                        <Chip label="KALEMLER" size="small" sx={{ bgcolor: theme.palette.action.selected, fontWeight: 700, fontSize: '0.7rem' }} />
                    </Divider>

                    <Stack spacing={2}>
                        {formData.items.map((item, index) => (
                            <Paper key={index} elevation={0} sx={{ p: 2, bgcolor: colors.itemRowBg, borderRadius: 2, border: `1px solid ${colors.borderColor}` }}>
                                <Grid container spacing={1.5} alignItems="center">
                                    <Grid item xs={12} sm={4}><TextField fullWidth size="small" label="Açıklama" value={item.description} onChange={e => handleItemChange(index, 'description', e.target.value)} /></Grid>
                                    <Grid item xs={4} sm={2}><TextField fullWidth size="small" type="number" label="Miktar" value={item.quantity} onChange={e => handleItemChange(index, 'quantity', Number(e.target.value))} /></Grid>
                                    <Grid item xs={4} sm={3}><TextField fullWidth size="small" type="number" label="Birim Fiyat" InputProps={{ startAdornment: <InputAdornment position="start">₺</InputAdornment> }} value={item.unitPrice} onChange={e => handleItemChange(index, 'unitPrice', Number(e.target.value))} /></Grid>
                                    <Grid item xs={3} sm={2}><FormControl fullWidth size="small"><InputLabel>KDV</InputLabel><Select value={item.taxRate} label="KDV" onChange={e => handleItemChange(index, 'taxRate', Number(e.target.value))}><MenuItem value={0}>%0</MenuItem><MenuItem value={20}>%20</MenuItem></Select></FormControl></Grid>
                                    <Grid item xs={1}><IconButton size="small" color="error" onClick={() => removeItemLine(index)} disabled={formData.items.length === 1}><DeleteIcon fontSize="small" /></IconButton></Grid>
                                </Grid>
                            </Paper>
                        ))}
                    </Stack>

                    <Box mt={2} display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
                        <Button startIcon={<AddShoppingCartIcon />} onClick={addItemLine} variant="outlined" size="small" sx={{ borderRadius: 1.5 }}>Satır Ekle</Button>
                        <Paper elevation={0} sx={{ bgcolor: colors.incomeBg, px: 3, py: 1.5, borderRadius: 2, border: `1px solid ${colors.incomeBorder}` }}>
                            <Typography variant="h6" fontWeight={800} sx={{ color: formType === 'gelir' ? colors.incomeText : colors.expenseText }}>
                                TOPLAM: {formatCurrency(totals.grand)}
                            </Typography>
                        </Paper>
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 2.5, borderTop: `1px solid ${colors.borderColor}` }}>
                    <Button onClick={() => setOpen(false)} color="inherit">Vazgeç</Button>
                    <Button variant="contained" onClick={handleSubmit}
                        sx={{ bgcolor: formType === 'gelir' ? colors.incomeText : colors.expenseText, px: 4, borderRadius: 1.5, fontWeight: 700 }}>
                        {isEdit ? 'Güncelle' : 'Kaydet'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Accounting;
