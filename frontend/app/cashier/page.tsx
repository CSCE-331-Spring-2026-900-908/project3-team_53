'use client';
import { useState, useEffect } from 'react';
import { Post } from '@/utils/apiService';

// Menu data with categories and items
const MENU = [
  { category: 'Milk Tea', items: [
    { id: 1, name: 'Classic Milk Tea', price: 5.50 },
    { id: 2, name: 'Taro Milk Tea', price: 6.00 },
    { id: 3, name: 'Brown Sugar Milk Tea', price: 6.50 },
    { id: 4, name: 'Jasmine Milk Tea', price: 5.75 },
  ]},
  { category: 'Fruit Tea', items: [
    { id: 5, name: 'Strawberry Fruit Tea', price: 5.50 },
    { id: 6, name: 'Mango Fruit Tea', price: 5.75 },
    { id: 7, name: 'Passion Fruit Tea', price: 6.00 },
    { id: 8, name: 'Lychee Fruit Tea', price: 5.50 },
  ]},
  { category: 'Smoothies', items: [
    { id: 9, name: 'Taro Smoothie', price: 6.50 },
    { id: 10, name: 'Mango Smoothie', price: 6.50 },
    { id: 11, name: 'Strawberry Smoothie', price: 6.75 },
  ]},
  { category: 'Snacks', items: [
    { id: 12, name: 'Egg Waffle', price: 4.00 },
    { id: 13, name: 'Popcorn Chicken', price: 5.00 },
  ]},
];

// Customization options
const SUGAR_LEVELS = ['0%', '25%', '50%', '75%', '100%'];
const ICE_LEVELS = ['No Ice', 'Less Ice', 'Regular Ice', 'Extra Ice'];
const TOPPINGS = [
  { name: 'Boba Pearls', price: 0.75 },
  { name: 'Pudding', price: 0.75 },
  { name: 'Lychee Jelly', price: 0.75 },
  { name: 'Grass Jelly', price: 0.75 },
  { name: 'Aloe Vera', price: 0.75 },
  { name: 'Red Bean', price: 0.75 },
];

type Topping = { name: string; price: number };
type OrderItem = {
  id: number;
  name: string;
  basePrice: number;
  sugar: string;
  ice: string;
  toppings: Topping[];
  qty: number;
  key: string;
};
type MenuItem = { id: number; name: string; price: number };

