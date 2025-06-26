'use client';
import React, { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import RefreshIcon from '@mui/icons-material/Refresh';
import Avatar from '@mui/material/Avatar';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
/*import Grid from '@mui/material/Grid';*/

import LocationBanner from './(components)/LocationBanner';
import RiskCard from './(components)/RiskCard';
import RecommendationCard from './(components)/RecommendationCard';
import ThemeToggle from './(components)/ThemeToggle';
import ProfileSheet from './(components)/ProfileSheet';
import AutoRefreshSnackbar from './(components)/AutoRefreshSnackbar';
import { useData } from './(providers)/data-provider';
import useAutoRefresh from './(hooks)/useAutoRefresh';

export default function Home() {
  const { fetchNow, loading } = useData();
  const [sheetOpen, setSheetOpen] = useState(false);

  useAutoRefresh(fetchNow);

  return (
    <>
      <AppBar position="sticky">
        <Toolbar className="justify-between">
          <span className="font-medium">Urban Skin Health</span>
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

      <LocationBanner />

      <Container sx={{ py: 3 }}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 4 }}>
            <RiskCard />
          </Grid>
          <Grid size={{ xs: 12, md: 8 }}>
            <RecommendationCard />
          </Grid>
        </Grid>
      </Container>

      <ProfileSheet open={sheetOpen} onClose={() => setSheetOpen(false)} />
      <AutoRefreshSnackbar />
    </>
  );
}
