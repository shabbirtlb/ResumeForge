import React, { useState, useEffect } from 'react';
import { ArrowUpDown, GripVertical, ArrowUp, ArrowDown } from 'lucide-react';
import type { SectionOrder } from '../types';

interface SectionOrderFormProps {
  data: SectionOrder;
  onChange: (data: SectionOrder) => void;
  onNext: () => void;
  onBack: () => void;
}

const availableSections = [
  { id: 'experience', label: 'Work Experience', description: 'Professional work history' },
  { id: 'education', label: 'Education', description: 'Academic background' },
  { id: 'projects', label: 'Projects', description: 'Portfolio projects' },
  { id: 'skills', label: 'Skills', description: 'Technical and soft skills' }
];

const defaultSectionOrder = {
  resume: ['experience', 'education', 'projects', 'skills'],
  portfolio: ['experience', 'projects', 'skills', 'education']
};

export const SectionOrderForm: React.FC<SectionOrderFormProps> = ({ data, onChange, onNext, onBack }) => {
  const [activeTab, setActiveTab] = useState<'resume' | 'portfolio'>('resume');

  // Initialize with default sections if data is empty or missing
  useEffect(() => {
    const safeData = data || { resume: [], portfolio: [] };
    const needsInitialization = 
      !Array.isArray(safeData.resume) || 
      safeData.resume.length === 0 || 
      !Array.isArray(safeData.portfolio) || 
      safeData.portfolio.length === 0;

    if (needsInitialization) {
      onChange({
        resume: safeData.resume.length > 0 ? safeData.resume : [...defaultSectionOrder.resume],
        portfolio: safeData.portfolio.length > 0 ? safeData.portfolio : [...defaultSectionOrder.portfolio]
      });
    }
  }, [data, onChange]);

  // Ensure data exists and has the required properties
  const safeData = data || defaultSectionOrder;
  const resumeSections = Array.isArray(safeData.resume) && safeData.resume.length > 0 
    ? safeData.resume 
    : defaultSectionOrder.resume;
  const portfolioSections = Array.isArray(safeData.portfolio) && safeData.portfolio.length > 0 
    ? safeData.portfolio 
    : defaultSectionOrder.portfolio;

  const moveSection = (type: 'resume' | 'portfolio', fromIndex: number, toIndex: number) => {
    const currentSections = type === 'resume' ? resumeSections : portfolioSections;
    const sections = [...currentSections];
    const [movedSection] = sections.splice(fromIndex, 1);
    sections.splice(toIndex, 0, movedSection);
    
    onChange({
      ...safeData,
      [type]: sections
    });
  };

  const moveUp = (type: 'resume' | 'portfolio', index: number) => {
    if (index > 0) {
      moveSection(type, index, index - 1);
    }
  };

  const moveDown = (type: 'resume' | 'portfolio', index: number) => {
    const currentSections = type === 'resume' ? resumeSections : portfolioSections;
    if (index < currentSections.length - 1) {
      moveSection(type, index, index + 1);
    }
  };

  const getSectionInfo = (sectionId: string) => {
    return availableSections.find(s => s.id === sectionId) || { id: sectionId, label: sectionId, description: '' };
  };

  const renderSectionList = (type: 'resume' | 'portfolio') => {
    const currentSections = type === 'resume' ? resumeSections : portfolioSections;
    
    if (!currentSections || currentSections.length === 0) {
      return (
        <div className="text-center py-8">
          <p className="text-gray-500">Loading sections...</p>
        </div>
      );
    }
    
    return (
      <div className="space-y-3">
        {currentSections.map((sectionId, index) => {
          const section = getSectionInfo(sectionId);
          return (
            <div
              key={sectionId}
              className="bg-white border border-gray-200 rounded-lg p-4 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-center space-x-3">
                <GripVertical className="w-5 h-5 text-gray-400" />
                <div>
                  <h4 className="font-medium text-gray-900">{section.label}</h4>
                  <p className="text-sm text-gray-600">{section.description}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  {index + 1}
                </span>
                <button
                  onClick={() => moveUp(type, index)}
                  disabled={index === 0}
                  className={`p-2 rounded-lg transition-colors duration-200 ${
                    index === 0
                      ? 'text-gray-300 cursor-not-allowed'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-blue-600'
                  }`}
                  title="Move up"
                >
                  <ArrowUp className="w-4 h-4" />
                </button>
                <button
                  onClick={() => moveDown(type, index)}
                  disabled={index === currentSections.length - 1}
                  className={`p-2 rounded-lg transition-colors duration-200 ${
                    index === currentSections.length - 1
                      ? 'text-gray-300 cursor-not-allowed'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-blue-600'
                  }`}
                  title="Move down"
                >
                  <ArrowDown className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-gray-200/50 shadow-lg">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-4">
            <ArrowUpDown className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Section Order</h2>
          <p className="text-gray-600">Customize the order of sections in your resume and portfolio</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab('resume')}
              className={`px-6 py-2 rounded-md font-medium transition-all duration-200 ${
                activeTab === 'resume'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Resume Order
            </button>
            <button
              onClick={() => setActiveTab('portfolio')}
              className={`px-6 py-2 rounded-md font-medium transition-all duration-200 ${
                activeTab === 'portfolio'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Portfolio Order
            </button>
          </div>
        </div>

        {/* Section Lists */}
        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {activeTab === 'resume' ? 'Resume' : 'Portfolio'} Section Order
          </h3>
          <p className="text-gray-600 mb-6">
            Use the arrow buttons to reorder how sections appear in your {activeTab}. The order you set here will be reflected in the final output.
          </p>
          
          {renderSectionList(activeTab)}
        </div>

        <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center mt-0.5">
              <span className="text-white text-xs font-bold">i</span>
            </div>
            <div>
              <h4 className="font-medium text-blue-900 mb-1">Section Ordering Tips</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Personal information always appears first</li>
                <li>• Consider putting your strongest sections (experience/projects) near the top</li>
                <li>• Education typically goes after experience for experienced professionals</li>
                <li>• Skills can be placed strategically based on your field</li>
                <li>• Portfolio order can differ from resume order to highlight different strengths</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex justify-between mt-8">
          <button
            onClick={onBack}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
          >
            Back
          </button>
          <button
            onClick={onNext}
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Continue to Customization
          </button>
        </div>
      </div>
    </div>
  );
};