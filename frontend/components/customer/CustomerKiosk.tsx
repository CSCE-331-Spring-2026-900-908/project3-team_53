'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Box from '@mui/material/Box';
import {
  MenuItem as MenuItemType,
  CartItem,
  KioskStep,
  OrderType,
  PaymentType,
  PlacedOrder,
  ToppingItem,
  Size,
  SugarLevel,
  IceLevel,
} from '@/types/customer';
import { Get, Post } from '@/utils/apiService';
import WelcomeScreen from '@/components/customer/WelcomeScreen';
import MenuScreen from '@/components/customer/MenuScreen';
import CheckoutScreen from '@/components/customer/CheckoutScreen';
import ConfirmationScreen from '@/components/customer/ConfirmationScreen';
import PaymentScreen from '@/components/customer/PaymentScreen';
import { TranslationProvider } from '@/contexts/TranslationContext';
import LanguageSelector from '@/components/customer/LanguageSelector';

const FALLBACK_MENU: MenuItemType[] = [
  { id: 1, name: 'Classic Milk Tea', category: 'Milk Tea', price: 5.50, image: null, available: true },
  { id: 2, name: 'Taro Milk Tea', category: 'Milk Tea', price: 6.00, image: null, available: true },
  { id: 3, name: 'Brown Sugar Milk Tea', category: 'Milk Tea', price: 6.50, image: null, available: true },
  { id: 4, name: 'Jasmine Milk Tea', category: 'Milk Tea', price: 5.75, image: null, available: true },
  { id: 5, name: 'Mango Green Tea', category: 'Fruit Tea', price: 5.50, image: null, available: true },
  { id: 6, name: 'Passion Fruit Tea', category: 'Fruit Tea', price: 5.50, image: null, available: true },
  { id: 7, name: 'Lychee Tea', category: 'Fruit Tea', price: 5.75, image: null, available: true },
  { id: 8, name: 'Peach Oolong Tea', category: 'Fruit Tea', price: 5.75, image: null, available: true },
  { id: 9, name: 'Mango Smoothie', category: 'Smoothies', price: 6.50, image: null, available: true },
  { id: 10, name: 'Strawberry Smoothie', category: 'Smoothies', price: 6.50, image: null, available: true },
  { id: 11, name: 'Matcha Smoothie', category: 'Smoothies', price: 7.00, image: null, available: true },
  { id: 12, name: 'Popcorn Chicken', category: 'Snacks', price: 4.50, image: null, available: true },
  { id: 13, name: 'Egg Puffs', category: 'Snacks', price: 3.50, image: null, available: true },
  { id: 14, name: 'Mochi Donuts', category: 'Snacks', price: 4.00, image: null, available: true },
];

