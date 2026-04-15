type OrderItem = {
  name: string;
  quantity: number;
};

type OrderProps = {
  order: {
    id: number;
    items: OrderItem[];
    createdAt: string;
  };
  onComplete: (id: number) => void;
};

export default function OrderCard({ order, onComplete }: OrderProps) {
  return (
    <div
      style={{
        border: "2px solid var(--color-border)",
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
        onClick={() => onComplete(order.id)}
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
  );
}