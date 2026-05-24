import React from 'react';

export default function Login() {
  const handleLogin = (role, enterpriseId) => {
    localStorage.setItem('currentUserRole', role);
    localStorage.setItem('currentUser', enterpriseId);
    window.location.href = role === 'ADMIN' ? '/admin' : '/my-questions';
  };

  return (
    <div className="min-h-screen relative flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans overflow-hidden bg-zinc-950">
      {/* Carbon Fiber Background */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-40"></div>
      
      {/* Racing Red Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-red-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-orange-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-30 animate-pulse delay-1000"></div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center relative z-10">
        <div className="inline-flex mb-4 p-4 rounded-full bg-zinc-900/80 backdrop-blur-md border-2 border-red-600/50 shadow-[0_0_30px_rgba(220,38,38,0.3)]">
          <span className="text-4xl">🏎️</span>
        </div>
        <h1 className="text-4xl font-black text-white tracking-tighter mb-2 drop-shadow-md uppercase italic">
          Smart Quiz <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">Hub</span>
        </h1>
        <p className="text-sm text-zinc-400 font-bold uppercase tracking-[0.3em] mb-8">
          L&TT Telemetry System
        </p>
      </div>

      <div className="mt-4 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-zinc-900/60 backdrop-blur-xl py-10 px-4 shadow-2xl sm:rounded-2xl sm:px-10 border border-zinc-800">
          <h2 className="text-center text-lg font-bold text-white mb-8 uppercase tracking-widest">Select Driver Profile</h2>
          
          <div className="space-y-5">
            <button 
              onClick={() => handleLogin('SME', 'ansh.patel')} 
              className="w-full flex justify-center items-center gap-2 py-3.5 px-4 border border-zinc-700 rounded-lg shadow-inner text-sm font-bold text-zinc-300 bg-zinc-800 hover:bg-zinc-700 hover:border-zinc-500 hover:-translate-y-0.5 transition-all duration-300 uppercase tracking-wider"
            >
              <span>🛠️</span> SME / Engineer
            </button>
            
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-zinc-800" /></div>
              <div className="relative flex justify-center text-xs uppercase tracking-widest">
                <span className="px-3 bg-transparent text-zinc-500 font-bold">Pit Wall Access</span>
              </div>
            </div>
            
            <button 
              onClick={() => handleLogin('ADMIN', 'devesh.ghodpage')} 
              className="group w-full flex justify-center items-center py-3.5 px-4 border border-transparent rounded-lg text-sm font-black text-white bg-gradient-to-r from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 hover:-translate-y-0.5 hover:shadow-[0_0_20px_rgba(220,38,38,0.5)] transition-all duration-300 uppercase tracking-widest skew-x-[-2deg]"
            >
              Race Director (Admin)
              <span className="ml-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all">🏁</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}