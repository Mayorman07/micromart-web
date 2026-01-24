import { BrowserRouter, Routes, Route } from "react-router-dom";
import VerifyEmail from "./VerifyEmail";
import Login from "./Login";
import Dashboard from "./Dashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/verify" element={<VerifyEmail />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/" element={<h1>Welcome to Micromart</h1>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;