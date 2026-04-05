import { useParams, useNavigate } from 'react-router-dom';
import { useDeliveryStore } from '../store/useDeliveryStore';

export const DeliveryDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { deliveries, deleteDelivery } = useDeliveryStore();

  const delivery = deliveries.find((d) => d.id === id);

  if (!delivery) {
    return (
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '1rem', textAlign: 'center' }}>
        <h2 style={{ margin: '0 0 1rem', fontSize: '1.5rem' }}>Delivery Not Found</h2>
        <button type="button" onClick={() => navigate('/')} style={{ padding: '0.65rem 1rem', borderRadius: 8, border: '1px solid #ccc' }}>
          Back to List
        </button>
      </div>
    );
  }

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this delivery record?')) {
      deleteDelivery(delivery.id);
      navigate('/');
    }
  };

  const formatCurrency = (amount: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  return (
    <div style={{ maxWidth: 760, margin: '0 auto', padding: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
        <button type="button" onClick={() => navigate('/')} style={{ padding: '0.6rem 0.9rem', border: '1px solid #ccc', borderRadius: 8, background: '#fff' }}>
          Back
        </button>
        <h2 style={{ margin: 0, fontSize: '1.5rem' }}>Delivery Details</h2>
        <button type="button" onClick={() => navigate(`/edit/${delivery.id}`)} style={{ padding: '0.6rem 0.9rem', border: '1px solid #1d4ed8', borderRadius: 8, background: '#1d4ed8', color: '#fff' }}>
          Edit
        </button>
      </div>

      <section style={{ background: '#fff', padding: '1rem', borderRadius: 12, border: '1px solid #ddd', marginBottom: '1rem' }}>
        <p style={{ margin: 0, color: '#555' }}>Courier: {delivery.courierName || 'Standard Logistics'}</p>
        <h3 style={{ margin: '0.75rem 0 0', fontSize: '1.25rem' }}>{delivery.trackingNumber}</h3>
        <div style={{ marginTop: '1rem', display: 'grid', gap: '0.75rem' }}>
          <div>
            <strong>Customer</strong>
            <p style={{ margin: '0.25rem 0 0', color: '#555' }}>{delivery.customerName}</p>
          </div>
          <div>
            <strong>Site</strong>
            <p style={{ margin: '0.25rem 0 0', color: '#555' }}>{delivery.siteName}</p>
          </div>
          <div>
            <strong>Material</strong>
            <p style={{ margin: '0.25rem 0 0', color: '#555' }}>{delivery.materialName || 'Not specified'}</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div>
              <strong>Status</strong>
              <p style={{ margin: '0.25rem 0 0', color: '#1d4ed8' }}>{delivery.status}</p>
            </div>
            <div>
              <strong>Dispatch Date</strong>
              <p style={{ margin: '0.25rem 0 0', color: '#555' }}>{formatDate(delivery.dispatchDate)}</p>
            </div>
          </div>
          <div>
            <strong>Cost</strong>
            <p style={{ margin: '0.25rem 0 0', color: '#555' }}>{formatCurrency(delivery.cost)}</p>
          </div>
        </div>
      </section>

      <button
        type="button"
        onClick={handleDelete}
        style={{ width: '100%', padding: '0.9rem 1rem', borderRadius: 10, border: '1px solid #dc2626', background: '#dc2626', color: '#fff' }}
      >
        Delete Delivery
      </button>
    </div>
  );
};