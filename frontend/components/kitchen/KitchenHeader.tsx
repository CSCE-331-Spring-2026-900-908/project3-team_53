'use client';

import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import TimerIcon from '@mui/icons-material/Timer';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { DayStats, formatElapsed, getTimeTier } from '@/types/kitchen';

interface KitchenHeaderProps {
  pendingCount: number;
  dayStats: DayStats;
}

export default function KitchenHeader({ pendingCount, dayStats }: KitchenHeaderProps) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const longestTier = getTimeTier(dayStats.longestWaitSeconds);

  const tierColors: Record<string, string> = {
    green: 'var(--color-status-green-border)',
    yellow: 'var(--color-status-yellow-border)',
    orange: 'var(--color-status-orange-border)',
    red: 'var(--color-status-red-border)',
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        px: 3,
        py: 1.5,
        bgcolor: 'var(--color-dark-bg)',
        borderBottom: '2px solid var(--color-dark-surface)',
        flexWrap: 'wrap',
        gap: 1,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Typography
          variant="h5"
          sx={{ color: 'var(--color-text-white)', fontWeight: 700, letterSpacing: 0.5 }}
        >
          Kitchen Display
        </Typography>
        <Chip
          icon={<AccessTimeIcon sx={{ color: 'var(--color-border) !important' }} />}
          label={now.toLocaleTimeString()}
          sx={{
            bgcolor: 'var(--color-dark-surface)',
            color: 'var(--color-border)',
            fontWeight: 600,
            fontSize: '0.85rem',
          }}
        />
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <StatBox
          icon={<PendingActionsIcon sx={{ fontSize: 20 }} />}
          label="Pending"
          value={String(pendingCount)}
          color="var(--color-stat-blue)"
        />
        <StatBox
          icon={<CheckCircleOutlineIcon sx={{ fontSize: 20 }} />}
          label="Completed Today"
          value={String(dayStats.completedOrders)}
          color="var(--color-stat-green)"
        />
        <StatBox
          icon={<TimerIcon sx={{ fontSize: 20 }} />}
          label="Avg Wait (Today)"
          value={dayStats.totalOrders > 0 ? formatElapsed(dayStats.avgWaitSeconds) : '--'}
          color="var(--color-stat-purple)"
        />
        <StatBox
          icon={<WarningAmberIcon sx={{ fontSize: 20 }} />}
          label="Longest (Today)"
          value={dayStats.totalOrders > 0 ? formatElapsed(dayStats.longestWaitSeconds) : '--'}
          color={tierColors[longestTier]}
        />
      </Box>
    </Box>
  );
}

function StatBox({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
}) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 0.75,
        bgcolor: 'rgba(255,255,255,0.06)',
        borderRadius: 2,
        px: 1.5,
        py: 0.75,
      }}
    >
      <Box sx={{ color, display: 'flex', alignItems: 'center' }}>{icon}</Box>
      <Box>
        <Typography
          sx={{ color: 'var(--color-text-muted)', fontSize: '0.65rem', lineHeight: 1, textTransform: 'uppercase', letterSpacing: 0.5 }}
        >
          {label}
        </Typography>
        <Typography sx={{ color, fontWeight: 700, fontSize: '0.95rem', lineHeight: 1.3 }}>
          {value}
        </Typography>
      </Box>
    </Box>
  );
}
