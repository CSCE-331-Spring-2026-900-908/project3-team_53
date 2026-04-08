'use client';

import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Get } from '@/utils/apiService';

interface Employee {
  id: number;
  name: string;
  role: string;
  email: string;
  shift: string;
  isWorking: boolean;
  wage: number;
}

export default function ManagerEmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const data = await Get('/employees');
        if (Array.isArray(data)) {
          setEmployees(data);
        }
      } catch (error) {
        console.error('Failed to load employees:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  return (
    <Box sx={{ minHeight: '80vh', px: 4, py: 6, backgroundColor: '#f7f7f7', color: '#000000' }}>
      <Typography variant="h3" component="h1" sx={{ fontWeight: 700, mb: 2, color: '#000000' }}>
        Employee Management
      </Typography>
      <Typography variant="body1" sx={{ color: '#000000', mb: 4, maxWidth: 820 }}>
        View your team, update roles, and manage employee availability.
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 4 }}>
        <Button variant="contained">Add Employee</Button>
        <Button variant="outlined">Review Schedule</Button>
      </Box>

      <Box sx={{ display: 'grid', gap: 2, maxWidth: 900 }}>
        {loading ? (
          <Typography variant="body1" sx={{ color: '#333333' }}>
            Loading employees...
          </Typography>
        ) : employees.length === 0 ? (
          <Typography variant="body1" sx={{ color: '#333333' }}>
            No employees found.
          </Typography>
        ) : (
          employees.map((employee) => (
            <Box
              key={employee.id}
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
                  {employee.role} • {employee.shift}
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ color: '#333333' }}>
                {employee.isWorking ? 'Active' : 'Inactive'}
              </Typography>
            </Box>
          ))
        )}
      </Box>
    </Box>
  );
}
