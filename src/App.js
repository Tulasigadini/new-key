import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import Chat from './components/Chat';
import './index.css';

function App() {
  return (
    <BrowserRouter>
      <Chat />
    </BrowserRouter>
  );
}

export default App;