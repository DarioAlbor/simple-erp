import React from 'react';
import ReactDOM from 'react-dom/client';
import { ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import UpArrow from './components/ui/upArrow';
import Github from './components/ui/visitGithub';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ChakraProvider>
      <BrowserRouter>
        <App />
        <UpArrow />
        <Github />
      </BrowserRouter>
    </ChakraProvider>
  </React.StrictMode>
);