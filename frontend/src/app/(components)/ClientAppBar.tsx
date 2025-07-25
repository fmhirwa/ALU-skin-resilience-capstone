// src/app/components/ClientAppBar.tsx
'use client';

import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
//import Link from 'next/link';      
import Button from '@mui/material/Button'; 
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import RefreshIcon from '@mui/icons-material/Refresh';
import Avatar from '@mui/material/Avatar';
import ThemeToggle from '../(components)/ThemeToggle';
import { useData } from '../(providers)/data-provider';
import ProfileSheet from '../(components)/ProfileSheet';

export default function ClientAppBar() {
  const { fetchNow, loading } = useData();
  const [sheetOpen, setSheetOpen] = React.useState(false);

  return (
    <>
      <AppBar position="sticky">
        <Toolbar className="justify-between">
          <Typography variant="h6">Urban Skin Health</Typography>
              {<Button
                component= "a"
                href="https://alu-capstone-skin.onrender.com"
                target='_blank'
                color="inherit"
                sx={{ fontWeight: 500, textTransform: 'none' }}
                >
                Start Backend
            </Button>}
          <div className="flex items-center gap-1">
            <IconButton disabled={loading} onClick={fetchNow}>
              <RefreshIcon />
            </IconButton>
            <ThemeToggle />
            <Avatar
              sx={{ width: 32, height: 32, cursor: 'pointer' }}
              onClick={() => setSheetOpen(true)}
            />
          </div>
        </Toolbar>
      </AppBar>
      {/* Render the ProfileSheet here so that sheetOpen is used */}
      <ProfileSheet open={sheetOpen} onClose={() => setSheetOpen(false)} />
    </>
  );
}