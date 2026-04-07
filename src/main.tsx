import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ChakraProvider } from '@chakra-ui/react';
import { systemTheme } from './theme';
import './index.css';
import App from './App.tsx';
import { Theme } from "@chakra-ui/react"

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ChakraProvider value={systemTheme}>
      <Theme appearance="dark">
        <App />
      </Theme>
    </ChakraProvider>
  </StrictMode>,
);
