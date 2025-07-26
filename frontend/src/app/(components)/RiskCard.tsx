'use client';

import React from 'react';
import Card            from '@mui/material/Card';
import Typography      from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Box             from '@mui/material/Box';
import { grey }        from '@mui/material/colors';
import { useData }     from '../(providers)/data-provider';

const RING_SIZE   = 140;      // px
const RING_THICK  = 5;        // px

function riskColour(risk: number | null) {
  if (risk === null) return grey[400];
  if (risk <= 33)     return 'var(--risk-low)';
  if (risk <= 66)     return 'var(--risk-mid)';
  return 'var(--risk-high)';
}

export default function RiskCard() {
  const { risk, lastUpdated, loading } = useData();
  const colour = riskColour(risk);

  return (
    <Card
      sx={{
        p: 4,
        minHeight: 260,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        border: 2,
        borderColor: colour,
      }}
    >
      <Typography variant="h6" fontWeight={600}>
        Current&nbsp;Risk
      </Typography>

      {loading ? (

        <CircularProgress
          sx={{
            mt: 3,
            '& .MuiCircularProgress-circle': { stroke: colour },
          }}
        />
      ) : (
        <Box mt={3} position="relative" display="inline-flex">
          <CircularProgress
            variant="determinate"
            value={risk ?? 0}

            size={RING_SIZE}
            thickness={RING_THICK}
            sx={{
              color: colour,
              '& .MuiCircularProgress-circle': {
                strokeLinecap: 'round',
              },
            }}
          />
          {/* centred number */}
          <Box
            position="absolute"
            top={0}
            left={0}
            right={0}
            bottom={0}
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

      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ mt: 'auto' }}
      >
        {lastUpdated
          ? `Updated ${lastUpdated.toLocaleTimeString()}`
          : '—'}
      </Typography>
    </Card>
  );
}
