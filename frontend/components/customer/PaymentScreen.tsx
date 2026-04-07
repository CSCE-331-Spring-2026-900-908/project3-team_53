'use client';

import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import SchoolIcon from '@mui/icons-material/School';
import { PaymentType } from '@/types/customer';

interface PaymentScreenProps {
  grandTotal: number;
  onPlaceOrder: (paymentType: PaymentType, changeDue: number) => void;
  onBack: () => void;
}

type PaymentStep = 'select' | 'processing' | 'cash';

const DENOMINATIONS = [1, 5, 10, 20] as const;

export default function PaymentScreen({
  grandTotal,
  onPlaceOrder,
  onBack,
}: PaymentScreenProps) {
  const [paymentStep, setPaymentStep] = useState<PaymentStep>('select');
  const [cashTendered, setCashTendered] = useState(0);

  const changeDue = cashTendered - grandTotal;
  const cashSufficient = cashTendered >= grandTotal;

  const handleCardOrDiningDollars = (type: 'credit_card' | 'dining_dollars') => {
    setPaymentStep('processing');
    setTimeout(() => {
      onPlaceOrder(type, 0);
    }, 1500);
  };

  const handleCashConfirm = () => {
    if (!cashSufficient) return;
    setPaymentStep('processing');
    setTimeout(() => {
      onPlaceOrder('cash', Math.round(changeDue * 100) / 100);
    }, 800);
  };

  if (paymentStep === 'processing') {
    return (
      <Box
        sx={{
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: '#FAF3E0',
          gap: 3,
        }}
      >
        <CircularProgress size={64} sx={{ color: '#4ECDC4' }} />
        <Typography sx={{ color: '#2D3436', fontWeight: 700, fontSize: '1.5rem' }}>
          Processing Payment...
        </Typography>
      </Box>
    );
  }

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
          onClick={paymentStep === 'cash' ? () => setPaymentStep('select') : onBack}
          sx={{ color: '#FAF3E0', textTransform: 'none', fontSize: '1rem' }}
        >
          {paymentStep === 'cash' ? 'Back to Payment Methods' : 'Back to Order Summary'}
        </Button>
      </Box>

      {/* Content */}
      <Box
        sx={{
          flex: 1,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          py: 4,
          px: 2,
        }}
      >
        {/* Total display */}
        <Box
          sx={{
            bgcolor: '#2D3436',
            borderRadius: 4,
            px: 6,
            py: 3,
            mb: 4,
            textAlign: 'center',
          }}
        >
          <Typography sx={{ color: '#B2BEC3', fontSize: '1rem', mb: 0.5 }}>
            Amount Due
          </Typography>
          <Typography sx={{ color: '#FFFFFF', fontWeight: 700, fontSize: '3rem', lineHeight: 1 }}>
            ${grandTotal.toFixed(2)}
          </Typography>
        </Box>

        {paymentStep === 'select' && (
          <Box sx={{ width: '100%', maxWidth: 500 }}>
            <Typography
              sx={{ color: '#2D3436', fontWeight: 700, fontSize: '1.5rem', mb: 3, textAlign: 'center' }}
            >
              Select Payment Method
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Button
                variant="contained"
                startIcon={<CreditCardIcon sx={{ fontSize: 28 }} />}
                onClick={() => handleCardOrDiningDollars('credit_card')}
                sx={{
                  bgcolor: '#4ECDC4',
                  color: '#fff',
                  fontSize: '1.25rem',
                  fontWeight: 700,
                  py: 3,
                  borderRadius: 4,
                  textTransform: 'none',
                  boxShadow: '0 4px 14px rgba(78,205,196,0.4)',
                  '&:hover': { bgcolor: '#3dbdb5', boxShadow: '0 6px 20px rgba(78,205,196,0.5)' },
                }}
              >
                Credit / Debit Card
              </Button>

              <Button
                variant="contained"
                startIcon={<AttachMoneyIcon sx={{ fontSize: 28 }} />}
                onClick={() => setPaymentStep('cash')}
                sx={{
                  bgcolor: '#FF6B6B',
                  color: '#fff',
                  fontSize: '1.25rem',
                  fontWeight: 700,
                  py: 3,
                  borderRadius: 4,
                  textTransform: 'none',
                  boxShadow: '0 4px 14px rgba(255,107,107,0.4)',
                  '&:hover': { bgcolor: '#ee5a5a', boxShadow: '0 6px 20px rgba(255,107,107,0.5)' },
                }}
              >
                Cash
              </Button>

              <Button
                variant="contained"
                startIcon={<SchoolIcon sx={{ fontSize: 28 }} />}
                onClick={() => handleCardOrDiningDollars('dining_dollars')}
                sx={{
                  bgcolor: '#6C5CE7',
                  color: '#fff',
                  fontSize: '1.25rem',
                  fontWeight: 700,
                  py: 3,
                  borderRadius: 4,
                  textTransform: 'none',
                  boxShadow: '0 4px 14px rgba(108,92,231,0.4)',
                  '&:hover': { bgcolor: '#5a4bd6', boxShadow: '0 6px 20px rgba(108,92,231,0.5)' },
                }}
              >
                Dining Dollars
              </Button>
            </Box>
          </Box>
        )}

        {paymentStep === 'cash' && (
          <Box sx={{ width: '100%', maxWidth: 500 }}>
            <Typography
              sx={{ color: '#2D3436', fontWeight: 700, fontSize: '1.5rem', mb: 3, textAlign: 'center' }}
            >
              Cash Payment
            </Typography>

            {/* Cash tendered display */}
            <Box
              sx={{
                bgcolor: '#FFF8EE',
                border: '2px solid #f0e6d3',
                borderRadius: 4,
                px: 4,
                py: 3,
                mb: 3,
                textAlign: 'center',
              }}
            >
              <Typography sx={{ color: '#636E72', fontSize: '0.9rem', mb: 0.5 }}>
                Cash Tendered
              </Typography>
              <Typography sx={{ color: '#2D3436', fontWeight: 700, fontSize: '2.5rem', lineHeight: 1 }}>
                ${cashTendered.toFixed(2)}
              </Typography>
            </Box>

            {/* Denomination buttons */}
            <Box sx={{ display: 'flex', gap: 2, mb: 2, justifyContent: 'center' }}>
              {DENOMINATIONS.map((d) => (
                <Button
                  key={d}
                  variant="contained"
                  onClick={() => setCashTendered((prev) => prev + d)}
                  sx={{
                    bgcolor: '#2D3436',
                    color: '#fff',
                    fontWeight: 700,
                    fontSize: '1.1rem',
                    py: 2,
                    px: 3,
                    borderRadius: 3,
                    minWidth: 80,
                    textTransform: 'none',
                    '&:hover': { bgcolor: '#3d4a4c' },
                  }}
                >
                  +${d}
                </Button>
              ))}
            </Box>

            {/* Exact + Clear row */}
            <Box sx={{ display: 'flex', gap: 2, mb: 3, justifyContent: 'center' }}>
              <Button
                variant="outlined"
                onClick={() => setCashTendered(Math.ceil(grandTotal * 100) / 100)}
                sx={{
                  borderColor: '#4ECDC4',
                  color: '#4ECDC4',
                  fontWeight: 700,
                  fontSize: '1rem',
                  py: 1.5,
                  px: 4,
                  borderRadius: 3,
                  textTransform: 'none',
                  '&:hover': { borderColor: '#3dbdb5', bgcolor: 'rgba(78,205,196,0.08)' },
                }}
              >
                Exact Amount
              </Button>
              <Button
                variant="outlined"
                onClick={() => setCashTendered(0)}
                sx={{
                  borderColor: '#FF6B6B',
                  color: '#FF6B6B',
                  fontWeight: 700,
                  fontSize: '1rem',
                  py: 1.5,
                  px: 4,
                  borderRadius: 3,
                  textTransform: 'none',
                  '&:hover': { borderColor: '#ee5a5a', bgcolor: 'rgba(255,107,107,0.08)' },
                }}
              >
                Clear
              </Button>
            </Box>

            {/* Change / insufficient funds feedback */}
            {cashTendered > 0 && (
              <Box
                sx={{
                  bgcolor: cashSufficient ? 'rgba(78,205,196,0.12)' : 'rgba(255,107,107,0.12)',
                  border: `2px solid ${cashSufficient ? '#4ECDC4' : '#FF6B6B'}`,
                  borderRadius: 3,
                  px: 4,
                  py: 2,
                  mb: 3,
                  textAlign: 'center',
                }}
              >
                {cashSufficient ? (
                  <>
                    <Typography sx={{ color: '#636E72', fontSize: '0.9rem' }}>
                      Change Due
                    </Typography>
                    <Typography sx={{ color: '#4ECDC4', fontWeight: 700, fontSize: '2rem' }}>
                      ${changeDue.toFixed(2)}
                    </Typography>
                  </>
                ) : (
                  <Typography sx={{ color: '#FF6B6B', fontWeight: 700, fontSize: '1.1rem' }}>
                    Insufficient funds. Please add ${(grandTotal - cashTendered).toFixed(2)} more.
                  </Typography>
                )}
              </Box>
            )}

            {/* Confirm cash payment */}
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Button
                variant="contained"
                disabled={!cashSufficient}
                onClick={handleCashConfirm}
                sx={{
                  bgcolor: cashSufficient ? '#4ECDC4' : '#ccc',
                  color: '#fff',
                  fontWeight: 700,
                  textTransform: 'none',
                  fontSize: '1.25rem',
                  px: 8,
                  py: 2,
                  borderRadius: 4,
                  minWidth: 300,
                  boxShadow: cashSufficient ? '0 4px 14px rgba(78,205,196,0.4)' : 'none',
                  '&:hover': cashSufficient
                    ? { bgcolor: '#3dbdb5', boxShadow: '0 6px 20px rgba(78,205,196,0.5)' }
                    : {},
                  '&.Mui-disabled': { bgcolor: '#ccc', color: '#fff' },
                }}
              >
                Confirm Cash Payment
              </Button>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
}
