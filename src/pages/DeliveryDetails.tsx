// src/pages/DeliveryDetails.tsx

import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Tag } from 'primereact/tag';
import { Button } from 'primereact/button';
import { useDeliveryStore } from '../store/useDeliveryStore';
import type { DeliveryStatus } from '../types/delivery';
import './DeliveryDetails.scss';

export const DeliveryDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { deliveries, deleteDelivery } = useDeliveryStore();

  const delivery = deliveries.find((d) => d.id === id);

  if (!delivery) {
    return (
      <div className="delivery-details-page flex flex-column align-items-center justify-content-center">
        <h2>Delivery Not Found</h2>
        <Button label="Back to List" onClick={() => navigate('/')} />
      </div>
    );
  }

  const handleDelete = () => {
    // In a real app, you might want a confirmation dialog here
    if (window.confirm('Are you sure you want to delete this delivery record?')) {
      deleteDelivery(delivery.id);
      navigate('/');
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getSeverity = (status: DeliveryStatus) => {
    switch (status) {
      case 'in-transit': return 'info';
      case 'pending': return 'warning';
      case 'completed': return 'success';
      case 'returned': return 'danger';
      default: return null;
    }
  };

  return (
    <div className="delivery-details-page">
      <div className="page-header">
        <i className="pi pi-arrow-left icon-btn" onClick={() => navigate('/')} />
        <h2>Delivery Details</h2>
        <i className="pi pi-pencil icon-btn" onClick={() => navigate(`/edit/${delivery.id}`)} />
      </div>

      <div className="hero-section">
        {/* Placeholder box if no photo is uploaded */}
        {delivery.photoUrl ? (
          <img src={delivery.photoUrl} alt="Package" className="package-img" />
        ) : (
          <i className="pi pi-box package-img" style={{ fontSize: '6rem', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center' }} />
        )}
        <div className="courier-badge">
          <i className="pi pi-verified" />
          {delivery.courierName || 'STANDARD LOGISTICS'}
        </div>
      </div>

      <div className="detail-card">
        <div className="flex-row">
          <div>
            <span className="card-label">Tracking Number</span>
            <h3 className="tracking-number">{delivery.trackingNumber}</h3>
          </div>
          <Tag 
            value={delivery.status.replace('-', ' ').toUpperCase()} 
            severity={getSeverity(delivery.status)} 
            rounded 
          />
        </div>
        
        <div className="customer-info">
          <div className="avatar">
            <i className="pi pi-user" />
          </div>
          <div className="name-wrapper">
            <span className="label">Customer Name</span>
            <p className="name">{delivery.customerName}</p>
          </div>
        </div>
      </div>

      <div className="detail-card">
        <i className="pi pi-box material-icon" />
        <span className="card-label">Material Name</span>
        <p className="primary-text">{delivery.materialName || 'Not specified'}</p>
        <p className="secondary-text">Standard grade packaging</p>
      </div>

      <div className="detail-card">
        <i className="pi pi-map-marker material-icon" />
        <span className="card-label">Site Name</span>
        <p className="primary-text">{delivery.siteName}</p>
        <div className="map-placeholder">
          <i className="pi pi-map" />
        </div>
      </div>

      <div className="detail-card">
        <div className="info-list">
          <div className="info-item">
            <span className="label">Courier</span>
            <span className="value">
              <i className="pi pi-truck" />
              {delivery.courierName || 'Not specified'}
            </span>
          </div>
          <div className="info-item">
            <span className="label">Dispatch Date</span>
            <span className="value">
              <i className="pi pi-calendar" />
              {formatDate(delivery.dispatchDate)}
            </span>
          </div>
          <div className="info-item">
            <span className="label">Delivery Cost</span>
            <span className="value">
              <i className="pi pi-money-bill" />
              {formatCurrency(delivery.cost)}
            </span>
          </div>
        </div>
      </div>

      <Button 
        className="delete-btn" 
        onClick={handleDelete}
      >
        <i className="pi pi-trash" />
        DELETE DELIVERY RECORD
      </Button>
    </div>
  );
};