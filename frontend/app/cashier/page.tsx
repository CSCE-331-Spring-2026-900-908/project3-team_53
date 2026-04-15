'use client';
import { useState, useEffect } from 'react';
import { Get, Post } from '@/utils/apiService';
import { publicAssetUrl } from '@/utils/publicAssetUrl';

const SUGAR_LEVELS = ['0%', '25%', '50%', '75%', '100%'];
const ICE_LEVELS = ['No Ice', 'Less Ice', 'Regular Ice', 'Extra Ice'];

const DISCOUNTS = [
  { label: '🎓 Student ID', pct: 15 },
  { label: '🎖️ Military / Fire / Police', pct: 25 },
];

type Topping = { id: number; name: string; price: number };
type MenuItem = {
  id: number;
  name: string;
  category: string;
  price: number;
  image: string | null;
  imageFocusX: number;
  imageFocusY: number;
  available: boolean;
};
type ApiMenuItem = {
  id: number;
  name: string;
  category: string | null;
  price: number | string;
  image: string | null;
  imageFocusX?: number | string | null;
  imageFocusY?: number | string | null;
  available: boolean;
};
type ApiTopping = {
  id: number;
  name: string;
  price: number | string;
  available: boolean;
};
type MenuCategory = { category: string; items: MenuItem[] };
type OrderItem = {
  id: number;
  name: string;
  basePrice: number;
  sugar: string;
  ice: string;
  toppings: Topping[];
  qty: number;
  key: string;
  isSnack: boolean;
};


