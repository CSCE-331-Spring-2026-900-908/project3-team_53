import React from 'react'
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

export default function Home() {
  return (
    <>
      <Grid container spacing={2} justifyContent="center" alignItems="center" height="100vh">
        <Grid sx={{ textAlign: 'center', component: 'div' }}>
          <Typography variant="h1">Hello World</Typography>
        </Grid>
        <Grid sx={{ textAlign: 'center', component: 'div' }}>
          <Button variant="contained" color="primary">Click me</Button>
        </Grid>
      </Grid>  
    </>
  );
}
