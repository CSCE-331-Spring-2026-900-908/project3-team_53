import MenuScreen from "@/components/menuboard/MenuScreen";
import { MenuItem } from "@/types/menuboard";

export default async function MenuBoardPage() {
  const res = await fetch("https://project3-team-53-backend.vercel.app/api/menu-items", {
    cache: "no-store", // ensures fresh data every time
  });

  if (!res.ok) {
    throw new Error("Failed to fetch menu items");
  }

  const items: MenuItem[] = await res.json();

  return (
    // The MenuScreen component is responsible for displaying the menu items and customization info.
    <div className="w-full h-full">
      <MenuScreen items={items} />
    </div>
  );
}
