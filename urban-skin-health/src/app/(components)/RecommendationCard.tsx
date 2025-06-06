'use client';
import React from 'react';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useData } from '../(providers)/data-provider';

export default function RecommendationCard() {
  const { recommendation, loading } = useData();

  return (
    <Card className="p-6 space-y-3">
      <div className="flex items-center gap-2">
        <LightbulbIcon color="warning" />
        <Typography variant="subtitle2">Your Recommendation</Typography>
      </div>

      <Typography variant="body1">
        {loading ? 'Loading…' : recommendation ?? '—'}
      </Typography>

      <Accordion sx={{ mt: 2 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="body2">More tips</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body2">
            Stay hydrated, use antioxidant serum nightly, and avoid peak sun between 12-3 pm.
            {/* Static for MVP; replace with API-driven list */}
          </Typography>
        </AccordionDetails>
      </Accordion>
    </Card>
  );
}
