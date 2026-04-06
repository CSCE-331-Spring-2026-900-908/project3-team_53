import { NextResponse } from 'next/server';

let inventory = [
  { id: '1', name: 'Espresso Beans', quantity: 5, price: 15.00 },
  { id: '2', name: 'Oat Milk', quantity: 24, price: 4.50 },
];

export async function GET() {
  return NextResponse.json(inventory);
}

export async function PUT(request: Request) {
  const body = await request.json();
  // Logic to update quantity or price in your database
  return NextResponse.json({ message: 'Inventory updated' });
}