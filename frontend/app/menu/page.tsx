import MenuScreen from "@/components/menuboard/MenuScreen";
import { MenuItem } from "@/types/menuboard";

export default async function MenuBoardPage() {
  const res = await fetch("http://localhost:3001/api/menu-items", {
    cache: "no-store", // ensures fresh data every time
  });

  if (!res.ok) {
    throw new Error("Failed to fetch menu items");
  }

  const items: MenuItem[] = await res.json();

  return (
    <div className="w-full h-full">
      <MenuScreen items={items} />
    </div>
  );
}
