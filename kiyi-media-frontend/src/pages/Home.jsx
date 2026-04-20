// src/pages/Home.jsx
import React, { useEffect, useState } from 'react';
import { SERVER_URL } from '../config';
import { Box, Container, Typography, Button, Grid, Accordion, AccordionSummary, AccordionDetails, useMediaQuery, useTheme, Chip } from '@mui/material';
import { Link } from 'react-router-dom';
import axios from 'axios';
import SEO from '../components/SEO';
import Slider from "react-slick";
import { motion } from "framer-motion";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import StarIcon from '@mui/icons-material/Star';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import GroupsIcon from '@mui/icons-material/Groups';
import BoltIcon from '@mui/icons-material/Bolt';
import LanguageIcon from '@mui/icons-material/Language';
import CampaignIcon from '@mui/icons-material/Campaign';
import BrushIcon from '@mui/icons-material/Brush';
import VideocamIcon from '@mui/icons-material/Videocam';
import SearchIcon from '@mui/icons-material/Search';
import DevicesIcon from '@mui/icons-material/Devices';
import PhoneIcon from '@mui/icons-material/Phone';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import PsychologyIcon from '@mui/icons-material/Psychology';
import DiamondIcon from '@mui/icons-material/Diamond';

const getOptimizedImage = (url) => {
  if (!url) return '';
  if (url.includes('cloudinary.com')) return url.replace('/upload/', `/upload/w_800,q_80,f_auto/`);
  return url.startsWith('http') ? url : `${SERVER_URL}${url}`;
};

const fadeUp = (delay = 0) => ({
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, delay, ease: 'easeOut' } }
});

