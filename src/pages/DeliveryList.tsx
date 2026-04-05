import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDeliveryStore } from '../store/useDeliveryStore';
import type { DeliveryStatus } from '../types/delivery';

const tabs = [
  { label: 'All', value: 'all' },
  { label: 'In-Transit', value: 'in-transit' },
  { label: 'Pending', value: 'pending' },
  { label: 'Completed', value: 'completed' }
];

export const DeliveryList = () => {
  const navigate = useNavigate();
  const { deliveries } = useDeliveryStore();
  const [activeTab, setActiveTab] = useState<DeliveryStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredDeliveries = useMemo(() => {
    return deliveries.filter((delivery) => {
      const matchesSearch =
        delivery.trackingNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        delivery.customerName.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesTab = activeTab === 'all' || delivery.status === activeTab;
      return matchesSearch && matchesTab;
    });
  }, [deliveries, searchQuery, activeTab]);

  return (
    <div style={{ maxWidth: 960, margin: '0 auto', padding: '1rem' }}>
      <header style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.75rem' }}>Delivery Log</h1>
          <p style={{ margin: '0.25rem 0 0', color: '#555' }}>Track deliveries and open records quickly.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button type="button" onClick={() => navigate('/search')} style={{ padding: '0.65rem 1rem', border: '1px solid #ccc', borderRadius: 6, background: '#fff' }}>
            Search & Filter
          </button>
          <button type="button" onClick={() => navigate('/add')} style={{ padding: '0.65rem 1rem', border: '1px solid #1d4ed8', borderRadius: 6, background: '#1d4ed8', color: '#fff' }}>
            Add Delivery
          </button>
        </div>
      </header>

      <div style={{ marginBottom: '1rem' }}>
        <input
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder="Search by tracking number or customer"
          style={{ width: '100%', padding: '0.75rem 1rem', border: '1px solid #ccc', borderRadius: 8 }}
        />
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', marginBottom: '1rem' }}>
        {tabs.map((tab) => (
          <button
            key={tab.value}
            type="button"
            onClick={() => setActiveTab(tab.value as DeliveryStatus | 'all')}
            style={{
              padding: '0.55rem 0.9rem',
              border: '1px solid #ccc',
              borderRadius: 999,
              background: activeTab === tab.value ? '#1d4ed8' : '#fff',
              color: activeTab === tab.value ? '#fff' : '#111'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {filteredDeliveries.length === 0 ? (
        <div style={{ padding: '2rem 1rem', border: '1px solid #ddd', borderRadius: 12, background: '#fff' }}>
          <p style={{ margin: 0, color: '#555' }}>No deliveries found.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '1rem' }}>
          {filteredDeliveries.map((delivery) => (
            <button
              key={delivery.id}
              type="button"
              onClick={() => navigate(`/delivery/${delivery.id}`)}
              style={{
                textAlign: 'left',
                width: '100%',
                padding: '1rem',
                border: '1px solid #ddd',
                borderRadius: 12,
                background: '#fff',
                display: 'grid',
                gridTemplateColumns: '1fr auto',
                gap: '1rem'
              }}
            >
              <div>
                <strong style={{ display: 'block', marginBottom: '0.25rem' }}>{delivery.trackingNumber}</strong>
                <div style={{ color: '#555', marginBottom: '0.25rem' }}>{delivery.customerName}</div>
                <div style={{ color: '#777' }}>{delivery.siteName}</div>
              </div>
              <div style={{ textAlign: 'right', alignSelf: 'center', color: '#1d4ed8', fontWeight: 600 }}>
                {delivery.status}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};