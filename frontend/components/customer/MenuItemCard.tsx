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
import { useTranslation } from '@/contexts/TranslationContext';
import { publicAssetUrl } from '@/utils/publicAssetUrl';
import { imageObjectPosition } from '@/utils/imageFocus';

interface MenuItemCardProps {
  item: MenuItem;
  onSelect: (item: MenuItem) => void;
  cardWidth?: number;
  imageHeight?: number;
  cardMinHeight?: number;
}

export default function MenuItemCard({
  item,
  onSelect,
  cardWidth = 200,
  imageHeight = 120,
  cardMinHeight = 230,
}: MenuItemCardProps) {
  const { t } = useTranslation();
  const isSnack = item.category === 'Snacks';
  const imageSrc = publicAssetUrl(item.image);
  const objectPosition = imageObjectPosition(item.imageFocusX, item.imageFocusY);

  return (
    <Card
      sx={{
        bgcolor: 'var(--color-cream-light)',
        borderRadius: 3,
        border: '1px solid var(--color-cream-hover)',
        minHeight: cardMinHeight,
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
            height: imageHeight,
            overflow: 'hidden',
            bgcolor: 'var(--color-cream)',
          }}
        >
          {imageSrc ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imageSrc}
              alt={item.name}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition,
              }}
            />
          ) : isSnack ? (
            <Box
              sx={{
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <FastfoodIcon sx={{ fontSize: 56, color: 'var(--color-accent-coral)' }} />
            </Box>
          ) : (
            <Box
              sx={{
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <LocalCafeIcon sx={{ fontSize: 56, color: 'var(--color-accent-teal)' }} />
            </Box>
          )}
        </Box>
        <CardContent sx={{ minHeight: Math.max(88, cardMinHeight - imageHeight) }}>
          <Typography
            sx={{
              fontWeight: 600,
              fontSize: cardWidth >= 240 ? '1.06rem' : '1rem',
              color: 'var(--color-kiosk-text)',
              lineHeight: 1.25,
            }}
          >
            {t(item.name)}
          </Typography>
          <Typography
            sx={{
              color: 'var(--color-accent-coral)',
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
