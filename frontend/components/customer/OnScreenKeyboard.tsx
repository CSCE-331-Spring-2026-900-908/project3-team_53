'use client';

import React, { useMemo, useState } from 'react';
import Drawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import BackspaceOutlinedIcon from '@mui/icons-material/BackspaceOutlined';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import SpaceBarIcon from '@mui/icons-material/SpaceBar';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';

export type KeyboardMode = 'text' | 'numeric' | 'decimal' | 'phone';
export type AccentColor = 'teal' | 'coral' | 'purple';

export interface OnScreenKeyboardProps {
  open: boolean;
  value: string;
  onChange: (next: string) => void;
  onClose: () => void;
  onSubmit?: () => void;
  mode?: KeyboardMode;
  accent?: AccentColor;
  label?: string;
  submitLabel?: string;
  maxLength?: number;
}

const TEXT_ROWS_LOWER: string[][] = [
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
  ['z', 'x', 'c', 'v', 'b', 'n', 'm'],
];

const TEXT_ROWS_UPPER: string[][] = TEXT_ROWS_LOWER.map((row) =>
  row.map((k) => k.toUpperCase()),
);

const NUMERIC_ROWS: string[][] = [
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9'],
];

type AccentTokens = {
  base: string;
  hover: string;
  soft: string;
};

const ACCENT_MAP: Record<AccentColor, AccentTokens> = {
  teal: {
    base: 'var(--color-accent-teal)',
    hover: 'var(--color-accent-teal-hover)',
    soft: 'rgba(78, 205, 196, 0.18)',
  },
  coral: {
    base: 'var(--color-accent-coral)',
    hover: 'var(--color-accent-coral-hover)',
    soft: 'rgba(255, 107, 107, 0.18)',
  },
  purple: {
    base: 'var(--color-accent-purple)',
    hover: 'var(--color-accent-purple-hover)',
    soft: 'rgba(108, 92, 231, 0.18)',
  },
};

