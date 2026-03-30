import MenuScreen from "@/components/menuboard/MenuScreen";
import { MenuItem } from "@/types/menuboard";

export default async function MenuBoardPage() {
  //uncomment line below for local development
  //const res = await fetch("http://localhost:3001/api/menu-items", {

  //Comment this line out for local development. Uncomment for production
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
