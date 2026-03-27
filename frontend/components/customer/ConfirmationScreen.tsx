'use client';

import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { PlacedOrder } from '@/types/customer';

interface ConfirmationScreenProps {
  order: PlacedOrder | null;
  onStartOver: () => void;
}

export default function ConfirmationScreen({
  order,
  onStartOver,
}: ConfirmationScreenProps) {
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
    </Box>
  );
}
