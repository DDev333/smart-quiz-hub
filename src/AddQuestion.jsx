import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import { quizService } from './api/quizService';
// Import the relational master lists
import { masterSmeList, masterStacks, masterTopics } from './masterData'; 

export default function AddQuestion() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('ui');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');
  
  const [parsedExcelData, setParsedExcelData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReviewer, setSelectedReviewer] = useState('');

  // Use the ID '1001' as default for Spring Cloud
  const [formData, setFormData] = useState({
    stem: '', stackId: '1001', topicId: '1001', difficulty: 'Medium',
    optionA: '', optionB: '', optionC: '', optionD: '', correctOption: 'B'
  });

  // Calculate available topics based on the currently selected Stack
  const availableTopics = masterTopics.filter(t => t.stackId === formData.stackId);
  const selectedStackName = masterStacks.find(s => s.id === formData.stackId)?.name || '';

  const currentUser = localStorage.getItem('currentUser') || 'Unknown';
  
  // Filter reviewers based on the resolved Stack Name
  const eligibleReviewers = masterSmeList.filter(sme => 
    sme.skills.includes(selectedStackName) && sme.id !== currentUser
  );

  // Handle cascading dropdown reset
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'stackId') {
      // If stack changes, find the first available topic for that stack and auto-select it
      const newTopics = masterTopics.filter(t => t.stackId === value);
      setFormData({ 
        ...formData, 
        stackId: value, 
        topicId: newTopics.length > 0 ? newTopics[0].id : '' 
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleAIGenerate = () => {
    setIsAiLoading(true);
    setTimeout(() => {
      setFormData({
        ...formData,
        stem: 'John has multiple instances of a service running dynamically in the cloud. He wants each service to automatically register itself and discover others without hardcoding URLs. Which component is used for this purpose?',
        optionA: 'Spring MVC', optionB: 'Eureka Server', optionC: 'Hibernate', optionD: 'Apache Tomcat', correctOption: 'B',
        stackId: '1001', topicId: '1002' // Auto-maps to Eureka topic
      });
      setIsAiLoading(false);
    }, 1000);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadStatus('Validating...');
    const reader = new FileReader();
    reader.onload = (evt) => {
      const data = evt.target.result;
      const workbook = XLSX.read(data, { type: 'binary' });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      const headers = jsonData[0] || [];

      const requiredColumns = ["Technology Stack", "Topic", "Difficulty", "Question Stem", "Option A", "Option B", "Option C", "Option D", "Correct Answer"];
      const missingColumns = requiredColumns.filter(col => !headers.includes(col));
      
      if (missingColumns.length > 0) {
        alert(`Upload Failed. Missing columns: ${missingColumns.join(", ")}`);
        document.getElementById('file').value = ""; 
        setUploadStatus('Failed Validation');
        setParsedExcelData([]);
      } else {
        const rows = jsonData.slice(1).filter(row => row.length > 0);
        const mappedQuestions = rows.map(row => {
          let obj = {};
          headers.forEach((header, i) => { obj[header] = row[i]; });
          return obj;
        });

        setParsedExcelData(mappedQuestions);
        setUploadStatus(`Validated successfully. ${mappedQuestions.length} questions found.`);
      }
    };
    reader.readAsBinaryString(file);
  };

  const handleSaveDraft = async () => {
    if (activeTab === 'bulk') {
      if (parsedExcelData.length === 0) {
        alert("Please upload and validate a file first.");
        return;
      }
      await quizService.saveDrafts(parsedExcelData);
      alert(`Success! Imported ${parsedExcelData.length} questions as Drafts.`);
      navigate('/my-questions');
    } else {
      // Map IDs back to Strings for the database to match existing schema
      const finalQuestionData = {
        ...formData,
        stack: masterStacks.find(s => s.id === formData.stackId)?.name,
        topic: masterTopics.find(t => t.id === formData.topicId)?.name,
      };
      await quizService.saveDrafts([finalQuestionData]);
      alert("Draft saved successfully!");
      navigate('/my-questions');
    }
  };

  const handleSubmitForReview = () => {
    alert(`Question submitted and assigned to ${selectedReviewer} for review!`);
    navigate('/my-questions');
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 max-w-4xl mx-auto my-6 relative">
      <div className="flex justify-between items-center border-b border-gray-200 pb-4 mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Add Question</h2>
        <button onClick={() => navigate('/my-questions')} className="text-gray-500 hover:text-gray-700 font-medium">Cancel</button>
      </div>

      <div className="flex gap-4 mb-8 text-center">
        <button onClick={() => setActiveTab('ui')} className={`flex-1 py-4 border-2 rounded-lg font-semibold transition-all ${activeTab === 'ui' ? 'border-purple-500 bg-purple-50 text-purple-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}>Add from UI</button>
        <button onClick={() => setActiveTab('bulk')} className={`flex-1 py-4 border-2 rounded-lg font-semibold transition-all ${activeTab === 'bulk' ? 'border-purple-500 bg-purple-50 text-purple-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}>Bulk Upload</button>
      </div>

      {activeTab === 'ui' && (
        <div className="space-y-6">
          <div className="flex justify-between items-end">
            <label className="block text-sm font-semibold text-gray-700 uppercase">Question Stem</label>
            <button onClick={handleAIGenerate} disabled={isAiLoading} className="text-xs bg-indigo-100 text-indigo-700 px-3 py-1.5 rounded font-bold hover:bg-indigo-200 transition-colors">
              {isAiLoading ? 'Generating...' : '✨ Auto-Generate with AI'}
            </button>
          </div>
          <textarea name="stem" value={formData.stem} onChange={handleInputChange} className="w-full border border-gray-300 rounded-md p-3 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500" rows="3"></textarea>

          <div className="grid grid-cols-3 gap-6">
            
            {/* Dynamic Master Data Dropdowns */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 uppercase mb-2">Technology Stack</label>
              <select name="stackId" value={formData.stackId} onChange={handleInputChange} className="w-full border border-gray-300 rounded-md p-2.5 outline-none focus:border-purple-500 bg-gray-50">
                {masterStacks.map(stack => (
                  <option key={stack.id} value={stack.id}>{stack.name}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 uppercase mb-2">Topic</label>
              <select name="topicId" value={formData.topicId} onChange={handleInputChange} className="w-full border border-gray-300 rounded-md p-2.5 outline-none focus:border-purple-500 bg-gray-50 truncate" disabled={availableTopics.length === 0}>
                {availableTopics.length === 0 ? <option value="">No topics mapped...</option> : null}
                {availableTopics.map(topic => (
                  <option key={topic.id} value={topic.id}>{topic.name}</option>
                ))}
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
              <div key={opt}><label className="block text-sm font-semibold text-gray-700 uppercase mb-2">Option {opt}</label><input type="text" name={`option${opt}`} value={formData[`option${opt}`]} onChange={handleInputChange} className="w-full border border-gray-300 rounded-md p-2.5 outline-none focus:border-purple-500" /></div>
            ))}
          </div>
          <div className="pt-4 border-t border-gray-100">
            <label className="block text-sm font-semibold text-gray-700 uppercase mb-2">Correct Option</label>
            <select name="correctOption" value={formData.correctOption} onChange={handleInputChange} className="w-full border border-gray-300 rounded-md p-2.5 outline-none focus:border-purple-500">
              <option value="A">A</option><option value="B">B</option><option value="C">C</option><option value="D">D</option>
            </select>
          </div>
        </div>
      )}

      {activeTab === 'bulk' && (
        <div className="space-y-6 text-center py-8">
           <a href="/Template_MCQs.csv" download className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md font-bold hover:bg-gray-300 transition-colors">Download Template</a>
           <div className="border-2 border-dashed border-gray-300 rounded-lg p-10 mt-6 bg-gray-50">
             <input type="file" id="file" className="hidden" accept=".xlsx, .csv" onChange={handleFileUpload} />
             <label htmlFor="file" className="cursor-pointer bg-white border border-gray-300 px-6 py-3 rounded-md font-medium hover:bg-gray-100 transition-colors shadow-sm">Choose File</label>
             {uploadStatus && <p className="mt-4 text-sm font-bold text-indigo-600">{uploadStatus}</p>}
           </div>
        </div>
      )}

      <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-200">
        <button onClick={() => navigate('/my-questions')} className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors">Cancel</button>
        <button onClick={handleSaveDraft} className="px-5 py-2.5 bg-gray-100 text-gray-800 rounded-md font-medium hover:bg-gray-200 transition-colors">
          {activeTab === 'bulk' ? 'Import as Drafts' : 'Save Draft'}
        </button>
        {activeTab === 'ui' && (
          <button onClick={() => setIsModalOpen(true)} className="px-5 py-2.5 bg-[#A855F7] text-white rounded-md font-bold hover:bg-purple-600 transition-colors shadow-sm">Save & Send for Review</button>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-900/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold mb-4">Select a Reviewer</h3>
            <p className="text-sm text-gray-600 mb-4">Choose an SME mapped to the <span className="font-bold text-purple-700">{selectedStackName}</span> tech stack.</p>
            <select value={selectedReviewer} onChange={(e) => setSelectedReviewer(e.target.value)} className="w-full border border-gray-300 rounded-md p-3 mb-6 font-mono text-sm outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500">
              <option value="" disabled>Select eligible reviewer...</option>
              {eligibleReviewers.map(sme => <option key={sme.id} value={sme.id}>{sme.id} ({sme.role})</option>)}
            </select>
            <div className="flex justify-end gap-3">
              <button onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">Cancel</button>
              <button onClick={handleSubmitForReview} disabled={!selectedReviewer} className="px-5 py-2.5 bg-[#A855F7] text-white rounded-md font-bold disabled:opacity-50 hover:bg-purple-600 transition-colors">Submit</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}