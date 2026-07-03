import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem('token');
    alert('Logout feature coming soon');
    navigate('/dashboard');
  }, [navigate]);

  return (
    <div className="min-h-screen bg-black text-white p-10">
      <h1 className="text-4xl font-bold">Logging out...</h1>
      <p className="mt-4 text-zinc-400">Redirecting you back to the dashboard.</p>
    </div>
  );
}
