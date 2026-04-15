'use client';

import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { MenuItem } from '@/types/customer';
import { useTranslation } from '@/contexts/TranslationContext';

interface SnackAddModalProps {
  item: MenuItem;
  open: boolean;
  onClose: () => void;
  onAdd: (quantity: number) => void;
}

export default function SnackAddModal({
  item,
  open,
  onClose,
  onAdd,
}: SnackAddModalProps) {
  const { t } = useTranslation();
  const [quantity, setQuantity] = useState(1);

  const handleAdd = () => {
    onAdd(quantity);
    setQuantity(1);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: { bgcolor: 'var(--color-cream-light)', borderRadius: 4 },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          pb: 1,
        }}
      >
        <Typography sx={{ fontWeight: 700, fontSize: '1.3rem', color: 'var(--color-kiosk-text)' }}>
          {t('Add to Order')}
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ borderColor: 'var(--color-cream-hover)' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <Box
            sx={{
              width: 72,
              height: 72,
              borderRadius: 3,
              bgcolor: 'var(--color-cream)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <FastfoodIcon sx={{ fontSize: 36, color: 'var(--color-accent-coral)' }} />
          </Box>
          <Box>
            <Typography sx={{ fontWeight: 700, fontSize: '1.15rem', color: 'var(--color-kiosk-text)' }}>
              {t(item.name)}
            </Typography>
            <Typography sx={{ color: 'var(--color-accent-coral)', fontWeight: 700 }}>
              ${Number(item.price).toFixed(2)}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 3 }}>
          <IconButton
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            sx={{
              bgcolor: 'var(--color-cream)',
              border: '1px solid var(--color-cream-border)',
              '&:hover': { bgcolor: 'var(--color-cream-hover)' },
            }}
          >
            <RemoveIcon />
          </IconButton>
          <Typography sx={{ fontWeight: 700, fontSize: '1.5rem', color: 'var(--color-kiosk-text)', minWidth: 40, textAlign: 'center' }}>
            {quantity}
          </Typography>
          <IconButton
            onClick={() => setQuantity((q) => q + 1)}
            sx={{
              bgcolor: 'var(--color-cream)',
              border: '1px solid var(--color-cream-border)',
              '&:hover': { bgcolor: 'var(--color-cream-hover)' },
            }}
          >
            <AddIcon />
          </IconButton>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button
          onClick={onClose}
          sx={{ color: 'var(--color-kiosk-muted)', textTransform: 'none', fontSize: '1rem' }}
        >
          {t('Cancel')}
        </Button>
        <Button
          variant="contained"
          onClick={handleAdd}
          sx={{
            bgcolor: 'var(--color-accent-coral)',
            color: 'var(--color-text-white)',
            fontWeight: 700,
            textTransform: 'none',
            fontSize: '1rem',
            px: 4,
            borderRadius: 3,
            boxShadow: '0 3px 10px rgba(255,107,107,0.3)',
            '&:hover': { bgcolor: 'var(--color-accent-coral-hover)' },
          }}
        >
          {t('Add')} {quantity} {t('to Order')} &middot; ${(Number(item.price) * quantity).toFixed(2)}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
