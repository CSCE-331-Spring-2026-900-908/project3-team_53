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
        borderBottom: '1px solid var(--color-accent-teal-dark)',
      }}
    >
      <Box sx={{ flex: 1 }}>
        <Typography sx={{ color: 'var(--color-cream)', fontWeight: 600, fontSize: '1rem' }}>
          {t(item.menuItem.name)}
        </Typography>
        {customizations.length > 0 && (
          <Typography sx={{ color: 'var(--color-kiosk-light-gray)', fontSize: '0.8rem', mt: 0.5 }}>
            {customizations.join(' · ')}
          </Typography>
        )}
        <Typography sx={{ color: 'var(--color-accent-coral)', fontSize: '0.95rem', fontWeight: 600, mt: 0.5 }}>
          ${(Number(item.menuItem.price) * item.quantity).toFixed(2)}
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        <IconButton
          size="small"
          onClick={() => onUpdateQuantity(item.cartId, item.quantity - 1)}
          sx={{ color: 'var(--color-accent-teal)' }}
        >
          <RemoveIcon fontSize="small" />
        </IconButton>
        <Typography sx={{ color: 'var(--color-cream)', minWidth: 24, textAlign: 'center', fontWeight: 600 }}>
          {item.quantity}
        </Typography>
        <IconButton
          size="small"
          onClick={() => onUpdateQuantity(item.cartId, item.quantity + 1)}
          sx={{ color: 'var(--color-accent-teal)' }}
        >
          <AddIcon fontSize="small" />
        </IconButton>
        <IconButton
          size="small"
          onClick={() => onRemove(item.cartId)}
          sx={{ color: 'var(--color-accent-coral)', ml: 1 }}
        >
          <DeleteOutlineIcon fontSize="small" />
        </IconButton>
      </Box>
    </Box>
  );
}
