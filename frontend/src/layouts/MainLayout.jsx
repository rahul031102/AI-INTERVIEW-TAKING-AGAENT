import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/sidebar/Sidebar';
import Topbar from '../components/common/Topbar';

export default function MainLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen min-h-screen bg-black overflow-hidden">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Main Content */}
      <div className="lg:ml-64 flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <Topbar onMenuClick={() => setIsSidebarOpen(true)} />

        {/* Page Content */}
        <main className="flex-1 overflow-auto bg-black">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
