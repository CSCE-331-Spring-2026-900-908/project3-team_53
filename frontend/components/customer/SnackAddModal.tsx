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
        sx: { bgcolor: '#FFF8EE', borderRadius: 4 },
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
        <Typography sx={{ fontWeight: 700, fontSize: '1.3rem', color: '#2D3436' }}>
          Add to Order
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ borderColor: '#f0e6d3' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <Box
            sx={{
              width: 72,
              height: 72,
              borderRadius: 3,
              bgcolor: '#FAF3E0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <FastfoodIcon sx={{ fontSize: 36, color: '#FF6B6B' }} />
          </Box>
          <Box>
            <Typography sx={{ fontWeight: 700, fontSize: '1.15rem', color: '#2D3436' }}>
              {item.name}
            </Typography>
            <Typography sx={{ color: '#FF6B6B', fontWeight: 700 }}>
              ${Number(item.price).toFixed(2)}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 3 }}>
          <IconButton
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            sx={{
              bgcolor: '#FAF3E0',
              border: '1px solid #e0d5c0',
              '&:hover': { bgcolor: '#f0e6d3' },
            }}
          >
            <RemoveIcon />
          </IconButton>
          <Typography sx={{ fontWeight: 700, fontSize: '1.5rem', color: '#2D3436', minWidth: 40, textAlign: 'center' }}>
            {quantity}
          </Typography>
          <IconButton
            onClick={() => setQuantity((q) => q + 1)}
            sx={{
              bgcolor: '#FAF3E0',
              border: '1px solid #e0d5c0',
              '&:hover': { bgcolor: '#f0e6d3' },
            }}
          >
            <AddIcon />
          </IconButton>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button
          onClick={onClose}
          sx={{ color: '#636E72', textTransform: 'none', fontSize: '1rem' }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleAdd}
          sx={{
            bgcolor: '#FF6B6B',
            color: '#fff',
            fontWeight: 700,
            textTransform: 'none',
            fontSize: '1rem',
            px: 4,
            borderRadius: 3,
            boxShadow: '0 3px 10px rgba(255,107,107,0.3)',
            '&:hover': { bgcolor: '#ee5a5a' },
          }}
        >
          Add {quantity} to Order &middot; ${(Number(item.price) * quantity).toFixed(2)}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
