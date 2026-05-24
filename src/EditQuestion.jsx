import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { masterSmeList, masterStacks, masterTopics } from './masterData'; 

export default function EditQuestion() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReviewer, setSelectedReviewer] = useState('');
  
  const [formData, setFormData] = useState({
    stem: 'Explain @SpringBootApplication', stack: 'Spring Boot', topic: 'Annotations', difficulty: 'Medium',
    optionA: 'Service Registry', optionB: 'Combines @Configuration, @EnableAutoConfiguration, @ComponentScan',
    optionC: 'Database management', optionD: 'API Gateway', correctOption: 'B', status: 'Rejected',
    reviewerFeedback: 'Please ensure all wrong options relate to Java annotations to make it challenging.'
  });

  const currentUser = localStorage.getItem('currentUser') || 'Unknown';
  
  // Dynamically filter eligible reviewers
  const eligibleReviewers = masterSmeList.filter(sme => 
    sme.skills.includes(formData.stack) && sme.id !== currentUser
  );

  const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmitForReview = () => {
    alert(`Updates saved! Sent to ${selectedReviewer} for review.`);
    navigate('/my-questions');
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 max-w-4xl mx-auto my-6 relative">
      <div className="flex justify-between items-center border-b border-gray-200 pb-4 mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Edit Question <span className="text-gray-400">#{id}</span></h2>
        <button onClick={() => navigate('/my-questions')} className="text-gray-500 hover:text-gray-700 font-medium">Cancel</button>
      </div>

      {formData.status === 'Rejected' && (
        <div className="mb-8 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-md">
          <span className="text-xs font-bold text-red-700 uppercase block mb-1">Reviewer Feedback</span>
          <span className="text-sm text-red-900">{formData.reviewerFeedback}</span>
        </div>
      )}

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 uppercase mb-2">Question Stem</label>
          <textarea name="stem" value={formData.stem} onChange={handleInputChange} className="w-full border border-gray-300 rounded-md p-3 outline-none focus:border-purple-500" rows="3"></textarea>
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 uppercase mb-2">Stack</label>
            <select name="stack" value={formData.stack} onChange={handleInputChange} className="w-full border border-gray-300 rounded-md p-2.5 outline-none focus:border-purple-500">
              <option value="Spring Boot">Spring Boot</option><option value="Spring Cloud">Spring Cloud</option><option value="Spring Core">Spring Core</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 uppercase mb-2">Topic</label>
            <select name="topic" value={formData.topic} onChange={handleInputChange} className="w-full border border-gray-300 rounded-md p-2.5 outline-none focus:border-purple-500">
              <option value="Annotations">Annotations</option><option value="Eureka Server">Eureka Server</option><option value="Dependencies">Dependencies</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 uppercase mb-2">Difficulty</label>
            <select name="difficulty" value={formData.difficulty} onChange={handleInputChange} className="w-full border border-gray-300 rounded-md p-2.5 outline-none focus:border-purple-500">
              <option value="Easy">Easy</option><option value="Medium">Medium</option><option value="Hard">Hard</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 pt-4">
          {['A', 'B', 'C', 'D'].map(opt => (
            <div key={opt}>
              <label className="block text-sm font-semibold text-gray-700 uppercase mb-2">Option {opt}</label>
              <input type="text" name={`option${opt}`} value={formData[`option${opt}`]} onChange={handleInputChange} className="w-full border border-gray-300 rounded-md p-2.5 outline-none focus:border-purple-500" />
            </div>
          ))}
        </div>

        <div className="pt-4 border-t border-gray-100">
          <label className="block text-sm font-semibold text-gray-700 uppercase mb-2">Correct Option</label>
          <select name="correctOption" value={formData.correctOption} onChange={handleInputChange} className="w-full border border-gray-300 rounded-md p-2.5 outline-none focus:border-purple-500">
            <option value="A">A</option><option value="B">B</option><option value="C">C</option><option value="D">D</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-200">
        <button onClick={() => navigate('/my-questions')} className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-md font-medium hover:bg-gray-50 transition-colors">Cancel</button>
        <button onClick={() => navigate('/my-questions')} className="px-5 py-2.5 bg-gray-100 text-gray-800 rounded-md font-medium hover:bg-gray-200 transition-colors">Save Draft</button>
        <button onClick={() => setIsModalOpen(true)} className="px-5 py-2.5 bg-[#A855F7] text-white rounded-md font-bold hover:bg-purple-600 transition-colors shadow-sm">Save & Send for Review</button>
      </div>

      {/* Reviewer Selection Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-900/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold mb-4">Select a Reviewer</h3>
            <p className="text-sm text-gray-600 mb-4">Choose an SME mapped to the <span className="font-bold text-purple-700">{formData.stack}</span> tech stack.</p>
            
            <select value={selectedReviewer} onChange={(e) => setSelectedReviewer(e.target.value)} className="w-full border rounded-md p-3 mb-6 font-mono text-sm outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500">
              <option value="" disabled>Select eligible reviewer...</option>
              {eligibleReviewers.map(sme => <option key={sme.id} value={sme.id}>{sme.id}</option>)}
            </select>
            
            <div className="flex justify-end gap-3">
              <button onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 border rounded-md hover:bg-gray-50 transition-colors">Cancel</button>
              <button onClick={handleSubmitForReview} disabled={!selectedReviewer} className="px-5 py-2.5 bg-[#A855F7] text-white rounded-md font-bold disabled:opacity-50 hover:bg-purple-600 transition-colors">Submit</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}