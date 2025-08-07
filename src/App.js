// src/App.js
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import NavMenu from './components/NavMenu';
import HomePage from './pages/HomePage';
import TestConnection from './pages/TestConnection';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import UploadPage from './pages/UploadPage';
import BeatDetail from './pages/BeatDetail';
import { useAuth } from './hooks/useAuth';

// Ruta protegida: solo usuarios autenticados
function ProtectedRoute({ children }) {
  const user = useAuth();
  if (user === undefined) {
    return null;
  }
  if (user === null) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      {/* Menú de navegación global */}
      <NavMenu />
      <Routes>
        {/* Páginas públicas */}
        <Route path="/" element={<HomePage />} />
        <Route path="/test" element={<TestConnection />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Páginas protegidas */}
        <Route
          path="/upload"
          element={
            <ProtectedRoute>
              <UploadPage />
            </ProtectedRoute>
          }
        />
        <Route path="/beats/:id" element={<BeatDetail />} />
        {/* Cualquier otra ruta redirige al inicio */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
