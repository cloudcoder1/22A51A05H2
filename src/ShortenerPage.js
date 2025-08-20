import React, { useState } from 'react';
import { TextField, Button, Grid, Typography, Paper } from '@mui/material';
import { isValidUrl, isValidShortcode, generateShortcode } from './utils';
import { getUrls, saveUrl } from './storage';
import { logEvent } from './loggingMiddleware';

const MAX_URLS = 5;

function ShortenerPage() {
  const [inputs, setInputs] = useState([{ url: '', validity: '', shortcode: '' }]);
  const [results, setResults] = useState([]);
  const [errors, setErrors] = useState([]);

  const handleChange = (idx, field, value) => {
    const newInputs = [...inputs];
    newInputs[idx][field] = value;
    setInputs(newInputs);
  };

  const addInput = () => {
    if (inputs.length < MAX_URLS) setInputs([...inputs, { url: '', validity: '', shortcode: '' }]);
  };

  const removeInput = (idx) => {
    setInputs(inputs.filter((_, i) => i !== idx));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urls = getUrls();
    const existingCodes = new Set(Object.keys(urls));
    const newResults = [];
    const newErrors = [];

    inputs.forEach((input, idx) => {
      const { url, validity, shortcode } = input;
      let error = '';
      if (!isValidUrl(url)) error = 'Invalid URL format.';
      else if (validity && (!/^\d+$/.test(validity) || parseInt(validity) <= 0)) error = 'Validity must be a positive integer.';
      else if (shortcode && !isValidShortcode(shortcode)) error = 'Shortcode must be 4-12 alphanumeric chars.';
      else if (shortcode && existingCodes.has(shortcode)) error = 'Shortcode already exists.';
      if (error) {
        newErrors[idx] = error;
        return;
      }
      let code = shortcode || generateShortcode(existingCodes);
      existingCodes.add(code);
      const now = new Date();
      const validMins = validity ? parseInt(validity) : 30;
      const expiry = new Date(now.getTime() + validMins * 60000);
      const data = {
        url,
        shortcode: code,
        created: now.toISOString(),
        expiry: expiry.toISOString(),
        clicks: 0,
      };
      saveUrl(code, data);
      logEvent('shorten', { ...data });
      newResults[idx] = data;
      newErrors[idx] = '';
    });

    setResults(newResults);
    setErrors(newErrors);
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>Shorten URLs</Typography>
      <form onSubmit={handleSubmit}>
        {inputs.map((input, idx) => (
          <Grid container spacing={2} alignItems="center" key={idx} sx={{ mb: 1 }}>
            <Grid item xs={4}>
              <TextField
                label="Long URL"
                value={input.url}
                onChange={e => handleChange(idx, 'url', e.target.value)}
                fullWidth
                required
                error={!!errors[idx]}
              />
            </Grid>
            <Grid item xs={2}>
              <TextField
                label="Validity (min)"
                value={input.validity}
                onChange={e => handleChange(idx, 'validity', e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                label="Custom Shortcode"
                value={input.shortcode}
                onChange={e => handleChange(idx, 'shortcode', e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid item xs={2}>
              {inputs.length > 1 && (
                <Button color="error" onClick={() => removeInput(idx)}>Remove</Button>
              )}
            </Grid>
            <Grid item xs={12}>
              {errors[idx] && <Typography color="error">{errors[idx]}</Typography>}
            </Grid>
          </Grid>
        ))}
        <Button onClick={addInput} disabled={inputs.length >= MAX_URLS}>Add URL</Button>
        <Button type="submit" variant="contained" sx={{ ml: 2 }}>Shorten</Button>
      </form>
      {results.length > 0 && (
        <Paper sx={{ mt: 3, p: 2 }}>
          <Typography variant="h6">Shortened URLs</Typography>
          {results.map((res, idx) => res && (
            <div key={idx}>
              <Typography>
                <b>Short URL:</b> <a href={`/${res.shortcode}`}>{window.location.origin}/{res.shortcode}</a>
              </Typography>
              <Typography>
                <b>Expires:</b> {new Date(res.expiry).toLocaleString()}
              </Typography>
            </div>
          ))}
        </Paper>
      )}
    </Paper>
  );
}

export default ShortenerPage;