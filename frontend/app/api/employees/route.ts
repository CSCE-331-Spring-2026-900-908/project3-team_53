import { NextResponse } from 'next/server';

// Mock database (In a real app, you'd use: const employees = await prisma.employee.findMany())
let employees = [
  { id: '1', name: 'Taylor Nguyen', role: 'Shift Lead', email: 'taylor@cafe.com', phone: '555-0101', salary: 22, schedule: 'Mon-Fri' },
];

// GET: Fetch all employees
export async function GET() {
  return NextResponse.json(employees);
}

// POST: Hire a new employee
export async function POST(request: Request) {
  const body = await request.json();
  const newEmployee = {
    ...body,
    id: Math.random().toString(36).substring(7), // Generate a random ID
  };
  employees.push(newEmployee);
  return NextResponse.json(newEmployee, { status: 201 });
}

// DELETE: Fire an employee (Used via /api/employees?id=123)
export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  employees = employees.filter(emp => emp.id !== id);
  return NextResponse.json({ message: 'Employee removed' });
}