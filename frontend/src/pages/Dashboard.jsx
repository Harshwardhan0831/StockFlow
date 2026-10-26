import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Container,
  Chip,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  IconButton,
  Tooltip,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { fetchStocks } from '../store/slices/marketSlice';
import { resetDemoAccount, fetchOrders } from '../store/slices/demoSlice';
import StockListing from '../components/StockListing';

import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AssessmentIcon from '@mui/icons-material/Assessment';
import HistoryIcon from '@mui/icons-material/History';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';

export default function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useAuth();

  const { stocks } = useSelector((state) => state.market);
  const { cashBalance, holdings, orders } = useSelector((state) => state.demo);

  const [activeTab, setActiveTab] = useState(0);
  const [resetDialogOpen, setResetDialogOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchStocks());
    dispatch(fetchOrders());
  }, [dispatch]);

  // Compute live portfolio metrics
  const portfolioMetrics = useMemo(() => {
    let totalInvested = 0;
    let currentHoldingValue = 0;

    Object.values(holdings).forEach((holding) => {
      const liveStock = stocks.find((s) => s.symbol === holding.symbol);
      const currentPrice = liveStock ? Number(liveStock.price) : holding.avgPrice;
      totalInvested += holding.totalInvested;
      currentHoldingValue += holding.quantity * currentPrice;
    });

    const totalPortfolioValue = cashBalance + currentHoldingValue;
    const totalPnl = currentHoldingValue - totalInvested;
    const totalPnlPercent = totalInvested > 0 ? (totalPnl / totalInvested) * 100 : 0;

    return {
      totalPortfolioValue,
      totalInvested,
      currentHoldingValue,
      totalPnl,
      totalPnlPercent,
      positionsCount: Object.keys(holdings).length,
    };
  }, [cashBalance, holdings, stocks]);

  // Top Movers
  const topGainer = useMemo(() => {
    if (!stocks || stocks.length === 0) return null;
    return [...stocks].sort((a, b) => Number(b.changePercent) - Number(a.changePercent))[0];
  }, [stocks]);

  const topLoser = useMemo(() => {
    if (!stocks || stocks.length === 0) return null;
    return [...stocks].sort((a, b) => Number(a.changePercent) - Number(b.changePercent))[0];
  }, [stocks]);

  const handleResetConfirm = () => {
    dispatch(resetDemoAccount());
    setResetDialogOpen(false);
  };

  return (
    <Box sx={{ py: 4, px: { xs: 2, sm: 3, md: 4 }, minHeight: 'calc(100vh - 108px)', backgroundColor: '#F8FAFC' }}>
      <Container maxWidth="xl">
        {/* Welcome & Demo Account Header */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 2,
            mb: 4,
            p: 3,
            borderRadius: 4,
            backgroundColor: '#ffffff',
            border: '1px solid rgba(226, 232, 240, 0.9)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
          }}
        >
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
              <Typography variant="h4" sx={{ fontWeight: 900, color: '#0F172A', fontSize: { xs: '1.6rem', md: '2rem' } }}>
                Trading Dashboard
              </Typography>
              <Chip
                icon={<VerifiedUserIcon sx={{ fontSize: 16 }} />}
                label="$50,000 DEMO ACCOUNT"
                size="small"
                sx={{ bgcolor: '#F5F3FF', color: '#6D28D9', fontWeight: 800 }}
              />
            </Box>
            <Typography variant="body1" sx={{ color: '#64748B', fontWeight: 500 }}>
              Practice real-time trading strategies with your risk-free <strong>$50,000 Demo Margin</strong>.
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Button
              variant="outlined"
              color="secondary"
              startIcon={<RestartAltIcon />}
              onClick={() => setResetDialogOpen(true)}
              sx={{
                py: 1.2,
                px: 2.5,
                fontWeight: 800,
                fontSize: '0.9rem',
                borderRadius: 3,
                borderColor: '#E2E8F0',
                color: '#6D28D9',
                '&:hover': { borderColor: '#6D28D9', bgcolor: '#F5F3FF' },
              }}
            >
              Reset Demo Funds
            </Button>
          </Box>
        </Box>

        {/* Portfolio Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {/* Card 1: Total Net Worth */}
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ p: 2.5, borderRadius: 3.5, border: '1px solid #E2E8F0', bgcolor: '#ffffff' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748B' }}>
                  TOTAL PORTFOLIO VALUE
                </Typography>
                <ShowChartIcon sx={{ color: '#6D28D9', fontSize: 20 }} />
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 900, color: '#0F172A', fontSize: '1.8rem', mb: 0.5 }}>
                ${portfolioMetrics.totalPortfolioValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </Typography>
              <Typography sx={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 600 }}>
                Cash + Stock Holdings Value
              </Typography>
            </Card>
          </Grid>

          {/* Card 2: Available Cash Margin */}
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ p: 2.5, borderRadius: 3.5, border: '1px solid #E2E8F0', bgcolor: '#ffffff' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748B' }}>
                  AVAILABLE DEMO CASH
                </Typography>
                <AccountBalanceWalletIcon sx={{ color: '#00D09C', fontSize: 20 }} />
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 900, color: '#00D09C', fontSize: '1.8rem', mb: 0.5 }}>
                ${cashBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </Typography>
              <Typography sx={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 600 }}>
                Ready to deploy on any stock
              </Typography>
            </Card>
          </Grid>

          {/* Card 3: Unrealized P&L */}
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ p: 2.5, borderRadius: 3.5, border: '1px solid #E2E8F0', bgcolor: '#ffffff' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748B' }}>
                  TOTAL UNREALIZED P&L
                </Typography>
                {portfolioMetrics.totalPnl >= 0 ? (
                  <TrendingUpIcon sx={{ color: '#00D09C', fontSize: 20 }} />
                ) : (
                  <TrendingDownIcon sx={{ color: '#F43F5E', fontSize: 20 }} />
                )}
              </Box>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 900,
                  color: portfolioMetrics.totalPnl >= 0 ? '#00D09C' : '#F43F5E',
                  fontSize: '1.8rem',
                  mb: 0.5,
                }}
              >
                {portfolioMetrics.totalPnl >= 0 ? '+' : ''}$
                {portfolioMetrics.totalPnl.toFixed(2)}
              </Typography>
              <Typography
                sx={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: portfolioMetrics.totalPnl >= 0 ? '#00D09C' : '#F43F5E',
                }}
              >
                {portfolioMetrics.totalPnl >= 0 ? '+' : ''}
                {portfolioMetrics.totalPnlPercent.toFixed(2)}% Return
              </Typography>
            </Card>
          </Grid>

          {/* Card 4: Active Positions */}
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ p: 2.5, borderRadius: 3.5, border: '1px solid #E2E8F0', bgcolor: '#ffffff' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748B' }}>
                  OPEN POSITIONS
                </Typography>
                <AssessmentIcon sx={{ color: '#6D28D9', fontSize: 20 }} />
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 900, color: '#0F172A', fontSize: '1.8rem', mb: 0.5 }}>
                {portfolioMetrics.positionsCount} Stocks
              </Typography>
              <Typography sx={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 600 }}>
                Invested: ${portfolioMetrics.totalInvested.toFixed(2)}
              </Typography>
            </Card>
          </Grid>
        </Grid>

        {/* Market Movers Banner */}
        {(topGainer || topLoser) && (
          <Box
            sx={{
              display: 'flex',
              gap: 2,
              mb: 3.5,
              flexWrap: 'wrap',
            }}
          >
            {topGainer && (
              <Box
                onClick={() => navigate(`/stock/${topGainer.symbol}`)}
                sx={{
                  flex: 1,
                  minWidth: 260,
                  p: 1.8,
                  borderRadius: 3,
                  bgcolor: '#ECFDF5',
                  border: '1px solid #A7F3D0',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 4px 14px rgba(0, 208, 156, 0.2)' },
                }}
              >
                <Box>
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 800, color: '#065F46' }}>TOP GAINER TODAY</Typography>
                  <Typography sx={{ fontSize: '1rem', fontWeight: 900, color: '#064E3B' }}>
                    {topGainer.symbol} • ${Number(topGainer.price).toFixed(2)}
                  </Typography>
                </Box>
                <Chip
                  label={`+${topGainer.changePercent}%`}
                  icon={<TrendingUpIcon />}
                  size="small"
                  sx={{ bgcolor: '#00D09C', color: '#0F172A', fontWeight: 800 }}
                />
              </Box>
            )}

            {topLoser && (
              <Box
                onClick={() => navigate(`/stock/${topLoser.symbol}`)}
                sx={{
                  flex: 1,
                  minWidth: 260,
                  p: 1.8,
                  borderRadius: 3,
                  bgcolor: '#FFF1F2',
                  border: '1px solid #FECDD3',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 4px 14px rgba(244, 63, 94, 0.2)' },
                }}
              >
                <Box>
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 800, color: '#9F1239' }}>TOP LOSER TODAY</Typography>
                  <Typography sx={{ fontSize: '1rem', fontWeight: 900, color: '#881337' }}>
                    {topLoser.symbol} • ${Number(topLoser.price).toFixed(2)}
                  </Typography>
                </Box>
                <Chip
                  label={`${topLoser.changePercent}%`}
                  icon={<TrendingDownIcon />}
                  size="small"
                  sx={{ bgcolor: '#F43F5E', color: '#ffffff', fontWeight: 800 }}
                />
              </Box>
            )}
          </Box>
        )}

        {/* Main Dashboard Navigation Tabs */}
        <Card sx={{ p: 3, borderRadius: 4, border: '1px solid rgba(226, 232, 240, 0.9)' }}>
          <Tabs
            value={activeTab}
            onChange={(e, val) => setActiveTab(val)}
            sx={{
              mb: 3,
              borderBottom: '1px solid #E2E8F0',
              '& .MuiTab-root': {
                fontWeight: 800,
                fontSize: '0.98rem',
                textTransform: 'none',
                minWidth: 140,
                color: '#64748B',
                '&.Mui-selected': { color: '#6D28D9' },
              },
              '& .MuiTabs-indicator': { backgroundColor: '#6D28D9', height: 3 },
            }}
          >
            <Tab label="Market Watchlist" icon={<ShowChartIcon />} iconPosition="start" />
            <Tab
              label={`My Demo Holdings (${portfolioMetrics.positionsCount})`}
              icon={<AssessmentIcon />}
              iconPosition="start"
            />
            <Tab
              label={`Demo Trade History (${orders.length})`}
              icon={<HistoryIcon />}
              iconPosition="start"
            />
          </Tabs>

          {/* TAB 0: Market Watchlist */}
          {activeTab === 0 && (
            <Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="h5" sx={{ fontWeight: 900, color: '#0F172A' }}>
                  Live Stock Market
                </Typography>
                <Typography sx={{ fontSize: '0.88rem', color: '#64748B' }}>
                  Click on any stock to open its full dedicated chart page with technical trading strategies, line makers, and demo buy/sell execution.
                </Typography>
              </Box>
              <StockListing />
            </Box>
          )}

          {/* TAB 1: My Demo Holdings */}
          {activeTab === 1 && (
            <Box>
              {portfolioMetrics.positionsCount === 0 ? (
                <Box sx={{ textAlign: 'center', py: 8 }}>
                  <AccountBalanceWalletIcon sx={{ fontSize: 48, color: '#CBD5E1', mb: 2 }} />
                  <Typography variant="h6" fontWeight={800} color="#0F172A">
                    No active positions yet
                  </Typography>
                  <Typography sx={{ color: '#64748B', mt: 0.5, mb: 3 }}>
                    You have <strong>${cashBalance.toLocaleString()}</strong> in demo funds ready to trade.
                  </Typography>
                  <Button
                    variant="contained"
                    onClick={() => setActiveTab(0)}
                    sx={{
                      borderRadius: 3,
                      fontWeight: 800,
                      background: 'linear-gradient(135deg, #6D28D9 0%, #7C3AED 100%)',
                      px: 3,
                      py: 1.2,
                    }}
                  >
                    Browse Stocks & Execute Demo Trades
                  </Button>
                </Box>
              ) : (
                <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #E2E8F0', borderRadius: 3 }}>
                  <Table>
                    <TableHead sx={{ bgcolor: '#F8FAFC' }}>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 800, color: '#475569' }}>INSTRUMENT</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 800, color: '#475569' }}>SHARES</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 800, color: '#475569' }}>AVG BUY PRICE</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 800, color: '#475569' }}>LIVE PRICE</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 800, color: '#475569' }}>MARKET VALUE</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 800, color: '#475569' }}>UNREALIZED P&L</TableCell>
                        <TableCell align="center" sx={{ fontWeight: 800, color: '#475569' }}>ACTION</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {Object.values(holdings).map((item) => {
                        const liveStock = stocks.find((s) => s.symbol === item.symbol);
                        const curPrice = liveStock ? Number(liveStock.price) : item.avgPrice;
                        const marketVal = item.quantity * curPrice;
                        const pnl = marketVal - item.totalInvested;
                        const pnlPct = item.totalInvested > 0 ? (pnl / item.totalInvested) * 100 : 0;
                        const isProfit = pnl >= 0;

                        return (
                          <TableRow key={item.symbol} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Typography sx={{ fontWeight: 900, color: '#0F172A', fontSize: '1rem' }}>
                                  {item.symbol}
                                </Typography>
                                <Typography sx={{ fontSize: '0.8rem', color: '#64748B' }}>
                                  {item.name}
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell align="right" sx={{ fontWeight: 800, fontSize: '0.95rem' }}>
                              {item.quantity}
                            </TableCell>
                            <TableCell align="right" sx={{ fontWeight: 700, color: '#475569' }}>
                              ${item.avgPrice.toFixed(2)}
                            </TableCell>
                            <TableCell align="right" sx={{ fontWeight: 800, color: '#0F172A' }}>
                              ${curPrice.toFixed(2)}
                            </TableCell>
                            <TableCell align="right" sx={{ fontWeight: 900, color: '#0F172A' }}>
                              ${marketVal.toFixed(2)}
                            </TableCell>
                            <TableCell align="right">
                              <Typography sx={{ fontWeight: 900, color: isProfit ? '#00D09C' : '#F43F5E' }}>
                                {isProfit ? '+' : ''}${pnl.toFixed(2)} ({isProfit ? '+' : ''}{pnlPct.toFixed(2)}%)
                              </Typography>
                            </TableCell>
                            <TableCell align="center">
                              <Button
                                size="small"
                                variant="contained"
                                endIcon={<ArrowForwardIcon />}
                                onClick={() => navigate(`/stock/${item.symbol}`)}
                                sx={{
                                  borderRadius: 2,
                                  fontWeight: 800,
                                  bgcolor: '#6D28D9',
                                  '&:hover': { bgcolor: '#5B21B6' },
                                }}
                              >
                                Trade / Analyze
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Box>
          )}

          {/* TAB 2: Demo Trade History */}
          {activeTab === 2 && (
            <Box>
              {orders.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 8 }}>
                  <HistoryIcon sx={{ fontSize: 48, color: '#CBD5E1', mb: 2 }} />
                  <Typography variant="h6" fontWeight={800} color="#0F172A">
                    No trades executed yet
                  </Typography>
                  <Typography sx={{ color: '#64748B', mt: 0.5, mb: 3 }}>
                    Place your first demo trade on any stock to see your trade confirmations here.
                  </Typography>
                </Box>
              ) : (
                <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #E2E8F0', borderRadius: 3 }}>
                  <Table>
                    <TableHead sx={{ bgcolor: '#F8FAFC' }}>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 800, color: '#475569' }}>TIMESTAMP</TableCell>
                        <TableCell sx={{ fontWeight: 800, color: '#475569' }}>ORDER ID</TableCell>
                        <TableCell sx={{ fontWeight: 800, color: '#475569' }}>SIDE</TableCell>
                        <TableCell sx={{ fontWeight: 800, color: '#475569' }}>STOCK</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 800, color: '#475569' }}>QUANTITY</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 800, color: '#475569' }}>PRICE</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 800, color: '#475569' }}>TOTAL VALUE</TableCell>
                        <TableCell align="center" sx={{ fontWeight: 800, color: '#475569' }}>STATUS</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {orders.map((ord) => {
                        const isBuy = (ord.side || '').toUpperCase() === 'BUY';
                        return (
                          <TableRow key={ord.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                            <TableCell sx={{ fontSize: '0.85rem', color: '#64748B' }}>
                              {new Date(ord.created_at || ord.timestamp).toLocaleString()}
                            </TableCell>
                            <TableCell sx={{ fontSize: '0.8rem', fontFamily: 'monospace', color: '#6D28D9', fontWeight: 700 }}>
                              #{ord.id}
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={(ord.side || '').toUpperCase()}
                                size="small"
                                sx={{
                                  fontWeight: 900,
                                  fontSize: '0.72rem',
                                  bgcolor: isBuy ? '#ECFDF5' : '#FFF1F2',
                                  color: isBuy ? '#00D09C' : '#F43F5E',
                                }}
                              />
                            </TableCell>
                            <TableCell sx={{ fontWeight: 900, color: '#0F172A' }}>
                              {ord.symbol}
                            </TableCell>
                            <TableCell align="right" sx={{ fontWeight: 800 }}>
                              {ord.quantity}
                            </TableCell>
                            <TableCell align="right" sx={{ fontWeight: 700, color: '#475569' }}>
                              ${Number(ord.price).toFixed(2)}
                            </TableCell>
                            <TableCell align="right" sx={{ fontWeight: 900, color: '#0F172A' }}>
                              ${Number(ord.total).toFixed(2)}
                            </TableCell>
                            <TableCell align="center">
                              <Chip
                                label={`${(ord.status || 'FILLED').toUpperCase()} (DB)`}
                                size="small"
                                sx={{ bgcolor: '#ECFDF5', color: '#065F46', fontWeight: 800, fontSize: '0.68rem' }}
                              />
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Box>
          )}
        </Card>
      </Container>

      {/* Reset Confirmation Dialog */}
      <Dialog
        open={resetDialogOpen}
        onClose={() => setResetDialogOpen(false)}
        PaperProps={{ sx: { borderRadius: 4, p: 1 } }}
      >
        <DialogTitle sx={{ fontWeight: 900 }}>Reset Demo Paper Trading Account?</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: '#64748B', fontWeight: 500 }}>
            This will reset your cash balance back to <strong>$50,000.00</strong> and clear all your demo holdings and order history.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setResetDialogOpen(false)} sx={{ color: '#64748B', fontWeight: 700 }}>
            Cancel
          </Button>
          <Button onClick={handleResetConfirm} variant="contained" color="error" sx={{ fontWeight: 800, borderRadius: 2.5 }}>
            Reset to $50,000
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
