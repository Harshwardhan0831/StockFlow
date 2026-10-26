import React, { useState } from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Button,
  Card,
  CardContent,
  Chip,
  TextField,
  InputAdornment,
  Divider,
  Tab,
  Tabs,
  Avatar,
  Rating,
} from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import SecurityIcon from '@mui/icons-material/Security';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import LayersIcon from '@mui/icons-material/Layers';
import PieChartIcon from '@mui/icons-material/PieChart';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import SmartphoneIcon from '@mui/icons-material/Smartphone';
import StarIcon from '@mui/icons-material/Star';
import SpeedIcon from '@mui/icons-material/Speed';
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectStock } from '../store/slices/marketSlice';

export default function LandingPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { stocks } = useSelector((state) => state.market);

  const [inputContact, setInputContact] = useState('');
  const [selectedTab, setSelectedTab] = useState(0);
  const [activeStockIndex, setActiveStockIndex] = useState(0);
  const [demoOrderSide, setDemoOrderSide] = useState('buy');
  const [demoQty, setDemoQty] = useState(10);
  const [faqOpen, setFaqOpen] = useState(null);

  // Fallback stock list if Redux store is initializing
  const fallbackStocks = [
    { symbol: 'AAPL', name: 'Apple Inc.', price: 187.90, change: 2.40, changePercent: '1.29', volume: '48.2M', tag: 'Tech' },
    { symbol: 'MSFT', name: 'Microsoft Corp.', price: 428.15, change: 5.80, changePercent: '1.37', volume: '22.5M', tag: 'Cloud' },
    { symbol: 'NVDA', name: 'NVIDIA Corporation', price: 135.20, change: 4.10, changePercent: '3.13', volume: '65.1M', tag: 'AI' },
    { symbol: 'TSLA', name: 'Tesla Inc.', price: 218.40, change: -3.20, changePercent: '-1.44', volume: '34.8M', tag: 'Auto' },
    { symbol: 'AMZN', name: 'Amazon.com Inc.', price: 186.50, change: 1.90, changePercent: '1.03', volume: '28.3M', tag: 'Retail' },
    { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 165.30, change: -0.80, changePercent: '-0.48', volume: '19.4M', tag: 'Search' },
  ];

  const displayStocks = stocks && stocks.length > 0 ? stocks : fallbackStocks;
  const currentPreviewStock = displayStocks[activeStockIndex] || displayStocks[0];

  const handleStartTrading = (e) => {
    e.preventDefault();
    if (inputContact.trim()) {
      navigate(`/register?contact=${encodeURIComponent(inputContact.trim())}`);
    } else {
      navigate('/register');
    }
  };

  const handleSelectAndTrade = (stock) => {
    dispatch(selectStock(stock));
    navigate('/register');
  };

  // Filter stocks by tabs
  const getFilteredStocks = () => {
    if (selectedTab === 1) return displayStocks.filter((s) => Number(s.change) > 0);
    if (selectedTab === 2) return displayStocks.filter((s) => Number(s.change) < 0);
    return displayStocks;
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#F8FAFC' }}>
      
      {/* 1. HERO SECTION (UPSTOX SIGNATURE HIGH IMPACT) */}
      <Box
        sx={{
          position: 'relative',
          pt: { xs: 6, md: 10 },
          pb: { xs: 8, md: 14 },
          px: { xs: 2.5, sm: 4, md: 6 },
          overflow: 'hidden',
          background: 'radial-gradient(100% 100% at 50% 0%, #EDE9FE 0%, #F5F3FF 40%, #F8FAFC 100%)',
          borderBottom: '1px solid rgba(226, 232, 240, 0.8)',
        }}
      >
        {/* Glow decorative orbs */}
        <Box
          sx={{
            position: 'absolute',
            top: -120,
            left: '50%',
            transform: 'translateX(-50%)',
            width: { xs: 400, md: 900 },
            height: { xs: 400, md: 600 },
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(124, 58, 237, 0.18) 0%, rgba(124, 58, 237, 0) 70%)',
            filter: 'blur(70px)',
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ textAlign: 'center', maxWidth: 940, mx: 'auto' }}>
            
            {/* Trust badge */}
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 1.2,
                mb: 3.5,
                px: 2.5,
                py: 0.9,
                borderRadius: 50,
                background: '#ffffff',
                border: '1px solid rgba(109, 40, 217, 0.2)',
                boxShadow: '0 4px 18px rgba(109, 40, 217, 0.08)',
              }}
            >
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  bgcolor: '#00D09C',
                  boxShadow: '0 0 10px #00D09C',
                }}
              />
              <Typography
                sx={{
                  fontSize: { xs: '0.8rem', sm: '0.88rem' },
                  fontWeight: 700,
                  color: '#4A1D96',
                  letterSpacing: '0.02em',
                }}
              >
                Zero AMC for Life • 1+ Crore Happy Investors • Fast Order Execution
              </Typography>
            </Box>

            {/* Main Headline */}
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.5rem' },
                lineHeight: { xs: 1.15, md: 1.08 },
                fontWeight: 900,
                color: '#0F172A',
                letterSpacing: '-0.035em',
                mb: 2.5,
              }}
            >
              Invest right.{' '}
              <Box
                component="span"
                sx={{
                  background: 'linear-gradient(135deg, #6D28D9 0%, #7C3AED 50%, #9061F9 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  display: 'inline-block',
                }}
              >
                Invest now.
              </Box>
            </Typography>

            <Typography
              sx={{
                fontSize: { xs: '1.05rem', sm: '1.25rem', md: '1.35rem' },
                color: '#475569',
                maxWidth: 780,
                mx: 'auto',
                lineHeight: 1.6,
                fontWeight: 500,
                mb: 4.5,
              }}
            >
              Trade Stocks, F&O, Direct Mutual Funds and IPOs on India's most modern trading platform.
              Enjoy <strong style={{ color: '#0F172A' }}>₹0 brokerage</strong> on Mutual Funds & flat ₹20/order on F&O.
            </Typography>

            {/* High-Conversion Fast Account Opening Form */}
            <Box
              component="form"
              onSubmit={handleStartTrading}
              sx={{
                maxWidth: 580,
                mx: 'auto',
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                gap: 1.5,
                p: 1,
                backgroundColor: '#ffffff',
                borderRadius: { xs: 3, sm: 4 },
                boxShadow: '0 12px 40px rgba(109, 40, 217, 0.15)',
                border: '1px solid rgba(109, 40, 217, 0.25)',
                mb: 3,
              }}
            >
              <TextField
                fullWidth
                variant="standard"
                placeholder="Enter mobile number or email"
                value={inputContact}
                onChange={(e) => setInputContact(e.target.value)}
                InputProps={{
                  disableUnderline: true,
                  sx: {
                    px: 2.5,
                    py: 1.2,
                    fontSize: '1.05rem',
                    fontWeight: 500,
                    color: '#0F172A',
                  },
                }}
              />
              <Button
                type="submit"
                variant="contained"
                size="large"
                endIcon={<ArrowForwardIcon />}
                sx={{
                  py: 1.6,
                  px: { xs: 3, sm: 4 },
                  fontSize: '1.08rem',
                  fontWeight: 800,
                  whiteSpace: 'nowrap',
                  borderRadius: { xs: 2.5, sm: 3.5 },
                  background: 'linear-gradient(135deg, #6D28D9 0%, #7C3AED 100%)',
                  boxShadow: '0 6px 20px rgba(109, 40, 217, 0.35)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #5B21B6 0%, #6D28D9 100%)',
                    transform: 'translateY(-1px)',
                  },
                }}
              >
                Open Demat Account
              </Button>
            </Box>

            {/* Quick trust metrics */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: { xs: 2, sm: 4 },
                flexWrap: 'wrap',
                fontSize: '0.88rem',
                color: '#64748B',
                fontWeight: 600,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                <CheckCircleIcon sx={{ fontSize: 18, color: '#00D09C' }} />
                <span>100% Paperless (5 mins)</span>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                <CheckCircleIcon sx={{ fontSize: 18, color: '#00D09C' }} />
                <span>₹0 Account Opening Fee</span>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                <CheckCircleIcon sx={{ fontSize: 18, color: '#00D09C' }} />
                <span>SEBI Regulated & Safe</span>
              </Box>
            </Box>

          </Box>

          {/* 2. UPSTOX INTERACTIVE LIVE TRADING TERMINAL SHOWCASE */}
          <Box
            sx={{
              mt: { xs: 6, md: 8 },
              borderRadius: { xs: 4, md: 5 },
              overflow: 'hidden',
              boxShadow: '0 24px 70px rgba(15, 23, 42, 0.18)',
              border: '1px solid rgba(226, 232, 240, 0.9)',
              backgroundColor: '#0F172A',
              color: '#ffffff',
            }}
          >
            {/* Terminal Window Header Bar */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                px: 3,
                py: 1.8,
                backgroundColor: '#1E293B',
                borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box sx={{ display: 'flex', gap: 0.8 }}>
                  <Box sx={{ width: 11, height: 11, borderRadius: '50%', bgcolor: '#EF4444' }} />
                  <Box sx={{ width: 11, height: 11, borderRadius: '50%', bgcolor: '#F59E0B' }} />
                  <Box sx={{ width: 11, height: 11, borderRadius: '50%', bgcolor: '#10B981' }} />
                </Box>
                <Typography sx={{ fontSize: '0.82rem', fontWeight: 700, color: '#94A3B8', ml: 1 }}>
                  StockFlow Pro Trading Terminal • WebSocket Connected
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Chip
                  label="LIVE TICKS"
                  size="small"
                  sx={{
                    bgcolor: 'rgba(0, 208, 156, 0.15)',
                    color: '#00D09C',
                    fontWeight: 800,
                    fontSize: '0.72rem',
                    borderRadius: 1,
                    border: '1px solid rgba(0, 208, 156, 0.3)',
                  }}
                />
              </Box>
            </Box>

            {/* Terminal Body */}
            <Grid container>
              {/* Left Column: Watchlist Selector */}
              <Grid
                item
                xs={12}
                md={4}
                sx={{
                  borderRight: { md: '1px solid rgba(255, 255, 255, 0.08)' },
                  borderBottom: { xs: '1px solid rgba(255, 255, 255, 0.08)', md: 'none' },
                  p: 2.5,
                  backgroundColor: '#0F172A',
                }}
              >
                <Typography sx={{ fontSize: '0.8rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', mb: 2, letterSpacing: '0.05em' }}>
                  Live Watchlist
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.2 }}>
                  {displayStocks.slice(0, 5).map((stock, idx) => {
                    const isSelected = idx === activeStockIndex;
                    const isUp = Number(stock.change) >= 0;
                    return (
                      <Box
                        key={stock.symbol}
                        onClick={() => setActiveStockIndex(idx)}
                        sx={{
                          p: 1.8,
                          borderRadius: 3,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          backgroundColor: isSelected ? 'rgba(109, 40, 217, 0.25)' : 'rgba(255, 255, 255, 0.03)',
                          border: isSelected ? '1px solid #7C3AED' : '1px solid rgba(255, 255, 255, 0.05)',
                          transition: 'all 0.2s ease',
                          '&:hover': {
                            backgroundColor: 'rgba(109, 40, 217, 0.15)',
                          },
                        }}
                      >
                        <Box>
                          <Typography sx={{ fontWeight: 800, fontSize: '0.98rem', color: '#ffffff' }}>
                            {stock.symbol}
                          </Typography>
                          <Typography sx={{ fontSize: '0.75rem', color: '#94A3B8' }}>
                            {stock.name}
                          </Typography>
                        </Box>

                        <Box sx={{ textAlign: 'right' }}>
                          <Typography sx={{ fontWeight: 800, fontSize: '1rem', color: '#F8FAFC' }}>
                            ${Number(stock.price).toFixed(2)}
                          </Typography>
                          <Typography
                            sx={{
                              fontWeight: 700,
                              fontSize: '0.78rem',
                              color: isUp ? '#00D09C' : '#F43F5E',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'flex-end',
                              gap: 0.3,
                            }}
                          >
                            {isUp ? <TrendingUpIcon sx={{ fontSize: 14 }} /> : <TrendingDownIcon sx={{ fontSize: 14 }} />}
                            {isUp ? '+' : ''}{Number(stock.change).toFixed(2)} ({stock.changePercent}%)
                          </Typography>
                        </Box>
                      </Box>
                    );
                  })}
                </Box>
              </Grid>

              {/* Right Column: Chart & Quick Buy/Sell Mock Execution */}
              <Grid item xs={12} md={8} sx={{ p: { xs: 2.5, md: 3.5 }, backgroundColor: '#131B2E' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3, flexWrap: 'wrap', gap: 2 }}>
                  <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
                      <Typography variant="h5" sx={{ fontWeight: 900, color: '#ffffff' }}>
                        {currentPreviewStock.symbol}
                      </Typography>
                      <Typography sx={{ color: '#94A3B8', fontSize: '0.95rem', fontWeight: 600 }}>
                        {currentPreviewStock.name}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1.5 }}>
                      <Typography variant="h4" sx={{ fontWeight: 900, color: '#ffffff' }}>
                        ${Number(currentPreviewStock.price).toFixed(2)}
                      </Typography>
                      <Chip
                        label={`${Number(currentPreviewStock.change) >= 0 ? '+' : ''}${Number(currentPreviewStock.change).toFixed(2)} (${currentPreviewStock.changePercent}%)`}
                        size="small"
                        sx={{
                          bgcolor: Number(currentPreviewStock.change) >= 0 ? 'rgba(0, 208, 156, 0.2)' : 'rgba(244, 63, 94, 0.2)',
                          color: Number(currentPreviewStock.change) >= 0 ? '#00D09C' : '#F43F5E',
                          fontWeight: 800,
                          fontSize: '0.8rem',
                        }}
                      />
                    </Box>
                  </Box>

                  {/* Time Range Pills */}
                  <Box sx={{ display: 'flex', gap: 0.8, backgroundColor: 'rgba(255, 255, 255, 0.05)', p: 0.5, borderRadius: 2 }}>
                    {['1D', '1W', '1M', '1Y', 'ALL'].map((timeframe, i) => (
                      <Box
                        key={timeframe}
                        sx={{
                          px: 1.4,
                          py: 0.5,
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          borderRadius: 1.5,
                          cursor: 'pointer',
                          backgroundColor: i === 2 ? '#6D28D9' : 'transparent',
                          color: i === 2 ? '#ffffff' : '#94A3B8',
                        }}
                      >
                        {timeframe}
                      </Box>
                    ))}
                  </Box>
                </Box>

                {/* Simulated High-Res Chart Canvas Area */}
                <Box
                  sx={{
                    height: 180,
                    width: '100%',
                    position: 'relative',
                    borderRadius: 3,
                    background: 'linear-gradient(180deg, rgba(109, 40, 217, 0.15) 0%, rgba(15, 23, 42, 0) 100%)',
                    border: '1px dashed rgba(255, 255, 255, 0.1)',
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  {/* Visual SVG Sparkline */}
                  <svg width="100%" height="100%" viewBox="0 0 500 120" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#7C3AED" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#7C3AED" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M0,80 Q50,40 100,65 T200,30 T300,50 T400,20 T500,10 L500,120 L0,120 Z"
                      fill="url(#chartGrad)"
                    />
                    <path
                      d="M0,80 Q50,40 100,65 T200,30 T300,50 T400,20 T500,10"
                      fill="none"
                      stroke="#7C3AED"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                    />
                  </svg>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', color: '#64748B', fontSize: '0.75rem', fontWeight: 600 }}>
                    <span>09:15 AM (Open)</span>
                    <span>11:30 AM</span>
                    <span>01:45 PM</span>
                    <span>03:30 PM (Close)</span>
                  </Box>
                </Box>

                {/* Instant Order Preview Action Bar */}
                <Box
                  sx={{
                    mt: 3,
                    p: 2.2,
                    borderRadius: 3,
                    backgroundColor: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: 2,
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Button
                      variant={demoOrderSide === 'buy' ? 'contained' : 'outlined'}
                      onClick={() => setDemoOrderSide('buy')}
                      sx={{
                        backgroundColor: demoOrderSide === 'buy' ? '#00D09C' : 'transparent',
                        borderColor: '#00D09C',
                        color: demoOrderSide === 'buy' ? '#0F172A' : '#00D09C',
                        fontWeight: 800,
                        py: 0.8,
                        px: 2.5,
                        borderRadius: 2,
                        '&:hover': {
                          backgroundColor: '#00b889',
                        },
                      }}
                    >
                      BUY
                    </Button>
                    <Button
                      variant={demoOrderSide === 'sell' ? 'contained' : 'outlined'}
                      onClick={() => setDemoOrderSide('sell')}
                      sx={{
                        backgroundColor: demoOrderSide === 'sell' ? '#F43F5E' : 'transparent',
                        borderColor: '#F43F5E',
                        color: demoOrderSide === 'sell' ? '#ffffff' : '#F43F5E',
                        fontWeight: 800,
                        py: 0.8,
                        px: 2.5,
                        borderRadius: 2,
                        '&:hover': {
                          backgroundColor: '#e11d48',
                        },
                      }}
                    >
                      SELL
                    </Button>

                    <Typography sx={{ color: '#94A3B8', fontSize: '0.85rem', fontWeight: 600, ml: 1 }}>
                      Qty: <strong>{demoQty}</strong> • Est. Total:{' '}
                      <strong style={{ color: '#ffffff' }}>${(demoQty * Number(currentPreviewStock.price)).toFixed(2)}</strong>
                    </Typography>
                  </Box>

                  <Button
                    variant="contained"
                    onClick={() => handleSelectAndTrade(currentPreviewStock)}
                    endIcon={<FlashOnIcon />}
                    sx={{
                      background: 'linear-gradient(135deg, #6D28D9 0%, #7C3AED 100%)',
                      color: '#ffffff',
                      fontWeight: 800,
                      fontSize: '0.95rem',
                      px: 3,
                      py: 1,
                      borderRadius: 2.5,
                    }}
                  >
                    Execute in 1-Click
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Container>
      </Box>

      {/* 3. TRANSPARENT PRICING SECTION (UPSTOX HALLMARK: ₹0 AMC & ₹0 BROKERAGE) */}
      <Box id="pricing" sx={{ py: { xs: 8, md: 12 }, px: { xs: 2.5, sm: 4, md: 6 }, backgroundColor: '#ffffff' }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', maxWidth: 760, mx: 'auto', mb: 7 }}>
            <Chip
              label="PRICING TRANSPARENCY"
              sx={{
                bgcolor: '#F5F3FF',
                color: '#6D28D9',
                fontWeight: 800,
                fontSize: '0.78rem',
                letterSpacing: '0.08em',
                mb: 2,
              }}
            />
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: '2rem', md: '2.8rem' },
                fontWeight: 900,
                color: '#0F172A',
                letterSpacing: '-0.025em',
                mb: 2,
              }}
            >
              Unbeatable pricing. Zero hidden charges.
            </Typography>
            <Typography sx={{ color: '#64748B', fontSize: '1.15rem', lineHeight: 1.6 }}>
              Say goodbye to complicated rate cards and surprise annual maintenance fees.
            </Typography>
          </Box>

          <Grid container spacing={3.5}>
            {[
              {
                title: 'Demat Account Opening',
                price: '₹0',
                sub: 'Zero setup cost',
                desc: 'Open your 100% paperless demat & trading account in 5 minutes with Aadhaar e-Sign.',
                highlight: false,
                icon: <AccountBalanceWalletIcon sx={{ fontSize: 32, color: '#6D28D9' }} />,
              },
              {
                title: 'Account Maintenance (AMC)',
                price: '₹0',
                sub: 'Free for lifetime',
                desc: 'No monthly or annual maintenance charges forever. What you earn is what you keep.',
                highlight: true,
                badge: 'MOST POPULAR',
                icon: <CheckCircleIcon sx={{ fontSize: 32, color: '#00D09C' }} />,
              },
              {
                title: 'Mutual Funds & IPOs',
                price: '₹0',
                sub: 'Zero commission',
                desc: 'Invest in Direct Mutual Funds and apply for mainboard IPOs without paying a single rupee.',
                highlight: false,
                icon: <PieChartIcon sx={{ fontSize: 32, color: '#6D28D9' }} />,
              },
              {
                title: 'Equity Intraday & F&O',
                price: '₹20',
                sub: 'Per executed order',
                desc: 'Flat ₹20 or 0.05% (whichever is lower) on Futures, Options, and Intraday equity trades.',
                highlight: false,
                icon: <LayersIcon sx={{ fontSize: 32, color: '#6D28D9' }} />,
              },
            ].map((plan, i) => (
              <Grid item xs={12} sm={6} md={3} key={i}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    p: 3,
                    borderRadius: 4,
                    position: 'relative',
                    border: plan.highlight ? '2px solid #7C3AED' : '1px solid rgba(226, 232, 240, 0.9)',
                    boxShadow: plan.highlight ? '0 16px 36px rgba(109, 40, 217, 0.15)' : '0 4px 18px rgba(0,0,0,0.04)',
                    transform: plan.highlight ? { md: 'scale(1.03)' } : 'none',
                    transition: 'all 0.25s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 20px 40px rgba(109, 40, 217, 0.18)',
                    },
                  }}
                >
                  {plan.badge && (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: -12,
                        right: 20,
                        backgroundColor: '#6D28D9',
                        color: '#ffffff',
                        fontWeight: 800,
                        fontSize: '0.68rem',
                        letterSpacing: '0.08em',
                        px: 1.5,
                        py: 0.4,
                        borderRadius: 10,
                      }}
                    >
                      {plan.badge}
                    </Box>
                  )}
                  <Box sx={{ mb: 2 }}>{plan.icon}</Box>
                  <Typography variant="h6" sx={{ fontWeight: 800, color: '#0F172A', mb: 1 }}>
                    {plan.title}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, my: 1.5 }}>
                    <Typography variant="h3" sx={{ fontWeight: 900, color: plan.highlight ? '#6D28D9' : '#0F172A' }}>
                      {plan.price}
                    </Typography>
                    <Typography sx={{ color: '#64748B', fontSize: '0.88rem', fontWeight: 600 }}>
                      {plan.sub}
                    </Typography>
                  </Box>
                  <Typography sx={{ color: '#64748B', fontSize: '0.92rem', lineHeight: 1.6, flex: 1 }}>
                    {plan.desc}
                  </Typography>
                  <Divider sx={{ my: 2.5 }} />
                  <Button
                    variant={plan.highlight ? 'contained' : 'outlined'}
                    fullWidth
                    onClick={() => navigate('/register')}
                    sx={{
                      py: 1.2,
                      fontWeight: 700,
                      fontSize: '0.95rem',
                      borderRadius: 3,
                    }}
                  >
                    Start for Free
                  </Button>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* 4. MARKET WATCHLIST PREVIEW (EXPLORE REAL INSTRUMENTS) */}
      <Box id="stocks-preview" sx={{ py: { xs: 8, md: 12 }, px: { xs: 2.5, sm: 4, md: 6 }, backgroundColor: '#F8FAFC' }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, flexDirection: { xs: 'column', sm: 'row' }, gap: 2, mb: 5 }}>
            <Box>
              <Typography variant="h2" sx={{ fontSize: { xs: '1.8rem', md: '2.4rem' }, fontWeight: 900, color: '#0F172A', letterSpacing: '-0.02em', mb: 1 }}>
                Explore Trending Stocks & ETFs
              </Typography>
              <Typography sx={{ color: '#64748B', fontSize: '1.05rem' }}>
                Track real-time quotes, intraday highs, and instant market liquidity.
              </Typography>
            </Box>

            {/* Filter Tabs */}
            <Tabs
              value={selectedTab}
              onChange={(e, val) => setSelectedTab(val)}
              sx={{
                backgroundColor: '#ffffff',
                borderRadius: 3,
                p: 0.5,
                border: '1px solid rgba(226, 232, 240, 0.9)',
                minHeight: 'auto',
                '& .MuiTabs-indicator': { display: 'none' },
              }}
            >
              <Tab
                label="All Stocks"
                sx={{
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  borderRadius: 2.5,
                  minHeight: 38,
                  py: 0.5,
                  px: 2,
                  '&.Mui-selected': { bgcolor: '#6D28D9', color: '#ffffff' },
                }}
              />
              <Tab
                label="Top Gainers 🔥"
                sx={{
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  borderRadius: 2.5,
                  minHeight: 38,
                  py: 0.5,
                  px: 2,
                  '&.Mui-selected': { bgcolor: '#00D09C', color: '#0F172A' },
                }}
              />
              <Tab
                label="Top Losers"
                sx={{
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  borderRadius: 2.5,
                  minHeight: 38,
                  py: 0.5,
                  px: 2,
                  '&.Mui-selected': { bgcolor: '#F43F5E', color: '#ffffff' },
                }}
              />
            </Tabs>
          </Box>

          <Grid container spacing={3}>
            {getFilteredStocks().map((stock) => {
              const isUp = Number(stock.change) >= 0;
              return (
                <Grid item xs={12} sm={6} md={4} key={stock.symbol}>
                  <Card
                    sx={{
                      p: 3,
                      borderRadius: 3.5,
                      backgroundColor: '#ffffff',
                      border: '1px solid rgba(226, 232, 240, 0.9)',
                      boxShadow: '0 4px 18px rgba(0, 0, 0, 0.03)',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        transform: 'translateY(-3px)',
                        boxShadow: '0 12px 28px rgba(109, 40, 217, 0.12)',
                        borderColor: '#7C3AED',
                      },
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Box>
                        <Typography sx={{ fontWeight: 800, fontSize: '1.25rem', color: '#0F172A' }}>
                          {stock.symbol}
                        </Typography>
                        <Typography sx={{ fontSize: '0.85rem', color: '#64748B', fontWeight: 500 }}>
                          {stock.name}
                        </Typography>
                      </Box>
                      <Chip
                        label={`${isUp ? '+' : ''}${stock.changePercent}%`}
                        icon={isUp ? <TrendingUpIcon /> : <TrendingDownIcon />}
                        sx={{
                          bgcolor: isUp ? '#ECFDF5' : '#FFF1F2',
                          color: isUp ? '#00D09C' : '#F43F5E',
                          fontWeight: 800,
                          fontSize: '0.82rem',
                          borderRadius: 2,
                        }}
                      />
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', my: 2 }}>
                      <Box>
                        <Typography sx={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 600 }}>
                          CURRENT PRICE
                        </Typography>
                        <Typography variant="h5" sx={{ fontWeight: 900, color: '#0F172A' }}>
                          ${Number(stock.price).toFixed(2)}
                        </Typography>
                      </Box>

                      <Box sx={{ textAlign: 'right' }}>
                        <Typography sx={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 600 }}>
                          24H CHANGE
                        </Typography>
                        <Typography sx={{ fontWeight: 700, color: isUp ? '#00D09C' : '#F43F5E' }}>
                          {isUp ? '+' : ''}${Number(stock.change).toFixed(2)}
                        </Typography>
                      </Box>
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    <Button
                      fullWidth
                      variant="outlined"
                      onClick={() => handleSelectAndTrade(stock)}
                      sx={{
                        py: 1,
                        fontSize: '0.92rem',
                        fontWeight: 700,
                        borderRadius: 2.5,
                      }}
                    >
                      Trade {stock.symbol} ➔
                    </Button>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </Container>
      </Box>

      {/* 5. PRODUCT SUITE (STOCKS, F&O, MUTUAL FUNDS, IPOS) */}
      <Box id="products" sx={{ py: { xs: 8, md: 12 }, px: { xs: 2.5, sm: 4, md: 6 }, backgroundColor: '#ffffff' }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', maxWidth: 760, mx: 'auto', mb: 7 }}>
            <Chip
              label="UPSTOX ECOSYSTEM"
              sx={{
                bgcolor: '#F5F3FF',
                color: '#6D28D9',
                fontWeight: 800,
                fontSize: '0.78rem',
                letterSpacing: '0.08em',
                mb: 2,
              }}
            />
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: '2rem', md: '2.8rem' },
                fontWeight: 900,
                color: '#0F172A',
                letterSpacing: '-0.025em',
                mb: 2,
              }}
            >
              One account for all your wealth needs
            </Typography>
            <Typography sx={{ color: '#64748B', fontSize: '1.15rem' }}>
              Whether you are a long-term investor or an intraday scalper, we have built the perfect tools for you.
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {[
              {
                title: 'Stocks & Equity Delivery',
                desc: 'Invest in 5000+ listed companies with ₹0 brokerage on equity delivery. Free delivery to your Demat account.',
                features: ['Zero brokerage on delivery', 'GTT automated triggers', 'Fundamental insights & ratios'],
                icon: <ShowChartIcon sx={{ fontSize: 36, color: '#6D28D9' }} />,
              },
              {
                title: 'Futures & Options (F&O)',
                desc: 'High-speed derivative trading with Greeks, Payoff Graphs, Option Chain, and 1-click Basket Orders.',
                features: ['Flat ₹20 per trade', 'Interactive Option Chain', 'Instant margin pledge benefits'],
                icon: <LayersIcon sx={{ fontSize: 36, color: '#6D28D9' }} />,
              },
              {
                title: 'Direct Mutual Funds',
                desc: 'Invest in direct plans of 2,500+ mutual funds. Earn up to 1.5% extra return by cutting middleman commissions.',
                features: ['0% distributor commission', 'Automated Daily/Monthly SIPs', 'Instant portfolio rebalancing'],
                icon: <PieChartIcon sx={{ fontSize: 36, color: '#6D28D9' }} />,
              },
              {
                title: 'IPOs & Sovereign Gold',
                desc: 'Apply for high-potential IPOs in under 60 seconds with UPI auto-mandate. Track subscription status live.',
                features: ['Instant UPI auto-mandate', 'Pre-apply before open date', 'Live allotment tracking'],
                icon: <CurrencyExchangeIcon sx={{ fontSize: 36, color: '#6D28D9' }} />,
              },
            ].map((prod, i) => (
              <Grid item xs={12} sm={6} key={i}>
                <Card
                  sx={{
                    p: 4,
                    height: '100%',
                    borderRadius: 4,
                    border: '1px solid rgba(226, 232, 240, 0.9)',
                    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.03)',
                    transition: 'all 0.25s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      borderColor: '#7C3AED',
                      boxShadow: '0 16px 36px rgba(109, 40, 217, 0.12)',
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: 60,
                      height: 60,
                      borderRadius: 3,
                      backgroundColor: '#F5F3FF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 2.5,
                    }}
                  >
                    {prod.icon}
                  </Box>
                  <Typography variant="h5" sx={{ fontWeight: 800, color: '#0F172A', mb: 1.5 }}>
                    {prod.title}
                  </Typography>
                  <Typography sx={{ color: '#64748B', fontSize: '1rem', lineHeight: 1.6, mb: 3 }}>
                    {prod.desc}
                  </Typography>

                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {prod.features.map((feat, idx) => (
                      <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CheckCircleIcon sx={{ fontSize: 18, color: '#00D09C' }} />
                        <Typography sx={{ fontSize: '0.92rem', fontWeight: 600, color: '#334155' }}>
                          {feat}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* 6. WHY STOCKFLOW / UPSTOX PRO (PRO TRADING ADVANTAGES) */}
      <Box id="features" sx={{ py: { xs: 8, md: 12 }, px: { xs: 2.5, sm: 4, md: 6 }, backgroundColor: '#0B0F19', color: '#ffffff' }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', maxWidth: 760, mx: 'auto', mb: 8 }}>
            <Chip
              label="TECHNOLOGY FIRST"
              sx={{
                bgcolor: 'rgba(109, 40, 217, 0.2)',
                color: '#A78BFA',
                fontWeight: 800,
                fontSize: '0.78rem',
                letterSpacing: '0.08em',
                mb: 2,
              }}
            />
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: '2rem', md: '2.8rem' },
                fontWeight: 900,
                letterSpacing: '-0.025em',
                mb: 2,
              }}
            >
              Engineered for speed, built for reliability
            </Typography>
            <Typography sx={{ color: '#94A3B8', fontSize: '1.15rem' }}>
              State of the art infrastructure trusted by pro traders handling millions of trades daily.
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {[
              {
                icon: <SpeedIcon sx={{ fontSize: 36, color: '#00D09C' }} />,
                title: 'Ultra-low Latency (<15ms)',
                desc: 'Direct-to-exchange algorithmic order routing ensures your market orders execute with near-zero slippage.',
              },
              {
                icon: <SecurityIcon sx={{ fontSize: 36, color: '#7C3AED' }} />,
                title: 'Bank-Grade 256-bit Encryption',
                desc: 'Certified ISO 27001 data center protection with 2FA biometric safeguards and secure JWT sessions.',
              },
              {
                icon: <FlashOnIcon sx={{ fontSize: 36, color: '#F59E0B' }} />,
                title: 'WebSocket Live Streams',
                desc: 'Real-time price ticks pushed instantly over lightweight WebSockets without browser polling or delays.',
              },
              {
                icon: <ShieldOutlinedIcon sx={{ fontSize: 36, color: '#00D09C' }} />,
                title: '99.99% Trading Uptime',
                desc: 'Redundant multi-region cloud servers guarantee uncompromised uptime during peak market volatility hours.',
              },
            ].map((item, idx) => (
              <Grid item xs={12} sm={6} md={3} key={idx}>
                <Box
                  sx={{
                    p: 3.5,
                    borderRadius: 4,
                    backgroundColor: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.06)',
                      borderColor: '#7C3AED',
                    },
                  }}
                >
                  <Box sx={{ mb: 2 }}>{item.icon}</Box>
                  <Typography variant="h6" sx={{ fontWeight: 800, mb: 1.5, color: '#ffffff' }}>
                    {item.title}
                  </Typography>
                  <Typography sx={{ color: '#94A3B8', fontSize: '0.92rem', lineHeight: 1.6 }}>
                    {item.desc}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* 7. STATS & SOCIAL PROOF BANNER */}
      <Box sx={{ py: 6, px: { xs: 2.5, sm: 4, md: 6 }, backgroundColor: '#6D28D9', color: '#ffffff' }}>
        <Container maxWidth="lg">
          <Grid container spacing={4} sx={{ textAlign: 'center' }}>
            {[
              { num: '10M+', label: 'Registered Investors' },
              { num: '₹50,000 Cr+', label: 'Daily Trading Turnover' },
              { num: '4.6 ★', label: 'Play Store & App Store Rating' },
              { num: '0.015s', label: 'Average Execution Speed' },
            ].map((stat, i) => (
              <Grid item xs={6} md={3} key={i}>
                <Typography variant="h3" sx={{ fontWeight: 900, mb: 0.5, fontSize: { xs: '1.8rem', md: '2.5rem' } }}>
                  {stat.num}
                </Typography>
                <Typography sx={{ fontSize: '0.95rem', fontWeight: 600, opacity: 0.9 }}>
                  {stat.label}
                </Typography>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* 8. TESTIMONIALS */}
      <Box sx={{ py: { xs: 8, md: 12 }, px: { xs: 2.5, sm: 4, md: 6 }, backgroundColor: '#ffffff' }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', maxWidth: 760, mx: 'auto', mb: 7 }}>
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: '2rem', md: '2.6rem' },
                fontWeight: 900,
                color: '#0F172A',
                letterSpacing: '-0.025em',
                mb: 1.5,
              }}
            >
              Loved by 1 Crore+ Indian traders
            </Typography>
            <Typography sx={{ color: '#64748B', fontSize: '1.1rem' }}>
              See why active market participants choose StockFlow over traditional brokers.
            </Typography>
          </Box>

          <Grid container spacing={3.5}>
            {[
              {
                name: 'Vikram Mehta',
                role: 'Full-time Options Scalper',
                text: 'The order execution speed on StockFlow is indistinguishable from institutional terminals. Flat ₹20 on F&O saves me over ₹30,000 every single month in brokerage fees!',
                rating: 5,
              },
              {
                name: 'Pooja Sharma',
                role: 'Long-term Equity Investor',
                text: 'Moving my portfolio here was effortless. Zero AMC for life and zero delivery brokerage means my dividends and compounding returns are 100% mine.',
                rating: 5,
              },
              {
                name: 'Rahul Deshmukh',
                role: 'Tech Lead & Part-time Trader',
                text: 'Clean UI, zero clutter, and instantaneous WebSocket chart updates. By far the slickest trading experience in India right now!',
                rating: 5,
              },
            ].map((review, i) => (
              <Grid item xs={12} md={4} key={i}>
                <Card
                  sx={{
                    p: 3.5,
                    height: '100%',
                    borderRadius: 4,
                    border: '1px solid rgba(226, 232, 240, 0.9)',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <Box>
                    <Rating value={review.rating} readOnly sx={{ color: '#F59E0B', mb: 2 }} />
                    <Typography sx={{ color: '#334155', fontSize: '1rem', lineHeight: 1.6, fontStyle: 'italic', mb: 3 }}>
                      "{review.text}"
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Avatar sx={{ bgcolor: '#6D28D9', fontWeight: 800 }}>
                      {review.name.charAt(0)}
                    </Avatar>
                    <Box>
                      <Typography sx={{ fontWeight: 800, fontSize: '0.98rem', color: '#0F172A' }}>
                        {review.name}
                      </Typography>
                      <Typography sx={{ fontSize: '0.8rem', color: '#64748B' }}>
                        {review.role}
                      </Typography>
                    </Box>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* 9. BOTTOM CTA CONVERSION BANNER (LIKE UPSTOX OPEN DEMAT) */}
      <Box
        sx={{
          py: { xs: 8, md: 10 },
          px: { xs: 2.5, sm: 4, md: 6 },
          background: 'linear-gradient(135deg, #4A1D96 0%, #6D28D9 50%, #7C3AED 100%)',
          color: '#ffffff',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: '2.2rem', md: '3.2rem' },
              fontWeight: 900,
              letterSpacing: '-0.03em',
              mb: 2.5,
            }}
          >
            Ready to trade like a pro?
          </Typography>
          <Typography sx={{ fontSize: { xs: '1.05rem', md: '1.25rem' }, opacity: 0.9, maxWidth: 650, mx: 'auto', mb: 4.5 }}>
            Open your free Demat account online in under 5 minutes with zero paperwork and ₹0 AMC for life.
          </Typography>

          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              size="large"
              component={Link}
              to="/register"
              endIcon={<ArrowForwardIcon />}
              sx={{
                backgroundColor: '#ffffff',
                color: '#6D28D9',
                fontWeight: 800,
                fontSize: '1.15rem',
                px: 5,
                py: 1.8,
                borderRadius: 3.5,
                boxShadow: '0 10px 30px rgba(0,0,0,0.25)',
                '&:hover': {
                  backgroundColor: '#F8FAFC',
                  transform: 'translateY(-2px)',
                },
              }}
            >
              Open Free Demat Account
            </Button>
            <Button
              variant="outlined"
              size="large"
              component={Link}
              to="/login"
              sx={{
                borderColor: 'rgba(255, 255, 255, 0.4)',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '1.15rem',
                px: 4,
                py: 1.8,
                borderRadius: 3.5,
                '&:hover': {
                  borderColor: '#ffffff',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                },
              }}
            >
              Sign In to Web
            </Button>
          </Box>
        </Container>
      </Box>

      {/* 10. COMPREHENSIVE FINTECH FOOTER */}
      <Box sx={{ py: 8, px: { xs: 2.5, sm: 4, md: 6 }, backgroundColor: '#0B0F19', color: '#94A3B8' }}>
        <Container maxWidth="lg">
          <Grid container spacing={5} sx={{ mb: 6 }}>
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, mb: 2 }}>
                <Box
                  sx={{
                    width: 38,
                    height: 38,
                    borderRadius: '10px',
                    background: 'linear-gradient(135deg, #6D28D9 0%, #7C3AED 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <TrendingUpIcon sx={{ color: '#ffffff', fontSize: 22 }} />
                </Box>
                <Typography variant="h5" sx={{ fontWeight: 900, color: '#ffffff' }}>
                  Stock<span style={{ color: '#7C3AED' }}>Flow</span>
                </Typography>
              </Box>
              <Typography sx={{ fontSize: '0.88rem', lineHeight: 1.7, mb: 2 }}>
                StockFlow is a modern FinTech brokerage platform engineered to deliver institutional-grade trading tools, lightning fast execution, and ₹0 AMC to millions of retail investors.
              </Typography>
              <Typography sx={{ fontSize: '0.78rem', color: '#64748B' }}>
                SEBI Registration No: INZ000185137 • NSE / BSE / MCX Member • CDSL DP ID: 120888400
              </Typography>
            </Grid>

            <Grid item xs={6} sm={4} md={2}>
              <Typography sx={{ fontWeight: 800, color: '#ffffff', mb: 2, fontSize: '0.95rem' }}>
                Products
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.2, fontSize: '0.88rem' }}>
                <Link to="/register" style={{ color: '#94A3B8', textDecoration: 'none' }}>Stocks</Link>
                <Link to="/register" style={{ color: '#94A3B8', textDecoration: 'none' }}>Futures & Options</Link>
                <Link to="/register" style={{ color: '#94A3B8', textDecoration: 'none' }}>Mutual Funds</Link>
                <Link to="/register" style={{ color: '#94A3B8', textDecoration: 'none' }}>Mainboard IPOs</Link>
                <Link to="/register" style={{ color: '#94A3B8', textDecoration: 'none' }}>TradingView Charts</Link>
              </Box>
            </Grid>

            <Grid item xs={6} sm={4} md={3}>
              <Typography sx={{ fontWeight: 800, color: '#ffffff', mb: 2, fontSize: '0.95rem' }}>
                Company & Policies
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.2, fontSize: '0.88rem' }}>
                <Link to="/" style={{ color: '#94A3B8', textDecoration: 'none' }}>About StockFlow</Link>
                <Link to="/#pricing" style={{ color: '#94A3B8', textDecoration: 'none' }}>Pricing & Brokerage</Link>
                <Link to="/" style={{ color: '#94A3B8', textDecoration: 'none' }}>Investor Charter</Link>
                <Link to="/" style={{ color: '#94A3B8', textDecoration: 'none' }}>Privacy Policy</Link>
                <Link to="/" style={{ color: '#94A3B8', textDecoration: 'none' }}>Terms & Conditions</Link>
              </Box>
            </Grid>

            <Grid item xs={12} sm={4} md={3}>
              <Typography sx={{ fontWeight: 800, color: '#ffffff', mb: 2, fontSize: '0.95rem' }}>
                Support & Help
              </Typography>
              <Typography sx={{ fontSize: '0.88rem', mb: 1 }}>
                Email: support@stockflow.io
              </Typography>
              <Typography sx={{ fontSize: '0.88rem', mb: 2 }}>
                Toll Free: 1800-419-7869 (Mon - Fri: 9:00 AM - 6:00 PM)
              </Typography>
              <Box sx={{ p: 2, borderRadius: 2.5, bgcolor: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                <Typography sx={{ fontSize: '0.78rem', color: '#64748B' }}>
                  Smart ODR portal & SEBI SCORES online grievance redressal mechanism active.
                </Typography>
              </Box>
            </Grid>
          </Grid>

          <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.08)', my: 4 }} />

          <Typography sx={{ fontSize: '0.74rem', color: '#475569', lineHeight: 1.6, textAlign: 'justify' }}>
            <strong>Disclaimer:</strong> Investments in securities market are subject to market risks, read all the related documents carefully before investing. Brokerage will not exceed the SEBI prescribed limit. Please read the Risk Disclosure Document issued by SEBI & relevant stock exchanges carefully before trading in equity derivatives and shares.
          </Typography>

          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
            <Typography sx={{ fontSize: '0.78rem', color: '#64748B' }}>
              © 2026 StockFlow Technologies Pvt. Ltd. All Rights Reserved.
            </Typography>
            <Typography sx={{ fontSize: '0.78rem', color: '#64748B' }}>
              Made with precision for Indian Capital Markets.
            </Typography>
          </Box>
        </Container>
      </Box>

    </Box>
  );
}
