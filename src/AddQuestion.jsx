import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import { quizService } from './api/quizService';
import { masterSmeList, masterStacks, masterTopics } from './masterData'; 

export default function AddQuestion() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('ui');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');
  const [parsedExcelData, setParsedExcelData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReviewer, setSelectedReviewer] = useState('');

  const [formData, setFormData] = useState({ stem: '', stackId: '1001', topicId: '1001', difficulty: 'Medium', optionA: '', optionB: '', optionC: '', optionD: '', correctOption: 'B' });

  const availableTopics = masterTopics.filter(t => t.stackId === formData.stackId);
  const selectedStackName = masterStacks.find(s => s.id === formData.stackId)?.name || '';
  const currentUser = localStorage.getItem('currentUser') || 'Unknown';
  const eligibleReviewers = masterSmeList.filter(sme => sme.skills.includes(selectedStackName) && sme.id !== currentUser);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'stackId') {
      const newTopics = masterTopics.filter(t => t.stackId === value);
      setFormData({ ...formData, stackId: value, topicId: newTopics.length > 0 ? newTopics[0].id : '' });
    } else setFormData({ ...formData, [name]: value });
  };

  const handleAIGenerate = () => {
    setIsAiLoading(true);
    setTimeout(() => {
      setFormData({
        ...formData,
        stem: 'John has multiple instances of a service running dynamically in the cloud. He wants each service to automatically register itself and discover others without hardcoding URLs. Which component is used for this purpose?',
        optionA: 'Spring MVC', optionB: 'Eureka Server', optionC: 'Hibernate', optionD: 'Apache Tomcat', correctOption: 'B', stackId: '1001', topicId: '1002'
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
        setUploadStatus(`Validated successfully. ${mappedQuestions.length} questions ready.`);
      }
    };
    reader.readAsBinaryString(file);
  };

  const handleSaveDraft = async () => {
    if (activeTab === 'bulk') {
      if (parsedExcelData.length === 0) return alert("Please upload and validate a file first.");
      await quizService.saveDrafts(parsedExcelData);
      navigate('/my-questions');
    } else {
      const finalQuestionData = {
        ...formData,
        stack: masterStacks.find(s => s.id === formData.stackId)?.name,
        topic: masterTopics.find(t => t.id === formData.topicId)?.name,
      };
      await quizService.saveDrafts([finalQuestionData]);
      navigate('/my-questions');
    }
  };

  const handleSubmitForReview = () => {
    navigate('/my-questions');
  };

  const inputBaseClasses = "w-full border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 p-3.5 text-sm font-bold text-zinc-900 dark:text-zinc-100 outline-none focus:border-red-600 focus:ring-2 focus:ring-red-600/20 transition-all";
  const labelClasses = "block text-[10px] font-black text-zinc-500 dark:text-zinc-400 uppercase tracking-widest mb-2";

  return (
    <div className="bg-white dark:bg-zinc-900 shadow-xl border-t-4 border-t-red-600 border border-zinc-200 dark:border-zinc-800 p-8 md:p-10 max-w-4xl mx-auto mb-10 relative transition-colors">
      <div className="flex justify-between items-center mb-8 pb-6 border-b border-zinc-100 dark:border-zinc-800">
        <div>
          <h2 className="text-3xl font-black text-zinc-900 dark:text-white tracking-tighter uppercase italic">Build <span className="text-red-600">Question</span></h2>
          <p className="text-zinc-500 dark:text-zinc-400 font-bold uppercase tracking-widest text-xs mt-1">Assemble new technical specs for the platform.</p>
        </div>
        <button onClick={() => navigate('/my-questions')} className="text-zinc-400 hover:text-red-600 text-2xl font-black transition-colors">✕</button>
      </div>

      <div className="flex p-1 mb-8 bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 max-w-sm mx-auto">
        <button onClick={() => setActiveTab('ui')} className={`flex-1 py-2.5 text-xs font-black uppercase tracking-widest transition-all duration-300 ${activeTab === 'ui' ? 'bg-zinc-900 dark:bg-zinc-800 text-white shadow-md' : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'}`}>Assembly Form</button>
        <button onClick={() => setActiveTab('bulk')} className={`flex-1 py-2.5 text-xs font-black uppercase tracking-widest transition-all duration-300 ${activeTab === 'bulk' ? 'bg-zinc-900 dark:bg-zinc-800 text-white shadow-md' : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'}`}>Bulk Import</button>
      </div>

      {activeTab === 'ui' && (
        <div className="space-y-8 animate-in fade-in duration-300">
          <div>
            <div className="flex justify-between items-end mb-2">
              <label className={labelClasses}>Telemetry Stem (Question)</label>
              <button onClick={handleAIGenerate} disabled={isAiLoading} className="text-[10px] uppercase tracking-widest bg-zinc-900 text-red-500 border border-red-500/50 px-4 py-1.5 font-black hover:bg-red-600 hover:text-white transition-all active:scale-95 flex items-center gap-1.5 skew-x-[-10deg]">
                <span className="skew-x-[10deg]">{isAiLoading ? 'Calculating...' : 'AI Auto-Tune ⚡'}</span>
              </button>
            </div>
            <textarea name="stem" value={formData.stem} onChange={handleInputChange} className={`${inputBaseClasses} min-h-[100px] resize-y`} placeholder="Enter the technical scenario..."></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-zinc-50 dark:bg-zinc-950 p-6 border border-zinc-200 dark:border-zinc-800">
            <div>
              <label className={labelClasses}>Chassis (Stack)</label>
              <select name="stackId" value={formData.stackId} onChange={handleInputChange} className={`${inputBaseClasses} cursor-pointer`}>
                {masterStacks.map(stack => <option key={stack.id} value={stack.id}>{stack.name}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClasses}>Aero (Topic)</label>
              <select name="topicId" value={formData.topicId} onChange={handleInputChange} className={`${inputBaseClasses} cursor-pointer truncate`} disabled={availableTopics.length === 0}>
                {availableTopics.length === 0 ? <option value="">No topics...</option> : availableTopics.map(topic => <option key={topic.id} value={topic.id}>{topic.name}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClasses}>Difficulty Level</label>
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
                <input type="text" name={`option${opt}`} value={formData[`option${opt}`]} onChange={handleInputChange} className={`${inputBaseClasses} pl-12`} placeholder={`Enter configuration ${opt}...`} />
              </div>
            ))}
          </div>

          <div className="pt-8 border-t border-zinc-200 dark:border-zinc-800 flex items-center gap-6">
            <div className="flex-1">
              <label className={labelClasses}>Target Configuration (Correct Answer)</label>
              <select name="correctOption" value={formData.correctOption} onChange={handleInputChange} className={`${inputBaseClasses} border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-400 focus:ring-emerald-500/20 cursor-pointer`}>
                <option value="A">Configuration A</option><option value="B">Configuration B</option><option value="C">Configuration C</option><option value="D">Configuration D</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'bulk' && (
        <div className="space-y-6 text-center py-10 animate-in fade-in duration-300">
           <a href="/Template_MCQs.csv" download className="inline-flex items-center gap-2 bg-zinc-900 text-white px-6 py-3 font-black uppercase tracking-widest hover:bg-red-600 transition-all border border-zinc-800 shadow-sm skew-x-[-5deg]">
             <span className="skew-x-[5deg]">📥 Download Spec Template</span>
           </a>
           <div className="border-2 border-dashed border-zinc-300 dark:border-zinc-700 p-12 mt-8 bg-zinc-50 dark:bg-zinc-950 hover:border-red-500 transition-colors group cursor-pointer relative">
             <input type="file" id="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" accept=".xlsx, .csv" onChange={handleFileUpload} />
             <div className="w-16 h-16 mx-auto bg-zinc-800 text-white flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
               <span className="text-2xl">📂</span>
             </div>
             <p className="text-lg font-black text-zinc-900 dark:text-white uppercase tracking-wider mb-1">Drop Specs Here</p>
             <p className="text-xs text-zinc-500 dark:text-zinc-400 font-bold uppercase tracking-widest">or click to browse (.xlsx, .csv)</p>
             {uploadStatus && <div className="mt-6 inline-block bg-red-50 dark:bg-red-900/20 px-4 py-2 border border-red-200 dark:border-red-800"><p className="text-xs font-black text-red-600 dark:text-red-400 uppercase tracking-widest">{uploadStatus}</p></div>}
           </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-end gap-3 mt-10 pt-8 border-t border-zinc-200 dark:border-zinc-800">
        <button onClick={() => navigate('/my-questions')} className="px-6 py-3.5 border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 font-black uppercase tracking-widest transition-all skew-x-[-5deg]"><span className="skew-x-[5deg]">Cancel</span></button>
        <button onClick={handleSaveDraft} className="px-6 py-3.5 bg-zinc-800 text-white border border-zinc-700 font-black uppercase tracking-widest hover:bg-zinc-700 transition-all shadow-sm skew-x-[-5deg]">
          <span className="skew-x-[5deg]">{activeTab === 'bulk' ? 'Import as Drafts' : 'Save as Draft'}</span>
        </button>
        {activeTab === 'ui' && (
          <button onClick={() => setIsModalOpen(true)} className="px-6 py-3.5 bg-gradient-to-r from-red-600 to-red-800 text-white font-black uppercase tracking-widest hover:shadow-[0_4px_15px_rgba(220,38,38,0.5)] transition-all active:scale-95 skew-x-[-5deg]">
            <span className="skew-x-[5deg]">Save & Request Review 📡</span>
          </button>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-zinc-900 shadow-2xl max-w-md w-full border-t-4 border-t-red-600 border border-zinc-200 dark:border-zinc-800">
            <div className="px-6 py-5 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 flex justify-between items-center">
              <h3 className="text-xl font-black uppercase italic tracking-tight text-zinc-900 dark:text-white">Assign Pit Crew</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-zinc-500 hover:text-red-600 font-black text-lg">✕</button>
            </div>
            <div className="p-6">
              <p className="text-[10px] text-zinc-500 dark:text-zinc-400 font-bold uppercase tracking-widest mb-6">Route specs to an engineer tuned for <span className="font-black text-red-600 dark:text-red-500 bg-red-50 dark:bg-red-900/10 px-2 py-0.5 border border-red-200 dark:border-red-800">{selectedStackName}</span>.</p>
              <select value={selectedReviewer} onChange={(e) => setSelectedReviewer(e.target.value)} className={`${inputBaseClasses} cursor-pointer mb-8`}>
                <option value="" disabled>Select eligible engineer...</option>
                {eligibleReviewers.map(sme => <option key={sme.id} value={sme.id}>{sme.id} ({sme.role})</option>)}
              </select>
              <div className="flex gap-3">
                <button onClick={() => setIsModalOpen(false)} className="flex-1 px-5 py-3.5 border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-black uppercase tracking-widest transition-colors skew-x-[-5deg]"><span className="skew-x-[5deg]">Cancel</span></button>
                <button onClick={handleSubmitForReview} disabled={!selectedReviewer} className="flex-1 px-5 py-3.5 bg-red-600 hover:bg-red-700 text-white font-black uppercase tracking-widest disabled:opacity-50 transition-all active:scale-95 skew-x-[-5deg]"><span className="skew-x-[5deg]">Submit Specs 🏁</span></button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}