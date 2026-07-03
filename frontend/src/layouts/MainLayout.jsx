import { Outlet } from 'react-router-dom';
import Sidebar from '../components/sidebar/Sidebar';
import Topbar from '../components/common/Topbar';

export default function MainLayout() {
  return (
    <div className="flex h-screen min-h-screen bg-black overflow-hidden">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="ml-64 flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <Topbar />

        {/* Page Content */}
        <main className="flex-1 overflow-auto bg-black">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
