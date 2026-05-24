import React, { useState, useEffect } from 'react';
import { quizService } from './api/quizService';

export default function MyPendingReviews() {
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [activeUser, setActiveUser] = useState('');
  const [feedbacks, setFeedbacks] = useState({});
  const [errors, setErrors] = useState({});
  
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
    if (text.trim() !== '') setErrors({ ...errors, [id]: false });
  };

  const handleApprove = async (id) => {
    await quizService.submitEvaluation(id, "Approved");
    setReviews(reviews.filter(r => r.id !== id));
  };

  const handleReject = async (id) => {
    const currentFeedback = feedbacks[id] || '';
    if (currentFeedback.trim() === '') {
      setErrors({ ...errors, [id]: true });
    } else {
      await quizService.submitEvaluation(id, "Rejected", currentFeedback);
      setReviews(reviews.filter(r => r.id !== id));
    }
  };

  const getOptionsArray = (r) => r.options ? r.options : [r.optionA || 'Option A', r.optionB || 'Option B', r.optionC || 'Option C', r.optionD || 'Option D'];
  const getCorrectIndex = (r) => typeof r.correctOption === 'number' ? r.correctOption : ({ 'A': 0, 'B': 1, 'C': 2, 'D': 3 }[r.correctOption] || 0);

  if (isLoading) return (
    <div className="flex flex-col items-center justify-center h-64 space-y-4">
      <div className="w-12 h-12 border-4 border-zinc-200 dark:border-zinc-800 border-t-red-600 dark:border-t-red-500 rounded-full animate-spin"></div>
      <p className="font-black text-zinc-500 animate-pulse uppercase tracking-[0.2em] text-xs">Checking Telemetry...</p>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-10">
      <div className="flex justify-between items-end mb-4">
        <div>
          <h2 className="text-3xl font-black text-zinc-900 dark:text-white tracking-tighter uppercase italic">Pending <span className="text-red-600">Diagnostics</span></h2>
          <p className="text-zinc-500 dark:text-zinc-400 font-bold uppercase tracking-widest text-xs mt-1">Engineer assigned: <span className="font-mono font-bold text-red-600 dark:text-red-500 bg-red-50 dark:bg-red-500/10 px-2 py-0.5 border border-red-200 dark:border-red-500/20 ml-1">{activeUser}</span></p>
        </div>
        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-zinc-700 dark:text-zinc-300 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 px-4 py-2 shadow-sm">
          <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></div>
          Queue: {reviews.length}
        </div>
      </div>

      {reviews.length === 0 ? (
        <div className="bg-white dark:bg-zinc-900 p-16 border-2 border-dashed border-zinc-300 dark:border-zinc-700 text-center flex flex-col items-center justify-center shadow-sm">
          <div className="w-20 h-20 bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-6 border border-zinc-200 dark:border-zinc-700">
            <span className="text-4xl">🏆</span>
          </div>
          <h3 className="text-2xl font-black text-zinc-800 dark:text-zinc-200 uppercase italic">Garage is Empty!</h3>
          <p className="text-zinc-500 dark:text-zinc-400 font-bold uppercase tracking-widest text-xs mt-2 max-w-sm">No cars waiting for inspection. Take a break.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review.id} className="bg-white dark:bg-zinc-900 shadow-lg border border-zinc-200 dark:border-zinc-800 p-8 transition-all relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-red-600"></div>
              
              <div className="flex justify-between items-start mb-6 pb-6 border-b border-zinc-100 dark:border-zinc-800">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-1">Driver / ID</span>
                  <div className="flex gap-2 items-center">
                    <span className="font-mono font-bold text-zinc-800 dark:text-zinc-200 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 border border-zinc-200 dark:border-zinc-700 text-xs uppercase">{review.creatorId}</span>
                    <span className="text-xs text-zinc-400 dark:text-zinc-500 font-mono font-bold">#{review.id}</span>
                  </div>
                </div>
                <span className="px-3 py-1.5 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 text-[10px] font-black uppercase tracking-widest border border-red-200 dark:border-red-800 shadow-sm flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse"></span> Action Required
                </span>
              </div>
              
              <p className="text-lg font-bold leading-relaxed mb-6 text-zinc-900 dark:text-zinc-100">{review.stem}</p>
              
              <button 
                onClick={() => setExpandedId(expandedId === review.id ? null : review.id)} 
                className="w-full py-3 bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-700 font-black uppercase tracking-widest text-xs mb-6 transition-all border border-zinc-200 dark:border-zinc-700 active:scale-[0.99] skew-x-[-2deg]"
              >
                <span className="skew-x-[2deg]">{expandedId === review.id ? 'Hide Telemetry ▲' : 'Inspect Options ▼'}</span>
              </button>

              {expandedId === review.id && (
                <div className="mb-8 bg-zinc-50 dark:bg-zinc-950 p-6 border border-zinc-200 dark:border-zinc-800">
                  <ul className="space-y-3">
                    {getOptionsArray(review).map((opt, idx) => {
                      const isCorrect = idx === getCorrectIndex(review);
                      return (
                        <li key={idx} className={`p-4 border flex justify-between items-center transition-all ${isCorrect ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-500 text-emerald-900 dark:text-emerald-100' : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300'}`}>
                          <div className="font-bold text-sm flex items-center gap-3">
                            <span className={`w-8 h-8 flex items-center justify-center font-black text-sm ${isCorrect ? 'bg-emerald-500 text-white' : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'}`}>{String.fromCharCode(65 + idx)}</span> 
                            {opt}
                          </div>
                          {isCorrect && <span className="ml-4 px-3 py-1 bg-emerald-500 text-white text-[10px] uppercase tracking-widest font-black">Target</span>}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}

              <div className="space-y-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                <div>
                  <label className="block text-[10px] font-black text-zinc-500 dark:text-zinc-400 uppercase tracking-widest mb-2">Engineer Notes (Feedback)</label>
                  <textarea 
                    value={feedbacks[review.id] || ''}
                    onChange={(e) => handleFeedbackChange(review.id, e.target.value)}
                    placeholder="Provide diagnostic feedback..." 
                    className={`w-full p-4 text-sm font-bold outline-none transition-all resize-none ${errors[review.id] ? 'border-2 border-red-500 bg-red-50 dark:bg-red-900/10 placeholder-red-300 dark:placeholder-red-700 focus:ring-2 focus:ring-red-500 text-zinc-900 dark:text-zinc-100' : 'border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 text-zinc-900 dark:text-zinc-100'}`} 
                    rows="3"
                  ></textarea>
                  {errors[review.id] && (
                    <p className="text-red-600 dark:text-red-500 text-[10px] font-black uppercase tracking-widest mt-2 flex items-center bg-red-50 dark:bg-red-900/20 p-2 inline-flex">
                      <span className="mr-2 text-base leading-none">⚠️</span> Feedback required for rejection.
                    </p>
                  )}
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button onClick={() => handleApprove(review.id)} className="flex-1 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase tracking-widest transition-all shadow-sm active:scale-95 skew-x-[-2deg]">
                    <span className="skew-x-[2deg]">Pass Inspection ✓</span>
                  </button>
                  <button onClick={() => handleReject(review.id)} className="flex-1 py-4 bg-zinc-800 hover:bg-red-600 text-white font-black uppercase tracking-widest transition-all shadow-sm active:scale-95 skew-x-[-2deg]">
                    <span className="skew-x-[2deg]">Reject & Return ✕</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}