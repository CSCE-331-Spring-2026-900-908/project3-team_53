import React from "react";
import { MenuItem } from "@/types/menuboard";

interface MenuBoardItemProps {
  item: MenuItem;
}

export default function MenuBoardItem({ item }: MenuBoardItemProps) {
  return (
    <div className="flex flex-col items-center text-center p-4 bg-[#FFF8EE] rounded-lg shadow-lg">
      {item.image && (
        <img
          src={item.image}
          alt={item.name}
          className="w-40 h-40 object-cover rounded-md mb-4"
        />
      )}

      <h3 className="text-2xl font-semibold text-[#2D3436]">{item.name}</h3>

      <p className="text-xl mt-2 text-[#FF6B6B]">${Number(item.price).toFixed(2)}</p>

      {!item.available && (
        <p className="text-red-400 text-lg mt-2">Unavailable</p>
      )}
    </div>
  );
}
