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
import { publicAssetUrl } from '@/utils/publicAssetUrl';

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
  const headerImageSrc = publicAssetUrl(item.image);
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
        sx: { bgcolor: 'var(--color-cream-light)', borderRadius: 4, maxHeight: '90vh' },
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
          {t('Customize Your Drink')}
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ borderColor: 'var(--color-cream-hover)' }}>
        {/* Item header — large hero image so the drink is easy to recognize */}
        <Box sx={{ mb: 3 }}>
          <Box
            sx={{
              mx: 'auto',
              width: '100%',
              maxWidth: { xs: 260, sm: 300 },
              aspectRatio: '1',
              borderRadius: 3,
              overflow: 'hidden',
              bgcolor: 'var(--color-cream)',
              border: '1px solid var(--color-cream-border-dark)',
              boxShadow: '0 6px 20px rgba(45, 52, 54, 0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {headerImageSrc ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={headerImageSrc}
                alt={item.name}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                }}
              />
            ) : (
              <LocalCafeIcon sx={{ fontSize: { xs: 96, sm: 112 }, color: 'var(--color-accent-teal)' }} />
            )}
          </Box>
          <Box sx={{ textAlign: 'center', mt: 2.5 }}>
            <Typography
              component="h2"
              sx={{ fontWeight: 700, fontSize: '1.35rem', color: 'var(--color-kiosk-text)', lineHeight: 1.3 }}
            >
              {t(item.name)}
            </Typography>
            <Typography sx={{ color: 'var(--color-accent-coral)', fontWeight: 700, fontSize: '1.2rem', mt: 0.5 }}>
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
                bgcolor: size === s ? 'var(--color-accent-teal)' : 'var(--color-cream)',
                color: size === s ? 'var(--color-text-white)' : 'var(--color-kiosk-muted)',
                fontWeight: size === s ? 700 : 400,
                border: size === s ? 'none' : '1px solid var(--color-cream-border)',
                '&:hover': { bgcolor: size === s ? 'var(--color-accent-teal-hover)' : 'var(--color-cream-hover)' },
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
                bgcolor: sugarLevel === s ? 'var(--color-accent-teal)' : 'var(--color-cream)',
                color: sugarLevel === s ? 'var(--color-text-white)' : 'var(--color-kiosk-muted)',
                fontWeight: sugarLevel === s ? 700 : 400,
                border: sugarLevel === s ? 'none' : '1px solid var(--color-cream-border)',
                '&:hover': { bgcolor: sugarLevel === s ? 'var(--color-accent-teal-hover)' : 'var(--color-cream-hover)' },
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
                bgcolor: iceLevel === i ? 'var(--color-accent-teal)' : 'var(--color-cream)',
                color: iceLevel === i ? 'var(--color-text-white)' : 'var(--color-kiosk-muted)',
                fontWeight: iceLevel === i ? 700 : 400,
                border: iceLevel === i ? 'none' : '1px solid var(--color-cream-border)',
                '&:hover': { bgcolor: iceLevel === i ? 'var(--color-accent-teal-hover)' : 'var(--color-cream-hover)' },
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
                  bgcolor: selectedToppings.includes(topping.name) ? 'var(--color-accent-coral)' : 'var(--color-cream)',
                  color: selectedToppings.includes(topping.name) ? 'var(--color-text-white)' : 'var(--color-kiosk-muted)',
                  fontWeight: selectedToppings.includes(topping.name) ? 700 : 400,
                  border: selectedToppings.includes(topping.name) ? 'none' : '1px solid var(--color-cream-border)',
                  '&:hover': {
                    bgcolor: selectedToppings.includes(topping.name) ? 'var(--color-accent-coral-hover)' : 'var(--color-cream-hover)',
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
        sx={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--color-kiosk-text)', mb: 1 }}
      >
        {title}
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>{children}</Box>
    </Box>
  );
}
