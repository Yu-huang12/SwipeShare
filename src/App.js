import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Login from './components/Login';
import CreateOrder from './components/CreateOrder';
import MyOrders from './components/MyOrders';
import AvailableOrders from './components/AvailableOrders';
import Profile from './components/Profile';
import { NotificationProvider } from './contexts/NotificationContext';

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <Router>
          <div className="App">
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/create-order" element={<PrivateRoute><CreateOrder /></PrivateRoute>} />
              <Route path="/my-orders" element={<PrivateRoute><MyOrders /></PrivateRoute>} />
              <Route path="/available-orders" element={<PrivateRoute><AvailableOrders /></PrivateRoute>} />
              <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
            </Routes>
          </div>
        </Router>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App; 