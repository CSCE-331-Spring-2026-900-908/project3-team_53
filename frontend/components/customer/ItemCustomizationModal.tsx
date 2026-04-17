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
      maxWidth="md"
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

      <DialogContent sx={{ overflow: 'hidden', p: 3 }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '220px 1fr' },
            columnGap: 3,
            rowGap: 2,
            alignItems: 'start',
          }}
        >
          {/* Left column: compact hero + name + price */}
          <Box sx={{ textAlign: 'center' }}>
            <Box
              sx={{
                mx: 'auto',
                width: 200,
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
                <LocalCafeIcon sx={{ fontSize: 96, color: 'var(--color-accent-teal)' }} />
              )}
            </Box>
            <Typography
              component="h2"
              sx={{
                fontWeight: 700,
                fontSize: '1.15rem',
                color: 'var(--color-kiosk-text)',
                lineHeight: 1.3,
                mt: 1.5,
              }}
            >
              {t(item.name)}
            </Typography>
            <Typography
              sx={{
                color: 'var(--color-accent-coral)',
                fontWeight: 700,
                fontSize: '1.05rem',
                mt: 0.25,
              }}
            >
              ${Number(item.price).toFixed(2)}
            </Typography>
          </Box>

          {/* Right column: options */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <OptionSection title={t('Size')}>
              {SIZES.map((s) => (
                <Chip
                  key={s}
                  size="small"
                  label={t(s)}
                  onClick={() => setSize(s)}
                  sx={{
                    bgcolor: size === s ? 'var(--color-accent-teal)' : 'var(--color-cream-light)',
                    color: size === s ? 'var(--color-text-white)' : 'var(--color-kiosk-text)',
                    fontWeight: size === s ? 700 : 500,
                    border: size === s ? '2px solid transparent' : '2px solid rgba(45, 52, 54, 0.38)',
                    boxShadow: size === s ? '0 2px 8px rgba(78, 205, 196, 0.35)' : 'none',
                    '&:hover': { bgcolor: size === s ? 'var(--color-accent-teal-hover)' : 'var(--color-cream-hover)' },
                  }}
                />
              ))}
            </OptionSection>

            <OptionSection title={t('Sugar Level')}>
              {SUGAR_LEVELS.map((s) => (
                <Chip
                  key={s}
                  size="small"
                  label={t(s)}
                  onClick={() => setSugarLevel(s)}
                  sx={{
                    bgcolor: sugarLevel === s ? 'var(--color-accent-teal)' : 'var(--color-cream-light)',
                    color: sugarLevel === s ? 'var(--color-text-white)' : 'var(--color-kiosk-text)',
                    fontWeight: sugarLevel === s ? 700 : 500,
                    border: sugarLevel === s ? '2px solid transparent' : '2px solid rgba(45, 52, 54, 0.38)',
                    boxShadow: sugarLevel === s ? '0 2px 8px rgba(78, 205, 196, 0.35)' : 'none',
                    '&:hover': { bgcolor: sugarLevel === s ? 'var(--color-accent-teal-hover)' : 'var(--color-cream-hover)' },
                  }}
                />
              ))}
            </OptionSection>

            <OptionSection title={t('Ice Level')}>
              {ICE_LEVELS.map((i) => (
                <Chip
                  key={i}
                  size="small"
                  label={t(i)}
                  onClick={() => setIceLevel(i)}
                  sx={{
                    bgcolor: iceLevel === i ? 'var(--color-accent-teal)' : 'var(--color-cream-light)',
                    color: iceLevel === i ? 'var(--color-text-white)' : 'var(--color-kiosk-text)',
                    fontWeight: iceLevel === i ? 700 : 500,
                    border: iceLevel === i ? '2px solid transparent' : '2px solid rgba(45, 52, 54, 0.38)',
                    boxShadow: iceLevel === i ? '0 2px 8px rgba(78, 205, 196, 0.35)' : 'none',
                    '&:hover': { bgcolor: iceLevel === i ? 'var(--color-accent-teal-hover)' : 'var(--color-cream-hover)' },
                  }}
                />
              ))}
            </OptionSection>

            {availableToppings.length > 0 && (
              <OptionSection title={t('Toppings')} chipsMaxHeight={120}>
                {availableToppings.map((topping) => (
                  <Chip
                    key={topping.id}
                    size="small"
                    label={`${t(topping.name)} +$${Number(topping.price).toFixed(2)}`}
                    onClick={() => toggleTopping(topping.name)}
                    sx={{
                      bgcolor: selectedToppings.includes(topping.name) ? 'var(--color-accent-coral)' : 'var(--color-cream-light)',
                      color: selectedToppings.includes(topping.name) ? 'var(--color-text-white)' : 'var(--color-kiosk-text)',
                      fontWeight: selectedToppings.includes(topping.name) ? 700 : 500,
                      border: selectedToppings.includes(topping.name) ? '2px solid transparent' : '2px solid rgba(45, 52, 54, 0.38)',
                      boxShadow: selectedToppings.includes(topping.name) ? '0 2px 8px rgba(255, 107, 107, 0.35)' : 'none',
                      '&:hover': {
                        bgcolor: selectedToppings.includes(topping.name) ? 'var(--color-accent-coral-hover)' : 'var(--color-cream-hover)',
                      },
                    }}
                  />
                ))}
              </OptionSection>
            )}
          </Box>
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
            border: '2px solid var(--color-accent-coral-hover)',
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
  chipsMaxHeight,
}: {
  title: string;
  children: React.ReactNode;
  chipsMaxHeight?: number;
}) {
  return (
    <Box>
      <Typography
        sx={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--color-kiosk-text)', mb: 0.5 }}
      >
        {title}
      </Typography>
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 0.75,
          ...(chipsMaxHeight
            ? { maxHeight: chipsMaxHeight, overflowY: 'auto', pr: 0.5 }
            : {}),
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
