import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { quizService } from './api/quizService';

export default function MyQuestions() {
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  
  // Pagination & Filter State
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('All'); 
  const itemsPerPage = 5;

  // Filter Categories
  const filterOptions = ['All', 'Draft', 'Ready for Review', 'Under Review', 'Approved', 'Rejected'];

  // Fetch real data from the central database on load
  useEffect(() => {
    const fetchData = async () => {
      const data = await quizService.getMyQuestions();
      setQuestions(data);
      setIsLoading(false);
    };
    fetchData();
  }, []);

  const getBadge = (status) => {
    const s = { 
      'Draft': 'bg-gray-100 text-gray-700 border-gray-200', 
      'Ready for Review': 'bg-blue-50 text-blue-700 border-blue-200', 
      'Under Review': 'bg-amber-50 text-amber-700 border-amber-200', 
      'Approved': 'bg-emerald-50 text-emerald-700 border-emerald-200', 
      'Rejected': 'bg-red-50 text-red-700 border-red-200' 
    }[status] || 'bg-gray-100 text-gray-700';
    return <span className={`px-2.5 py-1 text-xs font-bold rounded-full border ${s}`}>{status}</span>;
  };

  const handleFilterChange = (filter) => {
    setStatusFilter(filter);
    setCurrentPage(1); 
  };

  const filteredQuestions = statusFilter === 'All' 
    ? questions 
    : questions.filter(q => q.status === statusFilter);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentQuestions = filteredQuestions.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredQuestions.length / itemsPerPage);

  if (isLoading) return <div className="text-center p-10 font-bold text-gray-500">Loading your questions...</div>;

  return (
    <div className="space-y-4">
      
      {/* Status Filter Tabs */}
      <div className="flex flex-wrap gap-2 mb-2">
        {filterOptions.map(option => (
          <button
            key={option}
            onClick={() => handleFilterChange(option)}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors shadow-sm ${
              statusFilter === option 
                ? 'bg-[#A855F7] text-white border-transparent' 
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {option} 
            <span className={`ml-2 px-1.5 py-0.5 rounded-full text-xs ${statusFilter === option ? 'bg-purple-800 text-purple-100' : 'bg-gray-100 text-gray-500'}`}>
              {option === 'All' ? questions.length : questions.filter(q => q.status === option).length}
            </span>
          </button>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase tracking-wider text-gray-500">
                <th className="px-6 py-4 font-semibold">Question Stem</th>
                <th className="px-6 py-4 font-semibold">Stack</th>
                <th className="px-6 py-4 font-semibold">Topic</th>
                <th className="px-6 py-4 font-semibold">Difficulty</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {currentQuestions.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-500 font-medium">
                    <div className="text-3xl mb-2">📝</div>
                    No questions found for status "{statusFilter}".
                  </td>
                </tr>
              ) : (
                currentQuestions.map((q) => (
                  <tr key={q.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 truncate max-w-[250px]">{q.stem || q.questionStem}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className="px-2 py-1 bg-purple-50 text-purple-700 rounded text-xs border border-purple-100 font-medium">
                        {q.stack || q.technologyStack}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 font-medium">{q.topic || 'General'}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{q.difficulty || 'Medium'}</td>
                    
                    {/* STATUS COLUMN WITH ASSIGNMENT CONTEXT */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col items-start gap-1">
                        {getBadge(q.status)}
                        {/* Only show the reviewer ID if someone is actively assigned to it */}
                        {q.reviewerId && (q.status === 'Under Review' || q.status === 'Approved' || q.status === 'Rejected') && (
                          <span className="text-[10px] text-gray-400 font-mono tracking-tight ml-1">
                            by {q.reviewerId}
                          </span>
                        )}
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 text-right">
                      {/* Only Drafts and Rejected questions can be edited by the SME */}
                      {(q.status === 'Draft' || q.status === 'Rejected') && (
                        <button 
                          onClick={() => navigate(`/edit-question/${q.id}`)} 
                          className="text-sm px-4 py-1.5 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 font-medium transition-colors shadow-sm"
                        >
                          Edit
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
          <span className="text-sm text-gray-500">
            {filteredQuestions.length > 0 ? (
              <>
                Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to <span className="font-medium">{Math.min(indexOfLastItem, filteredQuestions.length)}</span> of <span className="font-medium">{filteredQuestions.length}</span>
              </>
            ) : (
              'Showing 0 results'
            )}
          </span>
          <div className="flex gap-2">
            <button 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
              disabled={currentPage === 1} 
              className="px-3 py-1.5 border border-gray-300 rounded bg-white text-sm disabled:opacity-50 font-medium hover:bg-gray-50 transition-colors shadow-sm"
            >
              Previous
            </button>
            <button 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} 
              disabled={currentPage === totalPages || totalPages === 0} 
              className="px-3 py-1.5 border border-gray-300 rounded bg-white text-sm disabled:opacity-50 font-medium hover:bg-gray-50 transition-colors shadow-sm"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}