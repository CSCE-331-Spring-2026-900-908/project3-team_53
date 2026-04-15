'use client';

import React, { useState, useEffect, useRef } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { PlacedOrder } from '@/types/customer';
import { useTranslation } from '@/contexts/TranslationContext';

interface ConfirmationScreenProps {
  order: PlacedOrder | null;
  onStartOver: () => void;
}

const AUTO_RESET_SECONDS = 30;

export default function ConfirmationScreen({
  order,
  onStartOver,
}: ConfirmationScreenProps) {
  const { t } = useTranslation();
  const [countdown, setCountdown] = useState(AUTO_RESET_SECONDS);
  const onStartOverRef = useRef(onStartOver);

  useEffect(() => {
    onStartOverRef.current = onStartOver;
  }, [onStartOver]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (countdown === 0) {
      onStartOverRef.current();
    }
  }, [countdown]);

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'var(--color-cream)',
        gap: 3,
        px: 4,
        textAlign: 'center',
      }}
    >
      <CheckCircleOutlineIcon sx={{ fontSize: 100, color: 'var(--color-accent-teal)' }} />

      <Typography
        sx={{ color: 'var(--color-kiosk-text)', fontWeight: 700, fontSize: '2rem' }}
      >
        {t('Order Placed!')}
      </Typography>

      {order && (
        <Box
          sx={{
            bgcolor: 'var(--color-cream-light)',
            borderRadius: 4,
            border: '2px solid var(--color-cream-hover)',
            px: 6,
            py: 4,
            mt: 1,
          }}
        >
          {order.customer_name && (
            <Typography sx={{ color: 'var(--color-kiosk-text)', fontWeight: 700, fontSize: '1.25rem', mb: 2 }}>
              {t('Order for:')} {order.customer_name}
            </Typography>
          )}
          <Typography sx={{ color: 'var(--color-kiosk-muted)', fontSize: '1rem', mb: 1 }}>
            {t('Your order number')}
          </Typography>
          <Typography
            sx={{ color: 'var(--color-accent-coral)', fontWeight: 700, fontSize: '3.5rem', lineHeight: 1 }}
          >
            #{order.id}
          </Typography>
          <Typography sx={{ color: 'var(--color-kiosk-muted)', fontSize: '1rem', mt: 2 }}>
            {t('Total')}: ${Number(order.total).toFixed(2)}
          </Typography>
          {order.payment_type && (
            <Typography sx={{ color: 'var(--color-kiosk-muted)', fontSize: '0.9rem', mt: 1.5 }}>
              {t('Paid with')}{' '}
              <Box component="span" sx={{ fontWeight: 700, color: 'var(--color-kiosk-text)' }}>
                {order.payment_type === 'credit_card'
                  ? t('Credit Card')
                  : order.payment_type === 'cash'
                    ? t('Cash')
                    : t('Dining Dollars')}
              </Box>
            </Typography>
          )}
          {order.payment_type === 'cash' && order.change_due != null && order.change_due > 0 && (
            <Typography sx={{ color: 'var(--color-accent-teal)', fontWeight: 700, fontSize: '1.1rem', mt: 1 }}>
              {t('Change')}: ${order.change_due.toFixed(2)}
            </Typography>
          )}
        </Box>
      )}

      <Typography
        sx={{ color: 'var(--color-kiosk-muted)', fontSize: '1.1rem', mt: 2, maxWidth: 400 }}
      >
        {t('Thank you! Your order is being prepared. Please wait for your number to be called.')}
      </Typography>

      <Button
        variant="contained"
        onClick={onStartOver}
        sx={{
          bgcolor: 'var(--color-accent-coral)',
          color: 'var(--color-text-white)',
          fontWeight: 700,
          textTransform: 'none',
          fontSize: '1.15rem',
          px: 6,
          py: 1.5,
          borderRadius: 4,
          mt: 3,
          border: '2px solid var(--color-accent-coral-hover)',
          boxShadow: '0 4px 14px rgba(255,107,107,0.4)',
          '&:hover': { bgcolor: 'var(--color-accent-coral-hover)', boxShadow: '0 6px 20px rgba(255,107,107,0.5)' },
        }}
      >
        {t('Start New Order')}
      </Button>

      <Typography sx={{ color: 'var(--color-kiosk-light-gray)', fontSize: '0.85rem', mt: 2 }}>
        {t('Returning to start in')} {countdown} {t(countdown !== 1 ? 'seconds' : 'second')}...
      </Typography>
    </Box>
  );
}