export default function CustomerKiosk() {
  const [step, setStep] = useState<KioskStep>('welcome');
  const [orderType, setOrderType] = useState<OrderType>('dine_in');
  const [menuItems, setMenuItems] = useState<MenuItemType[]>(FALLBACK_MENU);
  const [toppings, setToppings] = useState<ToppingItem[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [placedOrder, setPlacedOrder] = useState<PlacedOrder | null>(null);

  useEffect(() => {
    Get('/menu-items')
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setMenuItems(data);
        }
      })
      .catch(() => {});

    Get('/topping-items')
      .then((data) => {
        if (Array.isArray(data)) {
          setToppings(data.filter((t: ToppingItem) => t.category !== 'Size'));
        }
      })
      .catch(() => {});
  }, []);

  const handleSelectOrderType = (type: OrderType) => {
    setOrderType(type);
    setStep('menu');
  };

  const toggleOrderType = useCallback(() => {
    setOrderType((prev) => (prev === 'dine_in' ? 'carry_out' : 'dine_in'));
  }, []);

  const addToCart = useCallback(
    (
      item: MenuItemType,
      size: Size,
      sugarLevel: SugarLevel,
      iceLevel: IceLevel,
      toppings: string[],
    ) => {
      const cartItem: CartItem = {
        cartId: `${item.id}-${Date.now()}-${Math.random()}`,
        menuItem: item,
        quantity: 1,
        size,
        sugarLevel,
        iceLevel,
        toppings,
      };
      setCart((prev) => [...prev, cartItem]);
    },
    [],
  );

  const updateCartQuantity = useCallback((cartId: string, quantity: number) => {
    if (quantity <= 0) {
      setCart((prev) => prev.filter((c) => c.cartId !== cartId));
    } else {
      setCart((prev) =>
        prev.map((c) => (c.cartId === cartId ? { ...c, quantity } : c)),
      );
    }
  }, []);

  const removeFromCart = useCallback((cartId: string) => {
    setCart((prev) => prev.filter((c) => c.cartId !== cartId));
  }, []);

  const cartTotal = cart.reduce(
    (sum, c) => sum + c.menuItem.price * c.quantity,
    0,
  );

  const tax = cartTotal * 0.0825;
  const grandTotal = cartTotal + tax;

  const handlePlaceOrder = async (
    paymentType: PaymentType,
    changeDue: number,
    customerName: string,
    customerPhone: string,
  ) => {
    const payload = {
      order_type: orderType,
      total: cartTotal,
      payment_type: paymentType,
      customer_name: customerName || undefined,
      customer_phone: customerPhone || undefined,
      items: cart.map((c) => ({
        menuItemId: c.menuItem.id,
        quantity: c.quantity,
        size: c.size,
        sugar_level: c.sugarLevel,
        ice_level: c.iceLevel,
        toppings: c.toppings,
        item_price: c.menuItem.price * c.quantity,
      })),
    };

    try {
      const order = await Post('/orders', payload);
      setPlacedOrder({
        ...order,
        payment_type: paymentType,
        change_due: changeDue,
        customer_name: order.customer_name,
        customer_phone: order.customer_phone,
      });
      setStep('confirmation');
    } catch {
      const fallbackId = Math.floor(Math.random() * 900) + 100;
      setPlacedOrder({
        id: fallbackId,
        status: 'pending',
        order_type: orderType,
        total: cartTotal,
        payment_type: paymentType,
        change_due: changeDue,
        customer_name: customerName || `Customer ${fallbackId}`,
        customer_phone: customerPhone || undefined,
        created_at: new Date().toISOString(),
      });
      setStep('confirmation');
    }
  };

  const handleStartOver = () => {
    setStep('welcome');
    setCart([]);
    setPlacedOrder(null);
  };

  return (
    <TranslationProvider>
      <Box sx={{ height: '100vh', width: '100vw', overflow: 'hidden', bgcolor: '#FAF3E0' }}>
        {step === 'welcome' && (
          <WelcomeScreen onSelectOrderType={handleSelectOrderType} />
        )}
        {step === 'menu' && (
          <MenuScreen
            menuItems={menuItems}
            toppings={toppings}
            cart={cart}
            cartTotal={cartTotal}
            orderType={orderType}
            onToggleOrderType={toggleOrderType}
            onAddToCart={addToCart}
            onUpdateQuantity={updateCartQuantity}
            onRemoveFromCart={removeFromCart}
            onCheckout={() => setStep('checkout')}
            onBack={() => setStep('welcome')}
          />
        )}
        {step === 'checkout' && (
          <CheckoutScreen
            cart={cart}
            cartTotal={cartTotal}
            orderType={orderType}
            onContinueToPayment={() => setStep('payment')}
            onBack={() => setStep('menu')}
          />
        )}
        {step === 'payment' && (
          <PaymentScreen
            grandTotal={grandTotal}
            onPlaceOrder={handlePlaceOrder}
            onBack={() => setStep('checkout')}
          />
        )}
        {step === 'confirmation' && (
          <ConfirmationScreen
            order={placedOrder}
            onStartOver={handleStartOver}
          />
        )}
        <LanguageSelector />
      </Box>
    </TranslationProvider>
  );
}
