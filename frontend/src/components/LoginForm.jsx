import React from 'react';
import { Box, Card, CardContent, Typography, CircularProgress, Button } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { login, register, clearError } from '../store/slices/authSlice';

export default function LoginForm() {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const dispatch = useDispatch();
  const { loading, error } = React.useSelector((state) => state.auth);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login({ email, password }));
  };

  return (
    <Card sx={{ p: 3, maxWidth: 400, mx: 'auto', mt: 4 }}>
      <CardContent>
        <Typography variant="h6" fontWeight={700} component="h3" sx={{ mb: 1, textAlign: 'center' }}>
          Welcome back
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mb: 3 }}>
          Sign in to your trading account
        </Typography>
        {error && <Box sx={{ mb: 2, color: '#dc2626', fontSize: 0.9 }}>{error}</Box>}
        <form onSubmit={handleSubmit}>
          <Box component="div" sx={{ mb: 2 }}>
            <Typography variant="caption" sx={{ mb: 0.5, display: 'block' }}>Email</Typography>
            <input
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{ width: '100%', padding: 1, border: '1px solid rgba(0,0,0,0.12)', borderRadius: 1, boxSizing: 'border-box', fontSize: 1 }}
            />
          </Box>
          <Box component="div" sx={{ mb: 3 }}>
            <Typography variant="caption" sx={{ mb: 0.5, display: 'block' }}>Password</Typography>
            <input
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{ width: '100%', padding: 1, border: '1px solid rgba(0,0,0,0.12)', borderRadius: 1, boxSizing: 'border-box', fontSize: 1 }}
            />
          </Box>
          <Button type="submit" fullWidth variant="contained" size="large" disabled={loading} sx={{ mt: 1 }}>
            Sign in
          </Button>
        </form>
        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Don't have an account?{' '}
            <Button color="inherit" variant="text" sx={{ p: 0, ml: 0.5 }}>Sign up</Button>
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}
