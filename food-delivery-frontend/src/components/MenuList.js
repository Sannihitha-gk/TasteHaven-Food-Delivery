import React, { useState, useEffect } from "react";
import { restaurantAPI } from "../services/api";

// ── Fallback menus if backend not running ──────────────────
const FALLBACK_MENUS = {
  1: [
    { id: 101, name: "Chicken Biryani", price: 250, image_url: "https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?w=400&q=80" },
    { id: 102, name: "Mutton Biryani",  price: 350, image_url: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=400&q=80" },
    { id: 103, name: "Paneer Biryani",  price: 220, image_url: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&q=80" },
  ],
  2: [
    { id: 201, name: "Margherita Pizza",   price: 299, image_url: "https://images.unsplash.com/photo-1604382355076-af4b0eb60143?w=400&q=80" },
    { id: 202, name: "Veggie Pizza",       price: 349, image_url: "https://images.unsplash.com/photo-1511689660979-10d2b1aada49?w=400&q=80" },
    { id: 203, name: "Cheese Burst Pizza", price: 399, image_url: "https://images.unsplash.com/photo-1594007654729-407eedc4be65?w=400&q=80" },
  ],
  3: [
    { id: 301, name: "Classic Burger", price: 149, image_url: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80" },
    { id: 302, name: "Chicken Burger", price: 199, image_url: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=400&q=80" },
    { id: 303, name: "Veg Burger",     price: 129, image_url: "https://images.unsplash.com/photo-1525059696034-4967a8e1dca2?w=400&q=80" },
  ],
  4: [
    { id: 401, name: "Masala Dosa", price: 120, image_url: "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=400&q=80" },
    { id: 402, name: "Idli Sambar", price: 80,  image_url: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400&q=80" },
    { id: 403, name: "Medu Vada",   price: 90,  image_url: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&q=80" },
  ],
  5: [
    { id: 501, name: "Veg Noodles", price: 180, image_url: "https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=400&q=80" },
    { id: 502, name: "Fried Rice",  price: 200, image_url: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&q=80" },
    { id: 503, name: "Manchurian",  price: 170, image_url: "https://images.unsplash.com/photo-1547592180-85f173990554?w=400&q=80" },
  ],
  6: [
    { id: 601, name: "Chocolate Cake",   price: 150, image_url: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&q=80" },
    { id: 602, name: "Ice Cream Sundae", price: 120, image_url: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&q=80" },
    { id: 603, name: "Brownie",          price: 100, image_url: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&q=80" },
  ],
};

const EMOJI_MAP = { 1:"🍛", 2:"🍕", 3:"🍔", 4:"🥘", 5:"🥡", 6:"🎂" };

export default function MenuList({ restaurantId, cart, setCart, restaurantName }) {
  const [items, setItems]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    restaurantAPI.getMenu(restaurantId)
      .then(data => setItems(data.length ? data : (FALLBACK_MENUS[restaurantId] || [])))
      .catch(()  => setItems(FALLBACK_MENUS[restaurantId] || []))
      .finally(() => setLoading(false));
  }, [restaurantId]);

  const addToCart = (item) => {
    setCart(prev => {
      const existing = prev.find(c => c.id === item.id);
      if (existing) return prev.map(c => c.id === item.id ? { ...c, qty: c.qty + 1 } : c);
      return [...prev, { ...item, qty: 1 }];
    });
  };

  const inCart = (id) => cart.find(c => c.id === id)?.qty || 0;

  if (loading) {
    return (
      <div className="menu-section">
        {[1,2,3].map(i => (
          <div key={i} style={{
            height: 76, borderRadius: 16, marginBottom: 10,
            background: "var(--surface-2)", border: "1px solid var(--border)",
            animation: "pulse 1.4s ease-in-out infinite",
          }} />
        ))}
      </div>
    );
  }

  return (
    <div className="menu-section">
      <div className="menu-header">
        <div className="menu-header-icon">{EMOJI_MAP[restaurantId] || "🍽️"}</div>
        <div className="menu-header-text">
          <h2>{restaurantName || "Menu"}</h2>
          <p>{items.length} items available</p>
        </div>
      </div>

      {items.map(item => {
        const qty = inCart(item.id);
        const imgSrc = item.image_url || item.image;
        return (
          <div key={item.id} className="menu-card">
            {imgSrc && <img className="menu-card-img" src={imgSrc} alt={item.name} />}
            <div className="menu-card-info">
              <div className="menu-card-name">{item.name}</div>
              {item.description && (
                <div style={{ fontSize:"0.75rem", color:"var(--text-muted)", marginTop:2 }}>
                  {item.description}
                </div>
              )}
              <div className="menu-card-price">₹{item.price}</div>
            </div>
            <div className="menu-card-actions">
              <button
                className={`btn btn-sm ${qty > 0 ? "btn-primary" : "btn-ghost"}`}
                onClick={() => addToCart(item)}
              >
                {qty > 0 ? `+1` : "+ Add"}
              </button>
              {qty > 0 && <span className="qty-badge">{qty} in cart</span>}
            </div>
          </div>
        );
      })}
    </div>
  );
}