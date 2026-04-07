'use client';

import React from 'react';
import Drawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import Chip from '@mui/material/Chip';
import { CartItem, OrderType } from '@/types/customer';
import CartItemRow from './CartItemRow';
import { useTranslation } from '@/contexts/TranslationContext';

interface CartSidebarProps {
  open: boolean;
  cart: CartItem[];
  cartTotal: number;
  orderType: OrderType;
  onToggleOrderType: () => void;
  onClose: () => void;
  onUpdateQuantity: (cartId: string, quantity: number) => void;
  onRemove: (cartId: string) => void;
  onCheckout: () => void;
}

export default function CartSidebar({
  open,
  cart,
  cartTotal,
  orderType,
  onToggleOrderType,
  onClose,
  onUpdateQuantity,
  onRemove,
  onCheckout,
}: CartSidebarProps) {
  const { t } = useTranslation();

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: 380,
          bgcolor: '#2D3436',
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          px: 3,
          py: 2,
          borderBottom: '2px solid #3a4144',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography sx={{ color: '#FAF3E0', fontWeight: 700, fontSize: '1.25rem' }}>
            {t('Your Order')}
          </Typography>
          <IconButton onClick={onClose} sx={{ color: '#FAF3E0' }}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Chip
          icon={<SwapHorizIcon sx={{ color: '#fff !important', fontSize: 18 }} />}
          label={orderType === 'dine_in' ? t('Dine In') : t('Carry Out')}
          onClick={onToggleOrderType}
          sx={{
            mt: 1,
            bgcolor: '#4ECDC4',
            color: '#fff',
            fontWeight: 600,
            fontSize: '0.85rem',
            cursor: 'pointer',
            '&:hover': { bgcolor: '#3dbdb5' },
          }}
        />
      </Box>

      {/* Cart items */}
      <Box sx={{ flex: 1, overflowY: 'auto', px: 3 }}>
        {cart.length === 0 ? (
          <Typography sx={{ color: '#636E72', textAlign: 'center', mt: 6 }}>
            {t('Your cart is empty')}
          </Typography>
        ) : (
          cart.map((item) => (
            <CartItemRow
              key={item.cartId}
              item={item}
              onUpdateQuantity={onUpdateQuantity}
              onRemove={onRemove}
            />
          ))
        )}
      </Box>

      {/* Footer with total and checkout */}
      {cart.length > 0 && (
        <Box
          sx={{
            px: 3,
            py: 2,
            borderTop: '2px solid #3a4144',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              mb: 2,
            }}
          >
            <Typography sx={{ color: '#FAF3E0', fontWeight: 700, fontSize: '1.15rem' }}>
              {t('Total')}
            </Typography>
            <Typography sx={{ color: '#FF6B6B', fontWeight: 700, fontSize: '1.15rem' }}>
              ${cartTotal.toFixed(2)}
            </Typography>
          </Box>
          <Button
            variant="contained"
            fullWidth
            onClick={onCheckout}
            sx={{
              bgcolor: '#FF6B6B',
              color: '#fff',
              fontWeight: 700,
              textTransform: 'none',
              fontSize: '1.1rem',
              py: 1.5,
              borderRadius: 3,
              boxShadow: '0 3px 10px rgba(255,107,107,0.3)',
              '&:hover': { bgcolor: '#ee5a5a' },
            }}
          >
            {t('Checkout')}
          </Button>
        </Box>
      )}
    </Drawer>
  );
}
