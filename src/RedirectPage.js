import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getUrls, addClick, saveUrl } from './storage';
import { getGeolocation } from './utils';
import { logEvent } from './loggingMiddleware';
import { Typography, Paper } from '@mui/material';

function RedirectPage() {
  const { shortcode } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const urls = getUrls();
    const urlData = urls[shortcode];
    if (!urlData) {
      logEvent('redirect_fail', { shortcode, reason: 'Not found' });
      return;
    }
    const now = new Date();
    if (now > new Date(urlData.expiry)) {
      logEvent('redirect_fail', { shortcode, reason: 'Expired' });
      return;
    }
    // Log click
    const clickData = {
      timestamp: now.toISOString(),
      source: document.referrer || 'Direct',
      location: getGeolocation(),
    };
    addClick(shortcode, clickData);
    urlData.clicks = (urlData.clicks || 0) + 1;
    saveUrl(shortcode, urlData);
    logEvent('redirect', { shortcode, ...clickData });
    // Redirect
    window.location.href = urlData.url;
  }, [shortcode, navigate]);

  return (
    <Paper sx={{ p: 3, mt: 4 }}>
      <Typography variant="h6" color="error">
        Invalid or expired short URL.
      </Typography>
    </Paper>
  );
}

export default RedirectPage;