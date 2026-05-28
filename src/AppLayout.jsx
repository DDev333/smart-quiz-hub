import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

export default function AppLayout({ children }) {
  const navigate = useNavigate();
  const CURRENT_ROLE = localStorage.getItem('currentUserRole') || 'SME';
  const currentUser = localStorage.getItem('currentUser') || 'Unknown User';

  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
      
      {/* Mobile Overlay Background */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Pit Wall Sidebar (Responsive) */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-zinc-950 text-white flex flex-col shadow-2xl border-r border-zinc-800 transition-transform duration-300 transform md:relative md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-30 pointer-events-none"></div>
        
        {/* Mobile Close Button */}
        <button onClick={() => setIsSidebarOpen(false)} className="md:hidden absolute top-6 right-6 text-zinc-400 hover:text-white z-20">
          ✕
        </button>

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
          <NavLink to="/my-questions" onClick={() => setIsSidebarOpen(false)} className={({ isActive }) => `block px-5 py-3.5 text-sm font-bold uppercase tracking-wider transition-all duration-200 skew-x-[-5deg] ${isActive ? 'bg-red-600/10 border-l-4 border-red-600 text-white translate-x-2' : 'text-zinc-400 hover:bg-zinc-900 hover:text-white'}`}>
            <span className="inline-block skew-x-[5deg]"><span className="mr-3">📋</span> My Telemetry</span>
          </NavLink>
          <NavLink to="/pending-reviews" onClick={() => setIsSidebarOpen(false)} className={({ isActive }) => `block px-5 py-3.5 text-sm font-bold uppercase tracking-wider transition-all duration-200 skew-x-[-5deg] ${isActive ? 'bg-red-600/10 border-l-4 border-red-600 text-white translate-x-2' : 'text-zinc-400 hover:bg-zinc-900 hover:text-white'}`}>
            <span className="inline-block skew-x-[5deg]"><span className="mr-3">⏱️</span> Pending Reviews</span>
          </NavLink>
          
          {CURRENT_ROLE === 'ADMIN' && (
            <NavLink to="/admin" onClick={() => setIsSidebarOpen(false)} className={({ isActive }) => `block px-5 py-3.5 text-sm font-bold uppercase tracking-wider transition-all duration-200 skew-x-[-5deg] ${isActive ? 'bg-red-600/10 border-l-4 border-red-600 text-white translate-x-2' : 'text-zinc-400 hover:bg-zinc-900 hover:text-white'}`}>
              <span className="inline-block skew-x-[5deg]"><span className="mr-3">🏁</span> Master Grid</span>
            </NavLink>
          )}
        </nav>
        
        <div className="p-6 border-t border-zinc-800 bg-zinc-950/80 backdrop-blur-md relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-zinc-800 border-2 border-red-600 flex items-center justify-center text-red-500 font-black uppercase shrink-0">
              {currentUser.charAt(0)}
            </div>
            <div className="overflow-hidden">
              <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Driver</p>
              <p className="text-sm text-white font-bold truncate">{currentUser}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="w-full py-2.5 bg-zinc-900 hover:bg-red-600 text-zinc-400 hover:text-white text-xs font-black uppercase tracking-widest border border-zinc-800 transition-colors flex justify-center items-center gap-2">
            Log Out 🛑
          </button>
        </div>
      </aside>

      {/* Main Canvas */}
      <main className="flex-1 flex flex-col relative z-10 min-w-0">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5 dark:opacity-20 pointer-events-none transition-opacity"></div>

        {/* Responsive Header */}
        <header className="bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-200 dark:border-zinc-800 px-4 md:px-10 py-4 md:py-5 flex justify-between items-center z-20 sticky top-0 shadow-sm transition-colors duration-300">
          <div className="flex items-center gap-3">
            {/* Mobile Hamburger Button */}
            <button 
              onClick={() => setIsSidebarOpen(true)} 
              className="md:hidden w-10 h-10 flex items-center justify-center bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-white border border-zinc-200 dark:border-zinc-800 shrink-0"
            >
              ☰
            </button>
            <div>
              <h2 className="text-lg md:text-2xl font-black text-zinc-900 dark:text-white tracking-tight uppercase italic line-clamp-1">ATCI <span className="text-red-600">L&TT Hub</span></h2>
              <p className="hidden md:block text-xs text-zinc-500 dark:text-zinc-400 font-bold tracking-widest uppercase mt-0.5">High Performance Question Management</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 md:gap-4 shrink-0">
             <button 
                onClick={toggleTheme} 
                className="w-10 h-10 md:w-11 md:h-11 flex items-center justify-center bg-zinc-100 dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-all border border-zinc-200 dark:border-zinc-800 shadow-inner shrink-0"
                aria-label="Toggle Dark Mode"
              >
               <span className="text-lg md:text-xl">{isDarkMode ? '🌙' : '☀️'}</span>
             </button>

             <button 
               onClick={() => navigate('/add-question')} 
               className="group bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white px-3 md:px-6 py-2.5 md:py-3 font-black text-xs md:text-sm uppercase tracking-widest shadow-[0_4px_15px_rgba(220,38,38,0.4)] transition-all flex items-center gap-2 skew-x-[-5deg]"
             >
               <span className="skew-x-[5deg] flex items-center gap-2">
                 <span className="text-lg leading-none">+</span> 
                 <span className="hidden md:inline">New Data</span>
               </span>
             </button>
          </div>
        </header>
        
        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-auto p-4 md:p-10 relative z-10">
          {children}
        </div>
      </main>
    </div>
  );
}