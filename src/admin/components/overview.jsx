import React, { useState, useEffect } from 'react';
import { ApiClient } from 'adminjs';

const Overview = (props) => {
  const [data, setData] = useState(props.data || {});
  const [loading, setLoading] = useState(!props.data);
  const api = new ApiClient();

  useEffect(() => {
    // If data didn't come through props, fetch it manually
    if (!props.data || Object.keys(props.data).length === 0) {
      setLoading(true);
      api.getDashboard()
        .then(response => {
          setData(response.data);
          setLoading(false);
        })
        .catch(err => {
          console.error('Error fetching dashboard data:', err);
          setLoading(false);
        });
    }
  }, [props.data]);

  if (loading) {
    return (
      <div style={{ padding: '40px', fontFamily: 'sans-serif', textAlign: 'center' }}>
        <h2 style={{ color: '#6366f1' }}>Loading Lantana Dashboard...</h2>
        <p style={{ color: '#64748b' }}>Connecting to database...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '40px', background: '#f8fafc', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <div style={{ background: '#fff', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
        <h1 style={{ color: '#6366f1', marginTop: 0 }}>Lantana Overview</h1>
        <p style={{ color: '#64748b', fontSize: '18px' }}>Welcome back to your premium admin dashboard.</p>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginTop: '30px' }}>
          <div style={{ background: '#f1f5f9', padding: '25px', borderRadius: '12px', textAlign: 'center' }}>
            <h2 style={{ margin: '0 0 5px 0', fontSize: '36px', color: '#1e293b' }}>{data.userCount ?? 0}</h2>
            <div style={{ color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase', fontSize: '12px', letterSpacing: '1px' }}>Total Users</div>
          </div>
          <div style={{ background: '#f1f5f9', padding: '25px', borderRadius: '12px', textAlign: 'center' }}>
            <h2 style={{ margin: '0 0 5px 0', fontSize: '36px', color: '#1e293b' }}>{data.messageCount ?? 0}</h2>
            <div style={{ color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase', fontSize: '12px', letterSpacing: '1px' }}>Messages</div>
          </div>
          <div style={{ background: '#f1f5f9', padding: '25px', borderRadius: '12px', textAlign: 'center' }}>
            <h2 style={{ margin: '0 0 5px 0', fontSize: '36px', color: '#1e293b' }}>{data.roomCount ?? 0}</h2>
            <div style={{ color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase', fontSize: '12px', letterSpacing: '1px' }}>Active Rooms</div>
          </div>
        </div>
        
        <div style={{ marginTop: '40px', borderTop: '1px solid #f1f5f9', paddingTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '10px', height: '10px', background: '#22c55e', borderRadius: '50%' }}></div>
            <span style={{ color: '#475569', fontSize: '14px' }}>System Status: Operational</span>
          </div>
          <div style={{ fontSize: '12px', color: '#94a3b8' }}>
            Last updated: {new Date().toLocaleTimeString()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
