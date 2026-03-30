'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import CircularProgress from '@mui/material/CircularProgress';
import LocalDiningIcon from '@mui/icons-material/LocalDining';
import TakeoutDiningIcon from '@mui/icons-material/TakeoutDining';
import {
  KitchenOrder,
  KitchenOrderItem,
  TimeTier,
  getTimeTier,
  formatElapsed,
  elapsedSeconds,
} from '@/types/kitchen';

interface OrderCardProps {
  order: KitchenOrder;
  onComplete: (id: number) => Promise<void>;
}

const TIER_STYLES: Record<TimeTier, { bg: string; border: string; accent: string }> = {
  green:  { bg: '#e8f5e9', border: '#4caf50', accent: '#2e7d32' },
  yellow: { bg: '#fff8e1', border: '#fbc02d', accent: '#f9a825' },
  orange: { bg: '#fff3e0', border: '#ff9800', accent: '#e65100' },
  red:    { bg: '#ffebee', border: '#f44336', accent: '#c62828' },
};

export default function OrderCard({ order, onComplete }: OrderCardProps) {
  const [elapsed, setElapsed] = useState(() => elapsedSeconds(order.created_at));
  const [completing, setCompleting] = useState(false);

  useEffect(() => {
    const id = setInterval(() => setElapsed(elapsedSeconds(order.created_at)), 1000);
    return () => clearInterval(id);
  }, [order.created_at]);

  const tier = getTimeTier(elapsed);
  const style = TIER_STYLES[tier];

  const handleDoubleClick = useCallback(async () => {
    if (completing) return;
    setCompleting(true);
    try {
      await onComplete(order.id);
    } catch {
      setCompleting(false);
    }
  }, [completing, onComplete, order.id]);

  const isDineIn = order.order_type === 'dine_in';
  const totalItems = order.items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <Box
      onDoubleClick={handleDoubleClick}
      sx={{
        bgcolor: completing ? 'rgba(76,175,80,0.15)' : style.bg,
        border: `2px solid ${style.border}`,
        borderRadius: 2.5,
        overflow: 'hidden',
        cursor: 'pointer',
        userSelect: 'none',
        transition: 'all 0.3s ease',
        opacity: completing ? 0.5 : 1,
        transform: completing ? 'scale(0.95)' : 'scale(1)',
        animation: tier === 'red' ? 'pulse 2s infinite' : 'none',
        '@keyframes pulse': {
          '0%, 100%': { boxShadow: `0 0 0 0 ${style.border}40` },
          '50%': { boxShadow: `0 0 12px 4px ${style.border}60` },
        },
        '&:hover': {
          transform: completing ? 'scale(0.95)' : 'scale(1.02)',
          boxShadow: `0 4px 20px ${style.border}40`,
        },
      }}
    >
      {/* Color accent bar */}
      <Box sx={{ height: 6, bgcolor: style.border }} />

      <Box sx={{ p: 2 }}>
        {/* Header row */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography sx={{ fontWeight: 800, fontSize: '1.25rem', color: '#1a1a2e' }}>
              #{order.id}
            </Typography>
            <Chip
              size="small"
              icon={isDineIn
                ? <LocalDiningIcon sx={{ fontSize: 14 }} />
                : <TakeoutDiningIcon sx={{ fontSize: 14 }} />
              }
              label={isDineIn ? 'Dine In' : 'Carry Out'}
              sx={{
                bgcolor: isDineIn ? '#e3f2fd' : '#fce4ec',
                color: isDineIn ? '#1565c0' : '#c62828',
                fontWeight: 600,
                fontSize: '0.7rem',
                height: 24,
              }}
            />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            {completing && <CircularProgress size={14} />}
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: '0.9rem',
                color: style.accent,
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {formatElapsed(elapsed)}
            </Typography>
          </Box>
        </Box>

        {/* Item count badge */}
        <Typography sx={{ fontSize: '0.75rem', color: '#666', mb: 1 }}>
          {totalItems} item{totalItems !== 1 ? 's' : ''} &middot; ${Number(order.total).toFixed(2)}
        </Typography>

        <Divider sx={{ mb: 1 }} />

        {/* Items list */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
          {order.items.map((item) => (
            <ItemRow key={item.id} item={item} />
          ))}
        </Box>

        {/* Double-click hint */}
        <Typography
          sx={{
            mt: 1.5,
            textAlign: 'center',
            fontSize: '0.65rem',
            color: '#999',
            fontStyle: 'italic',
          }}
        >
          Double-click to complete
        </Typography>
      </Box>
    </Box>
  );
}

function ItemRow({ item }: { item: KitchenOrderItem }) {
  const customizations: string[] = [];
  if (item.size !== 'Regular') customizations.push(item.size);
  if (item.sugar_level !== '100%') customizations.push(`${item.sugar_level} sugar`);
  if (item.ice_level !== 'Regular') customizations.push(item.ice_level);

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5 }}>
        <Typography
          sx={{
            fontWeight: 700,
            fontSize: '0.85rem',
            color: '#1a1a2e',
            minWidth: 20,
          }}
        >
          {item.quantity}x
        </Typography>
        <Typography sx={{ fontWeight: 600, fontSize: '0.85rem', color: '#1a1a2e' }}>
          {item.menuItem.name}
        </Typography>
      </Box>

      {(customizations.length > 0 || item.toppings.length > 0) && (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, ml: 3, mt: 0.25 }}>
          {customizations.map((c) => (
            <Chip
              key={c}
              label={c}
              size="small"
              sx={{
                height: 20,
                fontSize: '0.65rem',
                bgcolor: '#e8eaf6',
                color: '#3949ab',
                fontWeight: 500,
              }}
            />
          ))}
          {item.toppings.map((t) => (
            <Chip
              key={t}
              label={`+ ${t}`}
              size="small"
              sx={{
                height: 20,
                fontSize: '0.65rem',
                bgcolor: '#f3e5f5',
                color: '#7b1fa2',
                fontWeight: 500,
              }}
            />
          ))}
        </Box>
      )}
    </Box>
  );
}
