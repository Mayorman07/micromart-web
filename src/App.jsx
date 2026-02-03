import { BrowserRouter, Routes, Route } from "react-router-dom";

// Pages
import VerifyEmail from "./pages/Auth/VerifyEmail";
import Login from "./pages/Auth/Login";
import AdminLogin from "./pages/Auth/AdminLogin";
import Dashboard from './pages/Dashboard/Dashboard';
import Signup from "./pages/Auth/Signup";
import ResetPassword from "./pages/Auth/ResetPassword";
import ForgotPassword from "./pages/Auth/ForgotPassword";
// Import the new Coming Soon page
import ComingSoon from "./pages/General/ComingSoon"; 

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/verify" element={<VerifyEmail />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Dashboard (Now shows Coming Soon card) */}
        <Route path="/dashboard" element={<Dashboard />} />
        
        {/* Newsletter (Redirects to Generic Coming Soon) */}
        <Route 
            path="/newsletter" 
            element={<ComingSoon title="Newsletter" message="Our newsletter subscription system is under construction. Check back later!" />} 
        />

        {/* Home */}
        <Route path="/" element={<h1>Welcome to Micromart</h1>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;