'use client';
import React from "react";
import { MenuItem } from "@/types/menuboard";
import { publicAssetUrl } from "@/utils/publicAssetUrl";

interface MenuBoardItemProps {
  item: MenuItem;
}

export default function MenuBoardItem({ item }: MenuBoardItemProps) {
  const imgSrc = publicAssetUrl(item.image);
  return (
    <div className="flex flex-col items-center text-center p-4 bg-[var(--color-cream-light)] rounded-lg shadow-lg">
      {/* Show image if it exists */}
      {imgSrc && (
        <img
          src={imgSrc}
          alt={item.name}
          className="w-40 h-40 object-cover rounded-md mb-4"
        />
      )}

      <h3 className="text-2xl font-semibold text-[var(--color-kiosk-text)]">{item.name}</h3>

      <p className="text-xl mt-2 text-[var(--color-accent-coral)]">${Number(item.price).toFixed(2)}</p>

      {/* Show unavailable message if the item is not available */}
      {!item.available && (
        <p className="text-red-400 text-lg mt-2">Unavailable</p>
      )}
    </div>
  );
}
