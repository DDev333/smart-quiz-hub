import React, { useState, useEffect } from 'react';
import { quizService } from './api/quizService';

export default function MyPendingReviews() {
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [activeUser, setActiveUser] = useState('');
  
  const [feedbacks, setFeedbacks] = useState({});
  const [errors, setErrors] = useState({});
  
  // Fetch real data from the database on load
  useEffect(() => {
    const fetchData = async () => {
      const currentUser = localStorage.getItem('currentUser') || 'Unknown User';
      setActiveUser(currentUser);
      
      const myAssignedReviews = await quizService.getMyPendingReviews();
      setReviews(myAssignedReviews);
      setIsLoading(false);
    };
    fetchData();
  }, []);

  const handleFeedbackChange = (id, text) => {
    setFeedbacks({ ...feedbacks, [id]: text });
    if (text.trim() !== '') {
      setErrors({ ...errors, [id]: false });
    }
  };

  // Database-connected Approve
  const handleApprove = async (id) => {
    await quizService.submitEvaluation(id, "Approved");
    setReviews(reviews.filter(r => r.id !== id));
  };

  // Database-connected Reject with Validation
  const handleReject = async (id) => {
    const currentFeedback = feedbacks[id] || '';
    if (currentFeedback.trim() === '') {
      setErrors({ ...errors, [id]: true });
    } else {
      await quizService.submitEvaluation(id, "Rejected", currentFeedback);
      setReviews(reviews.filter(r => r.id !== id));
    }
  };

  // Helper to format options arrays dynamically from flat database structures
  const getOptionsArray = (r) => {
    if (r.options) return r.options; // Fallback for old mock data
    return [r.optionA || 'Option A', r.optionB || 'Option B', r.optionC || 'Option C', r.optionD || 'Option D'];
  };

  // Helper to map letter correct answers to array index
  const getCorrectIndex = (r) => {
    if (typeof r.correctOption === 'number') return r.correctOption;
    const map = { 'A': 0, 'B': 1, 'C': 2, 'D': 3 };
    return map[r.correctOption] || 0;
  };

  if (isLoading) return <div className="text-center p-10 font-bold text-gray-500">Loading your queue...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6 relative">
      
      <div className="flex justify-between items-end border-b border-gray-200 pb-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">My Pending Reviews</h2>
          <p className="text-sm text-gray-500 mt-1">
            Questions assigned specifically to <span className="font-mono font-bold text-purple-600">{activeUser}</span>
          </p>
        </div>
        <div className="text-sm font-bold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
          Total Queue: {reviews.length}
        </div>
      </div>

      {reviews.length === 0 ? (
        <div className="bg-white p-12 rounded-lg border border-dashed border-gray-300 text-center flex flex-col items-center justify-center">
          <div className="text-4xl mb-3">☕</div>
          <h3 className="text-lg font-bold text-gray-700">You're all caught up!</h3>
          <p className="text-gray-500 font-medium mt-1">There are no questions assigned to you for review right now.</p>
        </div>
      ) : (
        reviews.map((review) => (
          <div key={review.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex flex-col">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">Created By</span>
                <span className="font-mono font-bold text-gray-800">{review.creatorId}</span>
              </div>
              <span className="px-3 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded-full uppercase border border-amber-200">
                Action Required
              </span>
            </div>
            
            <p className="text-lg font-medium text-center mb-4 text-gray-900">{review.stem}</p>
            
            <button 
              onClick={() => setExpandedId(expandedId === review.id ? null : review.id)} 
              className="w-full py-2.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-bold rounded-md mb-4 transition-colors border border-indigo-100"
            >
              {expandedId === review.id ? 'Hide Question Details ▲' : 'View Full Question ▼'}
            </button>

            {expandedId === review.id && (
              <ul className="space-y-2 mb-4 bg-gray-50 p-4 border-l-4 border-indigo-500 rounded-r-md shadow-inner">
                {getOptionsArray(review).map((opt, idx) => (
                  <li 
                    key={idx} 
                    className={`p-3 rounded border flex justify-between items-center ${
                      idx === getCorrectIndex(review) 
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-bold shadow-sm' 
                        : 'bg-white border-gray-200 text-gray-700'
                    }`}
                  >
                    <div>
                      <span className="mr-2 opacity-50">{String.fromCharCode(65 + idx)}.</span> 
                      {opt}
                    </div>
                    {idx === getCorrectIndex(review) && (
                      <span className="ml-4 px-2.5 py-1 bg-emerald-600 text-white text-[10px] uppercase tracking-wider font-extrabold rounded shadow-sm whitespace-nowrap">
                        ✓ Correct Answer
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            )}

            <div className="space-y-3 border-t border-gray-100 pt-4 mt-2">
              <div>
                <textarea 
                  value={feedbacks[review.id] || ''}
                  onChange={(e) => handleFeedbackChange(review.id, e.target.value)}
                  placeholder="Add feedback (mandatory if rejecting)..." 
                  className={`w-full rounded-md p-3 outline-none transition-shadow ${
                    errors[review.id] 
                      ? 'border-2 border-red-500 bg-red-50 placeholder-red-300' 
                      : 'border border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500'
                  }`} 
                  rows="2"
                ></textarea>
                
                {errors[review.id] && (
                  <p className="text-red-600 text-xs font-bold mt-1.5 flex items-center">
                    <span className="mr-1">⚠️</span> Feedback is required to reject a question. Please explain what needs to be fixed.
                  </p>
                )}
              </div>
              
              <div className="flex gap-4">
                <button 
                  onClick={() => handleApprove(review.id)} 
                  className="flex-1 py-3 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-bold rounded-md transition-colors border border-emerald-200 shadow-sm"
                >
                  ✓ Approve
                </button>
                <button 
                  onClick={() => handleReject(review.id)} 
                  className="flex-1 py-3 bg-red-100 hover:bg-red-200 text-red-800 font-bold rounded-md transition-colors border border-red-200 shadow-sm"
                >
                  ✕ Reject
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}