'use client';

import { useState, useEffect, useCallback } from 'react';

const KCLL_OBS_URL =
  'https://api.weather.gov/stations/KCLL/observations/latest';

const REFRESH_INTERVAL_MS = 15 * 60 * 1000;

function celsiusToFahrenheit(c: number): number {
  return Math.round((c * 9) / 5 + 32);
}

export interface WeatherData {
  temperature: number;
  unit: string;
  description: string;
}

export interface UseWeatherResult {
  weather: WeatherData | null;
  loading: boolean;
}

export function useWeather(): UseWeatherResult {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchWeather = useCallback(async () => {
    try {
      const res = await fetch(KCLL_OBS_URL, {
        headers: { 'User-Agent': 'BobaShopKiosk/1.0 (student-project)' },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const props = data?.properties;
      const tempC = props?.temperature?.value;
      if (tempC != null) {
        setWeather({
          temperature: celsiusToFahrenheit(tempC),
          unit: '°F',
          description: props.textDescription ?? '',
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

  return { weather, loading };
}
