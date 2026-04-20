// src/pages/Blog.jsx
import React, { useEffect, useState } from 'react';
import { Container, Grid, Typography, Box, Button, Chip, Stack, Dialog, DialogContent, IconButton, Avatar } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import CloseIcon from '@mui/icons-material/Close';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PersonIcon from '@mui/icons-material/Person';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import axios from 'axios';
import SEO from '../components/SEO';
import { SERVER_URL } from '../config';

const fadeUp = (delay = 0) => ({
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, delay, ease: 'easeOut' } }
});

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  const getImageUrl = (path) => {
    if (!path) return 'https://placehold.co/800x600/0D1628/3B82F6?text=Blog';
    if (path.startsWith('http')) return path;
    return `${SERVER_URL}${path}`;
  };

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await axios.get(`${SERVER_URL}/api/blogs`);
        if (res.data.success) {
          setBlogs(res.data.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
        }
      } catch (err) { console.error("Blog yükleme hatası:", err); }
      finally { setLoading(false); }
    };
    fetchBlogs();
  }, []);

  return (
    <Box sx={{ overflowX: 'hidden', minHeight: '100vh', bgcolor: '#060C1A', color: '#fff' }}>
      <SEO title="Blog | Kıyı Medya" description="Dijital pazarlama, web tasarım ve teknoloji dünyasından güncel haberler." />

      {/* HERO */}
      <Box sx={{ position: 'relative', overflow: 'hidden', pt: { xs: 14, md: 20 }, pb: { xs: 8, md: 12 } }}>
        <Box sx={{ position: 'absolute', top: '0%', right: '-10%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)', filter: 'blur(70px)', pointerEvents: 'none' }} />
        <Box sx={{ position: 'absolute', bottom: '-10%', left: '-10%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 70%)', filter: 'blur(60px)', pointerEvents: 'none' }} />
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <motion.div initial="hidden" animate="visible" variants={fadeUp(0)}>
            <Box sx={{ display: 'inline-flex', alignItems: 'center', px: 2.5, py: 0.8, mb: 4, borderRadius: '50px', bgcolor: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.2)' }}>
              <AutoAwesomeIcon sx={{ color: '#A78BFA', fontSize: 15, mr: 1 }} />
              <Typography variant="caption" sx={{ color: '#A78BFA', fontWeight: 700, letterSpacing: 1.5 }}>GÜNCEL İÇERİKLER</Typography>
            </Box>
          </motion.div>
          <motion.div initial="hidden" animate="visible" variants={fadeUp(0.1)}>
            <Typography variant="h1" sx={{ fontWeight: 900, mb: 3, fontSize: { xs: '2.8rem', md: '5rem' }, letterSpacing: '-0.02em', lineHeight: 1.08 }}>
              Kıyı Medya{' '}
              <span style={{ background: 'linear-gradient(135deg, #8B5CF6, #3B82F6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Blog</span>
            </Typography>
          </motion.div>
          <motion.div initial="hidden" animate="visible" variants={fadeUp(0.2)}>
            <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.55)', fontSize: { xs: '1rem', md: '1.2rem' }, maxWidth: 620, mx: 'auto', lineHeight: 1.9 }}>
              Dijital dünyanın trendlerini, ipuçlarını ve sektör haberlerini sizin için derliyoruz.
            </Typography>
          </motion.div>
        </Container>
      </Box>

      {/* BLOG LIST */}
      <Container maxWidth="lg" sx={{ pb: 16 }}>
        <Grid container spacing={4}>
          {blogs.length > 0 ? blogs.map((blog, index) => (
            <Grid item xs={12} md={4} key={blog._id}>
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp(index * 0.08)}>
                <Box onClick={() => setSelectedBlog(blog)}
                  sx={{
                    height: '100%', borderRadius: 4, overflow: 'hidden', display: 'flex', flexDirection: 'column',
                    cursor: 'pointer',
                    bgcolor: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.07)',
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': { transform: 'translateY(-8px)', boxShadow: '0 20px 60px rgba(139,92,246,0.15)', borderColor: 'rgba(139,92,246,0.3)', '& .blog-img': { transform: 'scale(1.05)' } }
                  }}>
                  <Box sx={{ height: 240, overflow: 'hidden', position: 'relative' }}>
                    <Box className="blog-img" component="img" src={getImageUrl(blog.image)} alt={blog.title}
                      sx={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.6s ease', filter: 'brightness(0.75)' }} />
                    <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 50%, rgba(6,12,26,0.8) 100%)' }} />
                    <Box sx={{ position: 'absolute', top: 14, right: 14, bgcolor: 'rgba(6,12,26,0.85)', borderRadius: 2, p: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.1)' }}>
                      <Typography variant="h6" sx={{ fontWeight: 900, color: '#fff', lineHeight: 1 }}>{new Date(blog.createdAt).getDate()}</Typography>
                      <Typography variant="caption" sx={{ fontWeight: 700, color: '#A78BFA', textTransform: 'uppercase', fontSize: '0.65rem' }}>
                        {new Date(blog.createdAt).toLocaleDateString('tr-TR', { month: 'short' })}
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ flexGrow: 1, p: 3.5, display: 'flex', flexDirection: 'column' }}>
                    <Stack direction="row" spacing={2} mb={2} sx={{ opacity: 0.6 }}>
                      <Box display="flex" alignItems="center" gap={0.5}>
                        <PersonIcon sx={{ fontSize: 14, color: '#A78BFA' }} />
                        <Typography variant="caption" fontWeight={700} color="rgba(255,255,255,0.5)">Admin</Typography>
                      </Box>
                      <Box display="flex" alignItems="center" gap={0.5}>
                        <AccessTimeIcon sx={{ fontSize: 14, color: '#A78BFA' }} />
                        <Typography variant="caption" fontWeight={700} color="rgba(255,255,255,0.5)">3 Dk Oku</Typography>
                      </Box>
                    </Stack>
                    <Typography variant="h6" fontWeight={800} color="#fff" gutterBottom sx={{ lineHeight: 1.45, mb: 2, minHeight: 56 }}>{blog.title}</Typography>
                    <Typography variant="body2" color="rgba(255,255,255,0.5)" sx={{ mb: 3, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', lineHeight: 1.7 }}>
                      {blog.content}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#A78BFA', fontWeight: 700, fontSize: '0.9rem', mt: 'auto' }}>
                      Devamını Oku <ArrowForwardIcon sx={{ fontSize: 16 }} />
                    </Box>
                  </Box>
                </Box>
              </motion.div>
            </Grid>
          )) : (
            !loading && (
              <Box sx={{ width: '100%', textAlign: 'center', py: 10 }}>
                <Typography variant="h6" color="rgba(255,255,255,0.4)">Henüz blog yazısı eklenmemiş.</Typography>
              </Box>
            )
          )}
        </Grid>
      </Container>

      {/* DETAIL DIALOG */}
      <Dialog open={Boolean(selectedBlog)} onClose={() => setSelectedBlog(null)} maxWidth="md" fullWidth scroll="body"
        PaperProps={{ sx: { borderRadius: 4, overflow: 'hidden', bgcolor: '#0D1628', backgroundImage: 'none', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 30px 80px rgba(0,0,0,0.6)' } }}>
        {selectedBlog && (
          <>
            <Box sx={{ position: 'relative', height: { xs: 250, md: 400 } }}>
              <Box component="img" src={getImageUrl(selectedBlog.image)} sx={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.6)' }} />
              <IconButton onClick={() => setSelectedBlog(null)}
                sx={{ position: 'absolute', top: 20, right: 20, bgcolor: 'rgba(6,12,26,0.7)', color: 'white', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.15)', '&:hover': { bgcolor: 'rgba(6,12,26,0.9)', transform: 'rotate(90deg)' }, transition: 'all 0.3s' }}>
                <CloseIcon />
              </IconButton>
              <Box sx={{ position: 'absolute', bottom: 0, left: 0, width: '100%', p: { xs: 3, md: 5 }, background: 'linear-gradient(to top, rgba(6,12,26,0.95) 0%, transparent 100%)' }}>
                <Chip icon={<CalendarTodayIcon sx={{ fontSize: 13, color: 'rgba(255,255,255,0.8) !important' }} />}
                  label={new Date(selectedBlog.createdAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
                  size="small" sx={{ bgcolor: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(4px)', mb: 2 }} />
                <Typography variant="h4" fontWeight={900} color="white" sx={{ fontSize: { xs: '1.5rem', md: '2.5rem' }, lineHeight: 1.2 }}>
                  {selectedBlog.title}
                </Typography>
              </Box>
            </Box>
            <DialogContent sx={{ p: { xs: 3, md: 6 }, bgcolor: '#0D1628' }}>
              <Typography sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.9, fontSize: '1.05rem', color: 'rgba(255,255,255,0.75)', '&::first-letter': { fontSize: '3rem', float: 'left', mr: 1.5, lineHeight: 1, fontWeight: 900, background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' } }}>
                {selectedBlog.content}
              </Typography>
              <Box sx={{ mt: 6, pt: 4, borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)' }}>K</Avatar>
                <Box>
                  <Typography variant="subtitle2" fontWeight={800} color="#fff">Kıyı Medya Ekibi</Typography>
                  <Typography variant="caption" color="rgba(255,255,255,0.4)">İçerik Editörü</Typography>
                </Box>
              </Box>
            </DialogContent>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default Blog;
