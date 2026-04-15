'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import Divider from '@mui/material/Divider';
import CircularProgress from '@mui/material/CircularProgress';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Image from 'next/image';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
          <CircularProgress />
        </Box>
      }
    >
      <LoginContent />
    </Suspense>
  );
}

type LoginMode = 'choose' | 'google' | 'pin';

function PinPad({ onSubmit, error, setError }: {
  onSubmit: (pin: string) => void;
  error: string | null;
  setError: (e: string | null) => void;
}) {
  const [pin, setPin] = useState('');
  const maxLength = 6;

  const handleDigit = (digit: string) => {
    setError(null);
    if (pin.length < maxLength) {
      setPin(prev => prev + digit);
    }
  };

  const handleBackspace = () => {
    setError(null);
    setPin(prev => prev.slice(0, -1));
  };

  const handleClear = () => {
    setError(null);
    setPin('');
  };

  const handleSubmit = () => {
    if (pin.length < 4) {
      setError('PIN must be at least 4 digits');
      return;
    }
    onSubmit(pin);
  };

  const buttonSx = {
    width: 80,
    height: 80,
    fontSize: '1.75rem',
    fontWeight: 700,
    borderRadius: 3,
    backgroundColor: 'var(--color-surface)',
    color: 'var(--color-text-primary)',
    border: '2px solid var(--color-divider)',
    '&:hover': { backgroundColor: 'var(--color-cream-input-hover)', borderColor: 'var(--color-warm-brown-border)' },
    '&:active': { backgroundColor: 'var(--color-cream-input-active)', transform: 'scale(0.95)' },
    transition: 'all 0.1s ease',
    touchAction: 'manipulation',
  };

  const digits = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, width: '100%' }}>
      {/* PIN display */}
      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        gap: 1.5,
        my: 1,
      }}>
        {Array.from({ length: maxLength }).map((_, i) => (
          <Box
            key={i}
            sx={{
              width: 18,
              height: 18,
              borderRadius: '50%',
              backgroundColor: i < pin.length ? 'var(--color-warm-brown)' : 'transparent',
              border: '2px solid var(--color-warm-brown)',
              transition: 'background-color 0.15s ease',
            }}
          />
        ))}
      </Box>

      {error && (
        <Alert severity="error" sx={{ width: '100%', borderRadius: 2, py: 0.5 }}>
          {error}
        </Alert>
      )}

      {/* Number grid */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        {digits.map((row, rowIdx) => (
          <Box key={rowIdx} sx={{ display: 'flex', gap: 1.5, justifyContent: 'center' }}>
            {row.map(digit => (
              <Button key={digit} sx={buttonSx} onClick={() => handleDigit(digit)}>
                {digit}
              </Button>
            ))}
          </Box>
        ))}
        {/* Bottom row: Clear, 0, Backspace */}
        <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'center' }}>
          <Button
            sx={{ ...buttonSx, fontSize: '0.85rem', color: 'var(--color-text-muted)' }}
            onClick={handleClear}
          >
            Clear
          </Button>
          <Button sx={buttonSx} onClick={() => handleDigit('0')}>
            0
          </Button>
          <IconButton
            sx={{ ...buttonSx, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            onClick={handleBackspace}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-secondary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 4H8l-7 8 7 8h13a2 2 0 002-2V6a2 2 0 00-2-2z" />
              <line x1="18" y1="9" x2="12" y2="15" />
              <line x1="12" y1="9" x2="18" y2="15" />
            </svg>
          </IconButton>
        </Box>
      </Box>

      {/* Enter button */}
      <Button
        variant="contained"
        onClick={handleSubmit}
        disabled={pin.length < 4}
        sx={{
          width: '100%',
          maxWidth: 268,
          height: 56,
          fontSize: '1.1rem',
          fontWeight: 700,
          borderRadius: 3,
          backgroundColor: 'var(--color-warm-brown)',
          '&:hover': { backgroundColor: 'var(--color-warm-brown-dark)' },
          '&:disabled': { backgroundColor: 'var(--color-border)', color: 'var(--color-warm-brown-disabled)' },
          touchAction: 'manipulation',
          mt: 1,
        }}
      >
        Sign In
      </Button>
    </Box>
  );
}

