import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';

export const Layout = () => {
  return (
    <div className="flex h-screen overflow-hidden bg-brand-light font-sans text-brand-black">
      <Sidebar />
      <main className="flex-1 overflow-y-auto relative p-6 md:p-10">
        <div className="max-w-6xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
