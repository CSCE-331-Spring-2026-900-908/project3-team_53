'use client';

import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActionArea from '@mui/material/CardActionArea';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import LocalCafeIcon from '@mui/icons-material/LocalCafe';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import { MenuItem } from '@/types/customer';

interface MenuItemCardProps {
  item: MenuItem;
  onSelect: (item: MenuItem) => void;
}

export default function MenuItemCard({ item, onSelect }: MenuItemCardProps) {
  const isSnack = item.category === 'Snacks';

  return (
    <Card
      sx={{
        bgcolor: '#FFF8EE',
        borderRadius: 3,
        border: '1px solid #f0e6d3',
        transition: 'transform 0.15s, box-shadow 0.15s',
        '&:hover': {
          transform: 'scale(1.03)',
          boxShadow: '0 6px 20px rgba(0,0,0,0.08)',
        },
      }}
    >
      <CardActionArea onClick={() => onSelect(item)} sx={{ height: '100%' }}>
        <Box
          sx={{
            height: 120,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: '#FAF3E0',
          }}
        >
          {isSnack ? (
            <FastfoodIcon sx={{ fontSize: 56, color: '#FF6B6B' }} />
          ) : (
            <LocalCafeIcon sx={{ fontSize: 56, color: '#4ECDC4' }} />
          )}
        </Box>
        <CardContent>
          <Typography
            sx={{ fontWeight: 600, fontSize: '1rem', color: '#2D3436' }}
          >
            {item.name}
          </Typography>
          <Typography
            sx={{
              color: '#FF6B6B',
              fontSize: '0.95rem',
              fontWeight: 700,
              mt: 0.5,
            }}
          >
            ${Number(item.price).toFixed(2)}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
