import React from 'react'

import './App.css'
import './styles/theme.css'
import AppRoutes from './routes/AppRoutes'
import { ToastContainer } from 'react-toastify'

function App() {


  return (
    <>
      <ToastContainer/>
      <AppRoutes />
    </>
  )
}

export default App