import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import { ToastProvider } from "./contexts/ToastContext"; 

// LAYOUTS
import AdminLayout from "./layouts/AdminLayout";
import UserLayout from "./layouts/UserLayout"; 
import AccountLayout from "./layouts/AccountLayout"; 

// MODULES
import VerifyEmail from "./pages/Auth/VerifyEmail";
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";
import ResetPassword from "./pages/Auth/ResetPassword";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import UserDashboard from './pages/Dashboard/Dashboard'; 
import ProductGallery from "./pages/Dashboard/ProductGallery";
import Orders from "./pages/Dashboard/Orders"; 
import AccountOverview from "./pages/Dashboard/AccountOverview"; 
import ComingSoon from "./pages/General/ComingSoon"; 
import OrderTracking from "./pages/Dashboard/OrderTracking"; 
import Checkout from "./pages/General/Checkout"; 

// PAYMENT
import PaymentSuccess from "./pages/Payment/PaymentSuccess";
import PaymentCancel from "./pages/Payment/PaymentCancel";

// ADMIN
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
            {/* AUTHENTICATION */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/verify" element={<VerifyEmail />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            {/* STOREFRONT & USER ZONE */}
            <Route element={<UserLayout />}>
                {/* Fixed: Alias to prevent 404 after Login redirect */}
                <Route path="/marketplace" element={<Navigate to="/" replace />} />
                <Route path="/" element={<ProductGallery />} />
                
                {/* 💳 Payment & Tracking Routes */}
                <Route path="/payment/success" element={<PaymentSuccess />} />
                <Route path="/payment/cancel" element={<PaymentCancel />} />
                <Route path="/orders/track/:orderId" element={<OrderTracking />} />
                
                {/* Checkout flows */}
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/checkout/retry/:orderId" element={<Checkout isRetry={true} />} />

                {/* AUTHENTICATED ACCOUNT ZONE */}
                <Route element={<AccountLayout />}>
                    <Route path="/account" element={<AccountOverview />} />
                    <Route path="/orders" element={<Orders />} />
                    <Route path="/account/management" element={<ComingSoon title="Account Management" />} />
                </Route>
            </Route>

            {/* ADMINISTRATIVE ZONE */}
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

            {/* FALLBACK */}
            <Route path="*" element={<ComingSoon title="404: Route Not Found" />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </ToastProvider>
  );
}

export default App;