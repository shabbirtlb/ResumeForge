import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AuthPage } from './components/auth/AuthPage';
import { Dashboard } from './components/dashboard/Dashboard';
import { Header } from './components/Header';
import { PersonalInfoForm } from './components/forms/PersonalInfoForm';
import { ExperienceForm } from './components/forms/ExperienceForm';
import { EducationForm } from './components/forms/EducationForm';
import { ProjectsForm } from './components/forms/ProjectsForm';
import { SkillsForm } from './components/forms/SkillsForm';
import { SectionOrderForm } from './components/SectionOrderForm';
import { CustomizationForm } from './components/CustomizationForm';
import { PreviewSection } from './components/PreviewSection';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useResumeStorage } from './hooks/useResumeStorage';
import type { ResumeData, FormStep } from './types';

const initialData: ResumeData = {
  personalInfo: {
    fullName: '',
    email: '',
    phone: '',
    location: '',
    website: '',
    linkedin: '',
    github: '',
    summary: ''
  },
  experience: [],
  education: [],
  projects: [],
  skills: [],
  sectionOrder: {
    resume: ['experience', 'education', 'projects', 'skills'],
    portfolio: ['experience', 'projects', 'skills', 'education']
  },
  customization: {
    resume: {
      fonts: {
        mainHeader: 'Inter',
        sectionHeaders: 'Inter',
        subHeaders: 'Inter',
        bodyText: 'Inter',
        contactInfo: 'Inter',
        dates: 'Inter'
      },
      colors: {
        mainHeaderText: '#1f2937',
        sectionHeaderText: '#374151',
        subHeaderText: '#4b5563',
        bodyText: '#6b7280',
        contactText: '#6b7280',
        dateText: '#9ca3af',
        linkText: '#2563eb',
        pageBackground: '#ffffff',
        headerBackground: '#f9fafb',
        sectionBackground: '#f3f4f6',
        cardBackground: '#ffffff',
        alternateBackground: '#f8fafc',
        primaryAccent: '#2563eb',
        secondaryAccent: '#3b82f6',
        borderColor: '#e5e7eb',
        dividerColor: '#d1d5db',
        shadowColor: '#00000010',
        hoverColor: '#1d4ed8',
        activeColor: '#1e40af'
      },
      spacing: {
        sectionSpacing: '2rem',
        paragraphSpacing: '1rem',
        lineHeight: '1.6'
      },
      borders: {
        sectionBorderWidth: '1px',
        dividerStyle: 'solid',
        borderRadius: '8px'
      }
    },
    portfolio: {
      fonts: {
        mainHeader: 'Inter',
        sectionHeaders: 'Inter',
        subHeaders: 'Inter',
        bodyText: 'Inter',
        contactInfo: 'Inter',
        dates: 'Inter'
      },
      colors: {
        mainHeaderText: '#ffffff',
        sectionHeaderText: '#1f2937',
        subHeaderText: '#374151',
        bodyText: '#4b5563',
        contactText: '#6b7280',
        dateText: '#9ca3af',
        linkText: '#2563eb',
        pageBackground: '#ffffff',
        headerBackground: '#f9fafb',
        sectionBackground: '#f8fafc',
        cardBackground: '#ffffff',
        alternateBackground: '#f1f5f9',
        primaryAccent: '#2563eb',
        secondaryAccent: '#3b82f6',
        borderColor: '#e2e8f0',
        dividerColor: '#cbd5e1',
        shadowColor: '#00000015',
        hoverColor: '#1d4ed8',
        activeColor: '#1e40af',
        heroBackground: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        heroGradient: {
          type: 'linear',
          direction: '135deg',
          startColor: '#667eea',
          endColor: '#764ba2',
          opacity: 1
        },
        heroOverlay: '#00000020',
        navigationBackground: '#ffffff',
        footerBackground: '#1f2937',
        projectCardBackground: '#ffffff',
        skillTagBackground: '#f1f5f9',
        timelineAccent: '#2563eb'
      },
      spacing: {
        sectionSpacing: '4rem',
        paragraphSpacing: '1.5rem',
        lineHeight: '1.7'
      },
      borders: {
        sectionBorderWidth: '0px',
        dividerStyle: 'solid',
        borderRadius: '12px'
      },
      layout: {
        heroHeight: '100vh',
        cardShadow: '0 10px 25px rgba(0,0,0,0.1)',
        animationSpeed: '0.3s'
      }
    }
  }
};

