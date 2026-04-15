'use client';
import React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Image from 'next/image';
import Card from '@/components/portal/card';


export default function Home() {
  return (
    <Box
      sx={{
        backgroundColor: 'var(--color-page-bg)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        minHeight: '75vh',
        px: 2,
      }}
    >
      <Image
        src="/project_3_logo.png"
        alt="Project 3 logo"
        width={500}
        height={200}
        priority
      />
      <Typography variant="h1" sx={{ color: 'var(--color-text-black)', fontSize: '2rem', fontWeight: 'bold' }}>
        Team 53 - Project 3
      </Typography>
      <Typography variant="h2" sx={{ color: 'var(--color-text-black)', fontSize: '1.5rem', fontWeight: 'bold', mb: 2 }}>
        Boba Shop Portal
      </Typography>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
          gap: 2,
          width: '100%',
          maxWidth: 760,
          justifyItems: 'center',
        }}
      >
        <Card href="/manager">
          <Typography variant="h3" sx={{ color: 'var(--color-text-black)', fontSize: '1.5rem', fontWeight: 'bold', textAlign: 'center' }}>
            Manager Interface
          </Typography>
        </Card>
        <Card href="/cashier">
          <Typography variant="h3" sx={{ color: 'var(--color-text-black)', fontSize: '1.5rem', fontWeight: 'bold', textAlign: 'center' }}>
            Cashier Interface
          </Typography>
        </Card>
        <Card href="/customer">
          <Typography variant="h3" sx={{ color: 'var(--color-text-black)', fontSize: '1.5rem', fontWeight: 'bold', textAlign: 'center' }}>
            Customer Interface
          </Typography>
        </Card>
        <Card href="/menu">
          <Typography variant="h3" sx={{ color: 'var(--color-text-black)', fontSize: '1.5rem', fontWeight: 'bold', textAlign: 'center' }}>
            Menu Board Interface
          </Typography>
        </Card>
        <Card href="/kitchen" className="col-span-2 justify-self-center">
          <Typography variant="h3" sx={{ color: 'var(--color-text-black)', fontSize: '1.5rem', fontWeight: 'bold', textAlign: 'center' }}>
            Kitchen Interface
          </Typography>
        </Card>
      </Box>
    </Box>
  );
}
