// src/components/WhatsAppButton.jsx
import React from 'react';
import { Fab, Tooltip, Zoom, useTheme, useMediaQuery } from '@mui/material';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';

const WhatsAppButton = () => {
    const theme = useTheme();
    // Mobilde butonun boyutunu ve konumunu biraz daha optimize edelim
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    // Telefon Numarası (90 ile başlayan)
    const phoneNumber = "905531748204";

    // Otomatik Mesaj
    const message = "Merhaba, Kıyı Medya hizmetleri hakkında detaylı bilgi almak istiyorum.";

    // WhatsApp Linki
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

    return (
        <Zoom in={true} style={{ transitionDelay: '1000ms' }}>
            <Tooltip title="WhatsApp Hattı" placement="left" arrow>
                <Fab
                    color="primary"
                    aria-label="whatsapp"
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                        position: 'fixed',
                        bottom: isMobile ? 20 : 35, // Mobilde biraz daha aşağıda
                        right: isMobile ? 20 : 35,  // Mobilde biraz daha sağda
                        bgcolor: '#25D366', // WhatsApp Brand Color
                        color: 'white',
                        width: isMobile ? 48 : 56,
                        height: isMobile ? 48 : 56,
                        zIndex: 1200, // Navbar ve Drawer'ın altında, içeriğin üstünde
                        boxShadow: '0 4px 20px rgba(37, 211, 102, 0.4)',
                        // Pulse (Nabız) Animasyonu
                        '@keyframes pulse': {
                            '0%': { boxShadow: '0 0 0 0 rgba(37, 211, 102, 0.7)' },
                            '70%': { boxShadow: '0 0 0 15px rgba(37, 211, 102, 0)' },
                            '100%': { boxShadow: '0 0 0 0 rgba(37, 211, 102, 0)' },
                        },
                        animation: 'pulse 2s infinite',
                        '&:hover': {
                            bgcolor: '#128C7E', // Hover rengi (Koyu Yeşil)
                            transform: 'scale(1.1)'
                        },
                        transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                    }}
                >
                    <WhatsAppIcon sx={{ fontSize: isMobile ? 28 : 32 }} />
                </Fab>
            </Tooltip>
        </Zoom>
    );
};

export default WhatsAppButton;