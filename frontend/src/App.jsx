import { Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import InterviewPage from './pages/Interview';
import ResumeAnalyzer from './pages/ResumeAnalyzer';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import History from './pages/History';
import Logout from './pages/Logout';

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="interview" element={<InterviewPage />} />
        <Route path="resume-analyzer" element={<ResumeAnalyzer />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="settings" element={<Settings />} />
        <Route path="profile" element={<Profile />} />
        <Route path="history" element={<History />} />
        <Route path="logout" element={<Logout />} />
      </Route>
    </Routes>
  );
}

export default App;
