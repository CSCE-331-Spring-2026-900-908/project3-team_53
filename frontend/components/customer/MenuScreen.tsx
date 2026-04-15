'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Badge from '@mui/material/Badge';
import IconButton from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import {
  MenuItem as MenuItemType,
  CartItem,
  ToppingItem,
  OrderType,
  Size,
  SugarLevel,
  IceLevel,
} from '@/types/customer';
import CategorySidebar from './CategorySidebar';
import MenuItemCard from './MenuItemCard';
import ItemCustomizationModal from './ItemCustomizationModal';
import SnackAddModal from './SnackAddModal';
import CartSidebar from './CartSidebar';
import { useTranslation } from '@/contexts/TranslationContext';
import { publicAssetUrl } from '@/utils/publicAssetUrl';

interface MenuScreenProps {
  menuItems: MenuItemType[];
  toppings: ToppingItem[];
  cart: CartItem[];
  cartTotal: number;
  orderType: OrderType;
  onToggleOrderType: () => void;
  onAddToCart: (
    item: MenuItemType,
    size: Size,
    sugarLevel: SugarLevel,
    iceLevel: IceLevel,
    toppings: string[],
  ) => void;
  onUpdateQuantity: (cartId: string, quantity: number) => void;
  onRemoveFromCart: (cartId: string) => void;
  onCheckout: () => void;
  onBack: () => void;
}

