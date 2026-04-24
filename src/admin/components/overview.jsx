import React, { useState, useEffect } from 'react';
import { ApiClient } from 'adminjs';

const ErrorBarChart = ({ stats }) => {
  if (!stats || stats.length === 0) return <div>No error data available</div>;
  const maxCount = Math.max(...stats.map(s => s.count), 5);
  
  return (
    <div style={{ flex: 2, background: '#fff', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9' }}>
      <h3 style={{ margin: '0 0 20px 0', color: '#1e293b', fontSize: '16px', fontWeight: '700' }}>Error Frequency (7 Days)</h3>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '180px', gap: '8px', paddingTop: '20px' }}>
        {stats.map((s) => {
          const height = (s.count / maxCount) * 100;
          return (
            <div key={s.day} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%' }}>
              <div style={{ flex: 1, width: '100%', display: 'flex', alignItems: 'flex-end' }}>
                <div 
                  style={{ 
                    width: '100%', 
                    height: `${Math.max(height, 2)}%`, 
                    background: s.count > 0 ? 'linear-gradient(to top, #6366f1, #a5b4fc)' : '#f1f5f9',
                    borderRadius: '6px 6px 2px 2px',
                    transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                    position: 'relative'
                  }}
                >
                  {s.count > 0 && <span style={{ position: 'absolute', top: '-25px', left: '50%', transform: 'translateX(-50%)', fontSize: '11px', fontWeight: '700', color: '#6366f1' }}>{s.count}</span>}
                </div>
              </div>
              <div style={{ fontSize: '10px', color: '#94a3b8', marginTop: '12px', fontWeight: '500' }}>{s.day.split('-').slice(2)}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const FlowDonutChart = ({ stats }) => {
  if (!stats || stats.length === 0) return null;
  const total = stats.reduce((acc, curr) => acc + curr.count, 0);
  let cumulative = 0;
  
  const colors = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
  const gradientParts = stats.map((s, i) => {
    const start = (cumulative / total) * 100;
    const end = ((cumulative + s.count) / total) * 100;
    cumulative += s.count;
    return `${colors[i % colors.length]} ${start}% ${end}%`;
  });

  return (
    <div style={{ flex: 1, background: '#fff', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9' }}>
      <h3 style={{ margin: '0 0 20px 0', color: '#1e293b', fontSize: '16px', fontWeight: '700' }}>Errors by Flow</h3>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ 
          width: '140px', 
          height: '140px', 
          borderRadius: '50%', 
          background: `conic-gradient(${gradientParts.join(', ')})`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          marginBottom: '20px'
        }}>
          <div style={{ width: '100px', height: '100px', background: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', flexDirection: 'column', justifyContent: 'center' }}>
            <span style={{ fontSize: '24px', fontWeight: '800', color: '#1e293b' }}>{total}</span>
            <span style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase' }}>Total</span>
          </div>
        </div>
        <div style={{ width: '100%' }}>
          {stats.map((s, i) => (
            <div key={s.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: colors[i % colors.length] }}></div>
                <span style={{ fontSize: '12px', color: '#475569', maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.name}</span>
              </div>
              <span style={{ fontSize: '12px', fontWeight: '700', color: '#1e293b' }}>{Math.round((s.count/total)*100)}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const EndpointRanking = ({ stats }) => {
  if (!stats || stats.length === 0) return null;
  const max = stats[0].count;

  return (
    <div style={{ background: '#fff', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9', marginTop: '20px' }}>
      <h3 style={{ margin: '0 0 20px 0', color: '#1e293b', fontSize: '16px', fontWeight: '700' }}>Top Problematic Endpoints</h3>
      {stats.map((s, i) => (
        <div key={s.name} style={{ marginBottom: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{ fontSize: '13px', fontWeight: '600', color: '#475569' }}>{s.name}</span>
            <span style={{ fontSize: '13px', fontWeight: '700', color: '#1e293b' }}>{s.count} errors</span>
          </div>
          <div style={{ width: '100%', height: '8px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{ width: `${(s.count/max)*100}%`, height: '100%', background: 'linear-gradient(90deg, #ef4444, #f87171)', borderRadius: '4px', transition: 'width 1s ease-out' }}></div>
          </div>
        </div>
      ))}
    </div>
  );
};

const Overview = (props) => {
  const [data, setData] = useState(props.data || {});
  const [loading, setLoading] = useState(!props.data || !props.data.flowStats);
  const api = new ApiClient();

  useEffect(() => {
    if (!props.data || !props.data.flowStats) {
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
      <div style={{ padding: '60px', textAlign: 'center', background: '#f8fafc', minHeight: '100vh' }}>
        <div style={{ display: 'inline-block', width: '40px', height: '40px', border: '3px solid #e2e8f0', borderTopColor: '#6366f1', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <h2 style={{ color: '#1e293b', marginTop: '20px' }}>Loading Intelligence...</h2>
      </div>
    );
  }

  return (
    <div style={{ padding: '40px', background: '#f8fafc', minHeight: '100vh', fontFamily: "'Inter', sans-serif" }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px' }}>
          <div>
            <h1 style={{ color: '#1e293b', fontSize: '28px', fontWeight: '800', margin: '0 0 8px 0' }}>System Health Dashboard</h1>
            <p style={{ color: '#64748b', fontSize: '16px' }}>Real-time error analysis and traffic distribution.</p>
          </div>
          <div style={{ background: '#fff', padding: '8px 16px', borderRadius: '10px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '8px', height: '8px', background: '#22c55e', borderRadius: '50%', boxShadow: '0 0 6px #22c55e' }}></div>
            <span style={{ fontSize: '13px', fontWeight: '600', color: '#1e293b' }}>Live Mode</span>
          </div>
        </div>
        
        {/* Top Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '24px', marginBottom: '32px' }}>
          {[
            { label: 'Active Users', value: data.userCount, color: '#6366f1' },
            { label: 'Messages Processed', value: data.messageCount, color: '#10b981' },
            { label: 'Incidents logged', value: data.errorCount, color: '#ef4444', isDanger: true }
          ].map(card => (
            <div key={card.label} style={{ background: '#fff', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: card.color }}></div>
              <div style={{ color: '#64748b', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{card.label}</div>
              <div style={{ fontSize: '32px', fontWeight: '800', color: '#1e293b', marginTop: '8px' }}>{card.value ?? 0}</div>
            </div>
          ))}
        </div>

        {/* Middle Charts */}
        <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
          <ErrorBarChart stats={data.errorStats} />
          <FlowDonutChart stats={data.flowStats} />
        </div>

        {/* Bottom Ranking */}
        <EndpointRanking stats={data.endpointStats} />

        <div style={{ marginTop: '40px', textAlign: 'center', color: '#94a3b8', fontSize: '13px' }}>
          Lantana Monitoring Engine v2.0 • Last Sync: {new Date().toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
};

export default Overview;
