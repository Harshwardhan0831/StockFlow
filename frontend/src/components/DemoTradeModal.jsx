import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Button,
  TextField,
  Chip,
  Alert,
  IconButton,
  Divider,
  CircularProgress,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { demoBuy, demoSell, clearDemoError } from '../store/slices/demoSlice';

export default function DemoTradeModal({
  open,
  onClose,
  stock,
  initialSide = 'buy',
  presetTargetPrice = null,
  presetStopLossPrice = null,
}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cashBalance, holdings, error } = useSelector((state) => state.demo);
  const { isAuthenticated } = useSelector((state) => state.auth);

  const [side, setSide] = useState(initialSide);
  const [quantity, setQuantity] = useState('10');
  const [price, setPrice] = useState('');
  const [successMsg, setSuccessMsg] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const holding = stock ? holdings[stock.symbol] : null;
  const ownedQty = holding ? holding.quantity : 0;

  useEffect(() => {
    if (open) {
      setSide(initialSide);
      setSuccessMsg(null);
      dispatch(clearDemoError());
      if (stock?.price) {
        setPrice(Number(stock.price).toFixed(2));
      }
    }
  }, [open, initialSide, stock, dispatch]);

  if (!stock) return null;

  const currentPrice = parseFloat(price) || stock.price || 0;
  const numQty = parseInt(quantity, 10) || 0;
  const orderTotal = parseFloat((numQty * currentPrice).toFixed(2));
  const remainingCash = side === 'buy' ? cashBalance - orderTotal : cashBalance + orderTotal;

  // Max shares affordable with cash
  const maxAffordable = currentPrice > 0 ? Math.floor(cashBalance / currentPrice) : 0;

  const handleSideChange = (newSide) => {
    setSide(newSide);
    setSuccessMsg(null);
    dispatch(clearDemoError());
    if (newSide === 'sell' && ownedQty > 0) {
      setQuantity(String(Math.min(numQty || 10, ownedQty)));
    }
  };

  const handleQuickQty = (addVal) => {
    const cur = parseInt(quantity, 10) || 0;
    setQuantity(String(cur + addVal));
  };

  const handleMaxQty = () => {
    if (side === 'buy') {
      setQuantity(String(Math.max(1, maxAffordable)));
    } else {
      setQuantity(String(ownedQty));
    }
  };

  const handleExecute = async (e) => {
    e.preventDefault();
    setSuccessMsg(null);

    if (numQty <= 0) {
      return;
    }

    if (!isAuthenticated) {
      return;
    }

    setSubmitting(true);
    try {
      if (side === 'buy') {
        if (orderTotal > cashBalance) {
          setSubmitting(false);
          return;
        }
        const res = await dispatch(
          demoBuy({
            symbol: stock.symbol,
            name: stock.name,
            quantity: numQty,
            price: currentPrice,
          })
        ).unwrap();
        const orderId = res.order?.id ? ` #${res.order.id}` : '';
        setSuccessMsg(`Order${orderId} saved to DB! Successfully BOUGHT ${numQty} shares of ${stock.symbol} for $${orderTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}.`);
      } else {
        if (numQty > ownedQty) {
          setSubmitting(false);
          return;
        }
        const res = await dispatch(
          demoSell({
            symbol: stock.symbol,
            name: stock.name,
            quantity: numQty,
            price: currentPrice,
          })
        ).unwrap();
        const orderId = res.order?.id ? ` #${res.order.id}` : '';
        setSuccessMsg(`Order${orderId} saved to DB! Successfully SOLD ${numQty} shares of ${stock.symbol} for $${orderTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}.`);
      }
    } catch (err) {
      // error is automatically captured in Redux demo slice
    } finally {
      setSubmitting(false);
    }
  };

  const isBuy = side === 'buy';

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
          p: 1,
          boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.25)',
          border: '1px solid rgba(226, 232, 240, 0.9)',
        },
      }}
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="h5" sx={{ fontWeight: 900, color: '#0F172A' }}>
              {stock.symbol}
            </Typography>
            <Chip
              label="DEMO ACCOUNT"
              size="small"
              sx={{
                bgcolor: '#F5F3FF',
                color: '#6D28D9',
                fontWeight: 800,
                fontSize: '0.7rem',
                borderRadius: 1.5,
              }}
            />
          </Box>
          <Typography variant="body2" sx={{ color: '#64748B', fontWeight: 500 }}>
            {stock.name} • Live: <strong>${Number(stock.price).toFixed(2)}</strong>
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small" sx={{ color: '#94A3B8' }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 1 }}>
        {/* Available Margin Banner */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            p: 1.8,
            borderRadius: 3,
            bgcolor: '#F8FAFC',
            border: '1px solid #E2E8F0',
            mb: 2.5,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
            <AccountBalanceWalletIcon sx={{ color: '#6D28D9', fontSize: 24 }} />
            <Box>
              <Typography sx={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 700 }}>
                AVAILABLE DEMO CASH
              </Typography>
              <Typography sx={{ fontSize: '1.1rem', fontWeight: 900, color: '#0F172A' }}>
                ${cashBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ textAlign: 'right' }}>
            <Typography sx={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 700 }}>
              YOU OWN
            </Typography>
            <Typography sx={{ fontSize: '1rem', fontWeight: 800, color: ownedQty > 0 ? '#00D09C' : '#64748B' }}>
              {ownedQty} Shares
            </Typography>
          </Box>
        </Box>

        {/* Error or Success or Auth notification */}
        {!isAuthenticated && (
          <Alert
            severity="warning"
            sx={{ mb: 2, borderRadius: 2.5, fontWeight: 600 }}
            action={
              <Button color="inherit" size="small" sx={{ fontWeight: 800 }} onClick={() => navigate('/login')}>
                LOG IN
              </Button>
            }
          >
            Please log in to execute trades and store your orders directly in the database.
          </Alert>
        )}
        {error && (
          <Alert severity="error" sx={{ mb: 2, borderRadius: 2.5, fontWeight: 600 }}>
            {error}
          </Alert>
        )}
        {successMsg && (
          <Alert
            icon={<CheckCircleOutlineIcon fontSize="inherit" />}
            severity="success"
            sx={{ mb: 2, borderRadius: 2.5, fontWeight: 700, bgcolor: '#ECFDF5', color: '#065F46' }}
          >
            {successMsg}
          </Alert>
        )}

        {/* Buy / Sell Tabs */}
        <Box
          sx={{
            display: 'flex',
            p: 0.6,
            borderRadius: 3,
            backgroundColor: '#F1F5F9',
            mb: 2.5,
          }}
        >
          <Button
            fullWidth
            onClick={() => handleSideChange('buy')}
            sx={{
              py: 1.2,
              borderRadius: 2.5,
              fontWeight: 800,
              fontSize: '0.98rem',
              backgroundColor: isBuy ? '#00D09C' : 'transparent',
              color: isBuy ? '#0F172A' : '#64748B',
              boxShadow: isBuy ? '0 4px 14px rgba(0, 208, 156, 0.35)' : 'none',
              '&:hover': {
                backgroundColor: isBuy ? '#00b889' : 'rgba(0,0,0,0.04)',
              },
            }}
          >
            BUY (DEMO)
          </Button>
          <Button
            fullWidth
            onClick={() => handleSideChange('sell')}
            sx={{
              py: 1.2,
              borderRadius: 2.5,
              fontWeight: 800,
              fontSize: '0.98rem',
              backgroundColor: !isBuy ? '#F43F5E' : 'transparent',
              color: !isBuy ? '#ffffff' : '#64748B',
              boxShadow: !isBuy ? '0 4px 14px rgba(244, 63, 94, 0.35)' : 'none',
              '&:hover': {
                backgroundColor: !isBuy ? '#e11d48' : 'rgba(0,0,0,0.04)',
              },
            }}
          >
            SELL (DEMO)
          </Button>
        </Box>

        {/* Quantity Field & Quick Selectors */}
        <Box sx={{ mb: 2.5 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.8 }}>
            <Typography sx={{ fontSize: '0.88rem', fontWeight: 700, color: '#334155' }}>
              Number of Shares
            </Typography>
            <Box sx={{ display: 'flex', gap: 0.6 }}>
              {[1, 5, 10, 25, 50].map((val) => (
                <Chip
                  key={val}
                  label={`+${val}`}
                  size="small"
                  onClick={() => handleQuickQty(val)}
                  sx={{
                    cursor: 'pointer',
                    fontWeight: 700,
                    bgcolor: '#F1F5F9',
                    fontSize: '0.75rem',
                    '&:hover': { bgcolor: '#E2E8F0' },
                  }}
                />
              ))}
              <Chip
                label="MAX"
                size="small"
                onClick={handleMaxQty}
                sx={{
                  cursor: 'pointer',
                  fontWeight: 800,
                  bgcolor: '#F5F3FF',
                  color: '#6D28D9',
                  fontSize: '0.75rem',
                  '&:hover': { bgcolor: '#EDE9FE' },
                }}
              />
            </Box>
          </Box>

          <TextField
            fullWidth
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            inputProps={{ min: 1 }}
            size="medium"
            InputProps={{
              sx: { borderRadius: 3, fontWeight: 800, fontSize: '1.1rem', bgcolor: '#F8FAFC' },
            }}
          />
        </Box>

        {/* Price Field */}
        <Box sx={{ mb: 2.5 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.8 }}>
            <Typography sx={{ fontSize: '0.88rem', fontWeight: 700, color: '#334155' }}>
              Execution Price ($)
            </Typography>
            <Typography sx={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>
              Live Market Rate
            </Typography>
          </Box>
          <TextField
            fullWidth
            type="number"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            size="medium"
            InputProps={{
              sx: { borderRadius: 3, fontWeight: 800, fontSize: '1.1rem', bgcolor: '#F8FAFC' },
            }}
          />
        </Box>

        {/* Strategy Price Targets preview if set */}
        {(presetTargetPrice || presetStopLossPrice) && (
          <Box sx={{ p: 1.5, borderRadius: 2.5, bgcolor: '#F1F5F9', mb: 2.5, display: 'flex', gap: 2 }}>
            {presetTargetPrice && (
              <Box>
                <Typography sx={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 700 }}>
                  STRATEGY TARGET
                </Typography>
                <Typography sx={{ fontSize: '0.92rem', fontWeight: 800, color: '#00D09C' }}>
                  ${presetTargetPrice.toFixed(2)}
                </Typography>
              </Box>
            )}
            {presetStopLossPrice && (
              <Box>
                <Typography sx={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 700 }}>
                  STRATEGY STOP LOSS
                </Typography>
                <Typography sx={{ fontSize: '0.92rem', fontWeight: 800, color: '#F43F5E' }}>
                  ${presetStopLossPrice.toFixed(2)}
                </Typography>
              </Box>
            )}
          </Box>
        )}

        {/* Summary Breakdown Box */}
        <Box
          sx={{
            p: 2,
            borderRadius: 3,
            backgroundColor: '#F8FAFC',
            border: '1px solid rgba(226, 232, 240, 0.9)',
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.8 }}>
            <Typography sx={{ fontSize: '0.85rem', color: '#64748B' }}>Order Value</Typography>
            <Typography sx={{ fontSize: '0.85rem', fontWeight: 700, color: '#0F172A' }}>
              ${orderTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.8 }}>
            <Typography sx={{ fontSize: '0.85rem', color: '#64748B' }}>Brokerage & Taxes</Typography>
            <Typography sx={{ fontSize: '0.85rem', fontWeight: 800, color: '#00D09C' }}>
              $0.00 DEMO FREE
            </Typography>
          </Box>
          <Divider sx={{ my: 1 }} />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography sx={{ fontSize: '0.95rem', fontWeight: 800, color: '#0F172A' }}>
              {isBuy ? 'Cash After Purchase' : 'Cash After Sale'}
            </Typography>
            <Typography
              sx={{
                fontSize: '1.25rem',
                fontWeight: 900,
                color: remainingCash < 0 ? '#F43F5E' : '#0F172A',
              }}
            >
              ${remainingCash.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </Typography>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2.5, pt: 1 }}>
        <Button onClick={onClose} sx={{ color: '#64748B', fontWeight: 700, px: 2 }}>
          Cancel
        </Button>
        <Button
          onClick={handleExecute}
          variant="contained"
          endIcon={submitting ? <CircularProgress size={18} sx={{ color: isBuy ? '#0F172A' : '#ffffff' }} /> : <FlashOnIcon />}
          disabled={submitting || !isAuthenticated || numQty <= 0 || (isBuy && orderTotal > cashBalance) || (!isBuy && numQty > ownedQty)}
          sx={{
            py: 1.4,
            px: 4,
            borderRadius: 3,
            fontWeight: 800,
            fontSize: '1.05rem',
            backgroundColor: isBuy ? '#00D09C' : '#F43F5E',
            color: isBuy ? '#0F172A' : '#ffffff',
            boxShadow: isBuy ? '0 6px 20px rgba(0, 208, 156, 0.35)' : '0 6px 20px rgba(244, 63, 94, 0.35)',
            '&:hover': {
              backgroundColor: isBuy ? '#00b889' : '#e11d48',
              transform: 'translateY(-1px)',
            },
          }}
        >
          {submitting
            ? 'Saving to Database...'
            : isBuy
            ? `Execute Buy Order ($${orderTotal.toFixed(2)})`
            : `Execute Sell Order ($${orderTotal.toFixed(2)})`}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
