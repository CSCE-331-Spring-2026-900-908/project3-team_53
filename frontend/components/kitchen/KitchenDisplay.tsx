'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Fade from '@mui/material/Fade';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import { Get, Patch } from '@/utils/apiService';
import { KitchenOrder, DayStats } from '@/types/kitchen';
import KitchenHeader from '@/components/kitchen/KitchenHeader';
import OrderCard from '@/components/kitchen/OrderCard';

const POLL_INTERVAL = 5000;

const EMPTY_STATS: DayStats = {
  totalOrders: 0,
  completedOrders: 0,
  avgWaitSeconds: 0,
  longestWaitSeconds: 0,
};

export default function KitchenDisplay() {
  const [orders, setOrders] = useState<KitchenOrder[]>([]);
  const [dayStats, setDayStats] = useState<DayStats>(EMPTY_STATS);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string }>({
    open: false,
    message: '',
  });

  const fetchOrders = useCallback(async () => {
    try {
      const [pending, stats] = await Promise.all([
        Get('/orders/pending'),
        Get('/orders/today-stats'),
      ]);
      setOrders(Array.isArray(pending) ? pending : []);
      setDayStats(stats ?? EMPTY_STATS);
    } catch {
      // silently retry on next poll
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
    const id = setInterval(fetchOrders, POLL_INTERVAL);
    return () => clearInterval(id);
  }, [fetchOrders]);

  const handleComplete = useCallback(
    async (orderId: number) => {
      await Patch(`/orders/${orderId}/complete`);
      setOrders((prev) => prev.filter((o) => o.id !== orderId));
      setSnackbar({ open: true, message: `Order #${orderId} completed` });
    },
    [],
  );

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'var(--color-dark-loading-bg)', display: 'flex', flexDirection: 'column' }}>
      <KitchenHeader pendingCount={orders.length} dayStats={dayStats} />

      <Box sx={{ flex: 1, p: 2.5, overflow: 'auto' }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
            <Typography sx={{ color: 'var(--color-dark-text-muted)', fontSize: '1.1rem' }}>
              Loading orders...
            </Typography>
          </Box>
        ) : orders.length === 0 ? (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              height: '60vh',
              gap: 2,
            }}
          >
            <RestaurantMenuIcon sx={{ fontSize: 80, color: 'var(--color-dark-border)' }} />
            <Typography sx={{ color: 'var(--color-dark-text-subtle)', fontSize: '1.3rem', fontWeight: 600 }}>
              No pending orders
            </Typography>
            <Typography sx={{ color: 'var(--color-dark-text-dim)', fontSize: '0.9rem' }}>
              New orders will appear here automatically
            </Typography>
          </Box>
        ) : (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: 2.5,
              alignItems: 'start',
            }}
          >
            {orders.map((order) => (
              <Fade key={order.id} in timeout={400}>
                <Box>
                  <OrderCard order={order} onComplete={handleComplete} />
                </Box>
              </Fade>
            ))}
          </Box>
        )}
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="success"
          variant="filled"
          sx={{ fontWeight: 600 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
