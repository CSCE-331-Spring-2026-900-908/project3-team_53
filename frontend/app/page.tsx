'use client';
import React, { useEffect, useState } from 'react'
import Typography from '@mui/material/Typography';
import { Get } from '@/utils/apiService';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';



export default function Home() {
  const [message, setMessage] = useState<string>("Test Message");
  return (
    <>
    <Grid container spacing={2} justifyContent="center" alignItems="center" height="100vh">
      <Grid sx={{ textAlign: 'center', component: 'div' }}>
        <Button variant="contained" color="primary" onClick={() => {
          Get("hello").then((res) => {
            setMessage(res.message);
          });
        }}>Get Message</Button>
        <Typography variant="h1">{message}</Typography>
      </Grid>
    </Grid>
    </>
  );
}
