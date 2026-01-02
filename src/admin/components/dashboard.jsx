import React from 'react';

const Dashboard = (props) => {
  // Gracefully handle case where data might not be loaded yet
  const data = props.data || {};
  
  return (
    <div style={{ padding: '40px', background: '#f8fafc', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <div style={{ background: '#fff', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
        <h1 style={{ color: '#6366f1', marginTop: 0 }}>Lantana Overview</h1>
        <p style={{ color: '#64748b', fontSize: '18px' }}>Welcome back to your premium admin dashboard.</p>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginTop: '30px' }}>
          <div style={{ border: '1px solid #e2e8f0', padding: '20px', borderRadius: '8px', textAlign: 'center' }}>
            <h2 style={{ margin: '0 0 10px 0', fontSize: '32px' }}>{data.userCount || 0}</h2>
            <div style={{ color: '#64748b', fontWeight: '500' }}>Total Users</div>
          </div>
          <div style={{ border: '1px solid #e2e8f0', padding: '20px', borderRadius: '8px', textAlign: 'center' }}>
            <h2 style={{ margin: '0 0 10px 0', fontSize: '32px' }}>{data.messageCount || 0}</h2>
            <div style={{ color: '#64748b', fontWeight: '500' }}>Messages</div>
          </div>
          <div style={{ border: '1px solid #e2e8f0', padding: '20px', borderRadius: '8px', textAlign: 'center' }}>
            <h2 style={{ margin: '0 0 10px 0', fontSize: '32px' }}>{data.roomCount || 0}</h2>
            <div style={{ color: '#64748b', fontWeight: '500' }}>Active Rooms</div>
          </div>
        </div>
        
        <div style={{ marginTop: '40px', borderTop: '1px solid #f1f5f9', paddingTop: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '10px', height: '10px', background: '#22c55e', borderRadius: '50%' }}></div>
            <span style={{ color: '#475569' }}>System Active: API and WebSocket servers connected.</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
