// src/context/ThemeContext.js
import React, { createContext, useMemo, useContext } from 'react';
import { createTheme, ThemeProvider as MUIThemeProvider } from '@mui/material/styles';
import { CssBaseline, GlobalStyles } from '@mui/material';

const ColorModeContext = createContext({ toggleColorMode: () => { } });

export const useColorMode = () => useContext(ColorModeContext);

export const ThemeContextProvider = ({ children }) => {
    const mode = 'dark';

    const colorMode = useMemo(() => ({
        toggleColorMode: () => {},
        mode,
    }), []);

    const theme = useMemo(() => createTheme({
        palette: {
            mode: 'dark',
            primary: { main: '#3B82F6' },
            secondary: { main: '#8B5CF6' },
            background: {
                default: '#060C1A',
                paper: '#0D1628',
            },
            text: {
                primary: '#FFFFFF',
                secondary: 'rgba(255,255,255,0.6)',
            },
            divider: 'rgba(255,255,255,0.08)',
        },
        typography: {
            fontFamily: "'Outfit', 'Inter', sans-serif",
            h1: { fontWeight: 900, letterSpacing: '-0.02em' },
            h2: { fontWeight: 900, letterSpacing: '-0.02em' },
            h3: { fontWeight: 800 },
            h4: { fontWeight: 700 },
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
                    }
                }
            },
            MuiPaper: {
                styleOverrides: {
                    root: { backgroundImage: 'none' }
                }
            },
            MuiDialog: {
                styleOverrides: {
                    paper: { backgroundImage: 'none' }
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
                        background: '#060C1A',
                        minHeight: '100vh',
                    }
                }} />
                {children}
            </MUIThemeProvider>
        </ColorModeContext.Provider>
    );
};
