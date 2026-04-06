'use client';

import { useState, useEffect } from 'react';
import { 
  Box, Button, Typography, Tabs, Tab, Table, TableBody, 
  TableCell, TableContainer, TableHead, TableRow, Paper, 
  TextField, Dialog, DialogTitle, DialogContent, DialogActions, IconButton 
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
fetch('/api/employees');

// --- Types ---
interface Employee {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  salary: number;
  schedule: string;
}

interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  date: string;
  total: number;
  items: string;
}

export default function ManagerDashboard() {
  const [activeTab, setActiveTab] = useState(0);
  
  // Data States
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  // Modal States
  const [openEmpModal, setOpenEmpModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  // Inside your component
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    phone: '',
    role: '',
    salary: 0
  });

  // Update the state whenever an input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };

  // --- Fetching Data ---
  useEffect(() => {
    fetchEmployees();
    fetchInventory();
  }, []);

  const fetchEmployees = () => fetch('/api/employees').then(res => res.json()).then(setEmployees);
  const fetchInventory = () => fetch('/api/inventory').then(res => res.json()).then(setInventory);
  
  const fetchOrdersByDate = (date: string) => {
    fetch(`/api/orders?date=${date}`).then(res => res.json()).then(setOrders);
  };

  useEffect(() => {
    fetchOrdersByDate(selectedDate);
  }, [selectedDate]);

  // --- Employee Actions ---
  const handleSaveEmployee = async () => {

    const method = editingEmployee ? 'PUT' : 'POST';
    await fetch('/api/employees', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formState),
    });
    setOpenEmpModal(false);
    fetchEmployees();
  };

  const handleFireEmployee = async (id: string) => {
    if (confirm("Are you sure you want to fire this employee?")) {
      await fetch(`/api/employees?id=${id}`, { method: 'DELETE' });
      fetchEmployees();
    }
  };

  return (
    <Box sx={{ p: 4, backgroundColor: '#f7f7f7', minHeight: '100vh' }}>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>Manager Portal</Typography>

      <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)} sx={{ mb: 4 }}>
        <Tab label="Employees" />
        <Tab label="Inventory" />
        <Tab label="Order History" />
      </Tabs>

      {/* --- TASK 1: EMPLOYEE MANAGEMENT --- */}
      {activeTab === 0 && (
        <Box>
          <Button variant="contained" sx={{ mb: 2 }} onClick={() => { setEditingEmployee(null); setOpenEmpModal(true); }}>
            Hire New Employee
          </Button>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Contact</TableCell>
                  <TableCell>Salary</TableCell>
                  <TableCell>Schedule</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {employees.map((emp) => (
                  <TableRow key={emp.id}>
                    <TableCell sx={{ fontWeight: 600 }}>{emp.name}</TableCell>
                    <TableCell>{emp.role}</TableCell>
                    <TableCell>{emp.email}<br/>{emp.phone}</TableCell>
                    <TableCell>${emp.salary}/hr</TableCell>
                    <TableCell>{emp.schedule}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => { setEditingEmployee(emp); setOpenEmpModal(true); }}><EditIcon /></IconButton>
                      <IconButton color="error" onClick={() => handleFireEmployee(emp.id)}><DeleteIcon /></IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}

      {/* --- TASK 2: INVENTORY MANAGEMENT --- */}
      {activeTab === 1 && (
        <Box>
           <Typography variant="h6" sx={{ mb: 2 }}>Stock Control</Typography>
           <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Item Name</TableCell>
                  <TableCell>Stock Level</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {inventory.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>
                      <Typography color={item.quantity < 10 ? 'error' : 'inherit'}>
                        {item.quantity} units
                      </Typography>
                    </TableCell>
                    <TableCell>${item.price}</TableCell>
                    <TableCell>
                      <Button size="small" variant="outlined">Restock</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}

      {/* --- TASK 3: ORDER HISTORY --- */}
      {activeTab === 2 && (
        <Box>
          <TextField 
            label="Select Date" 
            type="date" 
            value={selectedDate} 
            onChange={(e) => setSelectedDate(e.target.value)}
            sx={{ mb: 3 }}
            InputLabelProps={{ shrink: true }}
          />
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Order ID</TableCell>
                  <TableCell>Items</TableCell>
                  <TableCell>Total</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.length > 0 ? orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>#{order.id}</TableCell>
                    <TableCell>{order.items}</TableCell>
                    <TableCell>${order.total.toFixed(2)}</TableCell>
                  </TableRow>
                )) : (
                  <TableRow><TableCell colSpan={3} align="center">No orders found for this date.</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}

      {/* Hire/Edit Employee Modal */}
      <Dialog open={openEmpModal} onClose={() => setOpenEmpModal(false)}>
        <DialogTitle>{editingEmployee ? 'Edit Employee' : 'Hire New Employee'}</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          <TextField name="name" label="Full Name" value={formState.name} onChange={handleInputChange} fullWidth />
          <TextField name="email" label="Email" value={formState.email} onChange={handleInputChange} fullWidth  />
          <TextField name="phone" label="Phone" value={formState.phone} onChange={handleInputChange} fullWidth />
          <TextField name="role" label="Role" value={formState.role} onChange={handleInputChange} fullWidth />
          <TextField name="salary" label="Salary ($/hr)" type="number" value={formState.salary} onChange={handleInputChange} fullWidth />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEmpModal(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveEmployee}>Save Employee</Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
}

/*'use client';

import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

//const sampleEmployees = [
//  { name: 'Taylor Nguyen', role: 'Shift Lead', status: 'Active' },
//  { name: 'Morgan Lee', role: 'Barista', status: 'Active' },
//  { name: 'Casey Patel', role: 'Cashier', status: 'On Leave' },
//];

export default function ManagerEmployeesPage() {
  // Stores employees fetched from the API
  const [employees, setEmployees] = useState<Array<{ id: string; name: string; role: string; isWorking: string }>>([]);

  // Fetch employees when the component mounts
  useEffect(() => {
    fetch('/api/employees')
      .then((response) => response.json())
      .then((data) => setEmployees(data));
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
        {employees.map((employee) => (
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
                {employee.role}
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: '#333333' }}>
              {employee.isWorking}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}*/
