import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { masterSmeList } from './masterData';
import { quizService } from './api/quizService';
import ThemeToggle from './ThemeToggle';

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
    setTimeout(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }, 100);
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
    const s = { 
      'Draft': 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600', 
      'Ready for Review': 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800', 
      'Under Review': 'bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800', 
      'Approved': 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800', 
      'Rejected': 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800' 
    }[status] || 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600';
    return <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${s}`}>{status}</span>;
  };

  if (isLoading) return <div className="text-center p-10 font-bold text-gray-500 dark:text-gray-400">Loading Master Question Bank...</div>;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col transition-colors duration-200">
      <ThemeToggle />
      
      <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 flex justify-between items-center transition-colors">
        <div>
          <h2 className="text-lg font-bold text-gray-800 dark:text-white">Master Question Bank</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Global view of all questions across the enterprise.</p>
        </div>
        <div className="text-sm font-bold text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-3 py-1 rounded-md shadow-sm">
          Total Records: {questions.length}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 transition-colors">
              <th className="px-6 py-4 font-semibold">Question Stem</th>
              <th className="px-6 py-4 font-semibold">Creator</th>
              <th className="px-6 py-4 font-semibold">Stack</th>
              <th className="px-6 py-4 font-semibold">Status</th>
              <th className="px-6 py-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {currentQuestions.map((q) => (
              <tr key={q.id} className={`transition-colors ${selectedQ?.id === q.id && isPanelOpen ? 'bg-purple-50 dark:bg-purple-900/20' : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'}`}>
                <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-gray-100 truncate max-w-[250px]">{q.stem}</td>
                <td className="px-6 py-4 text-sm"><span className="font-mono font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-2 py-1 rounded border border-indigo-100 dark:border-indigo-800">{q.creatorId}</span></td>
                <td className="px-6 py-4 text-sm"><span className="px-2 py-1 bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded text-xs border border-purple-100 dark:border-purple-800">{q.stack}</span></td>
                <td className="px-6 py-4 whitespace-nowrap">{getBadge(q.status)}</td>
                <td className="px-6 py-4 text-right space-x-2 whitespace-nowrap">
                  <button onClick={() => navigate(`/edit-question/${q.id}`)} className="text-sm px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 font-medium transition-colors">Edit</button>
                  {q.status === 'Ready for Review' && (
                    <button onClick={() => handleOpenAssign(q)} className="text-sm px-3 py-1.5 bg-[#A855F7] text-white rounded-md font-bold hover:bg-purple-600 transition-colors shadow-sm">Assign</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between transition-colors">
        <span className="text-sm text-gray-500 dark:text-gray-400">
          Showing <span className="font-medium text-gray-900 dark:text-gray-200">{indexOfFirstItem + 1}</span> to <span className="font-medium text-gray-900 dark:text-gray-200">{Math.min(indexOfLastItem, questions.length)}</span> of <span className="font-medium text-gray-900 dark:text-gray-200">{questions.length}</span> results
        </span>
        <div className="flex gap-2">
          <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm disabled:opacity-50 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm">Previous</button>
          <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages || totalPages === 0} className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm disabled:opacity-50 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm">Next</button>
        </div>
      </div>

      {isPanelOpen && selectedQ && (
        <div className="border-t-2 border-purple-300 dark:border-purple-600 bg-purple-50/50 dark:bg-gray-800 p-6 animate-fade-in-up transition-colors">
          <div className="max-w-2xl mx-auto bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex justify-between items-center mb-4 border-b border-gray-100 dark:border-gray-800 pb-3">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white">Assign Reviewer</h3>
              <button onClick={() => setIsPanelOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 font-bold text-lg leading-none">✕</button>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md border border-gray-200 dark:border-gray-700 mb-6 space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wide text-xs">Creator SME</span>
                <span className="font-mono font-bold text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-700 px-2 py-0.5 rounded border border-gray-200 dark:border-gray-600">{selectedQ.creatorId}</span>
              </div>
              <div className="flex justify-between items-center text-sm border-t border-gray-200 dark:border-gray-700 pt-3">
                <span className="text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wide text-xs">Tech Stack</span>
                <span className="font-bold text-purple-700 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/30 px-2 py-0.5 rounded border border-purple-100 dark:border-purple-800">{selectedQ.stack}</span>
              </div>
              <div className="flex justify-between items-center text-sm border-t border-gray-200 dark:border-gray-700 pt-3">
                <span className="text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wide text-xs">Topic</span>
                <span className="font-bold text-gray-700 dark:text-gray-200">{selectedQ.topic}</span>
              </div>
            </div>

            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Select Eligible Reviewer</label>
            <select 
              value={selectedReviewer} 
              onChange={(e) => setSelectedReviewer(e.target.value)} 
              className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-md p-3 mb-4 font-mono text-sm outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
            >
              <option value="" disabled>Select a mapped reviewer...</option>
              {eligibleReviewers.map(sme => (
                <option key={sme.id} value={sme.id}>{sme.id} ({sme.role})</option>
              ))}
            </select>
            
            <p className="text-[11px] text-gray-500 dark:text-gray-400 mb-6 leading-tight">
              * Showing SMEs mapped to the <span className="font-bold">{selectedQ.stack}</span> skill set. The creator (<span className="font-mono">{selectedQ.creatorId}</span>) has been automatically excluded to prevent self-review.
            </p>

            <div className="flex justify-end gap-3">
              <button onClick={() => setIsPanelOpen(false)} className="px-5 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-medium">Cancel</button>
              <button onClick={handleAssign} disabled={!selectedReviewer} className="px-5 py-2.5 bg-[#A855F7] text-white rounded-md font-bold disabled:opacity-50 hover:bg-purple-600 transition-colors shadow-sm">Confirm Assignment</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}