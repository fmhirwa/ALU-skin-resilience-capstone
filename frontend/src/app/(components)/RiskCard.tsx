'use client';
import React from 'react';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import { useData } from '../(providers)/data-provider';

export default function RiskCard() {
  const { risk, lastUpdated, loading } = useData();

  const color = risk == null ? 'grey'
    : risk <= 33 ? 'var(--risk-low)'
    : risk <= 66 ? 'var(--risk-mid)'
    : 'var(--risk-high)';

  return (
    <Card className="p-6 flex flex-col items-center gap-4">
      <Typography variant="h6">Current Risk</Typography>
      {loading
        ? <CircularProgress />
        : <CircularProgress
            variant="determinate"
            value={risk ?? 0}
            size={120}
            style={{ color }}
            thickness={5}
          />
      }
      <Typography variant="body2" color="text.secondary">
        {lastUpdated ? `Updated ${lastUpdated.toLocaleTimeString()}` : '—'}
      </Typography>
    </Card>
  );
}
