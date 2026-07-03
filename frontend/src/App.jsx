import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import InterviewPage from './pages/Interview';
import ResumeAnalyzer from './pages/ResumeAnalyzer';
import History from './pages/History';
import Logout from './pages/Logout';
import Login from './pages/Login';

function ProtectedRoute() {
  const token = localStorage.getItem('token');
  return token ? <Outlet /> : <Navigate to="/login" replace />;
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="interview" element={<InterviewPage />} />
          <Route path="resume-analyzer" element={<ResumeAnalyzer />} />
          <Route path="history" element={<History />} />
          <Route path="logout" element={<Logout />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default App;
