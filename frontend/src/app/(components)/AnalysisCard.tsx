'use client';
import React from 'react';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PlaceIcon from '@mui/icons-material/Place';
//import ThermostatIcon from '@mui/icons-material/Thermostat';
import { useData } from '../(providers)/data-provider';
import { useSettings } from '../(providers)/settings-provider';

export default function AnalysisCard(){
  const { risk, loading } = useData();
  const { location, skinTone } = useSettings();

  if(loading) return null;

  return(
    <Card className="p-6 space-y-3">
      <Typography variant="subtitle2" gutterBottom>How we got this number</Typography>
      <Typography variant="body2" className="flex items-center gap-1">
        <PlaceIcon fontSize="small"/> {location?.city ?? '—'}
      </Typography>
      <Typography variant="body2" className="flex items-center gap-1">
        <AccessTimeIcon fontSize="small"/> {new Date().toLocaleTimeString()}
      </Typography>
      <Typography variant="body2" sx={{mt:2}}>
        Based on the current UV index, your <b>{skinTone}</b> complexion and the
        time of day, your short‑term risk is&nbsp;<b>{risk}</b>.  Please follow the
        recommendation above to stay protected.
      </Typography>
    </Card>
  );
}

/*
<Typography variant="body2" className="flex items-center gap-1">
        <ThermostatIcon fontSize="small"/> {weather?.temp ?? '—'} °C &nbsp;|&nbsp; UV&nbsp;{weather?.uv ?? '—'}
      </Typography>
      
*/