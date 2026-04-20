// src/pages/Services.jsx
import React, { useState, useEffect } from 'react';
import { SERVER_URL } from '../config';
import { Container, Grid, Typography, Box, Button, Stack, Dialog, AppBar, Toolbar, IconButton, Slide, Card, CardContent, CardMedia, Chip, useTheme, useMediaQuery } from '@mui/material';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import SEO from '../components/SEO';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CloseIcon from '@mui/icons-material/Close';
import LanguageIcon from '@mui/icons-material/Language';
import ViewQuiltIcon from '@mui/icons-material/ViewQuilt';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const getImageUrl = (path) => {
  if (!path) return 'https://placehold.co/800x600/0D1628/3B82F6?text=Hizmet';
  if (path.startsWith('http')) return path;
  return `${SERVER_URL}${path}`;
};

const fadeUp = (delay = 0) => ({
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, delay, ease: 'easeOut' } }
});

const Services = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [servicesList, setServicesList] = useState([]);
  const [servicesLoading, setServicesLoading] = useState(true);
  const [portfolios, setPortfolios] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [filteredProjects, setFilteredProjects] = useState([]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await axios.get(`${SERVER_URL}/api/services`);
        if (res.data.data) setServicesList(res.data.data);
      } catch (error) { setServicesList([]); }
      finally { setServicesLoading(false); }
    };
    fetchServices();
  }, []);

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const res = await axios.get(`${SERVER_URL}/api/portfolio`);
        if (res.data.success) setPortfolios(res.data.data);
      } catch (error) {}
    };
    fetchPortfolio();
  }, []);

  const handleCardClick = (service) => {
    setSelectedService(service);
    const projects = portfolios.filter(p => {
      const cats = p.category;
      if (!cats) return false;
      let titles = Array.isArray(cats) ? cats : cats.split(',').map(s => s.trim());
      return titles.some(t => t && t.toLowerCase() === service.title.toLowerCase());
    });
    setFilteredProjects(projects);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setTimeout(() => setSelectedService(null), 200);
  };

  return (
    <Box sx={{ overflowX: 'hidden', minHeight: '100vh', bgcolor: '#060C1A', color: '#fff' }}>
      <SEO title="Hizmetlerimiz | Kıyı Medya" description="Web tasarım, dijital pazarlama ve sosyal medya çözümleri." />

      {/* HERO */}
      <Box sx={{ position: 'relative', overflow: 'hidden', pt: { xs: 14, md: 20 }, pb: { xs: 10, md: 14 } }}>
        <Box sx={{ position: 'absolute', top: '10%', right: '-10%', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%)', filter: 'blur(80px)', pointerEvents: 'none' }} />
        <Box sx={{ position: 'absolute', bottom: '-10%', left: '-10%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%)', filter: 'blur(60px)', pointerEvents: 'none' }} />
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <motion.div initial="hidden" animate="visible" variants={fadeUp(0)}>
            <Box sx={{ display: 'inline-flex', alignItems: 'center', px: 2.5, py: 0.8, mb: 4, borderRadius: '50px', bgcolor: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.2)' }}>
              <AutoAwesomeIcon sx={{ color: '#60A5FA', fontSize: 15, mr: 1 }} />
              <Typography variant="caption" sx={{ color: '#60A5FA', fontWeight: 700, letterSpacing: 1.5 }}>UZMANLIK ALANLARIMIZ</Typography>
            </Box>
          </motion.div>
          <motion.div initial="hidden" animate="visible" variants={fadeUp(0.1)}>
            <Typography variant="h1" sx={{ fontWeight: 900, mb: 3, fontSize: { xs: '2.8rem', md: '5rem' }, lineHeight: 1.08, letterSpacing: '-0.02em' }}>
              Dijital Dönüşümünüzü<br />
              <span style={{ background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Şimdi Başlatın</span>
            </Typography>
          </motion.div>
          <motion.div initial="hidden" animate="visible" variants={fadeUp(0.2)}>
            <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.55)', fontSize: { xs: '1rem', md: '1.2rem' }, maxWidth: 620, mx: 'auto', lineHeight: 1.9 }}>
              İhtiyaç duyduğunuz tüm dijital hizmetler, tek bir stratejik çatı altında.
              Her karta tıklayın, ilgili projelerimizi keşfedin.
            </Typography>
          </motion.div>
        </Container>
      </Box>

      {/* SERVICES GRID */}
      <Container maxWidth="xl" sx={{ mb: 16, px: { xs: 2, md: 6 } }}>
        <Grid container spacing={4} justifyContent="center">
          {servicesList.map((service, index) => (
            <Grid item xs={12} md={4} key={index}>
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp(index * 0.08)}>
                <Box
                  onClick={() => handleCardClick(service)}
                  sx={{
                    cursor: 'pointer', borderRadius: 4, overflow: 'hidden', height: '100%',
                    display: 'flex', flexDirection: 'column',
                    bgcolor: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 20px 60px rgba(59,130,246,0.2)',
                      borderColor: 'rgba(59,130,246,0.4)',
                      '& .service-img': { transform: 'scale(1.05)' },
                      '& .service-overlay': { opacity: 1 }
                    }
                  }}
                >
                  <Box sx={{ height: 240, overflow: 'hidden', position: 'relative' }}>
                    <Box
                      className="service-img"
                      component="img"
                      src={getImageUrl(service.image)}
                      alt={service.title}
                      sx={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.6s ease', filter: 'brightness(0.7)' }}
                      onError={(e) => { e.target.src = 'https://placehold.co/800x600/0D1628/3B82F6?text=Hizmet'; }}
                    />
                    <Box className="service-overlay" sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 40%, rgba(6,12,26,0.8) 100%)', opacity: 0.5, transition: 'opacity 0.4s' }} />
                    <Box sx={{ position: 'absolute', top: 16, right: 16, bgcolor: 'rgba(6,12,26,0.7)', color: '#60A5FA', fontWeight: 800, fontSize: '1rem', width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 2, backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.1)' }}>
                      {service.id}
                    </Box>
                  </Box>
                  <Box sx={{ p: 4, display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                    <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: 'wrap', gap: 1 }}>
                      {service.tags?.map((tag, i) => (
                        <Chip key={i} label={tag} size="small" sx={{ bgcolor: 'rgba(59,130,246,0.12)', color: '#60A5FA', fontWeight: 600, border: '1px solid rgba(59,130,246,0.2)', fontSize: '0.75rem' }} />
                      ))}
                    </Stack>
                    <Typography variant="h5" gutterBottom sx={{ fontWeight: 800, color: '#fff', mb: 1.5 }}>{service.title}</Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.55)', mb: 3, flexGrow: 1, lineHeight: 1.8 }}>{service.description}</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#60A5FA', fontWeight: 700, fontSize: '0.9rem' }}>
                      İlgili Projeleri Gör <ArrowForwardIcon sx={{ fontSize: 16 }} />
                    </Box>
                  </Box>
                </Box>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* PROJECT DIALOG */}
      <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}
        PaperProps={{ sx: { bgcolor: '#060C1A', backgroundImage: 'none', color: '#fff' } }}>
        <AppBar sx={{ position: 'relative', bgcolor: 'rgba(6,12,26,0.95)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(255,255,255,0.08)', boxShadow: 'none' }}>
          <Toolbar>
            <IconButton edge="start" onClick={handleClose} sx={{ color: 'rgba(255,255,255,0.7)' }}><CloseIcon /></IconButton>
            <Typography sx={{ ml: 2, flex: 1, fontWeight: 700, color: '#fff' }} variant="h6">{selectedService?.title}</Typography>
            <Button onClick={handleClose} sx={{ color: 'rgba(255,255,255,0.6)' }}>Kapat</Button>
          </Toolbar>
        </AppBar>
        <Container maxWidth="lg" sx={{ py: 8 }}>
          <Box textAlign="center" mb={6}>
            <Typography variant="h4" fontWeight={800} color="#fff">
              {selectedService?.title} <span style={{ fontWeight: 300, color: 'rgba(255,255,255,0.4)' }}>Projeleri</span>
            </Typography>
            <Typography variant="body1" color="rgba(255,255,255,0.5)" mt={1}>Bu alanda geliştirdiğimiz seçkin işler.</Typography>
          </Box>
          {filteredProjects.length > 0 ? (
            <Grid container spacing={4}>
              {filteredProjects.map((project, idx) => (
                <Grid item xs={12} md={4} key={project._id || idx}>
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}>
                    <Box sx={{ height: '100%', borderRadius: 4, overflow: 'hidden', display: 'flex', flexDirection: 'column', bgcolor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', transition: '0.3s', '&:hover': { transform: 'translateY(-6px)', boxShadow: '0 16px 50px rgba(59,130,246,0.15)', borderColor: 'rgba(59,130,246,0.3)' } }}>
                      <Box sx={{ position: 'relative', height: 220, overflow: 'hidden' }}>
                        <CardMedia component="img" image={getImageUrl(project.portray || project.logo)} alt={project.title} sx={{ height: '100%', width: '100%', objectFit: 'cover', filter: 'brightness(0.8)' }} />
                        <Box sx={{ position: 'absolute', top: 12, left: 12 }}>
                          <Chip icon={<ViewQuiltIcon style={{ color: 'white', fontSize: 14 }} />} label={selectedService?.matchKey} size="small" sx={{ bgcolor: 'rgba(6,12,26,0.8)', color: 'white', fontWeight: 600, backdropFilter: 'blur(4px)', border: '1px solid rgba(255,255,255,0.15)' }} />
                        </Box>
                      </Box>
                      <CardContent sx={{ pt: 3, px: 3, pb: 4, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                        <Typography variant="h6" fontWeight={800} color="#fff" gutterBottom>{project.title}</Typography>
                        <Typography variant="body2" color="rgba(255,255,255,0.5)" sx={{ mb: 3, flexGrow: 1, lineHeight: 1.7, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>{project.description}</Typography>
                        {project.projectUrl ? (
                          <Button variant="contained" fullWidth href={project.projectUrl} target="_blank" startIcon={<LanguageIcon />}
                            sx={{ mt: 'auto', borderRadius: 50, fontWeight: 600, background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)', '&:hover': { opacity: 0.9 } }}>
                            Projeyi İncele
                          </Button>
                        ) : (
                          <Button disabled variant="outlined" fullWidth sx={{ mt: 'auto', borderRadius: 50, borderColor: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.3)' }}>Detaylar Yakında</Button>
                        )}
                      </CardContent>
                    </Box>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Box textAlign="center" py={10}>
              <Typography variant="h5" fontWeight={800} color="#fff" gutterBottom>Henüz Proje Eklenmedi</Typography>
              <Typography variant="body1" color="rgba(255,255,255,0.5)">Bu kategoride yakında harika işler göreceksiniz.</Typography>
              <Button component={Link} to="/contact" variant="contained" sx={{ mt: 3, background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)', color: 'white', borderRadius: 50, fontWeight: 700 }}>
                İlk Projemiz Siz Olun
              </Button>
            </Box>
          )}
        </Container>
      </Dialog>
    </Box>
  );
};

export default Services;
