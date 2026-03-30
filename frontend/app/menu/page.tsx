'use client';

import { useEffect, useState } from "react";
import MenuScreen from "@/components/menuboard/MenuScreen";
import { MenuItem } from "@/types/menuboard";
import { Get } from "@/utils/apiService";

export default function MenuBoardPage() {
  const [items, setItems] = useState<MenuItem[]>([]);

  useEffect(() => {
    Get('/menu-items')
      .then((data: any[]) => {
        const mappedItems: MenuItem[] = data.map(item => ({
          id: item.id,
          name: item.title || item.name,
          category: item.category_name || item.category,
          price: item.cost || item.price,
          image: item.image_url || item.image,
          available: item.is_available ?? item.available,
        }));
        setItems(mappedItems);
      })
      .catch(console.error);
  }, []);

  return (
    <div className="w-full h-full">
      <MenuScreen items={items} />
    </div>
  );
}