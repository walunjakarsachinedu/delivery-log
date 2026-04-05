import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { DeliveryList } from './pages/DeliveryList';
import { AddDelivery } from './pages/AddDelivery';
import { DeliveryDetails } from './pages/DeliveryDetails';
import { SearchFilter } from './pages/SearchFilter';
import { useDeliveryStore } from './store/useDeliveryStore';
import { useEffect } from 'react';

function App() {
  const fetchDeliveries = useDeliveryStore(state => state.fetchDeliveries);

  useEffect(() => {
    fetchDeliveries();
  }, [fetchDeliveries]);

  return (
    <div style={{ minHeight: '100vh', padding: '1rem', boxSizing: 'border-box' }}>
      <Router>
        <Routes>
          <Route path="/" element={<DeliveryList />} />
          <Route path="/add" element={<AddDelivery />} />
          <Route path="/edit/:id" element={<AddDelivery />} />
          <Route path="/delivery/:id" element={<DeliveryDetails />} />
          <Route path="/search" element={<SearchFilter />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
