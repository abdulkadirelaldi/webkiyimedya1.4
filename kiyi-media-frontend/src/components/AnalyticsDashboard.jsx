// src/components/AnalyticsDashboard.jsx
import React, { useEffect, useState } from 'react';
import { 
    Grid, Paper, Typography, Box, CircularProgress, 
    Card, CardContent, Stack, Avatar, Chip, useTheme 
} from '@mui/material';
import { 
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, 
    ResponsiveContainer, BarChart, Bar, Cell 
} from 'recharts';
import axios from 'axios';
import { SERVER_URL } from '../config'; // Config dosyasından çekiyoruz

// İKONLAR
import PeopleIcon from '@mui/icons-material/People';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import EmailIcon from '@mui/icons-material/Email';
import CollectionsBookmarkIcon from '@mui/icons-material/CollectionsBookmark';

const AnalyticsDashboard = () => {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';
    
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    // DİNAMİK RENKLER
    const colors = {
        textPrimary: theme.palette.text.primary,
        textSecondary: theme.palette.text.secondary,
        cardBg: theme.palette.background.paper,
        border: theme.palette.divider,
        chartGrid: isDark ? '#334155' : '#e0e0e0',
        chartAxis: isDark ? '#94a3b8' : '#666',
        tooltipBg: isDark ? '#1e293b' : '#fff',
        titleColor: isDark ? '#90caf9' : '#133D67'
    };

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await axios.get(`${SERVER_URL}/api/analytics/dashboard`);
                if (res.data.success) {
                    setStats(res.data.data);
                }
            } catch (error) {
                console.error("Analiz verisi çekilemedi", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return <Box display="flex" justifyContent="center" p={5}><CircularProgress /></Box>;
    if (!stats) return <Typography color="error">Veri yüklenemedi.</Typography>;

    return (
        <Box sx={{ flexGrow: 1, pb: 4 }}>
            <Typography variant="h5" fontWeight="900" sx={{ color: colors.titleColor, mb: 4 }}>
                CANLI SİTE İSTATİSTİKLERİ
            </Typography>

            {/* --- 1. ÖZET KARTLARI (4'lü) --- */}
            <Grid container spacing={3} mb={4}>
                <Grid item xs={12} sm={6} md={3}>
                    <SummaryCard 
                        title="Bu Ayki Ziyaretçi" 
                        value={stats.monthlyVisitors} 
                        icon={<PeopleIcon sx={{ fontSize: 30, color: 'white' }} />} 
                        gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                        subtext="Gerçek Tekil Ziyaret"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <SummaryCard 
                        title="Toplam Ziyaretçi" 
                        value={stats.totalVisitors} 
                        icon={<TrendingUpIcon sx={{ fontSize: 30, color: 'white' }} />} 
                        gradient="linear-gradient(135deg, #f6d365 0%, #fda085 100%)"
                        subtext="Tüm Zamanlar"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <SummaryCard 
                        title="Toplam Proje" 
                        value={stats.totalProjects} 
                        icon={<CollectionsBookmarkIcon sx={{ fontSize: 30, color: 'white' }} />} 
                        gradient="linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)"
                        subtext="Portföydeki İşler"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <SummaryCard 
                        title="Gelen Mesajlar" 
                        value={stats.totalMessages} 
                        icon={<EmailIcon sx={{ fontSize: 30, color: 'white' }} />} 
                        gradient="linear-gradient(135deg, #ff9a9e 0%, #fecfef 99%, #fecfef 100%)"
                        subtext="İletişim Formu"
                    />
                </Grid>
            </Grid>

            {/* --- 2. GRAFİKLER BÖLÜMÜ --- */}
            <Grid container spacing={3}>
                
                {/* SOL: HAFTALIK TRAFİK */}
                <Grid item xs={12} md={8}>
                    <Paper elevation={0} sx={{ 
                        p: 3, borderRadius: 4, height: 400, 
                        bgcolor: colors.cardBg, 
                        border: `1px solid ${colors.border}`,
                        boxShadow: isDark ? '0 4px 20px rgba(0,0,0,0.4)' : '0 4px 20px rgba(0,0,0,0.05)'
                    }}>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                            <Typography variant="h6" fontWeight="bold" sx={{ color: colors.textPrimary }}>Haftalık Ziyaretçi Trafiği</Typography>
                            <Chip label="Son 7 Gün" color="primary" size="small" variant="outlined" />
                        </Box>
                        <ResponsiveContainer width="100%" height="85%">
                            <AreaChart data={stats.weeklyVisitors}>
                                <defs>
                                    <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={theme.palette.primary.main} stopOpacity={0.8}/>
                                        <stop offset="95%" stopColor={theme.palette.primary.main} stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="name" stroke={colors.chartAxis} tick={{fill: colors.chartAxis}} />
                                <YAxis stroke={colors.chartAxis} tick={{fill: colors.chartAxis}} allowDecimals={false} />
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={colors.chartGrid} />
                                <RechartsTooltip 
                                    contentStyle={{ 
                                        borderRadius: 10, 
                                        border: `1px solid ${colors.border}`, 
                                        backgroundColor: colors.tooltipBg,
                                        color: colors.textPrimary,
                                        boxShadow: '0 4px 20px rgba(0,0,0,0.1)' 
                                    }} 
                                    itemStyle={{ color: colors.textPrimary }}
                                />
                                <Area type="monotone" dataKey="uv" stroke={theme.palette.primary.main} strokeWidth={3} fillOpacity={1} fill="url(#colorUv)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>

                {/* SAĞ: EN ÇOK TIKLANAN HİZMETLER */}
                <Grid item xs={12} md={4}>
                    <Paper elevation={0} sx={{ 
                        p: 3, borderRadius: 4, height: 400,
                        bgcolor: colors.cardBg, 
                        border: `1px solid ${colors.border}`,
                        boxShadow: isDark ? '0 4px 20px rgba(0,0,0,0.4)' : '0 4px 20px rgba(0,0,0,0.05)'
                    }}>
                        <Typography variant="h6" fontWeight="bold" sx={{ color: colors.textPrimary, mb: 1 }}>
                            Popüler Hizmetler
                        </Typography>
                        <Typography variant="caption" sx={{ color: colors.textSecondary, mb: 3, display: 'block' }}>
                            Kullanıcıların en çok tıkladığı alanlar
                        </Typography>
                        
                        {stats.servicePopularity.length > 0 ? (
                            <ResponsiveContainer width="100%" height="85%">
                                <BarChart data={stats.servicePopularity} layout="vertical" margin={{ left: 0, right: 20 }}>
                                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke={colors.chartGrid} />
                                    <XAxis type="number" hide />
                                    <YAxis dataKey="name" type="category" width={100} tick={{fontSize: 12, fontWeight: 'bold', fill: colors.chartAxis}} />
                                    <RechartsTooltip 
                                        cursor={{fill: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}} 
                                        contentStyle={{ backgroundColor: colors.tooltipBg, borderColor: colors.border, borderRadius: 8, color: colors.textPrimary }}
                                    />
                                    <Bar dataKey="value" radius={[0, 10, 10, 0]} barSize={20}>
                                        {stats.servicePopularity.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color || theme.palette.secondary.main} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <Box display="flex" alignItems="center" justifyContent="center" height="80%">
                                <Typography color="text.secondary">Henüz tıklama verisi yok.</Typography>
                            </Box>
                        )}
                    </Paper>
                </Grid>

            </Grid>
        </Box>
    );
};

// YARDIMCI KART BİLEŞENİ
const SummaryCard = ({ title, value, icon, gradient, subtext }) => (
    <Card sx={{ 
        borderRadius: 4, 
        background: gradient, 
        color: 'white', 
        position: 'relative', 
        overflow: 'hidden', 
        boxShadow: '0 10px 20px rgba(0,0,0,0.15)' 
    }}>
        <Box sx={{ position: 'absolute', top: -10, right: -10, opacity: 0.2, transform: 'rotate(15deg)' }}>
            <Box sx={{ fontSize: 100, lineHeight: 0 }}>{icon}</Box>
        </Box>
        <CardContent sx={{ position: 'relative', zIndex: 1 }}>
            <Stack direction="row" alignItems="center" spacing={2} mb={2}>
                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 50, height: 50 }}>{icon}</Avatar>
                <Typography variant="h6" fontWeight="bold" sx={{ opacity: 0.9, fontSize: '1rem' }}>{title}</Typography>
            </Stack>
            <Typography variant="h4" fontWeight="900" sx={{ mb: 1 }}>{value}</Typography>
            <Chip label={subtext} size="small" sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white', fontWeight: 'bold' }} />
        </CardContent>
    </Card>
);

export default AnalyticsDashboard;