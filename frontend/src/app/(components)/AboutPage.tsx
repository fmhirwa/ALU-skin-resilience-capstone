// src/app/about/page.tsx
'use client';

import React from 'react';
import Container  from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box        from '@mui/material/Box';
import Divider    from '@mui/material/Divider';
import Stack      from '@mui/material/Stack';

export default function AboutPage() {
  return (
    <Container sx={{ py: 4, maxWidth: 'md' }}>
      <Typography variant="h4" gutterBottom>
        What’s going on here?
      </Typography>

      {/* 1 - Data we use ------------------------------------------------ */}
      <Typography variant="h5" sx={{ mt: 4 }}>1 · Data we use</Typography>
      <Typography paragraph>
        The app needs only three inputs. Your city-level location comes from the browser’s
        GPS and is rounded so no street address leaves your phone. Next we download today’s
        <i> ultraviolet energy and air temperature</i> from the open-access&nbsp;Open-Meteo service.
        Finally, you tell us your <i>natural skin tone</i> in the profile sheet. 
      </Typography>

      {/* 2 - Model explanation ---------------------------------------- */}
      <Typography variant="h5" sx={{ mt: 4 }}>2 · How the model turns inputs into a number</Typography>
      <Typography paragraph>
        Each time you tap&nbsp;<em>Refresh</em> the service-worker pulls an hour-by-hour UV and
        temperature curve for daylight hours only. A pre-trained
        gradient-boost model converts those two values into a provisional risk score between&nbsp;0
        and&nbsp;100. Because lighter skin is more vulnerable, the score is then shifted upward by
        up to 30 points depending on the tone you selected. The final score never leaves your
        device and is discarded when you close the tab.
      </Typography>

      {/* 3 - Risk spectrum -------------------------------------------- */}
      <Typography variant="h5" sx={{ mt: 4 }}>3 · What the risk spectrum means</Typography>
      <Stack direction="row" sx={{ width: '100%', height: 24, borderRadius: 2, overflow: 'hidden' }}>
        {[
          { label: 'Low',        colour: '#4caf50' },
          { label: 'Guarded',    colour: '#8bc34a' },
          { label: 'Moderate',   colour: '#ffb300' },
          { label: 'High',       colour: '#e65100' },
          { label: 'Very High',  colour: '#b71c1c' }
        ].map(({ label, colour }) => (
          <Box key={label} sx={{ flex: 1, bgcolor: colour, display:'flex', justifyContent:'center', alignItems:'center' }}>
            <Typography variant="caption" sx={{ color:'#fff', fontWeight:500 }}>{label}</Typography>
          </Box>
        ))}
      </Stack>
      <Typography variant="caption">
        Scores 0-20 Low · 21-40 Guarded · 41-60 Moderate · 61-80 High · 81-100 Very High
      </Typography>

      {/* 4 - Skin-tone guide ------------------------------------------ */}
      <Typography variant="h5" sx={{ mt: 4 }}>4 · Skin-tone guide and baseline SPF - Sun Protection Factor</Typography>
      <Stack direction="row" sx={{ width: '100%', height: 32, borderRadius: 2, overflow: 'hidden' }}>
        {[
          { label: 'Light',  colour: '#f4d8c6', spf: 'SPF 50' },
          { label: 'Medium', colour: '#d9a484', spf: 'SPF 30-50' },
          { label: 'Dark',   colour: '#8d5524', spf: 'SPF 30' },
          { label: 'Deep',   colour: '#5d4033', spf: 'SPF 15-30' }
        ].map(({ label, colour, spf }) => (
          <Box key={label} sx={{ flex: 1, bgcolor: colour, display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center' }}>
            <Typography variant="caption" sx={{ fontWeight:600 }}>{label}</Typography>
            <Typography variant="caption">{spf}</Typography>
          </Box>
        ))}
      </Stack>

      <Divider sx={{ my: 4 }} />

      <Typography variant="body2" color="text.secondary" paragraph>
        No data is saved on the server.
      </Typography>
    </Container>
  );
}
