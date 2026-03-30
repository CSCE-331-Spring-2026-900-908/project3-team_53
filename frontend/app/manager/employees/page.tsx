'use client';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

const sampleEmployees = [
  { name: 'Taylor Nguyen', role: 'Shift Lead', status: 'Active' },
  { name: 'Morgan Lee', role: 'Barista', status: 'Active' },
  { name: 'Casey Patel', role: 'Cashier', status: 'On Leave' },
];

export default function ManagerEmployeesPage() {
  return (
<<<<<<< HEAD
    <Box sx={{ minHeight: '80vh', px: 4, py: 6, backgroundColor: '#f7f7f7', color: '#000000' }}>
      <Typography variant="h3" component="h1" sx={{ fontWeight: 700, mb: 2, color: '#000000' }}>
        Employee Management
      </Typography>
      <Typography variant="body1" sx={{ color: '#000000', mb: 4, maxWidth: 820 }}>
=======
    <Box sx={{ minHeight: '80vh', px: 4, py: 6, backgroundColor: '#f7f7f7' }}>
      <Typography variant="h3" component="h1" sx={{ fontWeight: 700, mb: 2 }}>
        Employee Management
      </Typography>
      <Typography variant="body1" sx={{ color: '#555555', mb: 4, maxWidth: 820 }}>
>>>>>>> 9eb3ed238d954ce1d62b9178bdb80fb985a52751
        View your team, update roles, and manage employee availability.
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 4 }}>
        <Button variant="contained">Add Employee</Button>
        <Button variant="outlined">Review Schedule</Button>
      </Box>

      <Box sx={{ display: 'grid', gap: 2, maxWidth: 900 }}>
        {sampleEmployees.map((employee) => (
          <Box
            key={employee.name}
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
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                {employee.name}
              </Typography>
              <Typography variant="body2" sx={{ color: '#666666' }}>
                {employee.role}
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: '#333333' }}>
              {employee.status}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
