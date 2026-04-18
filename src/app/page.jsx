'use client';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  const [orders, setOrders] = useState([]);

  // Fetch all orders to display
  useEffect(() => {
    fetch('http://localhost:5000/api/orders')
      .then(res => res.json())
      .then(data => setOrders(data))
      .catch(err => console.error(err));
  }, []);

  const totalRevenue = orders.reduce((sum, order) => sum + Number(order.total_price), 0);
  const pendingCount = orders.filter(o => o.status === 'Pending').length;
  const preparingCount = orders.filter(o => o.status === 'Preparing').length;
  const readyCount = orders.filter(o => o.status === 'Ready').length;

  return (
    <div className="page">
      {/* Header */}
      <div className="page-header">
        <span className="page-tag">⬡ Admin</span>
        <h1 className="page-title">Dashboard</h1>
        <p className="page-sub">Real-time restaurant operations overview</p>
      </div>

      {/* KPI Cards */}
      <div className="grid-4 stagger" style={{ marginBottom: 32 }}>
        <div className="stat-card">
          <p className="stat-label">Total Revenue</p>
          <p className="stat-value">${totalRevenue.toFixed(2)}</p>
          <p className="stat-change up">↑ 12.5%</p>
        </div>
        
        <div className="stat-card">
          <p className="stat-label">Total Orders</p>
          <p className="stat-value">{orders.length}</p>
          <p className="stat-change up">↑ 8.2%</p>
        </div>
        
        <div className="stat-card">
          <p className="stat-label">Avg Order Value</p>
          <p className="stat-value">
            ${orders.length > 0 ? (totalRevenue / orders.length).toFixed(2) : '0.00'}
          </p>
          <p className="stat-change up">↑ 4.1%</p>
        </div>
        
        <div className="stat-card">
          <p className="stat-label">Conversion Rate</p>
          <p className="stat-value">100%</p>
          <p className="stat-change">Stable</p>
        </div>
      </div>

      {/* Order Status Overview */}
      <div className="grid-3 stagger" style={{ marginBottom: 32 }}>
        <div className="card" style={{ borderLeft: '4px solid var(--red)' }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--red)', marginBottom: 12, fontFamily: 'var(--font-mono)' }}>🔴 PENDING</p>
          <p className="stat-value">{pendingCount}</p>
        </div>
        
        <div className="card" style={{ borderLeft: '4px solid var(--amber)' }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--amber)', marginBottom: 12, fontFamily: 'var(--font-mono)' }}>🟡 PREPARING</p>
          <p className="stat-value">{preparingCount}</p>
        </div>
        
        <div className="card" style={{ borderLeft: '4px solid var(--green)' }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--green)', marginBottom: 12, fontFamily: 'var(--font-mono)' }}>🟢 READY</p>
          <p className="stat-value">{readyCount}</p>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="card" style={{ padding: 24 }}>
        <h2 className="page-title" style={{ fontSize: 18, marginBottom: 20 }}>Recent Orders</h2>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)', textAlign: 'left' }}>
                <th style={{ padding: '12px 8px', fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-mid)' }}>ORDER ID</th>
                <th style={{ padding: '12px 8px', fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-mid)' }}>RESTAURANT</th>
                <th style={{ padding: '12px 8px', fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-mid)' }}>ITEMS</th>
                <th style={{ padding: '12px 8px', fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-mid)' }}>AMOUNT</th>
                <th style={{ padding: '12px 8px', fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-mid)' }}>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {orders.slice(0, 10).map(order => (
                <tr key={order.id} style={{ borderBottom: '1px solid var(--border)', color: 'var(--text)' }}>
                  <td style={{ padding: '12px 8px', fontSize: 13, fontWeight: 600, color: 'var(--text-hi)', fontFamily: 'var(--font-mono)' }}>#{order.id}</td>
                  <td style={{ padding: '12px 8px', fontSize: 13 }}>Restaurant {order.restaurant_id}</td>
                  <td style={{ padding: '12px 8px', fontSize: 13 }}>
                    {JSON.parse(order.items).length} item(s)
                  </td>
                  <td style={{ padding: '12px 8px', fontSize: 13, fontWeight: 600, color: 'var(--text-hi)' }}>${Number(order.total_price).toFixed(2)}</td>
                  <td style={{ padding: '12px 8px', fontSize: 13 }}>
                    <span className={`badge ${order.status === 'Pending' ? 'badge-red' : order.status === 'Preparing' ? 'badge-amber' : 'badge-green'}`}>
                      {order.status.toUpperCase()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Links */}
      <div style={{ marginTop: 32, display: 'flex', gap: 12 }}>
        <Link to="/order" className="btn btn-primary">
          📱 Go to Customer Menu
        </Link>
        <Link to="/kitchen" className="btn btn-ghost">
          🍳 Go to Kitchen Display
        </Link>
      </div>
    </div>
  );
}
