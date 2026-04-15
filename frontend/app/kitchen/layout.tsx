'use client';

import React from 'react';
import RequireAuth from '@/components/RequireAuth';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function KitchenLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.replace('/login');
  };

  return (
    <RequireAuth>
      <Box
        component="header"
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 3,
          py: 1.5,
          backgroundColor: 'var(--color-dark-bg)',
          color: 'var(--color-text-white)',
        }}
      >
        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
          {user?.name}
        </Typography>
        <Button variant="outlined" size="small" onClick={handleLogout} sx={{ color: 'var(--color-text-white)', borderColor: 'var(--color-text-white)' }}>
          Sign Out
        </Button>
      </Box>
      {children}
    </RequireAuth>
  );
}
