'use client';

import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Image from 'next/image';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import { OrderType } from '@/types/customer';

interface WelcomeScreenProps {
  onSelectOrderType: (type: OrderType) => void;
}

export default function WelcomeScreen({ onSelectOrderType }: WelcomeScreenProps) {
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
      }}
    >
      <Image
        src="/project_3_logo.png"
        alt="Boba Shop Logo"
        width={400}
        height={160}
        priority
      />

      <Typography
        variant="h3"
        sx={{
          color: '#2D3436',
          fontWeight: 700,
          textAlign: 'center',
          mt: 2,
        }}
      >
        Welcome!
      </Typography>

      <Typography
        sx={{
          color: '#636E72',
          fontSize: '1.25rem',
          textAlign: 'center',
        }}
      >
        How would you like your order today?
      </Typography>

      <Box sx={{ display: 'flex', gap: 4, mt: 4 }}>
        <Button
          variant="contained"
          onClick={() => onSelectOrderType('dine_in')}
          startIcon={<RestaurantIcon sx={{ fontSize: 28 }} />}
          sx={{
            bgcolor: '#FF6B6B',
            color: '#fff',
            fontSize: '1.4rem',
            fontWeight: 700,
            px: 5,
            py: 3,
            borderRadius: 4,
            textTransform: 'none',
            minWidth: 220,
            boxShadow: '0 4px 14px rgba(255,107,107,0.4)',
            '&:hover': { bgcolor: '#ee5a5a', boxShadow: '0 6px 20px rgba(255,107,107,0.5)' },
          }}
        >
          Dine In
        </Button>
        <Button
          variant="contained"
          onClick={() => onSelectOrderType('carry_out')}
          startIcon={<ShoppingBagIcon sx={{ fontSize: 28 }} />}
          sx={{
            bgcolor: '#4ECDC4',
            color: '#fff',
            fontSize: '1.4rem',
            fontWeight: 700,
            px: 5,
            py: 3,
            borderRadius: 4,
            textTransform: 'none',
            minWidth: 220,
            boxShadow: '0 4px 14px rgba(78,205,196,0.4)',
            '&:hover': { bgcolor: '#3dbdb5', boxShadow: '0 6px 20px rgba(78,205,196,0.5)' },
          }}
        >
          Carry Out
        </Button>
      </Box>

      <Typography
        sx={{ color: '#b2bec3', fontSize: '0.95rem', mt: 6 }}
      >
        Tap to begin your order
      </Typography>
    </Box>
  );
}
