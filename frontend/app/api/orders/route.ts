import { NextResponse } from 'next/server';

const mockOrders = [
  { id: '101', date: '2023-10-27', total: 15.50, items: '2x Latte, 1x Croissant' },
  { id: '102', date: '2023-10-28', total: 8.00, items: '1x Americano' },
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get('date'); // e.g., "2023-10-27"

  // Filter orders by the date provided in the frontend calendar
  const filteredOrders = mockOrders.filter(order => order.date === date);

  return NextResponse.json(filteredOrders);
}