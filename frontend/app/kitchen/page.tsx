"use client";

import { useEffect, useState } from "react";
import axios from "axios";

type OrderItem = {
  name: string;
  quantity: number;
};

type Order = {
  id: number;
  items: OrderItem[];
  createdAt: string;
};

export default function KitchenPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch orders
  const fetchOrders = async () => {
    try {
      const res = await axios.get("/api/orders?status=pending");
      setOrders(res.data);
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();

    // Auto-refresh every 5 seconds
    const interval = setInterval(fetchOrders, 5000);
    return () => clearInterval(interval);
  }, []);

  // Mark order complete
  const completeOrder = async (id: number) => {
    try {
      await axios.patch(`/api/orders/${id}/complete`);
      setOrders((prev) => prev.filter((o) => o.id !== id));
    } catch (err) {
      console.error("Error completing order:", err);
    }
  };

  if (loading) return <p>Loading orders...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Kitchen Dashboard</h1>

      {orders.length === 0 ? (
        <p>No pending orders 🎉</p>
      ) : (
        orders.map((order) => (
          <div
            key={order.id}
            style={{
              border: "2px solid #ccc",
              borderRadius: "10px",
              padding: "15px",
              marginBottom: "15px",
            }}
          >
            <h2>Order #{order.id}</h2>
            <p>
              <strong>Time:</strong>{" "}
              {new Date(order.createdAt).toLocaleTimeString()}
            </p>

            <ul>
              {order.items.map((item, index) => (
                <li key={index}>
                  {item.name} x{item.quantity}
                </li>
              ))}
            </ul>

            <button
              onClick={() => completeOrder(order.id)}
              style={{
                marginTop: "10px",
                padding: "10px 15px",
                backgroundColor: "green",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              ✅ Complete Order
            </button>
          </div>
        ))
      )}
    </div>
  );
}