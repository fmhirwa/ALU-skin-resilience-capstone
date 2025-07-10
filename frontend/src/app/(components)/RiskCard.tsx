'use client';
import React from 'react';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { grey } from '@mui/material/colors';

import { useData } from '../(providers)/data-provider';


function riskToColour(risk: number | null): string {
/** OLD
  if (risk === null) return grey[400];
  if (risk <= 33)   return '#39c46e';   // ✔ low   (green)
  if (risk <= 66)   return '#f6c344';   // ⚠ mid   (amber)
  return '#e04b4b';                      // ✖ high  (red)
*/
  /*  CSS variables: */

  if (risk === null) return grey[400];
  if (risk <= 33)    return 'var(--risk-low)';
  if (risk <= 66)    return 'var(--risk-mid)';
  return 'var(--risk-high)';
}

/** Component -------------------------------------------------------------- */
export default function RiskCard() {
  const { risk, lastUpdated, loading } = useData();
  const colour = riskToColour(risk);

  return (
    <Card className="p-6 flex flex-col items-center gap-4 relative">
      <Typography variant="h6">Current Risk</Typography>

      {loading ? (
        <CircularProgress />
      ) : (
        <Box position="relative" display="inline-flex">
          {/* Gauge ---------------------------------------------------------- */}
          <CircularProgress
            variant="determinate"
            size={130}
            thickness={5}
            value={risk ?? 0}
            sx={{ color: colour }}
          />

          {/* Centre number -------------------------------------------------- */}
          <Box
            position="absolute"
            top={0}
            left={0}
            bottom={0}
            right={0}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Typography variant="h5" sx={{ color: colour }}>
              {risk ?? '—'}
            </Typography>
          </Box>
        </Box>
      )}

      {/* Timestamp ---------------------------------------------------------- */}
      <Typography variant="body2" color="text.secondary">
        {lastUpdated ? `Updated ${lastUpdated.toLocaleTimeString()}` : '—'}
      </Typography>
    </Card>
  );
}
