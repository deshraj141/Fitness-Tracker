import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import WorkoutLog from './pages/WorkoutLog';
import NutritionTracker from './pages/NutritionTracker';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import LandingPage from './pages/LandingPage';
import Analytics from './pages/Analytics';
import Goals from './pages/Goals';
import Profile from './pages/Profile';
import { Toaster } from 'react-hot-toast';
import './index.css';

function App() {
  return (
    <Router>
      <Toaster position="top-right" />
      <div className="min-h-screen bg-gray-900 text-white font-sans">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/workouts" element={<WorkoutLog />} />
            <Route path="/nutrition" element={<NutritionTracker />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/goals" element={<Goals />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
