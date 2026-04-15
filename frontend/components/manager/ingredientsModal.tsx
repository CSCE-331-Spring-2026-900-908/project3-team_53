'use client';

import React from 'react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';    
import IconButton from '@mui/material/IconButton';
import MuiMenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { MenuItem } from '@/types/customer';
import { useTranslation } from '@/contexts/TranslationContext';

type InventoryItem = {
  id: number;
  name: string;
  quantity: number;
  status: string;
};

type IngredientAssignment = {
  inventoryId: string;
  servingsUsed: string;
  isTopping: boolean;
};

interface IngredientsModalProps {
  item: MenuItem;
  ingredients: IngredientAssignment[];
  inventoryItems: InventoryItem[];
  open: boolean;
  onAddRow: () => void;
  onClose: () => void;
  onRemoveRow: (index: number) => void;
  onSave: () => void;
  onUpdateRow: (index: number, patch: Partial<IngredientAssignment>) => void;
  saving?: boolean;
}

export default function IngredientsModal({
  item,
  ingredients,
  inventoryItems,
  open,
  onAddRow,
  onClose,
  onRemoveRow,
  onSave,
  onUpdateRow,
  saving = false,
}: IngredientsModalProps) {
  const { t } = useTranslation();

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>{`${t('Ingredients for')} ${item.name}`}</DialogTitle>
      <DialogContent dividers sx={{ borderColor: 'var(--color-cream-hover)' }}>
        <Stack spacing={2}>
          <Box>
            <Typography sx={{ color: 'var(--color-editor-brown-dim)' }}>
              Choose the inventory ingredients this item uses, set how many servings it consumes,
              and mark which rows count as toppings.
            </Typography>
          </Box>

          <Alert severity="info" sx={{ borderRadius: 2 }}>
            Ingredient changes are saved for this menu item only.
          </Alert>

          <TableContainer
            component={Paper}
            sx={{ border: '1px solid var(--color-cream-border)', borderRadius: 2 }}
          >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{t('Ingredient')}</TableCell>
                <TableCell>{t('Servings used')}</TableCell>
                <TableCell align="right">{t('Actions')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {ingredients.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4}>
                    <Typography sx={{ color: 'var(--color-editor-brown-light)' }}>
                      No ingredients assigned yet. Add a row to start building this recipe.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                ingredients.map((row, index) => (
                  <TableRow key={`${item.id}-ingredient-${index}`}>
                    <TableCell sx={{ minWidth: 260 }}>
                      <Select
                        fullWidth
                        size="small"
                        value={row.inventoryId}
                        onChange={(event) =>
                          onUpdateRow(index, { inventoryId: String(event.target.value) })
                        }
                        displayEmpty
                        disabled={saving}
                        sx={{ borderRadius: 2 }}
                      >
                        <MuiMenuItem value="">
                          <em>Select inventory item</em>
                        </MuiMenuItem>
                        {inventoryItems.map((inventoryItem) => (
                          <MuiMenuItem key={inventoryItem.id} value={String(inventoryItem.id)}>
                            {inventoryItem.name}
                          </MuiMenuItem>
                        ))}
                      </Select>
                    </TableCell>
                    <TableCell sx={{ width: 160 }}>
                      <TextField
                        fullWidth
                        size="small"
                        type="number"
                        inputProps={{ min: 0.01, step: 0.01 }}
                        value={row.servingsUsed}
                        onChange={(event) =>
                          onUpdateRow(index, { servingsUsed: event.target.value })
                        }
                        disabled={saving}
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                      />
                    </TableCell>
                    <TableCell align="right" sx={{ width: 88 }}>
                      <IconButton
                        color="error"
                        onClick={() => onRemoveRow(index)}
                        disabled={saving}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          </TableContainer>

          <Button
            onClick={onAddRow}
            startIcon={<AddIcon />}
            variant="outlined"
            disabled={saving}
            sx={{ alignSelf: 'flex-start', borderRadius: 999 }}
          >
            Add ingredient row
          </Button>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={onSave}
          variant="contained"
          disabled={saving}
          sx={{ borderRadius: 999, bgcolor: 'var(--color-editor-green)', '&:hover': { bgcolor: 'var(--color-editor-green-dark)' } }}
        >
          {saving ? 'Saving...' : 'Save ingredients'}
        </Button>
        <Button onClick={onClose}>{t('Close')}</Button>
      </DialogActions>
    </Dialog>
  );
}
