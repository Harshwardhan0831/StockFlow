import React from 'react';
import { Box, Typography, Stack } from '@mui/material';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

const FEATURES = [
  'Zero AMC for life & zero commission on Direct Mutual Funds',
  'Flat ₹20/order on Equity Intraday & F&O derivatives',
  'Real-time WebSocket market feeds with <15ms execution',
  'SEBI regulated, bank-grade 256-bit secure sessions',
];

export default function AuthLayout({ title, subtitle, children }) {
  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: 'calc(100vh - 108px)',
        backgroundColor: '#F8FAFC',
      }}
    >
      {/* Brand panel */}
      <Box
        sx={{
          display: { xs: 'none', lg: 'flex' },
          flexDirection: 'column',
          justifyContent: 'space-between',
          width: 480,
          flexShrink: 0,
          p: 6,
          color: '#ffffff',
          position: 'relative',
          overflow: 'hidden',
          background: 'linear-gradient(150deg, #4A1D96 0%, #6D28D9 55%, #7C3AED 100%)',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: -120,
            right: -120,
            width: 360,
            height: 360,
            borderRadius: '50%',
            background: 'rgba(139, 92, 246, 0.35)',
            filter: 'blur(30px)',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: -140,
            left: -100,
            width: 320,
            height: 320,
            borderRadius: '50%',
            background: 'rgba(0, 208, 156, 0.18)',
            filter: 'blur(30px)',
          }}
        />

        <Box sx={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: 3,
              background: 'rgba(255,255,255,0.18)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255,255,255,0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <TrendingUpIcon sx={{ fontSize: 24, color: '#ffffff' }} />
          </Box>
          <Typography sx={{ fontWeight: 900, fontSize: 24, letterSpacing: '-0.02em', color: '#ffffff' }}>
            Stock<span style={{ color: '#00D09C' }}>Flow</span> Pro
          </Typography>
        </Box>

        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Typography sx={{ fontWeight: 900, fontSize: 36, lineHeight: 1.2, letterSpacing: '-0.03em', mb: 2 }}>
            Trade the markets with speed & precision.
          </Typography>
          <Typography sx={{ fontSize: 16, lineHeight: 1.7, color: 'rgba(255,255,255,0.85)', mb: 4 }}>
            Join over 1 Crore investors using India's favorite high-tech brokerage platform.
          </Typography>
          <Stack spacing={2.2}>
            {FEATURES.map((feature) => (
              <Box key={feature} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <CheckCircleRoundedIcon sx={{ fontSize: 22, color: '#00D09C' }} />
                <Typography sx={{ fontSize: 15, fontWeight: 600, color: 'rgba(255,255,255,0.95)' }}>
                  {feature}
                </Typography>
              </Box>
            ))}
          </Stack>
        </Box>

        <Box
          sx={{
            position: 'relative',
            zIndex: 1,
            p: 2.8,
            borderRadius: 3.5,
            background: 'rgba(255,255,255,0.12)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.2)',
          }}
        >
          <Typography sx={{ fontSize: 14, lineHeight: 1.6, color: 'rgba(255,255,255,0.92)', fontStyle: 'italic' }}>
            “The fastest order execution and lowest slippage I have experienced in Indian markets.”
          </Typography>
          <Typography sx={{ fontSize: 13, mt: 1.5, color: '#00D09C', fontWeight: 800 }}>
            — Pro Option Trader, 5+ Years on StockFlow
          </Typography>
        </Box>
      </Box>

      {/* Form panel */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: { xs: 3, sm: 5, md: 8 },
        }}
      >
        <Box sx={{ width: '100%', maxWidth: 440 }}>
          <Box
            sx={{
              display: { xs: 'flex', lg: 'none' },
              alignItems: 'center',
              gap: 1.2,
              mb: 4,
              justifyContent: 'center',
            }}
          >
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: 2.5,
                background: 'linear-gradient(135deg, #6D28D9, #7C3AED)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <TrendingUpIcon sx={{ color: '#fff', fontSize: 22 }} />
            </Box>
            <Typography sx={{ fontWeight: 900, fontSize: 22, color: '#0F172A' }}>
              Stock<span style={{ color: '#6D28D9' }}>Flow</span>
            </Typography>
          </Box>

          <Typography sx={{ fontWeight: 900, fontSize: { xs: 28, md: 34 }, color: '#0F172A', letterSpacing: '-0.025em' }}>
            {title}
          </Typography>
          <Typography sx={{ fontSize: 16, color: '#64748B', mt: 1, mb: 4, fontWeight: 500 }}>
            {subtitle}
          </Typography>

          {children}
        </Box>
      </Box>
    </Box>
  );
}