function AppContent() {
  const { isAuthenticated, isLoading } = useAuth();
  const [currentStep, setCurrentStep] = useState<FormStep>('personal');
  const [resumeData, setResumeData] = useLocalStorage<ResumeData>('resume-data', initialData);
  const [isInBuilder, setIsInBuilder] = useState(false);
  const { saveResume } = useResumeStorage();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AuthPage />;
  }

  const handleCreateNew = () => {
    setResumeData(initialData);
    setCurrentStep('personal');
    setIsInBuilder(true);
  };

  const handleEditResume = (data: ResumeData) => {
    setResumeData(data);
    setCurrentStep('personal');
    setIsInBuilder(true);
  };

  const handleBackToDashboard = () => {
    setIsInBuilder(false);
    setCurrentStep('personal');
  };

  const handleStepChange = (step: FormStep) => {
    setCurrentStep(step);
  };

  const handleNext = () => {
    const steps: FormStep[] = ['personal', 'experience', 'education', 'projects', 'skills', 'order', 'customization', 'preview'];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
    }
  };

  const handleBack = () => {
    const steps: FormStep[] = ['personal', 'experience', 'education', 'projects', 'skills', 'order', 'customization', 'preview'];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
    }
  };

  const handleSkipToStyling = () => {
    setCurrentStep('customization');
  };

  const handleSave = async () => {
    try {
      const title = resumeData.personalInfo.fullName 
        ? `${resumeData.personalInfo.fullName} - Resume`
        : 'Untitled Resume';
      
      await saveResume(title, resumeData);
      alert('Your resume has been saved successfully!');
    } catch (error) {
      alert('Failed to save resume. Please try again.');
    }
  };

  if (!isInBuilder) {
    return (
      <Dashboard 
        onCreateNew={handleCreateNew}
        onEditResume={handleEditResume}
      />
    );
  }

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'personal':
        return (
          <PersonalInfoForm
            data={resumeData.personalInfo}
            onChange={(personalInfo) => setResumeData({ ...resumeData, personalInfo })}
            onNext={handleNext}
            onSkipToStyling={handleSkipToStyling}
          />
        );
      case 'experience':
        return (
          <ExperienceForm
            data={resumeData.experience}
            onChange={(experience) => setResumeData({ ...resumeData, experience })}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 'education':
        return (
          <EducationForm
            data={resumeData.education}
            onChange={(education) => setResumeData({ ...resumeData, education })}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 'projects':
        return (
          <ProjectsForm
            data={resumeData.projects}
            onChange={(projects) => setResumeData({ ...resumeData, projects })}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 'skills':
        return (
          <SkillsForm
            data={resumeData.skills}
            onChange={(skills) => setResumeData({ ...resumeData, skills })}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 'order':
        return (
          <SectionOrderForm
            data={resumeData.sectionOrder}
            onChange={(sectionOrder) => setResumeData({ ...resumeData, sectionOrder })}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 'customization':
        return (
          <CustomizationForm
            data={resumeData.customization}
            onChange={(customization) => setResumeData({ ...resumeData, customization })}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 'preview':
        return (
          <PreviewSection
            data={resumeData}
            onBack={handleBack}
            onSave={handleSave}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Header 
        currentStep={currentStep} 
        onStepChange={handleStepChange}
        onBackToDashboard={handleBackToDashboard}
      />
      
      <main className="container mx-auto px-4 py-8">
        {renderCurrentStep()}
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;