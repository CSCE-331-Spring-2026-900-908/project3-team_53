'use client';

import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Get } from '@/utils/apiService';

interface DayOrderListProps {
  date: string | null;
}

type OrderRow = {
  id: number;
  [key: string]: unknown;
};

export default function DayOrderList({ date }: DayOrderListProps) {
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!date) return;

    const fetchOrders = async () => {
      setLoading(true);
      try {
        const data = await Get(`/orders/by-date/${date}`);
        setOrders(Array.isArray(data) ? (data as OrderRow[]) : []);
      } catch (err) {
        console.error('Failed to load orders:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [date]);

  // Show white box on first load
  if (!date) {
    return (
        <Paper sx={{ 
        p: 3, 
        width: '100%', 
        height: 700, 
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
        }}>
        <Typography>Select a date to view order history.</Typography>
        </Paper>
    );
  }

  if (loading) {
    return <Typography>Loading orders…</Typography>;
  }

  if (orders.length === 0) {
    return <Typography>No orders found for {date}.</Typography>;
  }

  // Remove unwanted fields
  const hiddenColumns = ['items'];

  const columns = Object.keys(orders[0])
    .filter((key) => !hiddenColumns.includes(key))
    .map((key) => ({
      key,
      label: key.replace(/_/g, ' ').toUpperCase(),
    }));

    const formatValue = (value: unknown, key: string, order: OrderRow): string => {
    // Format timestamps
    if (typeof value === 'string' && value.includes('T')) {
        const date = new Date(value);
        return date.toLocaleString();
    }

    // Customer name fallback
    if (key === 'customer_name') {
    if (typeof value === 'string' && value.trim() !== '') return value;

    // Generate a placeholder
    return `Customer ${order.id}`;
    }

    // Customer phone fallback
    if (key === 'customer_phone') {
        return (typeof value === 'string' && value) ? value : 'No phone';
    }

    return String(value ?? '');
    };


  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Orders for {date}
      </Typography>

      <TableContainer component={Paper} sx={{ maxHeight: 700 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {columns.map((col) => (
                <TableCell
                  key={col.key}
                  sx={{ fontWeight: 'bold', backgroundColor: 'var(--color-order-row-bg)' }}
                >
                  {col.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id} hover>
                {columns.map((col) => (
                  <TableCell key={col.key}>
                    {formatValue(order[col.key], col.key, order)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