export default function MenuScreen({
  menuItems,
  toppings,
  cart,
  cartTotal,
  orderType,
  onToggleOrderType,
  onAddToCart,
  onUpdateQuantity,
  onRemoveFromCart,
  onCheckout,
  onBack,
}: MenuScreenProps) {
  const { t } = useTranslation();

  const categories = useMemo(() => {
    const cats = Array.from(new Set(menuItems.map((i) => i.category)));
    return cats.length > 0 ? cats : ['Milk Tea', 'Fruit Tea', 'Smoothies', 'Snacks'];
  }, [menuItems]);

  const [selectedCategory, setSelectedCategory] = useState(categories[0] || 'Milk Tea');
  const [customizingItem, setCustomizingItem] = useState<MenuItemType | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [largestImageArea, setLargestImageArea] = useState(0);

  const filteredItems = menuItems.filter((i) => i.category === selectedCategory);
  const cartCount = cart.reduce((sum, c) => sum + c.quantity, 0);
  const hasImagesInView = filteredItems.some((item) => Boolean(item.image));

  useEffect(() => {
    let cancelled = false;
    const imageUrls = filteredItems
      .map((item) => publicAssetUrl(item.image))
      .filter((value): value is string => Boolean(value));

    if (imageUrls.length === 0) return () => { cancelled = true; };

    Promise.all(
      imageUrls.map(
        (url) =>
          new Promise<number>((resolve) => {
            const image = new window.Image();
            image.onload = () => resolve(image.naturalWidth * image.naturalHeight);
            image.onerror = () => resolve(0);
            image.src = url;
          }),
      ),
    ).then((areas) => {
      if (!cancelled) {
        setLargestImageArea(Math.max(0, ...areas));
      }
    });

    return () => {
      cancelled = true;
    };
  }, [filteredItems]);

  const cardScale = useMemo(() => {
    const area = hasImagesInView ? largestImageArea : 0;
    if (area <= 0) return 1;
    const normalized = Math.sqrt(area / 120000);
    return Math.min(1.45, Math.max(1, normalized));
  }, [hasImagesInView, largestImageArea]);

  const cardWidth = Math.round(200 * cardScale);
  const imageHeight = Math.round(120 * cardScale);
  const cardMinHeight = Math.round(230 * cardScale);

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top bar */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 2,
          py: 1.5,
          bgcolor: 'var(--color-kiosk-text)',
        }}
      >
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={onBack}
          sx={{ color: 'var(--color-cream)', textTransform: 'none', fontSize: '1rem' }}
        >
          {t('Back')}
        </Button>

        <Typography sx={{ color: 'var(--color-cream)', fontWeight: 700, fontSize: '1.25rem' }}>
          {t('Build Your Order')}
        </Typography>

        <IconButton onClick={() => setCartOpen(true)} sx={{ color: 'var(--color-cream)' }}>
          <Badge
            badgeContent={cartCount}
            sx={{
              '& .MuiBadge-badge': { bgcolor: 'var(--color-accent-coral)', color: 'var(--color-text-white)' },
            }}
          >
            <ShoppingCartIcon />
          </Badge>
        </IconButton>
      </Box>

      {/* Body: sidebar + grid */}
      <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <CategorySidebar
          categories={categories}
          selected={selectedCategory}
          onSelect={setSelectedCategory}
        />

        <Box
          sx={{
            flex: 1,
            p: 3,
            overflowY: 'auto',
            bgcolor: 'var(--color-cream)',
          }}
        >
          <Typography
            sx={{ color: 'var(--color-kiosk-text)', fontWeight: 700, fontSize: '1.5rem', mb: 2 }}
          >
            {t(selectedCategory)}
          </Typography>

          {filteredItems.length === 0 ? (
            <Typography sx={{ color: 'var(--color-kiosk-muted)', mt: 4, textAlign: 'center' }}>
              {t('No items available in this category yet.')}
            </Typography>
          ) : (
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: `repeat(auto-fill, minmax(${cardWidth}px, 1fr))`,
                gap: 2.5,
                alignItems: 'stretch',
              }}
            >
              {filteredItems.map((item) => (
                <MenuItemCard
                  key={item.id}
                  item={item}
                  onSelect={setCustomizingItem}
                  cardWidth={cardWidth}
                  imageHeight={imageHeight}
                  cardMinHeight={cardMinHeight}
                />
              ))}
            </Box>
          )}
        </Box>
      </Box>

      {/* Bottom bar with cart total */}
      {cartCount > 0 && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            px: 3,
            py: 2,
            bgcolor: 'var(--color-cream-light)',
            borderTop: '2px solid var(--color-cream-hover)',
          }}
        >
          <Typography sx={{ color: 'var(--color-kiosk-text)', fontSize: '1.1rem', fontWeight: 600 }}>
            {cartCount} {t(cartCount !== 1 ? 'items' : 'item')} &middot; ${cartTotal.toFixed(2)}
          </Typography>
          <Button
            variant="contained"
            onClick={() => setCartOpen(true)}
            sx={{
              bgcolor: 'var(--color-accent-coral)',
              color: 'var(--color-text-white)',
              fontWeight: 700,
              textTransform: 'none',
              fontSize: '1rem',
              px: 4,
              py: 1,
              borderRadius: 3,
              boxShadow: '0 3px 10px rgba(255,107,107,0.3)',
              '&:hover': { bgcolor: 'var(--color-accent-coral-hover)' },
            }}
          >
            {t('View Cart')}
          </Button>
        </Box>
      )}

      {/* Customization modal -- drinks get full options, snacks get quantity only */}
      {customizingItem && customizingItem.category !== 'Snacks' && (
        <ItemCustomizationModal
          item={customizingItem}
          toppings={toppings}
          open={!!customizingItem}
          onClose={() => setCustomizingItem(null)}
          onAdd={(size, sugarLevel, iceLevel, selectedToppings) => {
            onAddToCart(customizingItem, size, sugarLevel, iceLevel, selectedToppings);
            setCustomizingItem(null);
          }}
        />
      )}
      {customizingItem && customizingItem.category === 'Snacks' && (
        <SnackAddModal
          item={customizingItem}
          open={!!customizingItem}
          onClose={() => setCustomizingItem(null)}
          onAdd={(quantity) => {
            for (let i = 0; i < quantity; i++) {
              onAddToCart(customizingItem, 'Regular', '100%', 'Regular', []);
            }
            setCustomizingItem(null);
          }}
        />
      )}

      {/* Cart drawer */}
      <CartSidebar
        open={cartOpen}
        cart={cart}
        cartTotal={cartTotal}
        orderType={orderType}
        onToggleOrderType={onToggleOrderType}
        onClose={() => setCartOpen(false)}
        onUpdateQuantity={onUpdateQuantity}
        onRemove={onRemoveFromCart}
        onCheckout={() => {
          setCartOpen(false);
          onCheckout();
        }}
      />
    </Box>
  );
}
