import React, { useState } from 'react';
import { Palette, Type, Paintbrush, Eye, Layers, Settings } from 'lucide-react';
import type { CustomizationSettings, GradientSettings, ResumeData } from '../types';

interface CustomizationFormProps {
  data: CustomizationSettings;
  resumeData: ResumeData;
  onChange: (data: CustomizationSettings) => void;
  onNext: () => void;
  onBack: () => void;
}

const fontOptions = [
  { value: 'Inter', label: 'Inter (Modern Sans-serif)' },
  { value: 'Poppins', label: 'Poppins (Friendly Sans-serif)' },
  { value: 'Source Sans Pro', label: 'Source Sans Pro (Clean Sans-serif)' },
  { value: 'Georgia', label: 'Georgia (Classic Serif)' },
  { value: 'Arial', label: 'Arial (Clean Sans-serif)' },
  { value: 'Times New Roman', label: 'Times New Roman (Traditional Serif)' },
  { value: 'Helvetica', label: 'Helvetica (Professional Sans-serif)' },
  { value: 'Roboto', label: 'Roboto (Google Sans-serif)' },
  { value: 'Playfair Display', label: 'Playfair Display (Elegant Serif)' },
  { value: 'Montserrat', label: 'Montserrat (Modern Sans-serif)' },
  { value: 'Lato', label: 'Lato (Friendly Sans-serif)' },
  { value: 'Open Sans', label: 'Open Sans (Readable Sans-serif)' }
];

