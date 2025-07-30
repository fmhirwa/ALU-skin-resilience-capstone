'use client';
import React from 'react';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Button from '@mui/material/Button';
import { useData } from '../(providers)/data-provider';

export default function RecommendationCard() {
  const { recommendation, loading } = useData();

  // Extract SPF number from the recommendation text
  const spfMatch = recommendation?.match(/SPF\s*(\d+)/i);
  const spfValue = spfMatch ? spfMatch[1] : null;
  // Build purchase link dynamically
  const purchaseUrl = spfValue
    ? `https://www.beautyclick.co.ke/?ywcas=1&post_type=product&lang=en_US&s=sunscreen%20spf%20${spfValue}`
    : null;

  return (
    <Card className="p-6 space-y-3">
      <div className="flex items-center gap-2">
        <LightbulbIcon color="warning" />
        <Typography variant="subtitle2">Custom Recommendation</Typography>
      </div>

      <Typography variant="body1">
        {loading ? 'Loading…' : recommendation ?? '—'}
      </Typography>

      {purchaseUrl && !loading && (
        <Button
          size="small"
          variant="outlined"
          component="a"
          href={purchaseUrl}
          target="_blank"
          rel="noopener noreferrer"
          sx={{ mt: 1, textTransform: 'none' }}
        >
          🛒🛍️Purchase SPF {spfValue} Sunscreen
        </Button>
      )}

      <Accordion sx={{ mt: 2 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="body2">More tips</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body2">
            Stay hydrated, use antioxidant serum nightly, and avoid peak sun between 12-3 pm.
          </Typography>
        </AccordionDetails>
      </Accordion>
    </Card>
  );
}
