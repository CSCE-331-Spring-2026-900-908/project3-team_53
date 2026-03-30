'use client';

import React, { useEffect, useState } from 'react';
import MenuScreen from '@/components/menuboard/MenuScreen';
import { MenuItem } from '@/types/menuboard';
import { Get } from '@/utils/apiService';

// Optional fallback in case API fails
const FALLBACK_MENU: MenuItem[] = [
  { id: 1, name: 'Classic Milk Tea', category: 'Milk Tea', price: 5.5, image: null, available: true },
  { id: 2, name: 'Taro Milk Tea', category: 'Milk Tea', price: 6, image: null, available: true },
  { id: 3, name: 'Mango Green Tea', category: 'Fruit Tea', price: 5.5, image: null, available: true },
  { id: 4, name: 'Strawberry Smoothie', category: 'Smoothies', price: 6.5, image: null, available: true },
  { id: 5, name: 'Popcorn Chicken', category: 'Snacks', price: 4.5, image: null, available: true },
];

export default function MenuBoardPage() {
  const [items, setItems] = useState<MenuItem[]>(FALLBACK_MENU);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const data: MenuItem[] = await Get('/menu-items');
        if (Array.isArray(data) && data.length > 0) {
          setItems(data);
        }
      } catch (err) {
        console.error('API fetch failed, using fallback menu:', err);
      }
    };

    fetchMenu();
  }, []);

  return (
    <div className="w-full h-full">
      <MenuScreen items={items} />
    </div>
  );
}