// Generates a random order number like #A1B2
function generateOrderNumber(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '#';
  for (let i = 0; i < 4; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export default function CashierPage() {
  const [activeCategory, setActiveCategory] = useState('Milk Tea');
  const [order, setOrder] = useState<OrderItem[]>([]);
  const [paid, setPaid] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Modal state
  const [modalItem, setModalItem] = useState<MenuItem | null>(null);
  const [sugar, setSugar] = useState('100%');
  const [ice, setIce] = useState('Regular Ice');
  const [selectedToppings, setSelectedToppings] = useState<Topping[]>([]);

  const currentItems = MENU.find(m => m.category === activeCategory)?.items ?? [];

  // Check if the item currently in the modal is a snack
  const isSnack = MENU.find(m => m.category === 'Snacks')?.items.some(i => i.id === modalItem?.id) ?? false;

  // Close customization modal when Escape key is pressed
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setModalItem(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const openModal = (item: MenuItem) => {
    setModalItem(item);
    setSugar('100%');
    setIce('Regular Ice');
    setSelectedToppings([]);
  };

  const toggleTopping = (topping: Topping) => {
    setSelectedToppings(prev =>
      prev.find(t => t.name === topping.name)
        ? prev.filter(t => t.name !== topping.name)
        : [...prev, topping]
    );
  };

  const confirmAdd = () => {
    if (!modalItem) return;
    const toppingTotal = selectedToppings.reduce((s, t) => s + t.price, 0);
    const key = `${modalItem.id}-${sugar}-${ice}-${selectedToppings.map(t => t.name).join(',')}`;
    setOrder(prev => {
      const existing = prev.find(o => o.key === key);
      if (existing) return prev.map(o => o.key === key ? { ...o, qty: o.qty + 1 } : o);
      return [...prev, {
        id: modalItem.id,
        name: modalItem.name,
        basePrice: modalItem.price + toppingTotal,
        sugar: isSnack ? 'N/A' : sugar,
        ice: isSnack ? 'N/A' : ice,
        toppings: selectedToppings,
        qty: 1,
        key,
      }];
    });
    setModalItem(null);
  };

  const removeItem = (key: string) => {
    setOrder(prev => prev.flatMap(o => {
      if (o.key !== key) return [o];
      if (o.qty > 1) return [{ ...o, qty: o.qty - 1 }];
      return [];
    }));
  };

  const addQty = (key: string) => {
    setOrder(prev => prev.map(o => o.key === key ? { ...o, qty: o.qty + 1 } : o));
  };

  const clearOrder = () => { setOrder([]); setPaid(false); setOrderNumber(''); };

  const subtotal = order.reduce((sum, o) => sum + o.basePrice * o.qty, 0);
  const tax = subtotal * 0.0825;
  const total = subtotal + tax;

  // Submit order to backend, then show confirmation
  const handlePayment = async () => {
    if (order.length === 0 || isSubmitting) return;
    setIsSubmitting(true);

    const payload = {
      order_type: 'cashier',
      total: parseFloat(total.toFixed(2)),
      items: order.flatMap(o =>
        Array.from({ length: o.qty }, () => ({
          menuItemId: o.id,
          quantity: 1,
          size: 'Regular',
          sugar_level: o.sugar,
          ice_level: o.ice,
          toppings: o.toppings.map(t => t.name),
          item_price: parseFloat(o.basePrice.toFixed(2)),
        }))
      ),
    };

    try {
      await Post('/api/orders', payload);
      const num = generateOrderNumber();
      setOrderNumber(num);
      setPaid(true);
      setTimeout(() => { setOrder([]); setPaid(false); setOrderNumber(''); }, 3000);
    } catch (err) {
      console.error('Order failed:', err);
      alert('Failed to submit order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'Arial, sans-serif', backgroundColor: '#1a1a2e', overflow: 'hidden' }}>

      {/* LEFT: Menu panel */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', borderRight: '2px solid #333' }}>
        <div style={{ backgroundColor: '#16213e', padding: '16px 24px', borderBottom: '2px solid #333' }}>
          <h1 style={{ color: '#e94560', margin: 0, fontSize: '1.4rem', fontWeight: 'bold' }}>
            🧋 Team 53 – Cashier POS
          </h1>
        </div>

        {/* Category tabs */}
        <div style={{ display: 'flex', backgroundColor: '#16213e', borderBottom: '2px solid #333' }}>
          {MENU.map(m => (
            <button key={m.category} onClick={() => setActiveCategory(m.category)} style={{
              flex: 1, padding: '14px 8px', border: 'none', cursor: 'pointer', fontSize: '1rem', fontWeight: 'bold',
              backgroundColor: activeCategory === m.category ? '#e94560' : 'transparent',
              color: activeCategory === m.category ? '#fff' : '#aaa',
              borderBottom: activeCategory === m.category ? '3px solid #fff' : '3px solid transparent',
            }}>
              {m.category}
            </button>
          ))}
        </div>

        {/* Menu items grid */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', alignContent: 'start' }}>
          {currentItems.map(item => (
            <button key={item.id} onClick={() => openModal(item)} style={{
              backgroundColor: '#16213e', border: '2px solid #0f3460', borderRadius: '12px',
              padding: '20px 16px', cursor: 'pointer', textAlign: 'left', color: '#fff',
            }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = '#e94560')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = '#0f3460')}
            >
              <div style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '6px' }}>{item.name}</div>
              <div style={{ color: '#e94560', fontSize: '1.1rem', fontWeight: 'bold' }}>${item.price.toFixed(2)}</div>
            </button>
          ))}
        </div>
      </div>

      {/* RIGHT: Order panel */}
      <div style={{ width: '360px', display: 'flex', flexDirection: 'column', backgroundColor: '#16213e' }}>

        {/* Order header with item count badge */}
        <div style={{ padding: '16px 24px', borderBottom: '2px solid #333', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 style={{ color: '#fff', margin: 0, fontSize: '1.2rem' }}>Current Order</h2>
          {order.length > 0 && (
            <span style={{
              backgroundColor: '#e94560',
              color: '#fff',
              borderRadius: '50%',
              width: '28px',
              height: '28px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              fontSize: '0.9rem',
            }}>
              {order.reduce((sum, o) => sum + o.qty, 0)}
            </span>
          )}
        </div>

        {/* Order items list */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '12px' }}>
          {order.length === 0 ? (
            <p style={{ color: '#666', textAlign: 'center', marginTop: '40px' }}>No items added yet</p>
          ) : (
            order.map(o => (
              <div key={o.key} style={{ padding: '10px 12px', marginBottom: '8px', backgroundColor: '#0f3460', borderRadius: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ color: '#fff', fontSize: '0.9rem', fontWeight: 'bold' }}>{o.name}</div>
                    {o.sugar !== 'N/A' && (
                      <div style={{ color: '#aaa', fontSize: '0.75rem', marginTop: '2px' }}>
                        Sugar: {o.sugar} · Ice: {o.ice}
                      </div>
                    )}
                    {o.toppings.length > 0 && (
                      <div style={{ color: '#aaa', fontSize: '0.75rem' }}>
                        + {o.toppings.map(t => t.name).join(', ')}
                      </div>
                    )}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button onClick={() => removeItem(o.key)} style={{ width: '28px', height: '28px', borderRadius: '50%', border: 'none', backgroundColor: '#e94560', color: '#fff', cursor: 'pointer', fontWeight: 'bold' }}>−</button>
                    <span style={{ color: '#fff', minWidth: '20px', textAlign: 'center', fontWeight: 'bold' }}>{o.qty}</span>
                    <button onClick={() => addQty(o.key)} style={{ width: '28px', height: '28px', borderRadius: '50%', border: 'none', backgroundColor: '#2ecc71', color: '#fff', cursor: 'pointer', fontWeight: 'bold' }}>+</button>
                  </div>
                </div>
                <div style={{ color: '#e94560', fontWeight: 'bold', textAlign: 'right', marginTop: '4px' }}>
                  ${(o.basePrice * o.qty).toFixed(2)}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Totals and payment */}
        <div style={{ padding: '16px 20px', borderTop: '2px solid #333', backgroundColor: '#0f3460' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#aaa', marginBottom: '6px' }}>
            <span>Subtotal</span><span>${subtotal.toFixed(2)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#aaa', marginBottom: '10px' }}>
            <span>Tax (8.25%)</span><span>${tax.toFixed(2)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#fff', fontSize: '1.3rem', fontWeight: 'bold', marginBottom: '16px' }}>
            <span>Total</span><span>${total.toFixed(2)}</span>
          </div>

          {(
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button onClick={handlePayment} disabled={order.length === 0 || isSubmitting} style={{
                padding: '16px',
                backgroundColor: order.length === 0 || isSubmitting ? '#555' : '#2ecc71',
                color: '#fff', border: 'none', borderRadius: '10px', fontSize: '1.1rem', fontWeight: 'bold',
                cursor: order.length === 0 || isSubmitting ? 'not-allowed' : 'pointer',
              }}>
                {isSubmitting ? 'Submitting...' : '💳 Process Payment'}
              </button>
              <button onClick={clearOrder} disabled={order.length === 0} style={{
                padding: '12px', backgroundColor: order.length === 0 ? '#333' : '#e94560',
                color: '#fff', border: 'none', borderRadius: '10px', fontSize: '1rem',
                cursor: order.length === 0 ? 'not-allowed' : 'pointer',
              }}>
                🗑 Clear Order
              </button>
            </div>
          )}

        </div>
      </div>

      {/* FULL SCREEN: Transaction complete overlay */}
      {paid && (
        <div style={{
          position: 'fixed', inset: 0, backgroundColor: '#0f3460',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          zIndex: 200, animation: 'fadeIn 0.3s ease',
        }}>
          <div style={{ fontSize: '5rem', marginBottom: '24px' }}>✅</div>
          <h1 style={{ color: '#2ecc71', fontSize: '2.5rem', margin: 0, fontWeight: 'bold' }}>Transaction Complete</h1>
          <div style={{ color: '#fff', fontSize: '1.8rem', marginTop: '16px', letterSpacing: '4px', fontWeight: 'bold' }}>
            Order {orderNumber}
          </div>
          <p style={{ color: '#aaa', fontSize: '1rem', marginTop: '32px' }}>Returning to cashier...</p>
        </div>
      )}

      {/* MODAL: Drink customization popup */}
      {modalItem && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ backgroundColor: '#16213e', borderRadius: '16px', padding: '28px', width: '420px', maxHeight: '85vh', overflowY: 'auto', border: '2px solid #0f3460' }}>
            <h2 style={{ color: '#fff', marginTop: 0 }}>{modalItem.name}</h2>
            <p style={{ color: '#aaa', marginTop: '-12px' }}>Base price: ${modalItem.price.toFixed(2)}</p>

            {/* Sugar level selector — hidden for snacks */}
            {!isSnack && (
              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ color: '#e94560', marginBottom: '10px' }}>Sugar Level</h3>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {SUGAR_LEVELS.map(s => (
                    <button key={s} onClick={() => setSugar(s)} style={{
                      padding: '8px 16px', borderRadius: '20px', border: '2px solid',
                      borderColor: sugar === s ? '#e94560' : '#0f3460',
                      backgroundColor: sugar === s ? '#e94560' : 'transparent',
                      color: '#fff', cursor: 'pointer', fontWeight: 'bold',
                    }}>{s}</button>
                  ))}
                </div>
              </div>
            )}

            {/* Ice level selector — hidden for snacks */}
            {!isSnack && (
              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ color: '#e94560', marginBottom: '10px' }}>Ice Level</h3>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {ICE_LEVELS.map(i => (
                    <button key={i} onClick={() => setIce(i)} style={{
                      padding: '8px 16px', borderRadius: '20px', border: '2px solid',
                      borderColor: ice === i ? '#e94560' : '#0f3460',
                      backgroundColor: ice === i ? '#e94560' : 'transparent',
                      color: '#fff', cursor: 'pointer', fontWeight: 'bold',
                    }}>{i}</button>
                  ))}
                </div>
              </div>
            )}

            {/* Toppings selector — hidden for snacks */}
            {!isSnack && (
              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ color: '#e94560', marginBottom: '10px' }}>Toppings (+$0.75 each)</h3>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {TOPPINGS.map(t => {
                    const selected = !!selectedToppings.find(s => s.name === t.name);
                    return (
                      <button key={t.name} onClick={() => toggleTopping(t)} style={{
                        padding: '8px 16px', borderRadius: '20px', border: '2px solid',
                        borderColor: selected ? '#2ecc71' : '#0f3460',
                        backgroundColor: selected ? '#2ecc71' : 'transparent',
                        color: '#fff', cursor: 'pointer', fontWeight: 'bold',
                      }}>{t.name}</button>
                    );
                  })}
                </div>
              </div>
            )}

            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => setModalItem(null)} style={{
                flex: 1, padding: '14px', backgroundColor: '#333', color: '#fff',
                border: 'none', borderRadius: '10px', fontSize: '1rem', cursor: 'pointer',
              }}>Cancel</button>
              <button onClick={confirmAdd} style={{
                flex: 2, padding: '14px', backgroundColor: '#e94560', color: '#fff',
                border: 'none', borderRadius: '10px', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer',
              }}>
                Add to Order – ${(modalItem.price + selectedToppings.reduce((s, t) => s + t.price, 0)).toFixed(2)}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}