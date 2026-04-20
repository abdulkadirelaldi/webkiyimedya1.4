// src/components/Navbar.jsx
import React, { useState, useEffect } from 'react';
import {
  AppBar, Toolbar, Button, Box, Container,
  IconButton, Drawer, List, ListItem, ListItemButton, ListItemText,
  Badge, Avatar, Tooltip, Divider, ListItemIcon, Typography,
  useTheme, useMediaQuery, Stack, Menu, MenuItem
} from '@mui/material';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { SERVER_URL } from '../config';
import { useAuth } from '../context/AuthContext';

import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import LogoutIcon from '@mui/icons-material/Logout';
import DashboardIcon from '@mui/icons-material/Dashboard';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SettingsIcon from '@mui/icons-material/Settings';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { user, logout } = useAuth();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorElUser, setAnchorElUser] = useState(null);

  const getProfileImage = () => {
    if (!user?.profileImage) return null;
    if (user.profileImage.startsWith('http')) return user.profileImage;
    return `${SERVER_URL}${user.profileImage}`;
  };

  const menuItems = [
    { label: 'Anasayfa', path: '/' },
    { label: 'Hizmetler', path: '/services' },
    { label: 'Portföy', path: '/portfolio' },
    { label: 'Kurumsal', path: '/about' },
    { label: 'Blog', path: '/blog' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          background: '#060C1A',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          boxShadow: 'none',
          py: 1,
        }}
      >
        <Container maxWidth="xl">
          <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 0, md: 2 } }}>

            <Box component={Link} to="/" sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none', zIndex: 2 }}>
              <Box
                component="img"
                src="/logo-white.png"
                alt="Kıyı Medya"
                sx={{ height: { xs: 32, md: 40 }, objectFit: 'contain', transition: '0.3s' }}
                onError={(e) => { e.target.src = '/logo.png'; }}
              />
            </Box>

            {!isMobile && (
              <Stack direction="row" spacing={0.5} sx={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
                {menuItems.map((item) => (
                  <Button
                    key={item.label}
                    component={Link}
                    to={item.path}
                    sx={{
                      textTransform: 'none',
                      fontWeight: isActive(item.path) ? 700 : 500,
                      fontSize: '0.95rem',
                      color: isActive(item.path) ? '#60A5FA' : 'rgba(255,255,255,0.65)',
                      px: 2, py: 1, borderRadius: '10px',
                      transition: 'all 0.3s',
                      '&:hover': { color: '#fff', bgcolor: 'rgba(255,255,255,0.06)' },
                      ...(isActive(item.path) && { bgcolor: 'rgba(59,130,246,0.12)' }),
                    }}
                  >
                    {item.label}
                  </Button>
                ))}
              </Stack>
            )}

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, zIndex: 2 }}>
              {!isMobile && !user && (
                <Button
                  component={Link}
                  to="/contact"
                  endIcon={<ArrowForwardIcon sx={{ fontSize: '16px !important' }} />}
                  sx={{
                    background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)',
                    color: '#fff', borderRadius: '50px',
                    textTransform: 'none', fontWeight: 700,
                    px: 3, py: 0.9, fontSize: '0.9rem',
                    boxShadow: '0 4px 20px rgba(59,130,246,0.35)',
                    '&:hover': { opacity: 0.9, transform: 'translateY(-1px)', boxShadow: '0 6px 24px rgba(59,130,246,0.5)' },
                    transition: 'all 0.3s ease',
                  }}
                >
                  İletişime Geç
                </Button>
              )}

              {user && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <IconButton sx={{ color: 'rgba(255,255,255,0.7)' }}>
                    <Badge color="error" variant="dot"><NotificationsIcon /></Badge>
                  </IconButton>
                  <Tooltip title="Profil">
                    <IconButton onClick={(e) => setAnchorElUser(e.currentTarget)} sx={{ p: 0, border: '2px solid rgba(59,130,246,0.5)' }}>
                      <Avatar src={getProfileImage()} sx={{ width: 36, height: 36 }}>{user.name?.charAt(0)}</Avatar>
                    </IconButton>
                  </Tooltip>
                  <Menu
                    anchorEl={anchorElUser}
                    open={Boolean(anchorElUser)}
                    onClose={() => setAnchorElUser(null)}
                    PaperProps={{ sx: { mt: 1.5, minWidth: 220, borderRadius: 3, background: '#0D1628', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 20px 60px rgba(0,0,0,0.5)' } }}
                  >
                    <Box sx={{ px: 2.5, py: 1.5, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                      <Typography variant="subtitle2" fontWeight="bold" color="#fff">{user.name}</Typography>
                      <Typography variant="caption" color="rgba(255,255,255,0.5)" sx={{ textTransform: 'capitalize' }}>{user.role}</Typography>
                    </Box>
                    <MenuItem onClick={() => { setAnchorElUser(null); navigate('/admin/dashboard'); }} sx={{ color: 'rgba(255,255,255,0.8)', mt: 0.5, '&:hover': { bgcolor: 'rgba(255,255,255,0.05)' } }}>
                      <ListItemIcon><DashboardIcon fontSize="small" sx={{ color: '#3B82F6' }} /></ListItemIcon> Yönetim Paneli
                    </MenuItem>
                    <MenuItem onClick={() => { setAnchorElUser(null); navigate('/admin/settings'); }} sx={{ color: 'rgba(255,255,255,0.8)', '&:hover': { bgcolor: 'rgba(255,255,255,0.05)' } }}>
                      <ListItemIcon><SettingsIcon fontSize="small" sx={{ color: '#8B5CF6' }} /></ListItemIcon> Ayarlar
                    </MenuItem>
                    <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)' }} />
                    <MenuItem onClick={() => { setAnchorElUser(null); logout(); navigate('/admin/login'); }} sx={{ color: '#F87171', '&:hover': { bgcolor: 'rgba(248,113,113,0.08)' } }}>
                      <ListItemIcon><LogoutIcon fontSize="small" color="error" /></ListItemIcon> Çıkış Yap
                    </MenuItem>
                  </Menu>
                </Box>
              )}

              {isMobile && (
                <IconButton onClick={() => setMobileOpen(true)} sx={{ color: 'rgba(255,255,255,0.8)' }}>
                  <MenuIcon fontSize="large" />
                </IconButton>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        PaperProps={{ sx: { width: 300, background: '#0A1225', borderLeft: '1px solid rgba(255,255,255,0.08)' } }}
      >
        <Box sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box component="img" src="/logo-white.png" sx={{ height: 36 }} onError={(e) => { e.target.src = '/logo.png'; }} />
          <IconButton onClick={() => setMobileOpen(false)} sx={{ color: 'rgba(255,255,255,0.7)' }}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)', mb: 2 }} />
        <List sx={{ px: 2 }}>
          {menuItems.map((item) => (
            <ListItem key={item.label} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                component={Link} to={item.path}
                onClick={() => setMobileOpen(false)}
                selected={isActive(item.path)}
                sx={{ borderRadius: 2, color: isActive(item.path) ? '#60A5FA' : 'rgba(255,255,255,0.75)', '&.Mui-selected': { bgcolor: 'rgba(59,130,246,0.12)' }, '&:hover': { bgcolor: 'rgba(255,255,255,0.06)', color: '#fff' } }}
              >
                <ListItemText primary={item.label} primaryTypographyProps={{ fontWeight: isActive(item.path) ? 700 : 500 }} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Box sx={{ px: 3, mt: 2 }}>
          <Button fullWidth component={Link} to="/contact" onClick={() => setMobileOpen(false)}
            sx={{ background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)', color: '#fff', borderRadius: 2, py: 1.5, fontWeight: 700, textTransform: 'none', mb: 2 }}>
            İletişime Geç
          </Button>
        </Box>
      </Drawer>
    </>
  );
};

export default Navbar;
