'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ThermostatIcon from '@mui/icons-material/Thermostat';
import CircularProgress from '@mui/material/CircularProgress';

const NWS_HOURLY_URL =
  'https://api.weather.gov/gridpoints/HGX/65,97/forecast/hourly';

const REFRESH_INTERVAL_MS = 15 * 60 * 1000;

interface WeatherData {
  temperature: number;
  unit: string;
  shortForecast: string;
}

export default function WeatherWidget() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchWeather = useCallback(async () => {
    try {
      const res = await fetch(NWS_HOURLY_URL, {
        headers: { 'User-Agent': 'BobaShopKiosk/1.0 (student-project)' },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const period = data?.properties?.periods?.[0];
      if (period) {
        setWeather({
          temperature: period.temperature,
          unit: period.temperatureUnit === 'F' ? '°F' : '°C',
          shortForecast: period.shortForecast,
        });
      }
    } catch {
      // silently keep previous data or stay null
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWeather();
    const id = setInterval(fetchWeather, REFRESH_INTERVAL_MS);
    return () => clearInterval(id);
  }, [fetchWeather]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <CircularProgress size={16} sx={{ color: '#636E72' }} />
        <Typography sx={{ color: '#636E72', fontSize: '0.85rem' }}>
          Loading weather...
        </Typography>
      </Box>
    );
  }

  if (!weather) return null;

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        bgcolor: '#2D3436',
        borderRadius: 3,
        px: 2,
        py: 1,
        boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
      }}
    >
      <ThermostatIcon sx={{ color: '#FF6B6B', fontSize: 22 }} />
      <Typography
        sx={{ color: '#FFFFFF', fontWeight: 700, fontSize: '0.95rem' }}
      >
        {weather.temperature}{weather.unit}
      </Typography>
      <Typography sx={{ color: '#DFE6E9', fontSize: '0.85rem' }}>
        {weather.shortForecast}
      </Typography>
      <Typography sx={{ color: '#B2BEC3', fontSize: '0.75rem', ml: 0.5 }}>
        College Station, TX
      </Typography>
    </Box>
  );
}
