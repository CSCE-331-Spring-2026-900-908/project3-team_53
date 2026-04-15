'use client';

import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Image from 'next/image';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import { OrderType } from '@/types/customer';
import WeatherWidget from '@/components/customer/WeatherWidget';
import { useTranslation } from '@/contexts/TranslationContext';

interface WelcomeScreenProps {
  onSelectOrderType: (type: OrderType) => void;
}

export default function WelcomeScreen({ onSelectOrderType }: WelcomeScreenProps) {
  const { t } = useTranslation();

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'var(--color-cream)',
        gap: 3,
        px: 4,
        position: 'relative',
      }}
    >
      <Box sx={{ position: 'absolute', top: 24, left: '50%', transform: 'translateX(-50%)' }}>
        <WeatherWidget />
      </Box>

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
          color: 'var(--color-kiosk-text)',
          fontWeight: 700,
          textAlign: 'center',
          mt: 2,
        }}
      >
        {t('Welcome!')}
      </Typography>

      <Typography
        sx={{
          color: 'var(--color-kiosk-muted)',
          fontSize: '1.25rem',
          textAlign: 'center',
        }}
      >
        {t('How would you like your order today?')}
      </Typography>

      <Box sx={{ display: 'flex', gap: 4, mt: 4 }}>
        <Button
          variant="contained"
          onClick={() => onSelectOrderType('dine_in')}
          startIcon={<RestaurantIcon sx={{ fontSize: 28 }} />}
          sx={{
            bgcolor: 'var(--color-accent-coral)',
            color: 'var(--color-text-white)',
            fontSize: '1.4rem',
            fontWeight: 700,
            px: 5,
            py: 3,
            borderRadius: 4,
            textTransform: 'none',
            minWidth: 220,
            boxShadow: '0 4px 14px rgba(255,107,107,0.4)',
            '&:hover': { bgcolor: 'var(--color-accent-coral-hover)', boxShadow: '0 6px 20px rgba(255,107,107,0.5)' },
          }}
        >
          {t('Dine In')}
        </Button>
        <Button
          variant="contained"
          onClick={() => onSelectOrderType('carry_out')}
          startIcon={<ShoppingBagIcon sx={{ fontSize: 28 }} />}
          sx={{
            bgcolor: 'var(--color-accent-teal)',
            color: 'var(--color-text-white)',
            fontSize: '1.4rem',
            fontWeight: 700,
            px: 5,
            py: 3,
            borderRadius: 4,
            textTransform: 'none',
            minWidth: 220,
            boxShadow: '0 4px 14px rgba(78,205,196,0.4)',
            '&:hover': { bgcolor: 'var(--color-accent-teal-hover)', boxShadow: '0 6px 20px rgba(78,205,196,0.5)' },
          }}
        >
          {t('Carry Out')}
        </Button>
      </Box>

      <Typography
        sx={{ color: 'var(--color-kiosk-light-gray)', fontSize: '0.95rem', mt: 6 }}
      >
        {t('Tap to begin your order')}
      </Typography>
    </Box>
  );
}
