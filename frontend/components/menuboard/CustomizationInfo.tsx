'use client';
import React, { useEffect, useState } from "react";
import { Get } from '@/utils/apiService';

interface ToppingData {
  id: number;
  name: string;
  category: string;
  price: number;
  available: boolean;
}

export default function CustomizationInfo() {
  const [toppingNames, setToppingNames] = useState<string[]>([]);

  useEffect(() => {
    Get('/topping-items')
      .then((data) => {
        if (Array.isArray(data)) {
          const names = data
            .filter((t: ToppingData) => t.category !== 'Size' && t.available)
            .map((t: ToppingData) => t.name);
          setToppingNames(names);
        }
      })
      .catch(() => {});
  }, []);

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
          <p>{toppingNames.length > 0 ? toppingNames.join(', ') : 'Loading...'}</p>
        </div>
      </div>
    </div>
  );
}
