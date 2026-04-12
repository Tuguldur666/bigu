import './styles.css'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import Dashboard from './pages/Dashboard'
import JobPostPage from './pages/JobPostPage'
import LoginPage from './pages/LoginPage'
import ProfilePage from './pages/ProfilePage'
import JobDetailPage from './pages/JobDetailPage'
import CompanyDetailPage from './pages/CompanyDetailPage'
import CompaniesPage from './pages/CompaniesPage'
import { AuthProvider, useAuth } from './context/AuthContext'

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <div style={{ padding: 40, textAlign: 'center' }}>Түр хүлээнэ үү...</div>
  if (!user) return <Navigate to="/login" />
  return children
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="companies" element={<CompaniesPage />} />
            <Route path="job/:id" element={<JobDetailPage />} />
            <Route path="company/:id" element={<CompanyDetailPage />} />
            <Route path="dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="job-post" element={<ProtectedRoute><JobPostPage /></ProtectedRoute>} />
            <Route path="profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}