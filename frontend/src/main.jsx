import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
// 1. أضف هذا السطر لاستيراد الرواوتر
import { BrowserRouter } from 'react-router-dom'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* 2. غلف تطبيقك بهذا المكون */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)
