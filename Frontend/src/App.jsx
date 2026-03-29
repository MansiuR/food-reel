import React, { useEffect } from 'react'

import './App.css'
import './styles/theme.css'
import AppRoutes from './routes/AppRoutes'
import { ToastContainer } from 'react-toastify'

function App() {
  useEffect(() => {
    // App-level validation: Check localStorage on startup
    const user = localStorage.getItem('user');
    console.log("🚀 APP STARTUP - User in localStorage:", user);
    
    try {
      if (user && user !== 'undefined' && user !== 'null') {
        JSON.parse(user);
        console.log("✅ User data is valid JSON");
      } else {
        console.log("⚠️  Invalid or missing user data - clearing localStorage");
        localStorage.clear();
      }
    } catch (e) {
      console.log("⚠️  Corrupted user data - clearing storage:", e);
      localStorage.clear();
    }
  }, []);

  return (
    <>
      <ToastContainer/>
      <AppRoutes />
    </>
  )
}

export default App