'use client';

import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import LocalCafeIcon from '@mui/icons-material/LocalCafe';
import {
  MenuItem,
  ToppingItem,
  SIZES,
  SUGAR_LEVELS,
  ICE_LEVELS,
  Size,
  SugarLevel,
  IceLevel,
} from '@/types/customer';
import { useTranslation } from '@/contexts/TranslationContext';

interface ItemCustomizationModalProps {
  item: MenuItem;
  toppings: ToppingItem[];
  open: boolean;
  onClose: () => void;
  onAdd: (
    size: Size,
    sugarLevel: SugarLevel,
    iceLevel: IceLevel,
    toppings: string[],
  ) => void;
}

export default function ItemCustomizationModal({
  item,
  toppings: availableToppings,
  open,
  onClose,
  onAdd,
}: ItemCustomizationModalProps) {
  const { t } = useTranslation();
  const [size, setSize] = useState<Size>('Regular');
  const [sugarLevel, setSugarLevel] = useState<SugarLevel>('100%');
  const [iceLevel, setIceLevel] = useState<IceLevel>('Regular');
  const [selectedToppings, setSelectedToppings] = useState<string[]>([]);

  const toggleTopping = (name: string) => {
    setSelectedToppings((prev) =>
      prev.includes(name) ? prev.filter((x) => x !== name) : [...prev, name],
    );
  };

  const handleAdd = () => {
    onAdd(size, sugarLevel, iceLevel, selectedToppings);
    setSize('Regular');
    setSugarLevel('100%');
    setIceLevel('Regular');
    setSelectedToppings([]);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { bgcolor: '#FFF8EE', borderRadius: 4, maxHeight: '90vh' },
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
          {t('Customize Your Drink')}
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ borderColor: '#f0e6d3' }}>
        {/* Item header */}
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
            <LocalCafeIcon sx={{ fontSize: 36, color: '#4ECDC4' }} />
          </Box>
          <Box>
            <Typography sx={{ fontWeight: 700, fontSize: '1.15rem', color: '#2D3436' }}>
              {t(item.name)}
            </Typography>
            <Typography sx={{ color: '#FF6B6B', fontWeight: 700 }}>
              ${Number(item.price).toFixed(2)}
            </Typography>
          </Box>
        </Box>

        {/* Size */}
        <OptionSection title={t('Size')}>
          {SIZES.map((s) => (
            <Chip
              key={s}
              label={t(s)}
              onClick={() => setSize(s)}
              sx={{
                bgcolor: size === s ? '#4ECDC4' : '#FAF3E0',
                color: size === s ? '#fff' : '#636E72',
                fontWeight: size === s ? 700 : 400,
                border: size === s ? 'none' : '1px solid #e0d5c0',
                '&:hover': { bgcolor: size === s ? '#3dbdb5' : '#f0e6d3' },
              }}
            />
          ))}
        </OptionSection>

        {/* Sugar level */}
        <OptionSection title={t('Sugar Level')}>
          {SUGAR_LEVELS.map((s) => (
            <Chip
              key={s}
              label={t(s)}
              onClick={() => setSugarLevel(s)}
              sx={{
                bgcolor: sugarLevel === s ? '#4ECDC4' : '#FAF3E0',
                color: sugarLevel === s ? '#fff' : '#636E72',
                fontWeight: sugarLevel === s ? 700 : 400,
                border: sugarLevel === s ? 'none' : '1px solid #e0d5c0',
                '&:hover': { bgcolor: sugarLevel === s ? '#3dbdb5' : '#f0e6d3' },
              }}
            />
          ))}
        </OptionSection>

        {/* Ice level */}
        <OptionSection title={t('Ice Level')}>
          {ICE_LEVELS.map((i) => (
            <Chip
              key={i}
              label={t(i)}
              onClick={() => setIceLevel(i)}
              sx={{
                bgcolor: iceLevel === i ? '#4ECDC4' : '#FAF3E0',
                color: iceLevel === i ? '#fff' : '#636E72',
                fontWeight: iceLevel === i ? 700 : 400,
                border: iceLevel === i ? 'none' : '1px solid #e0d5c0',
                '&:hover': { bgcolor: iceLevel === i ? '#3dbdb5' : '#f0e6d3' },
              }}
            />
          ))}
        </OptionSection>

        {/* Toppings */}
        {availableToppings.length > 0 && (
          <OptionSection title={t('Toppings')}>
            {availableToppings.map((topping) => (
              <Chip
                key={topping.id}
                label={`${t(topping.name)} +$${Number(topping.price).toFixed(2)}`}
                onClick={() => toggleTopping(topping.name)}
                sx={{
                  bgcolor: selectedToppings.includes(topping.name) ? '#FF6B6B' : '#FAF3E0',
                  color: selectedToppings.includes(topping.name) ? '#fff' : '#636E72',
                  fontWeight: selectedToppings.includes(topping.name) ? 700 : 400,
                  border: selectedToppings.includes(topping.name) ? 'none' : '1px solid #e0d5c0',
                  '&:hover': {
                    bgcolor: selectedToppings.includes(topping.name) ? '#ee5a5a' : '#f0e6d3',
                  },
                }}
              />
            ))}
          </OptionSection>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button
          onClick={onClose}
          sx={{ color: '#636E72', textTransform: 'none', fontSize: '1rem' }}
        >
          {t('Cancel')}
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
          {t('Add to Order')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function OptionSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Box sx={{ mb: 3 }}>
      <Typography
        sx={{ fontWeight: 600, fontSize: '0.95rem', color: '#2D3436', mb: 1 }}
      >
        {title}
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>{children}</Box>
    </Box>
  );
}
