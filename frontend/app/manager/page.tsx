'use client';

import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@/components/portal/card';
import { Get } from '@/utils/apiService';

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
        minHeight: '100vh',
        width: '100vw',
        px: 4,
        py: 6,
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
        alignItems: 'center',
        backgroundColor: '#FAF3E0',
        color: '#000000',
      }}
    >
      <Box sx={{ maxWidth: 980, textAlign: 'center' }}>
        <Typography variant="h2" component="h1" sx={{ fontWeight: 700, mb: 1 }}>
          Boba Shop Manager Interface
        </Typography>
        <Typography variant="body1" sx={{ color: '#333333' }}>
          {employeeCount === null ? 'Loading employee data…' : `${employeeCount} employees currently registered`}
        </Typography>
      </Box>

      <Box
        sx={{
          display: 'grid',
          width: '100%',
          maxWidth: 1100,
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, minmax(0, 1fr))',
            md: 'repeat(2, minmax(0, 1fr))',
          },
          gap: 2,
        }}
      >
        <Card href="/manager/orders">
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Order History
          </Typography>
        </Card>

        <Card href="/manager/employees">
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Employees
          </Typography>
        </Card>

        <Card href="/manager/inventory">
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Inventory
          </Typography>
        </Card>

        <Card href="/manager/menu">
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Menu items
          </Typography>
        </Card>
      </Box>
    </Box>
  );
}
