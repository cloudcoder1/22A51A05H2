import React, { useEffect, useState } from 'react';
import { Paper, Typography, Table, TableBody, TableCell, TableHead, TableRow, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { getUrls, getClicks } from './storage';

function StatsPage() {
  const [urls, setUrls] = useState({});
  const [clicks, setClicks] = useState({});

  useEffect(() => {
    setUrls(getUrls());
    setClicks(getClicks());
  }, []);

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>Shortened URL Statistics</Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Short URL</TableCell>
            <TableCell>Created</TableCell>
            <TableCell>Expires</TableCell>
            <TableCell>Clicks</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Object.values(urls).map(url => (
            <TableRow key={url.shortcode}>
              <TableCell>
                <a href={`/${url.shortcode}`}>{window.location.origin}/{url.shortcode}</a>
              </TableCell>
              <TableCell>{new Date(url.created).toLocaleString()}</TableCell>
              <TableCell>{new Date(url.expiry).toLocaleString()}</TableCell>
              <TableCell>{(clicks[url.shortcode] || []).length}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Typography variant="h6" sx={{ mt: 3 }}>Click Details</Typography>
      {Object.keys(clicks).map(code => (
        <Accordion key={code}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>{window.location.origin}/{code}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Timestamp</TableCell>
                  <TableCell>Source</TableCell>
                  <TableCell>Location</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(clicks[code] || []).map((click, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{new Date(click.timestamp).toLocaleString()}</TableCell>
                    <TableCell>{click.source}</TableCell>
                    <TableCell>{click.location}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </AccordionDetails>
        </Accordion>
      ))}
    </Paper>
  );
}

export default StatsPage;