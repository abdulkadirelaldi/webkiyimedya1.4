// src/context/ThemeContext.js
import React, { createContext, useMemo, useContext } from 'react';
import { createTheme, ThemeProvider as MUIThemeProvider } from '@mui/material/styles';
import { CssBaseline, GlobalStyles } from '@mui/material';

const ColorModeContext = createContext({ toggleColorMode: () => { } });

export const useColorMode = () => useContext(ColorModeContext);

export const ThemeContextProvider = ({ children }) => {
    const mode = 'light';

    const colorMode = useMemo(() => ({
        toggleColorMode: () => {},
        mode,
    }), []);

    const theme = useMemo(() => createTheme({
        palette: {
            mode: 'light',
            primary: { main: '#3B82F6' },
            secondary: { main: '#1D3557' },
            background: {
                default: '#F8FAFC',
                paper: '#FFFFFF',
            },
            text: {
                primary: '#0F172A',
                secondary: '#64748B',
            },
            divider: 'rgba(0,0,0,0.08)',
            custom: {
                deepNavy: '#0F172A',
                slateBlue: '#64748B',
                lightGray: '#F1F5F9',
                cardBg: '#FFFFFF',
                gradient: '#F8FAFC'
            }
        },
        typography: {
            fontFamily: "'Outfit', 'Inter', sans-serif",
            h1: { fontWeight: 800, letterSpacing: '-0.02em' },
            h4: { fontWeight: 700, letterSpacing: '-0.01em' },
            subtitle1: { lineHeight: 1.5 }
        },
        shape: { borderRadius: 16 },
        components: {
            MuiButton: {
                styleOverrides: {
                    root: {
                        textTransform: 'none',
                        fontWeight: 600,
                        borderRadius: 50,
                        boxShadow: 'none',
                        '&:hover': { boxShadow: '0 4px 16px rgba(59,130,246,0.25)' }
                    }
                }
            },
            MuiPaper: {
                styleOverrides: {
                    root: { backgroundImage: 'none' }
                }
            }
        }
    }), []);

    return (
        <ColorModeContext.Provider value={colorMode}>
            <MUIThemeProvider theme={theme}>
                <CssBaseline />
                <GlobalStyles styles={{
                    body: {
                        background: '#F8FAFC',
                        minHeight: '100vh',
                    }
                }} />
                {children}
            </MUIThemeProvider>
        </ColorModeContext.Provider>
    );
};