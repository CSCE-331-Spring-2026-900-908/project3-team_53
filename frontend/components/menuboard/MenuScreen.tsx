'use client';

import React from 'react';
import { MenuItem } from '@/types/menuboard';
import CustomizationInfo from './CustomizationInfo';
import { publicAssetUrl } from '@/utils/publicAssetUrl';

interface MenuScreenProps {
  items: MenuItem[];
}

export default function MenuScreen({ items }: MenuScreenProps) {
  const backdropUrl = publicAssetUrl('/project_3_logo.png') ?? '/project_3_logo.png';
  // Get unique categories, defaulting missing categories to 'Uncategorized'
  const categories = Array.from(new Set((items ?? []).map((i) => i.category || 'Uncategorized')));

  return (
    <div className="w-full text-[var(--color-kiosk-text)]">
      <section className="relative overflow-hidden rounded-[32px] mb-10 h-72">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${backdropUrl})` }}
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
          <p className="text-sm uppercase tracking-[0.35em] text-white/70 mb-3">Welcome to</p>
          <h1 className="text-5xl md:text-6xl font-black text-white drop-shadow-lg">Team 53 Boba Shop</h1>
          <p className="mt-4 max-w-2xl text-base text-white/80 sm:text-lg">
            Explore our menu by category and discover every drink, snack, and specialty item.
          </p>
        </div>
      </section>

      <div className="w-full p-8 bg-[var(--color-cream)] rounded-[28px] shadow-sm">
        {categories.map((category) => (
          <div key={category} className="mb-10">
            <h2 className="text-3xl font-bold mb-5 tracking-[0.03em]">{category}</h2>
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {items
                .filter((item) => (item.category || 'Uncategorized') === category)
                .map((item) => {
                  const imgSrc = publicAssetUrl(item.image);
                  return (
                    <div
                      key={item.id}
                      className="overflow-hidden rounded-[28px] bg-white border border-[rgba(0,0,0,0.06)] shadow-sm"
                    >
                      {imgSrc ? (
                        <img
                          src={imgSrc}
                          alt={item.name}
                          className="w-full h-64 object-cover"
                        />
                      ) : (
                        <div className="w-full h-64 bg-[var(--color-cream-light)] flex items-center justify-center text-sm text-[var(--color-kiosk-muted)]">
                          No image
                        </div>
                      )}
                      <div className="p-5 text-center">
                        <h3 className="text-xl font-semibold mb-2">{item.name}</h3>
                        <p className="text-lg text-[var(--color-accent-coral)] font-semibold">${Number(item.price).toFixed(2)}</p>
                        {!item.available && (
                          <p className="mt-2 text-red-500 font-semibold">Unavailable</p>
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        ))}
      </div>

      <CustomizationInfo />
    </div>
  );
}

