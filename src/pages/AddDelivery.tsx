import { useState, useRef, type ChangeEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDeliveryStore } from '../store/useDeliveryStore';
import type { DeliveryStatus } from '../types/delivery';

const statusOptions = [
  { label: 'Pending', value: 'pending' },
  { label: 'In-Transit', value: 'in-transit' },
  { label: 'Completed', value: 'completed' },
  { label: 'Returned', value: 'returned' }
];

export const AddDelivery = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { deliveries, addDelivery, updateDelivery } = useDeliveryStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const existingDelivery = id ? deliveries.find((d) => d.id === id) : null;

  const [customerName, setCustomerName] = useState(existingDelivery?.customerName || '');
  const [materialName, setMaterialName] = useState(existingDelivery?.materialName || '');
  const [cost, setCost] = useState<number | null>(existingDelivery?.cost || null);
  const [trackingNumber, setTrackingNumber] = useState(existingDelivery?.trackingNumber || '');
  const [courierName, setCourierName] = useState(existingDelivery?.courierName || '');
  const [siteName, setSiteName] = useState(existingDelivery?.siteName || '');
  const [status, setStatus] = useState<DeliveryStatus>(existingDelivery?.status || 'pending');
  const [dispatchDate, setDispatchDate] = useState(existingDelivery?.dispatchDate ? existingDelivery.dispatchDate.slice(0, 10) : '');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(existingDelivery?.photoUrl || null);
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleFileSelect = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleSave = async () => {
    if (!customerName || !trackingNumber || !siteName) {
      setValidationError('Please fill in all required fields: customer, tracking number, and site.');
      return;
    }

    const deliveryData = {
      photoUrl: previewUrl || null,
      customerName,
      materialName,
      cost: cost || 0,
      trackingNumber,
      courierName,
      siteName,
      status,
      dispatchDate: dispatchDate ? new Date(dispatchDate).toISOString() : new Date().toISOString(),
    };

    if (id) {
      await updateDelivery(id, deliveryData, selectedFile);
    } else {
      await addDelivery(deliveryData, selectedFile);
    }

    navigate('/');
  };

  const isEditMode = Boolean(id);

  return (
    <div style={{ maxWidth: 760, margin: '0 auto', padding: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
        <button type="button" onClick={() => navigate('/')} style={{ padding: '0.6rem 0.9rem', border: '1px solid #ccc', borderRadius: 8, background: '#fff' }}>
          Back
        </button>
        <h2 style={{ margin: 0, fontSize: '1.5rem' }}>{isEditMode ? 'Edit Delivery' : 'Add Delivery'}</h2>
        <button type="button" onClick={handleSave} style={{ padding: '0.65rem 1rem', border: '1px solid #1d4ed8', borderRadius: 8, background: '#1d4ed8', color: '#fff' }}>
          Save
        </button>
      </div>

      <div
        onClick={triggerFileInput}
        style={{
          border: '1px dashed #bbb',
          borderRadius: 12,
          padding: '1.25rem',
          textAlign: 'center',
          background: '#fff',
          cursor: 'pointer',
          marginBottom: '1rem'
        }}
      >
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: 'none' }}
          accept="image/jpeg, image/png"
          onChange={handleFileSelect}
        />
        {previewUrl ? (
          <img src={previewUrl} alt="Preview" style={{ maxWidth: '100%', maxHeight: 220, borderRadius: 12 }} />
        ) : (
          <>
            <div style={{ marginBottom: '0.75rem', color: '#555' }}>Click to upload a package photo</div>
            <div style={{ color: '#777' }}>JPG or PNG up to 10MB</div>
          </>
        )}
      </div>

      {validationError ? (
        <div style={{ marginBottom: '1rem', padding: '1rem', borderRadius: 10, background: '#fee2e2', border: '1px solid #fca5a5', color: '#991b1b' }}>
          {validationError}
        </div>
      ) : null}

      <div style={{ display: 'grid', gap: '1rem' }}>
        <label style={{ display: 'grid', gap: '0.5rem' }}>
          <span>Customer Name</span>
          <input
            id="customerName"
            value={customerName}
            onChange={(event) => setCustomerName(event.target.value)}
            placeholder="Johnathan Doe"
            style={{ width: '100%', padding: '0.75rem', border: '1px solid #ccc', borderRadius: 8 }}
          />
        </label>

        <label style={{ display: 'grid', gap: '0.5rem' }}>
          <span>Material Name</span>
          <input
            id="materialName"
            value={materialName}
            onChange={(event) => setMaterialName(event.target.value)}
            placeholder="Industrial Components"
            style={{ width: '100%', padding: '0.75rem', border: '1px solid #ccc', borderRadius: 8 }}
          />
        </label>

        <label style={{ display: 'grid', gap: '0.5rem' }}>
          <span>Cost ($)</span>
          <input
            id="cost"
            type="number"
            value={cost ?? ''}
            onChange={(event) => setCost(parseFloat(event.target.value) || 0)}
            placeholder="0.00"
            style={{ width: '100%', padding: '0.75rem', border: '1px solid #ccc', borderRadius: 8 }}
          />
        </label>

        <label style={{ display: 'grid', gap: '0.5rem' }}>
          <span>Tracking Number</span>
          <input
            id="trackingNumber"
            value={trackingNumber}
            onChange={(event) => setTrackingNumber(event.target.value)}
            placeholder="TRK-9823-PN"
            style={{ width: '100%', padding: '0.75rem', border: '1px solid #ccc', borderRadius: 8 }}
          />
        </label>

        <label style={{ display: 'grid', gap: '0.5rem' }}>
          <span>Courier Name</span>
          <input
            id="courierName"
            value={courierName}
            onChange={(event) => setCourierName(event.target.value)}
            placeholder="Global Logistics Inc."
            style={{ width: '100%', padding: '0.75rem', border: '1px solid #ccc', borderRadius: 8 }}
          />
        </label>

        <label style={{ display: 'grid', gap: '0.5rem' }}>
          <span>Site Name</span>
          <input
            id="siteName"
            value={siteName}
            onChange={(event) => setSiteName(event.target.value)}
            placeholder="Main Warehouse A"
            style={{ width: '100%', padding: '0.75rem', border: '1px solid #ccc', borderRadius: 8 }}
          />
        </label>

        <label style={{ display: 'grid', gap: '0.5rem' }}>
          <span>Status</span>
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value as DeliveryStatus)}
            style={{ width: '100%', padding: '0.75rem', border: '1px solid #ccc', borderRadius: 8 }}
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label style={{ display: 'grid', gap: '0.5rem' }}>
          <span>Dispatch Date</span>
          <input
            type="date"
            value={dispatchDate}
            onChange={(event) => setDispatchDate(event.target.value)}
            style={{ width: '100%', padding: '0.75rem', border: '1px solid #ccc', borderRadius: 8 }}
          />
        </label>
      </div>
    </div>
  );
};