import MenuScreen from "@/components/menuboard/MenuScreen";
import { MenuItem } from "@/types/menuboard";

// Server-side fetching: no 'use client'
export default async function MenuBoardPage() {
  let items: MenuItem[] = [];

  try {
    // Fetch backend data server-side
    const res = await fetch(
      "https://project3-team-53-backend.vercel.app/api/menu-items",
      { cache: "no-store" } // ensures fresh data every time
    );

    if (!res.ok) throw new Error("Failed to fetch menu items");

    const data = await res.json();

    // Map backend keys to frontend MenuItem interface
    items = data.map((item: any) => ({
      id: item.id,
      name: item.title || item.name,
      category: item.category_name || item.category,
      price: item.cost || item.price,
      image: item.image_url || item.image,
      available: item.is_available ?? item.available,
    }));
  } catch (err) {
    console.error("Error fetching menu items:", err);

    // Optional: fallback items if fetch fails
    items = [
      { id: 1, name: "Classic Milk Tea", category: "Milk Tea", price: 5.5, image: null, available: true },
      { id: 2, name: "Taro Milk Tea", category: "Milk Tea", price: 6, image: null, available: true },
      { id: 3, name: "Mango Green Tea", category: "Fruit Tea", price: 5.5, image: null, available: true },
    ];
  }

  return (
    <div className="w-full h-full">
      <MenuScreen items={items} />
    </div>
  );
}