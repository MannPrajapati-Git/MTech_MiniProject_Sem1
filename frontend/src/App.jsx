import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Public Pages
import Home from './pages/public/Home';
import PriceBoard from './pages/public/PriceBoard';
import RecyclerDirectory from './pages/public/RecyclerDirectory';
import SafetyGuide from './pages/public/SafetyGuide';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import NotFound from './pages/NotFound';

// Collector Pages
import CollectorDashboard from './pages/collector/CollectorDashboard';
import CreateListing from './pages/collector/CreateListing';
import MyListings from './pages/collector/MyListings';
import ListingDetail from './pages/collector/ListingDetail';
import CollectorTransactions from './pages/collector/CollectorTransactions';

// Recycler Pages
import RecyclerDashboard from './pages/recycler/RecyclerDashboard';
import AvailableLots from './pages/recycler/AvailableLots';
import MyQuotes from './pages/recycler/MyQuotes';
import PickupManagement from './pages/recycler/PickupManagement';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import RecyclerVerification from './pages/admin/RecyclerVerification';
import AllListings from './pages/admin/AllListings';
import AllTransactions from './pages/admin/AllTransactions';
import UserManagement from './pages/admin/UserManagement';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* ================= PUBLIC ROUTES ================= */}
          <Route path="/" element={<Home />} />
          <Route path="/price-board" element={<PriceBoard />} />
          <Route path="/recyclers" element={<RecyclerDirectory />} />
          <Route path="/safety-guide" element={<SafetyGuide />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* ================= COLLECTOR ROUTES ================= */}
          <Route
            path="/collector/dashboard"
            element={
              <ProtectedRoute allowedRoles={['collector']}>
                <CollectorDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/collector/listings"
            element={
              <ProtectedRoute allowedRoles={['collector']}>
                <MyListings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/collector/listings/new"
            element={
              <ProtectedRoute allowedRoles={['collector']}>
                <CreateListing />
              </ProtectedRoute>
            }
          />
          <Route
            path="/collector/listings/:id"
            element={
              <ProtectedRoute allowedRoles={['collector']}>
                <ListingDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/collector/transactions"
            element={
              <ProtectedRoute allowedRoles={['collector']}>
                <CollectorTransactions />
              </ProtectedRoute>
            }
          />

          {/* ================= RECYCLER ROUTES ================= */}
          <Route
            path="/recycler/dashboard"
            element={
              <ProtectedRoute allowedRoles={['recycler']}>
                <RecyclerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/recycler/listings"
            element={
              <ProtectedRoute allowedRoles={['recycler']}>
                <AvailableLots />
              </ProtectedRoute>
            }
          />
          <Route
            path="/recycler/quotes"
            element={
              <ProtectedRoute allowedRoles={['recycler']}>
                <MyQuotes />
              </ProtectedRoute>
            }
          />
          <Route
            path="/recycler/pickups"
            element={
              <ProtectedRoute allowedRoles={['recycler']}>
                <PickupManagement />
              </ProtectedRoute>
            }
          />

          {/* ================= ADMIN ROUTES ================= */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/recyclers"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <RecyclerVerification />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/listings"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AllListings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/transactions"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AllTransactions />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <UserManagement />
              </ProtectedRoute>
            }
          />

          {/* ================= 404 FALLBACK ================= */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;