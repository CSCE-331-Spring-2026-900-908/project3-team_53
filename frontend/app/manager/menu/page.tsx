'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import DeleteIcon from '@mui/icons-material/Delete';
import Divider from '@mui/material/Divider';
import FormControlLabel from '@mui/material/FormControlLabel';
import Link from 'next/link';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { Delete, Get, Patch, Post, postFormData } from '@/utils/apiService';
import { publicAssetUrl } from '@/utils/publicAssetUrl';
import type { MenuItem } from '@/types/menuboard';

type CatalogKind = 'menu' | 'topping';
type CatalogItem = MenuItem;

type ItemForm = {
  name: string;
  category: string;
  price: string;
  available: boolean;
};

type NewItemForm = {
  name: string;
  category: string;
  price: string;
};

const EMPTY_CREATE_FORM: NewItemForm = {
  name: '',
  category: '',
  price: '',
};

function sanitizeItems(data: unknown): CatalogItem[] {
  if (!Array.isArray(data)) return [];
  return data.map((item) => {
    const record = item as Partial<CatalogItem> & { category?: string | null };
    return {
      id: Number(record.id),
      name: String(record.name ?? ''),
      category: String(record.category ?? ''),
      price: Number(record.price ?? 0),
      image: record.image ?? null,
      available: Boolean(record.available),
    };
  });
}

function formFromItem(item: CatalogItem): ItemForm {
  return {
    name: item.name,
    category: item.category ?? '',
    price: Number(item.price).toFixed(2),
    available: item.available,
  };
}

function endpointFor(kind: CatalogKind): string {
  return kind === 'menu' ? '/menu-items' : '/topping-items';
}

function labelFor(kind: CatalogKind): string {
  return kind === 'menu' ? 'menu item' : 'topping';
}

function pluralLabelFor(kind: CatalogKind): string {
  return kind === 'menu' ? 'menu items' : 'toppings';
}

function categoryLabelFor(kind: CatalogKind): string {
  return kind === 'menu' ? 'Category' : 'Category (optional)';
}

