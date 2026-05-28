import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { quizService } from './api/quizService';

export default function MyQuestions() {
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('All'); 
  const itemsPerPage = 5;

  const filterOptions = ['All', 'Draft', 'Ready for Review', 'Under Review', 'Approved', 'Rejected'];

  useEffect(() => {
    const fetchData = async () => {
      const data = await quizService.getMyQuestions();
      setQuestions(data);
      setIsLoading(false);
    };
    fetchData();
  }, []);

  const getBadge = (status) => {
    const styles = { 
      'Draft': 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 border-zinc-300 dark:border-zinc-600', 
      'Ready for Review': 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800', 
      'Under Review': 'bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-800', 
      'Approved': 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800', 
      'Rejected': 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800' 
    }[status] || 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300';
    
    const dotColor = { 'Draft': 'bg-zinc-400', 'Ready for Review': 'bg-blue-500', 'Under Review': 'bg-orange-500 animate-pulse', 'Approved': 'bg-emerald-500', 'Rejected': 'bg-red-600' }[status] || 'bg-zinc-400';

    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-black uppercase tracking-widest border transition-colors ${styles}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`}></span> {status}
      </span>
    );
  };

  const handleFilterChange = (filter) => {
    setStatusFilter(filter);
    setCurrentPage(1); 
  };

  const filteredQuestions = statusFilter === 'All' ? questions : questions.filter(q => q.status === statusFilter);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentQuestions = filteredQuestions.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredQuestions.length / itemsPerPage);

  if (isLoading) return (
    <div className="flex flex-col items-center justify-center h-64 space-y-4">
      <div className="w-12 h-12 border-4 border-zinc-200 dark:border-zinc-800 border-t-red-600 dark:border-t-red-500 rounded-full animate-spin"></div>
      <p className="font-black text-zinc-500 animate-pulse uppercase tracking-[0.2em] text-xs">Warming up tires... Fetching Data</p>
    </div>
  );

  return (
    <div className="space-y-6 md:space-y-8 max-w-7xl mx-auto pb-10">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-2">
        <div>
          <h2 className="text-2xl md:text-3xl font-black text-zinc-900 dark:text-white tracking-tighter uppercase italic">My Telemetry <span className="text-red-600">Logs</span></h2>
          <p className="text-zinc-500 dark:text-zinc-400 font-bold uppercase tracking-widest text-[10px] md:text-xs mt-1">Track and tune your technical questions.</p>
        </div>
        
        {/* Stat Cards stack correctly on mobile now */}
        <div className="grid grid-cols-2 gap-3 md:flex md:gap-4 w-full md:w-auto">
          <div className="bg-white dark:bg-zinc-900 px-4 py-3 md:px-6 border border-zinc-200 dark:border-zinc-800 flex items-center gap-3 hover:border-emerald-500 transition-all">
            <div className="text-xl md:text-2xl">🏆</div>
            <div>
              <p className="text-[9px] md:text-[10px] text-zinc-400 font-black uppercase tracking-widest mb-0.5">Approved</p>
              <p className="text-lg md:text-xl font-black text-zinc-900 dark:text-white leading-none">{questions.filter(q => q.status === 'Approved').length}</p>
            </div>
          </div>
          <div className="bg-white dark:bg-zinc-900 px-4 py-3 md:px-6 border border-zinc-200 dark:border-zinc-800 flex items-center gap-3 hover:border-orange-500 transition-all">
            <div className="text-xl md:text-2xl">⏱️</div>
            <div>
              <p className="text-[9px] md:text-[10px] text-zinc-400 font-black uppercase tracking-widest mb-0.5">Pending</p>
              <p className="text-lg md:text-xl font-black text-zinc-900 dark:text-white leading-none">{questions.filter(q => q.status === 'Under Review' || q.status === 'Ready for Review').length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-zinc-100 dark:bg-zinc-900 p-1 border border-zinc-200 dark:border-zinc-800 inline-flex flex-wrap gap-1 w-full sm:w-auto">
        {filterOptions.map(option => {
          const count = option === 'All' ? questions.length : questions.filter(q => q.status === option).length;
          const isActive = statusFilter === option;
          return (
            <button
              key={option}
              onClick={() => handleFilterChange(option)}
              className={`flex-1 sm:flex-none px-3 md:px-6 py-2.5 text-[10px] md:text-xs font-black uppercase tracking-widest transition-all duration-200 flex items-center justify-center gap-2 ${
                isActive 
                  ? 'bg-red-600 text-white shadow-md' 
                  : 'bg-transparent text-zinc-500 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-white'
              }`}
            >
              {option} 
              <span className={`px-2 py-0.5 text-[10px] hidden md:inline-block ${isActive ? 'bg-black/20 text-white' : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400'}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* --- DESKTOP VIEW (Table) --- */}
      <div className="hidden md:flex bg-white dark:bg-zinc-900 shadow-xl border border-zinc-200 dark:border-zinc-800 flex-col transition-all">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-50 dark:bg-zinc-950 border-b-2 border-zinc-200 dark:border-zinc-800 text-[10px] uppercase tracking-[0.15em] text-zinc-500 dark:text-zinc-400 font-black">
                <th className="px-6 py-5">Specs / Details</th>
                <th className="px-6 py-5">Chassis (Stack)</th>
                <th className="px-6 py-5">Aero (Topic)</th>
                <th className="px-6 py-5">Difficulty</th>
                <th className="px-6 py-5">Telemetry Status</th>
                <th className="px-6 py-5 text-right">Pit Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/50">
              {currentQuestions.map((q) => (
                <tr key={q.id} className="hover:bg-zinc-50/80 dark:hover:bg-zinc-800/50 transition-colors duration-200 group">
                  <td className="px-6 py-5 max-w-xs">
                    <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100 line-clamp-2 pr-4">{q.stem}</p>
                    <p className="text-[10px] text-zinc-500 font-mono mt-2 bg-zinc-100 dark:bg-zinc-800 inline-block px-2 py-0.5 border border-zinc-200 dark:border-zinc-700 font-bold uppercase tracking-widest">ID: {q.id}</p>
                  </td>
                  <td className="px-6 py-5">
                    <span className="px-3 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 text-xs font-black border border-zinc-200 dark:border-zinc-700 uppercase tracking-wider">{q.stack}</span>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-xs text-zinc-600 dark:text-zinc-400 font-bold uppercase tracking-wider line-clamp-2">{q.topic}</span>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 border ${q.difficulty === 'Hard' ? 'text-red-600 border-red-200' : q.difficulty === 'Medium' ? 'text-orange-600 border-orange-200' : 'text-emerald-600 border-emerald-200'}`}>
                      {q.difficulty}
                    </span>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap">{getBadge(q.status)}</td>
                  <td className="px-6 py-5 text-right">
                    {(q.status === 'Draft' || q.status === 'Rejected') ? (
                      <button onClick={() => navigate(`/edit-question/${q.id}`)} className="text-xs px-5 py-2.5 border border-zinc-300 dark:border-zinc-600 text-zinc-800 dark:text-zinc-200 bg-white dark:bg-zinc-800 hover:border-red-500 hover:text-red-600 dark:hover:text-red-400 font-black uppercase tracking-widest skew-x-[-5deg]"><span className="skew-x-[5deg]">Tune 🛠️</span></button>
                    ) : (
                      <span className="text-[10px] uppercase font-black text-zinc-400">Locked 🔒</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- MOBILE VIEW (Cards) --- */}
      <div className="md:hidden flex flex-col space-y-4">
        {currentQuestions.map(q => (
          <div key={q.id} className="bg-white dark:bg-zinc-900 p-5 border-t-4 border-t-zinc-300 dark:border-t-zinc-700 border border-zinc-200 dark:border-zinc-800 shadow-sm relative overflow-hidden">
            <div className="flex justify-between items-center mb-3">
              <span className="text-[10px] font-mono font-black text-zinc-500 uppercase tracking-widest">#{q.id}</span>
              {getBadge(q.status)}
            </div>
            
            <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 line-clamp-3 mb-4">{q.stem}</h3>
            
            <div className="bg-zinc-50 dark:bg-zinc-950 p-3 border border-zinc-200 dark:border-zinc-800 mb-4 space-y-2">
               <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                 <span className="text-zinc-500">Chassis</span>
                 <span className="text-zinc-900 dark:text-zinc-100 truncate ml-2 text-right">{q.stack}</span>
               </div>
               <div className="flex justify-between text-[10px] font-black uppercase tracking-widest pt-2 border-t border-zinc-200 dark:border-zinc-800">
                 <span className="text-zinc-500">Level</span>
                 <span className={q.difficulty === 'Hard' ? 'text-red-500' : 'text-orange-500'}>{q.difficulty}</span>
               </div>
            </div>

            {(q.status === 'Draft' || q.status === 'Rejected') && (
              <button onClick={() => navigate(`/edit-question/${q.id}`)} className="w-full text-xs py-3 border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-black uppercase tracking-widest hover:border-red-500 hover:text-red-500 transition-colors skew-x-[-2deg]">
                <span className="skew-x-[2deg]">Tune 🛠️</span>
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Pagination (Works for both Mobile & Desktop) */}
      <div className="px-4 py-4 md:px-6 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 flex flex-col sm:flex-row items-center justify-between gap-4">
        <span className="text-[10px] md:text-xs text-zinc-500 dark:text-zinc-400 font-bold uppercase tracking-widest">
          {filteredQuestions.length > 0 ? (
            <>Showing <span className="font-black text-zinc-900 dark:text-white">{indexOfFirstItem + 1}</span> - <span className="font-black text-zinc-900 dark:text-white">{Math.min(indexOfLastItem, filteredQuestions.length)}</span> of <span className="font-black text-zinc-900 dark:text-white">{filteredQuestions.length}</span> Logs</>
          ) : '0 Logs'}
        </span>
        <div className="flex gap-2 w-full sm:w-auto">
          <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} className="flex-1 sm:flex-none px-4 py-2 md:py-3 border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs disabled:opacity-50 font-black uppercase tracking-widest hover:border-red-500 hover:text-red-600 transition-all text-zinc-700 dark:text-zinc-300">
            ◀ Prev
          </button>
          <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages || totalPages === 0} className="flex-1 sm:flex-none px-4 py-2 md:py-3 border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs disabled:opacity-50 font-black uppercase tracking-widest hover:border-red-500 hover:text-red-600 transition-all text-zinc-700 dark:text-zinc-300">
            Next ▶
          </button>
        </div>
      </div>
    </div>
  );
}