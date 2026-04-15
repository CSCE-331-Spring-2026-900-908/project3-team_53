'use client';

import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { Get, Patch } from '@/utils/apiService';

interface InventoryItem {
  id: number;
  name: string;
  quantity: number;
  maxStock?: number;
  supplier?: string;
  status: string;
}

export default function ManagerInventoryPage() {
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isQuickRestockOpen, setIsQuickRestockOpen] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string }>({
    open: false,
    message: '',
  });

  const lowStockItems = inventoryItems.filter((item) => item.status.toLowerCase().includes('low'));
  const filteredItems = inventoryItems.filter((item) => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return true;

    const matchesName = item.name.toLowerCase().includes(query);
    const matchesId = item.id.toString().includes(query);
    return matchesName || matchesId;
  });

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const data: InventoryItem[] = await Get('/inventory');
        if (Array.isArray(data)) {
          setInventoryItems(data);
        }
      } catch (error) {
        console.error('Failed to load inventory:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInventory();
  }, []);

  const openQuickRestock = () => {
    if (lowStockItems.length === 0) {
      setSnackbar({ open: true, message: 'No low stock items are available for quick restock.' });
      return;
    }
    setIsQuickRestockOpen(true);
  };

  const closeQuickRestock = () => setIsQuickRestockOpen(false);
  const confirmQuickRestock = async () => {
    try {
      const updatedItems: InventoryItem[] = await Patch('/inventory/quick-restock');
      setInventoryItems((items) =>
        items.map((item) => {
          const updated = updatedItems.find((updatedItem) => updatedItem.id === item.id);
          return updated ? updated : item;
        }),
      );
      setSnackbar({ open: true, message: 'Quick restock completed successfully.' });
    } catch (error) {
      console.error('Quick restock failed:', error);
      setSnackbar({ open: true, message: 'Failed to update inventory. Please try again.' });
    } finally {
      setIsQuickRestockOpen(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  return (
    <Box sx={{ minHeight: '80vh', px: 4, py: 6, backgroundColor: 'var(--color-surface-alt)', color: 'var(--color-text-black)' }}>
      <Typography variant="h3" component="h1" sx={{ fontWeight: 700, mb: 2, color: 'var(--color-text-black)' }}>
        Inventory Management
      </Typography>
      <Typography variant="body1" sx={{ color: 'var(--color-text-black)', mb: 4, maxWidth: 820 }}>
        Track stock levels and update inventory so the shop stays fully stocked.
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 4, alignItems: 'center' }}>
        <Button variant="contained" onClick={openQuickRestock}>
          Quick Restock
        </Button>
        <Button variant="outlined">Create Order</Button>
        <TextField
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          label="Search by name or ID"
          variant="outlined"
          size="small"
          sx={{ minWidth: 260 }}
        />
      </Box>

      <Dialog open={isQuickRestockOpen} onClose={closeQuickRestock} aria-labelledby="quick-restock-dialog-title">
        <DialogTitle id="quick-restock-dialog-title">Quick Restock Confirmation</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ color: 'var(--color-text-primary)', mb: 2 }}>
            {lowStockItems.length > 0
              ? `This will fully restock all ${lowStockItems.length} item(s) marked as low stock and update their status to In Stock.`
              : 'No items are currently marked as low stock.'}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="primary"
            onClick={confirmQuickRestock}
            disabled={lowStockItems.length === 0}
          >
            Confirm
          </Button>
          <Button variant="outlined" onClick={closeQuickRestock}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.message.toLowerCase().includes('failed') ? 'error' : 'success'}
          variant="filled"
          sx={{ fontWeight: 600 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      <Box sx={{ display: 'grid', gap: 2, maxWidth: 900 }}>
        {loading ? (
          <Typography variant="body1" sx={{ color: 'var(--color-text-primary)' }}>
            Loading inventory...
          </Typography>
        ) : filteredItems.length === 0 ? (
          <Typography variant="body1" sx={{ color: 'var(--color-text-primary)' }}>
            No inventory items found.
          </Typography>
        ) : (
          filteredItems.map((item) => (
            <Box
              key={item.id}
              sx={{
                p: 3,
                backgroundColor: 'var(--color-surface)',
                borderRadius: 2,
                boxShadow: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    {item.name}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'var(--color-text-muted)' }}>
                    (<strong>ID:</strong> {item.id})
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ color: 'var(--color-text-secondary)' }}>
                  <strong>Quantity:</strong> {item.quantity}
                </Typography>
                {item.supplier && (
                  <Typography variant="body2" sx={{ color: 'var(--color-text-secondary)', mt: 0.5 }}>
                    <strong>Supplier:</strong> {item.supplier}
                  </Typography>
                )}
              </Box>
              <Typography
                variant="body2"
                sx={{ color: item.status.toLowerCase().includes('low') ? 'var(--color-error-dark)' : 'var(--color-active-green-alt)' }}
              >
                {item.status}
              </Typography>
            </Box>
          ))
        )}
      </Box>
    </Box>
  );
}
