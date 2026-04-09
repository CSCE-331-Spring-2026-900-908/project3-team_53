'use client';

import { useState } from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

interface CalendarProps {
  onDateSelect: (date: string) => void;
}

export default function Calendar({ onDateSelect }: CalendarProps) {
  const today = new Date();

  const [currentMonth, setCurrentMonth] = useState<number>(today.getMonth());
  const [currentYear, setCurrentYear] = useState<number>(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysOfWeek = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  // Number of days in the current month
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  // What day of the week the month starts on
  const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();

  // Build the grid
  const calendarDays = [];
  for (let i = 0; i < firstDayIndex; i++) {
    calendarDays.push(null); // empty cells
  }
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  const handleSelectDay = (day: number) => {
    const dateString = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    setSelectedDate(dateString);
    onDateSelect(dateString);
  };

  const isToday = (day: number) => {
    return (
      day === today.getDate() &&
      currentMonth === today.getMonth() &&
      currentYear === today.getFullYear()
    );
  };

  const isSelected = (day: number) => selectedDate?.endsWith(`-${String(day).padStart(2, '0')}`);

  return (
    <Box sx={{ width: 280 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <IconButton onClick={handlePrevMonth} size="small">
          <ArrowBackIosNewIcon fontSize="small" />
        </IconButton>

        <Typography variant="h6">
          {monthNames[currentMonth]} {currentYear}
        </Typography>

        <IconButton onClick={handleNextMonth} size="small">
          <ArrowForwardIosIcon fontSize="small" />
        </IconButton>
      </Box>

      {/* Days of week */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', mb: 1 }}>
        {daysOfWeek.map((d) => (
          <Typography key={d} align="center" sx={{ fontWeight: 'bold' }}>
            {d}
          </Typography>
        ))}
      </Box>

      {/* Calendar grid */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 1 }}>
        {calendarDays.map((day, idx) => {
          if (day === null) {
            return <Box key={idx} />;
          }

          const selected = isSelected(day);
          const todayFlag = isToday(day);

          return (
            <Box
              key={idx}
              onClick={() => handleSelectDay(day)}
              sx={{
                height: 40,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 1,
                cursor: 'pointer',
                backgroundColor: selected
                  ? 'primary.main'
                  : todayFlag
                  ? 'rgba(0,0,0,0.1)'
                  : 'transparent',
                color: selected ? 'white' : 'inherit',
                '&:hover': {
                  backgroundColor: selected ? 'primary.dark' : 'rgba(0,0,0,0.05)',
                },
              }}
            >
              {day}
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}
