'use client';
import React, { useState } from 'react';
import Chip from '@mui/material/Chip';
import EditIcon from '@mui/icons-material/EditLocationAlt';
import SaveIcon from '@mui/icons-material/Check';
import TextField from '@mui/material/TextField';
import { useSettings } from '../(providers)/settings-provider';

export default function LocationBanner() {
  const { location, set } = useSettings();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState('');

  const save = () => {
    /* naive geocoding via Nominatim; replace with Places API */
    fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(draft)}&format=json&limit=1`)
      .then(r => r.json())
      .then((arr: any[]) => {
        if (arr[0]) {
          const { lat, lon, display_name } = arr[0];
          set({ location: { lat: +lat, lon: +lon, city: display_name } });
        }
        setEditing(false);
      });
  };

  if (editing) {
    return (
      <div className="px-4 py-2">
        <TextField
          fullWidth
          size="small"
          autoFocus
          value={draft}
          onChange={e => setDraft(e.target.value)}
          placeholder="Enter city or address"
          InputProps={{
            endAdornment: <SaveIcon onClick={save} className="cursor-pointer" />
          }}
        />
      </div>
    );
  }

  return (
    <Chip
      icon={<EditIcon />}
      label={location?.city || 'Fetching location…'}
      onClick={() => setEditing(true)}
      className="mx-4 my-2"
      variant="outlined"
      color="primary"
    />
  );
}
