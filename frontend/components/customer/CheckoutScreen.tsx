'use client';

import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { CartItem, OrderType } from '@/types/customer';
import { useTranslation } from '@/contexts/TranslationContext';

interface CheckoutScreenProps {
  cart: CartItem[];
  cartTotal: number;
  orderType: OrderType;
  onContinueToPayment: () => void;
  onBack: () => void;
}

export default function CheckoutScreen({
  cart,
  cartTotal,
  orderType,
  onContinueToPayment,
  onBack,
}: CheckoutScreenProps) {
  const { t } = useTranslation();
  const tax = cartTotal * 0.0825;
  const grandTotal = cartTotal + tax;

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: '#FAF3E0',
      }}
    >
      {/* Top bar */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          px: 2,
          py: 1.5,
          bgcolor: '#2D3436',
        }}
      >
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={onBack}
          sx={{ color: '#FAF3E0', textTransform: 'none', fontSize: '1rem' }}
        >
          {t('Back to Menu')}
        </Button>
      </Box>

      {/* Order summary */}
      <Box
        sx={{
          flex: 1,
          overflowY: 'auto',
          display: 'flex',
          justifyContent: 'center',
          py: 4,
          px: 2,
        }}
      >
        <Box sx={{ width: '100%', maxWidth: 500 }}>
          <Typography
            sx={{ color: '#2D3436', fontWeight: 700, fontSize: '1.75rem', mb: 1 }}
          >
            {t('Order Summary')}
          </Typography>
          <Box
            sx={{
              display: 'inline-block',
              bgcolor: '#4ECDC4',
              color: '#fff',
              px: 2,
              py: 0.5,
              borderRadius: 2,
              fontSize: '0.85rem',
              fontWeight: 600,
              mb: 3,
            }}
          >
            {orderType === 'dine_in' ? t('Dine In') : t('Carry Out')}
          </Box>

          {cart.map((item) => {
            const customizations = [
              item.size !== 'Regular' ? item.size : null,
              item.sugarLevel !== '100%' ? `${item.sugarLevel} sugar` : null,
              item.iceLevel !== 'Regular' ? item.iceLevel : null,
              ...item.toppings,
            ].filter(Boolean);

            return (
              <Box
                key={item.cartId}
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  py: 1.5,
                  borderBottom: '1px solid #f0e6d3',
                }}
              >
                <Box>
                  <Typography sx={{ color: '#2D3436', fontWeight: 600 }}>
                    {item.quantity}x {t(item.menuItem.name)}
                  </Typography>
                  {customizations.length > 0 && (
                    <Typography sx={{ color: '#636E72', fontSize: '0.8rem', mt: 0.25 }}>
                      {customizations.map((c) => t(c as string)).join(' · ')}
                    </Typography>
                  )}
                </Box>
                <Typography sx={{ color: '#FF6B6B', fontWeight: 600 }}>
                  ${(Number(item.menuItem.price) * item.quantity).toFixed(2)}
                </Typography>
              </Box>
            );
          })}

          <Divider sx={{ borderColor: '#e0d5c0', my: 2 }} />

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography sx={{ color: '#636E72' }}>{t('Subtotal')}</Typography>
            <Typography sx={{ color: '#2D3436' }}>${cartTotal.toFixed(2)}</Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography sx={{ color: '#636E72' }}>{t('Tax')} (8.25%)</Typography>
            <Typography sx={{ color: '#2D3436' }}>${tax.toFixed(2)}</Typography>
          </Box>

          <Divider sx={{ borderColor: '#e0d5c0', my: 2 }} />

          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography sx={{ color: '#2D3436', fontWeight: 700, fontSize: '1.25rem' }}>
              {t('Total')}
            </Typography>
            <Typography sx={{ color: '#FF6B6B', fontWeight: 700, fontSize: '1.25rem' }}>
              ${grandTotal.toFixed(2)}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Place order button */}
      <Box
        sx={{
          px: 3,
          py: 3,
          bgcolor: '#FFF8EE',
          borderTop: '2px solid #f0e6d3',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <Button
          variant="contained"
          onClick={onContinueToPayment}
          sx={{
            bgcolor: '#FF6B6B',
            color: '#fff',
            fontWeight: 700,
            textTransform: 'none',
            fontSize: '1.25rem',
            px: 8,
            py: 2,
            borderRadius: 4,
            minWidth: 300,
            boxShadow: '0 4px 14px rgba(255,107,107,0.4)',
            '&:hover': { bgcolor: '#ee5a5a', boxShadow: '0 6px 20px rgba(255,107,107,0.5)' },
          }}
        >
          {t('Continue to Payment')}
        </Button>
      </Box>
    </Box>
  );
}
