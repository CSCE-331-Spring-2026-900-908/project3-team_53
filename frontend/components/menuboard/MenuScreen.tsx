'use client';

import React from 'react';
import { MenuItem } from '@/types/menuboard';
import CustomizationInfo from './CustomizationInfo';
import { publicAssetUrl } from '@/utils/publicAssetUrl';

interface MenuScreenProps {
  items: MenuItem[];
}

export default function MenuScreen({ items }: MenuScreenProps) {
  // Get unique categories
  const categories = Array.from(new Set((items ?? []).map((i) => i.category)));

  return (
    <div className="w-full p-8 bg-[var(--color-cream)] text-[var(--color-kiosk-text)]">
      {categories.map((category) => (
        <div key={category} className="mb-8">
          <h2 className="text-3xl font-bold mb-4">{category}</h2>
          <div className="flex flex-col gap-4">
            {items
              .filter((item) => item.category === category)
              .map((item) => {
                const imgSrc = publicAssetUrl(item.image);
                return (
                <div
                  key={item.id}
                  className="p-4 bg-[var(--color-cream-light)] rounded shadow flex items-center gap-4"
                >
                  {imgSrc && (
                    <img
                      src={imgSrc}
                      alt={item.name}
                      className="w-24 h-24 object-cover rounded"
                    />
                  )}
                  <div>
                    <h3 className="text-xl font-semibold">{item.name}</h3>
                    <p className="text-lg text-[var(--color-accent-coral)]">${Number(item.price).toFixed(2)}</p>
                    {!item.available && (
                      <p className="text-red-400">Unavailable</p>
                    )}
                  </div>
                </div>
                );
              })}
          </div>
        </div>
      ))}
      <CustomizationInfo />
    </div>
  );
}

