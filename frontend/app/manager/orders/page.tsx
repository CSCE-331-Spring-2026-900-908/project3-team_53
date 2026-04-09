'use client';

import { useState } from 'react';
import Box from '@mui/material/Box';
import Calendar from '@/components/orders/Calendar';
import DayOrderList from '@/components/orders/DayOrderList';

export default function ManagerOrdersPage() {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  return (
    <Box sx={{ display: 'flex', gap: 4, p: 4 }}>
      <Calendar onDateSelect={setSelectedDate} />
      <DayOrderList date={selectedDate} />
    </Box>
  );
}
