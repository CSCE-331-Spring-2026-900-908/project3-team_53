'use client';

import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Get } from '@/utils/apiService';

interface InventoryItem {
  id: number;
  name: string;
  quantity: number;
  status: string;
}

export default function ManagerInventoryPage() {
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);

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
        {loading ? (
          <Typography variant="body1" sx={{ color: '#333333' }}>
            Loading inventory...
          </Typography>
        ) : inventoryItems.length === 0 ? (
          <Typography variant="body1" sx={{ color: '#333333' }}>
            No inventory items found.
          </Typography>
        ) : (
          inventoryItems.map((item) => (
            <Box
              key={item.id}
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
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    {item.name}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#999999' }}>
                    (ID: {item.id})
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ color: '#666666' }}>
                  Quantity: {item.quantity}
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ color: item.status === 'Low' ? '#d32f2f' : '#2e7d32' }}>
                {item.status}
              </Typography>
            </Box>
          ))
        )}
      </Box>
    </Box>
  );
}