function LoginContent() {
  const { loginWithGoogle, loginWithPin, user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const redirect = searchParams.get('redirect') || '/';
  const isManagerRedirect = redirect.startsWith('/manager');
  const [mode, setMode] = useState<LoginMode>(isManagerRedirect ? 'google' : 'choose');

  useEffect(() => {
    if (user) {
      router.replace(redirect);
    }
  }, [user, router, redirect]);

  if (user) {
    return null;
  }

  const handlePinSubmit = async (pin: string) => {
    setError(null);
    setLoading(true);
    try {
      await loginWithPin(pin);
      router.replace(redirect);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Invalid PIN. Please try again.',
      );
    } finally {
      setLoading(false);
    }
  };

  const modeButtonSx = {
    width: '100%',
    height: 64,
    fontSize: '1.05rem',
    fontWeight: 600,
    borderRadius: 3,
    textTransform: 'none' as const,
    touchAction: 'manipulation' as const,
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(145deg, var(--color-page-bg) 0%, var(--color-page-bg-dark) 100%)',
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
          py: 4,
          borderRadius: 4,
          backgroundColor: 'var(--color-cream)',
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
          sx={{ fontWeight: 700, textAlign: 'center', color: 'var(--color-text-primary)' }}
        >
          {isManagerRedirect ? 'Manager Sign In' : 'Employee Sign In'}
        </Typography>

        {mode === 'choose' && (
          <>
            <Typography
              variant="body2"
              sx={{ color: 'var(--color-warm-brown-muted)', textAlign: 'center', lineHeight: 1.6 }}
            >
              Choose how you&apos;d like to sign in.
            </Typography>

            <Divider sx={{ width: '100%', borderColor: 'var(--color-divider)' }} />

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}>
              <Button
                variant="contained"
                onClick={() => { setError(null); setMode('pin'); }}
                sx={{
                  ...modeButtonSx,
                  backgroundColor: 'var(--color-warm-brown)',
                  '&:hover': { backgroundColor: 'var(--color-warm-brown-dark)' },
                }}
              >
                🔢&nbsp;&nbsp;Sign In with PIN
              </Button>
              <Button
                variant="outlined"
                onClick={() => { setError(null); setMode('google'); }}
                sx={{
                  ...modeButtonSx,
                  borderColor: 'var(--color-warm-brown-border)',
                  color: 'var(--color-warm-brown)',
                  '&:hover': { backgroundColor: 'var(--color-cream-input-hover)', borderColor: 'var(--color-warm-brown-border-hover)' },
                }}
              >
                <svg width="20" height="20" viewBox="0 0 48 48" style={{ marginRight: 12 }}>
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                </svg>
                Sign In with Google
              </Button>
            </Box>
          </>
        )}

        {mode === 'pin' && (
          <>
            <Typography
              variant="body2"
              sx={{ color: 'var(--color-warm-brown-muted)', textAlign: 'center', lineHeight: 1.6 }}
            >
              Enter your employee PIN.
            </Typography>

            <Divider sx={{ width: '100%', borderColor: 'var(--color-divider)' }} />

            {loading ? (
              <CircularProgress sx={{ my: 4 }} />
            ) : (
              <PinPad onSubmit={handlePinSubmit} error={error} setError={setError} />
            )}

            <Button
              onClick={() => { setError(null); setMode('choose'); }}
              sx={{
                color: 'var(--color-text-muted)',
                textTransform: 'none',
                fontSize: '0.9rem',
                touchAction: 'manipulation',
              }}
            >
              ← Back to sign in options
            </Button>
          </>
        )}

        {mode === 'google' && (
          <>
            <Typography
              variant="body2"
              sx={{ color: 'var(--color-warm-brown-muted)', textAlign: 'center', lineHeight: 1.6 }}
            >
              Sign in with your Google account.
            </Typography>

            <Divider sx={{ width: '100%', borderColor: 'var(--color-divider)' }} />

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

            {!isManagerRedirect && (
              <Button
                onClick={() => { setError(null); setMode('choose'); }}
                sx={{
                color: 'var(--color-text-muted)',
                textTransform: 'none',
                fontSize: '0.9rem',
                touchAction: 'manipulation',
              }}
            >
              ← Back to sign in options
            </Button>
            )}
          </>
        )}

        <Typography variant="caption" sx={{ color: 'var(--color-text-light)', textAlign: 'center' }}>
          Only authorized employees can sign in.
        </Typography>
      </Paper>
    </Box>
  );
}