export default function ManagerMenuPage() {
  const [tab, setTab] = useState<CatalogKind>('menu');
  const [menuItems, setMenuItems] = useState<CatalogItem[]>([]);
  const [toppingItems, setToppingItems] = useState<CatalogItem[]>([]);
  const [menuForms, setMenuForms] = useState<Record<number, ItemForm>>({});
  const [toppingForms, setToppingForms] = useState<Record<number, ItemForm>>({});
  const [newMenuItem, setNewMenuItem] = useState<NewItemForm>(EMPTY_CREATE_FORM);
  const [newToppingItem, setNewToppingItem] = useState<NewItemForm>(EMPTY_CREATE_FORM);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [savingKey, setSavingKey] = useState<string | null>(null);

  const itemsByKind = useMemo(
    () => ({
      menu: menuItems,
      topping: toppingItems,
    }),
    [menuItems, toppingItems],
  );

  const formsByKind = useMemo(
    () => ({
      menu: menuForms,
      topping: toppingForms,
    }),
    [menuForms, toppingForms],
  );

  const loadCatalog = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [menuData, toppingData] = await Promise.all([
        Get('/menu-items?includeUnavailable=true'),
        Get('/topping-items?includeUnavailable=true'),
      ]);

      const normalizedMenu = sanitizeItems(menuData);
      const normalizedToppings = sanitizeItems(toppingData);

      setMenuItems(normalizedMenu);
      setToppingItems(normalizedToppings);
      setMenuForms(
        Object.fromEntries(normalizedMenu.map((item) => [item.id, formFromItem(item)])),
      );
      setToppingForms(
        Object.fromEntries(
          normalizedToppings.map((item) => [item.id, formFromItem(item)]),
        ),
      );
    } catch {
      setError('Could not load menu and topping catalogs.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadCatalog();
  }, [loadCatalog]);

  const setItemsForKind = (kind: CatalogKind, items: CatalogItem[]) => {
    if (kind === 'menu') {
      setMenuItems(items);
      return;
    }
    setToppingItems(items);
  };

  const setFormsForKind = (kind: CatalogKind, forms: Record<number, ItemForm>) => {
    if (kind === 'menu') {
      setMenuForms(forms);
      return;
    }
    setToppingForms(forms);
  };

  const setCreateFormForKind = (kind: CatalogKind, form: NewItemForm) => {
    if (kind === 'menu') {
      setNewMenuItem(form);
      return;
    }
    setNewToppingItem(form);
  };

  const createFormByKind = tab === 'menu' ? newMenuItem : newToppingItem;

  const updateItemForm = (
    kind: CatalogKind,
    id: number,
    patch: Partial<ItemForm>,
  ) => {
    const nextForms = {
      ...formsByKind[kind],
      [id]: { ...formsByKind[kind][id], ...patch },
    };
    setFormsForKind(kind, nextForms);
  };

  const updateCreateForm = (
    kind: CatalogKind,
    patch: Partial<NewItemForm>,
  ) => {
    const current = kind === 'menu' ? newMenuItem : newToppingItem;
    setCreateFormForKind(kind, { ...current, ...patch });
  };

  const buildPayload = (
    kind: CatalogKind,
    form: Pick<ItemForm, 'name' | 'category' | 'price'>,
  ) => {
    const name = form.name.trim();
    if (!name) {
      throw new Error('Name is required.');
    }

    const category = form.category.trim();
    if (kind === 'menu' && !category) {
      throw new Error('Category is required for menu items.');
    }

    const price = Number.parseFloat(form.price);
    if (Number.isNaN(price) || price < 0) {
      throw new Error('Price must be a non-negative number.');
    }

    return {
      name,
      ...(category ? { category } : {}),
      price,
    };
  };

  const saveItem = async (kind: CatalogKind, id: number) => {
    const form = formsByKind[kind][id];
    if (!form) return;

    try {
      const payload = {
        ...buildPayload(kind, form),
        available: form.available,
      };
      setStatusMessage(null);
      setSavingKey(`${kind}-save-${id}`);
      const updated = (await Patch(`${endpointFor(kind)}/${id}`, payload)) as CatalogItem;
      const normalized = {
        ...updated,
        category: String(updated.category ?? ''),
        price: Number(updated.price),
      };
      setItemsForKind(
        kind,
        itemsByKind[kind].map((row) => (row.id === id ? normalized : row)),
      );
      setFormsForKind(kind, {
        ...formsByKind[kind],
        [id]: formFromItem(normalized),
      });
      setStatusMessage(`Saved ${labelFor(kind)} "${normalized.name}".`);
    } catch (err) {
      setStatusMessage(
        err instanceof Error ? err.message : `Could not save ${labelFor(kind)}.`,
      );
    } finally {
      setSavingKey(null);
    }
  };

  const createItem = async (kind: CatalogKind) => {
    const form = kind === 'menu' ? newMenuItem : newToppingItem;
    try {
      const payload = buildPayload(kind, form);
      setStatusMessage(null);
      setSavingKey(`${kind}-create`);
      const created = (await Post(endpointFor(kind), payload)) as CatalogItem;
      const normalized = {
        ...created,
        category: String(created.category ?? ''),
        price: Number(created.price),
      };
      setItemsForKind(kind, [...itemsByKind[kind], normalized]);
      setFormsForKind(kind, {
        ...formsByKind[kind],
        [normalized.id]: formFromItem(normalized),
      });
      setCreateFormForKind(kind, EMPTY_CREATE_FORM);
      setStatusMessage(`Created ${labelFor(kind)} "${normalized.name}".`);
    } catch (err) {
      setStatusMessage(
        err instanceof Error ? err.message : `Could not create ${labelFor(kind)}.`,
      );
    } finally {
      setSavingKey(null);
    }
  };

  const uploadImage = async (
    kind: CatalogKind,
    id: number,
    file: File | undefined,
  ) => {
    if (!file) return;
    try {
      setStatusMessage(null);
      setSavingKey(`${kind}-upload-${id}`);
      const formData = new FormData();
      formData.append('image', file);
      const updated = (await postFormData(
        `${endpointFor(kind)}/${id}/image`,
        formData,
      )) as CatalogItem;
      const normalized = {
        ...updated,
        category: String(updated.category ?? ''),
        price: Number(updated.price),
      };
      setItemsForKind(
        kind,
        itemsByKind[kind].map((row) => (row.id === id ? normalized : row)),
      );
      setFormsForKind(kind, {
        ...formsByKind[kind],
        [id]: formFromItem(normalized),
      });
      setStatusMessage(`Updated image for "${normalized.name}".`);
    } catch {
      setStatusMessage(
        'Image upload failed. Use JPEG, PNG, GIF, or WebP under 5 MB.',
      );
    } finally {
      setSavingKey(null);
    }
  };

  const removeImage = async (kind: CatalogKind, id: number) => {
    try {
      setStatusMessage(null);
      setSavingKey(`${kind}-remove-image-${id}`);
      const updated = (await Delete(
        `${endpointFor(kind)}/${id}/image`,
      )) as CatalogItem;
      const normalized = {
        ...updated,
        category: String(updated.category ?? ''),
        price: Number(updated.price),
      };
      setItemsForKind(
        kind,
        itemsByKind[kind].map((row) => (row.id === id ? normalized : row)),
      );
      setFormsForKind(kind, {
        ...formsByKind[kind],
        [id]: formFromItem(normalized),
      });
      setStatusMessage(`Removed image for "${normalized.name}".`);
    } catch {
      setStatusMessage(`Could not remove ${labelFor(kind)} image.`);
    } finally {
      setSavingKey(null);
    }
  };

  const deleteItem = async (kind: CatalogKind, id: number) => {
    const item = itemsByKind[kind].find((entry) => entry.id === id);
    if (!item) return;

    const confirmed = window.confirm(
      `Delete ${labelFor(kind)} "${item.name}"? This cannot be undone.`,
    );
    if (!confirmed) return;

    try {
      setStatusMessage(null);
      setSavingKey(`${kind}-delete-${id}`);
      await Delete(`${endpointFor(kind)}/${id}`);
      setItemsForKind(
        kind,
        itemsByKind[kind].filter((entry) => entry.id !== id),
      );
      const nextForms = { ...formsByKind[kind] };
      delete nextForms[id];
      setFormsForKind(kind, nextForms);
      setStatusMessage(`Deleted ${labelFor(kind)} "${item.name}".`);
    } catch {
      setStatusMessage(`Could not delete ${labelFor(kind)}.`);
    } finally {
      setSavingKey(null);
    }
  };

  const activeItems = itemsByKind[tab].slice().sort((a, b) => {
    const categoryComparison = a.category.localeCompare(b.category);
    return categoryComparison !== 0
      ? categoryComparison
      : a.name.localeCompare(b.name);
  });

  const statusSeverity: 'success' | 'error' = useMemo(() => {
    if (!statusMessage) return 'success';
    return /could not|failed|required|must/i.test(statusMessage) ? 'error' : 'success';
  }, [statusMessage]);

  return (
    <Box sx={{ minHeight: '100vh', px: 4, py: 6, bgcolor: '#f7f7f7', color: '#000000' }}>
      <Typography
        component={Link}
        href="/manager"
        sx={{ color: '#1565c0', mb: 2, display: 'inline-block' }}
      >
        Back to manager dashboard
      </Typography>

      <Typography variant="h3" component="h1" sx={{ fontWeight: 700, mb: 1 }}>
        Catalog manager
      </Typography>
      <Typography variant="body1" sx={{ color: '#333333', mb: 3, maxWidth: 900 }}>
        Create, edit, upload, remove images, and delete both menu items and
        toppings from one place. Uploaded files still use the server&apos;s local
        `/uploads` storage, so production persistence should be verified during
        deployment.
      </Typography>

      {statusMessage && (
        <Alert
          severity={statusSeverity}
          sx={{ mb: 2, maxWidth: 1100 }}
          onClose={() => setStatusMessage(null)}
        >
          {statusMessage}
        </Alert>
      )}

      <Paper sx={{ maxWidth: 1100, mb: 3 }}>
        <Tabs
          value={tab}
          onChange={(_event, nextValue: CatalogKind) => setTab(nextValue)}
          variant="fullWidth"
        >
          <Tab value="menu" label="Menu Items" />
          <Tab value="topping" label="Toppings" />
        </Tabs>
      </Paper>

      <Paper sx={{ maxWidth: 1100, mb: 3, p: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
          Create {labelFor(tab)}
        </Typography>
        <Typography variant="body2" sx={{ color: '#555555', mb: 2 }}>
          New {pluralLabelFor(tab)} start as available. Add an image after
          creating the record.
        </Typography>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
          <TextField
            label="Name"
            fullWidth
            value={createFormByKind.name}
            onChange={(event) =>
              updateCreateForm(tab, { name: event.target.value })
            }
          />
          <TextField
            label={categoryLabelFor(tab)}
            fullWidth
            value={createFormByKind.category}
            onChange={(event) =>
              updateCreateForm(tab, { category: event.target.value })
            }
          />
          <TextField
            label="Price"
            type="number"
            inputProps={{ min: 0, step: 0.01 }}
            value={createFormByKind.price}
            onChange={(event) =>
              updateCreateForm(tab, { price: event.target.value })
            }
            sx={{ minWidth: { md: 180 } }}
          />
          <Button
            variant="contained"
            onClick={() => void createItem(tab)}
            disabled={savingKey === `${tab}-create`}
            sx={{ minWidth: { md: 170 } }}
          >
            {savingKey === `${tab}-create` ? 'Creating...' : `Create ${labelFor(tab)}`}
          </Button>
        </Stack>
      </Paper>

      {loading && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <CircularProgress size={28} />
          <Typography>Loading catalog...</Typography>
        </Box>
      )}

      {!loading && error && (
        <Box sx={{ mb: 2 }}>
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
          <Button variant="outlined" onClick={() => void loadCatalog()}>
            Retry
          </Button>
        </Box>
      )}

      {!loading && !error && (
        <Stack spacing={2} sx={{ maxWidth: 1100 }}>
          {activeItems.map((item) => {
            const form = formsByKind[tab][item.id];
            if (!form) return null;

            const imageSrc = publicAssetUrl(item.image);
            const isSaving = savingKey === `${tab}-save-${item.id}`;
            const isUploading = savingKey === `${tab}-upload-${item.id}`;
            const isDeleting = savingKey === `${tab}-delete-${item.id}`;
            const isRemovingImage = savingKey === `${tab}-remove-image-${item.id}`;
            const isBusy =
              isSaving || isUploading || isDeleting || isRemovingImage;

            return (
              <Paper key={`${tab}-${item.id}`} elevation={1} sx={{ p: 2 }}>
                <Stack
                  direction={{ xs: 'column', md: 'row' }}
                  spacing={2}
                  alignItems={{ xs: 'stretch', md: 'flex-start' }}
                >
                  <Box
                    sx={{
                      width: { xs: '100%', md: 150 },
                      maxWidth: { xs: 180, md: 150 },
                      alignSelf: { xs: 'center', md: 'flex-start' },
                    }}
                  >
                    <Box
                      sx={{
                        width: '100%',
                        aspectRatio: '1',
                        borderRadius: 1.5,
                        overflow: 'hidden',
                        bgcolor: '#FAF3E0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {imageSrc ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={imageSrc}
                          alt={item.name}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      ) : (
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ px: 1, textAlign: 'center' }}
                        >
                          No image
                        </Typography>
                      )}
                    </Box>
                    <Stack spacing={1} sx={{ mt: 1 }}>
                      <Button
                        fullWidth
                        size="small"
                        variant="outlined"
                        component="label"
                        disabled={isBusy}
                      >
                        {isUploading ? 'Uploading...' : 'Change image'}
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/gif,image/webp"
                          hidden
                          disabled={isBusy}
                          onChange={(event) => {
                            const file = event.target.files?.[0];
                            void uploadImage(tab, item.id, file);
                            event.target.value = '';
                          }}
                        />
                      </Button>
                      <Button
                        fullWidth
                        size="small"
                        variant="text"
                        color="error"
                        disabled={!imageSrc || isBusy}
                        onClick={() => void removeImage(tab, item.id)}
                      >
                        {isRemovingImage ? 'Removing...' : 'Remove image'}
                      </Button>
                    </Stack>
                  </Box>

                  <Stack spacing={1.5} sx={{ flex: 1, minWidth: 0, width: '100%' }}>
                    <Stack
                      direction={{ xs: 'column', md: 'row' }}
                      spacing={1.5}
                      alignItems={{ xs: 'stretch', md: 'center' }}
                    >
                      <TextField
                        label="Name"
                        size="small"
                        fullWidth
                        value={form.name}
                        onChange={(event) =>
                          updateItemForm(tab, item.id, { name: event.target.value })
                        }
                        disabled={isBusy}
                      />
                      <TextField
                        label={categoryLabelFor(tab)}
                        size="small"
                        fullWidth
                        value={form.category}
                        onChange={(event) =>
                          updateItemForm(tab, item.id, { category: event.target.value })
                        }
                        disabled={isBusy}
                      />
                      <TextField
                        label="Price"
                        size="small"
                        type="number"
                        inputProps={{ min: 0, step: 0.01 }}
                        value={form.price}
                        onChange={(event) =>
                          updateItemForm(tab, item.id, { price: event.target.value })
                        }
                        disabled={isBusy}
                        sx={{ minWidth: { md: 150 } }}
                      />
                    </Stack>

                    <FormControlLabel
                      control={
                        <Switch
                          checked={form.available}
                          onChange={(event) =>
                            updateItemForm(tab, item.id, {
                              available: event.target.checked,
                            })
                          }
                          disabled={isBusy}
                        />
                      }
                      label="Available to customers"
                    />

                    <Divider />

                    <Stack direction="row" spacing={1.5} flexWrap="wrap">
                      <Button
                        variant="contained"
                        onClick={() => void saveItem(tab, item.id)}
                        disabled={isBusy}
                      >
                        {isSaving ? 'Saving...' : 'Save details'}
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        startIcon={<DeleteIcon />}
                        onClick={() => void deleteItem(tab, item.id)}
                        disabled={isBusy}
                      >
                        {isDeleting ? 'Deleting...' : `Delete ${labelFor(tab)}`}
                      </Button>
                    </Stack>
                  </Stack>
                </Stack>
              </Paper>
            );
          })}

          {activeItems.length === 0 && (
            <Paper sx={{ p: 4 }}>
              <Typography variant="body1" color="text.secondary">
                No {pluralLabelFor(tab)} found yet.
              </Typography>
            </Paper>
          )}
        </Stack>
      )}
    </Box>
  );
}
