'use client';

import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import InventoryIcon from '@mui/icons-material/Inventory';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import Image from 'next/image';
import Link from 'next/link';
import { Get } from '@/utils/apiService';

const cards = [
  { href: '/manager/orders', label: 'Order History', description: 'View and track all past orders', icon: ReceiptLongIcon, color: '#5c6bc0' },
  { href: '/manager/employees', label: 'Employees', description: 'Manage staff and roles', icon: PeopleAltIcon, color: '#26a69a' },
  { href: '/manager/inventory', label: 'Inventory', description: 'Track stock and supplies', icon: InventoryIcon, color: '#ef5350' },
  { href: '/manager/menu', label: 'Menu Editor', description: 'Update drinks and pricing', icon: RestaurantMenuIcon, color: '#ffa726' },
];

export default function ManagerDashboard() {
  const [employeeCount, setEmployeeCount] = useState<number | null>(null);

  useEffect(() => {
    const fetchEmployeeCount = async () => {
      try {
        const data = await Get('/employees');
        if (Array.isArray(data)) {
          setEmployeeCount(data.length);
        }
      } catch (error) {
        console.error('Failed to load employees:', error);
      }
    };

    fetchEmployeeCount();
  }, []);

  return (
    <Box
      sx={{
        minHeight: 'calc(100vh - 52px)',
        px: 3,
        py: 5,
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
        alignItems: 'center',
        backgroundColor: '#FAF3E0',
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.5 }}>
        <Image src="/project_3_logo.png" alt="Boba Shop logo" width={220} height={88} priority />
        <Typography variant="h3" component="h1" sx={{ fontWeight: 700, color: '#333' }}>
          Manager Dashboard
        </Typography>
        <Chip
          label={employeeCount === null ? 'Loading...' : `${employeeCount} employees registered`}
          variant="outlined"
          sx={{ borderColor: '#ccc', color: '#666', fontWeight: 500 }}
        />
      </Box>

      <Box
        sx={{
          display: 'grid',
          width: '100%',
          maxWidth: 900,
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
          },
          gap: 3,
        }}
      >
        {cards.map((card) => (
          <Link key={card.href} href={card.href} style={{ textDecoration: 'none' }}>
            <Paper
              elevation={0}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2.5,
                p: 3,
                borderRadius: 3,
                backgroundColor: '#f5f0dc',
                border: '1px solid #e8e0c8',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                '&:hover': {
                  transform: 'translateY(-3px)',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                  borderColor: card.color,
                },
              }}
            >
              <Box
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: 2.5,
                  backgroundColor: card.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <card.icon sx={{ fontSize: 28, color: '#fff' }} />
              </Box>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#333', lineHeight: 1.3 }}>
                  {card.label}
                </Typography>
                <Typography variant="body2" sx={{ color: '#888', mt: 0.25 }}>
                  {card.description}
                </Typography>
              </Box>
            </Paper>
          </Link>
        ))}
      </Box>
    </Box>
  );
}
