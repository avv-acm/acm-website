import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import './admin/admin.css'
import App from './App.jsx'

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
        <Route path="/*" element={<App />} />
      </Routes>
    </BrowserRouter>
  );
}

root.render(
  <StrictMode>
    <RouterConfig />
  </StrictMode>,
);
