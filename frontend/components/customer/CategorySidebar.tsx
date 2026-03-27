'use client';

import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

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
  return (
    <Box
      sx={{
        width: 200,
        minWidth: 200,
        bgcolor: '#2D3436',
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
            color: selected === cat ? '#2D3436' : '#FAF3E0',
            bgcolor: selected === cat ? '#4ECDC4' : 'transparent',
            borderRadius: 0,
            borderLeft: selected === cat ? '4px solid #FF6B6B' : '4px solid transparent',
            textTransform: 'none',
            fontSize: '1rem',
            fontWeight: selected === cat ? 700 : 400,
            '&:hover': {
              bgcolor: selected === cat ? '#3dbdb5' : 'rgba(78,205,196,0.15)',
            },
          }}
        >
          {cat}
        </Button>
      ))}
    </Box>
  );
}
