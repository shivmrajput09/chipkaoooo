import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import AllPastes from './pages/AllPastes';
import ViewPaste from './pages/ViewPaste';
import Login from './pages/Login';
import Signup from './pages/Signup';
import './App.css';

// ============================================================================
// App Component
// ============================================================================
// Yahan humne AuthProvider ko wrap kiya hai taaki poori application me
// login/signup ka context accessible ho. Saath hi login aur signup ke routes
// bhi add kiye hain taaki authentication flow ready rahe.
// ============================================================================

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans antialiased selection:bg-indigo-500 selection:text-white">
        {/* Navigation Bar */}
        <Navbar />

        {/* Main Application Routes */}
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/pastes" element={<AllPastes />} />
            <Route path="/pastes/:id" element={<ViewPaste />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Routes>
        </main>
      </div>
    </AuthProvider>
  );
}

export default App;
