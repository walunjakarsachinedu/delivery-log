import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { Button } from 'primereact/button';
import { useDeliveryStore } from '../store/useDeliveryStore';
import type { DeliveryStatus } from '../types/delivery';
import './AddDelivery.scss'; 

const statusOptions = [
  { label: 'Pending', value: 'pending' },
  { label: 'In-Transit', value: 'in-transit' },
  { label: 'Completed', value: 'completed' },
  { label: 'Returned', value: 'returned' }
];

export const AddDelivery: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  
  const { deliveries, addDelivery, updateDelivery } = useDeliveryStore();

  // find the delivery directly during the initial render
  const existingDelivery = id ? deliveries.find((d) => d.id === id) : null;

  // initialize state directly with the existing data (if it exists)
  const [customerName, setCustomerName] = useState(existingDelivery?.customerName || '');
  const [materialName, setMaterialName] = useState(existingDelivery?.materialName || '');
  const [cost, setCost] = useState<number | null>(existingDelivery?.cost || null);
  const [trackingNumber, setTrackingNumber] = useState(existingDelivery?.trackingNumber || '');
  const [courierName, setCourierName] = useState(existingDelivery?.courierName || '');
  const [siteName, setSiteName] = useState(existingDelivery?.siteName || '');
  const [status, setStatus] = useState<DeliveryStatus>(existingDelivery?.status || 'pending');
  const [dispatchDate, setDispatchDate] = useState<Date | null>(
    existingDelivery?.dispatchDate ? new Date(existingDelivery.dispatchDate) : null
  );
  
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSave = () => {
    if (!customerName || !trackingNumber || !siteName) {
      setValidationError('Please fill in all required fields (Customer, Tracking, Site).');
      return;
    }

    const deliveryData = {
      photoUrl: existingDelivery?.photoUrl || null,
      customerName,
      materialName,
      cost: cost || 0,
      trackingNumber,
      courierName,
      siteName,
      status,
      dispatchDate: dispatchDate ? dispatchDate.toISOString() : new Date().toISOString(),
    };

    if (id) {
      updateDelivery(id, deliveryData);
    } else {
      addDelivery(deliveryData);
    }
    
    navigate('/'); 
  };

  const isEditMode = Boolean(id);

  return (
    <div className="add-delivery-page">
      <div className="page-header">
        <i className="pi pi-times close-btn" onClick={() => navigate('/')} />
        <h2>{isEditMode ? 'Edit Delivery' : 'Add Delivery'}</h2>
        <Button label="Save" onClick={handleSave} size="small" />
      </div>

      <div className="photo-upload-container">
        <div className="camera-icon-wrapper">
          <i className="pi pi-camera" />
        </div>
        <h3>Upload Package Photo</h3>
        <p>JPG, PNG up to 10MB</p>
      </div>

      <div className="form-container">
        <div className="form-group">
          <label htmlFor="customerName">Customer Name</label>
          <InputText 
            id="customerName" 
            value={customerName} 
            onChange={(e) => setCustomerName(e.target.value)} 
            placeholder="Johnathan Doe" 
          />
          <span className="helper-text">Full legal name for shipping documents</span>
        </div>

        <div className="form-group">
          <label htmlFor="materialName">Material Name</label>
          <InputText 
            id="materialName" 
            value={materialName} 
            onChange={(e) => setMaterialName(e.target.value)} 
            placeholder="Industrial Components" 
          />
        </div>

        <div className="form-group">
          <label htmlFor="cost">Cost ($)</label>
          <InputNumber 
            inputId="cost" 
            value={cost} 
            onValueChange={(e) => setCost(e.value ?? 0)} 
            mode="currency" 
            currency="USD" 
            locale="en-US" 
            placeholder="$ 0.00" 
          />
        </div>

        <div className="form-group">
          <label htmlFor="trackingNumber">Tracking Number</label>
          <InputText 
            id="trackingNumber" 
            value={trackingNumber} 
            onChange={(e) => setTrackingNumber(e.target.value)} 
            placeholder="TRK-9823-PN" 
          />
        </div>

        <div className="form-group">
          <label htmlFor="courierName">Courier Name</label>
          <InputText 
            id="courierName" 
            value={courierName} 
            onChange={(e) => setCourierName(e.target.value)} 
            placeholder="Global Logistics Inc." 
          />
        </div>

        <div className="form-group">
          <label htmlFor="siteName">Site Name</label>
          <span className="p-input-icon-left w-full">
            <i className="pi pi-map-marker" />
            <InputText 
              id="siteName" 
              value={siteName} 
              onChange={(e) => setSiteName(e.target.value)} 
              placeholder="Main Warehouse A" 
            />
          </span>
        </div>

        <div className="form-group">
          <label htmlFor="status">Status</label>
          <Dropdown 
            id="status" 
            value={status} 
            options={statusOptions} 
            onChange={(e) => setStatus(e.value)} 
            placeholder="Select a Status" 
          />
        </div>

        <div className="form-group">
          <label htmlFor="dispatchDate">Dispatch Date</label>
          <Calendar 
            inputId="dispatchDate" 
            value={dispatchDate} 
            onChange={(e) => setDispatchDate(e.value as Date)} 
            showIcon 
            placeholder="mm/dd/yyyy" 
            dateFormat="mm/dd/yy"
          />
        </div>
      </div>

      {validationError && (
        <div className="validation-warning">
          <i className="pi pi-exclamation-triangle" />
          <div>
            <h4>Validation Required</h4>
            <p>{validationError}</p>
          </div>
        </div>
      )}
    </div>
  );
};