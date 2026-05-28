import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { masterSmeList } from './masterData';
import { quizService } from './api/quizService';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [selectedQ, setSelectedQ] = useState(null);
  const [selectedReviewer, setSelectedReviewer] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const data = await quizService.getAllQuestions();
      setQuestions(data);
      setIsLoading(false);
    };
    fetchData();
  }, []);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentQuestions = questions.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(questions.length / itemsPerPage);

  const handleOpenAssign = (q) => {
    setSelectedQ(q);
    setSelectedReviewer('');
    setIsPanelOpen(true);
  };

  const handleAssign = async () => {
    if (!selectedReviewer) return;
    await quizService.assignReviewer(selectedQ.id, selectedReviewer);
    setQuestions(questions.map(q => 
      q.id === selectedQ.id ? { ...q, status: "Under Review", reviewerId: selectedReviewer } : q
    ));
    setIsPanelOpen(false);
  };

  const eligibleReviewers = selectedQ 
    ? masterSmeList.filter(sme => sme.skills.includes(selectedQ.stack) && sme.id !== selectedQ.creatorId)
    : [];

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
        <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`}></span>{status}
      </span>
    );
  };

  if (isLoading) return (
    <div className="flex flex-col items-center justify-center h-64 space-y-4">
      <div className="w-12 h-12 border-4 border-zinc-200 dark:border-zinc-800 border-t-red-600 rounded-full animate-spin"></div>
      <p className="font-black text-zinc-500 uppercase tracking-[0.2em] text-xs">Loading Master Grid...</p>
    </div>
  );

  return (
    <div className="space-y-6 md:space-y-8 max-w-7xl mx-auto pb-10 px-4 md:px-0">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-2">
        <div>
          <h2 className="text-2xl md:text-3xl font-black text-zinc-900 dark:text-white tracking-tighter uppercase italic">Race Control <span className="text-red-600">Grid</span></h2>
          <p className="text-zinc-500 dark:text-zinc-400 font-bold uppercase tracking-widest text-[10px] md:text-xs mt-1">Global view and assignment controls.</p>
        </div>
        <div className="text-[10px] md:text-xs font-black uppercase tracking-widest text-zinc-500 dark:text-zinc-400 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 px-4 py-2 shadow-sm w-full md:w-auto text-center md:text-left">
          Total Logs: <span className="text-red-600 dark:text-red-500">{questions.length}</span>
        </div>
      </div>

      {/* --- DESKTOP VIEW --- */}
      <div className="hidden md:flex bg-white dark:bg-zinc-900 shadow-xl border border-zinc-200 dark:border-zinc-800 flex-col transition-all">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-50 dark:bg-zinc-950 border-b-2 border-zinc-200 dark:border-zinc-800 text-[10px] uppercase tracking-[0.15em] text-zinc-500 font-black">
                <th className="px-6 py-5">Stem</th>
                <th className="px-6 py-5">Driver</th>
                <th className="px-6 py-5">Stack</th>
                <th className="px-6 py-5">Status</th>
                <th className="px-6 py-5 text-right">Pit Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/50">
              {currentQuestions.map((q) => (
                <tr key={q.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                  <td className="px-6 py-5 text-sm font-bold text-zinc-900 dark:text-zinc-100 truncate max-w-[200px]">{q.stem}</td>
                  <td className="px-6 py-5 text-xs font-mono font-bold uppercase">{q.creatorId}</td>
                  <td className="px-6 py-5 text-xs font-black uppercase">{q.stack}</td>
                  <td className="px-6 py-5 whitespace-nowrap">
                    <div className="flex flex-col gap-1">
                      {getBadge(q.status)}
                      {q.reviewerId && <span className="text-[9px] uppercase font-black text-red-500">🏎️ {q.reviewerId}</span>}
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right space-x-3 whitespace-nowrap">
                    <button onClick={() => navigate(`/edit-question/${q.id}`)} className="text-[10px] px-3 py-2 border border-zinc-300 dark:border-zinc-600 font-black uppercase skew-x-[-5deg]">Edit</button>
                    {q.status === 'Ready for Review' && (
                      <button onClick={() => handleOpenAssign(q)} className="text-[10px] px-3 py-2 bg-red-600 text-white font-black uppercase skew-x-[-5deg]">Assign 📡</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- MOBILE VIEW --- */}
      <div className="md:hidden space-y-4">
        {currentQuestions.map(q => (
          <div key={q.id} className="bg-white dark:bg-zinc-900 p-5 border-t-4 border-t-red-600 border border-zinc-200 dark:border-zinc-800 shadow-sm relative">
            <div className="flex justify-between items-start mb-3">
              <div className="flex flex-col gap-1">
                 <span className="text-[9px] font-black text-zinc-400 uppercase">Driver</span>
                 <span className="font-mono text-xs font-bold bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 border border-zinc-200 dark:border-zinc-700">{q.creatorId}</span>
              </div>
              <div className="flex flex-col items-end gap-1">
                 {getBadge(q.status)}
                 {q.reviewerId && <span className="text-[9px] uppercase font-black text-red-500">🏎️ {q.reviewerId}</span>}
              </div>
            </div>
            
            <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 line-clamp-3 mb-4">{q.stem}</h3>
            
            <div className="flex flex-col gap-2 mb-4">
               <div className="flex justify-between text-[10px] font-black uppercase">
                 <span className="text-zinc-500">Chassis</span>
                 <span>{q.stack}</span>
               </div>
            </div>

            <div className="flex gap-2">
               <button onClick={() => navigate(`/edit-question/${q.id}`)} className="flex-1 text-[10px] py-3 border border-zinc-300 dark:border-zinc-700 font-black uppercase transition-colors skew-x-[-2deg]">Edit</button>
               {q.status === 'Ready for Review' && (
                  <button onClick={() => handleOpenAssign(q)} className="flex-1 text-[10px] py-3 bg-red-600 text-white font-black uppercase transition-colors skew-x-[-2deg]">Assign 📡</button>
               )}
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Container */}
      <div className="px-4 py-4 md:px-6 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 flex flex-col sm:flex-row items-center justify-between gap-4">
        <span className="text-[10px] md:text-xs text-zinc-500 dark:text-zinc-400 font-bold uppercase tracking-widest">
           Showing <span className="font-black text-zinc-900 dark:text-white">{indexOfFirstItem + 1}</span> - <span className="font-black text-zinc-900 dark:text-white">{Math.min(indexOfLastItem, questions.length)}</span> of <span className="font-black text-zinc-900 dark:text-white">{questions.length}</span>
        </span>
        <div className="flex gap-2 w-full sm:w-auto">
          <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} className="flex-1 sm:flex-none px-4 py-2 md:py-3 border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs disabled:opacity-50 font-black uppercase">◀ Prev</button>
          <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages || totalPages === 0} className="flex-1 sm:flex-none px-4 py-2 md:py-3 border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs disabled:opacity-50 font-black uppercase">Next ▶</button>
        </div>
      </div>

      {/* Modal - Ensured Mobile Compatibility */}
      {isPanelOpen && selectedQ && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-zinc-900 shadow-2xl max-w-md w-full border-t-4 border-t-red-600 border border-zinc-200 dark:border-zinc-800 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-5 py-4 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 flex justify-between items-center shrink-0">
              <h3 className="text-lg md:text-xl font-black uppercase italic tracking-tight text-zinc-900 dark:text-white">Assign Pit Crew</h3>
              <button onClick={() => setIsPanelOpen(false)} className="text-zinc-500 hover:text-red-600 font-black text-xl px-2">✕</button>
            </div>
            
            <div className="p-5 overflow-y-auto">
              <div className="bg-zinc-100 dark:bg-zinc-800 p-4 border border-zinc-200 dark:border-zinc-700 mb-6 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-zinc-500 dark:text-zinc-400 font-black uppercase tracking-widest text-[10px]">Driver</span>
                  <span className="font-mono font-bold text-zinc-800 dark:text-zinc-200 bg-white dark:bg-zinc-950 px-2 py-0.5 border border-zinc-200 dark:border-zinc-700 text-xs uppercase">{selectedQ.creatorId}</span>
                </div>
                <div className="flex justify-between items-center border-t border-zinc-200 dark:border-zinc-700 pt-3">
                  <span className="text-zinc-500 dark:text-zinc-400 font-black uppercase tracking-widest text-[10px]">Chassis</span>
                  <span className="font-black text-red-600 dark:text-red-500 uppercase tracking-wider text-xs truncate max-w-[150px]">{selectedQ.stack}</span>
                </div>
              </div>

              <label className="block text-[10px] font-black text-zinc-800 dark:text-zinc-200 uppercase tracking-widest mb-2">Select Engineer</label>
              <select value={selectedReviewer} onChange={(e) => setSelectedReviewer(e.target.value)} className="w-full border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 p-3.5 mb-6 font-mono text-sm font-bold text-zinc-800 dark:text-zinc-200 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all">
                <option value="" disabled>Select engineer...</option>
                {eligibleReviewers.map(sme => <option key={sme.id} value={sme.id}>{sme.id} ({sme.role})</option>)}
              </select>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <button onClick={() => setIsPanelOpen(false)} className="w-full sm:flex-1 px-5 py-3.5 md:py-3 border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-black uppercase tracking-widest transition-colors skew-x-[-5deg]"><span className="skew-x-[5deg]">Cancel</span></button>
                <button onClick={handleAssign} disabled={!selectedReviewer} className="w-full sm:flex-1 px-5 py-3.5 md:py-3 bg-red-600 hover:bg-red-700 text-white font-black uppercase tracking-widest disabled:opacity-50 transition-all active:scale-95 skew-x-[-5deg]"><span className="skew-x-[5deg]">Confirm 📡</span></button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}