export default function OnScreenKeyboard({
  open,
  value,
  onChange,
  onClose,
  onSubmit,
  mode = 'text',
  accent = 'teal',
  label,
  submitLabel = 'Done',
  maxLength,
}: OnScreenKeyboardProps) {
  const [shift, setShift] = useState(false);
  const tokens = ACCENT_MAP[accent];

  const isNumericMode = mode === 'numeric' || mode === 'decimal' || mode === 'phone';
  const allowsDecimal = mode === 'decimal';

  const commit = (next: string) => {
    if (maxLength !== undefined && next.length > maxLength) return;
    // Decimal mode: enforce the same validation used by PaymentScreen's cash input.
    if (allowsDecimal) {
      if (next !== '' && !/^\d*\.?\d{0,2}$/.test(next)) return;
    }
    onChange(next);
  };

  const handleChar = (char: string) => {
    commit(value + char);
  };

  const handleBackspace = () => {
    commit(value.slice(0, -1));
  };

  const handleSpace = () => {
    commit(value + ' ');
  };

  const handleSubmit = () => {
    onSubmit?.();
    onClose();
  };

  const rows = useMemo(() => (shift ? TEXT_ROWS_UPPER : TEXT_ROWS_LOWER), [shift]);

  const keyBaseSx = {
    flex: 1,
    minHeight: 56,
    bgcolor: 'var(--color-cream-light)',
    color: 'var(--color-kiosk-text)',
    border: '1px solid var(--color-cream-border)',
    borderRadius: '14px',
    fontSize: '1.25rem',
    fontWeight: 600,
    textTransform: 'none' as const,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    userSelect: 'none' as const,
    transition: 'transform 0.06s ease, background-color 0.12s ease, box-shadow 0.12s ease',
    boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
    '&:hover': {
      bgcolor: tokens.soft,
      borderColor: tokens.base,
    },
    '&:active': {
      transform: 'scale(0.97)',
      bgcolor: tokens.soft,
    },
  };

  const accentKeySx = {
    ...keyBaseSx,
    bgcolor: tokens.base,
    color: 'var(--color-text-white)',
    border: `1px solid ${tokens.hover}`,
    boxShadow: '0 2px 6px rgba(0,0,0,0.12)',
    '&:hover': {
      bgcolor: tokens.hover,
    },
    '&:active': {
      transform: 'scale(0.97)',
      bgcolor: tokens.hover,
    },
  };

  const renderCharKey = (char: string, extraSx: object = {}) => (
    <Box
      key={char}
      component="button"
      type="button"
      onClick={() => handleChar(char)}
      sx={{ ...keyBaseSx, ...extraSx }}
    >
      {char}
    </Box>
  );

  return (
    <Drawer
      anchor="bottom"
      open={open}
      onClose={onClose}
      hideBackdrop={false}
      ModalProps={{
        keepMounted: false,
      }}
      slotProps={{
        paper: {
          sx: {
            bgcolor: 'var(--color-cream)',
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            boxShadow: '0 -8px 24px rgba(0,0,0,0.18)',
            px: { xs: 1.5, sm: 2 },
            pt: 1,
            pb: 2,
          },
        },
      }}
      sx={{
        zIndex: (theme) => theme.zIndex.modal + 4,
      }}
    >
      {/* Header: label row + large live preview of typed text */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 1,
          pt: 0.5,
          pb: 0.75,
        }}
      >
        <Typography
          sx={{
            color: 'var(--color-kiosk-text)',
            fontWeight: 700,
            fontSize: '1rem',
            letterSpacing: '0.02em',
          }}
        >
          {label ?? (isNumericMode ? 'Enter value' : 'Type here')}
        </Typography>
        <IconButton
          onClick={onClose}
          size="small"
          aria-label="Close keyboard"
          sx={{ color: 'var(--color-kiosk-muted)' }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      {/* Large live preview of the typed value */}
      <Box
        sx={{
          mx: 'auto',
          mb: 1.25,
          width: '100%',
          maxWidth: isNumericMode ? 520 : 880,
          bgcolor: 'var(--color-cream-light)',
          border: `2px solid ${tokens.base}`,
          borderRadius: '16px',
          boxShadow: `0 2px 8px ${tokens.soft}`,
          px: 2,
          py: 1.25,
          minHeight: 56,
          display: 'flex',
          alignItems: 'center',
          justifyContent: isNumericMode ? 'center' : 'flex-start',
          overflow: 'hidden',
        }}
      >
        <Typography
          component="span"
          sx={{
            color: value
              ? 'var(--color-kiosk-text)'
              : 'var(--color-kiosk-muted)',
            fontWeight: 700,
            fontSize: isNumericMode ? '2rem' : '1.6rem',
            fontFamily:
              mode === 'decimal' || mode === 'numeric' || mode === 'phone'
                ? 'monospace'
                : 'inherit',
            letterSpacing: isNumericMode ? '0.04em' : '0.01em',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            direction: isNumericMode ? 'ltr' : 'ltr',
            width: '100%',
            textAlign: isNumericMode ? 'center' : 'left',
          }}
        >
          {value ? (
            <>
              {mode === 'decimal' && !value.startsWith('$') ? '$' : ''}
              {value}
            </>
          ) : (
            <Box
              component="span"
              sx={{
                opacity: 0.6,
                fontWeight: 500,
                fontSize: isNumericMode ? '1.4rem' : '1.1rem',
              }}
            >
              {mode === 'decimal'
                ? '$0.00'
                : mode === 'numeric' || mode === 'phone'
                ? '0'
                : '\u2026'}
            </Box>
          )}
          <Box
            component="span"
            sx={{
              display: 'inline-block',
              width: '2px',
              height: isNumericMode ? '1.8rem' : '1.4rem',
              bgcolor: tokens.base,
              ml: 0.5,
              verticalAlign: 'middle',
              animation: 'kbd-caret 1s steps(1) infinite',
              '@keyframes kbd-caret': {
                '50%': { opacity: 0 },
              },
            }}
          />
        </Typography>
      </Box>

      {/* Accent divider */}
      <Box
        sx={{
          height: '3px',
          width: '100%',
          bgcolor: tokens.base,
          borderRadius: '3px',
          mb: 1,
          opacity: 0.55,
        }}
      />

      {/* Keys */}
      {isNumericMode ? (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 1,
            maxWidth: 520,
            mx: 'auto',
            width: '100%',
          }}
        >
          {NUMERIC_ROWS.flat().map((n) => renderCharKey(n))}
          {/* Bottom row: decimal (or blank) / 0 / backspace */}
          {allowsDecimal ? (
            renderCharKey('.')
          ) : (
            <Box sx={{ ...keyBaseSx, visibility: 'hidden' }} aria-hidden />
          )}
          {renderCharKey('0')}
          <Box
            component="button"
            type="button"
            onClick={handleBackspace}
            sx={{
              ...keyBaseSx,
              bgcolor: 'var(--color-cream)',
              border: '1px solid var(--color-cream-border)',
            }}
            aria-label="Backspace"
          >
            <BackspaceOutlinedIcon />
          </Box>

          {/* Full-width Done key */}
          <Box
            component="button"
            type="button"
            onClick={handleSubmit}
            sx={{
              ...accentKeySx,
              gridColumn: '1 / -1',
              minHeight: 60,
              fontSize: '1.15rem',
              fontWeight: 700,
              borderRadius: '18px',
              mt: 0.5,
            }}
          >
            {submitLabel}
          </Box>
        </Box>
      ) : (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
            maxWidth: 880,
            mx: 'auto',
            width: '100%',
          }}
        >
          {/* Row 1: 10 keys */}
          <Box sx={{ display: 'flex', gap: 1 }}>
            {rows[0].map((c) => renderCharKey(c))}
          </Box>

          {/* Row 2: 9 keys, inset slightly */}
          <Box sx={{ display: 'flex', gap: 1, px: { xs: 0, sm: 3 } }}>
            {rows[1].map((c) => renderCharKey(c))}
          </Box>

          {/* Row 3: shift + 7 letters + backspace */}
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Box
              component="button"
              type="button"
              onClick={() => setShift((s) => !s)}
              aria-label="Shift"
              sx={{
                ...keyBaseSx,
                flex: 1.6,
                bgcolor: shift ? tokens.soft : 'var(--color-cream)',
                borderColor: shift ? tokens.base : 'var(--color-cream-border)',
                color: shift ? tokens.base : 'var(--color-kiosk-text)',
              }}
            >
              <KeyboardArrowUpIcon />
            </Box>
            {rows[2].map((c) => renderCharKey(c))}
            <Box
              component="button"
              type="button"
              onClick={handleBackspace}
              aria-label="Backspace"
              sx={{
                ...keyBaseSx,
                flex: 1.6,
                bgcolor: 'var(--color-cream)',
              }}
            >
              <BackspaceOutlinedIcon />
            </Box>
          </Box>

          {/* Row 4: space + done */}
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Box
              component="button"
              type="button"
              onClick={handleSpace}
              aria-label="Space"
              sx={{
                ...keyBaseSx,
                flex: 6,
                fontSize: '1rem',
                fontWeight: 500,
                color: 'var(--color-kiosk-muted)',
              }}
            >
              <SpaceBarIcon />
            </Box>
            <Box
              component="button"
              type="button"
              onClick={handleSubmit}
              sx={{
                ...accentKeySx,
                flex: 2.4,
                fontSize: '1.1rem',
                fontWeight: 700,
                borderRadius: '18px',
              }}
            >
              {submitLabel}
            </Box>
          </Box>
        </Box>
      )}
    </Drawer>
  );
}
