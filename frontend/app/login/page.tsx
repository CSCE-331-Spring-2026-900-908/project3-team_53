'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import Divider from '@mui/material/Divider';
import Image from 'next/image';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginPage() {
  const { loginWithGoogle, user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  const redirect = searchParams.get('redirect') || '/';

  useEffect(() => {
    if (user) {
      router.replace(redirect);
    }
  }, [user, router, redirect]);

  if (user) {
    return null;
  }

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
          gap: 3,
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
          width={260}
          height={104}
          priority
        />

        <Typography
          variant="h4"
          component="h1"
          sx={{ fontWeight: 700, textAlign: 'center', color: '#333' }}
        >
          Employee Sign In
        </Typography>

        <Typography
          variant="body2"
          sx={{ color: '#777', textAlign: 'center', lineHeight: 1.6 }}
        >
          Sign in with your Google account to access the manager or employee portal.
        </Typography>

        <Divider sx={{ width: '100%', borderColor: '#e0d9c4' }} />

        {error && (
          <Alert severity="error" sx={{ width: '100%', borderRadius: 2 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
          <GoogleLogin
            onSuccess={async (credentialResponse) => {
              setError(null);
              try {
                if (!credentialResponse.credential) {
                  setError('No credential received from Google');
                  return;
                }
                await loginWithGoogle(credentialResponse.credential);
                router.replace(redirect);
              } catch (err) {
                setError(
                  err instanceof Error
                    ? err.message
                    : 'Login failed. Make sure your account is linked to an employee record.',
                );
              }
            }}
            onError={() => {
              setError('Google sign-in was cancelled or failed.');
            }}
            size="large"
            theme="outline"
            text="signin_with"
            shape="pill"
            width="320"
          />
        </Box>

        <Typography variant="caption" sx={{ color: '#aaa', textAlign: 'center', mt: 1 }}>
          Only authorized employees can sign in.
        </Typography>
      </Paper>
    </Box>
  );
}
