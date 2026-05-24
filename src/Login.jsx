import React from 'react';

export default function Login() {
  const handleLogin = (role, enterpriseId) => {
    localStorage.setItem('currentUserRole', role);
    localStorage.setItem('currentUser', enterpriseId);
    window.location.href = role === 'ADMIN' ? '/admin' : '/my-questions';
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-2">Smart Quiz AI Hub</h1>
        <p className="text-sm text-gray-500 font-medium uppercase tracking-wide">ATCI Learning & Talent Transformation</p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl sm:rounded-lg sm:px-10 border border-gray-100">
          <h2 className="text-center text-lg font-bold text-gray-700 mb-6">Select Demo Persona</h2>
          <div className="space-y-4">
            <button onClick={() => handleLogin('SME', 'ansh.patel')} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors">
              Login as SME
            </button>
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-300" /></div>
              <div className="relative flex justify-center text-sm"><span className="px-2 bg-white text-gray-500 font-medium">Elevated Access</span></div>
            </div>
            <button onClick={() => handleLogin('ADMIN', 'devesh.ghodpage')} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-bold text-white bg-[#A855F7] hover:bg-purple-600 transition-colors">
              Login as Admin
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}