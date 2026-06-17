import React, { useState } from "react";
import { orderAPI } from "../services/api";

export default function Cart({ cart, setCart, onCheckout }) {
  const [placing, setPlacing]   = useState(false);
  const [orderErr, setOrderErr] = useState("");

  const total     = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const itemCount = cart.reduce((s, i) => s + i.qty, 0);

  const remove    = (id) => setCart(prev => prev.filter(c => c.id !== id));
  const decrement = (id) => setCart(prev => prev.map(c => c.id === id ? { ...c, qty: c.qty - 1 } : c).filter(c => c.qty > 0));
  const increment = (id) => setCart(prev => prev.map(c => c.id === id ? { ...c, qty: c.qty + 1 } : c));

  const handleCheckout = async () => {
    setOrderErr("");
    setPlacing(true);

    // Group cart by restaurant (take first restaurant found)
    const restaurantId = cart[0]?.restaurant_id || 1;

    const payload = {
      restaurant_id: restaurantId,
      address: "",
      note: "",
      items: cart.map(i => ({ menu_item_id: i.id, quantity: i.qty })),
    };

    try {
      // Try real API first
      const token = localStorage.getItem("access_token");
      if (token) {
        await orderAPI.place(payload);
      }
      onCheckout();          // trigger success banner in App.js
    } catch (err) {
      // If not logged in, still let demo work
      if (err.message.includes("401") || err.message.includes("403")) {
        onCheckout();        // demo mode — skip auth
      } else {
        setOrderErr(err.message || "Could not place order. Try again.");
      }
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div className="cart">
      <div className="cart-header">
        <div className="cart-header-icon">🛒</div>
        <h2>Your Order</h2>
        {itemCount > 0 && (
          <span className="cart-count">{itemCount} item{itemCount > 1 ? "s" : ""}</span>
        )}
      </div>

      {cart.length === 0 ? (
        <div className="cart-empty">
          <span className="cart-empty-icon">🍽️</span>
          <div style={{ fontWeight:600, color:"var(--text-secondary)" }}>Nothing here yet</div>
          <div style={{ fontSize:"0.75rem", marginTop:6 }}>
            Pick a restaurant and add items to get started.
          </div>
        </div>
      ) : (
        <>
          {cart.map(item => (
            <div key={item.id} className="cart-item">
              {(item.image_url || item.image) && (
                <img className="cart-item-img" src={item.image_url || item.image} alt={item.name} />
              )}
              <div className="cart-item-info">
                <div className="cart-item-name">{item.name}</div>
                <div className="cart-item-sub">₹{item.price} each</div>
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                <button onClick={() => decrement(item.id)} style={{ background:"var(--surface-2)", border:"1px solid var(--border)", color:"var(--text-primary)", borderRadius:6, width:26, height:26, fontSize:"1rem", fontWeight:700, cursor:"pointer", padding:0, display:"flex", alignItems:"center", justifyContent:"center" }}>−</button>
                <span style={{ fontSize:"0.85rem", fontWeight:700, color:"var(--text-primary)", minWidth:14, textAlign:"center" }}>{item.qty}</span>
                <button onClick={() => increment(item.id)} style={{ background:"var(--brand)", border:"none", color:"#fff", borderRadius:6, width:26, height:26, fontSize:"1rem", fontWeight:700, cursor:"pointer", padding:0, display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 2px 8px var(--brand-glow)" }}>+</button>
              </div>
              <div className="cart-item-price">₹{item.price * item.qty}</div>
              <button className="cart-item-remove" onClick={() => remove(item.id)} title="Remove">✕</button>
            </div>
          ))}

          <div className="cart-divider" />

          <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
            <div className="cart-total-row">
              <span className="cart-total-label">Subtotal</span>
              <span style={{ fontSize:"0.95rem", color:"var(--text-secondary)", fontWeight:600 }}>₹{total}</span>
            </div>
            <div className="cart-total-row">
              <span className="cart-total-label">Delivery</span>
              <span style={{ fontSize:"0.95rem", color:"#4ade80", fontWeight:600 }}>Free</span>
            </div>
            <div className="cart-divider" style={{ margin:"4px 0" }} />
            <div className="cart-total-row">
              <span className="cart-total-label">Total</span>
              <span className="cart-total-value">₹{total}</span>
            </div>
          </div>

          {orderErr && (
            <div style={{ background:"rgba(255,77,77,0.1)", border:"1px solid rgba(255,77,77,0.25)", borderRadius:8, padding:"9px 12px", fontSize:"0.78rem", color:"#f87171", marginTop:12 }}>
              ⚠️ {orderErr}
            </div>
          )}

          <button
            className="btn btn-checkout"
            onClick={handleCheckout}
            disabled={placing}
          >
            {placing ? "Placing order…" : "📦 Place Order"}
          </button>
        </>
      )}
    </div>
  );
}