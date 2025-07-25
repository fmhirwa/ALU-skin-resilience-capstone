// src/app/page.tsx
'use client';

import React from 'react';
//import dynamic from 'next/dynamic';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import LocationBanner from './(components)/LocationBanner';
import RiskCard from './(components)/RiskCard';
import LiveConditionsCard from './(components)/LiveConditionsCard';
import AboutPage from './(components)/AboutPage';
import RecommendationCard from './(components)/RecommendationCard';
import AutoRefreshSnackbar from './(components)/AutoRefreshSnackbar';

// Dynamically import the header as a client-only component
//const ClientAppBar = dynamic(
//  () => import('./(components)/ClientAppBar'),
//  { ssr: false }
//); DIscarded/hydration error

export default function Home() {
  return (
    <>
      {/* Client-only header */}
      {/*<ClientAppBar />*/}

      <LocationBanner />

      <Container sx={{ py: 3 }}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 4 }}>
            <RiskCard />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <LiveConditionsCard />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <RecommendationCard />
          </Grid>
           </Grid><Grid size={{ xs: 12, md: 8 }}>
            <AboutPage />
          </Grid>
      </Container>

      <AutoRefreshSnackbar />

      <Typography
        variant="caption"
        display="block"
        textAlign="center"
        sx={{ mt: 4, mb: 2, opacity: 0.7 }}
      >
        Data is refreshed automatically every 30 minutes. Always consult a dermatologist for personalised advice.
      </Typography>
    </>
  );
}
