'use client';

import React from 'react';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import ContrastIcon from '@mui/icons-material/Contrast';
import { useHighContrast } from '@/contexts/HighContrastContext';

export default function HighContrastToggle() {
  const { highContrast, toggleHighContrast } = useHighContrast();

  return (
    <Tooltip title={highContrast ? 'Disable high contrast' : 'Enable high contrast'}>
      <IconButton
        onClick={toggleHighContrast}
        aria-label={highContrast ? 'Disable high contrast mode' : 'Enable high contrast mode'}
        aria-pressed={highContrast}
        size="medium"
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 9999,
          backgroundColor: highContrast ? '#000000' : 'var(--color-text-primary)',
          color: highContrast ? '#ffffff' : 'var(--color-text-white)',
          border: highContrast ? '3px solid #ffffff' : '2px solid transparent',
          boxShadow: 3,
          '&:hover': {
            backgroundColor: highContrast ? '#333333' : 'var(--color-warm-brown-dark)',
          },
        }}
      >
        <ContrastIcon />
      </IconButton>
    </Tooltip>
  );
}
