'use client';

import MenuScreen from "@/components/menuboard/MenuScreen";
import { MenuItem } from "@/types/menuboard";
import { useEffect, useState } from "react";
import { Get } from "@/utils/apiService";

export default function MenuBoardPage() {
  const [items, setItems] = useState<MenuItem[]>([]);

  useEffect(() => {
    Get('/menu-items')
      .then(setItems)
      .catch(console.error);
  }, []);

  return (
    <div className="w-full h-full">
      <MenuScreen items={items} />
    </div>
  );
}
