import React, { useState, useEffect } from "react";
import { restaurantAPI } from "../services/api";

// Fallback if backend is offline
const FALLBACK = [
  { id: 1, name: "Biryani House",   location: "Karimnagar", emoji: "🍛", rating: "4.8", delivery_time: "25–35 min", image_url: "https://images.unsplash.com/photo-1630851840633-f96999247032?w=400&q=80" },
  { id: 2, name: "Pizza Corner",    location: "Karimnagar", emoji: "🍕", rating: "4.6", delivery_time: "20–30 min", image_url: "https://images.unsplash.com/photo-1604382355076-af4b0eb60143?w=400&q=80" },
  { id: 3, name: "Burger Junction", location: "Karimnagar", emoji: "🍔", rating: "4.5", delivery_time: "15–25 min", image_url: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80" },
  { id: 4, name: "South Spice",     location: "Karimnagar", emoji: "🥘", rating: "4.7", delivery_time: "20–30 min", image_url: "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=400&q=80" },
  { id: 5, name: "Wok & Roll",      location: "Karimnagar", emoji: "🥡", rating: "4.4", delivery_time: "25–40 min", image_url: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&q=80" },
  { id: 6, name: "Sweet Cravings",  location: "Karimnagar", emoji: "🎂", rating: "4.9", delivery_time: "15–25 min", image_url: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&q=80" },
];

// Emoji per restaurant name
const getEmoji = (name = "") => {
  const n = name.toLowerCase();
  if (n.includes("biryani"))  return "🍛";
  if (n.includes("pizza"))    return "🍕";
  if (n.includes("burger"))   return "🍔";
  if (n.includes("south") || n.includes("spice") || n.includes("dosa")) return "🥘";
  if (n.includes("wok") || n.includes("chinese") || n.includes("noodle")) return "🥡";
  if (n.includes("sweet") || n.includes("cake") || n.includes("dessert")) return "🎂";
  return "🍽️";
};

const getImage = (name = "") => {
  const n = name.toLowerCase();
  if (n.includes("biryani"))  return "https://images.unsplash.com/photo-1630851840633-f96999247032?w=400&q=80";
  if (n.includes("pizza"))    return "https://images.unsplash.com/photo-1604382355076-af4b0eb60143?w=400&q=80";
  if (n.includes("burger"))   return "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80";
  if (n.includes("south") || n.includes("dosa")) return "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=400&q=80";
  if (n.includes("wok") || n.includes("noodle")) return "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&q=80";
  if (n.includes("sweet") || n.includes("cake")) return "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&q=80";
  return "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&q=80";
};

export default function RestaurantList({ onSelect, selected }) {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading]         = useState(true);
  const [apiStatus, setApiStatus]     = useState("loading"); // "loading"|"live"|"offline"

  useEffect(() => {
    restaurantAPI.list()
      .then(data => {
        setRestaurants(data);
        setApiStatus("live");
      })
      .catch(() => {
        setRestaurants(FALLBACK);
        setApiStatus("offline");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="restaurant-grid">
        {[1,2,3,4,5,6].map(i => (
          <div key={i} style={{
            height: 200, borderRadius: 24,
            background: "var(--surface-2)", border: "1px solid var(--border)",
            animation: "pulse 1.4s ease-in-out infinite",
          }} />
        ))}
      </div>
    );
  }

  return (
    <>
      {/* API status indicator */}
      <div style={{ marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{
          width: 8, height: 8, borderRadius: "50%", flexShrink: 0,
          background: apiStatus === "live" ? "#4ade80" : "#f87171",
          boxShadow: apiStatus === "live" ? "0 0 6px #4ade80" : "0 0 6px #f87171",
        }} />
        <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase" }}>
          {apiStatus === "live" ? "Live — Django API connected" : "Offline — showing demo data"}
        </span>
      </div>

      <div className="restaurant-grid">
        {restaurants.map((r) => {
          const emoji = r.emoji || getEmoji(r.name);
          const img   = r.image_url || getImage(r.name);
          const rating = r.rating || "4.5";
          const time   = r.delivery_time || "25–35 min";
          return (
            <div
              key={r.id}
              className={`restaurant-card ${selected === r.id ? "active" : ""}`}
              onClick={() => onSelect(r.id, r.name)}
            >
              <div className="restaurant-card-img-wrap">
                <img src={img} alt={r.name} />
                <span className="restaurant-card-emoji">{emoji}</span>
              </div>
              <div className="restaurant-card-body">
                <div className="restaurant-card-name">{r.name}</div>
                <div className="restaurant-card-meta">
                  <span className="restaurant-tag">{r.location || r.cuisine || "Local"}</span>
                  <span className="restaurant-rating">★ {rating}</span>
                </div>
                <div className="restaurant-delivery">🕐 {time}</div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}