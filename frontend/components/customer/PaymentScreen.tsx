'use client';

import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import SchoolIcon from '@mui/icons-material/School';
import PersonIcon from '@mui/icons-material/Person';
import { PaymentType } from '@/types/customer';

interface PaymentScreenProps {
  grandTotal: number;
  onPlaceOrder: (paymentType: PaymentType, changeDue: number, customerName: string, customerPhone: string) => void;
  onBack: () => void;
}

type PaymentStep = 'info' | 'select' | 'processing' | 'cash';

export default function PaymentScreen({
  grandTotal,
  onPlaceOrder,
  onBack,
}: PaymentScreenProps) {
  const [paymentStep, setPaymentStep] = useState<PaymentStep>('info');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [cashInput, setCashInput] = useState('');
  const cashTendered = parseFloat(cashInput) || 0;

  const changeDue = cashTendered - grandTotal;
  const cashSufficient = cashTendered >= grandTotal;

  const strippedPhone = customerPhone.replace(/\D/g, '');

  const handleCardOrDiningDollars = (type: 'credit_card' | 'dining_dollars') => {
    setPaymentStep('processing');
    setTimeout(() => {
      onPlaceOrder(type, 0, customerName, strippedPhone);
    }, 1500);
  };

  const handleCashConfirm = () => {
    if (!cashSufficient) return;
    setPaymentStep('processing');
    setTimeout(() => {
      onPlaceOrder('cash', Math.round(changeDue * 100) / 100, customerName, strippedPhone);
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
          onClick={
            paymentStep === 'cash'
              ? () => setPaymentStep('select')
              : paymentStep === 'select'
                ? () => setPaymentStep('info')
                : onBack
          }
          sx={{ color: '#FAF3E0', textTransform: 'none', fontSize: '1rem' }}
        >
          {paymentStep === 'cash'
            ? 'Back to Payment Methods'
            : paymentStep === 'select'
              ? 'Back to Customer Info'
              : 'Back to Order Summary'}
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

        {paymentStep === 'info' && (
          <Box sx={{ width: '100%', maxWidth: 500 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 3 }}>
              <PersonIcon sx={{ color: '#2D3436', fontSize: 28 }} />
              <Typography
                sx={{ color: '#2D3436', fontWeight: 700, fontSize: '1.5rem', textAlign: 'center' }}
              >
                Customer Information
              </Typography>
            </Box>

            <Typography sx={{ color: '#636E72', textAlign: 'center', mb: 3, fontSize: '0.95rem' }}>
              Optional -- leave blank to skip
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mb: 4 }}>
              <TextField
                label="Name"
                placeholder="e.g. John"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                fullWidth
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    bgcolor: '#FFF8EE',
                    borderRadius: 3,
                    fontSize: '1.1rem',
                    '& fieldset': { borderColor: '#e0d5c0' },
                    '&:hover fieldset': { borderColor: '#4ECDC4' },
                    '&.Mui-focused fieldset': { borderColor: '#4ECDC4' },
                  },
                  '& .MuiInputLabel-root.Mui-focused': { color: '#4ECDC4' },
                }}
              />
              <TextField
                label="Phone Number"
                placeholder="e.g. 979-555-1234"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                fullWidth
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    bgcolor: '#FFF8EE',
                    borderRadius: 3,
                    fontSize: '1.1rem',
                    '& fieldset': { borderColor: '#e0d5c0' },
                    '&:hover fieldset': { borderColor: '#4ECDC4' },
                    '&.Mui-focused fieldset': { borderColor: '#4ECDC4' },
                  },
                  '& .MuiInputLabel-root.Mui-focused': { color: '#4ECDC4' },
                }}
              />
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center' }}>
              <Button
                variant="contained"
                onClick={() => setPaymentStep('select')}
                sx={{
                  bgcolor: '#4ECDC4',
                  color: '#fff',
                  fontWeight: 700,
                  textTransform: 'none',
                  fontSize: '1.25rem',
                  px: 8,
                  py: 2,
                  borderRadius: 4,
                  minWidth: 300,
                  boxShadow: '0 4px 14px rgba(78,205,196,0.4)',
                  '&:hover': { bgcolor: '#3dbdb5', boxShadow: '0 6px 20px rgba(78,205,196,0.5)' },
                }}
              >
                Continue to Payment
              </Button>
              <Button
                onClick={() => {
                  setCustomerName('');
                  setCustomerPhone('');
                  setPaymentStep('select');
                }}
                sx={{ color: '#636E72', textTransform: 'none', fontSize: '1rem' }}
              >
                Skip
              </Button>
            </Box>
          </Box>
        )}

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

            <TextField
              label="Cash Tendered"
              placeholder="0.00"
              value={cashInput}
              onChange={(e) => {
                const val = e.target.value;
                if (val === '' || /^\d*\.?\d{0,2}$/.test(val)) {
                  setCashInput(val);
                }
              }}
              fullWidth
              variant="outlined"
              inputProps={{ inputMode: 'decimal' }}
              sx={{
                mb: 3,
                '& .MuiOutlinedInput-root': {
                  bgcolor: '#FFF8EE',
                  borderRadius: 3,
                  fontSize: '2rem',
                  fontWeight: 700,
                  '& fieldset': { borderColor: '#e0d5c0', borderWidth: 2 },
                  '&:hover fieldset': { borderColor: '#4ECDC4' },
                  '&.Mui-focused fieldset': { borderColor: '#4ECDC4' },
                },
                '& .MuiInputLabel-root.Mui-focused': { color: '#4ECDC4' },
              }}
            />

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
