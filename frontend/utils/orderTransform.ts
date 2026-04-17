import { ManagerOrder, Order } from "@/types/orders";

const statusMap: Record<string, string> = {
  completed: "Completed",
  pending: "Pending",
};

const paymentMap: Record<string, string> = {
  credit_card: "Credit Card",
  cash: "Cash",
  dining_dollars: "Dining Dollars",
};

const orderTypeMap: Record<string, string> = {
  dine_in: "Dine-In",
  carry_out: "Carry-Out",
};

function formatDate(value: string | null): string {
  if (!value) return "";
  return new Date(value).toLocaleString();
}

function formatTotal(value: number): string {
  return `$${value.toFixed(2)}`;
}

export function transformOrder(order: ManagerOrder): Order {
  return {
    id: order.id,

    status: statusMap[order.status] ?? order.status,

    orderType: orderTypeMap[order.order_type] ?? order.order_type,

    paymentType: paymentMap[order.payment_type] ?? order.payment_type,

    total: formatTotal(order.total),

    customerName: order.customer_name ?? `Customer ${order.id}`,

    customerPhone: order.customer_phone ?? "No phone",

    createdAt: formatDate(order.created_at),

    completedAt: formatDate(order.completed_at),
  };
}