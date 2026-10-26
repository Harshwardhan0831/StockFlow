import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Chip,
  Alert,
  Divider,
} from '@mui/material';
import { useSelector } from 'react-redux';
import api from '../store/api';
import FlashOnIcon from '@mui/icons-material/FlashOn';

export default function BuySellPanel({ stock }) {
  const [side, setSide] = useState('buy');
  const [quantity, setQuantity] = useState('10');
  const [price, setPrice] = useState(stock?.price?.toFixed(2) || '');
  const [total, setTotal] = useState(0);
  const [status, setStatus] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (stock?.price) {
      setPrice(Number(stock.price).toFixed(2));
    }
  }, [stock]);

  useEffect(() => {
    const q = parseFloat(quantity) || 0;
    const p = parseFloat(price) || 0;
    setTotal(q * p);
  }, [quantity, price]);

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setStatus(null);
    if (!isAuthenticated) {
      setStatus({ type: 'error', message: 'Please log in to place live trades.' });
      return;
    }
    setSubmitting(true);
    try {
      await api.post('/orders/place', {
        symbol: stock.symbol,
        side,
        quantity: parseInt(quantity, 10),
        price: parseFloat(price),
      });
      setStatus({
        type: 'success',
        message: `${side.toUpperCase()} order executed: ${quantity} shares of ${stock.symbol} @ $${price}.`,
      });
    } catch (err) {
      setStatus({
        type: 'error',
        message: err.response?.data?.message || 'Order failed to process.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const isBuy = side === 'buy';

  return (
    <Card sx={{ p: 3, borderRadius: 4, border: '1px solid rgba(226, 232, 240, 0.9)' }}>
      <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#0F172A', fontSize: '1.2rem' }}>
              Order Ticket
            </Typography>
            <Typography sx={{ fontSize: '0.82rem', color: '#64748B', fontWeight: 600 }}>
              {stock.symbol} • {stock.name}
            </Typography>
          </Box>
          <Chip
            label={`$${Number(stock.price).toFixed(2)}`}
            sx={{
              bgcolor: '#F5F3FF',
              color: '#6D28D9',
              fontWeight: 800,
              fontSize: '0.9rem',
              borderRadius: 2,
            }}
          />
        </Box>

        {status && (
          <Alert severity={status.type} sx={{ mb: 2.5, borderRadius: 2.5, fontSize: '0.9rem', fontWeight: 600 }}>
            {status.message}
          </Alert>
        )}

        {/* Upstox Buy / Sell Segment Control */}
        <Box
          sx={{
            display: 'flex',
            p: 0.5,
            borderRadius: 3,
            backgroundColor: '#F1F5F9',
            mb: 2.5,
          }}
        >
          <Button
            fullWidth
            onClick={() => setSide('buy')}
            sx={{
              py: 1,
              borderRadius: 2.5,
              fontWeight: 800,
              fontSize: '0.95rem',
              backgroundColor: isBuy ? '#00D09C' : 'transparent',
              color: isBuy ? '#0F172A' : '#64748B',
              boxShadow: isBuy ? '0 4px 12px rgba(0, 208, 156, 0.3)' : 'none',
              '&:hover': {
                backgroundColor: isBuy ? '#00b889' : 'rgba(0,0,0,0.05)',
              },
            }}
          >
            BUY
          </Button>
          <Button
            fullWidth
            onClick={() => setSide('sell')}
            sx={{
              py: 1,
              borderRadius: 2.5,
              fontWeight: 800,
              fontSize: '0.95rem',
              backgroundColor: !isBuy ? '#F43F5E' : 'transparent',
              color: !isBuy ? '#ffffff' : '#64748B',
              boxShadow: !isBuy ? '0 4px 12px rgba(244, 63, 94, 0.3)' : 'none',
              '&:hover': {
                backgroundColor: !isBuy ? '#e11d48' : 'rgba(0,0,0,0.05)',
              },
            }}
          >
            SELL
          </Button>
        </Box>

        <Box component="form" onSubmit={handlePlaceOrder}>
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <Typography sx={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>
                Quantity
              </Typography>
              <Box sx={{ display: 'flex', gap: 0.8 }}>
                {[10, 25, 50, 100].map((qtyVal) => (
                  <Chip
                    key={qtyVal}
                    label={`+${qtyVal}`}
                    size="small"
                    onClick={() => setQuantity(String(qtyVal))}
                    sx={{
                      cursor: 'pointer',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      height: 22,
                      bgcolor: '#F1F5F9',
                      '&:hover': { bgcolor: '#E2E8F0' },
                    }}
                  />
                ))}
              </Box>
            </Box>
            <TextField
              fullWidth
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              size="medium"
              InputProps={{
                sx: { borderRadius: 3, fontWeight: 700, fontSize: '1.05rem', backgroundColor: '#F8FAFC' },
              }}
            />
          </Box>

          <Box sx={{ mb: 2.5 }}>
            <Typography sx={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155', mb: 0.5 }}>
              Price per Share ($)
            </Typography>
            <TextField
              fullWidth
              type="number"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              size="medium"
              InputProps={{
                sx: { borderRadius: 3, fontWeight: 700, fontSize: '1.05rem', backgroundColor: '#F8FAFC' },
              }}
            />
          </Box>

          {/* Breakdown / Total */}
          <Box
            sx={{
              p: 2,
              borderRadius: 3,
              backgroundColor: '#F8FAFC',
              border: '1px solid rgba(226, 232, 240, 0.8)',
              mb: 3,
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.8 }}>
              <Typography sx={{ fontSize: '0.85rem', color: '#64748B' }}>Brokerage Fee</Typography>
              <Typography sx={{ fontSize: '0.85rem', fontWeight: 700, color: '#00D09C' }}>₹0 FREE</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography sx={{ fontSize: '0.95rem', fontWeight: 700, color: '#0F172A' }}>Estimated Total</Typography>
              <Typography sx={{ fontSize: '1.25rem', fontWeight: 900, color: isBuy ? '#00D09C' : '#F43F5E' }}>
                ${total.toFixed(2)}
              </Typography>
            </Box>
          </Box>

          <Button
            type="submit"
            fullWidth
            disabled={submitting}
            endIcon={<FlashOnIcon />}
            sx={{
              py: 1.6,
              borderRadius: 3,
              fontSize: '1.1rem',
              fontWeight: 800,
              backgroundColor: isBuy ? '#00D09C' : '#F43F5E',
              color: isBuy ? '#0F172A' : '#ffffff',
              boxShadow: isBuy
                ? '0 6px 20px rgba(0, 208, 156, 0.35)'
                : '0 6px 20px rgba(244, 63, 94, 0.35)',
              '&:hover': {
                backgroundColor: isBuy ? '#00b889' : '#e11d48',
                transform: 'translateY(-1px)',
              },
            }}
          >
            {submitting ? 'Executing Order...' : `Place ${side.toUpperCase()} Order`}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}
