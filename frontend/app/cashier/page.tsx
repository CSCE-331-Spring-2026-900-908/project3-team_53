'use client';
import { useState, useEffect } from 'react';
import { Post } from '@/utils/apiService';

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

const DISCOUNTS = [
  { label: '🎓 Student ID', pct: 15 },
  { label: '🎖️ Military / Fire / Police', pct: 25 },
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

function generateOrderNumber(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '#';
  for (let i = 0; i < 4; i++) result += chars.charAt(Math.floor(Math.random() * chars.length));
  return result;
}

export default function CashierPage() {
  const [activeCategory, setActiveCategory] = useState('Milk Tea');
  const [order, setOrder] = useState<OrderItem[]>([]);
  const [paid, setPaid] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showVoidConfirm, setShowVoidConfirm] = useState(false);

  // Discount state
  const [showDiscountModal, setShowDiscountModal] = useState(false);
  const [appliedDiscount, setAppliedDiscount] = useState<{ label: string; pct: number } | null>(null);

  // Payment flow state
  const [showPaymentSelect, setShowPaymentSelect] = useState(false);
  const [showCustomerScreen, setShowCustomerScreen] = useState(false);
  const [pendingPaymentType, setPendingPaymentType] = useState<string | null>(null);
  const [paymentType, setPaymentType] = useState<string | null>(null);
  const [tipAmount, setTipAmount] = useState(0);
  const [customTip, setCustomTip] = useState('');
  const [selectedTipPct, setSelectedTipPct] = useState<number | null>(null);

  // Customization modal state
  const [modalItem, setModalItem] = useState<MenuItem | null>(null);
  const [sugar, setSugar] = useState('100%');
  const [ice, setIce] = useState('Regular Ice');
  const [selectedToppings, setSelectedToppings] = useState<Topping[]>([]);
  const [editingKey, setEditingKey] = useState<string | null>(null);

  const currentItems = MENU.find(m => m.category === activeCategory)?.items ?? [];
  const isSnack = MENU.find(m => m.category === 'Snacks')?.items.some(i => i.id === modalItem?.id) ?? false;

  const subtotal = order.reduce((sum, o) => sum + o.basePrice * o.qty, 0);
  const discountAmt = appliedDiscount ? parseFloat((subtotal * appliedDiscount.pct / 100).toFixed(2)) : 0;
  const discountedSubtotal = subtotal - discountAmt;
  const tax = discountedSubtotal * 0.0825;
  const total = discountedSubtotal + tax;
  const computedTip = selectedTipPct !== null
    ? parseFloat((total * selectedTipPct / 100).toFixed(2))
    : parseFloat(customTip) || 0;
  const grandTotal = total + computedTip;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => { if (e.key === 'Escape') setModalItem(null); };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const clearOrder = () => {
    setOrder([]); setPaid(false); setOrderNumber('');
    setPaymentType(null); setShowPaymentSelect(false);
    setShowCustomerScreen(false); setPendingPaymentType(null);
    setTipAmount(0); setCustomTip(''); setSelectedTipPct(null);
    setAppliedDiscount(null);
  };

  const openModal = (item: MenuItem) => {
    setModalItem(item); setSugar('100%'); setIce('Regular Ice');
    setSelectedToppings([]); setEditingKey(null);
  };

  const openEditModal = (orderItem: OrderItem) => {
    const menuItem = MENU.flatMap(m => m.items).find(i => i.id === orderItem.id);
    if (!menuItem) return;
    setModalItem(menuItem);
    setSugar(orderItem.sugar === 'N/A' ? '100%' : orderItem.sugar);
    setIce(orderItem.ice === 'N/A' ? 'Regular Ice' : orderItem.ice);
    setSelectedToppings(orderItem.toppings);
    setEditingKey(orderItem.key);
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
    const newKey = `${modalItem.id}-${sugar}-${ice}-${selectedToppings.map(t => t.name).join(',')}`;
    if (editingKey) {
      setOrder(prev => prev.map(o => o.key !== editingKey ? o : {
        ...o, basePrice: modalItem.price + toppingTotal,
        sugar: isSnack ? 'N/A' : sugar, ice: isSnack ? 'N/A' : ice,
        toppings: selectedToppings, key: newKey,
      }));
    } else {
      setOrder(prev => {
        const existing = prev.find(o => o.key === newKey);
        if (existing) return prev.map(o => o.key === newKey ? { ...o, qty: o.qty + 1 } : o);
        return [...prev, {
          id: modalItem.id, name: modalItem.name,
          basePrice: modalItem.price + toppingTotal,
          sugar: isSnack ? 'N/A' : sugar, ice: isSnack ? 'N/A' : ice,
          toppings: selectedToppings, qty: 1, key: newKey,
        }];
      });
    }
    setModalItem(null); setEditingKey(null);
  };

  const removeItem = (key: string) => {
    setOrder(prev => prev.flatMap(o => {
      if (o.key !== key) return [o];
      if (o.qty > 1) return [{ ...o, qty: o.qty - 1 }];
      return [];
    }));
  };

  const addQty = (key: string) => setOrder(prev => prev.map(o => o.key === key ? { ...o, qty: o.qty + 1 } : o));

  const selectPaymentType = (type: string) => {
    setPendingPaymentType(type);
    setShowPaymentSelect(false);
    setSelectedTipPct(null);
    setCustomTip('');
    setShowCustomerScreen(true);
  };

  const handlePayment = async () => {
    if (order.length === 0 || isSubmitting || !pendingPaymentType) return;
    setIsSubmitting(true);
    setShowCustomerScreen(false);
    const tip = computedTip;

    const payload = {
      order_type: pendingPaymentType,
      total: parseFloat((total + tip).toFixed(2)),
      items: order.flatMap(o =>
        Array.from({ length: o.qty }, () => ({
          menuItemId: o.id, quantity: 1, size: 'Regular',
          sugar_level: o.sugar, ice_level: o.ice,
          toppings: o.toppings.map(t => t.name),
          item_price: parseFloat(o.basePrice.toFixed(2)),
        }))
      ),
    };

    try {
      await Post('/api/orders', payload);
      setOrderNumber(generateOrderNumber());
      setPaymentType(pendingPaymentType);
      setTipAmount(tip);
      setPaid(true);
      setTimeout(() => clearOrder(), 3000);
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
          <h1 style={{ color: '#e94560', margin: 0, fontSize: '1.4rem', fontWeight: 'bold' }}>🧋 Team 53 – Cashier POS</h1>
        </div>
        <div style={{ display: 'flex', backgroundColor: '#16213e', borderBottom: '2px solid #333' }}>
          {MENU.map(m => (
            <button key={m.category} onClick={() => setActiveCategory(m.category)} style={{
              flex: 1, padding: '14px 8px', border: 'none', cursor: 'pointer', fontSize: '1rem', fontWeight: 'bold',
              backgroundColor: activeCategory === m.category ? '#e94560' : 'transparent',
              color: activeCategory === m.category ? '#fff' : '#aaa',
              borderBottom: activeCategory === m.category ? '3px solid #fff' : '3px solid transparent',
            }}>{m.category}</button>
          ))}
        </div>
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
        <div style={{ padding: '16px 24px', borderBottom: '2px solid #333', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 style={{ color: '#fff', margin: 0, fontSize: '1.2rem' }}>Current Order</h2>
          {order.length > 0 && (
            <span style={{ backgroundColor: '#e94560', color: '#fff', borderRadius: '50%', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.9rem' }}>
              {order.reduce((sum, o) => sum + o.qty, 0)}
            </span>
          )}
        </div>

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
                      <div style={{ color: '#aaa', fontSize: '0.75rem', marginTop: '2px' }}>Sugar: {o.sugar} · Ice: {o.ice}</div>
                    )}
                    {o.toppings.length > 0 && (
                      <div style={{ color: '#aaa', fontSize: '0.75rem' }}>+ {o.toppings.map(t => t.name).join(', ')}</div>
                    )}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <button onClick={() => openEditModal(o)} style={{ padding: '4px 8px', borderRadius: '6px', border: '1px solid #333', backgroundColor: '#0f3460', color: '#aaa', cursor: 'pointer', fontSize: '0.7rem' }}>✏️</button>
                    <button onClick={() => removeItem(o.key)} style={{ width: '28px', height: '28px', borderRadius: '50%', border: 'none', backgroundColor: '#e94560', color: '#fff', cursor: 'pointer', fontWeight: 'bold' }}>−</button>
                    <span style={{ color: '#fff', minWidth: '20px', textAlign: 'center', fontWeight: 'bold' }}>{o.qty}</span>
                    <button onClick={() => addQty(o.key)} style={{ width: '28px', height: '28px', borderRadius: '50%', border: 'none', backgroundColor: '#2ecc71', color: '#fff', cursor: 'pointer', fontWeight: 'bold' }}>+</button>
                  </div>
                </div>
                <div style={{ color: '#e94560', fontWeight: 'bold', textAlign: 'right', marginTop: '4px' }}>${(o.basePrice * o.qty).toFixed(2)}</div>
              </div>
            ))
          )}
        </div>

        {/* Totals and payment */}
        <div style={{ padding: '16px 20px', borderTop: '2px solid #333', backgroundColor: '#0f3460' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#aaa', marginBottom: '6px' }}>
            <span>Subtotal</span><span>${subtotal.toFixed(2)}</span>
          </div>
          {appliedDiscount && (
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#2ecc71', marginBottom: '6px', fontSize: '0.9rem' }}>
              <span>{appliedDiscount.label} ({appliedDiscount.pct}% off)</span>
              <span>−${discountAmt.toFixed(2)}</span>
            </div>
          )}
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#aaa', marginBottom: '10px' }}>
            <span>Tax (8.25%)</span><span>${tax.toFixed(2)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#fff', fontSize: '1.3rem', fontWeight: 'bold', marginBottom: '16px' }}>
            <span>Total</span><span>${total.toFixed(2)}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button onClick={() => order.length > 0 && setShowPaymentSelect(true)} disabled={order.length === 0 || isSubmitting} style={{
              padding: '16px', backgroundColor: order.length === 0 || isSubmitting ? '#555' : '#2ecc71',
              color: '#fff', border: 'none', borderRadius: '10px', fontSize: '1.1rem', fontWeight: 'bold',
              cursor: order.length === 0 || isSubmitting ? 'not-allowed' : 'pointer',
            }}>
              {isSubmitting ? 'Submitting...' : '💳 Process Payment'}
            </button>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => order.length > 0 && setShowDiscountModal(true)} disabled={order.length === 0} style={{
                flex: 1, padding: '12px',
                backgroundColor: appliedDiscount ? '#1a4a2e' : order.length === 0 ? '#333' : '#0f3460',
                color: appliedDiscount ? '#2ecc71' : order.length === 0 ? '#666' : '#fff',
                border: appliedDiscount ? '2px solid #2ecc71' : '2px solid #333',
                borderRadius: '10px', fontSize: '0.9rem', cursor: order.length === 0 ? 'not-allowed' : 'pointer', fontWeight: 'bold',
              }}>
                {appliedDiscount ? `✅ ${appliedDiscount.pct}% Off` : '🏷️ Discount'}
              </button>
              <button onClick={() => order.length > 0 && setShowVoidConfirm(true)} disabled={order.length === 0} style={{
                flex: 1, padding: '12px', backgroundColor: order.length === 0 ? '#333' : '#e94560',
                color: '#fff', border: 'none', borderRadius: '10px', fontSize: '0.9rem',
                cursor: order.length === 0 ? 'not-allowed' : 'pointer', fontWeight: 'bold',
              }}>🗑 Void Order</button>
            </div>
          </div>
        </div>
      </div>

      {/* TRANSACTION COMPLETE */}
      {paid && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: '#0f3460', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 300 }}>
          <div style={{ fontSize: '5rem', marginBottom: '24px' }}>✅</div>
          <h1 style={{ color: '#2ecc71', fontSize: '2.5rem', margin: 0, fontWeight: 'bold' }}>Transaction Complete</h1>
          <div style={{ color: '#fff', fontSize: '1.8rem', marginTop: '16px', letterSpacing: '4px', fontWeight: 'bold' }}>Order {orderNumber}</div>
          <div style={{ color: '#aaa', fontSize: '1rem', marginTop: '12px' }}>
            {paymentType === 'cash' ? '💵 Cash' : paymentType === 'card' ? '💳 Card' : '📱 Mobile Pay'}
            {tipAmount > 0 && <span> · Tip: ${tipAmount.toFixed(2)}</span>}
            {appliedDiscount && <span> · {appliedDiscount.label}</span>}
          </div>
          <p style={{ color: '#aaa', fontSize: '1rem', marginTop: '32px' }}>Returning to cashier...</p>
        </div>
      )}

      {/* CASHIER: Payment type selection */}
      {showPaymentSelect && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200 }}>
          <div style={{ backgroundColor: '#16213e', borderRadius: '16px', padding: '32px', width: '400px', border: '2px solid #0f3460', textAlign: 'center' }}>
            <h2 style={{ color: '#fff', margin: '0 0 8px' }}>Select Payment Method</h2>
            <p style={{ color: '#aaa', marginBottom: '28px' }}>Total: <strong style={{ color: '#2ecc71', fontSize: '1.2rem' }}>${total.toFixed(2)}</strong></p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
              {[
                { type: 'card', label: '💳 Credit / Debit Card' },
                { type: 'cash', label: '💵 Cash' },
                { type: 'mobile', label: '📱 Mobile Pay' },
              ].map(({ type, label }) => (
                <button key={type} onClick={() => selectPaymentType(type)} style={{
                  padding: '18px', backgroundColor: '#0f3460', color: '#fff',
                  border: '2px solid #333', borderRadius: '12px', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer',
                }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = '#2ecc71')}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = '#333')}
                >{label}</button>
              ))}
            </div>
            <button onClick={() => setShowPaymentSelect(false)} style={{
              width: '100%', padding: '12px', backgroundColor: '#333', color: '#aaa',
              border: 'none', borderRadius: '10px', fontSize: '1rem', cursor: 'pointer',
            }}>Cancel</button>
          </div>
        </div>
      )}

      {/* CUSTOMER: Order summary + tip screen */}
      {showCustomerScreen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: '#0a0a1a', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 250, padding: '40px' }}>
          <h1 style={{ color: '#e94560', fontSize: '2rem', marginBottom: '8px' }}>🧋 Review Your Order</h1>
          <p style={{ color: '#aaa', marginBottom: '28px', fontSize: '1rem' }}>Please review and select a tip</p>

          <div style={{ width: '100%', maxWidth: '500px', backgroundColor: '#16213e', borderRadius: '16px', padding: '20px', marginBottom: '28px', maxHeight: '240px', overflowY: 'auto' }}>
            {order.map(o => (
              <div key={o.key} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #0f3460' }}>
                <div>
                  <div style={{ color: '#fff', fontSize: '1rem', fontWeight: 'bold' }}>{o.name} x{o.qty}</div>
                  {o.sugar !== 'N/A' && <div style={{ color: '#aaa', fontSize: '0.8rem' }}>Sugar: {o.sugar} · Ice: {o.ice}</div>}
                  {o.toppings.length > 0 && <div style={{ color: '#aaa', fontSize: '0.8rem' }}>+ {o.toppings.map(t => t.name).join(', ')}</div>}
                </div>
                <div style={{ color: '#e94560', fontWeight: 'bold', fontSize: '1rem' }}>${(o.basePrice * o.qty).toFixed(2)}</div>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#aaa', marginTop: '10px', fontSize: '0.9rem' }}>
              <span>Subtotal</span><span>${subtotal.toFixed(2)}</span>
            </div>
            {appliedDiscount && (
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#2ecc71', fontSize: '0.9rem' }}>
                <span>{appliedDiscount.label} ({appliedDiscount.pct}% off)</span>
                <span>−${discountAmt.toFixed(2)}</span>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#aaa', fontSize: '0.9rem' }}>
              <span>Tax (8.25%)</span><span>${tax.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#fff', fontWeight: 'bold', fontSize: '1.1rem', marginTop: '8px' }}>
              <span>Total</span><span>${total.toFixed(2)}</span>
            </div>
          </div>

          <div style={{ width: '100%', maxWidth: '500px' }}>
            <h2 style={{ color: '#fff', textAlign: 'center', marginBottom: '16px', fontSize: '1.3rem' }}>Add a Tip?</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '16px' }}>
              {[15, 18, 20].map(pct => {
                const amt = parseFloat((total * pct / 100).toFixed(2));
                const isSelected = selectedTipPct === pct;
                return (
                  <button key={pct} onClick={() => { setSelectedTipPct(pct); setCustomTip(''); }} style={{
                    padding: '20px 8px', borderRadius: '14px', border: `3px solid ${isSelected ? '#2ecc71' : '#333'}`,
                    backgroundColor: isSelected ? '#1a4a2e' : '#16213e', color: '#fff',
                    fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer', textAlign: 'center',
                  }}>
                    {pct}%<br /><span style={{ fontSize: '0.85rem', color: '#aaa' }}>${amt.toFixed(2)}</span>
                  </button>
                );
              })}
              <button onClick={() => { setSelectedTipPct(null); setCustomTip('0'); }} style={{
                padding: '20px 8px', borderRadius: '14px',
                border: `3px solid ${selectedTipPct === null && customTip === '0' ? '#e94560' : '#333'}`,
                backgroundColor: selectedTipPct === null && customTip === '0' ? '#3a1a1a' : '#16213e',
                color: '#aaa', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer',
              }}>No Tip</button>
            </div>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
              <input
                type="number" min="0" step="0.01" placeholder="Custom tip $"
                value={customTip}
                onChange={e => { setCustomTip(e.target.value); setSelectedTipPct(null); }}
                style={{ flex: 1, padding: '14px', backgroundColor: '#16213e', color: '#fff', border: '2px solid #333', borderRadius: '10px', fontSize: '1rem', outline: 'none' }}
              />
            </div>
            <div style={{ backgroundColor: '#16213e', borderRadius: '12px', padding: '14px 20px', marginBottom: '12px', display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#aaa' }}>Tip</span>
              <span style={{ color: '#2ecc71', fontWeight: 'bold' }}>${computedTip.toFixed(2)}</span>
            </div>
            <div style={{ backgroundColor: '#0f3460', borderRadius: '12px', padding: '14px 20px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#fff', fontSize: '1.2rem', fontWeight: 'bold' }}>Grand Total</span>
              <span style={{ color: '#2ecc71', fontWeight: 'bold', fontSize: '1.4rem' }}>${grandTotal.toFixed(2)}</span>
            </div>
            <button onClick={handlePayment} style={{
              width: '100%', padding: '20px', backgroundColor: '#2ecc71', color: '#fff',
              border: 'none', borderRadius: '14px', fontSize: '1.3rem', fontWeight: 'bold', cursor: 'pointer',
            }}>✅ Confirm & Pay ${grandTotal.toFixed(2)}</button>
            <button onClick={() => { setShowCustomerScreen(false); setShowPaymentSelect(true); }} style={{
              width: '100%', padding: '14px', backgroundColor: 'transparent', color: '#aaa',
              border: 'none', borderRadius: '10px', fontSize: '1rem', cursor: 'pointer', marginTop: '12px',
            }}>← Back</button>
          </div>
        </div>
      )}

      {/* DISCOUNT modal */}
      {showDiscountModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200 }}>
          <div style={{ backgroundColor: '#16213e', borderRadius: '16px', padding: '32px', width: '400px', border: '2px solid #2ecc71', textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '12px' }}>🏷️</div>
            <h2 style={{ color: '#fff', margin: '0 0 8px' }}>Apply Discount</h2>
            <p style={{ color: '#aaa', marginBottom: '24px' }}>Verify customer eligibility before applying</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
              {DISCOUNTS.map(d => {
                const isActive = appliedDiscount?.pct === d.pct;
                return (
                  <button key={d.pct} onClick={() => { setAppliedDiscount(isActive ? null : d); setShowDiscountModal(false); }} style={{
                    padding: '20px', backgroundColor: isActive ? '#1a4a2e' : '#0f3460', color: '#fff',
                    border: `2px solid ${isActive ? '#2ecc71' : '#333'}`, borderRadius: '12px',
                    fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer', textAlign: 'left',
                  }}>
                    <div>{d.label}</div>
                    <div style={{ color: '#2ecc71', fontSize: '0.9rem', marginTop: '4px' }}>
                      {d.pct}% off · saves ${(subtotal * d.pct / 100).toFixed(2)}
                      {isActive && ' ✅ Applied'}
                    </div>
                  </button>
                );
              })}
            </div>
            {appliedDiscount && (
              <button onClick={() => { setAppliedDiscount(null); setShowDiscountModal(false); }} style={{
                width: '100%', padding: '12px', backgroundColor: '#e94560', color: '#fff',
                border: 'none', borderRadius: '10px', fontSize: '1rem', cursor: 'pointer', marginBottom: '10px', fontWeight: 'bold',
              }}>Remove Discount</button>
            )}
            <button onClick={() => setShowDiscountModal(false)} style={{
              width: '100%', padding: '12px', backgroundColor: '#333', color: '#aaa',
              border: 'none', borderRadius: '10px', fontSize: '1rem', cursor: 'pointer',
            }}>Cancel</button>
          </div>
        </div>
      )}

      {/* VOID ORDER confirmation */}
      {showVoidConfirm && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200 }}>
          <div style={{ backgroundColor: '#16213e', borderRadius: '16px', padding: '32px', width: '360px', border: '2px solid #e94560', textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🗑</div>
            <h2 style={{ color: '#fff', margin: '0 0 12px' }}>Void Order?</h2>
            <p style={{ color: '#aaa', marginBottom: '28px' }}>This will cancel the entire order. This action cannot be undone.</p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => setShowVoidConfirm(false)} style={{ flex: 1, padding: '14px', backgroundColor: '#333', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '1rem', cursor: 'pointer', fontWeight: 'bold' }}>Keep Order</button>
              <button onClick={() => { clearOrder(); setShowVoidConfirm(false); }} style={{ flex: 1, padding: '14px', backgroundColor: '#e94560', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '1rem', cursor: 'pointer', fontWeight: 'bold' }}>Yes, Void It</button>
            </div>
          </div>
        </div>
      )}

      {/* CUSTOMIZATION MODAL */}
      {modalItem && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ backgroundColor: '#16213e', borderRadius: '16px', padding: '28px', width: '420px', maxHeight: '85vh', overflowY: 'auto', border: '2px solid #0f3460' }}>
            <h2 style={{ color: '#fff', marginTop: 0 }}>{editingKey ? '✏️ Edit ' : ''}{modalItem.name}</h2>
            <p style={{ color: '#aaa', marginTop: '-12px' }}>Base price: ${modalItem.price.toFixed(2)}</p>
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
              <button onClick={() => setModalItem(null)} style={{ flex: 1, padding: '14px', backgroundColor: '#333', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '1rem', cursor: 'pointer' }}>Cancel</button>
              <button onClick={confirmAdd} style={{ flex: 2, padding: '14px', backgroundColor: '#e94560', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer' }}>
                {editingKey ? '✅ Save Changes' : `Add to Order – $${(modalItem.price + selectedToppings.reduce((s, t) => s + t.price, 0)).toFixed(2)}`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}