import { PrimeReactProvider } from 'primereact/api';
import './assets/styles/theme.scss';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { DeliveryList } from './pages/DeliveryList';
import { AddDelivery } from './pages/AddDelivery';
import { DeliveryDetails } from './pages/DeliveryDetails';
import { SearchFilter } from './pages/SearchFilter';

function App() {

  return (
    <>
      <PrimeReactProvider>
        <Router>
          <div className="app-container">
            <main style={{ padding: '1rem' }}>
              <Routes>
                <Route path="/" element={<DeliveryList />} />
                <Route path="/add" element={<AddDelivery />} />
                <Route path="/edit/:id" element={<AddDelivery />} />
                <Route path="/delivery/:id" element={<DeliveryDetails />} />
                <Route path="/search" element={<SearchFilter />} />
              </Routes>
            </main>
          </div>
        </Router>
      </PrimeReactProvider>
    </>
  )
}

export default App
