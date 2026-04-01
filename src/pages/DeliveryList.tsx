// src/pages/DeliveryList.tsx

import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import { useDeliveryStore } from '../store/useDeliveryStore';
import type { DeliveryStatus } from '../types/delivery';
import "./DeliveryList.scss"

export const DeliveryList: React.FC = () => {
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

  const getSeverity = (status: DeliveryStatus) => {
    switch (status) {
      case 'in-transit': return 'info';
      case 'pending': return 'warning';
      case 'completed': return 'success';
      case 'returned': return 'danger';
      default: return null;
    }
  };

  const tabs = [
    { label: 'All', value: 'all' },
    { label: 'In-Transit', value: 'in-transit' },
    { label: 'Pending', value: 'pending' },
    { label: 'Completed', value: 'completed' }
  ];

  return (
    <div className="delivery-list-page page-container">
      
      <div className="search-container">
        <i className="pi pi-search search-icon" />
        <InputText 
          value={searchQuery} 
          onChange={(e) => setSearchQuery(e.target.value)} 
          placeholder="Search by tracking or customer name" 
        />
        <i className="pi pi-sliders-h filter-icon" onClick={() => navigate('/search')} />
      </div>

      <div className="filter-tabs">
        {tabs.map((tab) => (
          <Button 
            key={tab.value}
            label={tab.label}
            onClick={() => setActiveTab(tab.value as DeliveryStatus | 'all')}
            className={activeTab === tab.value ? '' : 'p-button-outlined'}
          />
        ))}
      </div>

      <div className="delivery-list">
        {filteredDeliveries.length === 0 ? (
          <div style={{ textAlign: 'center', marginTop: '3rem', color: 'var(--text-color-secondary)' }}>
            No deliveries found.
          </div>
        ) : (
          filteredDeliveries.map((delivery) => (
            <div 
              key={delivery.id} 
              className="delivery-card"
              onClick={() => navigate(`/delivery/${delivery.id}`)}
            >
              <div className={`status-indicator ${delivery.status}`} />
              
              {delivery.photoUrl ? (
                <img src={delivery.photoUrl} alt="package" className="card-image" />
              ) : (
                <div className="card-image flex align-items-center justify-content-center">
                  <i className="pi pi-box" style={{ fontSize: '1.5rem', color: 'var(--text-color-secondary)' }} />
                </div>
              )}

              <div className="card-content">
                <div className="card-header">
                  <p className="tracking-number">{delivery.trackingNumber}</p>
                  <Tag 
                    value={delivery.status.toUpperCase()} 
                    severity={getSeverity(delivery.status)} 
                    rounded 
                  />
                </div>
                <p className="customer-name">{delivery.customerName}</p>
                <p className="site-location">
                  <i className="pi pi-map-marker" /> {delivery.siteName}
                </p>
              </div>

              <i className="pi pi-chevron-right chevron-icon" />
            </div>
          ))
        )}
      </div>

      <Button 
        icon="pi pi-plus" 
        rounded 
        className="fab-button" 
        onClick={() => navigate('/add')}
        aria-label="Add Delivery"
      />
    </div>
  );
};