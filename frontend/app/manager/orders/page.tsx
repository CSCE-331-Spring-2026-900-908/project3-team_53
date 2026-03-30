'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const sampleOrders = [
  { id: 'ORD-1001', date: '2026-03-25', customer: 'Avery', total: '$12.40' },
  { id: 'ORD-1002', date: '2026-03-26', customer: 'Jordan', total: '$8.70' },
  { id: 'ORD-1003', date: '2026-03-27', customer: 'Sam', total: '$15.20' },
];

export default function ManagerOrdersPage() {
  return (
<<<<<<< HEAD
    <Box sx={{ minHeight: '80vh', px: 4, py: 6, backgroundColor: '#f7f7f7', color: '#000000' }}>
      <Typography variant="h3" component="h1" sx={{ fontWeight: 700, mb: 2, color: '#000000' }}>
        Order History
      </Typography>
      <Typography variant="body1" sx={{ color: '#000000', mb: 4, maxWidth: 820 }}>
=======
    <Box sx={{ minHeight: '80vh', px: 4, py: 6, backgroundColor: '#f7f7f7' }}>
      <Typography variant="h3" component="h1" sx={{ fontWeight: 700, mb: 2 }}>
        Order History
      </Typography>
      <Typography variant="body1" sx={{ color: '#555555', mb: 4, maxWidth: 820 }}>
>>>>>>> 9eb3ed238d954ce1d62b9178bdb80fb985a52751
        Review recent orders and sales totals. Click through orders to see item details and fulfillment status.
      </Typography>

      <Box
        component="table"
        sx={{
          width: '100%',
          borderCollapse: 'collapse',
          backgroundColor: '#ffffff',
          boxShadow: 1,
        }}
      >
        <Box component="thead" sx={{ backgroundColor: '#f0f0f0' }}>
          <Box component="tr">
            <Box component="th" sx={{ textAlign: 'left', p: 2, borderBottom: '1px solid #ddd' }}>
              Order ID
            </Box>
            <Box component="th" sx={{ textAlign: 'left', p: 2, borderBottom: '1px solid #ddd' }}>
              Date
            </Box>
            <Box component="th" sx={{ textAlign: 'left', p: 2, borderBottom: '1px solid #ddd' }}>
              Customer
            </Box>
            <Box component="th" sx={{ textAlign: 'left', p: 2, borderBottom: '1px solid #ddd' }}>
              Total
            </Box>
          </Box>
        </Box>
        <Box component="tbody">
          {sampleOrders.map((order) => (
            <Box component="tr" key={order.id}>
              <Box component="td" sx={{ p: 2, borderBottom: '1px solid #eee' }}>
                {order.id}
              </Box>
              <Box component="td" sx={{ p: 2, borderBottom: '1px solid #eee' }}>
                {order.date}
              </Box>
              <Box component="td" sx={{ p: 2, borderBottom: '1px solid #eee' }}>
                {order.customer}
              </Box>
              <Box component="td" sx={{ p: 2, borderBottom: '1px solid #eee' }}>
                {order.total}
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
