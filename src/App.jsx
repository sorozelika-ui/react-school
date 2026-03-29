// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Dashboard from "./components/Pages/Dashboard";
import Register from "./components/Pages/Register"
import Login from "./components/Pages/Login";
import Eleves from "./components/Pages/Eleves";
import Notes from "./components/Pages/Notes";
import ElevesParClasse from "./components/Pages/Eleves_classe"
export default function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#161f38",
            color: "#e8edf5",
            border: "1px solid rgba(255,255,255,0.07)",
            fontFamily: "DM Sans, sans-serif",
          },
        }}
      />
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
       <Route path="/gestion-eleves" element={<Eleves />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="saisir-notes" element={<Notes />} /> 
          <Route path="/eleves-par-classe" element={<ElevesParClasse />} /> 
      </Routes>
    </BrowserRouter>
  );
}