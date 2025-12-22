import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { Analytics } from "@vercel/analytics/react"

import Dashboard from './components/Dashboard';
import Layout from './Layout';
import Login from './components/Login';
import Profile from './components/Profile';
import UserProfile from './components/UserProfile';
import Footer from './components/Footer';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/user/:username" element={<UserProfile />} />
        </Route>
      </Routes>
      
      <Footer />
      <Analytics />
    </BrowserRouter>
  );
}

export default App;
