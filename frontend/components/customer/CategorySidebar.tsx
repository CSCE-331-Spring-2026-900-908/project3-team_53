'use client';

import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { useTranslation } from '@/contexts/TranslationContext';

interface CategorySidebarProps {
  categories: string[];
  selected: string;
  onSelect: (category: string) => void;
}

export default function CategorySidebar({
  categories,
  selected,
  onSelect,
}: CategorySidebarProps) {
  const { t } = useTranslation();

  return (
    <Box
      sx={{
        width: 200,
        minWidth: 200,
        bgcolor: 'var(--color-kiosk-text)',
        display: 'flex',
        flexDirection: 'column',
        py: 2,
        gap: 0.5,
        overflowY: 'auto',
      }}
    >
      {categories.map((cat) => (
        <Button
          key={cat}
          onClick={() => onSelect(cat)}
          sx={{
            justifyContent: 'flex-start',
            px: 3,
            py: 2,
            color: selected === cat ? 'var(--color-kiosk-text)' : 'var(--color-cream)',
            bgcolor: selected === cat ? 'var(--color-accent-teal)' : 'transparent',
            borderRadius: 0,
            borderLeft: selected === cat ? '4px solid var(--color-accent-coral)' : '4px solid transparent',
            textTransform: 'none',
            fontSize: '1rem',
            fontWeight: selected === cat ? 700 : 400,
            '&:hover': {
              bgcolor: selected === cat ? 'var(--color-accent-teal-hover)' : 'rgba(78,205,196,0.15)',
            },
          }}
        >
          {t(cat)}
        </Button>
      ))}
    </Box>
  );
}
