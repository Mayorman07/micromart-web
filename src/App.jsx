import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// GLOBAL CONTEXTS
import { ToastProvider } from "./contexts/ToastContext"; 

// LAYOUTS
import AdminLayout from "./layouts/AdminLayout";
import UserLayout from "./layouts/UserLayout"; 

// PUBLIC & AUTHENTICATION MODULES
import VerifyEmail from "./pages/Auth/VerifyEmail";
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";
import ResetPassword from "./pages/Auth/ResetPassword";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import UserDashboard from './pages/Dashboard/Dashboard'; 
import ProductGallery from "./pages/Dashboard/ProductGallery";
import Orders from "./pages/Dashboard/Orders"; 
import ComingSoon from "./pages/General/ComingSoon"; 

// ADMINISTRATIVE CORE
import AdminLogin from "./pages/Auth/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard"; 
import AddProduct from "./pages/admin/AddProduct";     
import UserDetails from "./pages/admin/UserDetails"; 
import UserList from "./pages/admin/UserList";       
import InventoryRegistry from "./pages/admin/InventoryRegistry";
import InventoryDashboard from "./pages/admin/InventoryDashboard";
import ProfileSettings from "./pages/admin/ProfileSettings";

/**
 * MicroMart App Entry Point
 * Defines the routing hierarchy and layout structures.
 */
function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          {/* --- PUBLIC ACCESS ROUTES --- */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<UserDashboard />} />
          <Route path="/newsletter" element={<ComingSoon title="MicroMart Newsletter" />} />

          {/* --- AUTHENTICATION FLOWS --- */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/verify" element={<VerifyEmail />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* --- PROTECTED USER ZONE --- */}
          <Route element={<UserLayout />}>
              <Route path="/marketplace" element={<ProductGallery />} />
              <Route path="/orders" element={<Orders />} /> {/* ADDED: Protected Orders route */}
          </Route>

          {/* --- ADMINISTRATIVE RESTRICTED ZONE --- */}
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Protected Admin Layout Shell */}
          <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="products" element={<AddProduct />} />
              <Route path="view/:email" element={<UserDetails />} />
              <Route path="settings" element={<ProfileSettings />} />
              <Route path="operatives" element={<UserList />} />
              
              {/* Inventory Management Cluster */}
              <Route path="inventory" element={<InventoryDashboard />} />
              <Route path="registry" element={<InventoryRegistry />} /> 
          </Route>

          {/* --- GLOBAL FALLBACK --- */}
          <Route path="*" element={<ComingSoon title="404: Route Not Found" message="The requested module is either missing or under maintenance." />} />
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  );
}

export default App;