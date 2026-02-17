import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// 🌍 PUBLIC / USER PAGES
import VerifyEmail from "./pages/Auth/VerifyEmail";
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";
import ResetPassword from "./pages/Auth/ResetPassword";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import UserDashboard from './pages/Dashboard/Dashboard'; 
import ComingSoon from "./pages/General/ComingSoon"; 

// 🔐 ADMIN PAGES
import AdminLogin from "./pages/Auth/AdminLogin";
import AdminLayout from "./layouts/AdminLayout";       
import AdminDashboard from "./pages/admin/AdminDashboard"; 
import AddProduct from "./pages/admin/AddProduct";     
import UserDossier from "./pages/admin/UserDossier"; 
import OperativesList from "./pages/admin/OperativesList"; // ✅ New Import

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ==============================
            🌍 PUBLIC WORLD
           ============================== */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/verify" element={<VerifyEmail />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        
        <Route path="/dashboard" element={<UserDashboard />} />
        <Route 
            path="/newsletter" 
            element={<ComingSoon title="Newsletter" message="Construction in progress." />} 
        />

        {/* ==============================
            🔐 ADMIN WORLD
           ============================== */}
        <Route path="/admin/login" element={<AdminLogin />} />

        <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="products" element={<AddProduct />} />
            <Route path="view/:email" element={<UserDossier />} />
            
            {/* ✅ SWAPPED placeholder for the real List component */}
            <Route path="users" element={<OperativesList />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;