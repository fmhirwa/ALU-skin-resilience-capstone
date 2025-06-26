'use client';
import React from 'react';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Switch from '@mui/material/Switch';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import { useSettings } from '../(providers)/settings-provider';

export default function ProfileSheet({
  open, onClose
}: { open: boolean; onClose: () => void }) {
  const { skinTone, gender, darkMode, set } = useSettings();

  return (
    <SwipeableDrawer
      anchor="bottom" open={open} onClose={onClose} onOpen={() => undefined}
      PaperProps={{ className: 'rounded-t-2xl p-6 space-y-6' }}
    >
      <Box className="space-y-4">
        <Typography variant="h6">Profile Settings</Typography>

        {/* skin tone */}
        <div>
          <Typography variant="subtitle2" className="mb-2">Skin tone</Typography>
          <ToggleButtonGroup
            color="primary" exclusive
            value={skinTone}
            onChange={(_, v) => v && set({ skinTone: v })}
          >
            {['light', 'medium', 'dark', 'deep'].map(t => (
              <ToggleButton key={t} value={t}>{t}</ToggleButton>
            ))}
          </ToggleButtonGroup>
        </div>

        {/* gender */}
        <FormControl fullWidth>
          <InputLabel>Gender</InputLabel>
          <Select
            value={gender}
            label="Gender"
            onChange={(e: React.ChangeEvent<{ value: unknown }>) =>
              set({ gender: e.target.value as 'male' | 'female' | 'other' | 'na' })
            }
          >
            <MenuItem value="male">Male</MenuItem>
            <MenuItem value="female">Female</MenuItem>
            <MenuItem value="other">Other</MenuItem>
            <MenuItem value="na">Prefer not to say</MenuItem>
          </Select>

        </FormControl>

        <Divider />

        {/* theme */}
        <div className="flex items-center justify-between">
          <Typography variant="subtitle2">Dark mode</Typography>
          <Switch
            checked={darkMode}
            onChange={e => set({ darkMode: e.target.checked })}
          />
        </div>

        <Button variant="contained" fullWidth onClick={onClose}>Done</Button>
      </Box>
    </SwipeableDrawer>
  );
}
