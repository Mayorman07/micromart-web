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
import OperativesList from "./pages/admin/OperativesList";
import InventoryRegistry from "./pages/admin/InventoryRegistry"; // ⬅️ Kept this
import InventoryDashboard from "./pages/admin/InventoryDashboard"; // ⬅️ Added this
import ProfileSettings from "./pages/admin/ProfileSettings";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ... PUBLIC WORLD ROUTES REMAIN UNCHANGED ... */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/verify" element={<VerifyEmail />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/dashboard" element={<UserDashboard />} />

        {/* ==============================
            🔐 ADMIN WORLD
           ============================== */}
        <Route path="/admin/login" element={<AdminLogin />} />

        <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="products" element={<AddProduct />} />
            <Route path="view/:email" element={<UserDossier />} />
            <Route path="settings" element={<ProfileSettings />} />
            <Route path="operatives" element={<OperativesList />} />
            
            {/* ✅ Both components are now active on different paths */}
            <Route path="inventory" element={<InventoryDashboard />} />
            <Route path="registry" element={<InventoryRegistry />} /> 
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;