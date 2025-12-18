import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { Analytics } from "@vercel/analytics/react"

import Dashboard from './components/Dashboard';
import Layout from './Layout';
import Login from './components/Login';
import Profile from './components/Profile';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Routes>

      <Analytics />
    </BrowserRouter>
  );
}

export default App;
