import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  IconButton,
  Switch,
  FormControlLabel,
  Slider,
  TextField,
  Divider,
  Tabs,
  Tab,
  Alert,
  Tooltip,
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import TuneIcon from '@mui/icons-material/Tune';
import SecurityIcon from '@mui/icons-material/Security';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import LayersIcon from '@mui/icons-material/Layers';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, registerables } from 'chart.js';
import { fetchHistory, selectStock } from '../store/slices/marketSlice';
import { fetchOrders } from '../store/slices/demoSlice';
import DemoTradeModal from '../components/DemoTradeModal';
import {
  calculateSMA,
  calculateEMA,
  calculateBollingerBands,
  calculateRSI,
  calculateSupportResistance,
  evaluateStrategyScore,
} from '../utils/technicalAnalysis';

ChartJS.register(...registerables);

const TIMEFRAMES = [
  { label: '1D', days: 1 },
  { label: '5D', days: 5 },
  { label: '1M', days: 30 },
  { label: '3M', days: 90 },
  { label: '1Y', days: 365 },
];

export default function StockDetail() {
  const { symbol } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { stocks, history } = useSelector((state) => state.market);
  const { cashBalance, holdings, orders } = useSelector((state) => state.demo);

  // Timeframe state
  const [activeTimeframe, setActiveTimeframe] = useState(30);

  // Strategy & Line Toggles
  const [showSMA, setShowSMA] = useState(true);
  const [showEMA, setShowEMA] = useState(true);
  const [showBollinger, setShowBollinger] = useState(false);
  const [showAutoSR, setShowAutoSR] = useState(true);
  const [showRSI, setShowRSI] = useState(true);

  // Custom Strategy Line Maker States
  const [enableCustomStrategy, setEnableCustomStrategy] = useState(true);
  const [customSupport, setCustomSupport] = useState(null);
  const [customResistance, setCustomResistance] = useState(null);
  const [customTarget, setCustomTarget] = useState(null);
  const [customStopLoss, setCustomStopLoss] = useState(null);

  // Modal State
  const [tradeModalOpen, setTradeModalOpen] = useState(false);
  const [tradeModalSide, setTradeModalSide] = useState('buy');

  // Find stock in store or construct fallback
  const stock = useMemo(() => {
    const found = stocks.find((s) => s.symbol === symbol?.toUpperCase());
    if (found) return found;
    return {
      symbol: symbol?.toUpperCase() || 'AAPL',
      name: `${symbol?.toUpperCase()} Corp.`,
      sector: 'Technology',
      price: 185.5,
      change: 2.4,
      changePercent: '1.31',
      dayHigh: 188.2,
      dayLow: 184.1,
      high52: 237.2,
      low52: 164.0,
      pe: 32.4,
      marketCap: '3.2T',
      volume: 45200000,
    };
  }, [stocks, symbol]);

  // Load history and orders whenever symbol or timeframe changes
  useEffect(() => {
    if (symbol) {
      dispatch(fetchHistory({ symbol: symbol.toUpperCase(), days: activeTimeframe }));
      dispatch(fetchOrders());
    }
  }, [symbol, activeTimeframe, dispatch]);

  const rawHistory = history?.history || [];

  // Initialize custom strategy lines based on current price once data arrives
  useEffect(() => {
    if (stock?.price && customSupport === null) {
      const p = Number(stock.price);
      setCustomSupport(parseFloat((p * 0.95).toFixed(2)));
      setCustomResistance(parseFloat((p * 1.05).toFixed(2)));
      setCustomTarget(parseFloat((p * 1.1).toFixed(2)));
      setCustomStopLoss(parseFloat((p * 0.92).toFixed(2)));
    }
  }, [stock, customSupport]);

  // Technical Calculations
  const sma20 = useMemo(() => calculateSMA(rawHistory, 20), [rawHistory]);
  const ema50 = useMemo(() => calculateEMA(rawHistory, 50), [rawHistory]);
  const bollinger = useMemo(() => calculateBollingerBands(rawHistory, 20), [rawHistory]);
  const rsi = useMemo(() => calculateRSI(rawHistory, 14), [rawHistory]);
  const autoSR = useMemo(() => calculateSupportResistance(rawHistory), [rawHistory]);

  const strategyInsight = useMemo(() => {
    return evaluateStrategyScore(stock.price, rawHistory, rsi, sma20, ema50);
  }, [stock.price, rawHistory, rsi, sma20, ema50]);

  // User holdings in this stock
  const currentHolding = holdings[stock.symbol];
  const userShares = currentHolding ? currentHolding.quantity : 0;
  const userInvested = currentHolding ? currentHolding.totalInvested : 0;
  const userCurrentVal = currentHolding ? userShares * stock.price : 0;
  const userPnl = userCurrentVal - userInvested;
  const userPnlPercent = userInvested > 0 ? (userPnl / userInvested) * 100 : 0;

  // Recent orders for this stock
  const stockOrders = orders.filter(
    (o) => (o.symbol || '').toUpperCase() === (stock.symbol || '').toUpperCase()
  );

  // Risk / Reward Ratio for custom strategy lines
  const riskRewardRatio = useMemo(() => {
    if (!customTarget || !customStopLoss || !stock.price) return null;
    const potentialGain = customTarget - stock.price;
    const potentialRisk = stock.price - customStopLoss;
    if (potentialRisk <= 0) return null;
    return (potentialGain / potentialRisk).toFixed(2);
  }, [customTarget, customStopLoss, stock.price]);

  // Prepare Chart.js datasets
  const chartData = useMemo(() => {
    if (rawHistory.length === 0) return { labels: [], datasets: [] };

    const labels = rawHistory.map((d) => d.time);
    const prices = rawHistory.map((d) => d.price);

    const datasets = [
      {
        label: `${stock.symbol} Price`,
        data: prices,
        borderColor: '#7C3AED',
        borderWidth: 2.8,
        backgroundColor: (context) => {
          const ctx = context.chart?.ctx;
          if (!ctx) return 'rgba(124, 58, 237, 0.15)';
          const gradient = ctx.createLinearGradient(0, 0, 0, 360);
          gradient.addColorStop(0, 'rgba(124, 58, 237, 0.32)');
          gradient.addColorStop(1, 'rgba(124, 58, 237, 0.0)');
          return gradient;
        },
        fill: true,
        tension: 0.25,
        pointRadius: 0,
        pointHoverRadius: 6,
        pointHitRadius: 10,
      },
    ];

    // SMA 20 Overlay
    if (showSMA) {
      datasets.push({
        label: 'SMA 20 (Short Trend)',
        data: sma20,
        borderColor: '#06B6D4',
        borderWidth: 1.8,
        borderDash: [4, 4],
        fill: false,
        pointRadius: 0,
        tension: 0.25,
      });
    }

    // EMA 50 Overlay
    if (showEMA) {
      datasets.push({
        label: 'EMA 50 (Long Trend)',
        data: ema50,
        borderColor: '#F59E0B',
        borderWidth: 2,
        fill: false,
        pointRadius: 0,
        tension: 0.25,
      });
    }

    // Bollinger Bands
    if (showBollinger) {
      datasets.push(
        {
          label: 'Upper Band (+2σ)',
          data: bollinger.upper,
          borderColor: 'rgba(16, 185, 129, 0.7)',
          borderWidth: 1.2,
          borderDash: [3, 3],
          fill: false,
          pointRadius: 0,
        },
        {
          label: 'Lower Band (-2σ)',
          data: bollinger.lower,
          borderColor: 'rgba(239, 68, 68, 0.7)',
          borderWidth: 1.2,
          borderDash: [3, 3],
          fill: false,
          pointRadius: 0,
        }
      );
    }

    // Dynamic Auto Support & Resistance
    if (showAutoSR && autoSR.support && autoSR.resistance) {
      datasets.push(
        {
          label: `Auto Support ($${autoSR.support.toFixed(2)})`,
          data: new Array(prices.length).fill(autoSR.support),
          borderColor: '#10B981',
          borderWidth: 1.5,
          borderDash: [6, 4],
          fill: false,
          pointRadius: 0,
        },
        {
          label: `Auto Resistance ($${autoSR.resistance.toFixed(2)})`,
          data: new Array(prices.length).fill(autoSR.resistance),
          borderColor: '#EF4444',
          borderWidth: 1.5,
          borderDash: [6, 4],
          fill: false,
          pointRadius: 0,
        }
      );
    }

    // Interactive Custom Strategy Lines
    if (enableCustomStrategy) {
      if (customSupport) {
        datasets.push({
          label: `Strategy Support ($${customSupport.toFixed(2)})`,
          data: new Array(prices.length).fill(customSupport),
          borderColor: '#059669',
          borderWidth: 2.2,
          borderDash: [8, 4],
          fill: false,
          pointRadius: 0,
        });
      }
      if (customResistance) {
        datasets.push({
          label: `Strategy Resistance ($${customResistance.toFixed(2)})`,
          data: new Array(prices.length).fill(customResistance),
          borderColor: '#DC2626',
          borderWidth: 2.2,
          borderDash: [8, 4],
          fill: false,
          pointRadius: 0,
        });
      }
      if (customTarget) {
        datasets.push({
          label: `Strategy Target ($${customTarget.toFixed(2)})`,
          data: new Array(prices.length).fill(customTarget),
          borderColor: '#0284C7',
          borderWidth: 2.2,
          borderDash: [5, 5],
          fill: false,
          pointRadius: 0,
        });
      }
      if (customStopLoss) {
        datasets.push({
          label: `Strategy Stop Loss ($${customStopLoss.toFixed(2)})`,
          data: new Array(prices.length).fill(customStopLoss),
          borderColor: '#E11D48',
          borderWidth: 2.2,
          borderDash: [5, 5],
          fill: false,
          pointRadius: 0,
        });
      }
    }

    return { labels, datasets };
  }, [
    rawHistory,
    stock.symbol,
    showSMA,
    showEMA,
    showBollinger,
    showAutoSR,
    enableCustomStrategy,
    customSupport,
    customResistance,
    customTarget,
    customStopLoss,
    sma20,
    ema50,
    bollinger,
    autoSR,
  ]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          color: '#475569',
          boxWidth: 12,
          font: { weight: '700', size: 11 },
        },
      },
      tooltip: {
        backgroundColor: '#0F172A',
        titleFont: { weight: 'bold', size: 12 },
        bodyFont: { size: 12, weight: '600' },
        padding: 12,
        borderRadius: 8,
        callbacks: {
          label: (ctx) => `${ctx.dataset.label}: $${Number(ctx.raw).toFixed(2)}`,
        },
      },
    },
    scales: {
      x: {
        grid: { color: 'rgba(226, 232, 240, 0.6)' },
        ticks: { color: '#64748B', font: { size: 11, weight: '600' }, maxTicksLimit: 8 },
      },
      y: {
        grid: { color: 'rgba(226, 232, 240, 0.6)' },
        ticks: {
          color: '#64748B',
          font: { size: 11, weight: '600' },
          callback: (val) => `$${Number(val).toFixed(0)}`,
        },
      },
    },
  };

  // RSI Chart Data
  const rsiChartData = useMemo(() => {
    if (!rsi || rsi.length === 0) return null;
    const labels = rawHistory.map((d) => d.time);
    return {
      labels,
      datasets: [
        {
          label: 'RSI (14)',
          data: rsi,
          borderColor: '#8B5CF6',
          borderWidth: 2,
          pointRadius: 0,
          fill: false,
        },
        {
          label: 'Overbought (70)',
          data: new Array(rsi.length).fill(70),
          borderColor: 'rgba(244, 63, 94, 0.5)',
          borderWidth: 1,
          borderDash: [4, 4],
          pointRadius: 0,
        },
        {
          label: 'Oversold (30)',
          data: new Array(rsi.length).fill(30),
          borderColor: 'rgba(0, 208, 156, 0.5)',
          borderWidth: 1,
          borderDash: [4, 4],
          pointRadius: 0,
        },
      ],
    };
  }, [rsi, rawHistory]);

  const rsiOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#0F172A',
        callbacks: { label: (ctx) => `RSI: ${ctx.raw}` },
      },
    },
    scales: {
      x: { display: false },
      y: {
        min: 0,
        max: 100,
        ticks: { stepSize: 30, color: '#94A3B8', font: { size: 10 } },
        grid: { color: 'rgba(226, 232, 240, 0.5)' },
      },
    },
  };

  const isUp = Number(stock.change) >= 0;

  const openBuyModal = () => {
    setTradeModalSide('buy');
    setTradeModalOpen(true);
  };

  const openSellModal = () => {
    setTradeModalSide('sell');
    setTradeModalOpen(true);
  };

  return (
    <Box sx={{ py: 3, px: { xs: 2, sm: 3, md: 4 }, minHeight: 'calc(100vh - 108px)', bgcolor: '#F8FAFC' }}>
      <Container maxWidth="xl">
        {/* Navigation Breadcrumb & Back */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2.5 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/dashboard')}
            sx={{
              color: '#475569',
              fontWeight: 700,
              fontSize: '0.95rem',
              borderRadius: 2.5,
              px: 2,
              py: 0.8,
              bgcolor: '#ffffff',
              border: '1px solid #E2E8F0',
              '&:hover': { bgcolor: '#F1F5F9', color: '#0F172A' },
            }}
          >
            Back to Markets
          </Button>

          {/* Available Margin Pill */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              px: 2.5,
              py: 1,
              bgcolor: '#ffffff',
              borderRadius: 3,
              border: '1px solid #E2E8F0',
              boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
            }}
          >
            <AccountBalanceWalletIcon sx={{ color: '#6D28D9', fontSize: 22 }} />
            <Box>
              <Typography sx={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 700 }}>
                DEMO AVAILABLE CASH
              </Typography>
              <Typography sx={{ fontSize: '1rem', fontWeight: 900, color: '#0F172A' }}>
                ${cashBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Stock Primary Header Card */}
        <Card
          sx={{
            p: 3,
            borderRadius: 4,
            mb: 3.5,
            border: '1px solid rgba(226, 232, 240, 0.9)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
            bgcolor: '#ffffff',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              flexWrap: 'wrap',
              gap: 2.5,
            }}
          >
            {/* Stock Identity & Live Price */}
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.8 }}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 3,
                    bgcolor: '#F5F3FF',
                    color: '#6D28D9',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 900,
                    fontSize: '1.2rem',
                    border: '1px solid rgba(109, 40, 217, 0.2)',
                  }}
                >
                  {stock.symbol.slice(0, 2)}
                </Box>
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="h4" sx={{ fontWeight: 900, color: '#0F172A' }}>
                      {stock.symbol}
                    </Typography>
                    <Chip label={stock.exchange || 'NASDAQ'} size="small" sx={{ fontWeight: 700, fontSize: '0.72rem' }} />
                    <Chip
                      label={stock.sector || 'Technology'}
                      size="small"
                      sx={{ bgcolor: '#F1F5F9', color: '#475569', fontWeight: 700, fontSize: '0.72rem' }}
                    />
                  </Box>
                  <Typography variant="body1" sx={{ color: '#64748B', fontWeight: 500 }}>
                    {stock.name}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 2, mt: 1 }}>
                <Typography variant="h3" sx={{ fontWeight: 900, color: '#0F172A', fontSize: { xs: '2rem', md: '2.5rem' } }}>
                  ${Number(stock.price).toFixed(2)}
                </Typography>
                <Chip
                  label={`${isUp ? '+' : ''}${stock.changePercent}% (${isUp ? '+' : ''}$${Number(stock.change).toFixed(2)})`}
                  icon={isUp ? <TrendingUpIcon /> : <TrendingDownIcon />}
                  sx={{
                    bgcolor: isUp ? '#ECFDF5' : '#FFF1F2',
                    color: isUp ? '#00D09C' : '#F43F5E',
                    fontWeight: 900,
                    fontSize: '0.95rem',
                    borderRadius: 2.5,
                    px: 1,
                    '& .MuiChip-icon': { color: isUp ? '#00D09C' : '#F43F5E' },
                  }}
                />
              </Box>
            </Box>

            {/* Quick Metrics Bar */}
            <Box
              sx={{
                display: 'flex',
                gap: 3,
                flexWrap: 'wrap',
                p: 2,
                borderRadius: 3,
                bgcolor: '#F8FAFC',
                border: '1px solid #E2E8F0',
              }}
            >
              <Box>
                <Typography sx={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 700 }}>24H HIGH / LOW</Typography>
                <Typography sx={{ fontSize: '0.95rem', fontWeight: 800, color: '#0F172A' }}>
                  ${stock.dayHigh ? Number(stock.dayHigh).toFixed(2) : (stock.price * 1.02).toFixed(2)} / $
                  {stock.dayLow ? Number(stock.dayLow).toFixed(2) : (stock.price * 0.98).toFixed(2)}
                </Typography>
              </Box>
              <Box>
                <Typography sx={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 700 }}>52-WEEK RANGE</Typography>
                <Typography sx={{ fontSize: '0.95rem', fontWeight: 800, color: '#0F172A' }}>
                  ${stock.low52 || '120.00'} - ${stock.high52 || '240.00'}
                </Typography>
              </Box>
              <Box>
                <Typography sx={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 700 }}>MARKET CAP</Typography>
                <Typography sx={{ fontSize: '0.95rem', fontWeight: 800, color: '#0F172A' }}>
                  ${stock.marketCap || '1.8T'}
                </Typography>
              </Box>
              <Box>
                <Typography sx={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 700 }}>VOLUME</Typography>
                <Typography sx={{ fontSize: '0.95rem', fontWeight: 800, color: '#0F172A' }}>
                  {stock.volume ? `${(stock.volume / 1000000).toFixed(1)}M` : '32.1M'}
                </Typography>
              </Box>
            </Box>

            {/* Direct Action Buttons: BUY and SELL */}
            <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
              <Button
                variant="contained"
                onClick={openBuyModal}
                startIcon={<FlashOnIcon />}
                sx={{
                  py: 1.5,
                  px: 3.5,
                  borderRadius: 3,
                  fontWeight: 900,
                  fontSize: '1.05rem',
                  background: 'linear-gradient(135deg, #00D09C 0%, #059669 100%)',
                  color: '#0F172A',
                  boxShadow: '0 8px 24px rgba(0, 208, 156, 0.4)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #00b889 0%, #047857 100%)',
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                BUY {stock.symbol}
              </Button>

              <Button
                variant="contained"
                onClick={openSellModal}
                disabled={userShares <= 0}
                sx={{
                  py: 1.5,
                  px: 3,
                  borderRadius: 3,
                  fontWeight: 900,
                  fontSize: '1.05rem',
                  bgcolor: userShares > 0 ? '#F43F5E' : '#E2E8F0',
                  color: userShares > 0 ? '#ffffff' : '#94A3B8',
                  boxShadow: userShares > 0 ? '0 8px 24px rgba(244, 63, 94, 0.35)' : 'none',
                  '&:hover': {
                    bgcolor: '#E11D48',
                    transform: userShares > 0 ? 'translateY(-2px)' : 'none',
                  },
                }}
              >
                SELL ({userShares})
              </Button>
            </Box>
          </Box>

          {/* User Holdings in this Stock pill if owned */}
          {userShares > 0 && (
            <Box
              sx={{
                mt: 2.5,
                p: 2,
                borderRadius: 3,
                bgcolor: '#F0FDF4',
                border: '1px solid #BBF7D0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 2,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <CheckCircleIcon sx={{ color: '#16A34A' }} />
                <Box>
                  <Typography sx={{ fontWeight: 800, color: '#14532D', fontSize: '0.95rem' }}>
                    Active Position: You hold {userShares} shares of {stock.symbol}
                  </Typography>
                  <Typography sx={{ fontSize: '0.8rem', color: '#166534' }}>
                    Avg Buy Price: <strong>${currentHolding.avgPrice.toFixed(2)}</strong> • Invested: <strong>${userInvested.toFixed(2)}</strong>
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ textAlign: 'right' }}>
                  <Typography sx={{ fontSize: '0.75rem', color: '#166534', fontWeight: 700 }}>POSITION P&L</Typography>
                  <Typography sx={{ fontSize: '1.1rem', fontWeight: 900, color: userPnl >= 0 ? '#16A34A' : '#DC2626' }}>
                    {userPnl >= 0 ? '+' : ''}${userPnl.toFixed(2)} ({userPnl >= 0 ? '+' : ''}{userPnlPercent.toFixed(2)}%)
                  </Typography>
                </Box>
                <Button
                  size="small"
                  variant="outlined"
                  color="error"
                  onClick={openSellModal}
                  sx={{ borderRadius: 2, fontWeight: 700 }}
                >
                  Exit Position
                </Button>
              </Box>
            </Box>
          )}
        </Card>

        {/* Main Grid: Chart & Strategies on Left, Order Ticket & Analysis on Right */}
        <Grid container spacing={3.5}>
          {/* Main Chart Column */}
          <Grid item xs={12} lg={8}>
            <Card sx={{ p: 3, borderRadius: 4, border: '1px solid rgba(226, 232, 240, 0.9)', mb: 3 }}>
              {/* Chart Toolbar: Timeframe & Indicators */}
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: 1.5,
                  mb: 2.5,
                }}
              >
                {/* Timeframes */}
                <Box sx={{ display: 'flex', gap: 0.8, bgcolor: '#F1F5F9', p: 0.5, borderRadius: 2.5 }}>
                  {TIMEFRAMES.map((tf) => (
                    <Button
                      key={tf.label}
                      size="small"
                      onClick={() => setActiveTimeframe(tf.days)}
                      sx={{
                        minWidth: 44,
                        py: 0.6,
                        px: 1.5,
                        borderRadius: 2,
                        fontWeight: 800,
                        fontSize: '0.82rem',
                        bgcolor: activeTimeframe === tf.days ? '#ffffff' : 'transparent',
                        color: activeTimeframe === tf.days ? '#6D28D9' : '#64748B',
                        boxShadow: activeTimeframe === tf.days ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
                        '&:hover': { bgcolor: activeTimeframe === tf.days ? '#ffffff' : 'rgba(0,0,0,0.04)' },
                      }}
                    >
                      {tf.label}
                    </Button>
                  ))}
                </Box>

                {/* Technical Indicator Overlay Checkboxes */}
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
                  <Chip
                    label="SMA 20"
                    size="small"
                    clickable
                    onClick={() => setShowSMA(!showSMA)}
                    sx={{
                      fontWeight: 800,
                      bgcolor: showSMA ? 'rgba(6, 182, 212, 0.15)' : '#F1F5F9',
                      color: showSMA ? '#0891B2' : '#64748B',
                      border: showSMA ? '1px solid #06B6D4' : 'none',
                    }}
                  />
                  <Chip
                    label="EMA 50"
                    size="small"
                    clickable
                    onClick={() => setShowEMA(!showEMA)}
                    sx={{
                      fontWeight: 800,
                      bgcolor: showEMA ? 'rgba(245, 158, 11, 0.15)' : '#F1F5F9',
                      color: showEMA ? '#D97706' : '#64748B',
                      border: showEMA ? '1px solid #F59E0B' : 'none',
                    }}
                  />
                  <Chip
                    label="Bollinger Bands"
                    size="small"
                    clickable
                    onClick={() => setShowBollinger(!showBollinger)}
                    sx={{
                      fontWeight: 800,
                      bgcolor: showBollinger ? 'rgba(16, 185, 129, 0.15)' : '#F1F5F9',
                      color: showBollinger ? '#059669' : '#64748B',
                      border: showBollinger ? '1px solid #10B981' : 'none',
                    }}
                  />
                  <Chip
                    label="Auto Support/Res"
                    size="small"
                    clickable
                    onClick={() => setShowAutoSR(!showAutoSR)}
                    sx={{
                      fontWeight: 800,
                      bgcolor: showAutoSR ? 'rgba(109, 40, 217, 0.15)' : '#F1F5F9',
                      color: showAutoSR ? '#6D28D9' : '#64748B',
                      border: showAutoSR ? '1px solid #7C3AED' : 'none',
                    }}
                  />
                </Box>
              </Box>

              {/* Pro Interactive Chart Canvas */}
              <Box sx={{ height: 380, position: 'relative' }}>
                <Line data={chartData} options={chartOptions} />
              </Box>

              {/* Sub-chart: RSI (14) Oscillator */}
              {showRSI && rsiChartData && (
                <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid #E2E8F0' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography sx={{ fontSize: '0.82rem', fontWeight: 800, color: '#64748B' }}>
                      RELATIVE STRENGTH INDEX (RSI 14) • Current: <strong>{strategyInsight.lastRsi}</strong>
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1.5 }}>
                      <Typography sx={{ fontSize: '0.72rem', color: '#10B981', fontWeight: 700 }}>
                        &lt;30 Oversold (Buy Zone)
                      </Typography>
                      <Typography sx={{ fontSize: '0.72rem', color: '#F43F5E', fontWeight: 700 }}>
                        &gt;70 Overbought (Sell Zone)
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ height: 95 }}>
                    <Line data={rsiChartData} options={rsiOptions} />
                  </Box>
                </Box>
              )}
            </Card>

            {/* Trading Strategy Builder / Line Maker Section */}
            <Card
              sx={{
                p: 3,
                borderRadius: 4,
                border: '1px solid rgba(226, 232, 240, 0.9)',
                bgcolor: '#ffffff',
                mb: 3,
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                  <TuneIcon sx={{ color: '#6D28D9' }} />
                  <Typography variant="h6" sx={{ fontWeight: 800, color: '#0F172A' }}>
                    Interactive Strategy Lines Maker
                  </Typography>
                </Box>
                <FormControlLabel
                  control={
                    <Switch
                      checked={enableCustomStrategy}
                      onChange={(e) => setEnableCustomStrategy(e.target.checked)}
                      color="secondary"
                    />
                  }
                  label={<Typography sx={{ fontWeight: 700, fontSize: '0.85rem' }}>Plot Strategy Lines</Typography>}
                />
              </Box>

              <Typography sx={{ fontSize: '0.85rem', color: '#64748B', mb: 2.5 }}>
                Position your custom Support, Resistance, Target Take-Profit, and Stop-Loss lines directly onto the chart to plan high-probability trading strategies.
              </Typography>

              {enableCustomStrategy && (
                <Grid container spacing={2.5}>
                  {/* Support Line Slider */}
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ p: 2, bgcolor: '#F0FDF4', borderRadius: 3, border: '1px solid #BBF7D0' }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography sx={{ fontSize: '0.82rem', fontWeight: 800, color: '#166534' }}>
                          STRATEGY SUPPORT LINE
                        </Typography>
                        <Typography sx={{ fontSize: '0.95rem', fontWeight: 900, color: '#15803D' }}>
                          ${customSupport ? customSupport.toFixed(2) : '0.00'}
                        </Typography>
                      </Box>
                      <Slider
                        value={customSupport || stock.price * 0.95}
                        min={parseFloat((stock.price * 0.75).toFixed(2))}
                        max={parseFloat(stock.price.toFixed(2))}
                        step={0.5}
                        onChange={(e, val) => setCustomSupport(Number(val))}
                        sx={{ color: '#16A34A' }}
                      />
                      <Typography sx={{ fontSize: '0.72rem', color: '#166534' }}>
                        Floor level where buy orders accumulate
                      </Typography>
                    </Box>
                  </Grid>

                  {/* Resistance Line Slider */}
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ p: 2, bgcolor: '#FEF2F2', borderRadius: 3, border: '1px solid #FECACA' }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography sx={{ fontSize: '0.82rem', fontWeight: 800, color: '#991B1B' }}>
                          STRATEGY RESISTANCE LINE
                        </Typography>
                        <Typography sx={{ fontSize: '0.95rem', fontWeight: 900, color: '#DC2626' }}>
                          ${customResistance ? customResistance.toFixed(2) : '0.00'}
                        </Typography>
                      </Box>
                      <Slider
                        value={customResistance || stock.price * 1.05}
                        min={parseFloat(stock.price.toFixed(2))}
                        max={parseFloat((stock.price * 1.3).toFixed(2))}
                        step={0.5}
                        onChange={(e, val) => setCustomResistance(Number(val))}
                        sx={{ color: '#EF4444' }}
                      />
                      <Typography sx={{ fontSize: '0.72rem', color: '#991B1B' }}>
                        Ceiling level where selling pressure peaks
                      </Typography>
                    </Box>
                  </Grid>

                  {/* Target Price Slider */}
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ p: 2, bgcolor: '#F0F9FF', borderRadius: 3, border: '1px solid #BAE6FD' }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography sx={{ fontSize: '0.82rem', fontWeight: 800, color: '#075985' }}>
                          PROFIT TARGET LINE
                        </Typography>
                        <Typography sx={{ fontSize: '0.95rem', fontWeight: 900, color: '#0284C7' }}>
                          ${customTarget ? customTarget.toFixed(2) : '0.00'} (
                          {customTarget && stock.price
                            ? `+${(((customTarget - stock.price) / stock.price) * 100).toFixed(1)}%`
                            : ''}
                          )
                        </Typography>
                      </Box>
                      <Slider
                        value={customTarget || stock.price * 1.1}
                        min={parseFloat(stock.price.toFixed(2))}
                        max={parseFloat((stock.price * 1.4).toFixed(2))}
                        step={0.5}
                        onChange={(e, val) => setCustomTarget(Number(val))}
                        sx={{ color: '#0284C7' }}
                      />
                      <Typography sx={{ fontSize: '0.72rem', color: '#0369A1' }}>
                        Exit level to lock in demo trading profit
                      </Typography>
                    </Box>
                  </Grid>

                  {/* Stop Loss Slider */}
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ p: 2, bgcolor: '#FFF1F2', borderRadius: 3, border: '1px solid #FFE4E6' }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography sx={{ fontSize: '0.82rem', fontWeight: 800, color: '#9F1239' }}>
                          STOP LOSS LINE
                        </Typography>
                        <Typography sx={{ fontSize: '0.95rem', fontWeight: 900, color: '#E11D48' }}>
                          ${customStopLoss ? customStopLoss.toFixed(2) : '0.00'} (
                          {customStopLoss && stock.price
                            ? `-${(((stock.price - customStopLoss) / stock.price) * 100).toFixed(1)}%`
                            : ''}
                          )
                        </Typography>
                      </Box>
                      <Slider
                        value={customStopLoss || stock.price * 0.92}
                        min={parseFloat((stock.price * 0.7).toFixed(2))}
                        max={parseFloat(stock.price.toFixed(2))}
                        step={0.5}
                        onChange={(e, val) => setCustomStopLoss(Number(val))}
                        sx={{ color: '#E11D48' }}
                      />
                      <Typography sx={{ fontSize: '0.72rem', color: '#9F1239' }}>
                        Protective cut-off level to prevent major drawdown
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              )}

              {/* Risk:Reward & Quick Action */}
              {enableCustomStrategy && (
                <Box
                  sx={{
                    mt: 3,
                    p: 2,
                    borderRadius: 3,
                    bgcolor: '#F8FAFC',
                    border: '1px solid #E2E8F0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: 2,
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box>
                      <Typography sx={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 700 }}>
                        CALCULATED RISK:REWARD
                      </Typography>
                      <Typography sx={{ fontSize: '1.25rem', fontWeight: 900, color: '#6D28D9' }}>
                        1 : {riskRewardRatio || '2.5'}
                      </Typography>
                    </Box>
                    <Chip
                      label={Number(riskRewardRatio) >= 2 ? 'FAVORABLE SETUP' : 'MODERATE RISK'}
                      size="small"
                      sx={{
                        fontWeight: 800,
                        bgcolor: Number(riskRewardRatio) >= 2 ? '#ECFDF5' : '#FEF3C7',
                        color: Number(riskRewardRatio) >= 2 ? '#059669' : '#D97706',
                      }}
                    />
                  </Box>

                  <Button
                    variant="contained"
                    onClick={openBuyModal}
                    startIcon={<FlashOnIcon />}
                    sx={{
                      borderRadius: 2.5,
                      fontWeight: 800,
                      background: 'linear-gradient(135deg, #6D28D9 0%, #7C3AED 100%)',
                      px: 3,
                    }}
                  >
                    Execute Buy With This Strategy
                  </Button>
                </Box>
              )}
            </Card>
          </Grid>

          {/* Right Column: Technical Strategy Scorecard & Demo Execution */}
          <Grid item xs={12} lg={4}>
            {/* Algorithmic Strategy Scorecard */}
            <Card
              sx={{
                p: 3,
                borderRadius: 4,
                border: '1px solid rgba(226, 232, 240, 0.9)',
                mb: 3,
                bgcolor: '#ffffff',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, mb: 2 }}>
                <AutoAwesomeIcon sx={{ color: '#6D28D9' }} />
                <Typography variant="h6" sx={{ fontWeight: 800, color: '#0F172A' }}>
                  Technical Strategy Signal
                </Typography>
              </Box>

              {/* Overall Signal Pill */}
              <Box
                sx={{
                  p: 2.5,
                  borderRadius: 3.5,
                  bgcolor: '#F8FAFC',
                  border: `2px solid ${strategyInsight.color}`,
                  textAlign: 'center',
                  mb: 2.5,
                }}
              >
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748B', letterSpacing: '0.05em' }}>
                  ALGORITHMIC SCORECARD
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 900, color: strategyInsight.color, my: 0.5 }}>
                  {strategyInsight.sentiment}
                </Typography>
                <Typography sx={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>
                  Strategy Confidence: <strong>{strategyInsight.score}/100</strong>
                </Typography>
              </Box>

              {/* Strategy Breakdown List */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.8 }}>
                {strategyInsight.signals.map((sig, idx) => (
                  <Box
                    key={idx}
                    sx={{
                      p: 1.5,
                      borderRadius: 2.5,
                      bgcolor:
                        sig.type === 'bullish' ? '#F0FDF4' : sig.type === 'bearish' ? '#FEF2F2' : '#F8FAFC',
                      border: '1px solid rgba(226, 232, 240, 0.8)',
                    }}
                  >
                    <Typography sx={{ fontSize: '0.85rem', fontWeight: 800, color: '#0F172A' }}>
                      {sig.title}
                    </Typography>
                    <Typography sx={{ fontSize: '0.78rem', color: '#64748B', mt: 0.3 }}>
                      {sig.desc}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Card>

            {/* Quick Demo Buy Ticket */}
            <Card
              sx={{
                p: 3,
                borderRadius: 4,
                border: '1px solid rgba(226, 232, 240, 0.9)',
                mb: 3,
                bgcolor: '#ffffff',
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 800, color: '#0F172A' }}>
                  Demo Trading Ticket
                </Typography>
                <Chip
                  label={`$${cashBalance.toLocaleString()} Free Margin`}
                  size="small"
                  sx={{ bgcolor: '#F5F3FF', color: '#6D28D9', fontWeight: 800, fontSize: '0.72rem' }}
                />
              </Box>

              <Typography sx={{ fontSize: '0.82rem', color: '#64748B', mb: 2.5 }}>
                Test your trading strategies with zero risk using your $50,000 demo paper trading account.
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={openBuyModal}
                  startIcon={<FlashOnIcon />}
                  sx={{
                    py: 1.6,
                    borderRadius: 3,
                    fontWeight: 900,
                    fontSize: '1.05rem',
                    backgroundColor: '#00D09C',
                    color: '#0F172A',
                    boxShadow: '0 6px 20px rgba(0, 208, 156, 0.35)',
                    '&:hover': { backgroundColor: '#00b889', transform: 'translateY(-1px)' },
                  }}
                >
                  Buy {stock.symbol} (Demo)
                </Button>

                <Button
                  fullWidth
                  variant="outlined"
                  onClick={openSellModal}
                  disabled={userShares <= 0}
                  sx={{
                    py: 1.4,
                    borderRadius: 3,
                    fontWeight: 800,
                    fontSize: '1rem',
                    borderColor: userShares > 0 ? '#F43F5E' : '#E2E8F0',
                    color: userShares > 0 ? '#F43F5E' : '#94A3B8',
                    '&:hover': { borderColor: '#E11D48', bgcolor: '#FFF1F2' },
                  }}
                >
                  Sell {stock.symbol} ({userShares} Owned)
                </Button>
              </Box>
            </Card>

            {/* Recent Orders for this Stock */}
            {stockOrders.length > 0 && (
              <Card sx={{ p: 2.5, borderRadius: 4, border: '1px solid rgba(226, 232, 240, 0.9)' }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#0F172A', mb: 1.5 }}>
                  Your {stock.symbol} Trade History
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.2 }}>
                  {stockOrders.slice(0, 4).map((order) => {
                    const isBuy = (order.side || '').toUpperCase() === 'BUY';
                    return (
                      <Box
                        key={order.id}
                        sx={{
                          p: 1.5,
                          borderRadius: 2.5,
                          bgcolor: '#F8FAFC',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                            <Chip
                              label={(order.side || '').toUpperCase()}
                              size="small"
                              sx={{
                                fontWeight: 900,
                                fontSize: '0.68rem',
                                height: 20,
                                bgcolor: isBuy ? '#ECFDF5' : '#FFF1F2',
                                color: isBuy ? '#00D09C' : '#F43F5E',
                              }}
                            />
                            <Typography sx={{ fontSize: '0.82rem', fontWeight: 800, color: '#0F172A' }}>
                              {order.quantity} shares @ ${Number(order.price).toFixed(2)}
                            </Typography>
                          </Box>
                          <Typography sx={{ fontSize: '0.7rem', color: '#94A3B8', mt: 0.2 }}>
                            #{order.id} • {new Date(order.created_at || order.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </Typography>
                        </Box>
                        <Typography sx={{ fontSize: '0.9rem', fontWeight: 900, color: '#0F172A' }}>
                          ${Number(order.total).toFixed(2)}
                        </Typography>
                      </Box>
                    );
                  })}
                </Box>
              </Card>
            )}
          </Grid>
        </Grid>
      </Container>

      {/* Trade Modal */}
      <DemoTradeModal
        open={tradeModalOpen}
        onClose={() => setTradeModalOpen(false)}
        stock={stock}
        initialSide={tradeModalSide}
        presetTargetPrice={customTarget}
        presetStopLossPrice={customStopLoss}
      />
    </Box>
  );
}
