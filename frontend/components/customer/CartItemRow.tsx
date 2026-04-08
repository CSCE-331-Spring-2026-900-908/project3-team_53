'use client';

import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { CartItem } from '@/types/customer';
import { useTranslation } from '@/contexts/TranslationContext';

interface CartItemRowProps {
  item: CartItem;
  onUpdateQuantity: (cartId: string, quantity: number) => void;
  onRemove: (cartId: string) => void;
}

export default function CartItemRow({
  item,
  onUpdateQuantity,
  onRemove,
}: CartItemRowProps) {
  const { t } = useTranslation();

  const customizations = [
    item.size !== 'Regular' ? t(item.size) : null,
    item.sugarLevel !== '100%' ? `${t(item.sugarLevel)} ${t('sugar')}` : null,
    item.iceLevel !== 'Regular' ? t(item.iceLevel) : null,
    ...item.toppings.map((tp) => t(tp)),
  ].filter(Boolean);

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 2,
        py: 2,
        borderBottom: '1px solid #3a4144',
      }}
    >
      <Box sx={{ flex: 1 }}>
        <Typography sx={{ color: '#FAF3E0', fontWeight: 600, fontSize: '1rem' }}>
          {t(item.menuItem.name)}
        </Typography>
        {customizations.length > 0 && (
          <Typography sx={{ color: '#b2bec3', fontSize: '0.8rem', mt: 0.5 }}>
            {customizations.join(' · ')}
          </Typography>
        )}
        <Typography sx={{ color: '#FF6B6B', fontSize: '0.95rem', fontWeight: 600, mt: 0.5 }}>
          ${(Number(item.menuItem.price) * item.quantity).toFixed(2)}
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        <IconButton
          size="small"
          onClick={() => onUpdateQuantity(item.cartId, item.quantity - 1)}
          sx={{ color: '#4ECDC4' }}
        >
          <RemoveIcon fontSize="small" />
        </IconButton>
        <Typography sx={{ color: '#FAF3E0', minWidth: 24, textAlign: 'center', fontWeight: 600 }}>
          {item.quantity}
        </Typography>
        <IconButton
          size="small"
          onClick={() => onUpdateQuantity(item.cartId, item.quantity + 1)}
          sx={{ color: '#4ECDC4' }}
        >
          <AddIcon fontSize="small" />
        </IconButton>
        <IconButton
          size="small"
          onClick={() => onRemove(item.cartId)}
          sx={{ color: '#FF6B6B', ml: 1 }}
        >
          <DeleteOutlineIcon fontSize="small" />
        </IconButton>
      </Box>
    </Box>
  );
}