const colorPresets = {
  professional: {
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
  creative: {
    mainHeaderText: '#7c3aed',
    sectionHeaderText: '#8b5cf6',
    subHeaderText: '#a78bfa',
    bodyText: '#4b5563',
    contactText: '#6b7280',
    dateText: '#9ca3af',
    linkText: '#8b5cf6',
    pageBackground: '#ffffff',
    headerBackground: '#faf5ff',
    sectionBackground: '#f3e8ff',
    cardBackground: '#ffffff',
    alternateBackground: '#faf5ff',
    primaryAccent: '#8b5cf6',
    secondaryAccent: '#a78bfa',
    borderColor: '#e9d5ff',
    dividerColor: '#d8b4fe',
    shadowColor: '#8b5cf620',
    hoverColor: '#7c3aed',
    activeColor: '#6d28d9'
  },
  modern: {
    mainHeaderText: '#0f172a',
    sectionHeaderText: '#1e293b',
    subHeaderText: '#334155',
    bodyText: '#475569',
    contactText: '#64748b',
    dateText: '#94a3b8',
    linkText: '#0ea5e9',
    pageBackground: '#ffffff',
    headerBackground: '#f8fafc',
    sectionBackground: '#f1f5f9',
    cardBackground: '#ffffff',
    alternateBackground: '#f8fafc',
    primaryAccent: '#0ea5e9',
    secondaryAccent: '#38bdf8',
    borderColor: '#cbd5e1',
    dividerColor: '#94a3b8',
    shadowColor: '#0f172a15',
    hoverColor: '#0284c7',
    activeColor: '#0369a1'
  },
  warm: {
    mainHeaderText: '#92400e',
    sectionHeaderText: '#b45309',
    subHeaderText: '#d97706',
    bodyText: '#78350f',
    contactText: '#92400e',
    dateText: '#a16207',
    linkText: '#f59e0b',
    pageBackground: '#fffbeb',
    headerBackground: '#fef3c7',
    sectionBackground: '#fde68a',
    cardBackground: '#ffffff',
    alternateBackground: '#fffbeb',
    primaryAccent: '#f59e0b',
    secondaryAccent: '#fbbf24',
    borderColor: '#fcd34d',
    dividerColor: '#f59e0b',
    shadowColor: '#92400e20',
    hoverColor: '#d97706',
    activeColor: '#b45309'
  }
};

const gradientPresets = [
  { name: 'Ocean Blue', gradient: { type: 'linear' as const, direction: '135deg', startColor: '#667eea', endColor: '#764ba2', opacity: 1 } },
  { name: 'Sunset', gradient: { type: 'linear' as const, direction: '45deg', startColor: '#ff7e5f', endColor: '#feb47b', opacity: 1 } },
  { name: 'Purple Rain', gradient: { type: 'linear' as const, direction: '90deg', startColor: '#667eea', endColor: '#764ba2', opacity: 1 } },
  { name: 'Green Forest', gradient: { type: 'linear' as const, direction: '180deg', startColor: '#11998e', endColor: '#38ef7d', opacity: 1 } },
  { name: 'Pink Dream', gradient: { type: 'linear' as const, direction: '45deg', startColor: '#ff9a9e', endColor: '#fecfef', opacity: 1 } },
  { name: 'Dark Night', gradient: { type: 'linear' as const, direction: '135deg', startColor: '#2c3e50', endColor: '#4a6741', opacity: 1 } },
  { name: 'Fire', gradient: { type: 'radial' as const, direction: 'circle', startColor: '#ff512f', endColor: '#dd2476', opacity: 1 } },
  { name: 'Cool Blue', gradient: { type: 'radial' as const, direction: 'ellipse', startColor: '#2196f3', endColor: '#21cbf3', opacity: 1 } }
];

// Default values to prevent undefined errors
const defaultSpacing = {
  sectionSpacing: '2rem',
  paragraphSpacing: '1rem',
  lineHeight: '1.6'
};

const defaultBorders = {
  borderRadius: '8px'
};

const defaultLayout = {
  heroHeight: '80vh',
  animationSpeed: '0.3s'
};

const defaultGradientSettings: GradientSettings = {
  type: 'linear',
  direction: '135deg',
  startColor: '#667eea',
  endColor: '#764ba2',
  opacity: 1
};

// Helper function to generate CSS gradient string
const generateGradientCSS = (gradient: GradientSettings): string => {
  if (gradient.type === 'solid') {
    return gradient.startColor;
  }
  
  const colors = gradient.midColor 
    ? `${gradient.startColor} 0%, ${gradient.midColor} 50%, ${gradient.endColor} 100%`
    : `${gradient.startColor} 0%, ${gradient.endColor} 100%`;
    
  if (gradient.type === 'linear') {
    return `linear-gradient(${gradient.direction}, ${colors})`;
  } else {
    return `radial-gradient(${gradient.direction}, ${colors})`;
  }
};

export const CustomizationForm: React.FC<CustomizationFormProps> = ({ data, resumeData, onChange, onNext, onBack }) => {
  const [activeTab, setActiveTab] = useState<'resume' | 'portfolio'>('resume');
  const [activeSection, setActiveSection] = useState<'typography' | 'colors' | 'layout'>('typography');
  const [previewMode, setPreviewMode] = useState(false);

const updateResumeSettings = (
  field: string,
  value: any,
  category: 'fonts' | 'colors' | 'spacing' | 'borders'
) => {
  const currentCategory = data?.resume?.[category] ?? {};
  onChange({
    ...data,
    resume: {
      ...data.resume,
      [category]: {
        ...currentCategory,
        [field]: value
      }
    }
  });
};


const updatePortfolioSettings = (
  field: string,
  value: any,
  category: 'fonts' | 'colors' | 'spacing' | 'borders' | 'layout'
) => {
  const currentPortfolio = data?.portfolio ?? {};
  const currentCategory = currentPortfolio[category] ?? {};

  onChange({
    ...data,
    portfolio: {
      ...currentPortfolio,
      [category]: {
        ...currentCategory,
        [field]: value
      }
    }
  });
};

const updateGradientSettings = (gradientSettings: GradientSettings) => {
  const currentPortfolio = data?.portfolio ?? {};
  const currentColors = currentPortfolio.colors ?? {};

  const heroBackground = generateGradientCSS(gradientSettings);

  onChange({
    ...data,
    portfolio: {
      ...currentPortfolio,
      colors: {
        ...currentColors,
        heroBackground,
        heroGradient: gradientSettings
      }
    }
  });
};

  const applyColorPreset = (preset: keyof typeof colorPresets, type: 'resume' | 'portfolio') => {
    const presetColors = colorPresets[preset];
    if (type === 'resume') {
      onChange({
        ...data,
        resume: {
          ...data.resume,
          colors: {
            ...data.resume.colors,
            ...presetColors
          }
        }
      });
    } else {
      onChange({
        ...data,
        portfolio: {
          ...data.portfolio,
          colors: {
            ...data.portfolio.colors,
            ...presetColors,
            heroBackground: preset === 'creative' 
              ? 'linear-gradient(135deg, #7c3aed 0%, #8b5cf6 100%)'
              : preset === 'modern'
              ? 'linear-gradient(135deg, #0f172a 0%, #475569 100%)'
              : preset === 'warm'
              ? 'linear-gradient(135deg, #92400e 0%, #f59e0b 100%)'
              : 'linear-gradient(135deg, #1f2937 0%, #2563eb 100%)',
            navigationBackground: '#ffffff',
            footerBackground: presetColors.mainHeaderText,
            projectCardBackground: '#ffffff',
            skillTagBackground: presetColors.sectionBackground,
            timelineAccent: presetColors.primaryAccent
          }
        }
      });
    }
  };

  const applyGradientPreset = (preset: typeof gradientPresets[0]) => {
    updateGradientSettings(preset.gradient);
  };

  const renderColorInput = (label: string, value: string, onChange: (value: string) => void, description?: string) => (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {description && <span className="text-xs text-gray-500 block">{description}</span>}
      </label>
      <div className="flex items-center space-x-3">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-12 h-10 border border-gray-300 rounded-lg cursor-pointer"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
          placeholder="#000000"
        />
      </div>
    </div>
  );

  const renderFontSelect = (label: string, value: string, onChange: (value: string) => void, description?: string) => (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {description && <span className="text-xs text-gray-500 block">{description}</span>}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        {fontOptions.map(font => (
          <option key={font.value} value={font.value} style={{ fontFamily: font.value }}>
            {font.label}
          </option>
        ))}
      </select>
    </div>
  );

  const renderGradientControls = () => {
    const gradient = data?.portfolio?.colors?.heroGradient ?? defaultGradientSettings;
    
    return (
      <div className="space-y-4">
        <h4 className="font-medium text-gray-900">Hero Background Gradient</h4>
        
        {/* Gradient Presets */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Quick Presets</label>
          <div className="grid grid-cols-2 gap-2">
            {gradientPresets.map((preset) => (
              <button
                key={preset.name}
                onClick={() => applyGradientPreset(preset)}
                className="p-2 border border-gray-200 rounded-lg hover:border-blue-400 transition-colors duration-200 text-left"
              >
                <div 
                  className="w-full h-8 rounded mb-1"
                  style={{ background: generateGradientCSS(preset.gradient) }}
                />
                <span className="text-xs font-medium">{preset.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Gradient Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Gradient Type</label>
          <select
            value={gradient.type}
            onChange={(e) => updateGradientSettings({
              ...gradient,
              type: e.target.value as 'linear' | 'radial' | 'solid'
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="solid">Solid Color</option>
            <option value="linear">Linear Gradient</option>
            <option value="radial">Radial Gradient</option>
          </select>
        </div>

        {/* Direction (for linear) or Shape (for radial) */}
        {gradient.type !== 'solid' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {gradient.type === 'linear' ? 'Direction' : 'Shape'}
            </label>
            {gradient.type === 'linear' ? (
              <select
                value={gradient.direction}
                onChange={(e) => updateGradientSettings({
                  ...gradient,
                  direction: e.target.value
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="0deg">Top to Bottom (0°)</option>
                <option value="45deg">Diagonal (45°)</option>
                <option value="90deg">Left to Right (90°)</option>
                <option value="135deg">Diagonal (135°)</option>
                <option value="180deg">Bottom to Top (180°)</option>
                <option value="225deg">Diagonal (225°)</option>
                <option value="270deg">Right to Left (270°)</option>
                <option value="315deg">Diagonal (315°)</option>
              </select>
            ) : (
              <select
                value={gradient.direction}
                onChange={(e) => updateGradientSettings({
                  ...gradient,
                  direction: e.target.value
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="circle">Circle</option>
                <option value="ellipse">Ellipse</option>
                <option value="circle at center">Circle at Center</option>
                <option value="circle at top">Circle at Top</option>
                <option value="circle at bottom">Circle at Bottom</option>
                <option value="ellipse at center">Ellipse at Center</option>
              </select>
            )}
          </div>
        )}

        {/* Colors */}
        <div className="grid grid-cols-2 gap-4">
          {renderColorInput(
            'Start Color',
            gradient.startColor,
            (value) => updateGradientSettings({
              ...gradient,
              startColor: value
            })
          )}
          
          {gradient.type !== 'solid' && renderColorInput(
            'End Color',
            gradient.endColor,
            (value) => updateGradientSettings({
              ...gradient,
              endColor: value
            })
          )}
        </div>

        {/* Optional Middle Color */}
        {gradient.type !== 'solid' && (
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <input
                type="checkbox"
                checked={!!gradient.midColor}
                onChange={(e) => updateGradientSettings({
                  ...gradient,
                  midColor: e.target.checked ? '#888888' : undefined
                })}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label className="text-sm font-medium text-gray-700">Add Middle Color</label>
            </div>
            {gradient.midColor && renderColorInput(
              'Middle Color',
              gradient.midColor,
              (value) => updateGradientSettings({
                ...gradient,
                midColor: value
              })
            )}
          </div>
        )}

        {/* Opacity */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Opacity: {Math.round(gradient.opacity * 100)}%
          </label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={gradient.opacity}
            onChange={(e) => updateGradientSettings({
              ...gradient,
              opacity: parseFloat(e.target.value)
            })}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        {/* Live Preview */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Preview</label>
          <div 
            className="w-full h-20 rounded-lg border border-gray-300"
            style={{ 
              background: generateGradientCSS(gradient),
              opacity: gradient.opacity
            }}
          />
        </div>
      </div>
    );
  };

  const currentSettings = activeTab === 'resume' ? data.resume : data.portfolio;
  const safeSpacing = currentSettings.spacing || defaultSpacing;
  const safeBorders = currentSettings.borders || defaultBorders;
  const safeLayout = (activeTab === 'portfolio' ? data.portfolio.layout : null) || defaultLayout;

  // Helper function to get sample data with fallbacks
  const getSampleExperience = () => {
    if (resumeData.experience.length > 0) {
      return resumeData.experience[0];
    }
    return {
      id: 'sample',
      position: 'Software Engineer',
      company: 'Tech Company Inc.',
      startDate: '2020-01',
      endDate: '2023-12',
      current: false,
      description: 'Developed and maintained web applications using modern technologies.',
      achievements: ['Improved application performance by 40%', 'Led a team of 3 developers']
    };
  };

  const getSampleProject = () => {
    if (resumeData.projects.length > 0) {
      return resumeData.projects[0];
    }
    return {
      id: 'sample',
      name: 'Portfolio Website',
      description: 'A responsive portfolio website built with React and TypeScript.',
      technologies: ['React', 'TypeScript', 'Tailwind CSS'],
      liveUrl: 'https://example.com',
      githubUrl: 'https://github.com/user/project'
    };
  };

  const getSampleSkills = () => {
    if (resumeData.skills.length > 0) {
      return resumeData.skills.slice(0, 4);
    }
    return [
      { name: 'JavaScript', level: 'Advanced' as const, category: 'Technical' as const },
      { name: 'React', level: 'Advanced' as const, category: 'Technical' as const },
      { name: 'Leadership', level: 'Intermediate' as const, category: 'Soft' as const },
      { name: 'English', level: 'Expert' as const, category: 'Language' as const }
    ];
  };

  const getSampleEducation = () => {
    if (resumeData.education.length > 0) {
      return resumeData.education[0];
    }
    return {
      id: 'sample',
      institution: 'University of Technology',
      degree: "Bachelor's Degree",
      field: 'Computer Science',
      startDate: '2016-09',
      endDate: '2020-05',
      gpa: '3.8/4.0',
      honors: 'Magna Cum Laude'
    };
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-gray-200/50 shadow-lg">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-4">
            <Palette className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Advanced Customization</h2>
          <p className="text-gray-600">Fine-tune every aspect of your resume and portfolio design</p>
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
              Resume Style
            </button>
            <button
              onClick={() => setActiveTab('portfolio')}
              className={`px-6 py-2 rounded-md font-medium transition-all duration-200 ${
                activeTab === 'portfolio'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Portfolio Style
            </button>
          </div>
        </div>

        {/* Section Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-gray-50 p-1 rounded-lg">
            <button
              onClick={() => setActiveSection('typography')}
              className={`px-4 py-2 rounded-md font-medium transition-all duration-200 flex items-center space-x-2 ${
                activeSection === 'typography'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Type className="w-4 h-4" />
              <span>Typography</span>
            </button>
            <button
              onClick={() => setActiveSection('colors')}
              className={`px-4 py-2 rounded-md font-medium transition-all duration-200 flex items-center space-x-2 ${
                activeSection === 'colors'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Paintbrush className="w-4 h-4" />
              <span>Colors</span>
            </button>
            <button
              onClick={() => setActiveSection('layout')}
              className={`px-4 py-2 rounded-md font-medium transition-all duration-200 flex items-center space-x-2 ${
                activeSection === 'layout'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Layout</span>
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Settings Panel */}
          <div className="space-y-6">
            {activeSection === 'typography' && (
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Type className="w-5 h-5 mr-2" />
                  Typography Settings
                </h3>
                <div className="space-y-4">
                  {renderFontSelect(
                    'Main Header Font',
                    currentSettings.fonts.mainHeader,
                    (value) => activeTab === 'resume' 
                      ? updateResumeSettings('mainHeader', value, 'fonts')
                      : updatePortfolioSettings('mainHeader', value, 'fonts'),
                    'Used for your name and main titles'
                  )}
                  {renderFontSelect(
                    'Section Headers Font',
                    currentSettings.fonts.sectionHeaders,
                    (value) => activeTab === 'resume'
                      ? updateResumeSettings('sectionHeaders', value, 'fonts')
                      : updatePortfolioSettings('sectionHeaders', value, 'fonts'),
                    'Used for section titles like "Experience", "Education"'
                  )}
                  {renderFontSelect(
                    'Sub Headers Font',
                    currentSettings.fonts.subHeaders,
                    (value) => activeTab === 'resume'
                      ? updateResumeSettings('subHeaders', value, 'fonts')
                      : updatePortfolioSettings('subHeaders', value, 'fonts'),
                    'Used for job titles, company names'
                  )}
                  {renderFontSelect(
                    'Body Text Font',
                    currentSettings.fonts.bodyText,
                    (value) => activeTab === 'resume'
                      ? updateResumeSettings('bodyText', value, 'fonts')
                      : updatePortfolioSettings('bodyText', value, 'fonts'),
                    'Used for descriptions and paragraphs'
                  )}
                  {renderFontSelect(
                    'Contact Info Font',
                    currentSettings.fonts.contactInfo,
                    (value) => activeTab === 'resume'
                      ? updateResumeSettings('contactInfo', value, 'fonts')
                      : updatePortfolioSettings('contactInfo', value, 'fonts'),
                    'Used for email, phone, location'
                  )}
                  {renderFontSelect(
                    'Dates Font',
                    currentSettings.fonts.dates,
                    (value) => activeTab === 'resume'
                      ? updateResumeSettings('dates', value, 'fonts')
                      : updatePortfolioSettings('dates', value, 'fonts'),
                    'Used for employment dates, education dates'
                  )}
                </div>
              </div>
            )}

            {activeSection === 'colors' && (
              <>
                {/* Color Presets */}
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Paintbrush className="w-5 h-5 mr-2" />
                    Color Presets
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {Object.entries(colorPresets).map(([key, preset]) => (
                      <button
                        key={key}
                        onClick={() => applyColorPreset(key as keyof typeof colorPresets, activeTab)}
                        className="p-3 border border-gray-200 rounded-lg hover:border-blue-400 transition-colors duration-200 text-left"
                      >
                        <div className="flex items-center space-x-2 mb-2">
                          <div 
                            className="w-4 h-4 rounded-full" 
                            style={{ backgroundColor: preset.primaryAccent }}
                          />
                          <span className="font-medium capitalize">{key}</span>
                        </div>
                        <div className="flex space-x-1">
                          <div className="w-3 h-3 rounded" style={{ backgroundColor: preset.mainHeaderText }} />
                          <div className="w-3 h-3 rounded" style={{ backgroundColor: preset.bodyText }} />
                          <div className="w-3 h-3 rounded" style={{ backgroundColor: preset.pageBackground }} />
                          <div className="w-3 h-3 rounded" style={{ backgroundColor: preset.sectionBackground }} />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Portfolio Gradient Settings */}
                {activeTab === 'portfolio' && (
                  <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                    {renderGradientControls()}
                  </div>
                )}

                {/* Text Colors */}
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Text Colors</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {renderColorInput(
                      'Main Header Text',
                      currentSettings.colors.mainHeaderText,
                      (value) => activeTab === 'resume'
                        ? updateResumeSettings('mainHeaderText', value, 'colors')
                        : updatePortfolioSettings('mainHeaderText', value, 'colors'),
                      'Your name and main titles'
                    )}
                    {renderColorInput(
                      'Section Header Text',
                      currentSettings.colors.sectionHeaderText,
                      (value) => activeTab === 'resume'
                        ? updateResumeSettings('sectionHeaderText', value, 'colors')
                        : updatePortfolioSettings('sectionHeaderText', value, 'colors'),
                      'Section titles like "Experience"'
                    )}
                    {renderColorInput(
                      'Sub Header Text',
                      currentSettings.colors.subHeaderText,
                      (value) => activeTab === 'resume'
                        ? updateResumeSettings('subHeaderText', value, 'colors')
                        : updatePortfolioSettings('subHeaderText', value, 'colors'),
                      'Job titles, company names'
                    )}
                    {renderColorInput(
                      'Body Text',
                      currentSettings.colors.bodyText,
                      (value) => activeTab === 'resume'
                        ? updateResumeSettings('bodyText', value, 'colors')
                        : updatePortfolioSettings('bodyText', value, 'colors'),
                      'Descriptions and paragraphs'
                    )}
                    {renderColorInput(
                      'Contact Text',
                      currentSettings.colors.contactText,
                      (value) => activeTab === 'resume'
                        ? updateResumeSettings('contactText', value, 'colors')
                        : updatePortfolioSettings('contactText', value, 'colors'),
                      'Email, phone, location'
                    )}
                    {renderColorInput(
                      'Date Text',
                      currentSettings.colors.dateText,
                      (value) => activeTab === 'resume'
                        ? updateResumeSettings('dateText', value, 'colors')
                        : updatePortfolioSettings('dateText', value, 'colors'),
                      'Employment and education dates'
                    )}
                    {renderColorInput(
                      'Link Text',
                      currentSettings.colors.linkText,
                      (value) => activeTab === 'resume'
                        ? updateResumeSettings('linkText', value, 'colors')
                        : updatePortfolioSettings('linkText', value, 'colors'),
                      'Clickable links and URLs'
                    )}
                  </div>
                </div>

                {/* Background Colors */}
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Background Colors</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {renderColorInput(
                      'Page Background',
                      currentSettings.colors.pageBackground,
                      (value) => activeTab === 'resume'
                        ? updateResumeSettings('pageBackground', value, 'colors')
                        : updatePortfolioSettings('pageBackground', value, 'colors'),
                      'Main page background'
                    )}
                    {renderColorInput(
                      'Header Background',
                      currentSettings.colors.headerBackground,
                      (value) => activeTab === 'resume'
                        ? updateResumeSettings('headerBackground', value, 'colors')
                        : updatePortfolioSettings('headerBackground', value, 'colors'),
                      'Header section background'
                    )}
                    {renderColorInput(
                      'Section Background',
                      currentSettings.colors.sectionBackground,
                      (value) => activeTab === 'resume'
                        ? updateResumeSettings('sectionBackground', value, 'colors')
                        : updatePortfolioSettings('sectionBackground', value, 'colors'),
                      'Individual section backgrounds'
                    )}
                    {renderColorInput(
                      'Card Background',
                      currentSettings.colors.cardBackground,
                      (value) => activeTab === 'resume'
                        ? updateResumeSettings('cardBackground', value, 'colors')
                        : updatePortfolioSettings('cardBackground', value, 'colors'),
                      'Cards and content boxes'
                    )}
                    {renderColorInput(
                      'Alternate Background',
                      currentSettings.colors.alternateBackground,
                      (value) => activeTab === 'resume'
                        ? updateResumeSettings('alternateBackground', value, 'colors')
                        : updatePortfolioSettings('alternateBackground', value, 'colors'),
                      'Alternating section backgrounds'
                    )}
                  </div>
                </div>

                {/* Accent & Border Colors */}
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Accent & Border Colors</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {renderColorInput(
                      'Primary Accent',
                      currentSettings.colors.primaryAccent,
                      (value) => activeTab === 'resume'
                        ? updateResumeSettings('primaryAccent', value, 'colors')
                        : updatePortfolioSettings('primaryAccent', value, 'colors'),
                      'Main accent color for highlights'
                    )}
                    {renderColorInput(
                      'Secondary Accent',
                      currentSettings.colors.secondaryAccent,
                      (value) => activeTab === 'resume'
                        ? updateResumeSettings('secondaryAccent', value, 'colors')
                        : updatePortfolioSettings('secondaryAccent', value, 'colors'),
                      'Secondary accent for variety'
                    )}
                    {renderColorInput(
                      'Border Color',
                      currentSettings.colors.borderColor,
                      (value) => activeTab === 'resume'
                        ? updateResumeSettings('borderColor', value, 'colors')
                        : updatePortfolioSettings('borderColor', value, 'colors'),
                      'Borders around elements'
                    )}
                    {renderColorInput(
                      'Divider Color',
                      currentSettings.colors.dividerColor,
                      (value) => activeTab === 'resume'
                        ? updateResumeSettings('dividerColor', value, 'colors')
                        : updatePortfolioSettings('dividerColor', value, 'colors'),
                      'Lines and dividers'
                    )}
                    {renderColorInput(
                      'Shadow Color',
                      currentSettings.colors.shadowColor,
                      (value) => activeTab === 'resume'
                        ? updateResumeSettings('shadowColor', value, 'colors')
                        : updatePortfolioSettings('shadowColor', value, 'colors'),
                      'Drop shadows and depth'
                    )}
                    {renderColorInput(
                      'Hover Color',
                      currentSettings.colors.hoverColor,
                      (value) => activeTab === 'resume'
                        ? updateResumeSettings('hoverColor', value, 'colors')
                        : updatePortfolioSettings('hoverColor', value, 'colors'),
                      'Hover state for interactive elements'
                    )}
                    {renderColorInput(
                      'Active Color',
                      currentSettings.colors.activeColor,
                      (value) => activeTab === 'resume'
                        ? updateResumeSettings('activeColor', value, 'colors')
                        : updatePortfolioSettings('activeColor', value, 'colors'),
                      'Active/pressed state for buttons'
                    )}
                  </div>
                </div>
              </>
            )}

            {activeSection === 'layout' && (
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Settings className="w-5 h-5 mr-2" />
                  Layout Settings
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Section Spacing
                    </label>
                    <select
                      value={safeSpacing.sectionSpacing}
                      onChange={(e) => activeTab === 'resume'
                        ? updateResumeSettings('sectionSpacing', e.target.value, 'spacing')
                        : updatePortfolioSettings('sectionSpacing', e.target.value, 'spacing')
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="1rem">Compact (1rem)</option>
                      <option value="2rem">Normal (2rem)</option>
                      <option value="3rem">Spacious (3rem)</option>
                      <option value="4rem">Very Spacious (4rem)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Paragraph Spacing
                    </label>
                    <select
                      value={safeSpacing.paragraphSpacing}
                      onChange={(e) => activeTab === 'resume'
                        ? updateResumeSettings('paragraphSpacing', e.target.value, 'spacing')
                        : updatePortfolioSettings('paragraphSpacing', e.target.value, 'spacing')
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="0.5rem">Tight (0.5rem)</option>
                      <option value="1rem">Normal (1rem)</option>
                      <option value="1.5rem">Relaxed (1.5rem)</option>
                      <option value="2rem">Loose (2rem)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Line Height
                    </label>
                    <select
                      value={safeSpacing.lineHeight}
                      onChange={(e) => activeTab === 'resume'
                        ? updateResumeSettings('lineHeight', e.target.value, 'spacing')
                        : updatePortfolioSettings('lineHeight', e.target.value, 'spacing')
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="1.4">Tight (1.4)</option>
                      <option value="1.6">Normal (1.6)</option>
                      <option value="1.8">Relaxed (1.8)</option>
                      <option value="2.0">Loose (2.0)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Border Radius
                    </label>
                    <select
                      value={safeBorders.borderRadius}
                      onChange={(e) => activeTab === 'resume'
                        ? updateResumeSettings('borderRadius', e.target.value, 'borders')
                        : updatePortfolioSettings('borderRadius', e.target.value, 'borders')
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="0px">Sharp (0px)</option>
                      <option value="4px">Slightly Rounded (4px)</option>
                      <option value="8px">Rounded (8px)</option>
                      <option value="12px">Very Rounded (12px)</option>
                      <option value="16px">Highly Rounded (16px)</option>
                    </select>
                  </div>

                  {activeTab === 'portfolio' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Hero Section Height
                        </label>
                        <select
                          value={safeLayout.heroHeight}
                          onChange={(e) => updatePortfolioSettings('heroHeight', e.target.value, 'layout')}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="60vh">Compact (60vh)</option>
                          <option value="80vh">Medium (80vh)</option>
                          <option value="100vh">Full Screen (100vh)</option>
                          <option value="120vh">Extended (120vh)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Animation Speed
                        </label>
                        <select
                          value={safeLayout.animationSpeed}
                          onChange={(e) => updatePortfolioSettings('animationSpeed', e.target.value, 'layout')}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="0.1s">Very Fast (0.1s)</option>
                          <option value="0.2s">Fast (0.2s)</option>
                          <option value="0.3s">Normal (0.3s)</option>
                          <option value="0.5s">Slow (0.5s)</option>
                          <option value="0.8s">Very Slow (0.8s)</option>
                        </select>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Preview Panel */}
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Eye className="w-5 h-5 mr-2" />
                Live Preview
              </h3>
              <button
                onClick={() => setPreviewMode(!previewMode)}
                className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors duration-200"
              >
                {previewMode ? 'Compact' : 'Full'}
              </button>
            </div>
            
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              {activeTab === 'resume' ? (
                <div 
                  className="p-6 space-y-4"
                  style={{ 
                    backgroundColor: currentSettings.colors.pageBackground,
                    fontFamily: currentSettings.fonts.bodyText,
                    lineHeight: safeSpacing.lineHeight
                  }}
                >
                  <div className="text-center">
                    <h1 
                      className="text-2xl font-bold mb-2"
                      style={{ 
                        color: currentSettings.colors.mainHeaderText,
                        fontFamily: currentSettings.fonts.mainHeader
                      }}
                    >
                      {resumeData.personalInfo.fullName || 'Your Name'}
                    </h1>
                    <p style={{ 
                      color: currentSettings.colors.contactText,
                      fontFamily: currentSettings.fonts.contactInfo
                    }}>
                      {resumeData.personalInfo.email || 'your@email.com'} | {resumeData.personalInfo.phone || '(555) 123-4567'}
                    </p>
                  </div>
                  
                  <div 
                    className="p-4 rounded-lg"
                    style={{ 
                      backgroundColor: currentSettings.colors.sectionBackground,
                      borderRadius: safeBorders.borderRadius,
                      marginBottom: safeSpacing.sectionSpacing
                    }}
                  >
                    <h2 
                      className="text-lg font-semibold mb-2 pb-1 border-b-2"
                      style={{ 
                        color: currentSettings.colors.sectionHeaderText,
                        fontFamily: currentSettings.fonts.sectionHeaders,
                        borderColor: currentSettings.colors.primaryAccent,
                        marginBottom: safeSpacing.paragraphSpacing
                      }}
                    >
                      Experience
                    </h2>
                    <div className="space-y-2">
                      {(() => {
                        const exp = getSampleExperience();
                        return (
                          <>
                            <h3 
                              className="font-medium"
                              style={{ 
                                color: currentSettings.colors.subHeaderText,
                                fontFamily: currentSettings.fonts.subHeaders
                              }}
                            >
                              {exp.position}
                            </h3>
                            <p 
                              className="text-sm"
                              style={{ 
                                color: currentSettings.colors.dateText,
                                fontFamily: currentSettings.fonts.dates
                              }}
                            >
                              {exp.company} • {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                            </p>
                            <p 
                              className="text-sm"
                              style={{ 
                                color: currentSettings.colors.bodyText,
                                marginBottom: safeSpacing.paragraphSpacing
                              }}
                            >
                              {exp.description}
                            </p>
                          </>
                        );
                      })()}
                    </div>
                  </div>

                  {/* Projects Section */}
                  <div 
                    className="p-4 rounded-lg"
                    style={{ 
                      backgroundColor: currentSettings.colors.cardBackground,
                      borderRadius: safeBorders.borderRadius,
                      border: `1px solid ${currentSettings.colors.borderColor}`
                    }}
                  >
                    <h2 
                      className="text-lg font-semibold mb-2"
                      style={{ 
                        color: currentSettings.colors.sectionHeaderText,
                        fontFamily: currentSettings.fonts.sectionHeaders
                      }}
                    >
                      Projects
                    </h2>
                    {(() => {
                      const project = getSampleProject();
                      return (
                        <>
                          <h3 
                            className="font-medium mb-1"
                            style={{ 
                              color: currentSettings.colors.subHeaderText,
                              fontFamily: currentSettings.fonts.subHeaders
                            }}
                          >
                            {project.name}
                          </h3>
                          <p 
                            className="text-sm mb-2"
                            style={{ 
                              color: currentSettings.colors.bodyText,
                              lineHeight: safeSpacing.lineHeight
                            }}
                          >
                            {project.description}
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {project.technologies.slice(0, 3).map((tech) => (
                              <span
                                key={tech}
                                className="px-2 py-1 rounded-full text-xs"
                                style={{ 
                                  backgroundColor: currentSettings.colors.primaryAccent + '20',
                                  color: currentSettings.colors.primaryAccent
                                }}
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        </>
                      );
                    })()}
                  </div>

                  {/* Skills Section */}
                  <div>
                    <h2 
                      className="text-lg font-semibold mb-2"
                      style={{ 
                        color: currentSettings.colors.sectionHeaderText,
                        fontFamily: currentSettings.fonts.sectionHeaders
                      }}
                    >
                      Skills
                    </h2>
                    <div className="flex flex-wrap gap-2">
                      {getSampleSkills().map((skill, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 rounded-full text-sm"
                          style={{ 
                            backgroundColor: currentSettings.colors.sectionBackground,
                            color: currentSettings.colors.bodyText,
                            border: `1px solid ${currentSettings.colors.borderColor}`,
                            borderRadius: safeBorders.borderRadius
                          }}
                        >
                          {skill.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{ fontFamily: currentSettings.fonts.bodyText }}>
                  <div 
                    className="p-6 text-center text-white"
                    style={{ 
                      background: data?.portfolio?.colors?.heroBackground || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      opacity: data?.portfolio?.colors?.heroGradient?.opacity || 1
                    }}
                  >
                    <h1 
                      className="text-2xl font-bold mb-2"
                      style={{ 
                        color: currentSettings.colors.mainHeaderText,
                        fontFamily: currentSettings.fonts.mainHeader
                      }}
                    >
                      {resumeData.personalInfo.fullName || 'Your Name'}
                    </h1>
                    <p className="opacity-90">
                      {resumeData.personalInfo.summary || 'Professional Portfolio'}
                    </p>
                  </div>
                  
                  <div 
                    className="p-6"
                    style={{ backgroundColor: currentSettings.colors.pageBackground }}
                  >
                    <div 
                      className="p-4 rounded-lg mb-4"
                      style={{ 
                        backgroundColor: currentSettings.colors.cardBackground,
                        borderRadius: safeBorders.borderRadius
                      }}
                    >
                      <h2 
                        className="text-lg font-semibold mb-2"
                        style={{ 
                          color: currentSettings.colors.sectionHeaderText,
                          fontFamily: currentSettings.fonts.sectionHeaders
                        }}
                      >
                        About Me
                      </h2>
                      <p style={{ 
                        color: currentSettings.colors.bodyText,
                        lineHeight: safeSpacing.lineHeight
                      }}>
                        {resumeData.personalInfo.summary || 'Passionate developer with expertise in modern web technologies.'}
                      </p>
                    </div>

                    {/* Featured Project */}
                    <div 
                      className="p-4 rounded-lg"
                      style={{ 
                        backgroundColor: currentSettings.colors.sectionBackground,
                        borderRadius: safeBorders.borderRadius
                      }}
                    >
                      <h2 
                        className="text-lg font-semibold mb-2"
                        style={{ 
                          color: currentSettings.colors.sectionHeaderText,
                          fontFamily: currentSettings.fonts.sectionHeaders
                        }}
                      >
                        Featured Project
                      </h2>
                      {(() => {
                        const project = getSampleProject();
                        return (
                          <>
                            <h3 
                              className="font-medium mb-1"
                              style={{ 
                                color: currentSettings.colors.subHeaderText,
                                fontFamily: currentSettings.fonts.subHeaders
                              }}
                            >
                              {project.name}
                            </h3>
                            <p 
                              className="text-sm mb-2"
                              style={{ 
                                color: currentSettings.colors.bodyText,
                                lineHeight: safeSpacing.lineHeight
                              }}
                            >
                              {project.description}
                            </p>
                            <div className="flex flex-wrap gap-1">
                              {project.technologies.slice(0, 3).map((tech) => (
                                <span
                                  key={tech}
                                  className="px-2 py-1 rounded-full text-xs"
                                  style={{ 
                                    backgroundColor: currentSettings.colors.primaryAccent + '20',
                                    color: currentSettings.colors.primaryAccent
                                  }}
                                >
                                  {tech}
                                </span>
                              ))}
                            </div>
                          </>
                        );
                      })()}
                    </div>
                  </div>
                </div>
              )}
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
            Continue to Preview
          </button>
        </div>
      </div>
    </div>
  );
};