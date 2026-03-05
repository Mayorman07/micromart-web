import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
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

function App() {
  return (
    <ToastProvider>
      <ThemeProvider> 
        <BrowserRouter>
          <Routes>
            {/* --- SYSTEM & INFO ROUTES --- */}
            <Route path="/system-status" element={<UserDashboard />} /> {/* Moved your old dashboard here */}
            <Route path="/newsletter" element={<ComingSoon title="MicroMart Newsletter" />} />

            {/* --- AUTHENTICATION FLOWS --- */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/verify" element={<VerifyEmail />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            {/* --- STOREFRONT (NOW PUBLIC) --- */}
            <Route element={<UserLayout />}>
                {/* 🎯 The true homepage is now the marketplace! */}
                <Route path="/" element={<ProductGallery />} />
                <Route path="/marketplace" element={<Navigate to="/" replace />} />
                
                {/* Orders remain under this layout, but should be guarded inside the Orders component */}
                <Route path="/orders" element={<Orders />} />
            </Route>

            {/* --- ADMINISTRATIVE RESTRICTED ZONE --- */}
            <Route path="/admin/login" element={<AdminLogin />} />

            <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="products" element={<AddProduct />} />
                <Route path="view/:email" element={<UserDetails />} />
                <Route path="settings" element={<ProfileSettings />} />
                <Route path="operatives" element={<UserList />} />
                <Route path="inventory" element={<InventoryDashboard />} />
                <Route path="registry" element={<InventoryRegistry />} /> 
            </Route>

            <Route path="*" element={<ComingSoon title="404: Route Not Found" />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </ToastProvider>
  );
}

export default App;