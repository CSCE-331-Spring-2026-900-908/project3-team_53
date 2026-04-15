'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import AddPhotoAlternateOutlinedIcon from '@mui/icons-material/AddPhotoAlternateOutlined';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import DeleteIcon from '@mui/icons-material/Delete';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormControlLabel from '@mui/material/FormControlLabel';
import InputAdornment from '@mui/material/InputAdornment';
import Link from 'next/link';
import Paper from '@mui/material/Paper';
import SearchIcon from '@mui/icons-material/Search';
import Slider from '@mui/material/Slider';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { Delete, Get, Patch, Post, postFormData } from '@/utils/apiService';
import { publicAssetUrl } from '@/utils/publicAssetUrl';
import type { MenuItem as CatalogMenuItem } from '@/types/menuboard';
import type { MenuItem as CustomerMenuItem } from '@/types/customer';
import IngredientsModal from '@/components/manager/ingredientsModal';

type CatalogKind = 'menu' | 'topping';
type CatalogItem = CatalogMenuItem;
type InventoryItem = { id: number; name: string; quantity: number; status: string };
type IngredientAssignment = {
  inventoryId: string;
  servingsUsed: string;
  isTopping: boolean;
};
type ItemForm = {
  name: string;
  category: string;
  price: string;
  available: boolean;
  imageFocusX: number;
  imageFocusY: number;
};
type NewItemForm = {
  name: string;
  category: string;
  price: string;
  imageFocusX: number;
  imageFocusY: number;
};

const EMPTY_CREATE_FORM: NewItemForm = {
  name: '',
  category: '',
  price: '',
  imageFocusX: 50,
  imageFocusY: 50,
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
      imageFocusX: Number(record.imageFocusX ?? 50),
      imageFocusY: Number(record.imageFocusY ?? 50),
      available: Boolean(record.available),
    };
  });
}

function formFromItem(item: CatalogItem): ItemForm {
  return {
    name: item.name,
    category: item.category ?? '',
    price: Number(item.price).toFixed(2),
    imageFocusX: Number(item.imageFocusX ?? 50),
    imageFocusY: Number(item.imageFocusY ?? 50),
    available: item.available,
  };
}

function catalogItemToCustomerMenuItem(item: CatalogItem): CustomerMenuItem {
  return {
    id: item.id,
    name: item.name,
    category: String(item.category ?? ''),
    price: Number(item.price),
    image: item.image ?? null,
    imageFocusX: Number(item.imageFocusX ?? 50),
    imageFocusY: Number(item.imageFocusY ?? 50),
    available: item.available,
  };
}

const endpointFor = (kind: CatalogKind) =>
  kind === 'menu' ? '/menu-items' : '/topping-items';
const labelFor = (kind: CatalogKind) => (kind === 'menu' ? 'menu item' : 'topping');
const pluralLabelFor = (kind: CatalogKind) =>
  kind === 'menu' ? 'menu items' : 'toppings';
const categoryLabelFor = (kind: CatalogKind) =>
  kind === 'menu' ? 'Category' : 'Category (optional)';
const emptyIngredientAssignment = (): IngredientAssignment => ({
  inventoryId: '',
  servingsUsed: '1',
  isTopping: false,
});

