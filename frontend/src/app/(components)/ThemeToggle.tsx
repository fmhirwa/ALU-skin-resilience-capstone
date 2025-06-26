'use client';
import React from 'react';
import IconButton from '@mui/material/IconButton';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import { useSettings } from '../(providers)/settings-provider';

export default function ThemeToggle() {
  const { darkMode, set } = useSettings();
  return (
    <IconButton
      aria-label="Toggle dark mode"
      onClick={() => set({ darkMode: !darkMode })}
    >
      {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
    </IconButton>
  );
}
