import { BrowserRouter, Routes, Route } from "react-router-dom";
import VerifyEmail from "./VerifyEmail";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/verify" element={<VerifyEmail />} />
        <Route path="/" element={<h1>Welcome to Micromart</h1>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;