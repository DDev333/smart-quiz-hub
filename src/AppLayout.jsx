import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

export default function AppLayout({ children }) {
  const navigate = useNavigate();
  const CURRENT_ROLE = localStorage.getItem('currentUserRole') || 'SME';
  const currentUser = localStorage.getItem('currentUser') || 'Unknown User';

  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDarkMode(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDarkMode(true);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login'; 
  };

  return (
    <div className="flex h-screen bg-zinc-50 dark:bg-zinc-950 font-sans text-zinc-900 dark:text-zinc-100 overflow-hidden transition-colors duration-300">
      
      {/* Pit Wall Sidebar */}
      <aside className="w-72 bg-zinc-950 text-white flex flex-col shadow-2xl relative z-20 border-r border-zinc-800">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-30 pointer-events-none"></div>
        
        <div className="p-8 border-b border-zinc-800 relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 bg-red-600 flex items-center justify-center shadow-lg shadow-red-600/40 skew-x-[-10deg]">
              <span className="text-white text-sm font-black italic skew-x-[10deg]">F1</span>
            </div>
            <h1 className="text-xl font-black tracking-tighter uppercase italic">
              Quiz <span className="text-red-500">Telemetry</span>
            </h1>
          </div>
          <span className="inline-flex items-center gap-1.5 mt-2 px-2.5 py-1 bg-zinc-900 border border-zinc-700 text-[10px] font-black text-zinc-300 uppercase tracking-[0.2em] shadow-inner">
            <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></div>
            {CURRENT_ROLE} LINK
          </span>
        </div>
        
        <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto relative z-10">
          <NavLink to="/my-questions" className={({ isActive }) => `block px-5 py-3.5 text-sm font-bold uppercase tracking-wider transition-all duration-200 skew-x-[-5deg] ${isActive ? 'bg-red-600/10 border-l-4 border-red-600 text-white translate-x-2' : 'text-zinc-400 hover:bg-zinc-900 hover:text-white'}`}>
            <span className="inline-block skew-x-[5deg]"><span className="mr-3">📋</span> My Telemetry</span>
          </NavLink>
          <NavLink to="/pending-reviews" className={({ isActive }) => `block px-5 py-3.5 text-sm font-bold uppercase tracking-wider transition-all duration-200 skew-x-[-5deg] ${isActive ? 'bg-red-600/10 border-l-4 border-red-600 text-white translate-x-2' : 'text-zinc-400 hover:bg-zinc-900 hover:text-white'}`}>
            <span className="inline-block skew-x-[5deg]"><span className="mr-3">⏱️</span> Pending Reviews</span>
          </NavLink>
          
          {CURRENT_ROLE === 'ADMIN' && (
            <NavLink to="/admin" className={({ isActive }) => `block px-5 py-3.5 text-sm font-bold uppercase tracking-wider transition-all duration-200 skew-x-[-5deg] ${isActive ? 'bg-red-600/10 border-l-4 border-red-600 text-white translate-x-2' : 'text-zinc-400 hover:bg-zinc-900 hover:text-white'}`}>
              <span className="inline-block skew-x-[5deg]"><span className="mr-3">🏁</span> Master Grid</span>
            </NavLink>
          )}
        </nav>
        
        <div className="p-6 border-t border-zinc-800 bg-zinc-950/80 backdrop-blur-md relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-zinc-800 border-2 border-red-600 flex items-center justify-center text-red-500 font-black uppercase">
              {currentUser.charAt(0)}
            </div>
            <div>
              <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Driver</p>
              <p className="text-sm text-white font-bold truncate max-w-[140px]">{currentUser}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="w-full py-2.5 bg-zinc-900 hover:bg-red-600 text-zinc-400 hover:text-white text-xs font-black uppercase tracking-widest border border-zinc-800 transition-colors flex justify-center items-center gap-2">
            Log Out 🛑
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col relative z-10">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5 dark:opacity-20 pointer-events-none transition-opacity"></div>

        <header className="bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-200 dark:border-zinc-800 px-10 py-5 flex justify-between items-center z-20 sticky top-0 shadow-sm transition-colors duration-300">
          <div>
            <h2 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tight uppercase italic">ATCI <span className="text-red-600">L&TT Hub</span></h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 font-bold tracking-widest uppercase mt-0.5">High Performance Question Management</p>
          </div>
          <div className="flex items-center gap-4">
             <button 
                onClick={toggleTheme} 
                className="w-11 h-11 flex items-center justify-center bg-zinc-100 dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-all border border-zinc-200 dark:border-zinc-800 shadow-inner"
                aria-label="Toggle Dark Mode"
              >
               <span className="text-xl">{isDarkMode ? '🌙' : '☀️'}</span>
             </button>

             <button 
               onClick={() => navigate('/add-question')} 
               className="group bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white px-6 py-3 font-black text-sm uppercase tracking-widest shadow-[0_4px_15px_rgba(220,38,38,0.4)] hover:shadow-[0_6px_20px_rgba(220,38,38,0.6)] transition-all duration-200 flex items-center gap-2 skew-x-[-5deg]"
             >
               <span className="skew-x-[5deg] flex items-center gap-2"><span className="text-lg leading-none">+</span> New Data</span>
             </button>
          </div>
        </header>
        
        <div className="flex-1 overflow-auto p-10 relative z-10">
          {children}
        </div>
      </main>
    </div>
  );
}