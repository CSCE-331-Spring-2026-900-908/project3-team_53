'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
fetch('/api/inventory');

const inventoryItems = [
  { item: 'Tapioca Pearls', stock: 'Low' },
  { item: 'Milk Tea Base', stock: 'In Stock' },
  { item: 'Strawberry Syrup', stock: 'Medium' },
  { item: 'Tea Bags', stock: 'In Stock' },
];

export default function ManagerInventoryPage() {
  return (
    <Box sx={{ minHeight: '80vh', px: 4, py: 6, backgroundColor: '#f7f7f7', color: '#000000' }}>
      <Typography variant="h3" component="h1" sx={{ fontWeight: 700, mb: 2, color: '#000000' }}>
        Inventory Management
      </Typography>
      <Typography variant="body1" sx={{ color: '#000000', mb: 4, maxWidth: 820 }}>
        Track stock levels and update inventory so the shop stays fully stocked.
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 4 }}>
        <Button variant="contained">Restock Item</Button>
        <Button variant="outlined">Create Order</Button>
      </Box>

      <Box sx={{ display: 'grid', gap: 2, maxWidth: 900 }}>
        {inventoryItems.map((item) => (
          <Box
            key={item.item}
            sx={{
              p: 3,
              backgroundColor: '#ffffff',
              borderRadius: 2,
              boxShadow: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              {item.item}
            </Typography>
            <Typography variant="body2" sx={{ color: item.stock === 'Low' ? '#d32f2f' : '#2e7d32' }}>
              {item.stock}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
