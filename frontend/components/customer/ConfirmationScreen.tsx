'use client';

import React, { useState, useEffect, useRef } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { PlacedOrder } from '@/types/customer';

interface ConfirmationScreenProps {
  order: PlacedOrder | null;
  onStartOver: () => void;
}

const AUTO_RESET_SECONDS = 30;

export default function ConfirmationScreen({
  order,
  onStartOver,
}: ConfirmationScreenProps) {
  const [countdown, setCountdown] = useState(AUTO_RESET_SECONDS);
  const onStartOverRef = useRef(onStartOver);
  onStartOverRef.current = onStartOver;

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (countdown === 0) {
      onStartOverRef.current();
    }
  }, [countdown]);

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: '#FAF3E0',
        gap: 3,
        px: 4,
        textAlign: 'center',
      }}
    >
      <CheckCircleOutlineIcon sx={{ fontSize: 100, color: '#4ECDC4' }} />

      <Typography
        sx={{ color: '#2D3436', fontWeight: 700, fontSize: '2rem' }}
      >
        Order Placed!
      </Typography>

      {order && (
        <Box
          sx={{
            bgcolor: '#FFF8EE',
            borderRadius: 4,
            border: '2px solid #f0e6d3',
            px: 6,
            py: 4,
            mt: 1,
          }}
        >
          <Typography sx={{ color: '#636E72', fontSize: '1rem', mb: 1 }}>
            Your order number
          </Typography>
          <Typography
            sx={{ color: '#FF6B6B', fontWeight: 700, fontSize: '3.5rem', lineHeight: 1 }}
          >
            #{order.id}
          </Typography>
          <Typography sx={{ color: '#636E72', fontSize: '1rem', mt: 2 }}>
            Total: ${Number(order.total).toFixed(2)}
          </Typography>
          {order.payment_type && (
            <Typography sx={{ color: '#636E72', fontSize: '0.9rem', mt: 1.5 }}>
              Paid with{' '}
              <Box component="span" sx={{ fontWeight: 700, color: '#2D3436' }}>
                {order.payment_type === 'credit_card'
                  ? 'Credit Card'
                  : order.payment_type === 'cash'
                    ? 'Cash'
                    : 'Dining Dollars'}
              </Box>
            </Typography>
          )}
          {order.payment_type === 'cash' && order.change_due != null && order.change_due > 0 && (
            <Typography sx={{ color: '#4ECDC4', fontWeight: 700, fontSize: '1.1rem', mt: 1 }}>
              Change: ${order.change_due.toFixed(2)}
            </Typography>
          )}
        </Box>
      )}

      <Typography
        sx={{ color: '#636E72', fontSize: '1.1rem', mt: 2, maxWidth: 400 }}
      >
        Thank you! Your order is being prepared. Please wait for your number to
        be called.
      </Typography>

      <Button
        variant="contained"
        onClick={onStartOver}
        sx={{
          bgcolor: '#FF6B6B',
          color: '#fff',
          fontWeight: 700,
          textTransform: 'none',
          fontSize: '1.15rem',
          px: 6,
          py: 1.5,
          borderRadius: 4,
          mt: 3,
          boxShadow: '0 4px 14px rgba(255,107,107,0.4)',
          '&:hover': { bgcolor: '#ee5a5a', boxShadow: '0 6px 20px rgba(255,107,107,0.5)' },
        }}
      >
        Start New Order
      </Button>

      <Typography sx={{ color: '#b2bec3', fontSize: '0.85rem', mt: 2 }}>
        Returning to start in {countdown} second{countdown !== 1 ? 's' : ''}...
      </Typography>
    </Box>
  );
}
