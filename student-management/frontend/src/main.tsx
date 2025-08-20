import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import { LoginPage } from './pages/LoginPage.tsx'
import { AdminDashboard } from './pages/AdminDashboard.tsx'
import { StudentDashboard } from './pages/StudentDashboard.tsx'

const router = createBrowserRouter([
  { path: '/', element: <LoginPage /> },
  { path: '/admin', element: <AdminDashboard /> },
  { path: '/student', element: <StudentDashboard /> },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
