import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Box,
  Button,
  Typography,
  Avatar,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
  Container,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useAuth } from '../hooks/useAuth';

export default function Navbar() {
  const { isAuthenticated, handleLogout, user } = useAuth();
  const { stocks } = useSelector((state) => state.market);
  const { cashBalance } = useSelector((state) => state.demo);
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Market indices preview (Upstox top bar ticker)
  const defaultIndices = [
    { symbol: 'NIFTY 50', price: '24,852.15', change: '+142.30', changePercent: '+0.58%', isUp: true },
    { symbol: 'SENSEX', price: '81,381.30', change: '+412.10', changePercent: '+0.51%', isUp: true },
    { symbol: 'BANK NIFTY', price: '51,200.40', change: '+380.60', changePercent: '+0.75%', isUp: true },
    { symbol: 'NASDAQ', price: '18,340.20', change: '-45.10', changePercent: '-0.25%', isUp: false },
  ];

  // If live stocks are loaded, we can also use real stocks in ticker
  const tickerItems = stocks && stocks.length > 0
    ? stocks.slice(0, 6).map(s => ({
        symbol: s.symbol,
        price: `$${Number(s.price).toFixed(2)}`,
        change: `${s.change >= 0 ? '+' : ''}${Number(s.change).toFixed(2)}`,
        changePercent: `${s.change >= 0 ? '+' : ''}${s.changePercent}%`,
        isUp: s.change >= 0
      }))
    : defaultIndices;

  const navLinks = [
    { label: 'Stocks', href: '#stocks-preview' },
    { label: 'F&O Trading', href: '#products' },
    { label: 'Mutual Funds', href: '#products' },
    { label: 'Pricing (₹0 AMC)', href: '#pricing' },
    { label: 'Why Us', href: '#features' },
  ];

  const handleNavClick = (href) => {
    setMobileOpen(false);
    if (location.pathname !== '/') {
      navigate('/' + href);
    } else {
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Top Real-time Market Ticker (Signature Upstox Header) */}
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: 34,
          backgroundColor: '#0F172A',
          color: '#E2E8F0',
          fontSize: '0.8rem',
          display: 'flex',
          alignItems: 'center',
          overflow: 'hidden',
          zIndex: 1300,
          borderBottom: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            px: 2,
            height: '100%',
            backgroundColor: '#6D28D9',
            color: '#ffffff',
            fontWeight: 800,
            fontSize: '0.72rem',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            whiteSpace: 'nowrap',
            gap: 0.5,
            zIndex: 2,
            boxShadow: '4px 0 12px rgba(0,0,0,0.3)',
          }}
        >
          <Box
            sx={{
              width: 7,
              height: 7,
              borderRadius: '50%',
              bgcolor: '#00D09C',
              animation: 'pulse 1.5s infinite',
              '@keyframes pulse': {
                '0%, 100%': { opacity: 1, transform: 'scale(1)' },
                '50%': { opacity: 0.4, transform: 'scale(0.8)' },
              },
            }}
          />
          LIVE MARKET
        </Box>

        {/* Scrolling or Flex Ticker items */}
        <Box
          sx={{
            display: 'flex',
            gap: 4,
            px: 3,
            whiteSpace: 'nowrap',
            overflowX: 'auto',
            scrollbarWidth: 'none',
            '&::-webkit-scrollbar': { display: 'none' },
            width: '100%',
          }}
        >
          {tickerItems.map((item, idx) => (
            <Box
              key={idx}
              onClick={() => {
                if (item.symbol && !item.symbol.includes(' ')) {
                  navigate(`/stock/${item.symbol}`);
                }
              }}
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 1,
                cursor: item.symbol && !item.symbol.includes(' ') ? 'pointer' : 'default',
                '&:hover': {
                  opacity: 0.85,
                },
              }}
            >
              <Typography sx={{ fontWeight: 700, fontSize: '0.78rem', color: '#F8FAFC' }}>
                {item.symbol}
              </Typography>
              <Typography sx={{ fontWeight: 600, fontSize: '0.78rem', color: '#94A3B8' }}>
                {item.price}
              </Typography>
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  fontWeight: 700,
                  fontSize: '0.75rem',
                  color: item.isUp ? '#00D09C' : '#F43F5E',
                  backgroundColor: item.isUp ? 'rgba(0, 208, 156, 0.12)' : 'rgba(244, 63, 94, 0.12)',
                  px: 0.8,
                  py: 0.2,
                  borderRadius: 1,
                }}
              >
                {item.changePercent}
              </Box>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Main Upstox-Style Navigation Bar */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          top: 34,
          backgroundColor: 'rgba(255, 255, 255, 0.92)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(226, 232, 240, 0.9)',
          zIndex: 1200,
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ minHeight: { xs: 68, md: 74 }, display: 'flex', justifyContent: 'space-between' }}>
            {/* Logo */}
            <Box
              sx={{ display: 'flex', alignItems: 'center', gap: 1.5, cursor: 'pointer' }}
              onClick={() => navigate('/')}
            >
              <Box
                sx={{
                  width: 44,
                  height: 44,
                  borderRadius: '14px',
                  background: 'linear-gradient(135deg, #6D28D9 0%, #7C3AED 50%, #8B5CF6 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 8px 18px rgba(109, 40, 217, 0.35)',
                  transform: 'rotate(-2deg)',
                  transition: 'transform 0.2s ease',
                  '&:hover': { transform: 'rotate(0deg) scale(1.05)' },
                }}
              >
                <TrendingUpIcon sx={{ color: '#ffffff', fontSize: 26 }} />
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 900,
                      letterSpacing: '-0.03em',
                      color: '#0F172A',
                      fontSize: { xs: '1.4rem', md: '1.65rem' },
                    }}
                  >
                    Stock<span style={{ color: '#6D28D9' }}>Flow</span>
                  </Typography>
                  <Box
                    sx={{
                      backgroundColor: '#F5F3FF',
                      color: '#6D28D9',
                      border: '1px solid rgba(109, 40, 217, 0.25)',
                      fontWeight: 800,
                      fontSize: '0.65rem',
                      letterSpacing: '0.05em',
                      px: 0.8,
                      py: 0.2,
                      borderRadius: 1,
                      textTransform: 'uppercase',
                    }}
                  >
                    UPSTOX PRO
                  </Box>
                </Box>
                <Typography sx={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 600, mt: -0.3 }}>
                  Trade • Invest • Grow
                </Typography>
              </Box>
            </Box>

            {/* Desktop Navigation Links */}
            <Box sx={{ display: { xs: 'none', lg: 'flex' }, alignItems: 'center', gap: 3 }}>
              {navLinks.map((link) => (
                <Typography
                  key={link.label}
                  onClick={() => handleNavClick(link.href)}
                  sx={{
                    color: '#334155',
                    fontWeight: 600,
                    fontSize: '0.98rem',
                    cursor: 'pointer',
                    transition: 'color 0.2s ease',
                    position: 'relative',
                    '&:hover': {
                      color: '#6D28D9',
                    },
                  }}
                >
                  {link.label}
                </Typography>
              ))}
            </Box>

            {/* Action Buttons (Large, high visibility) */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {/* Global Demo Balance Pill */}
              <Box
                onClick={() => navigate('/dashboard')}
                sx={{
                  display: { xs: 'none', sm: 'flex' },
                  alignItems: 'center',
                  gap: 1,
                  px: 1.8,
                  py: 0.8,
                  borderRadius: 2.5,
                  bgcolor: '#F8FAFC',
                  border: '1px solid #E2E8F0',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  '&:hover': { bgcolor: '#F5F3FF', borderColor: '#6D28D9', transform: 'translateY(-1px)' },
                }}
              >
                <AccountBalanceWalletIcon sx={{ color: '#6D28D9', fontSize: 18 }} />
                <Box>
                  <Typography sx={{ fontSize: '0.65rem', color: '#64748B', fontWeight: 800 }}>DEMO MARGIN</Typography>
                  <Typography sx={{ fontSize: '0.85rem', color: '#0F172A', fontWeight: 900 }}>
                    ${cashBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </Typography>
                </Box>
              </Box>

              {!isAuthenticated ? (
                <>
                  <Button
                    variant="text"
                    onClick={() => navigate('/login')}
                    sx={{
                      color: '#0F172A',
                      fontWeight: 700,
                      fontSize: '1rem',
                      px: 2.5,
                      py: 1.2,
                      borderRadius: 3,
                      display: { xs: 'none', sm: 'inline-flex' },
                      '&:hover': {
                        backgroundColor: 'rgba(109, 40, 217, 0.08)',
                        color: '#6D28D9',
                      },
                    }}
                  >
                    Log in
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => navigate('/register')}
                    endIcon={<ArrowForwardIcon />}
                    sx={{
                      background: 'linear-gradient(135deg, #6D28D9 0%, #7C3AED 100%)',
                      color: '#ffffff',
                      fontWeight: 800,
                      fontSize: { xs: '0.95rem', md: '1.05rem' },
                      px: { xs: 2.5, md: 3.5 },
                      py: { xs: 1, md: 1.3 },
                      borderRadius: 3,
                      boxShadow: '0 8px 24px rgba(109, 40, 217, 0.38)',
                      whiteSpace: 'nowrap',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #5B21B6 0%, #6D28D9 100%)',
                        boxShadow: '0 10px 28px rgba(109, 40, 217, 0.5)',
                        transform: 'translateY(-2px)',
                      },
                    }}
                  >
                    Open Demat Account
                  </Button>
                </>
              ) : (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Button
                    variant="contained"
                    onClick={() => navigate('/dashboard')}
                    sx={{
                      background: 'linear-gradient(135deg, #6D28D9 0%, #7C3AED 100%)',
                      fontWeight: 700,
                      fontSize: '0.95rem',
                      px: 3,
                      py: 1,
                      borderRadius: 3,
                    }}
                  >
                    Dashboard
                  </Button>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                    <Avatar
                      sx={{
                        width: 38,
                        height: 38,
                        background: 'linear-gradient(135deg, #6D28D9 0%, #7C3AED 100%)',
                        color: '#ffffff',
                        fontWeight: 800,
                        fontSize: '1rem',
                        boxShadow: '0 4px 12px rgba(109, 40, 217, 0.3)',
                      }}
                    >
                      {user?.name ? user.name.charAt(0).toUpperCase() : (user?.email?.charAt(0) || 'U').toUpperCase()}
                    </Avatar>
                    <Button
                      variant="text"
                      onClick={handleLogout}
                      sx={{
                        color: '#64748B',
                        fontWeight: 600,
                        fontSize: '0.95rem',
                        '&:hover': { color: '#F43F5E', backgroundColor: 'transparent' },
                      }}
                    >
                      Sign out
                    </Button>
                  </Box>
                </Box>
              )}

              {/* Mobile Menu Icon */}
              <IconButton
                sx={{ display: { xs: 'flex', lg: 'none' }, color: '#0F172A', ml: 0.5 }}
                onClick={() => setMobileOpen(true)}
              >
                <MenuIcon sx={{ fontSize: 28 }} />
              </IconButton>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        PaperProps={{
          sx: { width: 300, p: 3, backgroundColor: '#ffffff' },
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6" fontWeight={800} color="#6D28D9">
            StockFlow
          </Typography>
          <IconButton onClick={() => setMobileOpen(false)}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Divider sx={{ mb: 2 }} />
        <List>
          {navLinks.map((link) => (
            <ListItem key={link.label} disablePadding sx={{ mb: 1 }}>
              <ListItemButton
                onClick={() => handleNavClick(link.href)}
                sx={{ borderRadius: 2, fontWeight: 600, fontSize: '1.05rem', color: '#1E293B' }}
              >
                <ListItemText primary={link.label} primaryTypographyProps={{ fontWeight: 600 }} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
          {!isAuthenticated ? (
            <>
              <Button
                variant="outlined"
                fullWidth
                size="large"
                onClick={() => { setMobileOpen(false); navigate('/login'); }}
                sx={{ py: 1.5, fontSize: '1.05rem', fontWeight: 700 }}
              >
                Log in
              </Button>
              <Button
                variant="contained"
                fullWidth
                size="large"
                onClick={() => { setMobileOpen(false); navigate('/register'); }}
                sx={{ py: 1.5, fontSize: '1.05rem', fontWeight: 800 }}
              >
                Open Free Account
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="contained"
                fullWidth
                size="large"
                onClick={() => { setMobileOpen(false); navigate('/dashboard'); }}
                sx={{ py: 1.5, fontSize: '1.05rem' }}
              >
                Dashboard
              </Button>
              <Button
                variant="outlined"
                color="error"
                fullWidth
                onClick={() => { setMobileOpen(false); handleLogout(); }}
                sx={{ py: 1.2 }}
              >
                Sign out
              </Button>
            </>
          )}
        </Box>
      </Drawer>
    </>
  );
}