export default function ManagerMenuPage() {
  const [tab, setTab] = useState<CatalogKind>('menu');
  const [menuItems, setMenuItems] = useState<CatalogItem[]>([]);
  const [toppingItems, setToppingItems] = useState<CatalogItem[]>([]);
  const [menuForms, setMenuForms] = useState<Record<number, ItemForm>>({});
  const [toppingForms, setToppingForms] = useState<Record<number, ItemForm>>({});
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [ingredientForms, setIngredientForms] = useState<
    Record<number, IngredientAssignment[]>
  >({});
  const [newMenuItem, setNewMenuItem] = useState<NewItemForm>(EMPTY_CREATE_FORM);
  const [newToppingItem, setNewToppingItem] = useState<NewItemForm>(EMPTY_CREATE_FORM);
  const [searchQuery, setSearchQuery] = useState('');
  const [framingItemId, setFramingItemId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [ingredientsModalItem, setIngredientsModalItem] = useState<CustomerMenuItem | null>(null);

  const itemsByKind = useMemo(
    () => ({ menu: menuItems, topping: toppingItems }),
    [menuItems, toppingItems],
  );
  const formsByKind = useMemo(
    () => ({ menu: menuForms, topping: toppingForms }),
    [menuForms, toppingForms],
  );

  const loadCatalog = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [menuData, toppingData, inventoryData, itemIngredientsData] = await Promise.all([
        Get('/menu-items?includeUnavailable=true'),
        Get('/topping-items?includeUnavailable=true'),
        Get('/inventory'),
        Get('/item-ingredients'),
      ]);
      const normalizedMenu = sanitizeItems(menuData);
      const normalizedToppings = sanitizeItems(toppingData);
      setMenuItems(normalizedMenu);
      setToppingItems(normalizedToppings);
      setInventoryItems(
        Array.isArray(inventoryData)
          ? inventoryData.map((item) => ({
              id: Number((item as InventoryItem).id),
              name: String((item as InventoryItem).name ?? ''),
              quantity: Number((item as InventoryItem).quantity ?? 0),
              status: String((item as InventoryItem).status ?? ''),
            }))
          : [],
      );
      setMenuForms(Object.fromEntries(normalizedMenu.map((item) => [item.id, formFromItem(item)])));
      setToppingForms(
        Object.fromEntries(normalizedToppings.map((item) => [item.id, formFromItem(item)])),
      );
      const nextIngredientForms: Record<number, IngredientAssignment[]> = {};
      if (Array.isArray(itemIngredientsData)) {
        for (const row of itemIngredientsData as Array<{
          menuItem?: { id?: number };
          inventory?: { id?: number };
          servingsUsed?: number | string;
          isTopping?: boolean;
        }>) {
          const menuItemId = Number(row.menuItem?.id);
          if (!menuItemId) continue;
          if (!nextIngredientForms[menuItemId]) nextIngredientForms[menuItemId] = [];
          nextIngredientForms[menuItemId].push({
            inventoryId: String(row.inventory?.id ?? ''),
            servingsUsed: String(row.servingsUsed ?? '1'),
            isTopping: Boolean(row.isTopping),
          });
        }
      }
      for (const item of normalizedMenu) {
        if (!nextIngredientForms[item.id]) {
          nextIngredientForms[item.id] = [];
        }
      }
      setIngredientForms(nextIngredientForms);
    } catch {
      setError('Could not load menu and topping catalogs.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadCatalog();
  }, [loadCatalog]);

  const setItemsForKind = (kind: CatalogKind, items: CatalogItem[]) =>
    kind === 'menu' ? setMenuItems(items) : setToppingItems(items);
  const setFormsForKind = (kind: CatalogKind, forms: Record<number, ItemForm>) =>
    kind === 'menu' ? setMenuForms(forms) : setToppingForms(forms);
  const setCreateFormForKind = (kind: CatalogKind, form: NewItemForm) =>
    kind === 'menu' ? setNewMenuItem(form) : setNewToppingItem(form);

  const createFormByKind = tab === 'menu' ? newMenuItem : newToppingItem;
  const activeItems = itemsByKind[tab];

  const summary = useMemo(() => {
    const available = activeItems.filter((item) => item.available).length;
    const withImages = activeItems.filter((item) => item.image).length;
    const categories = new Set(activeItems.map((item) => item.category || 'Uncategorized')).size;
    return { total: activeItems.length, available, hidden: activeItems.length - available, withImages, categories };
  }, [activeItems]);

  const filteredItems = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return activeItems
      .filter((item) => {
        if (!query) return true;
        return `${item.name} ${item.category}`.toLowerCase().includes(query);
      })
      .slice()
      .sort((a, b) => {
        const categoryComparison = a.category.localeCompare(b.category);
        return categoryComparison !== 0 ? categoryComparison : a.name.localeCompare(b.name);
      });
  }, [activeItems, searchQuery]);

  const groupedItems = useMemo(() => {
    return filteredItems.reduce<Record<string, CatalogItem[]>>((acc, item) => {
      const key = item.category.trim() || 'Uncategorized';
      if (!acc[key]) acc[key] = [];
      acc[key].push(item);
      return acc;
    }, {});
  }, [filteredItems]);

  const updateItemForm = (kind: CatalogKind, id: number, patch: Partial<ItemForm>) => {
    setFormsForKind(kind, {
      ...formsByKind[kind],
      [id]: { ...formsByKind[kind][id], ...patch },
    });
  };

  const updateCreateForm = (kind: CatalogKind, patch: Partial<NewItemForm>) => {
    const current = kind === 'menu' ? newMenuItem : newToppingItem;
    setCreateFormForKind(kind, { ...current, ...patch });
  };

  const updateIngredientRow = (
    menuItemId: number,
    index: number,
    patch: Partial<IngredientAssignment>,
  ) => {
    setIngredientForms((prev) => ({
      ...prev,
      [menuItemId]: (prev[menuItemId] ?? []).map((row, rowIndex) =>
        rowIndex === index ? { ...row, ...patch } : row,
      ),
    }));
  };

  const addIngredientRow = (menuItemId: number) => {
    setIngredientForms((prev) => ({
      ...prev,
      [menuItemId]: [...(prev[menuItemId] ?? []), emptyIngredientAssignment()],
    }));
  };

  const removeIngredientRow = (menuItemId: number, index: number) => {
    setIngredientForms((prev) => ({
      ...prev,
      [menuItemId]: (prev[menuItemId] ?? []).filter((_, rowIndex) => rowIndex !== index),
    }));
  };

  const buildPayload = (
    kind: CatalogKind,
    form: Pick<ItemForm, 'name' | 'category' | 'price' | 'imageFocusX' | 'imageFocusY'>,
  ) => {
    const name = form.name.trim();
    if (!name) throw new Error('Name is required.');
    const category = form.category.trim();
    if (kind === 'menu' && !category) throw new Error('Category is required for menu items.');
    const price = Number.parseFloat(form.price);
    if (Number.isNaN(price) || price < 0) throw new Error('Price must be a non-negative number.');
    return {
      name,
      ...(category ? { category } : {}),
      price,
      ...(kind === 'menu'
        ? {
            imageFocusX: Math.round(form.imageFocusX),
            imageFocusY: Math.round(form.imageFocusY),
          }
        : {}),
    };
  };

  const saveItem = async (kind: CatalogKind, id: number) => {
    const form = formsByKind[kind][id];
    if (!form) return;
    try {
      setStatusMessage(null);
      setSavingKey(`${kind}-save-${id}`);
      const updated = (await Patch(`${endpointFor(kind)}/${id}`, {
        ...buildPayload(kind, form),
        available: form.available,
      })) as CatalogItem;
      const normalized = { ...updated, category: String(updated.category ?? ''), price: Number(updated.price) };
      setItemsForKind(kind, itemsByKind[kind].map((row) => (row.id === id ? normalized : row)));
      setFormsForKind(kind, { ...formsByKind[kind], [id]: formFromItem(normalized) });
      setStatusMessage(`Saved ${labelFor(kind)} "${normalized.name}".`);
    } catch (err) {
      setStatusMessage(err instanceof Error ? err.message : `Could not save ${labelFor(kind)}.`);
    } finally {
      setSavingKey(null);
    }
  };

  const createItem = async (kind: CatalogKind) => {
    const form = kind === 'menu' ? newMenuItem : newToppingItem;
    try {
      setStatusMessage(null);
      setSavingKey(`${kind}-create`);
      const created = (await Post(endpointFor(kind), buildPayload(kind, form))) as CatalogItem;
      const normalized = { ...created, category: String(created.category ?? ''), price: Number(created.price) };
      setItemsForKind(kind, [...itemsByKind[kind], normalized]);
      setFormsForKind(kind, { ...formsByKind[kind], [normalized.id]: formFromItem(normalized) });
      if (kind === 'menu') {
        setIngredientForms((prev) => ({ ...prev, [normalized.id]: [] }));
      }
      setCreateFormForKind(kind, EMPTY_CREATE_FORM);
      setStatusMessage(`Created ${labelFor(kind)} "${normalized.name}".`);
    } catch (err) {
      setStatusMessage(err instanceof Error ? err.message : `Could not create ${labelFor(kind)}.`);
    } finally {
      setSavingKey(null);
    }
  };

  const uploadImage = async (kind: CatalogKind, id: number, file: File | undefined) => {
    if (!file) return;
    try {
      setStatusMessage(null);
      setSavingKey(`${kind}-upload-${id}`);
      const formData = new FormData();
      formData.append('image', file);
      const updated = (await postFormData(`${endpointFor(kind)}/${id}/image`, formData)) as CatalogItem;
      const normalized = { ...updated, category: String(updated.category ?? ''), price: Number(updated.price) };
      setItemsForKind(kind, itemsByKind[kind].map((row) => (row.id === id ? normalized : row)));
      setFormsForKind(kind, { ...formsByKind[kind], [id]: formFromItem(normalized) });
      setStatusMessage(`Updated image for "${normalized.name}".`);
    } catch {
      setStatusMessage('Image upload failed. Use JPEG, PNG, GIF, or WebP under 5 MB.');
    } finally {
      setSavingKey(null);
    }
  };

  const removeImage = async (kind: CatalogKind, id: number) => {
    try {
      setStatusMessage(null);
      setSavingKey(`${kind}-remove-image-${id}`);
      const updated = (await Delete(`${endpointFor(kind)}/${id}/image`)) as CatalogItem;
      const normalized = { ...updated, category: String(updated.category ?? ''), price: Number(updated.price) };
      setItemsForKind(kind, itemsByKind[kind].map((row) => (row.id === id ? normalized : row)));
      setFormsForKind(kind, { ...formsByKind[kind], [id]: formFromItem(normalized) });
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
    if (!window.confirm(`Delete ${labelFor(kind)} "${item.name}"? This cannot be undone.`)) return;
    try {
      setStatusMessage(null);
      setSavingKey(`${kind}-delete-${id}`);
      await Delete(`${endpointFor(kind)}/${id}`);
      setItemsForKind(kind, itemsByKind[kind].filter((entry) => entry.id !== id));
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

  const saveIngredients = async (menuItemId: number) => {
    const rows = ingredientForms[menuItemId] ?? [];
    try {
      const ingredients = rows.map((row) => {
        const inventoryId = Number(row.inventoryId);
        const servingsUsed = Number.parseFloat(row.servingsUsed);
        if (!inventoryId) {
          throw new Error('Choose an inventory item for every ingredient row.');
        }
        if (Number.isNaN(servingsUsed) || servingsUsed <= 0) {
          throw new Error('Ingredient servings used must be greater than 0.');
        }
        return {
          inventoryId,
          servingsUsed,
          isTopping: row.isTopping,
        };
      });

      setStatusMessage(null);
      setSavingKey(`ingredients-${menuItemId}`);
      await Patch(`/item-ingredients/menu-item/${menuItemId}`, { ingredients });
      const item = menuItems.find((entry) => entry.id === menuItemId);
      setStatusMessage(
        `Updated ingredients for "${item?.name ?? `menu item #${menuItemId}`}".`,
      );
    } catch (err) {
      setStatusMessage(
        err instanceof Error ? err.message : 'Could not update ingredients.',
      );
    } finally {
      setSavingKey(null);
    }
  };

  const statusSeverity: 'success' | 'error' = useMemo(() => {
    if (!statusMessage) return 'success';
    return /could not|failed|required|must/i.test(statusMessage) ? 'error' : 'success';
  }, [statusMessage]);

  const framingItem =
    framingItemId != null
      ? menuItems.find((item) => item.id === framingItemId) ?? null
      : null;
  const framingForm =
    framingItemId != null ? menuForms[framingItemId] ?? null : null;
  const framingImageSrc = framingItem ? publicAssetUrl(framingItem.image) : null;

  return (
    <Box
      sx={{
        minHeight: '100vh',
        px: { xs: 2, md: 4 },
        py: { xs: 3, md: 5 },
        color: 'var(--color-editor-brown-heading)',
        background: 'linear-gradient(180deg, var(--color-editor-gradient-start) 0%, var(--color-editor-gradient-mid) 36%, var(--color-editor-gradient-end) 100%)',
      }}
    >
      <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
        <Typography component={Link} href="/manager" sx={{ color: 'var(--color-editor-brown)', mb: 2, display: 'inline-flex', textDecoration: 'none', fontWeight: 700 }}>
          Back to manager dashboard
        </Typography>

        <Paper
          elevation={0}
          sx={{
            p: { xs: 2.5, md: 4 },
            mb: 3,
            borderRadius: 4,
            color: 'var(--color-editor-cream-light)',
            background: 'var(--color-page-bg)',
          }}
        >
          <Stack direction={{ xs: 'column', lg: 'row' }} spacing={3} justifyContent="space-between">
            <Box sx={{ maxWidth: 720 }}>
              <Typography variant="h3" sx={{ fontWeight: 800, lineHeight: 1.05, mt: 0.5, mb: 1 }}>
                {tab === 'menu' ? 'Menu Catalog' : 'Topping Catalog'}
              </Typography>
            </Box>
            <Stack direction="row" spacing={1.25} flexWrap="wrap" useFlexGap alignSelf={{ xs: 'stretch', lg: 'flex-end' }}>
              {[
                ['Total', summary.total],
                ['Available', summary.available],
                ['With Images', summary.withImages],
                ['Categories', summary.categories],
              ].map(([label, value]) => (
                <Paper key={String(label)} elevation={0} sx={{ px: 2, py: 1.5, minWidth: 120, borderRadius: 3, bgcolor: 'rgba(255,255,255,0.16)', color: 'var(--color-editor-cream-light)' }}>
                  <Typography sx={{ fontSize: '0.72rem', fontWeight: 800, opacity: 0.84 }}>{label}</Typography>
                  <Typography sx={{ fontSize: '1.7rem', lineHeight: 1.1, fontWeight: 800 }}>{value}</Typography>
                </Paper>
              ))}
            </Stack>
          </Stack>
        </Paper>

        {statusMessage && (
          <Alert severity={statusSeverity} sx={{ mb: 2.5, borderRadius: 3 }} onClose={() => setStatusMessage(null)}>
            {statusMessage}
          </Alert>
        )}

        <Stack direction={{ xs: 'column', xl: 'row' }} spacing={3} alignItems="flex-start">
          <Stack spacing={3} sx={{ flex: 1, minWidth: 0 }}>
            <Paper elevation={0} sx={{ borderRadius: 4, overflow: 'hidden', border: '1px solid rgba(90,65,35,0.08)' }}>
              <Tabs
                value={tab}
                onChange={(_event, nextValue: CatalogKind) => setTab(nextValue)}
                variant="fullWidth"
                sx={{
                  '& .MuiTabs-indicator': { height: 4, bgcolor: 'var(--color-editor-terracotta)' },
                  '& .MuiTab-root': { minHeight: 66, fontWeight: 800, color: 'var(--color-editor-brown-muted)' },
                  '& .Mui-selected': { color: 'var(--color-editor-green) !important' },
                }}
              >
                <Tab value="menu" label="Menu Items" />
                <Tab value="topping" label="Toppings" />
              </Tabs>
            </Paper>

            <Paper elevation={0} sx={{ p: 2.5, borderRadius: 4, border: '1px solid rgba(90,65,35,0.08)', bgcolor: 'var(--color-editor-surface)' }}>
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} justifyContent="space-between" alignItems={{ xs: 'flex-start', md: 'center' }}>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 800, color: 'var(--color-editor-green)' }}>
                    Browse {pluralLabelFor(tab)}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'var(--color-editor-brown-light)', mt: 0.5 }}>
                    Search by name or category, then edit items directly inside each section.
                  </Typography>
                </Box>
                <TextField
                  size="small"
                  placeholder={`Search ${pluralLabelFor(tab)}`}
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  sx={{ minWidth: { xs: '100%', md: 320 }, '& .MuiOutlinedInput-root': { borderRadius: 3, bgcolor: 'var(--color-surface)' } }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{ color: 'var(--color-editor-search)' }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Stack>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mt: 2 }}>
                <Chip label={`${summary.available} available`} sx={{ bgcolor: 'var(--color-editor-chip-avail-bg)', color: 'var(--color-editor-green)', fontWeight: 700 }} />
                <Chip label={`${summary.hidden} hidden`} sx={{ bgcolor: 'var(--color-editor-chip-hidden-bg)', color: 'var(--color-editor-chip-hidden-text)', fontWeight: 700 }} />
                <Chip label={`${filteredItems.length} shown`} sx={{ bgcolor: 'var(--color-editor-chip-shown-bg)', color: 'var(--color-editor-chip-shown-text)', fontWeight: 700 }} />
              </Stack>
            </Paper>

            {loading && (
              <Paper sx={{ p: 4, borderRadius: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <CircularProgress size={28} />
                  <Typography>Loading catalog...</Typography>
                </Box>
              </Paper>
            )}

            {!loading && error && (
              <Paper sx={{ p: 3, borderRadius: 4 }}>
                <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
                <Button variant="outlined" onClick={() => void loadCatalog()}>Retry</Button>
              </Paper>
            )}

            {!loading && !error && filteredItems.length === 0 && (
              <Paper elevation={0} sx={{ p: 5, borderRadius: 4, textAlign: 'center', border: '1px dashed rgba(90,65,35,0.25)', bgcolor: 'var(--color-editor-surface-alt)' }}>
                <Typography variant="h6" sx={{ fontWeight: 800, color: 'var(--color-editor-brown-dark)', mb: 1 }}>
                  No {pluralLabelFor(tab)} match this view
                </Typography>
                <Typography sx={{ color: 'var(--color-editor-brown-lighter)' }}>
                  Clear the search or create a new {labelFor(tab)} from the panel on the right.
                </Typography>
              </Paper>
            )}

            {!loading && !error && Object.entries(groupedItems).map(([category, items]) => (
              <Paper key={category} elevation={0} sx={{ p: 2.5, borderRadius: 4, border: '1px solid rgba(90,65,35,0.08)', bgcolor: 'var(--color-editor-surface-card)' }}>
                <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', md: 'center' }} spacing={1} sx={{ mb: 2.5 }}>
                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: 800, color: 'var(--color-editor-green)' }}>{category}</Typography>
                    <Typography variant="body2" sx={{ color: 'var(--color-editor-brown-light)' }}>
                      {items.length} {items.length === 1 ? 'item' : 'items'} in this section
                    </Typography>
                  </Box>
                  <Chip label={category === 'Uncategorized' ? 'Needs category review' : 'Organized'} sx={{ bgcolor: category === 'Uncategorized' ? 'var(--color-editor-chip-uncat-bg)' : 'var(--color-editor-chip-avail-bg)', color: category === 'Uncategorized' ? 'var(--color-editor-chip-uncat-text)' : 'var(--color-editor-green)', fontWeight: 700 }} />
                </Stack>

                <Stack spacing={2}>
                  {items.map((item) => {
                    const form = formsByKind[tab][item.id];
                    if (!form) return null;
                    const imageSrc = publicAssetUrl(item.image);
                    const objectPosition = `${form.imageFocusX}% ${form.imageFocusY}%`;
                    const isSaving = savingKey === `${tab}-save-${item.id}`;
                    const isUploading = savingKey === `${tab}-upload-${item.id}`;
                    const isDeleting = savingKey === `${tab}-delete-${item.id}`;
                    const isRemovingImage = savingKey === `${tab}-remove-image-${item.id}`;
                    const isBusy = isSaving || isUploading || isDeleting || isRemovingImage;

                    return (
                      <Paper key={`${tab}-${item.id}`} elevation={0} sx={{ p: 2, borderRadius: 3.5, border: '1px solid rgba(90,65,35,0.08)', bgcolor: form.available ? 'var(--color-surface)' : 'var(--color-editor-surface-unavail)', boxShadow: '0 8px 18px rgba(63, 47, 28, 0.05)' }}>
                        <Stack direction={{ xs: 'column', lg: 'row' }} spacing={2} alignItems={{ xs: 'stretch', lg: 'flex-start' }}>
                          <Box sx={{ width: { xs: '100%', lg: 180 }, maxWidth: { xs: '100%', lg: 180 }, flexShrink: 0 }}>
                            <Box sx={{ width: '100%', aspectRatio: '1 / 1', borderRadius: 3, overflow: 'hidden', bgcolor: 'var(--color-editor-img-bg)', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              {imageSrc ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                  src={imageSrc}
                                  alt={item.name}
                                  style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    objectPosition,
                                  }}
                                />
                              ) : (
                                <Stack alignItems="center" spacing={1}>
                                  <AddPhotoAlternateOutlinedIcon sx={{ fontSize: 38, color: 'var(--color-editor-photo)' }} />
                                  <Typography variant="caption" sx={{ color: 'var(--color-editor-photo-text)', fontWeight: 700 }}>
                                    Add a photo
                                  </Typography>
                                </Stack>
                              )}
                              <Chip label={form.available ? 'Visible' : 'Hidden'} size="small" sx={{ position: 'absolute', top: 10, left: 10, bgcolor: form.available ? 'var(--color-editor-chip-avail-bg)' : 'var(--color-editor-chip-hidden-bg)', color: form.available ? 'var(--color-editor-green)' : 'var(--color-editor-chip-hidden-text)', fontWeight: 800 }} />
                            </Box>
                            <Stack spacing={1} sx={{ mt: 1.25 }}>
                              <Button fullWidth size="small" variant="contained" component="label" disabled={isBusy} sx={{ borderRadius: 2.5, bgcolor: 'var(--color-editor-green)', '&:hover': { bgcolor: 'var(--color-editor-green-dark)' } }}>
                                {isUploading ? 'Uploading...' : 'Upload new image'}
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
                              <Button fullWidth size="small" variant="text" color="error" disabled={!imageSrc || isBusy} onClick={() => void removeImage(tab, item.id)}>
                                {isRemovingImage ? 'Removing...' : 'Remove image'}
                              </Button>
                            </Stack>
                          </Box>

                          <Stack spacing={1.75} sx={{ flex: 1, minWidth: 0 }}>
                            <Stack direction={{ xs: 'column', md: 'row' }} spacing={1} justifyContent="space-between" alignItems={{ xs: 'flex-start', md: 'center' }}>
                              <Box>
                                <Typography variant="h6" sx={{ fontWeight: 800, color: 'var(--color-editor-brown-text)' }}>{item.name}</Typography>
                                <Typography variant="body2" sx={{ color: 'var(--color-editor-brown-light)' }}>ID #{item.id}</Typography>
                              </Box>
                              <Chip label={`$${Number(item.price).toFixed(2)}`} sx={{ bgcolor: 'var(--color-editor-chip-price-bg)', color: 'var(--color-editor-chip-hidden-text)', fontWeight: 800 }} />
                            </Stack>

                            <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5}>
                              <TextField label="Name" size="small" fullWidth value={form.name} onChange={(event) => updateItemForm(tab, item.id, { name: event.target.value })} disabled={isBusy} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2.5 } }} />
                              <TextField label={categoryLabelFor(tab)} size="small" fullWidth value={form.category} onChange={(event) => updateItemForm(tab, item.id, { category: event.target.value })} disabled={isBusy} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2.5 } }} />
                              <TextField label="Price" size="small" type="number" inputProps={{ min: 0, step: 0.01 }} value={form.price} onChange={(event) => updateItemForm(tab, item.id, { price: event.target.value })} disabled={isBusy} sx={{ minWidth: { md: 160 }, '& .MuiOutlinedInput-root': { borderRadius: 2.5 } }} />
                            </Stack>

                            <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5} justifyContent="space-between" alignItems={{ xs: 'flex-start', md: 'center' }}>
                              <FormControlLabel
                                control={<Switch checked={form.available} onChange={(event) => updateItemForm(tab, item.id, { available: event.target.checked })} disabled={isBusy} />}
                                label="Visible to customers"
                                sx={{ m: 0, px: 1.2, py: 0.6, borderRadius: 999, bgcolor: form.available ? 'var(--color-editor-toggle-avail-bg)' : 'var(--color-editor-toggle-hidden-bg)' }}
                              />
                              <Stack direction="row" spacing={1.25} flexWrap="wrap" useFlexGap>
                                <Button variant="contained" onClick={() => void saveItem(tab, item.id)} disabled={isBusy} sx={{ borderRadius: 2.5, px: 2.2, bgcolor: 'var(--color-editor-terracotta)', '&:hover': { bgcolor: 'var(--color-editor-terracotta-dark)' } }}>
                                  {isSaving ? 'Saving...' : 'Save changes'}
                                </Button>
                                {tab === 'menu' && (
                                  <Button
                                    variant="outlined"
                                    onClick={() => setIngredientsModalItem(catalogItemToCustomerMenuItem(item))}
                                    disabled={isBusy}
                                    sx={{ borderRadius: 2.5, px: 2.2, borderColor: 'var(--color-editor-green)', color: 'var(--color-editor-green)' }}
                                  >
                                    Ingredients
                                  </Button>
                                )}
                                <Button variant="outlined" color="error" startIcon={<DeleteIcon />} onClick={() => void deleteItem(tab, item.id)} disabled={isBusy} sx={{ borderRadius: 2.5, px: 2.2 }}>
                                  {isDeleting ? 'Deleting...' : 'Delete'}
                                </Button>
                              </Stack>
                            </Stack>
                          </Stack>
                        </Stack>
                      </Paper>
                    );
                  })}
                </Stack>
              </Paper>
            ))}
          </Stack>

          <Paper elevation={0} sx={{ width: { xs: '100%', xl: 360 }, position: { xl: 'sticky' }, top: { xl: 24 }, p: 3, borderRadius: 4, border: '1px solid rgba(90,65,35,0.08)', bgcolor: 'linear-gradient(180deg, var(--color-editor-surface) 0%, var(--color-editor-gradient-create-end) 100%)', boxShadow: '0 20px 40px rgba(89, 67, 37, 0.08)' }}>
            <Typography variant="h5" sx={{ fontWeight: 800, color: 'var(--color-editor-green)', mb: 1 }}>
              Create {labelFor(tab)}
            </Typography>

            <Stack spacing={1.5}>
              <TextField label="Name" fullWidth value={createFormByKind.name} onChange={(event) => updateCreateForm(tab, { name: event.target.value })} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2.5 } }} />
              <TextField label={categoryLabelFor(tab)} fullWidth value={createFormByKind.category} onChange={(event) => updateCreateForm(tab, { category: event.target.value })} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2.5 } }} />
              <TextField label="Price" type="number" inputProps={{ min: 0, step: 0.01 }} value={createFormByKind.price} onChange={(event) => updateCreateForm(tab, { price: event.target.value })} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2.5 } }} />
              <Button variant="contained" onClick={() => void createItem(tab)} disabled={savingKey === `${tab}-create`} sx={{ mt: 1, py: 1.3, borderRadius: 2.8, fontWeight: 800, bgcolor: 'var(--color-editor-green)', '&:hover': { bgcolor: 'var(--color-editor-green-dark)' } }}>
                {savingKey === `${tab}-create` ? 'Creating...' : `Create ${labelFor(tab)}`}
              </Button>
            </Stack>
          </Paper>
        </Stack>

        {ingredientsModalItem && (
          <IngredientsModal
            item={ingredientsModalItem}
            ingredients={ingredientForms[ingredientsModalItem.id] ?? []}
            inventoryItems={inventoryItems}
            open
            onAddRow={() => addIngredientRow(ingredientsModalItem.id)}
            onClose={() => setIngredientsModalItem(null)}
            onRemoveRow={(index) => removeIngredientRow(ingredientsModalItem.id, index)}
            onSave={() => void saveIngredients(ingredientsModalItem.id)}
            onUpdateRow={(index, patch) =>
              updateIngredientRow(ingredientsModalItem.id, index, patch)
            }
            saving={savingKey === `ingredients-${ingredientsModalItem.id}`}
          />
        )}

        <Dialog
          open={Boolean(framingItem && framingForm)}
          onClose={() => setFramingItemId(null)}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle sx={{ fontWeight: 800 }}>
            Customer image framing
          </DialogTitle>
          <DialogContent>
            {framingItem && framingForm && (
              <Stack spacing={2} sx={{ pt: 1 }}>
                <Box>
                  <Typography sx={{ fontWeight: 700, color: 'var(--color-editor-brown-text)' }}>
                    {framingItem.name}
                  </Typography>
                  <Typography sx={{ fontSize: '0.88rem', color: 'var(--color-editor-brown-light)' }}>
                    Adjust the crop focus customers see on the kiosk card.
                  </Typography>
                </Box>

                <Box
                  sx={{
                    width: '100%',
                    height: 240,
                    borderRadius: 3,
                    overflow: 'hidden',
                    bgcolor: 'var(--color-editor-img-bg)',
                    border: '1px solid rgba(90,65,35,0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {framingImageSrc ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={framingImageSrc}
                      alt={framingItem.name}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        objectPosition: `${framingForm.imageFocusX}% ${framingForm.imageFocusY}%`,
                      }}
                    />
                  ) : (
                    <Stack alignItems="center" spacing={1}>
                      <AddPhotoAlternateOutlinedIcon sx={{ fontSize: 42, color: 'var(--color-editor-photo)' }} />
                      <Typography sx={{ color: 'var(--color-editor-photo-text)', fontWeight: 700 }}>
                        Upload an image first
                      </Typography>
                    </Stack>
                  )}
                </Box>

                <Box>
                  <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
                    <Typography sx={{ fontSize: '0.85rem', color: 'var(--color-editor-brown-dim)', fontWeight: 700 }}>
                      Horizontal focus
                    </Typography>
                    <Typography sx={{ fontSize: '0.85rem', color: 'var(--color-editor-brown-dim)', fontWeight: 700 }}>
                      {Math.round(framingForm.imageFocusX)}%
                    </Typography>
                  </Stack>
                  <Slider
                    value={framingForm.imageFocusX}
                    min={0}
                    max={100}
                    step={1}
                    onChange={(_event, value) =>
                      updateItemForm('menu', framingItem.id, {
                        imageFocusX: Array.isArray(value) ? value[0] : value,
                      })
                    }
                    sx={{ color: 'var(--color-editor-terracotta)' }}
                  />
                </Box>

                <Box>
                  <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
                    <Typography sx={{ fontSize: '0.85rem', color: 'var(--color-editor-brown-dim)', fontWeight: 700 }}>
                      Vertical focus
                    </Typography>
                    <Typography sx={{ fontSize: '0.85rem', color: 'var(--color-editor-brown-dim)', fontWeight: 700 }}>
                      {Math.round(framingForm.imageFocusY)}%
                    </Typography>
                  </Stack>
                  <Slider
                    value={framingForm.imageFocusY}
                    min={0}
                    max={100}
                    step={1}
                    onChange={(_event, value) =>
                      updateItemForm('menu', framingItem.id, {
                        imageFocusY: Array.isArray(value) ? value[0] : value,
                      })
                    }
                    sx={{ color: 'var(--color-editor-green)' }}
                  />
                </Box>
              </Stack>
            )}
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2.5 }}>
            <Button onClick={() => setFramingItemId(null)}>Done</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
}
