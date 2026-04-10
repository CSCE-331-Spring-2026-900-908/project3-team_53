export interface ManagerOrder {
  id: number;
  status: string;
  order_type: string;
  total: number;
  payment_type: string;
  customer_name: string | null;
  customer_phone: string | null;
  created_at: string;
  completed_at: string | null;
}
