export interface KitchenMenuItem {
  id: number;
  name: string;
  category: string;
  price: number;
}

export interface KitchenOrderItem {
  id: number;
  menuItem: KitchenMenuItem;
  quantity: number;
  size: string;
  sugar_level: string;
  ice_level: string;
  toppings: string[];
  item_price: number;
}

export interface KitchenOrder {
  id: number;
  status: string;
  order_type: string;
  total: number;
  created_at: string;
  completed_at: string | null;
  items: KitchenOrderItem[];
}

export interface DayStats {
  totalOrders: number;
  completedOrders: number;
  avgWaitSeconds: number;
  longestWaitSeconds: number;
}

export type TimeTier = 'green' | 'yellow' | 'orange' | 'red';

export const TIME_THRESHOLDS = {
  yellow: 5 * 60,
  orange: 10 * 60,
  red: 15 * 60,
} as const;

export function elapsedSeconds(createdAt: string): number {
  return Math.max(0, Math.floor((Date.now() - new Date(createdAt).getTime()) / 1000));
}

export function getTimeTier(seconds: number): TimeTier {
  if (seconds >= TIME_THRESHOLDS.red) return 'red';
  if (seconds >= TIME_THRESHOLDS.orange) return 'orange';
  if (seconds >= TIME_THRESHOLDS.yellow) return 'yellow';
  return 'green';
}

export function formatElapsed(totalSeconds: number): string {
  const clamped = Math.max(0, totalSeconds);
  const mins = Math.floor(clamped / 60);
  const secs = clamped % 60;
  return `${mins}m ${secs.toString().padStart(2, '0')}s`;
}
