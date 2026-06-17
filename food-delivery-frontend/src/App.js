import React, { useState } from "react";
import RestaurantList from "./components/RestaurantList";
import MenuList from "./components/MenuList";
import Cart from "./components/Cart";
import AdminLogin from "./pages/AdminLogin";
import "./App.css";

function App() {
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [selectedName, setSelectedName]             = useState("");
  const [cart, setCart]                             = useState([]);
  const [orderPlaced, setOrderPlaced]               = useState(false);
  const [showAdmin, setShowAdmin]                   = useState(false);

  const itemCount = cart.reduce((s, i) => s + i.qty, 0);

  const handleSelectRestaurant = (id, name) => {
    setSelectedRestaurant(id);
    setSelectedName(name || "");
    setOrderPlaced(false);
  };

  const handleOrder = () => {
    setOrderPlaced(true);
    setCart([]);
    setTimeout(() => setOrderPlaced(false), 5000);
  };

  if (showAdmin) return <AdminLogin onBack={() => setShowAdmin(false)} />;

  return (
    <div>
      <nav className="navbar">
        <div className="logo-container">
          <div className="navbar-brand-icon">🍽️</div>
          <h2>Taste<span>Haven</span></h2>
        </div>
        <div className="navbar-right">
          <span className="nav-link">Explore</span>
          <span className="nav-link">Deals</span>
          <span className="nav-link admin-link" onClick={() => setShowAdmin(true)}>🔐 Admin</span>
          <div className="nav-cart-badge">
            🛒 {itemCount > 0 ? `${itemCount} item${itemCount > 1 ? "s" : ""}` : "Cart"}
          </div>
        </div>
      </nav>

      <div className="header">
        <span>Home</span> › <span>Restaurants</span>
        {selectedRestaurant && <> › <strong>{selectedName || "Menu"}</strong></>}
      </div>

      <div className="container">
        <div className="left-panel">
          <p className="section-title">What are you craving? 🍕</p>
          <p className="section-subtitle">Choose a restaurant and start building your order.</p>
          <RestaurantList
            onSelect={handleSelectRestaurant}
            selected={selectedRestaurant}
          />
          {selectedRestaurant && (
            <div style={{ marginTop: 28 }}>
              <MenuList
                restaurantId={selectedRestaurant}
                restaurantName={selectedName}
                cart={cart}
                setCart={setCart}
              />
            </div>
          )}
        </div>

        <div className="right-panel">
          {orderPlaced && (
            <div className="order-success">
              <span className="order-success-icon">🎉</span>
              <div>
                <h3>Order Placed!</h3>
                <p>Your food is being prepared. Estimated delivery: 30–45 min.</p>
              </div>
            </div>
          )}
          <Cart cart={cart} setCart={setCart} onCheckout={handleOrder} />
        </div>
      </div>
    </div>
  );
}

export default App;