const Home = ({ onlineUsers }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [brands, setBrands] = useState([]);
  const [featuredProjects, setFeaturedProjects] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!sessionStorage.getItem('visited')) {
          await axios.post(`${SERVER_URL}/api/analytics/visit`);
          sessionStorage.setItem('visited', 'true');
        }
        const res = await axios.get(`${SERVER_URL}/api/portfolio?featured=true`);
        if (res.data.success) {
          setBrands(res.data.data.map(i => getOptimizedImage(i.logo || i.portray)));
          setFeaturedProjects(res.data.data);
        }
      } catch (e) {}
    };
    fetchData();
  }, []);

  const BLUE = '#3B82F6';
  const PURPLE = '#8B5CF6';

  const services = [
    { icon: <LanguageIcon />, title: 'Web Tasarım & Yazılım', desc: 'Hızlı, modern ve dönüştüren web siteleri.', color: '#3B82F6' },
    { icon: <CampaignIcon />, title: 'Sosyal Medya', desc: 'Topluluk büyüten içerik stratejileri.', color: '#8B5CF6' },
    { icon: <TrendingUpIcon />, title: 'Dijital Reklam', desc: 'Meta & Google reklamlarıyla büyüme.', color: '#10B981' },
    { icon: <VideocamIcon />, title: 'Video Prodüksiyon', desc: 'Markanızı anlatan etkileyici videolar.', color: '#F59E0B' },
    { icon: <BrushIcon />, title: 'Grafik Tasarım', desc: 'Hafızada kalan görsel kimlikler.', color: '#EF4444' },
    { icon: <SearchIcon />, title: 'SEO & Strateji', desc: "Google'da üst sıralarda yer alın.", color: '#06B6D4' },
  ];

  const whyUs = [
    { icon: <GroupsIcon />, title: 'Bütünleşik Yaklaşım', desc: 'Tüm kanallar tek strateji altında koordineli.', color: '#3B82F6' },
    { icon: <PsychologyIcon />, title: 'Sektöre Özel Uzmanlık', desc: 'Jenerik değil, size özel içerik ve strateji.', color: '#8B5CF6' },
    { icon: <TrendingUpIcon />, title: 'Şeffaf Raporlama', desc: 'Her kuruşunuzun nereye gittiğini bilirsiniz.', color: '#10B981' },
    { icon: <BoltIcon />, title: 'Hızlı Teslimat', desc: 'Söz verilen tarihe yüzde yüz uyum.', color: '#F59E0B' },
    { icon: <DiamondIcon />, title: 'Yaratıcı Mükemmellik', desc: 'Her detayda premium kalite standardı.', color: '#EF4444' },
    { icon: <WorkspacePremiumIcon />, title: 'Sürekli Destek', desc: 'Proje bitmez, ilişki başlar.', color: '#06B6D4' },
  ];

  const process = [
    { id: '01', title: 'Keşif & Analiz', desc: 'Markanızı, rakiplerinizi ve hedef kitlenizi derinlemesine tanıyoruz.', color: BLUE },
    { id: '02', title: 'Strateji & Konsept', desc: 'Veriye dayalı özgün strateji ve yaratıcı konseptler geliştiriyoruz.', color: PURPLE },
    { id: '03', title: 'Üretim & Yayın', desc: 'İçerik, tasarım ve kampanyaları planlı takvimde hayata geçiriyoruz.', color: '#10B981' },
    { id: '04', title: 'Ölçüm & Büyüme', desc: 'Performansı raporluyor, optimize ederek büyümeyi sürdürüyoruz.', color: '#F59E0B' },
  ];

  const faqs = [
    { q: 'Hangi hizmetleri sunuyorsunuz?', a: 'Web tasarım, sosyal medya yönetimi, dijital reklam (Meta & Google), video prodüksiyon, grafik tasarım ve SEO hizmetleri sunuyoruz. Tüm hizmetler entegre ve koordineli biçimde yönetilir.' },
    { q: 'Fiyatlarınız nasıl belirleniyor?', a: 'Her marka ve proje birbirinden farklıdır. İhtiyaçlarınızı dinledikten sonra size özel paket ve fiyat teklifi hazırlıyoruz. Ücretsiz keşif görüşmesi için bize ulaşın.' },
    { q: 'Çalışma süreciniz nasıl işliyor?', a: 'Keşif → Strateji → Üretim → Yayın → Ölçüm döngüsüyle çalışıyoruz. Her aşamada sizi bilgilendiriyor, onaylarınızı alıyoruz.' },
    { q: 'Anlaşma sonrası destek veriyor musunuz?', a: 'Evet. Proje tesliminin ardından teknik destek ve optimizasyon süreçlerini de yönetiyoruz. Uzun vadeli iş ortaklığı anlayışıyla hareket ediyoruz.' },
    { q: 'Ne kadar sürede sonuç alabilirim?', a: 'Sosyal medya ve reklam kampanyalarında ilk sonuçlar 2-4 haftada görülür. SEO ve organik büyüme 3-6 ay sürecinde olgunlaşır. Her projede gerçekçi zaman çizelgeleri paylaşırız.' },
    { q: 'Sözleşme süresi ne kadar?', a: 'Çoğu hizmetimiz aylık esasla çalışır, uzun dönemli taahhüt zorunluluğu yoktur. Ancak SEO ve marka büyümesi gibi stratejik hizmetlerde en az 3 aylık süreç öneriyoruz; çünkü kalıcı sonuçlar zaman ister.' },
    { q: 'Sosyal medya hesaplarımı yönetir misiniz?', a: 'Evet. Instagram, Facebook, TikTok, LinkedIn ve diğer platformlarda içerik takvimi oluşturma, tasarım, paylaşım ve etkileşim yönetimini eksiksiz üstleniyoruz.' },
    { q: 'Reklam bütçemi siz mi belirlersiniz?', a: 'Reklam bütçesi size aittir ve sizin onayınızla belirlenir. Biz hedeflerinize göre en verimli bütçe dağılımını öneriyor, kampanyaları yönetiyor ve düzenli performans raporu sunuyoruz.' },
    { q: 'Web sitesi teslimattan sonra güncelleme yapabilir miyim?', a: 'Evet. Teslim edilen her web sitesi için yönetim paneli erişimi sağlıyoruz. İçerik, görsel ve sayfa güncellemelerini kendiniz yapabilir ya da bize bırakabilirsiniz.' },
    { q: 'Başka bir ajansla çalışıyorum, geçiş yapmak zor mu?', a: 'Hayır. Mevcut hesaplarınız, alan adınız ve içerikleriniz tamamen size ait. Geçiş sürecini planlı ve kesintisiz biçimde yönetiyor, eski ajansla koordinasyonu biz üstleniyoruz.' },
    { q: 'Küçük işletmeler için uygun paketleriniz var mı?', a: 'Kesinlikle. Küçük ve orta ölçekli işletmelere özel esnek paketlerimiz mevcut. Bütçenize ve hedeflerinize göre en uygun başlangıç noktasını birlikte belirleriz.' },
    { q: 'Raporlama nasıl yapılıyor?', a: 'Her ay düzenli performans raporu hazırlıyoruz. Raporlarda reklam harcaması, erişim, etkileşim, dönüşüm ve büyüme verileri yer alır. Dilediğinizde ara raporlar da talep edebilirsiniz.' },
  ];

  const sliderSettings = {
    dots: false, infinite: true, speed: 4000,
    slidesToShow: isMobile ? 3 : 6,
    slidesToScroll: 1, autoplay: true,
    autoplaySpeed: 0, cssEase: 'linear',
    pauseOnHover: false, arrows: false,
  };

  return (
    <Box sx={{ overflowX: 'hidden', minHeight: '100vh', bgcolor: '#060C1A', color: '#fff' }}>
      <SEO title="Kıyı Medya | 360° Dijital Ajans" description="Web tasarım, sosyal medya, dijital reklam ve prodüksiyon." />

      {/* ===== 1. HERO ===== */}
      <Box sx={{ position: 'relative', overflow: 'hidden', pt: { xs: 14, md: 20 }, pb: { xs: 10, md: 16 }, minHeight: { md: '100vh' }, display: 'flex', alignItems: 'center' }}>
        <Box sx={{ position: 'absolute', top: '10%', right: '-10%', width: 700, height: 700, borderRadius: '50%', background: 'radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)', filter: 'blur(80px)', pointerEvents: 'none' }} />
        <Box sx={{ position: 'absolute', bottom: '10%', left: '-10%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)', filter: 'blur(80px)', pointerEvents: 'none' }} />
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <motion.div initial="hidden" animate="visible" variants={fadeUp(0)}>
            <Box sx={{ display: 'inline-flex', alignItems: 'center', px: 2.5, py: 0.8, mb: 4, borderRadius: '50px', bgcolor: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.25)' }}>
              <AutoAwesomeIcon sx={{ color: '#60A5FA', fontSize: 15, mr: 1 }} />
              <Typography variant="caption" sx={{ color: '#60A5FA', fontWeight: 700, letterSpacing: 1.5 }}>360° DİJİTAL AJANS · SAMSUN</Typography>
            </Box>
          </motion.div>

          <motion.div initial="hidden" animate="visible" variants={fadeUp(0.1)}>
            <Typography variant="h1" sx={{ fontSize: { xs: '2.8rem', md: '5.5rem', lg: '6.5rem' }, fontWeight: 900, lineHeight: 1.05, letterSpacing: '-0.03em', mb: 3 }}>
              Markanızı<br />
              <span style={{ background: 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Dijitalde Zirveye
              </span><br />
              Taşıyoruz
            </Typography>
          </motion.div>

          <motion.div initial="hidden" animate="visible" variants={fadeUp(0.2)}>
            <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.6)', fontSize: { xs: '1rem', md: '1.25rem' }, lineHeight: 1.9, maxWidth: 640, mx: 'auto', mb: 5 }}>
              Web'den sosyal medyaya, reklamdan prodüksiyona — tek çatı altında tam dijital hizmet.
              Yaratıcılığı stratejiyle, teknolojiyi sanatla buluşturuyoruz.
            </Typography>
          </motion.div>

          <motion.div initial="hidden" animate="visible" variants={fadeUp(0.3)}>
            <Box display="flex" gap={2} justifyContent="center" flexWrap="wrap" mb={10}>
              <Button component={Link} to="/contact" variant="contained" endIcon={<ArrowForwardIcon />}
                sx={{ background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)', color: '#fff', borderRadius: '50px', px: 4, py: 1.6, fontWeight: 700, fontSize: '1rem', boxShadow: '0 8px 32px rgba(59,130,246,0.4)', '&:hover': { opacity: 0.9, transform: 'translateY(-2px)', boxShadow: '0 12px 40px rgba(59,130,246,0.5)' }, transition: 'all 0.3s' }}>
                Ücretsiz Görüşme Al
              </Button>
              <Button component={Link} to="/portfolio" variant="outlined"
                sx={{ borderColor: 'rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.8)', borderRadius: '50px', px: 4, py: 1.6, fontWeight: 600, fontSize: '1rem', '&:hover': { borderColor: '#3B82F6', color: '#fff', bgcolor: 'rgba(59,130,246,0.08)' }, transition: 'all 0.3s' }}>
                Portföyü Gör
              </Button>
            </Box>
          </motion.div>

          {/* Stats */}
          <motion.div initial="hidden" animate="visible" variants={fadeUp(0.4)}>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(4, 1fr)' }, gap: { xs: 4, md: 2 } }}>
              {[
                { num: '50+', label: 'Mutlu Marka', color: '#3B82F6' },
                { num: '300+', label: 'Proje', color: '#8B5CF6' },
                { num: '%98', label: 'Memnuniyet', color: '#10B981' },
                { num: '5+', label: 'Yıl Deneyim', color: '#F59E0B' },
              ].map((s, i) => (
                <Box key={i} sx={{ textAlign: 'center' }}>
                  <Typography fontWeight={900} sx={{ fontSize: { xs: '2.8rem', md: '3.5rem' }, lineHeight: 1, color: s.color, mb: 0.5 }}>{s.num}</Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.4)', fontWeight: 500 }}>{s.label}</Typography>
                </Box>
              ))}
            </Box>
          </motion.div>
        </Container>
      </Box>

      {/* ===== 2. BRAND SLIDER ===== */}
      {brands.length > 0 && (
        <Box sx={{ py: 4, borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)', bgcolor: 'rgba(255,255,255,0.02)', overflow: 'hidden' }}>
          <Container maxWidth="lg" sx={{ mb: 2, textAlign: 'center' }}>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.3)', letterSpacing: 3, fontWeight: 700 }}>ÇALIŞTIĞIMIZ MARKALAR</Typography>
          </Container>
          <Slider {...sliderSettings}>
            {[...brands, ...brands].map((src, i) => (
              <Box key={i} sx={{ px: 3, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Box component="img" src={src} alt="Brand" sx={{ height: 40, objectFit: 'contain', opacity: 0.35, filter: 'brightness(0) invert(1)', transition: '0.3s', '&:hover': { opacity: 0.8 } }} onError={(e) => { e.target.style.display = 'none'; }} />
              </Box>
            ))}
          </Slider>
        </Box>
      )}

      {/* ===== 3. SERVICES ===== */}
      <Container maxWidth="lg" sx={{ py: { xs: 10, md: 16 } }}>
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp(0)}>
          <Box textAlign="center" mb={8}>
            <Box sx={{ display: 'inline-flex', alignItems: 'center', px: 2.5, py: 0.8, mb: 3, borderRadius: '50px', bgcolor: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.2)' }}>
              <Typography variant="caption" sx={{ color: '#60A5FA', fontWeight: 700, letterSpacing: 1.5 }}>HİZMETLERİMİZ</Typography>
            </Box>
            <Typography variant="h2" fontWeight={900} sx={{ mb: 2, fontSize: { xs: '2.2rem', md: '3.5rem' } }}>
              Tüm Dijital İhtiyaçlarınız<br />
              <span style={{ background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Tek Çatı Altında</span>
            </Typography>
            <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.5)', maxWidth: 580, mx: 'auto', fontSize: '1.05rem' }}>
              Tek partner, entegre strateji, ölçülebilir sonuçlar.
            </Typography>
          </Box>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 3 }}>
            {services.map((s, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp(i * 0.08)} style={{ display: 'flex', flexDirection: 'column' }}>
                <Box sx={{
                  p: 4, borderRadius: 4, flex: 1,
                  bgcolor: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.07)',
                  borderTop: `3px solid ${s.color}`,
                  transition: 'all 0.3s',
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.07)', transform: 'translateY(-6px)', boxShadow: `0 20px 50px ${s.color}22` }
                }}>
                  <Box sx={{ width: 54, height: 54, borderRadius: 3, bgcolor: `${s.color}18`, border: `1px solid ${s.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3 }}>
                    {React.cloneElement(s.icon, { sx: { color: s.color, fontSize: 26 } })}
                  </Box>
                  <Typography variant="h6" fontWeight={800} color="white" sx={{ mb: 1.5 }}>{s.title}</Typography>
                  <Typography variant="body2" color="rgba(255,255,255,0.5)" sx={{ lineHeight: 1.8 }}>{s.desc}</Typography>
                </Box>
              </motion.div>
            ))}
          </Box>
          <Box textAlign="center" mt={6}>
            <Button component={Link} to="/services" variant="outlined" endIcon={<ArrowForwardIcon />}
              sx={{ borderColor: 'rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.7)', borderRadius: '50px', px: 4, py: 1.3, fontWeight: 600, '&:hover': { borderColor: BLUE, color: '#fff', bgcolor: 'rgba(59,130,246,0.08)' }, transition: 'all 0.3s' }}>
              Tüm Hizmetleri Keşfet
            </Button>
          </Box>
        </motion.div>
      </Container>

      {/* ===== 4. FEATURED PROJECTS ===== */}
      {featuredProjects.length > 0 && (
        <Box sx={{ py: { xs: 10, md: 16 }, bgcolor: 'rgba(255,255,255,0.02)', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <Container maxWidth="lg">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp(0)}>
              <Box textAlign="center" mb={8}>
                <Box sx={{ display: 'inline-flex', alignItems: 'center', px: 2.5, py: 0.8, mb: 3, borderRadius: '50px', bgcolor: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.2)' }}>
                  <Typography variant="caption" sx={{ color: '#A78BFA', fontWeight: 700, letterSpacing: 1.5 }}>PORTFÖY</Typography>
                </Box>
                <Typography variant="h2" fontWeight={900} sx={{ mb: 2, fontSize: { xs: '2.2rem', md: '3.5rem' } }}>
                  İlham Veren<br />
                  <span style={{ background: 'linear-gradient(135deg, #8B5CF6, #3B82F6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Başarı Hikayeleri</span>
                </Typography>
              </Box>
              <Grid container spacing={3}>
                {featuredProjects.slice(0, 6).map((p, i) => (
                  <Grid item xs={12} sm={6} md={4} key={p._id || i}>
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp(i * 0.08)}>
                      <Box sx={{
                        borderRadius: 4, overflow: 'hidden', position: 'relative',
                        aspectRatio: '4/3',
                        bgcolor: 'rgba(255,255,255,0.04)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        cursor: 'pointer',
                        '&:hover .overlay': { opacity: 1 },
                        '&:hover img': { transform: 'scale(1.07)' },
                      }}>
                        <Box component="img" src={getOptimizedImage(p.portray || p.logo)} alt={p.title}
                          sx={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.6s ease' }}
                          onError={(e) => { e.target.src = 'https://placehold.co/400x300/0D1628/3B82F6?text=Proje'; }}
                        />
                        <Box className="overlay" sx={{
                          position: 'absolute', inset: 0, opacity: 0,
                          background: 'linear-gradient(180deg, transparent 30%, rgba(6,12,26,0.95) 100%)',
                          transition: 'opacity 0.4s ease',
                          display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', p: 3
                        }}>
                          <Typography variant="h6" fontWeight={800} color="white" gutterBottom>{p.title}</Typography>
                          {p.category && (
                            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                              {(Array.isArray(p.category) ? p.category : p.category.split(',')).slice(0, 2).map((c, ci) => (
                                <Chip key={ci} label={c.trim()} size="small" sx={{ bgcolor: 'rgba(59,130,246,0.3)', color: 'white', fontSize: '0.7rem', fontWeight: 600, border: '1px solid rgba(59,130,246,0.4)' }} />
                              ))}
                            </Box>
                          )}
                        </Box>
                      </Box>
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
              <Box textAlign="center" mt={6}>
                <Button component={Link} to="/portfolio" variant="outlined" endIcon={<ArrowForwardIcon />}
                  sx={{ borderColor: 'rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.7)', borderRadius: '50px', px: 4, py: 1.3, fontWeight: 600, '&:hover': { borderColor: PURPLE, color: '#fff', bgcolor: 'rgba(139,92,246,0.08)' }, transition: 'all 0.3s' }}>
                  Tüm Projeleri Gör
                </Button>
              </Box>
            </motion.div>
          </Container>
        </Box>
      )}

      {/* ===== 5. WHY US ===== */}
      <Container maxWidth="lg" sx={{ py: { xs: 10, md: 16 } }}>
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp(0)}>
          <Box textAlign="center" mb={8}>
            <Box sx={{ display: 'inline-flex', alignItems: 'center', px: 2.5, py: 0.8, mb: 3, borderRadius: '50px', bgcolor: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)' }}>
              <Typography variant="caption" sx={{ color: '#34D399', fontWeight: 700, letterSpacing: 1.5 }}>NEDEN KIYI MEDYA</Typography>
            </Box>
            <Typography variant="h2" fontWeight={900} sx={{ mb: 2, fontSize: { xs: '2.2rem', md: '3.5rem' } }}>
              Farkı Yaratan<br />
              <span style={{ background: 'linear-gradient(135deg, #10B981, #3B82F6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>6 Güçlü Neden</span>
            </Typography>
          </Box>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 3 }}>
            {whyUs.map((item, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp(i * 0.08)} style={{ display: 'flex', flexDirection: 'column' }}>
                <Box sx={{
                  p: 4, borderRadius: 4, flex: 1,
                  bgcolor: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.07)',
                  transition: 'all 0.3s',
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.06)', transform: 'translateY(-5px)', boxShadow: `0 16px 40px ${item.color}18`, borderColor: `${item.color}30` }
                }}>
                  <Box sx={{ width: 52, height: 52, borderRadius: 3, bgcolor: `${item.color}15`, border: `1px solid ${item.color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3 }}>
                    {React.cloneElement(item.icon, { sx: { color: item.color, fontSize: 24 } })}
                  </Box>
                  <Typography variant="h6" fontWeight={800} color="white" sx={{ mb: 1.5 }}>{item.title}</Typography>
                  <Typography variant="body2" color="rgba(255,255,255,0.5)" sx={{ lineHeight: 1.8 }}>{item.desc}</Typography>
                </Box>
              </motion.div>
            ))}
          </Box>
        </motion.div>
      </Container>

      {/* ===== 6. PROCESS ===== */}
      <Box sx={{ py: { xs: 10, md: 16 }, bgcolor: 'rgba(255,255,255,0.02)', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)', position: 'relative', overflow: 'hidden' }}>
        <Box sx={{ position: 'absolute', top: '20%', right: '-5%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 70%)', filter: 'blur(60px)', pointerEvents: 'none' }} />
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp(0)}>
            <Box textAlign="center" mb={8}>
              <Box sx={{ display: 'inline-flex', alignItems: 'center', px: 2.5, py: 0.8, mb: 3, borderRadius: '50px', bgcolor: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.2)' }}>
                <Typography variant="caption" sx={{ color: '#60A5FA', fontWeight: 700, letterSpacing: 1.5 }}>ÇALIŞMA SÜRECİ</Typography>
              </Box>
              <Typography variant="h2" fontWeight={900} sx={{ mb: 2, fontSize: { xs: '2.2rem', md: '3.5rem' } }}>
                Nasıl<br />
                <span style={{ background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Çalışıyoruz?</span>
              </Typography>
            </Box>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 3 }}>
              {process.map((step, i) => (
                <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp(i * 0.1)} style={{ display: 'flex', flexDirection: 'column' }}>
                  <Box sx={{
                    p: 4, borderRadius: 4, flex: 1,
                    bgcolor: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.07)',
                    borderTop: `3px solid ${step.color}`,
                    transition: 'all 0.3s',
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.07)', transform: 'translateY(-5px)' }
                  }}>
                    <Typography variant="h2" fontWeight={900} sx={{ color: `${step.color}25`, lineHeight: 1, mb: 2, fontSize: '3.5rem' }}>{step.id}</Typography>
                    <Typography variant="h6" fontWeight={800} color="white" sx={{ mb: 1.5 }}>{step.title}</Typography>
                    <Typography variant="body2" color="rgba(255,255,255,0.5)" lineHeight={1.8}>{step.desc}</Typography>
                  </Box>
                </motion.div>
              ))}
            </Box>
          </motion.div>
        </Container>
      </Box>

      {/* ===== 7. FAQ ===== */}
      <Container maxWidth="md" sx={{ py: { xs: 10, md: 16 } }}>
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp(0)}>
          <Box textAlign="center" mb={8}>
            <Box sx={{ display: 'inline-flex', alignItems: 'center', px: 2.5, py: 0.8, mb: 3, borderRadius: '50px', bgcolor: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)' }}>
              <Typography variant="caption" sx={{ color: '#FCD34D', fontWeight: 700, letterSpacing: 1.5 }}>SIKÇA SORULANLAR</Typography>
            </Box>
            <Typography variant="h2" fontWeight={900} sx={{ mb: 2, fontSize: { xs: '2.2rem', md: '3.5rem' } }}>
              Aklınızdaki<br />
              <span style={{ background: 'linear-gradient(135deg, #F59E0B, #EF4444)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Sorular</span>
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {faqs.map((faq, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp(i * 0.07)}>
                <Accordion sx={{ bgcolor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px !important', boxShadow: 'none', '&:before': { display: 'none' }, '&.Mui-expanded': { bgcolor: 'rgba(59,130,246,0.06)', borderColor: 'rgba(59,130,246,0.2)' } }}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: '#60A5FA' }} />} sx={{ px: 3, py: 1 }}>
                    <Typography variant="body1" fontWeight={700} color="white">{faq.q}</Typography>
                  </AccordionSummary>
                  <AccordionDetails sx={{ px: 3, pb: 3 }}>
                    <Typography variant="body2" color="rgba(255,255,255,0.6)" lineHeight={1.9}>{faq.a}</Typography>
                  </AccordionDetails>
                </Accordion>
              </motion.div>
            ))}
          </Box>
        </motion.div>
      </Container>

      {/* ===== 8. CTA ===== */}
      <Box sx={{ py: { xs: 10, md: 16 }, position: 'relative', overflow: 'hidden' }}>
        <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(59,130,246,0.15) 0%, rgba(139,92,246,0.15) 100%)' }} />
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 600, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(59,130,246,0.2) 0%, transparent 70%)', filter: 'blur(60px)', pointerEvents: 'none' }} />
        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp(0)}>
            <Box sx={{ display: 'inline-flex', alignItems: 'center', px: 2.5, py: 0.8, mb: 4, borderRadius: '50px', bgcolor: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)' }}>
              <AutoAwesomeIcon sx={{ color: '#FCD34D', fontSize: 15, mr: 1 }} />
              <Typography variant="caption" sx={{ color: '#FCD34D', fontWeight: 700, letterSpacing: 1.5 }}>ÜCRETSİZ DANIŞMANLIK</Typography>
            </Box>
            <Typography variant="h2" fontWeight={900} color="white" sx={{ mb: 3, fontSize: { xs: '2.2rem', md: '4rem' }, lineHeight: 1.1 }}>
              Dijital Dönüşümünüze<br />
              <span style={{ background: 'linear-gradient(135deg, #60A5FA, #A78BFA)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Bugün Başlayın</span>
            </Typography>
            <Typography variant="body1" color="rgba(255,255,255,0.65)" sx={{ mb: 6, maxWidth: 520, mx: 'auto', fontSize: '1.1rem', lineHeight: 1.9 }}>
              30 dakikalık ücretsiz strateji görüşmesiyle markanız için neler yapabileceğimizi konuşalım.
            </Typography>
            <Box display="flex" gap={2} justifyContent="center" flexWrap="wrap" mb={5}>
              <Button component={Link} to="/contact" variant="contained" endIcon={<ArrowForwardIcon />}
                sx={{ background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)', color: '#fff', borderRadius: '50px', px: 5, py: 1.8, fontWeight: 700, fontSize: '1.05rem', boxShadow: '0 12px 40px rgba(59,130,246,0.5)', '&:hover': { opacity: 0.9, transform: 'translateY(-2px)' }, transition: 'all 0.3s' }}>
                Ücretsiz Görüşme Al
              </Button>
              <Button component="a" href="tel:+905531748204" startIcon={<PhoneIcon />}
                sx={{ borderColor: 'rgba(255,255,255,0.25)', color: 'white', border: '1px solid rgba(255,255,255,0.25)', borderRadius: '50px', px: 5, py: 1.8, fontWeight: 600, fontSize: '1.05rem', '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.08)' }, transition: 'all 0.3s' }}>
                Hemen Ara
              </Button>
            </Box>
            <Box display="flex" justifyContent="center" gap={4} flexWrap="wrap">
              {[{ icon: <CheckCircleIcon sx={{ fontSize: 16 }} />, text: 'Taahhüt yok' }, { icon: <CheckCircleIcon sx={{ fontSize: 16 }} />, text: 'Ücretsiz keşif' }, { icon: <CheckCircleIcon sx={{ fontSize: 16 }} />, text: 'Hızlı dönüş' }].map((item, i) => (
                <Box key={i} display="flex" alignItems="center" gap={0.8}>
                  <Box sx={{ color: '#34D399' }}>{item.icon}</Box>
                  <Typography variant="body2" color="rgba(255,255,255,0.6)" fontWeight={500}>{item.text}</Typography>
                </Box>
              ))}
            </Box>
          </motion.div>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;
