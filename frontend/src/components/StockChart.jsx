import React, { useEffect } from 'react';
import { Box, Card, CardContent, Typography, Chip } from '@mui/material';
import { Line } from 'react-chartjs-2';
import { useSelector, useDispatch } from 'react-redux';
import { fetchHistory } from '../store/slices/marketSlice';
import { Chart as ChartJS, registerables } from 'chart.js';

ChartJS.register(...registerables);

export default function StockChart({ symbol }) {
  const dispatch = useDispatch();
  const { history } = useSelector((state) => state.market);

  useEffect(() => {
    if (symbol) {
      dispatch(fetchHistory({ symbol, days: 30 }));
    }
  }, [symbol, dispatch]);

  if (!history || !history.history) {
    return (
      <Card sx={{ p: 3, borderRadius: 4, minHeight: 320, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography sx={{ color: '#64748B', fontWeight: 600 }}>Loading chart for {symbol}...</Typography>
      </Card>
    );
  }

  const data = {
    labels: history.history.map((d) => d.time),
    datasets: [
      {
        label: `${symbol} Price`,
        data: history.history.map((d) => d.price),
        borderColor: '#7C3AED',
        backgroundColor: (context) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 300);
          gradient.addColorStop(0, 'rgba(124, 58, 237, 0.35)');
          gradient.addColorStop(1, 'rgba(124, 58, 237, 0.0)');
          return gradient;
        },
        fill: true,
        tension: 0.3,
        pointRadius: 0,
        pointHitRadius: 8,
        borderWidth: 2.5,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#0F172A',
        titleFont: { weight: 'bold', size: 12 },
        bodyFont: { size: 13, weight: 'bold' },
        padding: 10,
        displayColors: false,
        callbacks: {
          label: (context) => `$${Number(context.raw).toFixed(2)}`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#94A3B8', font: { size: 11, weight: '600' }, maxTicksLimit: 6 },
      },
      y: {
        grid: { color: 'rgba(226, 232, 240, 0.7)' },
        ticks: { color: '#94A3B8', font: { size: 11, weight: '600' } },
      },
    },
  };

  return (
    <Card sx={{ p: 2.5, borderRadius: 4, border: '1px solid rgba(226, 232, 240, 0.9)' }}>
      <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#0F172A', fontSize: '1.2rem' }}>
              {symbol}
            </Typography>
            <Typography sx={{ fontSize: '0.82rem', color: '#64748B', fontWeight: 600 }}>
              30-Day Historical Trend
            </Typography>
          </Box>
          <Chip label="PRO CHART" size="small" sx={{ bgcolor: '#F5F3FF', color: '#6D28D9', fontWeight: 800, fontSize: '0.72rem' }} />
        </Box>
        <Box sx={{ height: 260 }}>
          <Line data={data} options={options} />
        </Box>
      </CardContent>
    </Card>
  );
}
