export interface MenuItem {
  id: number;
  name: string;
  category: string;
  price: number;
  image: string | null;
  imageFocusX: number;
  imageFocusY: number;
  available: boolean;
}
