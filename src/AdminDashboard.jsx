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
      <div className="w-12 h-12 border-4 border-zinc-200 dark:border-zinc-800 border-t-red-600 dark:border-t-red-500 rounded-full animate-spin"></div>
      <p className="font-black text-zinc-500 animate-pulse uppercase tracking-[0.2em] text-xs">Loading Master Grid...</p>
    </div>
  );

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-10">
      <div className="flex justify-between items-end mb-2">
        <div>
          <h2 className="text-3xl font-black text-zinc-900 dark:text-white tracking-tighter uppercase italic">Race Control <span className="text-red-600">Grid</span></h2>
          <p className="text-zinc-500 dark:text-zinc-400 font-bold uppercase tracking-widest text-xs mt-1">Global view and assignment controls across the paddock.</p>
        </div>
        <div className="text-xs font-black uppercase tracking-widest text-zinc-500 dark:text-zinc-400 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 px-4 py-2 shadow-sm">
          Total Logs: <span className="text-red-600 dark:text-red-500">{questions.length}</span>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 shadow-xl border border-zinc-200 dark:border-zinc-800 flex flex-col transition-all">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="bg-zinc-50 dark:bg-zinc-950 border-b-2 border-zinc-200 dark:border-zinc-800 text-[10px] uppercase tracking-[0.15em] text-zinc-500 dark:text-zinc-400 font-black">
                <th className="px-6 py-5">Question Stem</th>
                <th className="px-6 py-5">Driver (Creator)</th>
                <th className="px-6 py-5">Chassis (Stack)</th>
                <th className="px-6 py-5">Aero (Topic)</th>
                <th className="px-6 py-5">Difficulty</th>
                <th className="px-6 py-5">Telemetry Status</th>
                <th className="px-6 py-5 text-right">Pit Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/50">
              {currentQuestions.map((q) => (
                <tr key={q.id} className={`transition-all duration-200 ${selectedQ?.id === q.id && isPanelOpen ? 'bg-red-50/50 dark:bg-red-900/10' : 'hover:bg-zinc-50/60 dark:hover:bg-zinc-800/30'}`}>
                  <td className="px-6 py-5 text-sm font-bold text-zinc-900 dark:text-zinc-100 truncate max-w-[200px]">{q.stem}</td>
                  <td className="px-6 py-5 text-sm"><span className="font-mono font-bold text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 border border-zinc-300 dark:border-zinc-700 text-xs uppercase">{q.creatorId}</span></td>
                  <td className="px-6 py-5 text-sm">
                    <span className="px-3 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 text-xs font-black border border-zinc-200 dark:border-zinc-700 whitespace-nowrap uppercase tracking-wider">
                      {q.stack || 'N/A'}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-sm">
                    <span className="text-xs text-zinc-600 dark:text-zinc-400 font-bold uppercase tracking-wider line-clamp-2">
                      {q.topic || 'General'}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-sm">
                    <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 border ${
                        q.difficulty === 'Hard' ? 'text-red-600 bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800' : 
                        q.difficulty === 'Medium' ? 'text-orange-600 bg-orange-50 border-orange-200 dark:bg-orange-900/20 dark:border-orange-800' : 
                        'text-emerald-600 bg-emerald-50 border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-800'}`}>
                        {q.difficulty || 'Medium'}
                    </span>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap">
                    <div className="flex flex-col items-start gap-2">
                      {getBadge(q.status)}
                      {q.reviewerId && (q.status === 'Under Review' || q.status === 'Approved' || q.status === 'Rejected') && (
                        <span className="text-[9px] text-zinc-500 dark:text-zinc-400 font-black uppercase tracking-widest flex items-center gap-1.5 bg-zinc-50 dark:bg-zinc-800 px-2 py-1 border border-zinc-200 dark:border-zinc-700">
                          <span className="text-red-500">🏎️</span> {q.reviewerId}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right space-x-3 whitespace-nowrap">
                    <button onClick={() => navigate(`/edit-question/${q.id}`)} className="text-xs px-4 py-2 border border-zinc-300 dark:border-zinc-600 text-zinc-800 dark:text-zinc-200 bg-white dark:bg-zinc-800 hover:border-red-500 hover:text-red-600 dark:hover:text-red-400 font-black uppercase tracking-widest transition-all active:scale-95 skew-x-[-5deg]"><span className="skew-x-[5deg]">Edit</span></button>
                    {q.status === 'Ready for Review' && (
                      <button onClick={() => handleOpenAssign(q)} className="text-xs px-4 py-2 bg-gradient-to-r from-red-600 to-red-800 text-white font-black uppercase tracking-widest hover:shadow-[0_4px_15px_rgba(220,38,38,0.4)] transition-all active:scale-95 skew-x-[-5deg]"><span className="skew-x-[5deg]">Assign 📡</span></button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 flex items-center justify-between">
          <span className="text-xs text-zinc-500 dark:text-zinc-400 font-bold uppercase tracking-widest">Showing <span className="font-black text-zinc-900 dark:text-white">{indexOfFirstItem + 1}</span> - <span className="font-black text-zinc-900 dark:text-white">{Math.min(indexOfLastItem, questions.length)}</span></span>
          <div className="flex gap-2">
            <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} className="px-4 py-2 border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs disabled:opacity-50 font-black uppercase tracking-widest hover:border-red-500 hover:text-red-600 dark:hover:text-red-500 transition-all active:scale-95 text-zinc-700 dark:text-zinc-300">◀ Prev</button>
            <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages || totalPages === 0} className="px-4 py-2 border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs disabled:opacity-50 font-black uppercase tracking-widest hover:border-red-500 hover:text-red-600 dark:hover:text-red-500 transition-all active:scale-95 text-zinc-700 dark:text-zinc-300">Next ▶</button>
          </div>
        </div>
      </div>

      {isPanelOpen && selectedQ && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-zinc-900 shadow-2xl max-w-md w-full border-t-4 border-t-red-600 border border-zinc-200 dark:border-zinc-800">
            <div className="px-6 py-5 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 flex justify-between items-center">
              <h3 className="text-xl font-black uppercase italic tracking-tight text-zinc-900 dark:text-white">Assign Pit Crew</h3>
              <button onClick={() => setIsPanelOpen(false)} className="text-zinc-500 hover:text-red-600 font-black text-lg">✕</button>
            </div>
            
            <div className="p-6">
              <div className="bg-zinc-100 dark:bg-zinc-800 p-4 border border-zinc-200 dark:border-zinc-700 mb-6 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-zinc-500 dark:text-zinc-400 font-black uppercase tracking-widest text-[10px]">Driver</span>
                  <span className="font-mono font-bold text-zinc-800 dark:text-zinc-200 bg-white dark:bg-zinc-950 px-2 py-0.5 border border-zinc-200 dark:border-zinc-700 text-xs uppercase">{selectedQ.creatorId}</span>
                </div>
                <div className="flex justify-between items-center border-t border-zinc-200 dark:border-zinc-700 pt-3">
                  <span className="text-zinc-500 dark:text-zinc-400 font-black uppercase tracking-widest text-[10px]">Chassis</span>
                  <span className="font-black text-red-600 dark:text-red-500 uppercase tracking-wider text-xs">{selectedQ.stack}</span>
                </div>
              </div>

              <label className="block text-xs font-black text-zinc-800 dark:text-zinc-200 uppercase tracking-widest mb-2">Select Engineer</label>
              <select value={selectedReviewer} onChange={(e) => setSelectedReviewer(e.target.value)} className="w-full border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 p-3.5 mb-4 font-mono text-sm font-bold text-zinc-800 dark:text-zinc-200 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all cursor-pointer">
                <option value="" disabled>Select engineer...</option>
                {eligibleReviewers.map(sme => <option key={sme.id} value={sme.id}>{sme.id} ({sme.role})</option>)}
              </select>
              
              <p className="text-[10px] text-zinc-500 dark:text-zinc-400 font-bold uppercase tracking-widest mb-8 leading-relaxed bg-zinc-50 dark:bg-zinc-950 p-3 border border-zinc-200 dark:border-zinc-800">
                <span className="text-red-500 mr-1">⚡</span> Showing engineers tuned for <span className="text-zinc-800 dark:text-zinc-200">{selectedQ.stack}</span>. Driver excluded.
              </p>

              <div className="flex gap-3">
                <button onClick={() => setIsPanelOpen(false)} className="flex-1 px-5 py-3 border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-black uppercase tracking-widest transition-colors skew-x-[-5deg]"><span className="skew-x-[5deg]">Cancel</span></button>
                <button onClick={handleAssign} disabled={!selectedReviewer} className="flex-1 px-5 py-3 bg-red-600 hover:bg-red-700 text-white font-black uppercase tracking-widest disabled:opacity-50 transition-all active:scale-95 skew-x-[-5deg]"><span className="skew-x-[5deg]">Confirm 📡</span></button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}