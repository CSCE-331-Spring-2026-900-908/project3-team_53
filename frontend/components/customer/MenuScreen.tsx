'use client';

import React, { useState, useMemo } from 'react';
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
  OrderType,
  Size,
  SugarLevel,
  IceLevel,
  Topping,
} from '@/types/customer';
import CategorySidebar from './CategorySidebar';
import MenuItemCard from './MenuItemCard';
import ItemCustomizationModal from './ItemCustomizationModal';
import CartSidebar from './CartSidebar';

interface MenuScreenProps {
  menuItems: MenuItemType[];
  cart: CartItem[];
  cartTotal: number;
  orderType: OrderType;
  onToggleOrderType: () => void;
  onAddToCart: (
    item: MenuItemType,
    size: Size,
    sugarLevel: SugarLevel,
    iceLevel: IceLevel,
    toppings: Topping[],
  ) => void;
  onUpdateQuantity: (cartId: string, quantity: number) => void;
  onRemoveFromCart: (cartId: string) => void;
  onCheckout: () => void;
  onBack: () => void;
}

export default function MenuScreen({
  menuItems,
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
  const categories = useMemo(() => {
    const cats = Array.from(new Set(menuItems.map((i) => i.category)));
    return cats.length > 0 ? cats : ['Milk Tea', 'Fruit Tea', 'Smoothies', 'Snacks'];
  }, [menuItems]);

  const [selectedCategory, setSelectedCategory] = useState(categories[0] || 'Milk Tea');
  const [customizingItem, setCustomizingItem] = useState<MenuItemType | null>(null);
  const [cartOpen, setCartOpen] = useState(false);

  const filteredItems = menuItems.filter((i) => i.category === selectedCategory);
  const cartCount = cart.reduce((sum, c) => sum + c.quantity, 0);

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
          bgcolor: '#2D3436',
        }}
      >
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={onBack}
          sx={{ color: '#FAF3E0', textTransform: 'none', fontSize: '1rem' }}
        >
          Back
        </Button>

        <Typography sx={{ color: '#FAF3E0', fontWeight: 700, fontSize: '1.25rem' }}>
          Build Your Order
        </Typography>

        <IconButton onClick={() => setCartOpen(true)} sx={{ color: '#FAF3E0' }}>
          <Badge
            badgeContent={cartCount}
            sx={{
              '& .MuiBadge-badge': { bgcolor: '#FF6B6B', color: '#fff' },
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
            bgcolor: '#FAF3E0',
          }}
        >
          <Typography
            sx={{ color: '#2D3436', fontWeight: 700, fontSize: '1.5rem', mb: 2 }}
          >
            {selectedCategory}
          </Typography>

          {filteredItems.length === 0 ? (
            <Typography sx={{ color: '#636E72', mt: 4, textAlign: 'center' }}>
              No items available in this category yet.
            </Typography>
          ) : (
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                gap: 2.5,
              }}
            >
              {filteredItems.map((item) => (
                <MenuItemCard
                  key={item.id}
                  item={item}
                  onSelect={setCustomizingItem}
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
            bgcolor: '#FFF8EE',
            borderTop: '2px solid #f0e6d3',
          }}
        >
          <Typography sx={{ color: '#2D3436', fontSize: '1.1rem', fontWeight: 600 }}>
            {cartCount} item{cartCount !== 1 ? 's' : ''} &middot; ${cartTotal.toFixed(2)}
          </Typography>
          <Button
            variant="contained"
            onClick={() => setCartOpen(true)}
            sx={{
              bgcolor: '#FF6B6B',
              color: '#fff',
              fontWeight: 700,
              textTransform: 'none',
              fontSize: '1rem',
              px: 4,
              py: 1,
              borderRadius: 3,
              boxShadow: '0 3px 10px rgba(255,107,107,0.3)',
              '&:hover': { bgcolor: '#ee5a5a' },
            }}
          >
            View Cart
          </Button>
        </Box>
      )}

      {/* Customization modal */}
      {customizingItem && (
        <ItemCustomizationModal
          item={customizingItem}
          open={!!customizingItem}
          onClose={() => setCustomizingItem(null)}
          onAdd={(size, sugarLevel, iceLevel, toppings) => {
            onAddToCart(customizingItem, size, sugarLevel, iceLevel, toppings);
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
