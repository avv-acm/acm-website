import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import './admin/admin.css'
import App from './App.jsx'
import EventsPage from './pages/EventsPage.jsx'
import HomePage from './pages/HomePage.jsx'
import AboutPage from './pages/AboutPage.jsx'
import CoreCommitteePage from './pages/CoreCommitteePage.jsx'
import FacultyPage from './pages/FacultyPage.jsx'
import SigPage from './pages/SigPage.jsx'
import SupportPage from './pages/SupportPage.jsx'
import GalleryPage from './pages/GalleryPage.jsx'
import RegisterPage from './pages/RegisterPage.jsx'

import { ConvexProvider } from 'convex/react'
import { convex } from './convexClient.js'

// Admin Components (no Convex dependency)
import { AuthProvider } from './admin/hooks/useAuth'
import { ToastProvider } from './admin/components/Toast'
import AuthGate from './admin/components/AuthGate'
import AdminApp from './admin/AdminApp'

const root = createRoot(document.getElementById('root'));

// Admin route — fully self-contained (localStorage, no Convex needed)
function AdminRoute() {
  return (
    <AuthProvider>
      <ToastProvider>
        <AuthGate>
          <AdminApp />
        </AuthGate>
      </ToastProvider>
    </AuthProvider>
  );
}

function RouterConfig() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Admin Route — localStorage-based, no backend required */}
        <Route path="/admin/*" element={<AdminRoute />} />
        {/* Public Site Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/committee" element={<CoreCommitteePage />} />
        <Route path="/faculty" element={<FacultyPage />} />
        <Route path="/sigs" element={<SigPage />} />
        <Route path="/contact" element={<SupportPage />} />
        <Route path="/support" element={<SupportPage />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/*" element={<HomePage />} />
      </Routes>
    </BrowserRouter>
  );
}

root.render(
  <StrictMode>
    {convex ? (
      <ConvexProvider client={convex}>
        <RouterConfig />
      </ConvexProvider>
    ) : (
      <RouterConfig />
    )}
  </StrictMode>,
);
