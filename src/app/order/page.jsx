'use client';
import React, { useState, useEffect } from 'react';

export default function OrderPage() {
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/restaurants')
      .then(res => res.json())
      .then(data => setRestaurants(data))
      .catch(err => console.error(err));
  }, []);

  const handleRestaurantClick = (restaurant) => {
    setSelectedRestaurant(restaurant);
    fetch(`http://localhost:5000/api/menu/${restaurant.id}`)
      .then(res => res.json())
      .then(data => setMenuItems(data))
      .catch(err => console.error(err));
  };

  const addToCart = (item) => {
    setCart([...cart, item]);
  };

  const submitOrder = () => {
    if (cart.length === 0) return alert("Your cart is empty!");

    const orderData = {
      restaurant_id: selectedRestaurant.id,
      items: cart,
      total_price: cart.reduce((total, item) => total + Number(item.price), 0)
    };

    fetch('http://localhost:5000/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData)
    })
      .then(res => res.json())
      .then(data => {
        alert("🎉 " + data.message);
        setCart([]);
      })
      .catch(err => console.error(err));
  };

  if (selectedRestaurant) {
    return (
      <div className="page">
        <div className="page-header">
          <button onClick={() => setSelectedRestaurant(null)} className="btn btn-ghost btn-sm" style={{ marginBottom: 16 }}>
            ← Back to Restaurants
          </button>
          <span className="page-tag">◈ Menu</span>
          <h1 className="page-title">{selectedRestaurant.name}</h1>
          <p className="page-sub">Select items to add to your order</p>
        </div>
        
        <div className="grid-2" style={{ gridTemplateColumns: '1fr 320px', gap: 24 }}>
          {/* Left Side: The Food Menu */}
          <div className="card stagger">
            <h2 className="page-title" style={{ fontSize: 18, marginBottom: 20 }}>Available Items</h2>
            {menuItems.length === 0 ? <p style={{ color: 'var(--text-mid)' }}>No items found for this restaurant.</p> : null}
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {menuItems.map(item => (
                <div key={item.id} className="card" style={{ background: 'var(--surface2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px' }}>
                  <div>
                    <h3 style={{ color: 'var(--text-hi)', fontWeight: 700 }}>{item.item_name}</h3>
                    <p className="badge badge-green" style={{ marginTop: 4 }}>${Number(item.price).toFixed(2)}</p>
                  </div>
                  <button 
                    onClick={() => addToCart(item)}
                    className="btn btn-primary btn-sm"
                  >
                    + Add to Cart
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side: The Shopping Cart */}
          <div className="card" style={{ height: 'fit-content', position: 'sticky', top: 100 }}>
            <h2 className="page-title" style={{ fontSize: 18, marginBottom: 20 }}>Your Cart ({cart.length})</h2>
            {cart.length === 0 ? <p style={{ color: 'var(--text-mid)', fontSize: 13 }}>Cart is empty</p> : null}
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
              {cart.map((cartItem, index) => (
                <div key={index} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border)', fontSize: 13 }}>
                  <span style={{ color: 'var(--text)' }}>{cartItem.item_name}</span>
                  <span style={{ color: 'var(--text-hi)', fontWeight: 600 }}>${Number(cartItem.price).toFixed(2)}</span>
                </div>
              ))}
            </div>
            
            <div style={{ borderTop: '2px solid var(--border)', paddingTop: 16, marginBottom: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--text-mid)', fontFamily: 'var(--font-mono)', fontSize: 12 }}>TOTAL AMOUNT</span>
                <span style={{ color: 'var(--text-hi)', fontSize: 24, fontWeight: 800, fontFamily: 'var(--font-display)' }}>
                  ${cart.reduce((total, item) => total + Number(item.price), 0).toFixed(2)}
                </span>
              </div>
            </div>
            
            <button 
              onClick={submitOrder} 
              className="btn btn-primary"
              style={{ width: '100%', padding: '14px' }}
            >
              Checkout Order
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-header">
        <span className="page-tag">◈ Ordering</span>
        <h1 className="page-title">Choose a Restaurant</h1>
        <p className="page-sub">Select a venue to view their menu and place an order</p>
      </div>

      <div className="grid-3 stagger">
        {restaurants.map(restaurant => (
          <div 
            key={restaurant.id} 
            onClick={() => handleRestaurantClick(restaurant)}
            className="card card-glow"
            style={{ cursor: 'pointer' }}
          >
            <div style={{ fontSize: 32, marginBottom: 16 }}>🏪</div>
            <h2 className="page-title" style={{ fontSize: 20, marginBottom: 8 }}>{restaurant.name}</h2>
            <p style={{ color: 'var(--text-mid)', fontSize: 13 }}>Click to view menu and order →</p>
          </div>
        ))}
      </div>
    </div>
  );
}
