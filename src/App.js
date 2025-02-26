import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
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
import { ThemeProvider, CssBaseline } from '@mui/material';
import { theme } from './theme';
import { AnimatePresence } from 'framer-motion';
import ParticleBackground from './components/effects/ParticleBackground';
import PageTransition from './components/effects/PageTransition';
import BuyOrder from './components/BuyOrder';
import SellOrder from './components/SellOrder';
import AvailableSwipes from './components/AvailableSwipes';
import RequestMeal from './components/RequestMeal';
import NotificationHandler from './components/NotificationHandler';
import AdminView from './components/AdminView';

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={
          <PageTransition>
            <Home />
          </PageTransition>
        } />
        <Route path="/login" element={
          <PageTransition>
            <Login />
          </PageTransition>
        } />
        <Route path="/create-order" element={<PrivateRoute><CreateOrder /></PrivateRoute>} />
        <Route path="/my-orders" element={<PrivateRoute><MyOrders /></PrivateRoute>} />
        <Route path="/available-orders" element={<PrivateRoute><AvailableOrders /></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
        <Route path="/buy-meal" element={<BuyOrder />} />
        <Route path="/sell-meal" element={<PrivateRoute><SellOrder /></PrivateRoute>} />
        <Route path="/available-swipes" element={<PrivateRoute><AvailableSwipes /></PrivateRoute>} />
        <Route path="/buy-meal/:id" element={<PrivateRoute><BuyOrder /></PrivateRoute>} />
        <Route path="/request-meal" element={<PrivateRoute><RequestMeal /></PrivateRoute>} />
        <Route path="/admin" element={<PrivateRoute><AdminView /></PrivateRoute>} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Router>
            <ParticleBackground />
            <div className="App">
              <Navbar />
              <NotificationHandler />
              <AnimatedRoutes />
            </div>
          </Router>
        </ThemeProvider>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App; 