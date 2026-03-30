'use client';
import React from "react";
export default function CustomizationInfo() {
  {/* This is just a static component to show the available customization options for drinks. */}
  return (
    <div className="text-[#2D3436] mt-12">
      <h2 className="text-3xl font-bold mb-4">Drink Options</h2>

      <div className="grid grid-cols-2 gap-6 text-xl">
        <div>
          <h3 className="font-semibold text-2xl mb-2">Sizes</h3>
          <p>Small, Regular, Large</p>
        </div>

        <div>
          <h3 className="font-semibold text-2xl mb-2">Sugar Levels</h3>
          <p>0%, 25%, 50%, 75%, 100%</p>
        </div>

        <div>
          <h3 className="font-semibold text-2xl mb-2">Ice Levels</h3>
          <p>No Ice, Less Ice, Regular, Extra Ice</p>
        </div>

        <div>
          <h3 className="font-semibold text-2xl mb-2">Toppings</h3>
          <p>Boba, Crystal Boba, Coconut Jelly, Aloe Vera, Pudding, Red Bean</p>
        </div>
      </div>
    </div>
  );
}
