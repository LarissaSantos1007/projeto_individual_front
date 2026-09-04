import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import CadastroPage from './pages/CadastroPage';
import Dashboard from './pages/Dashboard';
import CategoriaPage from './pages/CategoriaPage';
import ProdutoPage from './pages/ProdutoPage';
import MovimentacaoPage from './pages/MovimentacaoPage';
import VendaPage from './pages/VendaPage';
import RelatoriosPage from './pages/RelatoriosPage';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="App">
          <ToastContainer 
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
          
          <Navbar />
          
          <Routes>
            {/* Rotas públicas */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/cadastro" element={<CadastroPage />} />
            
            {/* Rotas protegidas */}
            <Route path="/" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            
            <Route path="/categorias" element={
              <ProtectedRoute>
                <CategoriaPage />
              </ProtectedRoute>
            } />
            
            <Route path="/produtos" element={
              <ProtectedRoute>
                <ProdutoPage />
              </ProtectedRoute>
            } />
            
            <Route path="/movimentacoes" element={
              <ProtectedRoute>
                <MovimentacaoPage />
              </ProtectedRoute>
            } />
            
            <Route path="/vendas" element={
              <ProtectedRoute>
                <VendaPage />
              </ProtectedRoute>
            } />
            
            <Route path="/relatorios" element={
              <ProtectedRoute>
                <RelatoriosPage />
              </ProtectedRoute>
            } />
            
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;