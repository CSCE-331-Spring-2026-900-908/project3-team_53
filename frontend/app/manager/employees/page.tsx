'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Get, Post, Patch, Delete } from '@/utils/apiService';

interface Employee {
  id: number;
  name: string;
  role: string;
  shift: string;
  isWorking: boolean;
  wage: number;
  email: string;
}

const defaultEmployee: Omit<Employee, 'id'> = {
  name: '',
  role: '',
  shift: 'morning',
  isWorking: true,
  wage: 0,
  email: '',
};

export default function ManagerEmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [formState, setFormState] = useState<Omit<Employee, 'id'>>(defaultEmployee);

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

  const openAddDialog = () => {
    setEditingEmployee(null);
    setFormState(defaultEmployee);
    setDialogOpen(true);
  };

  const openEditDialog = (employee: Employee) => {
    setEditingEmployee(employee);
    setFormState({
      name: employee.name,
      role: employee.role,
      shift: employee.shift,
      isWorking: employee.isWorking,
      wage: employee.wage,
      email: employee.email,
    });
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setEditingEmployee(null);
    setFormState(defaultEmployee);
  };

  const handleFieldChange = (field: keyof Omit<Employee, 'id'>, value: string | boolean | number) => {
    setFormState((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    if (!formState.name.trim() || !formState.role.trim()) {
      return;
    }

    if (editingEmployee) {
      try {
        const updatedEmployee = await Patch(`/employees/${editingEmployee.id}`, {
          name: formState.name.trim(),
          role: formState.role.trim(),
          shift: formState.shift,
          isWorking: formState.isWorking,
          wage: formState.wage,
          email: formState.email,
        });

        setEmployees((current) =>
          current.map((employee) =>
            employee.id === editingEmployee.id
              ? updatedEmployee
              : employee
          )
        );
      } catch (error) {
        console.error('Failed to update employee:', error);
      }
      closeDialog();
      return;
    }

    try {
      const newEmployee = await Post('/employees', {
        name: formState.name.trim(),
        role: formState.role.trim(),
        shift: formState.shift,
        isWorking: formState.isWorking,
        wage: formState.wage,
        email: formState.email,
      });

      setEmployees((current) => [...current, newEmployee]);
      closeDialog();
    } catch (error) {
      console.error('Failed to create employee:', error);
    }
  };

  const handleRemove = async (employeeId: number, employeeName: string) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete '${employeeName}'?`);
    if (!confirmDelete) {
      return;
    }

    try {
      await Delete(`/employees/${employeeId}`);
      setEmployees((current) => current.filter((employee) => employee.id !== employeeId));
    } catch (error) {
      console.error('Failed to delete employee:', error);
    }
  };

  return (
    <Box sx={{ minHeight: '80vh', px: 4, py: 6, backgroundColor: '#f7f7f7', color: '#000000' }}>
      <Typography variant="h3" component="h1" sx={{ fontWeight: 700, mb: 2, color: '#000000' }}>
        Employee Management
      </Typography>
      <Typography variant="body1" sx={{ color: '#000000', mb: 4, maxWidth: 820 }}>
        View your team, update roles, and manage employee availability.
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 4 }}>
        <Button variant="contained" onClick={openAddDialog}>
          Add Employee
        </Button>
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
                <Typography variant="body2" sx={{ color: '#666666', mb: 1 }}>
                  {employee.role === 'manager' ? 'Manager' : 'Employee'} • {employee.shift}
                </Typography>
                <Typography variant="body2" sx={{ color: '#666666', mb: 1 }}>
                  {employee.email}
                </Typography>
              </Box>
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography variant="body2" sx={{ color: employee.isWorking ? '#117a00' : '#a00' }}>
                  {employee.isWorking ? 'Active' : 'Inactive'}
                </Typography>
                <IconButton aria-label="Edit employee" onClick={() => openEditDialog(employee)}>
                  <EditIcon />
                </IconButton>
                <IconButton aria-label="Remove employee" onClick={() => handleRemove(employee.id, employee.name)}>
                  <DeleteIcon />
                </IconButton>
              </Stack>
            </Box>
          ))
        )}
      </Box>

      <Dialog open={dialogOpen} onClose={closeDialog} fullWidth maxWidth="sm">
        <DialogTitle>{editingEmployee ? 'Edit Employee' : 'Add Employee'}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Name"
              value={formState.name}
              onChange={(event) => handleFieldChange('name', event.target.value)}
              fullWidth
            />
            <TextField
              label="Role"
              select
              value={formState.role}
              onChange={(event) => handleFieldChange('role', event.target.value)}
              fullWidth
            >
              <MenuItem value="manager">Manager</MenuItem>
              <MenuItem value="employee">Employee</MenuItem>
            </TextField>
            <TextField
              label="Shift"
              select
              value={formState.shift}
              onChange={(event) => handleFieldChange('shift', event.target.value)}
              fullWidth
            >
              <MenuItem value="Morning">Morning</MenuItem>
              <MenuItem value="Afternoon">Afternoon</MenuItem>
              <MenuItem value="Evening">Evening</MenuItem>
            </TextField>
            <TextField
              label="Email (Google account)"
              type="email"
              value={formState.email}
              onChange={(event) => handleFieldChange('email', event.target.value)}
              fullWidth
              placeholder="employee@gmail.com"
              helperText="Used for Google Sign-In authentication"
            />
            <TextField
              label="Wage"
              type="number"
              inputProps={{ min: 0, step: 0.25 }}
              value={formState.wage}
              onChange={(event) => handleFieldChange('wage', Number(event.target.value))}
              fullWidth
            />
            <FormControlLabel
              control={
                <Switch
                  checked={formState.isWorking}
                  onChange={(event) => handleFieldChange('isWorking', event.target.checked)}
                />
              }
              label={formState.isWorking ? 'Currently working' : 'Not currently working'}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
