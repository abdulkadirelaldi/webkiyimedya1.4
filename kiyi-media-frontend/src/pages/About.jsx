// src/pages/About.jsx
import React from 'react';
import { Container, Grid, Typography, Box, Button, Chip, useTheme, useMediaQuery } from '@mui/material';
import { Link } from 'react-router-dom';
import { motion } from "framer-motion";

import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import DiamondIcon from '@mui/icons-material/Diamond';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import BoltIcon from '@mui/icons-material/Bolt';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import PsychologyIcon from '@mui/icons-material/Psychology';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import PublicIcon from '@mui/icons-material/Public';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import GroupsIcon from '@mui/icons-material/Groups';
import StarIcon from '@mui/icons-material/Star';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import CampaignIcon from '@mui/icons-material/Campaign';
import LanguageIcon from '@mui/icons-material/Language';
import BrushIcon from '@mui/icons-material/Brush';
import VideocamIcon from '@mui/icons-material/Videocam';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';

const fadeUp = (delay = 0) => ({
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, delay, ease: 'easeOut' } }
});

const About = () => {
  const BLUE = '#3B82F6';
  const PURPLE = '#8B5CF6';

  const stats = [
    { number: '5+', label: 'Yıllık Deneyim', icon: <EmojiEventsIcon /> },
    { number: '50+', label: 'Mutlu Marka', icon: <StarIcon /> },
    { number: '300+', label: 'Tamamlanan Proje', icon: <RocketLaunchIcon /> },
    { number: '%98', label: 'Müşteri Memnuniyeti', icon: <WorkspacePremiumIcon /> },
  ];

  const values = [
    { title: 'Yenilikçi', icon: <AutoAwesomeIcon />, desc: 'En güncel trend ve teknolojileri projelerinize taşıyoruz.', color: '#3B82F6' },
    { title: 'Şeffaf', icon: <DiamondIcon />, desc: 'Her adımda açık iletişimle güven inşa ediyoruz.', color: '#8B5CF6' },
    { title: 'Stratejik', icon: <PsychologyIcon />, desc: 'Veri odaklı kararlarla hedeflerinize en kısa yoldan ulaşıyoruz.', color: '#10B981' },
    { title: 'Sonuç Odaklı', icon: <TrendingUpIcon />, desc: 'Gerçek büyüme hikayelerini birlikte yazıyoruz.', color: '#F59E0B' },
    { title: 'Hızlı', icon: <BoltIcon />, desc: 'Zamanında ve kaliteli teslimatı asla taviz vermeden sağlıyoruz.', color: '#EF4444' },
    { title: 'Mükemmeliyetçi', icon: <WorkspacePremiumIcon />, desc: 'Her detayı titizlikle, piksel piksel özenle işliyoruz.', color: '#06B6D4' },
  ];

  const services = [
    { icon: <LanguageIcon />, label: 'Web Tasarım & Yazılım' },
    { icon: <CampaignIcon />, label: 'Sosyal Medya Yönetimi' },
    { icon: <TrendingUpIcon />, label: 'Dijital Reklam (Meta & Google)' },
    { icon: <VideocamIcon />, label: 'Video & Fotoğraf Prodüksiyon' },
    { icon: <BrushIcon />, label: 'Grafik & Marka Tasarımı' },
    { icon: <PublicIcon />, label: 'SEO & Dijital Strateji' },
  ];

  const process = [
    { id: '01', title: 'Keşif & Analiz', desc: 'Markanızı, rakiplerinizi ve hedef kitlenizi derinlemesine tanıyarak güçlü bir temel oluşturuyoruz.', color: BLUE },
    { id: '02', title: 'Strateji & Konsept', desc: 'Veriye dayalı stratejiler ve özgün yaratıcı konseptlerle marka sesinizi netleştiriyoruz.', color: PURPLE },
    { id: '03', title: 'Üretim & Yayın', desc: 'İçerik, tasarım, web ve reklam — hepsini planlı takvimde kusursuz biçimde hayata geçiriyoruz.', color: '#10B981' },
    { id: '04', title: 'Ölçüm & Büyüme', desc: 'Performans raporları ve optimizasyonlarla büyümenizi sürdürülebilir kılıyoruz.', color: '#F59E0B' },
  ];

  return (
    <Box sx={{ overflowX: 'hidden', minHeight: '100vh', bgcolor: '#060C1A', color: '#fff' }}>

      {/* ===== 1. HERO ===== */}
      <Box sx={{ position: 'relative', overflow: 'hidden', pt: { xs: 14, md: 20 }, pb: { xs: 10, md: 16 } }}>
        <Box sx={{ position: 'absolute', top: '10%', right: '-10%', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(59,130,246,0.14) 0%, transparent 70%)', filter: 'blur(80px)', pointerEvents: 'none' }} />
        <Box sx={{ position: 'absolute', bottom: '-10%', left: '-10%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)', filter: 'blur(70px)', pointerEvents: 'none' }} />
        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <motion.div initial="hidden" animate="visible" variants={fadeUp(0)}>
            <Box sx={{ display: 'inline-flex', alignItems: 'center', px: 2.5, py: 0.8, mb: 4, borderRadius: '50px', bgcolor: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.2)' }}>
              <AutoAwesomeIcon sx={{ color: '#60A5FA', fontSize: 15, mr: 1 }} />
              <Typography variant="caption" sx={{ color: '#60A5FA', fontWeight: 700, letterSpacing: 1.5 }}>360° DİJİTAL AJANS</Typography>
            </Box>
          </motion.div>
          <motion.div initial="hidden" animate="visible" variants={fadeUp(0.1)}>
            <Typography variant="h1" sx={{ fontWeight: 900, mb: 3, fontSize: { xs: '2.8rem', md: '5rem' }, lineHeight: 1.08, letterSpacing: '-0.02em' }}>
              Markanızı<br />
              <span style={{ background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Dijitalde Güçlendirin</span>
            </Typography>
          </motion.div>
          <motion.div initial="hidden" animate="visible" variants={fadeUp(0.2)}>
            <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.55)', fontSize: { xs: '1rem', md: '1.2rem' }, lineHeight: 1.9, maxWidth: 620, mx: 'auto', mb: 5 }}>
              Kıyı Medya; yaratıcılığı stratejiyle, teknolojiyi sanatla buluşturan bir 360 dijital ajans.
              Web'den sosyal medyaya, reklamdan prodüksiyona — tek çatı altında tam hizmet.
            </Typography>
          </motion.div>
          <motion.div initial="hidden" animate="visible" variants={fadeUp(0.3)}>
            <Box display="flex" gap={2} justifyContent="center" flexWrap="wrap" mb={10}>
              <Button component={Link} to="/contact" variant="contained" endIcon={<ArrowForwardIcon />}
                sx={{ background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)', color: '#fff', borderRadius: '50px', px: 4, py: 1.6, fontWeight: 700, fontSize: '1rem', boxShadow: '0 8px 32px rgba(59,130,246,0.4)', '&:hover': { opacity: 0.9, transform: 'translateY(-2px)' }, transition: 'all 0.3s' }}>
                Ücretsiz Strateji Görüşmesi
              </Button>
              <Button component={Link} to="/portfolio" variant="outlined"
                sx={{ borderColor: 'rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.8)', borderRadius: '50px', px: 4, py: 1.6, fontWeight: 600, '&:hover': { borderColor: BLUE, color: '#fff', bgcolor: 'rgba(59,130,246,0.08)' }, transition: 'all 0.3s' }}>
                Portföyü İncele
              </Button>
            </Box>
          </motion.div>
          <motion.div initial="hidden" animate="visible" variants={fadeUp(0.4)}>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(4, 1fr)' }, gap: { xs: 4, md: 2 } }}>
              {[
                { number: '5+', label: 'Yıllık Deneyim', color: '#3B82F6' },
                { number: '50+', label: 'Mutlu Marka', color: '#8B5CF6' },
                { number: '300+', label: 'Tamamlanan Proje', color: '#10B981' },
                { number: '%98', label: 'Müşteri Memnuniyeti', color: '#F59E0B' },
              ].map((s, i) => (
                <Box key={i} sx={{ textAlign: 'center' }}>
                  <Typography fontWeight={900} sx={{ fontSize: { xs: '2.8rem', md: '3.5rem' }, lineHeight: 1, color: s.color, mb: 0.5 }}>{s.number}</Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.4)', fontWeight: 500 }}>{s.label}</Typography>
                </Box>
              ))}
            </Box>
          </motion.div>
        </Container>
      </Box>

      {/* ===== 2. WHO WE ARE ===== */}
      <Container maxWidth="lg" sx={{ py: { xs: 10, md: 14 } }}>
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp(0)}>
          <Box textAlign="center" mb={8}>
            <Box sx={{ display: 'inline-flex', alignItems: 'center', px: 2, py: 0.6, mb: 3, borderRadius: '50px', bgcolor: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)' }}>
              <Typography variant="caption" sx={{ color: '#60A5FA', fontWeight: 700, letterSpacing: 1.5 }}>BİZ KİMİZ</Typography>
            </Box>
            <Typography variant="h2" fontWeight={900} sx={{ mb: 3, lineHeight: 1.15, fontSize: { xs: '2.2rem', md: '3.5rem' } }}>
              Markanız İçin Her Şeyi<br />
              <span style={{ background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Düşünen Ajansınız</span>
            </Typography>
            <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.55)', lineHeight: 1.9, maxWidth: 700, mx: 'auto', mb: 2, fontSize: '1.05rem' }}>
              Kıyı Medya, işletmelerin dijital dünyada güçlü ve kalıcı bir iz bırakması için kuruldu.
              Bir reklamın ötesinde; marka kimliğinizi inşa ediyor, hedef kitlenizle gerçek bir bağ kuruyoruz.
            </Typography>
            <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.45)', lineHeight: 1.9, maxWidth: 700, mx: 'auto', fontSize: '1.05rem' }}>
              Web tasarımdan sosyal medyaya, video prodüksiyondan SEO'ya kadar tüm dijital hizmetleri tek çatı altında sunuyoruz.
            </Typography>
          </Box>

          <Grid container spacing={3} justifyContent="center" mb={8}>
            {['Sektöre özel strateji ve içerik planlaması', 'Ölçülebilir sonuçlar ve şeffaf raporlama', 'Deneyimli ve yaratıcı bir ekip', '7/24 destek ve hızlı iletişim'].map((item, i) => (
              <Grid item xs={12} sm={6} md={3} key={i}>
                <Box sx={{ p: 3, borderRadius: 3, textAlign: 'center', bgcolor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', height: '100%', transition: 'all 0.3s', '&:hover': { bgcolor: 'rgba(59,130,246,0.06)', borderColor: 'rgba(59,130,246,0.2)', transform: 'translateY(-4px)' } }}>
                  <CheckCircleIcon sx={{ color: '#34D399', fontSize: 28, mb: 1.5 }} />
                  <Typography variant="body2" fontWeight={700} color="rgba(255,255,255,0.8)" sx={{ lineHeight: 1.6 }}>{item}</Typography>
                </Box>
              </Grid>
            ))}
          </Grid>

          <Box sx={{ borderRadius: 5, overflow: 'hidden', background: 'linear-gradient(135deg, rgba(59,130,246,0.15) 0%, rgba(139,92,246,0.12) 100%)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', py: { xs: 6, md: 8 }, position: 'relative' }}>
            <Box sx={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 30% 70%, rgba(59,130,246,0.2) 0%, transparent 60%)', pointerEvents: 'none' }} />
            <Box textAlign="center" sx={{ position: 'relative', zIndex: 1, p: 4 }}>
              <Typography variant="h2" fontWeight={900} color="white" sx={{ fontSize: { xs: '3rem', md: '5rem' }, lineHeight: 1 }}>360°</Typography>
              <Typography variant="h6" color="rgba(255,255,255,0.7)" fontWeight={600} mt={1} mb={3}>Dijital Çözümler</Typography>
              <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', justifyContent: 'center' }}>
                {['Web', 'Sosyal Medya', 'Reklam', 'Video', 'Grafik', 'SEO'].map(tag => (
                  <Chip key={tag} label={tag} sx={{ bgcolor: 'rgba(255,255,255,0.1)', color: 'white', fontWeight: 600, border: '1px solid rgba(255,255,255,0.15)', fontSize: '0.9rem', px: 1 }} />
                ))}
              </Box>
            </Box>
          </Box>
        </motion.div>
      </Container>

      {/* ===== 3. IMPACT STRIP ===== */}
      <Box sx={{ background: 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)', py: { xs: 6, md: 8 } }}>
        <Container maxWidth="lg">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp(0)}>
            <Grid container spacing={2} justifyContent="center" textAlign="center">
              {[{ num: '50+', label: 'Aktif Marka Ortağı' }, { num: '300+', label: 'Hayata Geçen Proje' }, { num: '5M+', label: 'Organik Erişim' }, { num: '%98', label: 'Müşteri Memnuniyeti' }, { num: '5+', label: 'Yıllık Deneyim' }].map((item, i) => (
                <Grid item xs={6} sm={4} md={2.4} key={i}>
                  <Typography variant="h3" fontWeight={900} color="white" sx={{ fontSize: { xs: '2rem', md: '2.5rem' } }}>{item.num}</Typography>
                  <Typography variant="body2" color="rgba(255,255,255,0.75)" fontWeight={500} sx={{ mt: 0.5 }}>{item.label}</Typography>
                </Grid>
              ))}
            </Grid>
          </motion.div>
        </Container>
      </Box>

      {/* ===== 4. VISION & MISSION ===== */}
      <Container maxWidth="lg" sx={{ py: { xs: 10, md: 14 } }}>
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp(0)}>
          <Box textAlign="center" mb={8}>
            <Typography variant="h2" fontWeight={900} sx={{ mb: 2, fontSize: { xs: '2.2rem', md: '3.5rem' } }}>Yönümüzü Belirleyen Pusula</Typography>
            <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.5)', maxWidth: 560, mx: 'auto', fontSize: '1.05rem' }}>Her kararımızın arkasında net bir vizyon ve güçlü bir misyon var.</Typography>
          </Box>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Box sx={{ p: { xs: 5, md: 7 }, borderRadius: 5, height: '100%', background: 'linear-gradient(135deg, rgba(59,130,246,0.12) 0%, rgba(139,92,246,0.08) 100%)', border: '1px solid rgba(59,130,246,0.2)', position: 'relative', overflow: 'hidden' }}>
                <Box sx={{ position: 'absolute', top: -40, right: -40, opacity: 0.04 }}><PublicIcon sx={{ fontSize: 200, color: '#fff' }} /></Box>
                <Box sx={{ position: 'relative', zIndex: 1 }}>
                  <Box sx={{ width: 56, height: 56, borderRadius: 3, bgcolor: 'rgba(59,130,246,0.2)', border: '1px solid rgba(59,130,246,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3 }}>
                    <PublicIcon sx={{ color: '#60A5FA', fontSize: 28 }} />
                  </Box>
                  <Typography variant="overline" sx={{ color: '#60A5FA', fontWeight: 800, letterSpacing: 2 }}>VİZYONUMUZ</Typography>
                  <Typography variant="h4" fontWeight={900} color="white" sx={{ my: 2, lineHeight: 1.2 }}>Sınırları Zorlayan<br />Bir Ajans</Typography>
                  <Typography variant="body1" color="rgba(255,255,255,0.6)" lineHeight={1.9} sx={{ fontSize: '1.02rem' }}>
                    Teknolojinin hızına ayak uydurmak değil, ona yön vermek için buradayız. Yerel değerleri global standartlarla buluşturan, sürdürülebilir ve yenilikçi dijital ekosistemler kurarak markamızı ve ortaklarımızı geleceğe taşıyoruz.
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ p: { xs: 5, md: 7 }, borderRadius: 5, height: '100%', background: 'linear-gradient(135deg, rgba(139,92,246,0.12) 0%, rgba(59,130,246,0.08) 100%)', border: '1px solid rgba(139,92,246,0.2)', position: 'relative', overflow: 'hidden' }}>
                <Box sx={{ position: 'absolute', top: -40, right: -40, opacity: 0.04 }}><LightbulbIcon sx={{ fontSize: 200, color: '#fff' }} /></Box>
                <Box sx={{ position: 'relative', zIndex: 1 }}>
                  <Box sx={{ width: 56, height: 56, borderRadius: 3, bgcolor: 'rgba(139,92,246,0.2)', border: '1px solid rgba(139,92,246,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3 }}>
                    <LightbulbIcon sx={{ color: '#A78BFA', fontSize: 28 }} />
                  </Box>
                  <Typography variant="overline" sx={{ color: '#A78BFA', fontWeight: 800, letterSpacing: 2 }}>MİSYONUMUZ</Typography>
                  <Typography variant="h4" fontWeight={900} color="white" sx={{ my: 2, lineHeight: 1.2 }}>Gerçek Değer<br />Yaratmak</Typography>
                  <Typography variant="body1" color="rgba(255,255,255,0.6)" lineHeight={1.9} sx={{ fontSize: '1.02rem' }}>
                    Her pikselde estetik, her stratejide başarı ve her teslimatta kusursuzluk hedefliyoruz. Müşterilerimizin büyüme hikayesinin başrolünde yer alarak ölçülebilir, somut ve kalıcı değer katıyoruz.
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </motion.div>
      </Container>

      {/* ===== 5. VALUES ===== */}
      <Box sx={{ py: { xs: 10, md: 14 }, bgcolor: 'rgba(255,255,255,0.02)', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <Container maxWidth="lg">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp(0)}>
            <Box textAlign="center" mb={8}>
              <Typography variant="h2" fontWeight={900} sx={{ mb: 2, fontSize: { xs: '2.2rem', md: '3.5rem' } }}>DNA'mızdaki Değerler</Typography>
              <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.5)', maxWidth: 540, mx: 'auto', fontSize: '1.05rem' }}>Bizi sıradan bir ajanstan ayıran çalışma prensiplerimiz.</Typography>
            </Box>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)', md: 'repeat(6, 1fr)' }, gap: 2 }}>
              {values.map((item, i) => (
                <Box key={i} sx={{ aspectRatio: '1/1', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', p: 2.5, borderRadius: 4, bgcolor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', boxSizing: 'border-box', transition: 'all 0.3s', '&:hover': { transform: 'translateY(-6px)', boxShadow: `0 12px 32px ${item.color}25`, borderColor: `${item.color}40`, bgcolor: `${item.color}08` } }}>
                  <Box sx={{ p: 1.5, borderRadius: '50%', bgcolor: `${item.color}15`, mb: 1.5, display: 'inline-flex', border: `1px solid ${item.color}25` }}>
                    {React.cloneElement(item.icon, { sx: { fontSize: 24, color: item.color } })}
                  </Box>
                  <Typography variant="subtitle2" fontWeight={800} color="white" sx={{ mb: 0.8, lineHeight: 1.2 }}>{item.title}</Typography>
                  <Typography variant="caption" color="rgba(255,255,255,0.45)" sx={{ lineHeight: 1.6 }}>{item.desc}</Typography>
                </Box>
              ))}
            </Box>
          </motion.div>
        </Container>
      </Box>

      {/* ===== 6. SERVICES ===== */}
      <Container maxWidth="lg" sx={{ py: { xs: 10, md: 14 } }}>
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp(0)}>
          <Box textAlign="center" mb={8}>
            <Box sx={{ display: 'inline-flex', alignItems: 'center', px: 2, py: 0.6, mb: 3, borderRadius: '50px', bgcolor: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)' }}>
              <Typography variant="caption" sx={{ color: '#60A5FA', fontWeight: 700, letterSpacing: 1.5 }}>HİZMETLERİMİZ</Typography>
            </Box>
            <Typography variant="h2" fontWeight={900} sx={{ mb: 2, lineHeight: 1.15, fontSize: { xs: '2.2rem', md: '3.5rem' } }}>
              Tek Çatı Altında<br />
              <span style={{ background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Tam Dijital Hizmet</span>
            </Typography>
            <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.5)', maxWidth: 580, mx: 'auto', fontSize: '1.05rem' }}>
              Markanızın ihtiyaç duyduğu her dijital hizmet koordineli ve entegre şekilde yönetilir.
            </Typography>
          </Box>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 3, mb: 6 }}>
            {services.map((s, i) => (
              <Box key={i} sx={{ p: 3.5, borderRadius: 3, display: 'flex', alignItems: 'center', gap: 2, bgcolor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', transition: 'all 0.3s', '&:hover': { bgcolor: 'rgba(59,130,246,0.07)', borderColor: 'rgba(59,130,246,0.25)', transform: 'translateY(-4px)', boxShadow: '0 12px 30px rgba(59,130,246,0.12)' } }}>
                <Box sx={{ width: 52, height: 52, borderRadius: 3, bgcolor: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {React.cloneElement(s.icon, { sx: { color: '#60A5FA', fontSize: 24 } })}
                </Box>
                <Typography variant="body1" fontWeight={700} color="rgba(255,255,255,0.85)">{s.label}</Typography>
              </Box>
            ))}
          </Box>
          <Box textAlign="center">
            <Button component={Link} to="/services" variant="outlined" endIcon={<ArrowForwardIcon />}
              sx={{ borderColor: 'rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.7)', borderRadius: '50px', px: 5, py: 1.4, fontWeight: 700, '&:hover': { borderColor: BLUE, color: '#fff', bgcolor: 'rgba(59,130,246,0.08)' }, transition: 'all 0.3s' }}>
              Tüm Hizmetleri Gör
            </Button>
          </Box>
        </motion.div>
      </Container>

      {/* ===== 7. PROCESS ===== */}
      <Box sx={{ py: { xs: 10, md: 14 }, bgcolor: 'rgba(255,255,255,0.02)', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <Container maxWidth="lg">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp(0)}>
            <Box textAlign="center" mb={8}>
              <Typography variant="overline" sx={{ color: '#60A5FA', fontWeight: 800, letterSpacing: 2 }}>ÇALIŞMA SÜRECİMİZ</Typography>
              <Typography variant="h2" fontWeight={900} sx={{ mt: 1, mb: 2, fontSize: { xs: '2.2rem', md: '3.5rem' } }}>Nasıl Çalışıyoruz?</Typography>
              <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.5)', maxWidth: 540, mx: 'auto' }}>Her projede aynı özenli süreç. Markanızı tanımaktan büyümeyi ölçmeye kadar her adımda yanınızdayız.</Typography>
            </Box>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 3 }}>
              {process.map((step, i) => (
                <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp(i * 0.08)} style={{ display: 'flex', flexDirection: 'column' }}>
                  <Box sx={{ p: 4, borderRadius: 4, flex: 1, bgcolor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderTop: `3px solid ${step.color}`, transition: 'all 0.3s', '&:hover': { bgcolor: 'rgba(255,255,255,0.07)', transform: 'translateY(-6px)' } }}>
                    <Typography variant="h2" fontWeight={900} sx={{ color: `${step.color}20`, lineHeight: 1, mb: 2, fontSize: '3.5rem' }}>{step.id}</Typography>
                    <Typography variant="h6" fontWeight={800} color="white" sx={{ mb: 2 }}>{step.title}</Typography>
                    <Typography variant="body2" color="rgba(255,255,255,0.5)" lineHeight={1.8}>{step.desc}</Typography>
                  </Box>
                </motion.div>
              ))}
            </Box>
          </motion.div>
        </Container>
      </Box>

      {/* ===== 8. WHY US ===== */}
      <Container maxWidth="lg" sx={{ py: { xs: 10, md: 14 } }}>
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp(0)}>
          <Box textAlign="center" mb={8}>
            <Typography variant="h2" fontWeight={900} sx={{ mb: 2, fontSize: { xs: '2.2rem', md: '3.5rem' } }}>Neden Kıyı Medya?</Typography>
            <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.5)', maxWidth: 540, mx: 'auto' }}>Yüzlerce işletme neden bizi tercih ediyor?</Typography>
          </Box>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 3 }}>
            {[
              { title: 'Bütünleşik Yaklaşım', desc: 'Web, sosyal medya, reklam, tasarım ve prodüksiyon — hepsi tek ekip, tek strateji altında koordineli.', icon: <GroupsIcon />, color: BLUE },
              { title: 'Sektöre Özel Uzmanlık', desc: 'Her sektörün dinamikleri farklıdır. Size özel içerik, dil ve strateji geliştiriyoruz.', icon: <PsychologyIcon />, color: PURPLE },
              { title: 'Şeffaf Raporlama', desc: 'Aylık performans raporları ile her kuruşunuzun nereye gittiğini bilirsiniz.', icon: <TrendingUpIcon />, color: '#10B981' },
              { title: 'Hızlı Teslimat', desc: 'Söz verdiğimiz takvime yüzde yüz sadık kalıyoruz.', icon: <BoltIcon />, color: '#F59E0B' },
              { title: 'Yaratıcı Mükemmellik', desc: 'Her tasarım, her video, her içerik özenle hazırlanır.', icon: <AutoAwesomeIcon />, color: '#EF4444' },
              { title: 'Sürekli Destek', desc: 'Proje bitmez, ilişki başlar. Her zaman erişilebilir bir ekip.', icon: <CheckCircleIcon />, color: '#06B6D4' },
            ].map((item, i) => (
              <Box key={i} sx={{ p: 4, borderRadius: 4, bgcolor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', transition: 'all 0.3s', '&:hover': { transform: 'translateY(-6px)', boxShadow: `0 16px 40px ${item.color}18`, borderColor: `${item.color}30`, bgcolor: `${item.color}06` } }}>
                <Box sx={{ width: 52, height: 52, borderRadius: 3, bgcolor: `${item.color}15`, border: `1px solid ${item.color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3 }}>
                  {React.cloneElement(item.icon, { sx: { color: item.color, fontSize: 26 } })}
                </Box>
                <Typography variant="h6" fontWeight={800} color="white" sx={{ mb: 1.5 }}>{item.title}</Typography>
                <Typography variant="body2" color="rgba(255,255,255,0.5)" lineHeight={1.8}>{item.desc}</Typography>
              </Box>
            ))}
          </Box>
        </motion.div>
      </Container>

      {/* ===== 9. MEGA CTA ===== */}
      <Box sx={{ py: { xs: 10, md: 14 }, position: 'relative', overflow: 'hidden' }}>
        <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(59,130,246,0.15) 0%, rgba(139,92,246,0.15) 100%)' }} />
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 700, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(59,130,246,0.2) 0%, transparent 70%)', filter: 'blur(80px)', pointerEvents: 'none' }} />
        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp(0)}>
            <Box sx={{ display: 'inline-flex', alignItems: 'center', px: 2.5, py: 0.8, mb: 4, borderRadius: '50px', bgcolor: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)' }}>
              <AutoAwesomeIcon sx={{ color: '#FCD34D', fontSize: 15, mr: 1 }} />
              <Typography variant="caption" sx={{ color: '#FCD34D', fontWeight: 700, letterSpacing: 1.5 }}>ÜCRETSİZ STRATEJİ GÖRÜŞMESİ</Typography>
            </Box>
            <Typography variant="h2" fontWeight={900} color="white" sx={{ mb: 3, fontSize: { xs: '2.2rem', md: '4rem' }, lineHeight: 1.1 }}>
              Markanızın Dijital<br />
              <span style={{ background: 'linear-gradient(90deg, #60A5FA, #A78BFA)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Dönüşümüne Başlayın</span>
            </Typography>
            <Typography variant="body1" color="rgba(255,255,255,0.6)" sx={{ mb: 6, maxWidth: 540, mx: 'auto', fontSize: '1.1rem', lineHeight: 1.9 }}>
              30 dakikalık ücretsiz strateji görüşmesiyle markanız için neler yapabileceğimizi konuşalım.
            </Typography>
            <Box display="flex" gap={2} justifyContent="center" flexWrap="wrap" mb={5}>
              <Button component={Link} to="/contact" variant="contained" endIcon={<ArrowForwardIcon />}
                sx={{ background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)', color: '#fff', borderRadius: '50px', px: 5, py: 1.8, fontWeight: 700, fontSize: '1.05rem', boxShadow: '0 12px 40px rgba(59,130,246,0.5)', '&:hover': { opacity: 0.9, transform: 'translateY(-2px)' }, transition: 'all 0.3s' }}>
                Ücretsiz Görüşme Al
              </Button>
              <Button component={Link} to="/portfolio" variant="outlined"
                sx={{ borderColor: 'rgba(255,255,255,0.25)', color: 'white', borderRadius: '50px', px: 5, py: 1.8, fontWeight: 600, fontSize: '1.05rem', '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.08)' } }}>
                Çalışmalarımızı Gör
              </Button>
            </Box>
            <Box display="flex" justifyContent="center" gap={4} flexWrap="wrap">
              <Box display="flex" alignItems="center" gap={1}>
                <PhoneIcon sx={{ color: '#60A5FA', fontSize: 18 }} />
                <Typography variant="body2" color="rgba(255,255,255,0.6)">+90 553 174 82 04</Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={1}>
                <EmailIcon sx={{ color: '#60A5FA', fontSize: 18 }} />
                <Typography variant="body2" color="rgba(255,255,255,0.6)">info@kiyimedya.com</Typography>
              </Box>
            </Box>
          </motion.div>
        </Container>
      </Box>
    </Box>
  );
};

export default About;
