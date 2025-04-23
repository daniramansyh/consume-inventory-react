import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import  'bootstrap/dist/css/bootstrap.min.css'
import { RouterProvider } from 'react-router-dom'
import { router } from './routes/index.jsx'
import axios from 'axios'

// default header authorization agar setiap memanggil api akan otomatis ada header authorization
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token')
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  error => {
    return Promise.reject(error) 
  }
)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* <App /> */}

    <RouterProvider router={router}>

    </RouterProvider>
  </StrictMode>,
)
