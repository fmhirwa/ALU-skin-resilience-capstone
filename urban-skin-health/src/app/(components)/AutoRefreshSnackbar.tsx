'use client';
import React, { useEffect, useState } from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { useData } from '../(providers)/data-provider';

export default function AutoRefreshSnackbar() {
  const { lastUpdated, error } = useData();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (lastUpdated || error) setOpen(true);
  }, [lastUpdated, error]);

  const handleClose = () => setOpen(false);

  return (
    <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
      {error
        ? <Alert severity="error" onClose={handleClose}>{error}</Alert>
        : <Alert severity="success" onClose={handleClose}>Data updated</Alert>}
    </Snackbar>
  );
}
