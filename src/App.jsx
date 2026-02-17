import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// 🌍 PUBLIC / USER PAGES
import VerifyEmail from "./pages/Auth/VerifyEmail";
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";
import ResetPassword from "./pages/Auth/ResetPassword";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import UserDashboard from './pages/Dashboard/Dashboard'; // Renamed for clarity
import ComingSoon from "./pages/General/ComingSoon"; 

// 🔐 ADMIN PAGES
import AdminLogin from "./pages/Auth/AdminLogin";
import AdminLayout from "./layouts/AdminLayout";       // The Sidebar Shell
import AdminDashboard from "./pages/admin/AdminDashboard"; // The "Mission Control"
import AddProduct from "./pages/admin/AddProduct";     // The Form

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ==============================
            🌍 PUBLIC WORLD (Bright & Airy)
           ============================== */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} /> {/* Redirect Home to Dashboard */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/verify" element={<VerifyEmail />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        
        {/* The User Dashboard (Snowfall/Glass) */}
        <Route path="/dashboard" element={<UserDashboard />} />
        
        <Route 
            path="/newsletter" 
            element={<ComingSoon title="Newsletter" message="Our newsletter subscription system is under construction. Check back later!" />} 
        />

        {/* ==============================
            🔐 ADMIN WORLD (Dark & Secure)
           ============================== */}
        
        {/* 1. Admin Login (Standalone - No Sidebar) */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* 2. Admin Layout Shell (Includes Sidebar & Command Palette) */}
        {/* All routes nested here will appear INSIDE the Admin Layout */}
        <Route path="/admin" element={<AdminLayout />}>
            
            {/* Redirect /admin to /admin/dashboard */}
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            
            {/* The "Mission Control" Page */}
            <Route path="dashboard" element={<AdminDashboard />} />
            
            {/* The Add Product Form */}
            <Route path="products" element={<AddProduct />} />
            
            {/* Placeholder for Users */}
            <Route path="users" element={<div className="p-10 text-white">User Management Module (Coming Soon)</div>} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;