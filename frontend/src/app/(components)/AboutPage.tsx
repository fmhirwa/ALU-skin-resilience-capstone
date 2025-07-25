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

      {/* 2 - Model explanation ---------------------------------------- }
      <Typography variant="h5" sx={{ mt: 4 }}>2 · How the model turns inputs into a number</Typography>
      <Typography paragraph>
        Each time you tap&nbsp;<em>Refresh</em> the service-worker pulls an hour-by-hour UV and
        temperature curve for daylight hours only. A pre-trained
        gradient-boost model converts those two values into a provisional risk score between&nbsp;0
        and&nbsp;100. Because lighter skin is more vulnerable, the score is then shifted upward by
        up to 30 points depending on the tone you selected. The final score never leaves your
        device and is discarded when you close the tab.
      </Typography>*/}
      {/* 2 · How the model turns inputs into a number */}
        <Typography variant="h5" sx={{ mt: 4, mb: 1 }}>2 · How the model turns inputs into a number</Typography>

        {/* 2.1 Model Training*/}
        <Typography paragraph>
          Each day we fetch hourly UV and temperature data from the API. 
          For the model training, we use ERA 5 data in Grib format. 
          We convert raw Kelvin readings to Celsius, then derive relative humidity (RH%) using the Arden Buck formula:
         
          <Box component="span" sx={{ fontStyle: 'italic' }}>
            RH% = 100 × exp((17.625·Td)/(243.04+Td) − (17.625·T)/(243.04+T))
          </Box>. 
          This gives us a single, interpretable humidity measure per hour.
        </Typography>

        {/* 2.2 Feature engineering */}
        <Typography paragraph>
          After filtering out nighttime hours (where UV = 0), we compute key features:
        </Typography>
        <ul>
          <li><b>uv_load_j</b>: total UV exposure (sum of short-wave radiation)</li>
          <li><b>temp_day_mean</b>: mean daytime temperature</li>
          <li><b>rh_day_mean</b>: mean daytime relative humidity</li>
          <li><b>uv_temp_combo</b>: uv_load_j × temp_day_mean</li>
          <li><b>season_sin/cos</b>: cyclical encoding of the day of year</li>
        </ul>

        {/* 2.3 Model train/test */}
        <Typography paragraph>
          We train a gradient-boosting model (XGBoost) with 5-fold cross-validation on historical data (Nairobi July 2024; 30 days),
          tuning hyperparameters via Optuna. The final model is exported to as <code>skin_uv_model.pkl</code> to be used in the backend.
        </Typography>

        {/* 2.4 On-device inference */}
        <Typography paragraph>
          At runtime, tapping “Refresh” runs the model locally on your browser:
          <>
            <li>Fetch today’s UV & temperature curve.</li>
            <li>Compute provisional risk score (0–100).</li>
            <li>Shift by up to 30% points for lighter skin tones.</li>
            <li>Bucket into Low (0–40), Moderate (41–80) or High (81–100).</li>
          </>
          No intermediate data ever leaves your device, and everything is discarded when you close the tab.
        </Typography>


      {/* 3 - Risk spectrum -------------------------------------------- */}
      <Typography variant="h5" sx={{ mt: 4 }}>3 · What the risk spectrum means</Typography>
      <Stack direction="row" sx={{ width: '100%', height: 24, borderRadius: 2, overflow: 'hidden' }}>
        {[
          { label: 'Low',        colour: '#4caf50' },
          { label: 'Moderate',   colour: '#ffb300' },
          { label: 'High',       colour: '#e65100' },
        ].map(({ label, colour }) => (
          <Box key={label} sx={{ flex: 1, bgcolor: colour, display:'flex', justifyContent:'center', alignItems:'center' }}>
            <Typography variant="caption" sx={{ color:'#fff', fontWeight:500 }}>{label}</Typography>
          </Box>
        ))}
      </Stack>
      <Typography variant="caption">
        Scores 0-30 Low · 31-70 Moderate · 71-100 High
      </Typography>
              <Typography
          component="ul"
          variant="body2"
          sx={{
            pl: 2,
            '& li': { mb: 1 },
            listStyleType: 'disc',
          }}
        >
          <li>
            <strong>Low (0–30):</strong> UV exposure is mild—only minimal cumulative damage over time.  
            A lightweight SPF 15 moisturizer is generally enough for quick errands or brief outdoor breaks.
          </li>
          <li>
            <strong>Moderate (31–70):</strong> UV intensity can speed up skin aging and burn risk.  
            Use SPF 30 or higher, reapply every two hours, and consider protective accessories like hats or sunglasses.
          </li>
          <li>
            <strong>High (71–100):</strong> Significant risk of immediate and long-term skin damage.  
            Apply SPF 50+, cover up with long sleeves and wide-brim hats, and seek shade, especially between 11 am–3 pm.
          </li>
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
        <Typography component="ul"
          variant="body2"
          sx={{
            pl: 2,
            '& li': { mb: 1 },
            listStyleType: 'disc',
          }}>
          <li>
            <strong>Light skin (low melanin):</strong>  Natural protection ~SPF 5–8. At low risk, use SPF 30; at moderate risk, SPF 50; at high risk, SPF 50+.
          </li>
          <li>
            <strong>Medium skin (medium melanin):</strong> Natural protection ~SPF 8–10. At low risk, use SPF 15; at moderate risk, SPF 30; at high risk, SPF 30–50.
          </li>
          <li>
            <strong>Dark skin (high melanin):</strong> Natural protection ~SPF 10–13. At low risk, SPF 15 is sufficient; at moderate risk, SPF 30; at high risk, SPF 30–50.
          </li>
           <li>
            <strong>Deep skin (very high melanin)</strong>  Natural protection ~SPF 13. At low risk, SPF 15; at moderate risk, SPF 15–30; at high risk, SPF 30.
          </li>
      </Typography>

      <Typography variant="body2" color="text.secondary" paragraph>
        No data is saved on the server.
      </Typography>
    </Container>
  );
}
