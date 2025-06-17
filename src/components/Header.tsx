import React from 'react';
import { User, Briefcase, GraduationCap, Code, Award, Eye, Zap, ArrowUpDown, Palette, ArrowLeft } from 'lucide-react';
import type { FormStep } from '../types';

interface HeaderProps {
  currentStep: FormStep;
  onStepChange: (step: FormStep) => void;
  onBackToDashboard?: () => void;
}

const steps: { key: FormStep; label: string; icon: React.ComponentType<any> }[] = [
  { key: 'personal', label: 'Personal', icon: User },
  { key: 'experience', label: 'Experience', icon: Briefcase },
  { key: 'education', label: 'Education', icon: GraduationCap },
  { key: 'projects', label: 'Projects', icon: Code },
  { key: 'skills', label: 'Skills', icon: Award },
  { key: 'order', label: 'Order', icon: ArrowUpDown },
  { key: 'customization', label: 'Style', icon: Palette },
  { key: 'preview', label: 'Preview', icon: Eye },
];

export const Header: React.FC<HeaderProps> = ({ currentStep, onStepChange, onBackToDashboard }) => {
  const currentIndex = steps.findIndex(step => step.key === currentStep);

  return (
    <header className="bg-white/90 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            {onBackToDashboard && (
              <button
                onClick={onBackToDashboard}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                title="Back to Dashboard"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                ResumeForge
              </h1>
              <p className="text-sm text-gray-600">Automated Resume & Portfolio Builder</p>
            </div>
          </div>
        </div>

        {/* Progress Steps - All steps are now clickable */}
        <div className="flex items-center justify-between overflow-x-auto pb-2">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = step.key === currentStep;
            const isCompleted = index < currentIndex;

            return (
              <React.Fragment key={step.key}>
                <button
                  onClick={() => onStepChange(step.key)}
                  className={`flex flex-col items-center space-y-2 p-3 rounded-lg transition-all duration-200 min-w-0 hover:scale-105 ${
                    isActive
                      ? 'bg-blue-100 text-blue-600 scale-105 shadow-md'
                      : isCompleted
                      ? 'text-green-600 hover:bg-green-50'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <div className={`p-2 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-blue-200 shadow-sm'
                      : isCompleted
                      ? 'bg-green-100'
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-medium hidden sm:block whitespace-nowrap">{step.label}</span>
                </button>
                
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-2 min-w-[20px] transition-colors duration-200 ${
                    index < currentIndex ? 'bg-green-400' : 'bg-gray-200'
                  }`} />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Navigation hint */}
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500">
            Click any step above to navigate freely between sections
          </p>
        </div>
      </div>
    </header>
  );
};