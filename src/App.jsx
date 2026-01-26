import { BrowserRouter, Routes, Route } from "react-router-dom";
import VerifyEmail from "./VerifyEmail";
import Login from "./Login";
import Dashboard from "./Dashboard";
import Signup from "./Signup";
import ResetPassword from "./ResetPassword";
import ForgotPassword from "./ForgotPassword";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/verify" element={<VerifyEmail />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/" element={<h1>Welcome to Micromart</h1>} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;