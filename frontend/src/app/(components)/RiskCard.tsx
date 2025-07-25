// src/app/(components)/RiskCard.tsx
'use client';

import React from 'react';
import Card           from '@mui/material/Card';
import Typography     from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Box            from '@mui/material/Box';
import { grey }       from '@mui/material/colors';
import { useData }    from '../(providers)/data-provider';

/* ------------------------------------------------------------------ */
/* Helper – map score → brand colour                                  */
/* ------------------------------------------------------------------ */
const riskToColour = (risk: number | null): string => {
  if (risk === null)     return grey[400];
  if (risk <= 33)        return 'var(--risk-low)';   // green
  if (risk <= 66)        return 'var(--risk-mid)';   // amber
  return 'var(--risk-high)';                         // red
};

/* ------------------------------------------------------------------ */
/* Component                                                         */
/* ------------------------------------------------------------------ */
export default function RiskCard() {
  const { risk, lastUpdated, loading } = useData();
  const colour = riskToColour(risk);

  return (
    <Card
      sx={{
        border: 2,
        borderColor: colour,
        p: 4,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        //minHeight: 260,          // make the card visibly taller
      }}
    >
      <Typography variant="h6">Current Risk</Typography>

      {/* ---- Gauge / Spinner ---------------------------------------- */}
      {loading ? (
        <CircularProgress
          sx={{
            mt: 2,
            '& .MuiCircularProgress-circle': { color: colour },
          }}
        />
      ) : (
        <Box position="relative" display="inline-flex" mt={2}>
          <CircularProgress
            variant="determinate"
            size={140}
            thickness={5}
            value={risk ?? 0}
            sx={{ svg: { color: colour } }}   // colour the whole svg
          />

          {/* centred score */}
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
            <Typography variant="h4" sx={{ color: colour }}>
              {risk ?? '—'}
            </Typography>
          </Box>
        </Box>
      )}

      {/* ---- timestamp --------------------------------------------- */}
      <Typography variant="body2" color="text.secondary" sx={{ mt: 'auto' }}>
        {lastUpdated ? `Updated ${lastUpdated.toLocaleTimeString()}` : '—'}
      </Typography>
    </Card>
  );
}
