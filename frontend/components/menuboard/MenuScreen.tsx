"use client";

import React from "react";
import { MenuItem } from "@/types/menuboard";
import MenuBoardItem from "./MenuBoardItem";
import CustomizationInfo from "./CustomizationInfo";

interface MenuScreenProps {
  items: MenuItem[];
}

export default function MenuScreen({ items }: MenuScreenProps) {
  const categories = Array.from(new Set(items.map(i => i.category)));

  return (
    <div className="w-full h-screen p-8 bg-[#FAF3E0] text-[#2D3436] overflow-hidden">
      
      {/* This wrapper makes the content scroll INSIDE the screen */}
      <div className="h-full overflow-y-auto pr-4">
        {/* Include Categories */}
        {categories.map(category => (
          <div key={category} className="mb-12">
            <h2 className="text-4xl font-bold mb-6">{category}</h2>

            <div className="grid grid-cols-3 gap-8">
            {/* Include items from each category */}
              {items
                .filter(item => item.category === category)
                .map(item => (
                  <MenuBoardItem key={item.id} item={item} />
                ))}
            </div>
          </div>
        ))}

        <CustomizationInfo />
      </div>
    </div>
  );
}

