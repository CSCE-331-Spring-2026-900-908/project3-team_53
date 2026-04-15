'use client';

import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { Get, Patch, Delete } from '@/utils/apiService';

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
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<'save' | 'delete' | null>(null);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [editedValues, setEditedValues] = useState({ id: '', name: '', supplier: '' });
  const [formErrors, setFormErrors] = useState<{ id?: string; name?: string }>({});
  const [swapPrompt, setSwapPrompt] = useState<{
    open: boolean;
    existingItem: InventoryItem | null;
    newId: number | null;
  }>({ open: false, existingItem: null, newId: null });
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

  const fetchInventory = async () => {
    try {
      const data: InventoryItem[] = await Get('/inventory');
      if (Array.isArray(data)) {
        setInventoryItems(data);
      }
    } catch (error) {
      console.error('Failed to load inventory:', error);
      setSnackbar({ open: true, message: 'Failed to load inventory. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
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

  const openEditDialog = (item: InventoryItem) => {
    setSelectedItem(item);
    setEditedValues({ id: String(item.id), name: item.name, supplier: item.supplier ?? '' });
    setFormErrors({});
    setPendingAction(null);
    setSwapPrompt({ open: false, existingItem: null, newId: null });
    setIsEditOpen(true);
  };

  const closeEditDialog = () => {
    setIsEditOpen(false);
    setSelectedItem(null);
    setFormErrors({});
    setPendingAction(null);
    setSwapPrompt({ open: false, existingItem: null, newId: null });
  };

  const handleFieldChange = (field: 'id' | 'name' | 'supplier', value: string) => {
    setEditedValues((prev) => ({ ...prev, [field]: value }));
    setFormErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validateFields = () => {
    if (!selectedItem) return false;
    const errors: { id?: string; name?: string } = {};
    const trimmedName = editedValues.name.trim();
    const trimmedIdValue = editedValues.id.trim();
    const parsedId = Number(trimmedIdValue);

    if (!trimmedName) {
      errors.name = 'Item name cannot be blank.';
    }

    if (!trimmedIdValue) {
      errors.id = 'Item ID is required.';
    } else if (Number.isNaN(parsedId)) {
      errors.id = 'Item ID must be a number.';
    } else if (!Number.isInteger(parsedId)) {
      errors.id = 'Item ID must be an integer.';
    } else if (parsedId < 0) {
      errors.id = 'Item ID cannot be negative.';
    }

    if (
      trimmedName &&
      inventoryItems.some((item) => item.name.trim().toLowerCase() === trimmedName.toLowerCase() && item.id !== selectedItem.id)
    ) {
      errors.name = `${trimmedName} already exists as an inventory item.`;
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveClick = () => {
    if (!selectedItem) return;
    if (!validateFields()) return;

    const parsedId = Number(editedValues.id);
    const duplicateItem = inventoryItems.find((item) => item.id === parsedId && item.id !== selectedItem.id);

    if (duplicateItem) {
      setSwapPrompt({ open: true, existingItem: duplicateItem, newId: parsedId });
      return;
    }

    setPendingAction('save');
    setIsConfirmOpen(true);
  };

  const handleDeleteClick = () => {
    if (!selectedItem) return;
    setPendingAction('delete');
    setIsConfirmOpen(true);
  };

  const updateInventoryItem = async (
    currentId: number,
    payload: { id: number; name: string; supplier?: string },
  ) => {
    return Patch(`/inventory/${currentId}`, payload);
  };

  const deleteInventoryItem = async (currentId: number) => {
    return Delete(`/inventory/${currentId}`);
  };

  const swapInventoryIds = async (
    sourceId: number,
    targetId: number,
    payload: { name: string; supplier?: string },
  ) => {
    return Patch('/inventory/swap-ids', { sourceId, targetId, ...payload });
  };

  const applyPendingAction = async () => {
    if (!selectedItem || !pendingAction) return;

    try {
      if (pendingAction === 'delete') {
        await deleteInventoryItem(selectedItem.id);
        setSnackbar({ open: true, message: `Deleted ${selectedItem.name}.` });
      } else {
        const trimmedName = editedValues.name.trim();
        const parsedId = Number(editedValues.id);
        await updateInventoryItem(selectedItem.id, {
          id: parsedId,
          name: trimmedName,
          supplier: editedValues.supplier.trim() || undefined,
        });
        setSnackbar({ open: true, message: `Saved changes for ${trimmedName}.` });
      }
      await fetchInventory();
      closeEditDialog();
      setIsConfirmOpen(false);
    } catch (error) {
      console.error('Failed to persist inventory changes:', error);
      setSnackbar({ open: true, message: 'Failed to save inventory changes. Please try again.' });
    }
  };

  const handleSwapConfirm = async () => {
    if (!selectedItem || !swapPrompt.existingItem || swapPrompt.newId === null) return;

    try {
      const trimmedName = editedValues.name.trim();
      const parsedId = swapPrompt.newId;
      const existingItem = swapPrompt.existingItem;

      await swapInventoryIds(selectedItem.id, parsedId, {
        name: trimmedName,
        supplier: editedValues.supplier.trim() || undefined,
      });
      setSnackbar({
        open: true,
        message: `${selectedItem.name} swapped IDs with ${existingItem.name}.`,
      });
      await fetchInventory();
      setSwapPrompt({ open: false, existingItem: null, newId: null });
      closeEditDialog();
    } catch (error) {
      console.error('Failed to swap inventory IDs:', error);
      setSnackbar({ open: true, message: 'Failed to switch inventory IDs. Please try again.' });
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

      <Dialog open={isEditOpen} onClose={closeEditDialog} aria-labelledby="edit-item-dialog-title">
        <DialogTitle id="edit-item-dialog-title">Edit Inventory Item</DialogTitle>
        <DialogContent sx={{ display: 'grid', gap: 2, minWidth: 360 }}>
          <TextField
            label="Item Name"
            value={editedValues.name}
            onChange={(event) => handleFieldChange('name', event.target.value)}
            error={Boolean(formErrors.name)}
            helperText={formErrors.name}
            fullWidth
          />
          <TextField
            label="Supplier"
            value={editedValues.supplier}
            onChange={(event) => handleFieldChange('supplier', event.target.value)}
            fullWidth
          />
          <TextField
            label="Item ID"
            type="number"
            value={editedValues.id}
            onChange={(event) => handleFieldChange('id', event.target.value)}
            error={Boolean(formErrors.id)}
            helperText={formErrors.id}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="primary" onClick={handleSaveClick}>
            Confirm
          </Button>
          <Button variant="outlined" color="error" onClick={handleDeleteClick} startIcon={<DeleteIcon />}>
            Delete
          </Button>
          <Button variant="text" onClick={closeEditDialog}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={isConfirmOpen} onClose={() => setIsConfirmOpen(false)} aria-labelledby="confirm-action-dialog-title">
        <DialogTitle id="confirm-action-dialog-title">Confirm Changes</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ color: '#333333', mb: 2 }}>
            {pendingAction === 'delete'
              ? `Are you sure you want to implement these changes and delete ${selectedItem?.name}?`
              : `Are you sure you want to implement these changes to ${editedValues.name.trim() || selectedItem?.name}?`}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="primary" onClick={applyPendingAction}>
            Yes
          </Button>
          <Button variant="outlined" onClick={() => setIsConfirmOpen(false)}>
            No
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={swapPrompt.open} onClose={() => setSwapPrompt({ open: false, existingItem: null, newId: null })} aria-labelledby="swap-id-dialog-title">
        <DialogTitle id="swap-id-dialog-title">Item ID Already In Use</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ color: '#333333', mb: 2 }}>
            {swapPrompt.existingItem
              ? `${swapPrompt.existingItem.name} already exists using item ID ${swapPrompt.newId}. Would you like to switch the item IDs?`
              : 'This item ID is already in use.'}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="primary" onClick={handleSwapConfirm}>
            Yes, switch IDs
          </Button>
          <Button
            variant="outlined"
            onClick={() => setSwapPrompt({ open: false, existingItem: null, newId: null })}
          >
            No
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
                position: 'relative',
                p: 3,
                backgroundColor: 'var(--color-surface)',
                borderRadius: 2,
                boxShadow: 1,
                display: 'flex',
                alignItems: 'flex-start',
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
                sx={{ color: item.status.toLowerCase().includes('low') ? 'var(--color-error-dark)' : 'var(--color-active-green-alt)', mt: 1, mb: 4 }}
              >
                {item.status}
              </Typography>
              <IconButton
                onClick={() => openEditDialog(item)}
                aria-label={`Edit ${item.name}`}
                sx={{ position: 'absolute', right: 16, bottom: 16, color: '#d32f2f' }}
              >
                <EditIcon />
              </IconButton>
            </Box>
          ))
        )}
      </Box>
    </Box>
  );
}
