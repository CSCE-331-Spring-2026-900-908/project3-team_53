'use client';

import React from 'react';
import { MenuItem } from '@/types/menuboard';
import CustomizationInfo from './CustomizationInfo';

interface MenuScreenProps {
  items: MenuItem[];
}

export default function MenuScreen({ items }: MenuScreenProps) {
  // Get unique categories
  const categories = Array.from(new Set(items.map((i) => i.category)));

  return (
    <div className="w-full p-8 bg-[#FAF3E0] text-[#2D3436]">
      {categories.map((category) => (
        <div key={category} className="mb-8">
          <h2 className="text-3xl font-bold mb-4">{category}</h2>
          <div className="flex flex-col gap-4">
            {items
              .filter((item) => item.category === category)
              .map((item) => (
                <div
                  key={item.id}
                  className="p-4 bg-[#FFF8EE] rounded shadow flex items-center gap-4"
                >
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-24 h-24 object-cover rounded"
                    />
                  )}
                  <div>
                    <h3 className="text-xl font-semibold">{item.name}</h3>
                    <p className="text-lg text-[#FF6B6B]">${item.price.toFixed(2)}</p>
                    {!item.available && (
                      <p className="text-red-400">Unavailable</p>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>
      ))}
      <CustomizationInfo />
    </div>
  );
}

