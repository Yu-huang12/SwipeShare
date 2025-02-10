import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Login from './components/Login';
import CreateOrder from './components/CreateOrder';
import MyOrders from './components/MyOrders';
import AvailableOrders from './components/AvailableOrders';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/create-order" element={<CreateOrder />} />
            <Route path="/my-orders" element={<MyOrders />} />
            <Route path="/available-orders" element={<AvailableOrders />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App; 