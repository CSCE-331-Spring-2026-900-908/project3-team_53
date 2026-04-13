'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Link from 'next/link';
import { Get, Patch, postFormData } from '@/utils/apiService';
import { publicAssetUrl } from '@/utils/publicAssetUrl';
import type { MenuItem } from '@/types/menuboard';

type ItemForm = {
  name: string;
  category: string;
  price: string;
  available: boolean;
};

function formFromItem(item: MenuItem): ItemForm {
  return {
    name: item.name,
    category: item.category,
    price: Number(item.price).toFixed(2),
    available: item.available,
  };
}

export default function ManagerMenuPage() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [forms, setForms] = useState<Record<number, ItemForm>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploadingId, setUploadingId] = useState<number | null>(null);
  const [savingId, setSavingId] = useState<number | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const loadMenu = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await Get('/menu-items?includeUnavailable=true');
      if (Array.isArray(data)) {
        const list = data as MenuItem[];
        setItems(list);
        setForms(
          Object.fromEntries(list.map((i) => [i.id, formFromItem(i)])),
        );
      } else {
        setError('Unexpected response from server.');
      }
    } catch {
      setError('Could not load menu items.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMenu();
  }, [loadMenu]);

  const updateForm = (id: number, patch: Partial<ItemForm>) => {
    setForms((prev) => ({
      ...prev,
      [id]: { ...prev[id], ...patch },
    }));
  };

  const saveItem = async (id: number) => {
    const f = forms[id];
    if (!f) return;
    const priceNum = parseFloat(f.price);
    if (Number.isNaN(priceNum) || priceNum < 0) {
      setStatusMessage('Enter a valid price (non-negative number).');
      return;
    }
    setStatusMessage(null);
    setSavingId(id);
    try {
      const updated = (await Patch(`/menu-items/${id}`, {
        name: f.name.trim(),
        category: f.category.trim(),
        price: priceNum,
        available: f.available,
      })) as MenuItem;
      setItems((prev) => prev.map((row) => (row.id === id ? updated : row)));
      setForms((prev) => ({ ...prev, [id]: formFromItem(updated) }));
      setStatusMessage(`Saved “${updated.name}”.`);
    } catch {
      setStatusMessage('Could not save changes.');
    } finally {
      setSavingId(null);
    }
  };

  const onFileSelected = async (id: number, file: File | undefined) => {
    if (!file) return;
    setStatusMessage(null);
    setUploadingId(id);
    try {
      const formData = new FormData();
      formData.append('image', file);
      const updated = (await postFormData(
        `/menu-items/${id}/image`,
        formData,
      )) as MenuItem;
      setItems((prev) => prev.map((row) => (row.id === id ? updated : row)));
      setForms((prev) => ({ ...prev, [id]: formFromItem(updated) }));
      setStatusMessage(`Image updated for “${updated.name}”.`);
    } catch {
      setStatusMessage(
        'Image upload failed. Use JPEG, PNG, GIF, or WebP under 5 MB.',
      );
    } finally {
      setUploadingId(null);
    }
  };

  return (
    <Box sx={{ minHeight: '80vh', px: 4, py: 6, backgroundColor: '#f7f7f7', color: '#000000' }}>
      <Typography component={Link} href="/manager" sx={{ color: '#1565c0', mb: 2, display: 'inline-block' }}>
        ← Manager dashboard
      </Typography>
      <Typography variant="h3" component="h1" sx={{ fontWeight: 700, mb: 1, color: '#000000' }}>
        Menu items
      </Typography>
      <Typography variant="body1" sx={{ color: '#333333', mb: 3, maxWidth: 820 }}>
        Edit names, categories, prices, and availability. Photos can be updated per item below.
      </Typography>

      {statusMessage && (
        <Alert
          severity={
            statusMessage.startsWith('Could not') ||
            statusMessage.startsWith('Image upload failed') ||
            statusMessage.startsWith('Enter a valid')
              ? 'error'
              : 'success'
          }
          sx={{ mb: 2, maxWidth: 960 }}
          onClose={() => setStatusMessage(null)}
        >
          {statusMessage}
        </Alert>
      )}

      {loading && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <CircularProgress size={28} />
          <Typography>Loading menu…</Typography>
        </Box>
      )}

      {!loading && error && (
        <Box sx={{ mb: 2 }}>
          <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
          <Button variant="outlined" onClick={loadMenu}>Retry</Button>
        </Box>
      )}

      {!loading && !error && (
        <Stack spacing={2} sx={{ maxWidth: 960 }}>
          {items.map((item) => {
            const f = forms[item.id];
            if (!f) return null;

            const imgSrc = publicAssetUrl(item.image);
            const busyUpload = uploadingId === item.id;
            const busySave = savingId === item.id;

            return (
              <Paper key={item.id} elevation={1} sx={{ p: 2 }}>
                <Stack
                  direction={{ xs: 'column', md: 'row' }}
                  spacing={2}
                  alignItems={{ xs: 'stretch', md: 'flex-start' }}
                >
                  <Box
                    sx={{
                      width: { xs: '100%', md: 120 },
                      maxWidth: { xs: 160, md: 120 },
                      alignSelf: { xs: 'center', md: 'flex-start' },
                    }}
                  >
                    <Box
                      sx={{
                        width: '100%',
                        aspectRatio: '1',
                        borderRadius: 1,
                        overflow: 'hidden',
                        bgcolor: '#FAF3E0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {imgSrc ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={imgSrc}
                          alt=""
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      ) : (
                        <Typography variant="caption" color="text.secondary" sx={{ px: 1, textAlign: 'center' }}>
                          No image
                        </Typography>
                      )}
                    </Box>
                    <Button
                      fullWidth
                      size="small"
                      variant="outlined"
                      component="label"
                      disabled={busyUpload || busySave}
                      sx={{ mt: 1 }}
                    >
                      {busyUpload ? 'Uploading…' : 'Change image'}
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/gif,image/webp"
                        hidden
                        disabled={busyUpload || busySave}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          void onFileSelected(item.id, file);
                          e.target.value = '';
                        }}
                      />
                    </Button>
                  </Box>

                  <Stack spacing={1.5} sx={{ flex: 1, minWidth: 0, width: '100%' }}>
                    <TextField
                      label="Name"
                      size="small"
                      fullWidth
                      value={f.name}
                      onChange={(e) => updateForm(item.id, { name: e.target.value })}
                      disabled={busySave}
                    />
                    <TextField
                      label="Category"
                      size="small"
                      fullWidth
                      value={f.category}
                      onChange={(e) => updateForm(item.id, { category: e.target.value })}
                      disabled={busySave}
                    />
                    <TextField
                      label="Price"
                      size="small"
                      type="number"
                      inputProps={{ min: 0, step: 0.01 }}
                      fullWidth
                      value={f.price}
                      onChange={(e) => updateForm(item.id, { price: e.target.value })}
                      disabled={busySave}
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={f.available}
                          onChange={(e) =>
                            updateForm(item.id, { available: e.target.checked })
                          }
                          disabled={busySave}
                        />
                      }
                      label="Available to customers"
                    />
                    <Box>
                      <Button
                        variant="contained"
                        onClick={() => void saveItem(item.id)}
                        disabled={busySave || busyUpload}
                      >
                        {busySave ? 'Saving…' : 'Save item details'}
                      </Button>
                    </Box>
                  </Stack>
                </Stack>
              </Paper>
            );
          })}
        </Stack>
      )}
    </Box>
  );
}
