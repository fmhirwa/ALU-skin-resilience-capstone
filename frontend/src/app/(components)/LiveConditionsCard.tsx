'use client';

import React from 'react';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import PlaceIcon from '@mui/icons-material/Place';
import ThermostatIcon from '@mui/icons-material/Thermostat';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import { useData } from '../(providers)/data-provider';
import { useSettings } from '../(providers)/settings-provider';

function colourForTemp(t: number | null) {
  if (t === null) return 'text.secondary';
  if (t < 15) return 'info.main';
  if (t < 30) return 'warning.main';
  return 'error.main';
}

function colourForUV(uv: number | null) {
  if (uv === null) return 'text.secondary';
  if (uv <= 33) return 'success.main';
  if (uv <= 66) return 'warning.main';
  return 'error.main';
}

export default function LiveConditionsCard() {
  const { weather, risk, loading } = useData();
  const { location, skinTone } = useSettings();

  if (loading) return null;

  return (
    <Card className="p-6 space-y-2">
      <Typography variant="subtitle2" gutterBottom>
        Live conditions
      </Typography>

      <Box display="flex" alignItems="center" gap={1}>
        <PlaceIcon fontSize="small" />
        {/*<Typography variant="body2">{location?.city ?? '—'}</Typography>*/}
        <Typography variant="body2">
          {location
            ? `${location.lat.toFixed(2)}, ${location.lon.toFixed(2)}`
            : '—'}
        </Typography>
      </Box>

      <Box display="flex" alignItems="center" gap={1}>
        <ThermostatIcon fontSize="small" />
        <Typography variant="body2" sx={{ color: colourForTemp(weather?.temp ?? null) }}>
          {weather?.temp ?? '—'} °C
        </Typography>
      </Box>

      <Box display="flex" alignItems="center" gap={1}>
        <WbSunnyIcon fontSize="small" />
        <Typography variant="body2" sx={{ color: colourForUV(weather?.uv ?? null) }}>
          UV {weather?.uv ?? '—'}
        </Typography>
      </Box>

      <Typography variant="body2" sx={{ mt: 2 }}>
        Based on today’s UV and your <b>{skinTone}</b> complexion, your short‑term risk is&nbsp;
        <b>{risk ?? '—'}</b>
      </Typography>
    </Card>
  );
}