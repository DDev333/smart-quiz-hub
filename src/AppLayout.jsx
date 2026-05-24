import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

export default function AppLayout({ children }) {
  const navigate = useNavigate();
  
  const CURRENT_ROLE = localStorage.getItem('currentUserRole') || 'SME';
  const currentUser = localStorage.getItem('currentUser') || 'Unknown User';

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login'; 
  };

  return (
    <div className="flex h-screen bg-gray-50 font-sans text-gray-900">
      <aside className="w-64 bg-slate-900 text-white flex flex-col shadow-xl">
        <div className="p-6 border-b border-slate-700">
          <h1 className="text-xl font-bold tracking-tight">Smart Quiz AI Hub</h1>
          <span className="inline-block mt-2 px-2 py-1 bg-[#A855F7] text-xs rounded uppercase tracking-wider font-semibold">
            {CURRENT_ROLE} PORTAL
          </span>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-2">
          <NavLink to="/my-questions" className={({ isActive }) => `block px-4 py-3 rounded-md text-sm font-medium transition-colors ${isActive ? 'bg-slate-800 border-l-4 border-purple-500 text-white' : 'text-slate-300 hover:bg-slate-800'}`}>My Questions</NavLink>
          <NavLink to="/pending-reviews" className={({ isActive }) => `block px-4 py-3 rounded-md text-sm font-medium transition-colors ${isActive ? 'bg-slate-800 border-l-4 border-purple-500 text-white' : 'text-slate-300 hover:bg-slate-800'}`}>My Pending Reviews</NavLink>
          
          {CURRENT_ROLE === 'ADMIN' && (
            <NavLink to="/admin" className={({ isActive }) => `block px-4 py-3 rounded-md text-sm font-medium transition-colors ${isActive ? 'bg-slate-800 border-l-4 border-purple-500 text-white' : 'text-slate-300 hover:bg-slate-800'}`}>Question Bank Management</NavLink>
          )}
        </nav>
        
        <div className="p-4 border-t border-slate-700 text-sm text-slate-400 flex flex-col gap-3">
          <div>Logged in as:<br/><span className="text-white font-medium">{currentUser}</span></div>
          <button onClick={handleLogout} className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded border border-slate-600 transition-colors">Logout</button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm border-b border-gray-200 px-8 py-4 flex justify-between items-center z-10">
          <h2 className="text-2xl font-semibold text-gray-800">ATCI L&TT Hub</h2>
          <button onClick={() => navigate('/add-question')} className="bg-[#A855F7] hover:bg-purple-600 text-white px-5 py-2.5 rounded-md font-bold text-sm shadow-sm transition-colors">+ Add Question</button>
        </header>
        <div className="flex-1 overflow-auto p-8 relative">
          {children}
        </div>
      </main>
    </div>
  );
}