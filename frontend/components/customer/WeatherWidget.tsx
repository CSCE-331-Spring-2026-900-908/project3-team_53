'use client';

import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ThermostatIcon from '@mui/icons-material/Thermostat';
import CircularProgress from '@mui/material/CircularProgress';
import { useWeather } from '@/hooks/useWeather';

export default function WeatherWidget() {
  const { weather, loading } = useWeather();

  if (loading) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <CircularProgress size={16} sx={{ color: 'var(--color-kiosk-muted)' }} />
        <Typography sx={{ color: 'var(--color-kiosk-muted)', fontSize: '0.85rem' }}>
          Loading weather...
        </Typography>
      </Box>
    );
  }

  if (!weather) return null;

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        bgcolor: 'var(--color-kiosk-text)',
        borderRadius: 3,
        px: 2,
        py: 1,
        boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
      }}
    >
      <ThermostatIcon sx={{ color: 'var(--color-accent-coral)', fontSize: 22 }} />
      <Typography
        sx={{ color: 'var(--color-text-white)', fontWeight: 700, fontSize: '0.95rem' }}
      >
        {weather.temperature}{weather.unit}
      </Typography>
      <Typography sx={{ color: 'var(--color-kiosk-border-light)', fontSize: '0.85rem' }}>
        {weather.description}
      </Typography>
      <Typography sx={{ color: 'var(--color-kiosk-lighter-gray)', fontSize: '0.75rem', ml: 0.5 }}>
        College Station, TX
      </Typography>
    </Box>
  );
}
