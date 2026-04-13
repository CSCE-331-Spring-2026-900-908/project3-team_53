export interface MenuItem {
  id: number;
  name: string;
  category: string;
  price: number;
  image: string | null;
  available: boolean;
}

export type KioskStep = 'welcome' | 'menu' | 'checkout' | 'payment' | 'confirmation';
export type OrderType = 'dine_in' | 'carry_out';
export type PaymentType = 'credit_card' | 'cash' | 'dining_dollars';

export const SIZES = ['Small', 'Regular', 'Large'] as const;
export type Size = (typeof SIZES)[number];

export const SUGAR_LEVELS = ['0%', '25%', '50%', '75%', '100%'] as const;
export type SugarLevel = (typeof SUGAR_LEVELS)[number];

export const ICE_LEVELS = ['No Ice', 'Less Ice', 'Regular', 'Extra Ice'] as const;
export type IceLevel = (typeof ICE_LEVELS)[number];

export interface ToppingItem {
  id: number;
  name: string;
  category: string;
  price: number;
  image: string | null;
  available: boolean;
}

export interface CartItem {
  cartId: string;
  menuItem: MenuItem;
  quantity: number;
  size: Size;
  sugarLevel: SugarLevel;
  iceLevel: IceLevel;
  toppings: string[];
}

export interface PlacedOrder {
  id: number;
  status: string;
  order_type: string;
  total: number;
  payment_type?: string;
  change_due?: number;
  customer_name?: string;
  customer_phone?: string;
  created_at: string;
}
