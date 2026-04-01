import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { useDeliveryStore } from '../store/useDeliveryStore';
import type { DeliveryStatus } from '../types/delivery';
import './SearchFilter.scss';

const courierOptions = [
  { label: 'All Carriers', value: null },
  { label: 'Global Logistics Inc.', value: 'Global Logistics Inc.' },
  { label: 'Quantum Express', value: 'Quantum Express' },
  { label: 'Secured Logistics', value: 'Secured Logistics' }
];

const statusOptions: { label: string; value: DeliveryStatus; dotClass: string }[] = [
  { label: 'In-Transit', value: 'in-transit', dotClass: 'in-transit' },
  { label: 'Pending', value: 'pending', dotClass: 'pending' },
  { label: 'Completed', value: 'completed', dotClass: 'completed' },
  { label: 'Returned', value: 'returned', dotClass: 'returned' }
];

export const SearchFilter: React.FC = () => {
  const navigate = useNavigate();
  const { filters, setFilters, clearFilters } = useDeliveryStore();

  const [localSearch, setLocalSearch] = useState(filters.globalSearch);
  const [localFromDate, setLocalFromDate] = useState<Date | null>(
    filters.fromDate ? new Date(filters.fromDate) : null
  );
  const [localToDate, setLocalToDate] = useState<Date | null>(
    filters.toDate ? new Date(filters.toDate) : null
  );
  const [localStatuses, setLocalStatuses] = useState<DeliveryStatus[]>(filters.status);
  const [localCourier, setLocalCourier] = useState<string | null>(filters.courier);

  const handleStatusToggle = (status: DeliveryStatus) => {
    setLocalStatuses((prev) => 
      prev.includes(status) 
        ? prev.filter((s) => s !== status) 
        : [...prev, status]
    );
  };

  const calculateActiveFilters = () => {
    let count = 0;
    if (localSearch) count++;
    if (localFromDate) count++;
    if (localToDate) count++;
    if (localCourier) count++;
    count += localStatuses.length;
    return count;
  };

  const handleApply = () => {
    setFilters({
      globalSearch: localSearch,
      fromDate: localFromDate ? localFromDate.toISOString() : null,
      toDate: localToDate ? localToDate.toISOString() : null,
      status: localStatuses,
      courier: localCourier
    });
    navigate('/');
  };

  const handleClear = () => {
    clearFilters();
    
    setLocalSearch('');
    setLocalFromDate(null);
    setLocalToDate(null);
    setLocalStatuses([]);
    setLocalCourier(null);
  };

  const activeCount = calculateActiveFilters();

  return (
    <div className="search-filter-page">
      <div className="page-header">
        <i className="pi pi-bars back-btn" onClick={() => navigate('/')} />
        <h2>Search & Filter</h2>
      </div>

      <div className="filter-section">
        <div className="section-title">Global Search</div>
        <span className="p-input-icon-left w-full">
          <i className="pi pi-search" />
          <InputText 
            value={localSearch} 
            onChange={(e) => setLocalSearch(e.target.value)} 
            placeholder="Tracking Number or Recipient Name" 
          />
        </span>
      </div>

      <div className="filter-section">
        <div className="section-title">Time Horizon</div>
        <div className="date-grid">
          <div className="date-input-wrapper">
            <label>From Date</label>
            <Calendar 
              value={localFromDate} 
              onChange={(e) => setLocalFromDate(e.value as Date)} 
              showIcon 
              placeholder="mm/dd/yyyy"
            />
          </div>
          <div className="date-input-wrapper">
            <label>To Date</label>
            <Calendar 
              value={localToDate} 
              onChange={(e) => setLocalToDate(e.value as Date)} 
              showIcon 
              placeholder="mm/dd/yyyy"
            />
          </div>
        </div>
      </div>

      <div className="filter-section">
        <div className="section-title">Shipment Status</div>
        <div className="status-grid">
          {statusOptions.map((opt) => {
            const isActive = localStatuses.includes(opt.value);
            return (
              <div 
                key={opt.value} 
                className={`status-pill ${isActive ? 'active' : ''}`}
                onClick={() => handleStatusToggle(opt.value)}
              >
                <div className={`status-dot ${opt.dotClass}`} />
                <span>{opt.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="filter-section">
        <div className="section-title">Courier Network</div>
        <Dropdown 
          value={localCourier} 
          options={courierOptions} 
          onChange={(e) => setLocalCourier(e.value)} 
          placeholder="All Carriers" 
        />
        <span className="helper-text">Select from our vetted list of international logistics partners.</span>
      </div>

      <div className="action-buttons">
        <Button 
          label={`Apply ${activeCount > 0 ? activeCount : ''} Active Filters`} 
          onClick={handleApply} 
        />
        <Button 
          label="Clear all filters" 
          className="clear-btn p-button-text" 
          onClick={handleClear} 
        />
      </div>
    </div>
  );
};