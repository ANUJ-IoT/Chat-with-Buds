import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import ResetPassword from "./pages/ResetPassword.jsx";
import Authentication from "./pages/Authentication.jsx";
import { Toaster } from "dynaura";

export default function App() {
  return (
    <>
      <Toaster />

      <Routes>
        <Route path="/" element={<Authentication />} />
        <Route path="/resetpassword" element={<ResetPassword />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </>
  );
}
