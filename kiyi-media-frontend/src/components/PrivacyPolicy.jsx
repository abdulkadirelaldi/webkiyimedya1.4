// src/components/PrivacyPolicy.jsx
import React from 'react';
import { 
    Container, Typography, Box, Paper, Divider, 
    List, ListItem, ListItemIcon, ListItemText, useTheme, alpha 
} from '@mui/material';
import GavelIcon from '@mui/icons-material/Gavel';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import SecurityIcon from '@mui/icons-material/Security';
import SEO from '../components/SEO'; // Eğer SEO bileşenin yoksa bu satırı kaldırabilirsin

const PrivacyPolicy = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  // Dinamik Renkler
  const colors = {
      bg: theme.palette.background.default,
      paper: theme.palette.background.paper,
      textPrimary: theme.palette.text.primary,
      textSecondary: theme.palette.text.secondary,
      header: isDark ? '#90caf9' : '#1D3557', // Başlık Rengi
      divider: theme.palette.divider,
      icon: theme.palette.primary.main
  };

  return (
    <Box sx={{ bgcolor: colors.bg, minHeight: '100vh', py: 8 }}>
      {/* SEO Bileşeni (Opsiyonel) */}
      <SEO title="Gizlilik Politikası | Kıyı Medya" description="Kıyı Medya KVKK ve Gizlilik Politikası metni." />

      <Container maxWidth="md">
        <Paper 
            elevation={0} 
            sx={{ 
                p: { xs: 4, md: 6 }, 
                borderRadius: 4, 
                bgcolor: colors.paper,
                border: `1px solid ${colors.divider}`,
                boxShadow: isDark ? '0 10px 40px rgba(0,0,0,0.5)' : '0 10px 40px rgba(0,0,0,0.05)'
            }}
        >
            {/* BAŞLIK */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 2 }}>
                <SecurityIcon sx={{ fontSize: 40, color: colors.header }} />
                <Typography variant="h4" component="h1" fontWeight="800" color={colors.header}>
                    Gizlilik Politikası
                </Typography>
            </Box>
            <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                KVKK Aydınlatma Metni
            </Typography>
            <Typography variant="caption" display="block" sx={{ mb: 4, color: 'text.disabled' }}>
                Son Güncelleme: 4 Şubat 2026
            </Typography>

            <Divider sx={{ mb: 4 }} />

            {/* GİRİŞ */}
            <Typography variant="body1" paragraph sx={{ lineHeight: 1.8, color: colors.textPrimary }}>
                <strong>Kıyı Medya</strong> ("Şirket" veya "Biz") olarak, <code>kiyimedya.com</code> web sitesini ziyaret eden kullanıcılarımızın ("Kullanıcı" veya "Siz") gizliliğine ve kişisel verilerinin güvenliğine büyük önem veriyoruz. İşbu Gizlilik Politikası, 6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") kapsamında kişisel verilerinizin toplanma yöntemlerini, işlenme amaçlarını ve haklarınızı açıklamaktadır.
            </Typography>

            {/* 1. VERİ SORUMLUSU */}
            <Box sx={{ mt: 4 }}>
                <Typography variant="h6" fontWeight="bold" color={colors.header} gutterBottom>
                    1. Veri Sorumlusu
                </Typography>
                <Typography variant="body1" sx={{ lineHeight: 1.8, color: colors.textSecondary }}>
                    KVKK uyarınca, kişisel verileriniz; veri sorumlusu sıfatıyla <strong>Kıyı Medya</strong> (Atakum, Samsun) tarafından aşağıda açıklanan kapsamda işlenebilecektir.
                </Typography>
            </Box>

            {/* 2. TOPLANAN VERİLER */}
            <Box sx={{ mt: 4 }}>
                <Typography variant="h6" fontWeight="bold" color={colors.header} gutterBottom>
                    2. Toplanan Kişisel Veriler
                </Typography>
                <Typography variant="body1" sx={{ mb: 2, color: colors.textSecondary }}>
                    Web sitemiz üzerinden sunduğumuz hizmetlerden yararlanmanız durumunda şu verileriniz toplanabilir:
                </Typography>
                <List dense>
                    {[
                        { title: 'Kimlik Bilgileri', desc: 'Adınız, soyadınız.' },
                        { title: 'İletişim Bilgileri', desc: 'E-posta adresiniz, telefon numaranız.' },
                        { title: 'İşlem Güvenliği Bilgileri', desc: 'IP adresi, siteye giriş-çıkış bilgileri.' },
                        { title: 'Talep/Şikayet Bilgileri', desc: 'İletişim formlarında belirttiğiniz mesaj içeriği.' }
                    ].map((item, index) => (
                        <ListItem key={index} alignItems="flex-start" sx={{ pl: 0 }}>
                            <ListItemIcon sx={{ minWidth: 30, mt: 0.5 }}>
                                <FiberManualRecordIcon sx={{ fontSize: 10, color: colors.icon }} />
                            </ListItemIcon>
                            <ListItemText 
                                primary={<Typography fontWeight="bold" color={colors.textPrimary}>{item.title}</Typography>}
                                secondary={<Typography variant="body2" color={colors.textSecondary}>{item.desc}</Typography>}
                            />
                        </ListItem>
                    ))}
                </List>
            </Box>

            {/* 3. İŞLENME AMAÇLARI */}
            <Box sx={{ mt: 4 }}>
                <Typography variant="h6" fontWeight="bold" color={colors.header} gutterBottom>
                    3. Kişisel Verilerin İşlenme Amaçları
                </Typography>
                <Typography variant="body1" sx={{ mb: 2, color: colors.textSecondary }}>
                    Kişisel verileriniz aşağıdaki amaçlarla işlenmektedir:
                </Typography>
                <List dense>
                    {['Kurumsal iletişim süreçlerinin yürütülmesi ve tarafınızla irtibata geçilmesi.', 'Teklif alma ve proje süreçlerinin yönetilmesi.', 'Yasal yükümlülüklerin yerine getirilmesi.'].map((text, index) => (
                        <ListItem key={index} sx={{ pl: 0 }}>
                            <ListItemIcon sx={{ minWidth: 30 }}>
                                <FiberManualRecordIcon sx={{ fontSize: 10, color: colors.icon }} />
                            </ListItemIcon>
                            <ListItemText primary={text} sx={{ color: colors.textPrimary }} />
                        </ListItem>
                    ))}
                </List>
            </Box>

            {/* 4. HAKLAR */}
            <Box sx={{ mt: 4 }}>
                <Typography variant="h6" fontWeight="bold" color={colors.header} gutterBottom>
                    4. İlgili Kişinin Hakları
                </Typography>
                <Typography variant="body1" sx={{ lineHeight: 1.8, color: colors.textSecondary }}>
                    Kişisel veri sahibi olarak; verilerinizin işlenip işlenmediğini öğrenme, düzeltilmesini veya silinmesini isteme haklarına sahipsiniz. Bu haklarınızı kullanmak için taleplerinizi <Box component="span" sx={{ color: theme.palette.primary.main, fontWeight: 'bold' }}>info@kiyimedya.com</Box> adresine iletebilirsiniz.
                </Typography>
            </Box>

            {/* ALT BİLGİ */}
            <Box sx={{ mt: 6, p: 3, bgcolor: alpha(colors.header, 0.05), borderRadius: 2, borderLeft: `4px solid ${colors.header}` }}>
                <Typography variant="body2" color="text.secondary">
                    Bu metin, Kıyı Medya tarafından, 6698 sayılı Kişisel Verilerin Korunması Kanunu'na uygun olarak hazırlanmıştır.
                </Typography>
            </Box>

        </Paper>
      </Container>
    </Box>
  );
};

export default PrivacyPolicy;