import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Benefits from './components/Benefits';
import Features from './components/Features';
import Pricing from './components/Pricing';
import CTA from './components/CTA';
import SignUp from './components/SignUp';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import WaitlistConfirmation from './components/WaitlistConfirmation';
import HowItWorks from './components/HowItWorks';
import Preferences from './components/Preferences';
import Subscription from './components/Subscription';
import ScrollToTop from './components/ScrollToTop';

function HomePage() {
  return (
    <>
      <Navbar />
      <Hero />
      <Benefits />
      <Features />
      <Pricing />
      <CTA />
    </>
  );
}

function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen bg-white">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/confirmation" element={<WaitlistConfirmation />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/preferences" element={<Preferences />} />
          <Route path="/subscription" element={<Subscription />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;