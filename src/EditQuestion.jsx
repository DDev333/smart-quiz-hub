import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { masterSmeList } from './masterData'; 

export default function EditQuestion() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReviewer, setSelectedReviewer] = useState('');
  
  const [formData, setFormData] = useState({
    stem: 'Explain @SpringBootApplication', stack: 'Spring Boot', topic: 'Annotations', difficulty: 'Medium',
    optionA: 'Service Registry', optionB: 'Combines @Configuration, @EnableAutoConfiguration, @ComponentScan',
    optionC: 'Database management', optionD: 'API Gateway', correctOption: 'B', status: 'Rejected',
    reviewerFeedback: 'Please ensure all wrong options relate to Java annotations to make it challenging.'
  });

  const currentUser = localStorage.getItem('currentUser') || 'Unknown';
  const eligibleReviewers = masterSmeList.filter(sme => sme.skills.includes(formData.stack) && sme.id !== currentUser);

  const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleSubmitForReview = () => navigate('/my-questions');

  const inputBaseClasses = "w-full border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 p-3.5 text-sm font-bold text-zinc-900 dark:text-zinc-100 outline-none focus:border-red-600 focus:ring-2 focus:ring-red-600/20 transition-all";
  const labelClasses = "block text-[10px] font-black text-zinc-500 dark:text-zinc-400 uppercase tracking-widest mb-2";

  return (
    <div className="bg-white dark:bg-zinc-900 shadow-xl border-t-4 border-t-red-600 border border-zinc-200 dark:border-zinc-800 p-8 md:p-10 max-w-4xl mx-auto mb-10 relative transition-colors">
      <div className="flex justify-between items-center mb-8 pb-6 border-b border-zinc-100 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-3xl font-black text-zinc-900 dark:text-white tracking-tighter uppercase italic">Tune <span className="text-red-600">Question</span></h2>
            <span className="px-3 py-1 bg-zinc-950 text-white font-mono text-xs font-bold border border-zinc-700 uppercase tracking-widest">#{id}</span>
          </div>
          <p className="text-zinc-500 dark:text-zinc-400 font-bold uppercase tracking-widest text-xs mt-1">Make corrections and resubmit to the pit crew.</p>
        </div>
        <button onClick={() => navigate('/my-questions')} className="text-zinc-400 hover:text-red-600 text-2xl font-black transition-colors">✕</button>
      </div>

      {formData.status === 'Rejected' && (
        <div className="mb-8 p-5 bg-red-600 border border-red-800 flex gap-4 items-start shadow-sm">
          <div className="w-8 h-8 bg-zinc-900 flex items-center justify-center text-white font-black shrink-0">!</div>
          <div>
            <span className="text-[10px] font-black text-white uppercase tracking-widest block mb-1">Engineer Feedback</span>
            <span className="text-sm text-red-100 font-bold leading-relaxed">{formData.reviewerFeedback}</span>
          </div>
        </div>
      )}

      <div className="space-y-8">
        <div>
          <label className={labelClasses}>Telemetry Stem (Question)</label>
          <textarea name="stem" value={formData.stem} onChange={handleInputChange} className={`${inputBaseClasses} min-h-[100px] resize-y`}></textarea>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-zinc-50 dark:bg-zinc-950 p-6 border border-zinc-200 dark:border-zinc-800">
          <div>
            <label className={labelClasses}>Chassis</label>
            <select name="stack" value={formData.stack} onChange={handleInputChange} className={`${inputBaseClasses} cursor-pointer`}>
              <option value="Spring Boot">Spring Boot</option><option value="Spring Cloud">Spring Cloud</option><option value="Spring Core">Spring Core</option>
            </select>
          </div>
          <div>
            <label className={labelClasses}>Aero</label>
            <select name="topic" value={formData.topic} onChange={handleInputChange} className={`${inputBaseClasses} cursor-pointer`}>
              <option value="Annotations">Annotations</option><option value="Eureka Server">Eureka Server</option><option value="Dependencies">Dependencies</option>
            </select>
          </div>
          <div>
            <label className={labelClasses}>Difficulty</label>
            <select name="difficulty" value={formData.difficulty} onChange={handleInputChange} className={`${inputBaseClasses} cursor-pointer`}>
              <option value="Easy">Easy</option><option value="Medium">Medium</option><option value="Hard">Hard</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 pt-2">
          {['A', 'B', 'C', 'D'].map(opt => (
            <div key={opt} className="relative">
              <label className={labelClasses}>Configuration {opt}</label>
              <div className="absolute top-[34px] left-3 w-6 h-6 bg-zinc-800 text-white flex items-center justify-center text-xs font-black">{opt}</div>
              <input type="text" name={`option${opt}`} value={formData[`option${opt}`]} onChange={handleInputChange} className={`${inputBaseClasses} pl-12`} />
            </div>
          ))}
        </div>

        <div className="pt-8 border-t border-zinc-200 dark:border-zinc-800 flex items-center gap-6">
          <div className="flex-1">
            <label className={labelClasses}>Target Configuration</label>
            <select name="correctOption" value={formData.correctOption} onChange={handleInputChange} className={`${inputBaseClasses} border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-400 focus:ring-emerald-500/20 cursor-pointer`}>
              <option value="A">Configuration A</option><option value="B">Configuration B</option><option value="C">Configuration C</option><option value="D">Configuration D</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-end gap-3 mt-10 pt-8 border-t border-zinc-200 dark:border-zinc-800">
        <button onClick={() => navigate('/my-questions')} className="px-6 py-3.5 border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 font-black uppercase tracking-widest transition-all skew-x-[-5deg]"><span className="skew-x-[5deg]">Discard Updates</span></button>
        <button onClick={() => setIsModalOpen(true)} className="px-6 py-3.5 bg-gradient-to-r from-red-600 to-red-800 text-white font-black uppercase tracking-widest hover:shadow-[0_4px_15px_rgba(220,38,38,0.5)] transition-all active:scale-95 skew-x-[-5deg]">
          <span className="skew-x-[5deg]">Save & Resubmit 📡</span>
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-zinc-900 shadow-2xl max-w-md w-full border-t-4 border-t-red-600 border border-zinc-200 dark:border-zinc-800">
            <div className="px-6 py-5 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 flex justify-between items-center">
              <h3 className="text-xl font-black uppercase italic tracking-tight text-zinc-900 dark:text-white">Assign Pit Crew</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-zinc-500 hover:text-red-600 font-black text-lg">✕</button>
            </div>
            <div className="p-6">
              <p className="text-[10px] text-zinc-500 dark:text-zinc-400 font-bold uppercase tracking-widest mb-6">Route specs to an engineer tuned for <span className="font-black text-red-600 dark:text-red-500 bg-red-50 dark:bg-red-900/10 px-2 py-0.5 border border-red-200 dark:border-red-800">{formData.stack}</span>.</p>
              <select value={selectedReviewer} onChange={(e) => setSelectedReviewer(e.target.value)} className={`${inputBaseClasses} cursor-pointer mb-8`}>
                <option value="" disabled>Select eligible engineer...</option>
                {eligibleReviewers.map(sme => <option key={sme.id} value={sme.id}>{sme.id}</option>)}
              </select>
              <div className="flex gap-3">
                <button onClick={() => setIsModalOpen(false)} className="flex-1 px-5 py-3.5 border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-black uppercase tracking-widest transition-colors skew-x-[-5deg]"><span className="skew-x-[5deg]">Cancel</span></button>
                <button onClick={handleSubmitForReview} disabled={!selectedReviewer} className="flex-1 px-5 py-3.5 bg-red-600 hover:bg-red-700 text-white font-black uppercase tracking-widest disabled:opacity-50 transition-all active:scale-95 skew-x-[-5deg]"><span className="skew-x-[5deg]">Resubmit 🏁</span></button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}