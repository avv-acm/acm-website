import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ConvexProvider, ConvexReactClient } from 'convex/react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import './admin/admin.css'
import App from './App.jsx'

// Admin Wrappers & Components
import { AuthProvider } from './admin/hooks/useAuth'
import { ToastProvider } from './admin/components/Toast'
import AuthGate from './admin/components/AuthGate'
import AdminApp from './admin/AdminApp'

const convexUrl = import.meta.env.VITE_CONVEX_URL;
const convex = convexUrl ? new ConvexReactClient(convexUrl) : null;

const root = createRoot(document.getElementById('root'));

function RouterConfig() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Admin Route Guarded by Auth & Toast */}
        <Route
          path="/admin/*"
          element={
            <AuthProvider>
              <ToastProvider>
                <AuthGate>
                  <AdminApp />
                </AuthGate>
              </ToastProvider>
            </AuthProvider>
          }
        />
        {/* Public Site Routes */}
        <Route path="/*" element={<App />} />
      </Routes>
    </BrowserRouter>
  );
}

if (convex) {
  root.render(
    <StrictMode>
      <ConvexProvider client={convex}>
        <RouterConfig />
      </ConvexProvider>
    </StrictMode>,
  );
} else {
  console.warn('[Convex] VITE_CONVEX_URL not set — running without Convex backend');
  root.render(
    <StrictMode>
      <RouterConfig />
    </StrictMode>,
  );
}
