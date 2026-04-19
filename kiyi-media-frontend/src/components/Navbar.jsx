// src/components/Navbar.jsx
import React, { useState, useEffect } from 'react';
import {
  AppBar, Toolbar, Button, Box, Menu, MenuItem, Container,
  IconButton, Drawer, List, ListItem, ListItemButton, ListItemText,
  Fade, Badge, Avatar, Tooltip, Divider, ListItemIcon, Typography,
  useTheme, useMediaQuery, Stack
} from '@mui/material';
import { Link, useNavigate, useLocation } from 'react-router-dom';

// SERVER URL
import { SERVER_URL } from '../config';

// CONTEXT
import { useAuth } from '../context/AuthContext';
import { useColorMode } from '../context/ThemeContext';

// İKONLAR
import MenuIcon from '@mui/icons-material/Menu'; // Hamburger
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import LogoutIcon from '@mui/icons-material/Logout';
import DashboardIcon from '@mui/icons-material/Dashboard';
import CloseIcon from '@mui/icons-material/Close';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SettingsIcon from '@mui/icons-material/Settings';
import PersonIcon from '@mui/icons-material/Person';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import SendIcon from '@mui/icons-material/Send'; // İletişim için

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // TEMA & RESPONSIVE
  const theme = useTheme();
  const { toggleColorMode } = useColorMode();
  const isDark = theme.palette.mode === 'dark';
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // AUTH
  const { user, logout } = useAuth();

  // STATE
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // MENU ANCHORS
  const [anchorElServices, setAnchorElServices] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [anchorElNotif, setAnchorElNotif] = useState(null);

  const openServices = Boolean(anchorElServices);
  const openUser = Boolean(anchorElUser);
  const openNotif = Boolean(anchorElNotif);

  // PROFİL FOTOĞRAFI
  const getProfileImage = () => {
    if (!user?.profileImage) return null;
    if (user.profileImage.startsWith('http')) return user.profileImage;
    return `${SERVER_URL}${user.profileImage}`;
  };
  const profileImgSrc = getProfileImage();
  const notifications = [];

  // SCROLL DİNLEYİCİ
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      if (isScrolled !== scrolled) setScrolled(isScrolled);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled]);

  // HANDLERS
  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);
  const handleServicesClick = (event) => setAnchorElServices(event.currentTarget);
  const handleServicesClose = () => setAnchorElServices(null);
  const handleUserClick = (event) => setAnchorElUser(event.currentTarget);
  const handleUserClose = () => setAnchorElUser(null);
  const handleNotifClick = (event) => setAnchorElNotif(event.currentTarget);
  const handleNotifClose = () => setAnchorElNotif(null);

  const handleLogout = () => {
    handleUserClose();
    logout();
    navigate('/admin/login');
  };

  // --- STİL & RENKLER ---
  const navStyles = {
    appBar: {
      background: scrolled ? 'rgba(255, 255, 255, 0.92)' : 'rgba(255, 255, 255, 0.7)',
      backdropFilter: 'blur(16px)',
      borderBottom: scrolled ? '1px solid rgba(0,0,0,0.07)' : '1px solid transparent',
      boxShadow: scrolled ? '0 2px 20px rgba(0,0,0,0.07)' : 'none',
      transition: 'all 0.4s ease',
      py: 1.5,
    },
    link: (path) => ({
      textTransform: 'none',
      color: '#475569',
      fontWeight: 500,
      fontSize: '0.95rem',
      mx: 1,
      transition: 'color 0.3s',
      '&:hover': {
        color: '#0F172A',
        background: 'transparent'
      },
      ...(location.pathname === path && {
        color: '#3B82F6',
        fontWeight: 600
      })
    }),
    logoFilter: 'none',
    contactBtn: {
      bgcolor: '#3B82F6',
      color: '#fff',
      borderRadius: '50px',
      textTransform: 'none',
      fontWeight: 600,
      px: 3,
      py: 0.8,
      fontSize: '0.9rem',
      boxShadow: '0 2px 12px rgba(59,130,246,0.3)',
      '&:hover': {
        bgcolor: '#2563EB',
        transform: 'translateY(-1px)',
        boxShadow: '0 4px 18px rgba(59,130,246,0.4)',
      },
      transition: 'all 0.3s ease'
    }
  };

  const menuItems = [
    { label: 'Anasayfa', path: '/' },
    { label: 'Hizmetler', path: '/services', isDropdown: true }, // Dropdown Mantığı
    { label: 'Portföy', path: '/portfolio' },
    { label: 'Kurumsal', path: '/about' },
    { label: 'Blog', path: '/blog' },
  ];

  return (
    <>
      <AppBar position="sticky" elevation={0} sx={navStyles.appBar}>
        <Container maxWidth="xl">
          <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 0, md: 2 } }}>

            {/* 1. SOL: LOGO */}
            <Box component={Link} to="/" sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none', zIndex: 2 }}>
              <Box
                component="img"
                src="/logo.png"
                alt="Kıyı Medya"
                sx={{
                  height: { xs: 32, md: 42 },
                  objectFit: 'contain',
                  filter: navStyles.logoFilter,
                  transition: '0.3s'
                }}
              />
            </Box>

            {/* 2. ORTA: NAVİGASYON (REFERANS GÖRSELDEKİ GİBİ ORTADA) */}
            {!isMobile && (
              <Stack direction="row" spacing={1} sx={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
                {menuItems.map((item) => (
                  item.isDropdown ? (
                    <Box key={item.label}>
                      <Button
                        onClick={handleServicesClick}
                        endIcon={<KeyboardArrowDownIcon sx={{ fontSize: 16 }} />}
                        sx={navStyles.link(item.path)}
                      >
                        {item.label}
                      </Button>
                      <Menu
                        anchorEl={anchorElServices}
                        open={openServices}
                        onClose={handleServicesClose}
                        TransitionComponent={Fade}
                        PaperProps={{
                          sx: {
                            mt: 1.5, minWidth: 200, borderRadius: 3,
                            background: 'rgba(255, 255, 255, 0.96)',
                            backdropFilter: 'blur(16px)',
                            border: '1px solid rgba(0,0,0,0.07)',
                            boxShadow: theme.shadows[10]
                          }
                        }}
                      >
                        {['Web Tasarım', 'Sosyal Medya', 'Video Prodüksiyon', 'Tüm Hizmetler'].map((sub) => (
                          <MenuItem
                            key={sub}
                            onClick={handleServicesClose}
                            component={Link}
                            to="/services"
                            sx={{ fontSize: '0.9rem', fontWeight: 500, '&:hover': { color: theme.palette.primary.main } }}
                          >
                            {sub}
                          </MenuItem>
                        ))}
                      </Menu>
                    </Box>
                  ) : (
                    <Button
                      key={item.label}
                      component={Link}
                      to={item.path}
                      sx={navStyles.link(item.path)}
                    >
                      {item.label}
                    </Button>
                  )
                ))}
              </Stack>
            )}

            {/* 3. SAĞ: AKSİYONLAR (BUTON & PROFİL) */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, zIndex: 2 }}>

              {/* Theme Toggle (Removed for Dark Mode Consistency) */}
              {/* !isMobile && (
                <IconButton onClick={toggleColorMode} color="inherit" sx={{ color: isDark ? '#94A3B8' : '#64748B' }}>
                  {isDark ? <Brightness7Icon /> : <Brightness4Icon />}
                </IconButton>
              ) */}

              {/* İletişim Butonu (Masaüstü) */}
              {!isMobile && !user && (
                <Button
                  component={Link}
                  to="/contact"
                  startIcon={<SendIcon sx={{ fontSize: '18px !important' }} />}
                  sx={navStyles.contactBtn}
                >
                  İletişime Geç
                </Button>
              )}

              {/* KULLANICI GİRİŞ YAPMIŞSA */}
              {user ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {/* Bildirimler */}
                  <IconButton onClick={handleNotifClick} sx={{ color: '#475569' }}>
                    <Badge badgeContent={notifications.length} color="error" variant="dot">
                      <NotificationsIcon />
                    </Badge>
                  </IconButton>

                  {/* Profil Avatar */}
                  <Tooltip title="Profil">
                    <IconButton onClick={handleUserClick} sx={{ p: 0, border: `2px solid ${theme.palette.primary.main}` }}>
                      <Avatar src={profileImgSrc} sx={{ width: 38, height: 38 }}>{user.name.charAt(0)}</Avatar>
                    </IconButton>
                  </Tooltip>

                  {/* Profil Menüsü */}
                  <Menu
                    anchorEl={anchorElUser}
                    open={openUser}
                    onClose={handleUserClose}
                    PaperProps={{ sx: { mt: 1.5, minWidth: 220, borderRadius: 3, background: '#fff', boxShadow: '0 8px 30px rgba(0,0,0,0.1)' } }}
                  >
                    <Box sx={{ px: 2.5, py: 1.5, borderBottom: `1px solid ${theme.palette.divider}` }}>
                      <Typography variant="subtitle2" fontWeight="bold">{user.name}</Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'capitalize' }}>{user.role}</Typography>
                    </Box>
                    <MenuItem onClick={() => { handleUserClose(); navigate('/admin/dashboard'); }} sx={{ mt: 1 }}>
                      <ListItemIcon><DashboardIcon fontSize="small" /></ListItemIcon> Yönetim Paneli
                    </MenuItem>
                    <MenuItem onClick={() => { handleUserClose(); navigate('/admin/settings'); }}>
                      <ListItemIcon><SettingsIcon fontSize="small" /></ListItemIcon> Ayarlar
                    </MenuItem>
                    <Divider />
                    <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
                      <ListItemIcon><LogoutIcon fontSize="small" color="error" /></ListItemIcon> Çıkış Yap
                    </MenuItem>
                  </Menu>
                </Box>
              ) : null}

              {/* MOBİL MENÜ BUTONU */}
              {isMobile && (
                <IconButton onClick={handleDrawerToggle} sx={{ color: '#0F172A', ml: 1 }}>
                  <MenuIcon fontSize="large" />
                </IconButton>
              )}
            </Box>

          </Toolbar>
        </Container>
      </AppBar>

      {/* --- MOBİL DRAWER (YAN MENÜ) --- */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        PaperProps={{
          sx: {
            width: 280,
            background: '#FFFFFF',
            boxShadow: '-4px 0 30px rgba(0,0,0,0.08)'
          }
        }}
      >
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <IconButton onClick={toggleColorMode} color="inherit">
            {isDark ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
          <IconButton onClick={handleDrawerToggle}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Box sx={{ px: 3, pb: 2, textAlign: 'center' }}>
          <Box component="img" src="/logo.png" sx={{ height: 40, filter: 'none' }} />
        </Box>
        <Divider sx={{ mb: 2 }} />

        <List sx={{ px: 2 }}>
          {menuItems.map((item) => (
            <ListItem key={item.label} disablePadding sx={{ mb: 1 }}>
              <ListItemButton
                component={Link} to={item.path} onClick={handleDrawerToggle}
                sx={{ borderRadius: 2, '&.Mui-selected': { bgcolor: 'primary.main', color: 'white' } }}
                selected={location.pathname === item.path}
              >
                <ListItemText primary={item.label} primaryTypographyProps={{ fontWeight: 600 }} />
              </ListItemButton>
            </ListItem>
          ))}

          <ListItem sx={{ mt: 3, flexDirection: 'column', gap: 2 }}>
            <Button
              fullWidth variant="contained" component={Link} to="/contact" onClick={handleDrawerToggle}
              sx={{ ...navStyles.gradientBtn, width: '100%', justifyContent: 'center' }}
            >
              İletişime Geç
            </Button>

            {!user && (
              <Button fullWidth variant="outlined" component={Link} to="/admin/login" startIcon={<PersonIcon />}>
                Personel Girişi
              </Button>
            )}
          </ListItem>
        </List>
      </Drawer>
    </>
  );
};

export default Navbar;