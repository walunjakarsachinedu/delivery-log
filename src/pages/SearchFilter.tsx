import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDeliveryStore } from '../store/useDeliveryStore';
import type { DeliveryStatus } from '../types/delivery';

const courierOptions = [
  { label: 'All Carriers', value: 'all' },
  { label: 'Global Logistics Inc.', value: 'Global Logistics Inc.' },
  { label: 'Quantum Express', value: 'Quantum Express' },
  { label: 'Secured Logistics', value: 'Secured Logistics' }
];

const statusOptions: { label: string; value: DeliveryStatus }[] = [
  { label: 'In-Transit', value: 'in-transit' },
  { label: 'Pending', value: 'pending' },
  { label: 'Completed', value: 'completed' },
  { label: 'Returned', value: 'returned' }
];

export const SearchFilter = () => {
  const navigate = useNavigate();
  const { filters, setFilters, clearFilters } = useDeliveryStore();

  const [localSearch, setLocalSearch] = useState(filters.globalSearch);
  const [localFromDate, setLocalFromDate] = useState(filters.fromDate ? filters.fromDate.slice(0, 10) : '');
  const [localToDate, setLocalToDate] = useState(filters.toDate ? filters.toDate.slice(0, 10) : '');
  const [localStatuses, setLocalStatuses] = useState<DeliveryStatus[]>(filters.status);
  const [localCourier, setLocalCourier] = useState(filters.courier || 'all');

  const handleStatusToggle = (value: DeliveryStatus) => {
    setLocalStatuses((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
    );
  };

  const activeCount =
    (localSearch ? 1 : 0) +
    (localFromDate ? 1 : 0) +
    (localToDate ? 1 : 0) +
    (localCourier && localCourier !== 'all' ? 1 : 0) +
    localStatuses.length;

  const handleApply = () => {
    setFilters({
      globalSearch: localSearch,
      fromDate: localFromDate ? new Date(localFromDate).toISOString() : null,
      toDate: localToDate ? new Date(localToDate).toISOString() : null,
      status: localStatuses,
      courier: localCourier === 'all' ? null : localCourier
    });
    navigate('/');
  };

  const handleClear = () => {
    clearFilters();
    setLocalSearch('');
    setLocalFromDate('');
    setLocalToDate('');
    setLocalStatuses([]);
    setLocalCourier('all');
  };

  return (
    <div style={{ maxWidth: 760, margin: '0 auto', padding: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
        <button type="button" onClick={() => navigate('/')} style={{ padding: '0.6rem 0.9rem', borderRadius: 8, border: '1px solid #ccc', background: '#fff' }}>
          Back
        </button>
        <h2 style={{ margin: 0, fontSize: '1.5rem' }}>Search & Filter</h2>
        <div style={{ minWidth: 120 }} />
      </div>

      <section style={{ background: '#fff', padding: '1rem', borderRadius: 12, border: '1px solid #ddd', marginBottom: '1rem' }}>
        <h3 style={{ margin: '0 0 0.75rem' }}>Global Search</h3>
        <input
          value={localSearch}
          onChange={(event) => setLocalSearch(event.target.value)}
          placeholder="Tracking number or recipient name"
          style={{ width: '100%', padding: '0.75rem', border: '1px solid #ccc', borderRadius: 8 }}
        />
      </section>

      <section style={{ background: '#fff', padding: '1rem', borderRadius: 12, border: '1px solid #ddd', marginBottom: '1rem' }}>
        <h3 style={{ margin: '0 0 0.75rem' }}>Time Horizon</h3>
        <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
          <label style={{ display: 'grid', gap: '0.5rem' }}>
            <span>From Date</span>
            <input
              type="date"
              value={localFromDate}
              onChange={(event) => setLocalFromDate(event.target.value)}
              style={{ width: '100%', padding: '0.75rem', border: '1px solid #ccc', borderRadius: 8 }}
            />
          </label>
          <label style={{ display: 'grid', gap: '0.5rem' }}>
            <span>To Date</span>
            <input
              type="date"
              value={localToDate}
              onChange={(event) => setLocalToDate(event.target.value)}
              style={{ width: '100%', padding: '0.75rem', border: '1px solid #ccc', borderRadius: 8 }}
            />
          </label>
        </div>
      </section>

      <section style={{ background: '#fff', padding: '1rem', borderRadius: 12, border: '1px solid #ddd', marginBottom: '1rem' }}>
        <h3 style={{ margin: '0 0 0.75rem' }}>Shipment Status</h3>
        <div style={{ display: 'grid', gap: '0.5rem' }}>
          {statusOptions.map((option) => (
            <label
              key={option.value}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.75rem',
                borderRadius: 10,
                border: localStatuses.includes(option.value) ? '1px solid #1d4ed8' : '1px solid #ccc',
                background: localStatuses.includes(option.value) ? '#eff6ff' : '#fff',
                cursor: 'pointer'
              }}
            >
              <input
                type="checkbox"
                checked={localStatuses.includes(option.value)}
                onChange={() => handleStatusToggle(option.value)}
              />
              <span>{option.label}</span>
            </label>
          ))}
        </div>
      </section>

      <section style={{ background: '#fff', padding: '1rem', borderRadius: 12, border: '1px solid #ddd', marginBottom: '1rem' }}>
        <h3 style={{ margin: '0 0 0.75rem' }}>Courier Network</h3>
        <select
          value={localCourier}
          onChange={(event) => setLocalCourier(event.target.value)}
          style={{ width: '100%', padding: '0.75rem', border: '1px solid #ccc', borderRadius: 8 }}
        >
          {courierOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </section>

      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '1rem' }}>
        <button
          type="button"
          onClick={handleApply}
          style={{ flex: 1, padding: '0.9rem 1rem', borderRadius: 10, border: '1px solid #1d4ed8', background: '#1d4ed8', color: '#fff' }}
        >
          Apply {activeCount > 0 ? `${activeCount} ` : ''}Filters
        </button>
        <button
          type="button"
          onClick={handleClear}
          style={{ flex: 1, padding: '0.9rem 1rem', borderRadius: 10, border: '1px solid #ccc', background: '#fff' }}
        >
          Clear
        </button>
      </div>
    </div>
  );
};