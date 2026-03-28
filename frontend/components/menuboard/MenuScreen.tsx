"use client";

import React from "react";
import { MenuItem } from "@/types/menuboard";
import MenuBoardItem from "./MenuBoardItem";

interface MenuScreenProps {
  items: MenuItem[];
}

export default function MenuScreen({ items }: MenuScreenProps) {
  // Optional: group items by category
  const categories = Array.from(new Set(items.map(i => i.category)));

  return (
    <div className="w-full h-full p-8 bg-black text-white">
      {categories.map(category => (
        <div key={category} className="mb-12">
          <h2 className="text-4xl font-bold mb-6">{category}</h2>

          <div className="grid grid-cols-3 gap-8">
            {items
              .filter(item => item.category === category)
              .map(item => (
                <MenuBoardItem key={item.id} item={item} />
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}
