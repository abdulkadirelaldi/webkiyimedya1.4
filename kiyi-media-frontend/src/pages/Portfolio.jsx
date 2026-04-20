// src/pages/Portfolio.jsx
import React, { useState, useEffect } from 'react';
import { Container, Grid, Typography, Box, Dialog, DialogContent, Button, IconButton, ImageList, ImageListItem, Chip, useMediaQuery, useTheme, Tab, Tabs, Divider, Avatar } from '@mui/material';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import SEO from '../components/SEO';
import { SERVER_URL } from '../config';
import CloseIcon from '@mui/icons-material/Close';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import LaunchIcon from '@mui/icons-material/Launch';
import CategoryIcon from '@mui/icons-material/Category';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import DownloadIcon from '@mui/icons-material/Download';
import VisibilityIcon from '@mui/icons-material/Visibility';

const fadeUp = (delay = 0) => ({
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, delay, ease: 'easeOut' } }
});

const Portfolio = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [portfolioItems, setPortfolioItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [categories, setCategories] = useState(['Tümü']);
  const [selectedCategory, setSelectedCategory] = useState('Tümü');
  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewMedia, setPreviewMedia] = useState({ type: '', url: '' });

  const getMediaUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    return `${SERVER_URL}${path}`;
  };

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const res = await axios.get(`${SERVER_URL}/api/portfolio`);
        if (res.data.success) {
          const data = res.data.data.reverse();
          setPortfolioItems(data);
          setFilteredItems(data);
          const cats = new Set(['Tümü']);
          data.forEach(item => {
            if (item.category) {
              const itemCats = Array.isArray(item.category) ? item.category : item.category.split(',');
              itemCats.forEach(c => cats.add(c.trim()));
            }
          });
          setCategories(Array.from(cats));
        }
      } catch (error) { console.error("Hata:", error); }
    };
    fetchPortfolio();
  }, []);

  const handleCategoryChange = (event, newValue) => {
    setSelectedCategory(newValue);
    if (newValue === 'Tümü') {
      setFilteredItems(portfolioItems);
    } else {
      setFilteredItems(portfolioItems.filter(item => {
        const itemCats = Array.isArray(item.category) ? item.category : item.category.split(',').map(c => c.trim());
        return itemCats.includes(newValue);
      }));
    }
  };

  const handleClickOpen = (item) => { setSelectedItem(item); setOpen(true); };
  const handleClose = () => { setOpen(false); setTimeout(() => setSelectedItem(null), 200); };
  const handlePreviewOpen = (type, url) => { setPreviewMedia({ type, url }); setPreviewOpen(true); };
  const handlePreviewClose = () => { setPreviewOpen(false); setPreviewMedia({ type: '', url: '' }); };
  const FALLBACK = 'https://placehold.co/600x400/0D1628/3B82F6?text=Resim+Yok';
  const handleImageError = (e) => { e.target.src = FALLBACK; };

  return (
    <Box sx={{ overflowX: 'hidden', minHeight: '100vh', bgcolor: '#060C1A', color: '#fff' }}>
      <SEO title="Portföy | Kıyı Medya" description="Başarı hikayelerimiz ve tamamladığımız projeler." />

      {/* HERO */}
      <Box sx={{ position: 'relative', overflow: 'hidden', pt: { xs: 14, md: 20 }, pb: { xs: 8, md: 12 } }}>
        <Box sx={{ position: 'absolute', top: '0%', right: '-10%', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%)', filter: 'blur(80px)', pointerEvents: 'none' }} />
        <Box sx={{ position: 'absolute', bottom: '-10%', left: '-10%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%)', filter: 'blur(70px)', pointerEvents: 'none' }} />
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <motion.div initial="hidden" animate="visible" variants={fadeUp(0)}>
            <Box sx={{ display: 'inline-flex', alignItems: 'center', px: 2.5, py: 0.8, mb: 4, borderRadius: '50px', bgcolor: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.2)' }}>
              <AutoAwesomeIcon sx={{ color: '#60A5FA', fontSize: 15, mr: 1 }} />
              <Typography variant="caption" sx={{ color: '#60A5FA', fontWeight: 700, letterSpacing: 1.5 }}>PROJELERİMİZ</Typography>
            </Box>
          </motion.div>
          <motion.div initial="hidden" animate="visible" variants={fadeUp(0.1)}>
            <Typography variant="h1" sx={{ fontWeight: 900, mb: 3, fontSize: { xs: '2.8rem', md: '5rem' }, lineHeight: 1.08, letterSpacing: '-0.02em' }}>
              İlham Veren<br />
              <span style={{ background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Başarı Hikayeleri.</span>
            </Typography>
          </motion.div>
          <motion.div initial="hidden" animate="visible" variants={fadeUp(0.2)}>
            <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.55)', fontSize: { xs: '1rem', md: '1.2rem' }, maxWidth: 620, mx: 'auto', lineHeight: 1.9 }}>
              Fikirleri dijital gerçekliğe dönüştürdüğümüz, markalara değer katan seçkin projelerimiz.
            </Typography>
          </motion.div>
        </Container>
      </Box>

      {/* PORTFOLIO GRID */}
      <Container maxWidth="xl" sx={{ mb: 16, px: { xs: 2, md: 6 } }}>
        {/* Category Filter */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Box display="flex" justifyContent="center" mb={8}>
            <Box sx={{ p: 1, borderRadius: 50, display: 'flex', alignItems: 'center', maxWidth: '100%', overflowX: 'auto', bgcolor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <Tabs value={selectedCategory} onChange={handleCategoryChange} variant="scrollable" scrollButtons="auto" allowScrollButtonsMobile
                sx={{
                  '& .MuiTabs-indicator': { display: 'none' },
                  '& .MuiTab-root': {
                    textTransform: 'none', fontWeight: 600, color: 'rgba(255,255,255,0.45)',
                    minWidth: 'auto', px: 3, py: 1, borderRadius: 50, transition: 'all 0.3s',
                    '&.Mui-selected': { background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)', color: 'white', boxShadow: '0 4px 16px rgba(59,130,246,0.3)' },
                    '&:hover:not(.Mui-selected)': { color: 'rgba(255,255,255,0.8)', bgcolor: 'rgba(255,255,255,0.06)' }
                  }
                }}>
                {categories.map((cat) => <Tab key={cat} label={cat} value={cat} disableRipple />)}
              </Tabs>
            </Box>
          </Box>
        </motion.div>

        <Grid container spacing={3}>
          <AnimatePresence>
            {filteredItems.map((item, index) => (
              <Grid item key={item._id} xs={12} sm={6} md={4}>
                <motion.div layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.3 }}>
                  <Box onClick={() => handleClickOpen(item)}
                    sx={{
                      borderRadius: 4, position: 'relative', cursor: 'pointer', overflow: 'hidden',
                      aspectRatio: '4/3',
                      bgcolor: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.07)',
                      transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s, border-color 0.3s',
                      '&:hover': { transform: 'translateY(-8px)', boxShadow: '0 20px 60px rgba(59,130,246,0.2)', borderColor: 'rgba(59,130,246,0.4)' },
                      '&:hover img': { transform: 'scale(1.06)', filter: 'brightness(0.9)' },
                      '&:hover .card-overlay': { opacity: 1 }
                    }}>
                    <Box component="img" src={getMediaUrl(item.portray || item.logo)} alt={item.title} onError={handleImageError}
                      sx={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.6s ease, filter 0.4s', filter: 'brightness(0.75)' }} />

                    <Box className="card-overlay" sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 30%, rgba(6,12,26,0.97) 100%)', opacity: 0.7, transition: 'opacity 0.4s ease', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', p: 3 }}>
                      <Typography variant="h6" fontWeight={800} color="white" gutterBottom>{item.title}</Typography>
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        {item.category && (Array.isArray(item.category) ? item.category : item.category.split(',')).slice(0, 3).map((cat, idx) => (
                          <Chip key={idx} label={cat.trim()} size="small" sx={{ bgcolor: 'rgba(59,130,246,0.2)', color: 'rgba(255,255,255,0.9)', fontSize: '0.7rem', backdropFilter: 'blur(4px)', fontWeight: 600, border: '1px solid rgba(59,130,246,0.3)' }} />
                        ))}
                      </Box>
                    </Box>

                    {(item.video && (Array.isArray(item.video) ? item.video.length > 0 : !!item.video)) && (
                      <Box sx={{ position: 'absolute', top: 16, right: 16, bgcolor: 'rgba(6,12,26,0.75)', backdropFilter: 'blur(6px)', borderRadius: '50%', p: 0.8, display: 'flex', border: '1px solid rgba(255,255,255,0.15)' }}>
                        <PlayCircleOutlineIcon sx={{ color: 'white', fontSize: 22 }} />
                      </Box>
                    )}
                    {(item.pdf && (Array.isArray(item.pdf) ? item.pdf.length > 0 : !!item.pdf)) && (
                      <Box sx={{ position: 'absolute', top: 16, left: 16, bgcolor: 'rgba(239,68,68,0.85)', backdropFilter: 'blur(6px)', borderRadius: '8px', px: 1, py: 0.4, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <PictureAsPdfIcon sx={{ color: 'white', fontSize: 13 }} />
                        <Typography sx={{ color: 'white', fontSize: '0.6rem', fontWeight: 700 }}>PDF</Typography>
                      </Box>
                    )}
                  </Box>
                </motion.div>
              </Grid>
            ))}
          </AnimatePresence>
        </Grid>
      </Container>

      {/* PROJECT DETAIL DIALOG */}
      <Dialog open={open} onClose={handleClose} scroll="body" maxWidth="lg" fullWidth
        PaperProps={{ sx: { borderRadius: 4, bgcolor: '#0D1628', backgroundImage: 'none', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 30px 80px rgba(0,0,0,0.7)' } }}>
        {selectedItem && (
          <>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: { xs: 2, md: 4 }, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
              <Box display="flex" alignItems="center" gap={2}>
                <Avatar src={getMediaUrl(selectedItem.logo)} imgProps={{ sx: { objectFit: 'contain' }, onError: handleImageError }}
                  sx={{ width: 48, height: 48, border: '1px solid rgba(255,255,255,0.1)', bgcolor: 'rgba(255,255,255,0.06)' }}>
                  <CategoryIcon sx={{ color: '#3B82F6' }} />
                </Avatar>
                <Box>
                  <Typography variant="h5" fontWeight={900} color="#fff" lineHeight={1.2}>{selectedItem.title}</Typography>
                  <Typography variant="caption" color="rgba(255,255,255,0.35)" fontWeight={600}>PROJE DETAYLARI</Typography>
                </Box>
              </Box>
              <IconButton onClick={handleClose} sx={{ color: 'rgba(255,255,255,0.5)', '&:hover': { bgcolor: 'rgba(255,255,255,0.06)', color: '#fff' } }}><CloseIcon /></IconButton>
            </Box>

            <DialogContent sx={{ p: { xs: 3, md: 5 } }}>
              <Grid container spacing={6}>
                <Grid item xs={12} md={4} order={{ xs: 2, md: 1 }}>
                  <Box sx={{ position: 'sticky', top: 20 }}>
                    <Typography variant="overline" sx={{ color: '#60A5FA', fontWeight: 800, letterSpacing: 2 }}>PROJE HAKKINDA</Typography>
                    <Typography variant="body1" sx={{ mt: 1.5, mb: 4, color: 'rgba(255,255,255,0.65)', lineHeight: 1.9, whiteSpace: 'pre-line' }}>{selectedItem.description}</Typography>
                    <Divider sx={{ my: 3, borderColor: 'rgba(255,255,255,0.08)' }} />
                    <Typography variant="overline" sx={{ color: '#60A5FA', fontWeight: 800, letterSpacing: 2 }}>HİZMETLER</Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1.5, mb: 4 }}>
                      {selectedItem.category && (Array.isArray(selectedItem.category) ? selectedItem.category : selectedItem.category.split(',')).map((cat, idx) => (
                        <Chip key={idx} label={cat.trim()} sx={{ bgcolor: 'rgba(59,130,246,0.12)', color: '#60A5FA', fontWeight: 600, border: '1px solid rgba(59,130,246,0.25)' }} />
                      ))}
                    </Box>
                    {selectedItem.projectUrl && (
                      <Button variant="contained" fullWidth size="large" endIcon={<LaunchIcon />}
                        href={selectedItem.projectUrl.startsWith('http') ? selectedItem.projectUrl : `https://${selectedItem.projectUrl}`}
                        target="_blank"
                        sx={{ background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)', color: 'white', py: 1.8, fontWeight: 700, borderRadius: 2, '&:hover': { opacity: 0.9 } }}>
                        Projeyi Ziyaret Et
                      </Button>
                    )}
                  </Box>
                </Grid>

                <Grid item xs={12} md={8} order={{ xs: 1, md: 2 }}>
                  <ImageList variant="masonry" cols={isMobile ? 1 : 2} gap={12}>
                    {selectedItem.video && (Array.isArray(selectedItem.video) ? selectedItem.video : [selectedItem.video]).map((vid, idx) => (
                      vid && (
                        <ImageListItem key={`vid-${idx}`} onClick={() => handlePreviewOpen('video', getMediaUrl(vid))} sx={{ cursor: 'pointer', borderRadius: 3, overflow: 'hidden', position: 'relative', border: '1px solid rgba(255,255,255,0.1)' }}>
                          <Box sx={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'rgba(0,0,0,0.4)', zIndex: 1, transition: '0.3s', '&:hover': { bgcolor: 'rgba(0,0,0,0.2)' } }}>
                            <PlayCircleOutlineIcon sx={{ color: '#fff', fontSize: 60 }} />
                          </Box>
                          <video style={{ width: '100%', display: 'block', borderRadius: '12px' }}>
                            <source src={getMediaUrl(vid)} type="video/mp4" />
                          </video>
                        </ImageListItem>
                      )
                    ))}
                    {selectedItem.portray && (
                      <ImageListItem onClick={() => handlePreviewOpen('image', getMediaUrl(selectedItem.portray))} sx={{ cursor: 'pointer', borderRadius: 3, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)', position: 'relative', '&:hover .zoom-icon': { opacity: 1 } }}>
                        <img src={getMediaUrl(selectedItem.portray)} alt="Kapak" loading="lazy" onError={handleImageError} style={{ width: '100%', borderRadius: '12px', display: 'block' }} />
                        <Box className="zoom-icon" sx={{ position: 'absolute', bottom: 10, right: 10, bgcolor: 'rgba(59,130,246,0.8)', borderRadius: '50%', p: 0.6, opacity: 0, transition: '0.3s' }}>
                          <ZoomInIcon sx={{ color: 'white', fontSize: 18 }} />
                        </Box>
                      </ImageListItem>
                    )}
                    {selectedItem.gallery?.map((img, index) => (
                      <ImageListItem key={index} onClick={() => handlePreviewOpen('image', getMediaUrl(img))} sx={{ cursor: 'pointer', borderRadius: 3, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)' }}>
                        <img src={getMediaUrl(img)} alt={`Galeri ${index}`} loading="lazy" onError={handleImageError} style={{ width: '100%', borderRadius: '12px', display: 'block' }} />
                      </ImageListItem>
                    ))}
                    {selectedItem.pdf && (Array.isArray(selectedItem.pdf) ? selectedItem.pdf : [selectedItem.pdf]).map((pdfPath, idx) => {
                      if (!pdfPath) return null;
                      const pdfUrl = getMediaUrl(pdfPath);
                      const fileName = pdfPath.split('/').pop() || `Belge ${idx + 1}`;
                      return (
                        <ImageListItem key={`pdf-${idx}`}>
                          <Box sx={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(239,68,68,0.3)', bgcolor: 'rgba(239,68,68,0.05)', display: 'flex', flexDirection: 'column' }}>
                            <Box sx={{ bgcolor: 'rgba(239,68,68,0.1)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 4, px: 2, gap: 1 }}>
                              <PictureAsPdfIcon sx={{ fontSize: 60, color: '#EF4444' }} />
                              <Typography variant="caption" color="rgba(255,255,255,0.5)" fontWeight={600} textAlign="center" sx={{ wordBreak: 'break-all', maxWidth: 200, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                {fileName}
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', gap: 1, p: 1.5 }}>
                              <Button variant="contained" size="small" startIcon={<VisibilityIcon />} href={pdfUrl} target="_blank" rel="noopener noreferrer"
                                sx={{ flex: 1, bgcolor: '#3B82F6', '&:hover': { bgcolor: '#2563EB' }, borderRadius: '8px', fontSize: '0.75rem', fontWeight: 700 }}>
                                Görüntüle
                              </Button>
                              <Button variant="outlined" size="small" startIcon={<DownloadIcon />} href={pdfUrl} download={fileName}
                                sx={{ flex: 1, borderColor: 'rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.7)', '&:hover': { borderColor: '#3B82F6', color: '#60A5FA' }, borderRadius: '8px', fontSize: '0.75rem', fontWeight: 700 }}>
                                İndir
                              </Button>
                            </Box>
                          </Box>
                        </ImageListItem>
                      );
                    })}
                  </ImageList>
                </Grid>
              </Grid>
            </DialogContent>
          </>
        )}
      </Dialog>

      {/* LIGHTBOX */}
      <Dialog open={previewOpen} onClose={handlePreviewClose} maxWidth="xl" fullWidth
        PaperProps={{ sx: { bgcolor: 'transparent', boxShadow: 'none', overflow: 'hidden' } }}
        BackdropProps={{ sx: { bgcolor: 'rgba(0,0,0,0.97)' } }}>
        <Box sx={{ position: 'relative', width: '100%', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <IconButton onClick={handlePreviewClose} sx={{ position: 'absolute', top: 30, right: 30, color: '#fff', bgcolor: 'rgba(255,255,255,0.08)', '&:hover': { bgcolor: 'rgba(255,255,255,0.15)' }, zIndex: 10 }}>
            <CloseIcon fontSize="large" />
          </IconButton>
          {previewMedia.type === 'video' ? (
            <video controls autoPlay style={{ maxWidth: '90%', maxHeight: '90%', outline: 'none', borderRadius: '12px', boxShadow: '0 0 80px rgba(59,130,246,0.3)' }}>
              <source src={previewMedia.url} type="video/mp4" />
            </video>
          ) : (
            <img src={previewMedia.url} alt="Önizleme" onError={handleImageError} style={{ maxWidth: '90%', maxHeight: '90%', objectFit: 'contain', borderRadius: '12px', boxShadow: '0 0 80px rgba(59,130,246,0.2)' }} />
          )}
        </Box>
      </Dialog>
    </Box>
  );
};

export default Portfolio;