export default function CashierPage() {
  // Menu data from DB
  const [menuCategories, setMenuCategories] = useState<MenuCategory[]>([]);
  const [toppings, setToppings] = useState<Topping[]>([]);
  const [loadingMenu, setLoadingMenu] = useState(true);

  const [activeCategory, setActiveCategory] = useState('');
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
  const [showCustomerInfo, setShowCustomerInfo] = useState(false);
  const [showCustomerScreen, setShowCustomerScreen] = useState(false);
  const [showProcessing, setShowProcessing] = useState(false);
  const [pendingPaymentType, setPendingPaymentType] = useState<string | null>(null);
  const [paymentType, setPaymentType] = useState<string | null>(null);
  const [tipAmount, setTipAmount] = useState(0);
  const [customTip, setCustomTip] = useState('');
  const [selectedTipPct, setSelectedTipPct] = useState<number | null>(null);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');

  // Customization modal state
  const [modalItem, setModalItem] = useState<MenuItem | null>(null);
  const [sugar, setSugar] = useState('100%');
  const [ice, setIce] = useState('Regular Ice');
  const [selectedToppings, setSelectedToppings] = useState<Topping[]>([]);
  const [editingKey, setEditingKey] = useState<string | null>(null);

  // Fetch menu items and toppings on load
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const [items, tops] = await Promise.all([
          Get('/menu-items'),
          Get('/topping-items'),
        ]);

        // Group menu items by category
        const grouped: Record<string, MenuItem[]> = {};
        (items as ApiMenuItem[]).filter((item) => item.available).forEach((item) => {
          const cat = item.category || 'Other';
          if (!grouped[cat]) grouped[cat] = [];
          grouped[cat].push({
            id: item.id,
            name: item.name,
            category: item.category ?? 'Other',
            price: parseFloat(String(item.price)),
            image: item.image ?? null,
            imageFocusX: Number(item.imageFocusX ?? 50),
            imageFocusY: Number(item.imageFocusY ?? 50),
            available: item.available,
          });
        });
        const categories = Object.entries(grouped).map(([category, items]) => ({ category, items }));
        setMenuCategories(categories);
        if (categories.length > 0) setActiveCategory(categories[0].category);

        setToppings((tops as ApiTopping[]).filter((t) => t.available).map((t) => ({
          id: t.id, name: t.name, price: parseFloat(String(t.price)),
        })));
      } catch (err) {
        console.error('Failed to load menu:', err);
      } finally {
        setLoadingMenu(false);
      }
    };
    fetchMenu();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => { if (e.key === 'Escape') setModalItem(null); };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const currentItems = menuCategories.find(m => m.category === activeCategory)?.items ?? [];
  const isSnack = modalItem?.category?.toLowerCase() === 'snack' || modalItem?.category?.toLowerCase() === 'snacks';

  const subtotal = order.reduce((sum, o) => sum + o.basePrice * o.qty, 0);
  const discountAmt = appliedDiscount ? parseFloat((subtotal * appliedDiscount.pct / 100).toFixed(2)) : 0;
  const discountedSubtotal = subtotal - discountAmt;
  const tax = discountedSubtotal * 0.0825;
  const total = discountedSubtotal + tax;
  const computedTip = selectedTipPct !== null
    ? parseFloat((total * selectedTipPct / 100).toFixed(2))
    : parseFloat(customTip) || 0;
  const grandTotal = total + computedTip;

  const clearOrder = () => {
    setOrder([]); setPaid(false); setOrderNumber('');
    setPaymentType(null); setShowPaymentSelect(false);
    setShowCustomerInfo(false); setShowCustomerScreen(false);
    setShowProcessing(false); setPendingPaymentType(null);
    setTipAmount(0); setCustomTip(''); setSelectedTipPct(null);
    setAppliedDiscount(null);
    setCustomerName(''); setCustomerPhone('');
  };

  const openModal = (item: MenuItem) => {
    setModalItem(item); setSugar('100%'); setIce('Regular Ice');
    setSelectedToppings([]); setEditingKey(null);
  };

  const openEditModal = (orderItem: OrderItem) => {
    const menuItem = menuCategories.flatMap(m => m.items).find(i => i.id === orderItem.id);
    if (!menuItem) return;
    setModalItem(menuItem);
    setSugar(orderItem.sugar === 'N/A' ? '100%' : orderItem.sugar);
    setIce(orderItem.ice === 'N/A' ? 'Regular Ice' : orderItem.ice);
    setSelectedToppings(orderItem.toppings);
    setEditingKey(orderItem.key);
  };

  const toggleTopping = (topping: Topping) => {
    setSelectedToppings(prev =>
      prev.find(t => t.id === topping.id)
        ? prev.filter(t => t.id !== topping.id)
        : [...prev, topping]
    );
  };

  const confirmAdd = () => {
    if (!modalItem) return;
    const toppingTotal = selectedToppings.reduce((s, t) => s + t.price, 0);
    const newKey = `${modalItem.id}-${sugar}-${ice}-${selectedToppings.map(t => t.id).join(',')}`;
    const itemIsSnack = modalItem.category?.toLowerCase() === 'snack' || modalItem.category?.toLowerCase() === 'snacks';

    if (editingKey) {
      setOrder(prev => prev.map(o => o.key !== editingKey ? o : {
        ...o, basePrice: modalItem.price + toppingTotal,
        sugar: itemIsSnack ? 'N/A' : sugar,
        ice: itemIsSnack ? 'N/A' : ice,
        toppings: selectedToppings, key: newKey,
      }));
    } else {
      setOrder(prev => {
        const existing = prev.find(o => o.key === newKey);
        if (existing) return prev.map(o => o.key === newKey ? { ...o, qty: o.qty + 1 } : o);
        return [...prev, {
          id: modalItem.id, name: modalItem.name,
          basePrice: modalItem.price + toppingTotal,
          sugar: itemIsSnack ? 'N/A' : sugar,
          ice: itemIsSnack ? 'N/A' : ice,
          toppings: selectedToppings, qty: 1, key: newKey,
          isSnack: itemIsSnack,
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
    setShowCustomerInfo(true);
  };

  const handlePayment = async () => {
    if (order.length === 0 || isSubmitting || !pendingPaymentType) return;
    setIsSubmitting(true);
    setShowCustomerScreen(false);
    setShowProcessing(true);
    const tip = computedTip;

    const paymentTypeMap: Record<string, string> = {
      card: 'credit_card',
      cash: 'cash',
      dining_dollars: 'dining_dollars',
    };

    const strippedPhone = customerPhone.replace(/\D/g, '');

    const payload = {
      order_type: pendingPaymentType,
      total: parseFloat((total + tip).toFixed(2)),
      payment_type: paymentTypeMap[pendingPaymentType] || pendingPaymentType,
      customer_name: customerName || undefined,
      customer_phone: strippedPhone || undefined,
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
      const result = await Post('/orders', payload);
      setOrderNumber('#' + result.id);
      setPaymentType(pendingPaymentType);
      setTipAmount(tip);
      setShowProcessing(false);
      setPaid(true);
      setTimeout(() => clearOrder(), 10000);
    } catch (err) {
      console.error('Order failed:', err);
      setShowProcessing(false);
      alert('Failed to submit order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loadingMenu) {
    return (
      <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--color-page-bg)', flexDirection: 'column', gap: '16px' }}>
        <div style={{ color: 'var(--color-accent-coral)', fontSize: '3rem' }}>🧋</div>
        <div style={{ color: 'var(--color-kiosk-text)', fontSize: '1.2rem' }}>Loading menu...</div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'Arial, sans-serif', backgroundColor: 'var(--color-page-bg)', overflow: 'hidden' }}>

      {/* LEFT: Menu panel */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', borderRight: '2px solid var(--color-cream-border)' }}>
        <div style={{ backgroundColor: 'var(--color-cream-light)', padding: '16px 24px', borderBottom: '2px solid var(--color-cream-border)' }}>
          <h1 style={{ color: 'var(--color-accent-coral)', margin: 0, fontSize: '1.4rem', fontWeight: 'bold' }}>🧋 Team 53 – Cashier POS</h1>
        </div>
        <div style={{ display: 'flex', backgroundColor: 'var(--color-cream-light)', borderBottom: '2px solid var(--color-cream-border)', overflowX: 'auto' }}>
          {menuCategories.map(m => (
            <button key={m.category} onClick={() => setActiveCategory(m.category)} style={{
              flex: '0 0 auto', padding: '14px 16px', border: 'none', cursor: 'pointer', fontSize: '0.95rem', fontWeight: 'bold', whiteSpace: 'nowrap',
              backgroundColor: activeCategory === m.category ? 'var(--color-accent-coral)' : 'transparent',
              color: activeCategory === m.category ? 'var(--color-text-white)' : 'var(--color-kiosk-muted)',
              borderBottom: activeCategory === m.category ? '3px solid var(--color-accent-coral)' : '3px solid transparent',
            }}>{m.category}</button>
          ))}
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', alignContent: 'start' }}>
          {currentItems.map(item => {
              const imageSrc = publicAssetUrl(item.image);
              const objectPosition = `${item.imageFocusX}% ${item.imageFocusY}%`;
              return (
              <button key={item.id} onClick={() => openModal(item)} style={{
                backgroundColor: 'var(--color-cream-light)', border: '2px solid var(--color-cream)', borderRadius: '12px',
                padding: '16px', cursor: 'pointer', textAlign: 'left', color: 'var(--color-kiosk-text)',
                overflow: 'hidden',
              }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--color-accent-coral)')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--color-cream)')}
              >
                {imageSrc && (
                  <div style={{ width: '100%', height: '110px', marginBottom: '12px', borderRadius: '10px', overflow: 'hidden', backgroundColor: 'var(--color-cream)' }}>
                    <img
                      src={imageSrc}
                      alt={item.name}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        objectPosition,
                      }}
                    />
                  </div>
                )}
                <div style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '6px' }}>{item.name}</div>
                <div style={{ color: 'var(--color-accent-coral)', fontSize: '1.1rem', fontWeight: 'bold' }}>${item.price.toFixed(2)}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* RIGHT: Order panel */}
      <div style={{ width: '360px', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--color-cream-light)' }}>
        <div style={{ padding: '16px 24px', borderBottom: '2px solid var(--color-cream-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 style={{ color: 'var(--color-kiosk-text)', margin: 0, fontSize: '1.2rem' }}>Current Order</h2>
          {order.length > 0 && (
            <span style={{ backgroundColor: 'var(--color-accent-coral)', color: 'var(--color-text-white)', borderRadius: '50%', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.9rem' }}>
              {order.reduce((sum, o) => sum + o.qty, 0)}
            </span>
          )}
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '12px' }}>
          {order.length === 0 ? (
            <p style={{ color: 'var(--color-kiosk-muted)', textAlign: 'center', marginTop: '40px' }}>No items added yet</p>
          ) : (
            order.map(o => (
              <div key={o.key} style={{ padding: '10px 12px', marginBottom: '8px', backgroundColor: 'var(--color-cream)', borderRadius: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ color: 'var(--color-kiosk-text)', fontSize: '0.9rem', fontWeight: 'bold' }}>{o.name}</div>
                    {o.sugar !== 'N/A' && (
                      <div style={{ color: 'var(--color-kiosk-muted)', fontSize: '0.75rem', marginTop: '2px' }}>Sugar: {o.sugar} · Ice: {o.ice}</div>
                    )}
                    {o.toppings.length > 0 && (
                      <div style={{ color: 'var(--color-kiosk-muted)', fontSize: '0.75rem' }}>+ {o.toppings.map(t => t.name).join(', ')}</div>
                    )}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <button onClick={() => openEditModal(o)} style={{ padding: '4px 8px', borderRadius: '6px', border: '1px solid var(--color-cream-border)', backgroundColor: 'var(--color-cream)', color: 'var(--color-kiosk-muted)', cursor: 'pointer', fontSize: '0.7rem' }}>✏️</button>
                    <button onClick={() => removeItem(o.key)} style={{ width: '28px', height: '28px', borderRadius: '50%', border: 'none', backgroundColor: 'var(--color-accent-coral)', color: 'var(--color-text-white)', cursor: 'pointer', fontWeight: 'bold' }}>−</button>
                    <span style={{ color: 'var(--color-kiosk-text)', minWidth: '20px', textAlign: 'center', fontWeight: 'bold' }}>{o.qty}</span>
                    <button onClick={() => addQty(o.key)} style={{ width: '28px', height: '28px', borderRadius: '50%', border: 'none', backgroundColor: 'var(--color-accent-teal)', color: 'var(--color-text-white)', cursor: 'pointer', fontWeight: 'bold' }}>+</button>
                  </div>
                </div>
                <div style={{ color: 'var(--color-accent-coral)', fontWeight: 'bold', textAlign: 'right', marginTop: '4px' }}>${(o.basePrice * o.qty).toFixed(2)}</div>
              </div>
            ))
          )}
        </div>
        <div style={{ padding: '16px 20px', borderTop: '2px solid var(--color-cream-border)', backgroundColor: 'var(--color-cream)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-kiosk-muted)', marginBottom: '6px' }}>
            <span>Subtotal</span><span>${subtotal.toFixed(2)}</span>
          </div>
          {appliedDiscount && (
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-accent-teal)', marginBottom: '6px', fontSize: '0.9rem' }}>
              <span>{appliedDiscount.label} ({appliedDiscount.pct}% off)</span>
              <span>−${discountAmt.toFixed(2)}</span>
            </div>
          )}
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-kiosk-muted)', marginBottom: '10px' }}>
            <span>Tax (8.25%)</span><span>${tax.toFixed(2)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-kiosk-text)', fontSize: '1.3rem', fontWeight: 'bold', marginBottom: '16px' }}>
            <span>Total</span><span>${total.toFixed(2)}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button onClick={() => order.length > 0 && setShowPaymentSelect(true)} disabled={order.length === 0 || isSubmitting} style={{
              padding: '16px', backgroundColor: order.length === 0 || isSubmitting ? 'var(--color-border)' : 'var(--color-accent-teal)',
              color: 'var(--color-text-white)', border: 'none', borderRadius: '10px', fontSize: '1.1rem', fontWeight: 'bold',
              cursor: order.length === 0 || isSubmitting ? 'not-allowed' : 'pointer',
            }}>{isSubmitting ? 'Submitting...' : '💳 Process Payment'}</button>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => order.length > 0 && setShowDiscountModal(true)} disabled={order.length === 0} style={{
                flex: 1, padding: '12px',
                backgroundColor: appliedDiscount ? 'var(--color-accent-teal-hover)' : order.length === 0 ? 'var(--color-cream-border)' : 'var(--color-cream)',
                color: appliedDiscount ? 'var(--color-accent-teal)' : order.length === 0 ? 'var(--color-kiosk-muted)' : 'var(--color-kiosk-text)',
                border: appliedDiscount ? '2px solid var(--color-accent-teal)' : '2px solid var(--color-cream-border)',
                borderRadius: '10px', fontSize: '0.9rem', cursor: order.length === 0 ? 'not-allowed' : 'pointer', fontWeight: 'bold',
              }}>{appliedDiscount ? `✅ ${appliedDiscount.pct}% Off` : '🏷️ Discount'}</button>
              <button onClick={() => order.length > 0 && setShowVoidConfirm(true)} disabled={order.length === 0} style={{
                flex: 1, padding: '12px', backgroundColor: order.length === 0 ? 'var(--color-cream-border)' : 'var(--color-accent-coral)',
                color: 'var(--color-text-white)', border: 'none', borderRadius: '10px', fontSize: '0.9rem',
                cursor: order.length === 0 ? 'not-allowed' : 'pointer', fontWeight: 'bold',
              }}>🗑 Void Order</button>
            </div>
          </div>
        </div>
      </div>

      {/* PROCESSING PAYMENT */}
      {showProcessing && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'var(--color-overlay-heavy)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 275 }}>
          <div style={{ width: '64px', height: '64px', border: '6px solid var(--color-cream-border)', borderTop: '6px solid var(--color-accent-teal)', borderRadius: '50%', animation: 'spin 1s linear infinite', marginBottom: '28px' }} />
          <h1 style={{ color: 'var(--color-text-white)', fontSize: '1.8rem', margin: 0, fontWeight: 'bold' }}>Processing Payment...</h1>
          <p style={{ color: 'var(--color-text-white)', fontSize: '1rem', marginTop: '12px', opacity: 0.7 }}>Please wait</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      )}

      {/* TRANSACTION COMPLETE */}
      {paid && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'var(--color-cream)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 300 }}>
          <div style={{ fontSize: '5rem', marginBottom: '24px' }}>✅</div>
          <h1 style={{ color: 'var(--color-accent-teal)', fontSize: '2.5rem', margin: 0, fontWeight: 'bold' }}>Transaction Complete</h1>
          {customerName && (
            <div style={{ color: 'var(--color-kiosk-text)', fontSize: '1.2rem', marginTop: '12px', fontWeight: 600 }}>Order for: {customerName}</div>
          )}
          <div style={{ color: 'var(--color-kiosk-text)', fontSize: '1.8rem', marginTop: '16px', letterSpacing: '4px', fontWeight: 'bold' }}>Order {orderNumber}</div>
          <div style={{ color: 'var(--color-kiosk-muted)', fontSize: '1rem', marginTop: '12px' }}>
            {paymentType === 'cash' ? '💵 Cash' : paymentType === 'card' ? '💳 Card' : '🎓 Dining Dollars'}
            {tipAmount > 0 && <span> · Tip: ${tipAmount.toFixed(2)}</span>}
            {appliedDiscount && <span> · {appliedDiscount.label}</span>}
          </div>
          <p style={{ color: 'var(--color-kiosk-muted)', fontSize: '1rem', marginTop: '32px' }}>Returning to cashier...</p>
        </div>
      )}

      {/* CASHIER: Payment type selection */}
      {showPaymentSelect && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'var(--color-overlay-heavy)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200 }}>
          <div style={{ backgroundColor: 'var(--color-cream-light)', borderRadius: '16px', padding: '32px', width: '400px', border: '2px solid var(--color-cream)', textAlign: 'center' }}>
            <h2 style={{ color: 'var(--color-kiosk-text)', margin: '0 0 8px' }}>Select Payment Method</h2>
            <p style={{ color: 'var(--color-kiosk-muted)', marginBottom: '28px' }}>Total: <strong style={{ color: 'var(--color-accent-teal)', fontSize: '1.2rem' }}>${total.toFixed(2)}</strong></p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
              {[{ type: 'card', label: '💳 Credit / Debit Card' }, { type: 'cash', label: '💵 Cash' }, { type: 'dining_dollars', label: '🎓 Dining Dollars' }].map(({ type, label }) => (
                <button key={type} onClick={() => selectPaymentType(type)} style={{
                  padding: '18px', backgroundColor: 'var(--color-cream)', color: 'var(--color-kiosk-text)',
                  border: '2px solid var(--color-cream-border)', borderRadius: '12px', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer',
                }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--color-accent-teal)')}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--color-cream-border)')}
                >{label}</button>
              ))}
            </div>
            <button onClick={() => setShowPaymentSelect(false)} style={{ width: '100%', padding: '12px', backgroundColor: 'var(--color-cream-border)', color: 'var(--color-kiosk-muted)', border: 'none', borderRadius: '10px', fontSize: '1rem', cursor: 'pointer' }}>Cancel</button>
          </div>
        </div>
      )}

      {/* CUSTOMER INFO: Name + Phone */}
      {showCustomerInfo && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'var(--color-overlay-heavy)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 250, padding: '40px' }}>
          <div style={{ fontSize: '3rem', marginBottom: '16px' }}>👤</div>
          <h1 style={{ color: 'var(--color-accent-coral)', fontSize: '2rem', marginBottom: '8px' }}>Customer Information</h1>
          <p style={{ color: 'var(--color-text-light)', marginBottom: '32px', fontSize: '1rem' }}>Optional — leave blank to skip</p>
          <div style={{ width: '100%', maxWidth: '420px', display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
            <div>
              <label style={{ color: 'var(--color-text-light)', fontSize: '0.85rem', display: 'block', marginBottom: '6px' }}>Name</label>
              <input
                type="text"
                placeholder="e.g. John"
                value={customerName}
                onChange={e => setCustomerName(e.target.value)}
                style={{ width: '100%', padding: '14px', backgroundColor: 'var(--color-cream-light)', color: 'var(--color-kiosk-text)', border: '2px solid var(--color-cream-border)', borderRadius: '10px', fontSize: '1.1rem', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>
            <div>
              <label style={{ color: 'var(--color-text-light)', fontSize: '0.85rem', display: 'block', marginBottom: '6px' }}>Phone Number</label>
              <input
                type="tel"
                placeholder="e.g. 979-555-1234"
                value={customerPhone}
                onChange={e => setCustomerPhone(e.target.value)}
                style={{ width: '100%', padding: '14px', backgroundColor: 'var(--color-cream-light)', color: 'var(--color-kiosk-text)', border: '2px solid var(--color-cream-border)', borderRadius: '10px', fontSize: '1.1rem', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>
          </div>
          <div style={{ width: '100%', maxWidth: '420px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button onClick={() => { setShowCustomerInfo(false); setSelectedTipPct(null); setCustomTip(''); setShowCustomerScreen(true); }} style={{
              width: '100%', padding: '18px', backgroundColor: 'var(--color-accent-teal)', color: 'var(--color-text-white)', border: 'none', borderRadius: '12px', fontSize: '1.2rem', fontWeight: 'bold', cursor: 'pointer',
            }}>Continue to Tip</button>
            <button onClick={() => { setCustomerName(''); setCustomerPhone(''); setShowCustomerInfo(false); setSelectedTipPct(null); setCustomTip(''); setShowCustomerScreen(true); }} style={{
              width: '100%', padding: '14px', backgroundColor: 'transparent', color: 'var(--color-text-light)', border: '2px solid var(--color-cream-border)', borderRadius: '10px', fontSize: '1rem', cursor: 'pointer',
            }}>Skip</button>
            <button onClick={() => { setShowCustomerInfo(false); setShowPaymentSelect(true); }} style={{
              width: '100%', padding: '14px', backgroundColor: 'transparent', color: 'var(--color-text-light)', border: 'none', borderRadius: '10px', fontSize: '1rem', cursor: 'pointer', marginTop: '4px',
            }}>← Back to Payment Methods</button>
          </div>
        </div>
      )}

      {/* CUSTOMER: Order summary + tip screen */}
      {showCustomerScreen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'var(--color-overlay-heavy)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 250, padding: '40px' }}>
          <h1 style={{ color: 'var(--color-accent-coral)', fontSize: '2rem', marginBottom: '8px' }}>🧋 Review Your Order</h1>
          <p style={{ color: 'var(--color-text-light)', marginBottom: '28px', fontSize: '1rem' }}>Please review and select a tip</p>
          <div style={{ width: '100%', maxWidth: '500px', backgroundColor: 'var(--color-cream-light)', borderRadius: '16px', padding: '20px', marginBottom: '28px', maxHeight: '240px', overflowY: 'auto' }}>
            {order.map(o => (
              <div key={o.key} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--color-cream)' }}>
                <div>
                  <div style={{ color: 'var(--color-kiosk-text)', fontSize: '1rem', fontWeight: 'bold' }}>{o.name} x{o.qty}</div>
                  {o.sugar !== 'N/A' && <div style={{ color: 'var(--color-kiosk-muted)', fontSize: '0.8rem' }}>Sugar: {o.sugar} · Ice: {o.ice}</div>}
                  {o.toppings.length > 0 && <div style={{ color: 'var(--color-kiosk-muted)', fontSize: '0.8rem' }}>+ {o.toppings.map(t => t.name).join(', ')}</div>}
                </div>
                <div style={{ color: 'var(--color-accent-coral)', fontWeight: 'bold' }}>${(o.basePrice * o.qty).toFixed(2)}</div>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-kiosk-muted)', marginTop: '10px', fontSize: '0.9rem' }}><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
            {appliedDiscount && (
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-accent-teal)', fontSize: '0.9rem' }}>
                <span>{appliedDiscount.label} ({appliedDiscount.pct}% off)</span><span>−${discountAmt.toFixed(2)}</span>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-kiosk-muted)', fontSize: '0.9rem' }}><span>Tax (8.25%)</span><span>${tax.toFixed(2)}</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-kiosk-text)', fontWeight: 'bold', fontSize: '1.1rem', marginTop: '8px' }}><span>Total</span><span>${total.toFixed(2)}</span></div>
          </div>
          <div style={{ width: '100%', maxWidth: '500px' }}>
            <h2 style={{ color: 'var(--color-text-white)', textAlign: 'center', marginBottom: '16px', fontSize: '1.3rem' }}>Add a Tip?</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '16px' }}>
              {[15, 18, 20].map(pct => {
                const amt = parseFloat((total * pct / 100).toFixed(2));
                const isSelected = selectedTipPct === pct;
                return (
                  <button key={pct} onClick={() => { setSelectedTipPct(pct); setCustomTip(''); }} style={{
                    padding: '20px 8px', borderRadius: '14px', border: `3px solid ${isSelected ? 'var(--color-accent-teal)' : 'var(--color-cream-border)'}`,
                    backgroundColor: isSelected ? 'var(--color-accent-teal-hover)' : 'var(--color-cream-light)', color: 'var(--color-kiosk-text)',
                    fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer', textAlign: 'center',
                  }}>{pct}%<br /><span style={{ fontSize: '0.85rem', color: 'var(--color-kiosk-muted)' }}>${amt.toFixed(2)}</span></button>
                );
              })}
              <button onClick={() => { setSelectedTipPct(null); setCustomTip('0'); }} style={{
                padding: '20px 8px', borderRadius: '14px',
                border: `3px solid ${selectedTipPct === null && customTip === '0' ? 'var(--color-accent-coral)' : 'var(--color-cream-border)'}`,
                backgroundColor: selectedTipPct === null && customTip === '0' ? 'var(--color-accent-coral-hover)' : 'var(--color-cream-light)',
                color: 'var(--color-kiosk-muted)', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer',
              }}>No Tip</button>
            </div>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
              <input type="number" min="0" step="0.01" placeholder="Custom tip $" value={customTip}
                onChange={e => { setCustomTip(e.target.value); setSelectedTipPct(null); }}
                style={{ flex: 1, padding: '14px', backgroundColor: 'var(--color-cream-light)', color: 'var(--color-kiosk-text)', border: '2px solid var(--color-cream-border)', borderRadius: '10px', fontSize: '1rem', outline: 'none' }} />
            </div>
            <div style={{ backgroundColor: 'var(--color-cream-light)', borderRadius: '12px', padding: '14px 20px', marginBottom: '12px', display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--color-kiosk-muted)' }}>Tip</span><span style={{ color: 'var(--color-accent-teal)', fontWeight: 'bold' }}>${computedTip.toFixed(2)}</span>
            </div>
            <div style={{ backgroundColor: 'var(--color-cream)', borderRadius: '12px', padding: '14px 20px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--color-kiosk-text)', fontSize: '1.2rem', fontWeight: 'bold' }}>Grand Total</span>
              <span style={{ color: 'var(--color-accent-teal)', fontWeight: 'bold', fontSize: '1.4rem' }}>${grandTotal.toFixed(2)}</span>
            </div>
            <button onClick={handlePayment} style={{ width: '100%', padding: '20px', backgroundColor: 'var(--color-accent-teal)', color: 'var(--color-text-white)', border: 'none', borderRadius: '14px', fontSize: '1.3rem', fontWeight: 'bold', cursor: 'pointer' }}>
              ✅ Confirm & Pay ${grandTotal.toFixed(2)}
            </button>
            <button onClick={() => { setShowCustomerScreen(false); setShowCustomerInfo(true); }} style={{ width: '100%', padding: '14px', backgroundColor: 'transparent', color: 'var(--color-text-light)', border: 'none', borderRadius: '10px', fontSize: '1rem', cursor: 'pointer', marginTop: '12px' }}>← Back</button>
          </div>
        </div>
      )}

      {/* DISCOUNT modal */}
      {showDiscountModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'var(--color-overlay-heavy)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200 }}>
          <div style={{ backgroundColor: 'var(--color-cream-light)', borderRadius: '16px', padding: '32px', width: '400px', border: '2px solid var(--color-accent-teal)', textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '12px' }}>🏷️</div>
            <h2 style={{ color: 'var(--color-kiosk-text)', margin: '0 0 8px' }}>Apply Discount</h2>
            <p style={{ color: 'var(--color-kiosk-muted)', marginBottom: '24px' }}>Verify customer eligibility before applying</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
              {DISCOUNTS.map(d => {
                const isActive = appliedDiscount?.pct === d.pct;
                return (
                  <button key={d.pct} onClick={() => { setAppliedDiscount(isActive ? null : d); setShowDiscountModal(false); }} style={{
                    padding: '20px', backgroundColor: isActive ? 'var(--color-accent-teal-hover)' : 'var(--color-cream)', color: 'var(--color-kiosk-text)',
                    border: `2px solid ${isActive ? 'var(--color-accent-teal)' : 'var(--color-cream-border)'}`, borderRadius: '12px',
                    fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer', textAlign: 'left',
                  }}>
                    <div>{d.label}</div>
                    <div style={{ color: 'var(--color-accent-teal)', fontSize: '0.9rem', marginTop: '4px' }}>
                      {d.pct}% off · saves ${(subtotal * d.pct / 100).toFixed(2)}{isActive && ' ✅ Applied'}
                    </div>
                  </button>
                );
              })}
            </div>
            {appliedDiscount && (
              <button onClick={() => { setAppliedDiscount(null); setShowDiscountModal(false); }} style={{ width: '100%', padding: '12px', backgroundColor: 'var(--color-accent-coral)', color: 'var(--color-text-white)', border: 'none', borderRadius: '10px', fontSize: '1rem', cursor: 'pointer', marginBottom: '10px', fontWeight: 'bold' }}>Remove Discount</button>
            )}
            <button onClick={() => setShowDiscountModal(false)} style={{ width: '100%', padding: '12px', backgroundColor: 'var(--color-cream-border)', color: 'var(--color-kiosk-muted)', border: 'none', borderRadius: '10px', fontSize: '1rem', cursor: 'pointer' }}>Cancel</button>
          </div>
        </div>
      )}

      {/* VOID ORDER confirmation */}
      {showVoidConfirm && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'var(--color-overlay-medium)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200 }}>
          <div style={{ backgroundColor: 'var(--color-cream-light)', borderRadius: '16px', padding: '32px', width: '360px', border: '2px solid var(--color-accent-coral)', textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🗑</div>
            <h2 style={{ color: 'var(--color-kiosk-text)', margin: '0 0 12px' }}>Void Order?</h2>
            <p style={{ color: 'var(--color-kiosk-muted)', marginBottom: '28px' }}>This will cancel the entire order. This action cannot be undone.</p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => setShowVoidConfirm(false)} style={{ flex: 1, padding: '14px', backgroundColor: 'var(--color-cream-border)', color: 'var(--color-kiosk-text)', border: 'none', borderRadius: '10px', fontSize: '1rem', cursor: 'pointer', fontWeight: 'bold' }}>Keep Order</button>
              <button onClick={() => { clearOrder(); setShowVoidConfirm(false); }} style={{ flex: 1, padding: '14px', backgroundColor: 'var(--color-accent-coral)', color: 'var(--color-text-white)', border: 'none', borderRadius: '10px', fontSize: '1rem', cursor: 'pointer', fontWeight: 'bold' }}>Yes, Void It</button>
            </div>
          </div>
        </div>
      )}

      {/* CUSTOMIZATION MODAL */}
      {modalItem && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'var(--color-overlay-medium)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ backgroundColor: 'var(--color-cream-light)', borderRadius: '16px', padding: '28px', width: '420px', maxHeight: '85vh', overflowY: 'auto', border: '2px solid var(--color-cream)' }}>
            <h2 style={{ color: 'var(--color-kiosk-text)', marginTop: 0 }}>{editingKey ? '✏️ Edit ' : ''}{modalItem.name}</h2>
            <p style={{ color: 'var(--color-kiosk-muted)', marginTop: '-12px' }}>Base price: ${modalItem.price.toFixed(2)}</p>
            {!isSnack && (
              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ color: 'var(--color-accent-coral)', marginBottom: '10px' }}>Sugar Level</h3>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {SUGAR_LEVELS.map(s => (
                    <button key={s} onClick={() => setSugar(s)} style={{ padding: '8px 16px', borderRadius: '20px', border: '2px solid', borderColor: sugar === s ? 'var(--color-accent-coral)' : 'var(--color-cream)', backgroundColor: sugar === s ? 'var(--color-accent-coral)' : 'transparent', color: sugar === s ? 'var(--color-text-white)' : 'var(--color-kiosk-text)', cursor: 'pointer', fontWeight: 'bold' }}>{s}</button>
                  ))}
                </div>
              </div>
            )}
            {!isSnack && (
              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ color: 'var(--color-accent-coral)', marginBottom: '10px' }}>Ice Level</h3>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {ICE_LEVELS.map(i => (
                    <button key={i} onClick={() => setIce(i)} style={{ padding: '8px 16px', borderRadius: '20px', border: '2px solid', borderColor: ice === i ? 'var(--color-accent-coral)' : 'var(--color-cream)', backgroundColor: ice === i ? 'var(--color-accent-coral)' : 'transparent', color: ice === i ? 'var(--color-text-white)' : 'var(--color-kiosk-text)', cursor: 'pointer', fontWeight: 'bold' }}>{i}</button>
                  ))}
                </div>
              </div>
            )}
            {!isSnack && toppings.length > 0 && (
              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ color: 'var(--color-accent-coral)', marginBottom: '10px' }}>Toppings</h3>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {toppings.map(t => {
                    const selected = !!selectedToppings.find(s => s.id === t.id);
                    return (
                      <button key={t.id} onClick={() => toggleTopping(t)} style={{ padding: '8px 16px', borderRadius: '20px', border: '2px solid', borderColor: selected ? 'var(--color-accent-teal)' : 'var(--color-cream)', backgroundColor: selected ? 'var(--color-accent-teal)' : 'transparent', color: selected ? 'var(--color-text-white)' : 'var(--color-kiosk-text)', cursor: 'pointer', fontWeight: 'bold' }}>
                        {t.name} +${t.price.toFixed(2)}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => setModalItem(null)} style={{ flex: 1, padding: '14px', backgroundColor: 'var(--color-cream-border)', color: 'var(--color-kiosk-text)', border: 'none', borderRadius: '10px', fontSize: '1rem', cursor: 'pointer' }}>Cancel</button>
              <button onClick={confirmAdd} style={{ flex: 2, padding: '14px', backgroundColor: 'var(--color-accent-coral)', color: 'var(--color-text-white)', border: 'none', borderRadius: '10px', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer' }}>
                {editingKey ? '✅ Save Changes' : `Add to Order – $${(modalItem.price + selectedToppings.reduce((s, t) => s + t.price, 0)).toFixed(2)}`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
