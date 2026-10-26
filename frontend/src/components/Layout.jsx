import React from 'react';
import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';

export default function Layout() {
  return (
    <Box sx={{ pt: { xs: '102px', md: '108px' }, minHeight: '100vh', backgroundColor: '#F8FAFC' }}>
      <Outlet />
    </Box>
  );
}
