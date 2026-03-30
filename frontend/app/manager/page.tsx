'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@/components/portal/card';

export default function ManagerDashboard() {
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
      </Box>

      <Box
        sx={{
          display: 'grid',
          width: '100%',
          maxWidth: 1100,
          gridTemplateColumns: {
            xs: '1fr',
            md: 'repeat(3, minmax(0, 1fr))',
          },
          gap: 2,
        }}
      >
<<<<<<< HEAD
        <Card href="/manager/orders" className="bg-red-600 text-white hover:bg-red-700">
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#ffffff' }}>
=======
        <Card href="/manager/orders">
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
>>>>>>> 9eb3ed238d954ce1d62b9178bdb80fb985a52751
            Order History
          </Typography>
        </Card>

<<<<<<< HEAD
        <Card href="/manager/employees" className="bg-red-600 text-white hover:bg-red-700">
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#ffffff' }}>
=======
        <Card href="/manager/employees">
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
>>>>>>> 9eb3ed238d954ce1d62b9178bdb80fb985a52751
            Employees
          </Typography>
        </Card>

<<<<<<< HEAD
        <Card href="/manager/inventory" className="bg-red-600 text-white hover:bg-red-700">
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#ffffff' }}>
=======
        <Card href="/manager/inventory">
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
>>>>>>> 9eb3ed238d954ce1d62b9178bdb80fb985a52751
            Inventory
          </Typography>
        </Card>
      </Box>
    </Box>
  );
}
