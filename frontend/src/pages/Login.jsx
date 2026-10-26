import React, { useState } from 'react';
import {
  TextField,
  Button,
  Box,
  Divider,
  IconButton,
  InputAdornment,
  Alert,
  Link as MuiLink,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import AuthLayout from '../components/AuthLayout';

export default function Login() {
  const { handleLogin, error, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    handleLogin(form);
  };

  return (
    <AuthLayout title="Welcome back" subtitle="Sign in to your StockFlow Pro trading account.">
      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 3, fontSize: 15 }}>
          {error}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
        <TextField
          fullWidth
          required
          name="email"
          type="email"
          label="Email address"
          placeholder="you@example.com"
          autoComplete="email"
          value={form.email}
          onChange={onChange}
          sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3, backgroundColor: '#fff' } }}
        />
        <TextField
          fullWidth
          required
          name="password"
          type={showPassword ? 'text' : 'password'}
          label="Password"
          placeholder="••••••••"
          autoComplete="current-password"
          value={form.password}
          onChange={onChange}
          sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3, backgroundColor: '#fff' } }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword((s) => !s)} edge="end" aria-label="toggle password">
                  {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <Button
          type="submit"
          fullWidth
          variant="contained"
          size="large"
          disabled={loading}
          sx={{
            py: 1.6,
            fontSize: '1.08rem',
            fontWeight: 800,
            borderRadius: 3,
            textTransform: 'none',
            background: 'linear-gradient(135deg, #6D28D9 0%, #7C3AED 100%)',
            boxShadow: '0 10px 24px rgba(109, 40, 217, 0.35)',
            '&:hover': {
              background: 'linear-gradient(135deg, #5B21B6 0%, #6D28D9 100%)',
              boxShadow: '0 14px 32px rgba(109, 40, 217, 0.45)',
              transform: 'translateY(-1px)',
            },
          }}
        >
          {loading ? 'Signing in…' : 'Sign in to Account'}
        </Button>
      </Box>

      <Divider sx={{ my: 3 }}>
        <Box sx={{ px: 1, fontSize: 13, color: '#94a3b8', fontWeight: 600 }}>OR</Box>
      </Divider>

      <Button
        fullWidth
        variant="outlined"
        size="large"
        startIcon={
          <svg width="20" height="20" viewBox="0 0 48 48">
            <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.9 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.3-.4-3.5z" />
            <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4c-7.7 0-14.4 4.4-17.7 10.7z" />
            <path fill="#4CAF50" d="M24 44c5.5 0 10.5-2.1 14.3-5.6l-6.6-5.6C29.6 34.5 26.9 36 24 36c-5.3 0-9.7-3.1-11.3-7.6l-6.5 5C9.5 39.6 16.2 44 24 44z" />
            <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.1-4.1 5.5l6.6 5.6C41.6 36.5 44 30.7 44 24c0-1.3-.1-2.3-.4-3.5z" />
          </svg>
        }
        onClick={() => { window.location.href = 'http://localhost:5000/api/oauth/google'; }}
        sx={{
          py: 1.4,
          fontSize: '0.98rem',
          fontWeight: 700,
          borderRadius: 3,
          textTransform: 'none',
          borderColor: '#e2e8f0',
          color: '#1e293b',
          backgroundColor: '#fff',
          '&:hover': { borderColor: '#7C3AED', backgroundColor: '#fff' },
        }}
      >
        Continue with Google
      </Button>

      <Box sx={{ mt: 4, textAlign: 'center', fontSize: 15, color: '#64748B' }}>
        Don&apos;t have an account?{' '}
        <MuiLink component={Link} to="/register" sx={{ fontWeight: 800, color: '#6D28D9', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
          Open Free Demat Account
        </MuiLink>
      </Box>
    </AuthLayout>
  );
}
