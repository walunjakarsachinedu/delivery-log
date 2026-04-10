import { Box, Container } from '@chakra-ui/react';
import { useEffect } from 'react';
import { createBrowserRouter, Outlet, RouterProvider, ScrollRestoration } from 'react-router-dom';
import DeliveryDetails from './pages/DeliveryDetails';
import DeliveryList from './pages/DeliveryList';
import { useDeliveryStore } from './store/useDeliveryStore';
import SignInPage from './pages/SignIn';

function App() {
  const fetchDeliveries = useDeliveryStore(state => state.fetchDeliveries);

  useEffect(() => {
    if(localStorage.getItem("token")) fetchDeliveries();
  }, [fetchDeliveries]);

  return (
    <Box minH="100vh">
      <Container maxW="container.xl" py={4}>
        <RouterProvider router={router} />
      </Container>
    </Box>
  );
}

const router = createBrowserRouter([
  {
    element: <><ScrollRestoration /><Outlet /></>,
    children: [
      { path: '/', element: <DeliveryList /> },
      { path: '/signin', element: <SignInPage /> },
      { path: '/add', element: <DeliveryDetails mode="add" /> },
      { path: '/delivery/:id', element: <DeliveryDetails mode="edit" /> },
    ],
  },
]);

export default App;
