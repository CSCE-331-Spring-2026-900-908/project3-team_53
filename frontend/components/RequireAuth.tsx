'use client';

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import CircularProgress from '@mui/material/CircularProgress';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';

interface RequireAuthProps {
  children: React.ReactNode;
  requiredRole?: string;
  requireGoogleAuth?: boolean;
}

export default function RequireAuth({ children, requiredRole, requireGoogleAuth }: RequireAuthProps) {
  const { user, loading, logout, authMethod } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) {
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [loading, user, router, pathname]);

  if (loading || !user) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  const handleSignOut = () => {
    logout();
    router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
  };

  if (requiredRole && user.role?.toLowerCase() !== requiredRole.toLowerCase()) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(145deg, #8f8f8f 0%, #6b6b6b 100%)',
          px: 2,
        }}
      >
        <Paper
          elevation={8}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2.5,
            px: 5,
            py: 5,
            borderRadius: 4,
            backgroundColor: '#FAF3E0',
            maxWidth: 440,
            width: '100%',
          }}
        >
          <Image
            src="/project_3_logo.png"
            alt="Boba Shop logo"
            width={200}
            height={80}
            priority
          />

          <Box
            sx={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              backgroundColor: '#f44336',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <LockOutlinedIcon sx={{ fontSize: 32, color: '#fff' }} />
          </Box>

          <Typography variant="h4" sx={{ fontWeight: 700, color: '#333', textAlign: 'center' }}>
            Access Denied
          </Typography>

          <Typography variant="body2" sx={{ color: '#777', textAlign: 'center', lineHeight: 1.6 }}>
            You are signed in as <strong style={{ color: '#333' }}>{user.name}</strong> ({user.email}),
            which has the <strong style={{ color: '#333' }}>{user.role ?? 'null'}</strong> role.
            This page requires the <strong style={{ color: '#333' }}>{requiredRole}</strong> role.
          </Typography>

          <Divider sx={{ width: '100%', borderColor: '#e0d9c4' }} />

          <Box sx={{ display: 'flex', gap: 2, width: '100%' }}>
            <Button
              variant="contained"
              fullWidth
              onClick={handleSignOut}
              sx={{
                backgroundColor: '#333',
                color: '#fff',
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
                '&:hover': { backgroundColor: '#555' },
              }}
            >
              Switch Account
            </Button>
          </Box>

          <Typography variant="caption" sx={{ color: '#aaa', textAlign: 'center' }}>
            Sign out and log in with a different Google account.
          </Typography>
        </Paper>
      </Box>
    );
  }

  if (requireGoogleAuth && authMethod !== 'google') {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(145deg, #8f8f8f 0%, #6b6b6b 100%)',
          px: 2,
        }}
      >
        <Paper
          elevation={8}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2.5,
            px: 5,
            py: 5,
            borderRadius: 4,
            backgroundColor: '#FAF3E0',
            maxWidth: 440,
            width: '100%',
          }}
        >
          <Image
            src="/project_3_logo.png"
            alt="Boba Shop logo"
            width={200}
            height={80}
            priority
          />

          <Box
            sx={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              backgroundColor: '#ff9800',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <LockOutlinedIcon sx={{ fontSize: 32, color: '#fff' }} />
          </Box>

          <Typography variant="h4" sx={{ fontWeight: 700, color: '#333', textAlign: 'center' }}>
            Google Sign-In Required
          </Typography>

          <Typography variant="body2" sx={{ color: '#777', textAlign: 'center', lineHeight: 1.6 }}>
            The manager area requires Google authentication. PIN login is not
            sufficient for this section. Please sign out and sign in with Google.
          </Typography>

          <Divider sx={{ width: '100%', borderColor: '#e0d9c4' }} />

          <Box sx={{ display: 'flex', gap: 2, width: '100%' }}>
            <Button
              variant="contained"
              fullWidth
              onClick={handleSignOut}
              sx={{
                backgroundColor: '#333',
                color: '#fff',
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
                '&:hover': { backgroundColor: '#555' },
              }}
            >
              Sign In with Google
            </Button>
          </Box>
        </Paper>
      </Box>
    );
  }

  return <>{children}</>;
}
