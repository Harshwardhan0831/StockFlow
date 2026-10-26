import React, { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  Grid,
  Button,
  TextField,
  InputAdornment,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectStock } from '../store/slices/marketSlice';
import SearchIcon from '@mui/icons-material/Search';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ShowChartIcon from '@mui/icons-material/ShowChart';

export default function StockListing() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { stocks, loading } = useSelector((state) => state.market);
  const { holdings } = useSelector((state) => state.demo);

  const [search, setSearch] = useState('');
  const [selectedSector, setSelectedSector] = useState('ALL');

  // Sectors list
  const sectors = useMemo(() => {
    const s = new Set(['ALL']);
    stocks.forEach((stk) => {
      if (stk.sector) s.add(stk.sector);
    });
    return Array.from(s);
  }, [stocks]);

  // Filtered stocks
  const filteredStocks = useMemo(() => {
    return stocks.filter((stk) => {
      const matchSearch =
        stk.symbol.toLowerCase().includes(search.toLowerCase()) ||
        stk.name.toLowerCase().includes(search.toLowerCase());
      const matchSector = selectedSector === 'ALL' || stk.sector === selectedSector;
      return matchSearch && matchSector;
    });
  }, [stocks, search, selectedSector]);

  const handleStockClick = (stock) => {
    dispatch(selectStock(stock));
    navigate(`/stock/${stock.symbol}`);
  };

  if (loading && (!stocks || stocks.length === 0)) {
    return (
      <Box sx={{ textAlign: 'center', py: 8, color: '#64748B' }}>
        <Typography variant="h6" fontWeight={700}>
          Loading live market feeds...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ py: 1 }}>
      {/* Search & Sector Filters */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'stretch', md: 'center' },
          gap: 2,
          mb: 3,
        }}
      >
        <TextField
          placeholder="Search 10+ stocks by name or ticker..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: '#94A3B8' }} />
              </InputAdornment>
            ),
            sx: { borderRadius: 3, bgcolor: '#F8FAFC', width: { xs: '100%', md: 320 }, fontWeight: 600 },
          }}
        />

        <Box
          sx={{
            display: 'flex',
            gap: 1,
            overflowX: 'auto',
            pb: 0.5,
            scrollbarWidth: 'none',
            '&::-webkit-scrollbar': { display: 'none' },
          }}
        >
          {sectors.map((sector) => (
            <Chip
              key={sector}
              label={sector}
              clickable
              onClick={() => setSelectedSector(sector)}
              sx={{
                fontWeight: 800,
                fontSize: '0.78rem',
                borderRadius: 2.5,
                bgcolor: selectedSector === sector ? '#6D28D9' : '#F1F5F9',
                color: selectedSector === sector ? '#ffffff' : '#475569',
                '&:hover': {
                  bgcolor: selectedSector === sector ? '#5B21B6' : '#E2E8F0',
                },
              }}
            />
          ))}
        </Box>
      </Box>

      {/* Stocks Cards Grid */}
      <Grid container spacing={2.5}>
        {filteredStocks.map((stock) => {
          const isUp = Number(stock.change) >= 0;
          const userHolding = holdings[stock.symbol];
          const hasShares = userHolding && userHolding.quantity > 0;
          const curVal = hasShares ? userHolding.quantity * stock.price : 0;
          const pnl = hasShares ? curVal - userHolding.totalInvested : 0;

          return (
            <Grid item xs={12} sm={6} md={4} key={stock.symbol}>
              <Card
                onClick={() => handleStockClick(stock)}
                sx={{
                  p: 2.5,
                  cursor: 'pointer',
                  borderRadius: 3.5,
                  backgroundColor: '#ffffff',
                  border: '1px solid rgba(226, 232, 240, 0.9)',
                  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.03)',
                  transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                  position: 'relative',
                  overflow: 'hidden',
                  '&:hover': {
                    borderColor: '#7C3AED',
                    transform: 'translateY(-3px)',
                    boxShadow: '0 12px 28px rgba(109, 40, 217, 0.15)',
                    '& .trade-arrow': {
                      transform: 'translateX(4px)',
                      color: '#7C3AED',
                    },
                  },
                }}
              >
                <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
                  {/* Top Row: Symbol & Change Badge */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="h6" sx={{ fontWeight: 900, color: '#0F172A', fontSize: '1.25rem' }}>
                          {stock.symbol}
                        </Typography>
                        {stock.sector && (
                          <Chip
                            label={stock.sector}
                            size="small"
                            sx={{
                              bgcolor: '#F8FAFC',
                              color: '#64748B',
                              fontWeight: 700,
                              fontSize: '0.68rem',
                              height: 20,
                            }}
                          />
                        )}
                      </Box>
                      <Typography
                        sx={{
                          fontSize: '0.82rem',
                          color: '#64748B',
                          fontWeight: 500,
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          maxWidth: 160,
                        }}
                      >
                        {stock.name}
                      </Typography>
                    </Box>

                    <Chip
                      label={`${isUp ? '+' : ''}${stock.changePercent}%`}
                      icon={isUp ? <TrendingUpIcon sx={{ fontSize: 16 }} /> : <TrendingDownIcon sx={{ fontSize: 16 }} />}
                      size="small"
                      sx={{
                        bgcolor: isUp ? '#ECFDF5' : '#FFF1F2',
                        color: isUp ? '#00D09C' : '#F43F5E',
                        fontWeight: 800,
                        fontSize: '0.8rem',
                        borderRadius: 2,
                        '& .MuiChip-icon': {
                          color: isUp ? '#00D09C' : '#F43F5E',
                        },
                      }}
                    />
                  </Box>

                  {/* Price Row */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', mt: 2, mb: 1 }}>
                    <Typography variant="h5" sx={{ fontWeight: 900, color: '#0F172A', fontSize: '1.45rem' }}>
                      ${Number(stock.price).toFixed(2)}
                    </Typography>
                    <Typography sx={{ fontSize: '0.85rem', fontWeight: 700, color: isUp ? '#00D09C' : '#F43F5E' }}>
                      {isUp ? '+' : ''}${Number(stock.change).toFixed(2)}
                    </Typography>
                  </Box>

                  {/* Demo Position Indicator if user bought this stock */}
                  {hasShares && (
                    <Box
                      sx={{
                        my: 1.2,
                        p: 1,
                        borderRadius: 2,
                        bgcolor: '#F0FDF4',
                        border: '1px solid #DCFCE7',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#166534' }}>
                        Holding: {userHolding.quantity} sh
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: '0.75rem',
                          fontWeight: 800,
                          color: pnl >= 0 ? '#16A34A' : '#DC2626',
                        }}
                      >
                        P&L: {pnl >= 0 ? '+' : ''}${pnl.toFixed(2)}
                      </Typography>
                    </Box>
                  )}

                  {/* Bottom Footer: Volume & Click to Open Full Page */}
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      pt: 1.5,
                      borderTop: '1px solid rgba(226, 232, 240, 0.7)',
                    }}
                  >
                    <Typography sx={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 600 }}>
                      Vol: {stock.volume ? `${(stock.volume / 1000000).toFixed(1)}M` : '18.4M'}
                    </Typography>
                    <Box
                      className="trade-arrow"
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5,
                        color: '#6D28D9',
                        fontWeight: 800,
                        fontSize: '0.85rem',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      Chart & Trade <ArrowForwardIcon sx={{ fontSize: 15 }} />
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}
