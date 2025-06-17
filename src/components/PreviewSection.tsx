import React, { useState, useRef } from 'react';
import { Download, Globe, FileText, Share2, Save, Upload } from 'lucide-react';
import { generateResumePDFFromPreview, exportToJSON } from '../utils/pdfGenerator';
import { downloadPortfolioFromPreview } from '../utils/portfolioGenerator';
import type { ResumeData } from '../types';

interface PreviewSectionProps {
  data: ResumeData;
  onBack: () => void;
  onSave: () => void;
}

export const PreviewSection: React.FC<PreviewSectionProps> = ({
  data,
  onBack,
  onSave
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState<'resume' | 'portfolio'>('resume');
  const portfolioPreviewRef = useRef<HTMLDivElement>(null);
  const resumePreviewRef = useRef<HTMLDivElement>(null);

  const handleDownloadPDF = async () => {
    if (!resumePreviewRef.current) {
      alert('Resume preview not available. Please try again.');
      return;
    }

    try {
      setIsGenerating(true);
      await generateResumePDFFromPreview(resumePreviewRef.current, data.personalInfo.fullName);
    } catch (error) {
      console.error('Failed to generate PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadPortfolio = () => {
    if (portfolioPreviewRef.current) {
      try {
        downloadPortfolioFromPreview(portfolioPreviewRef.current, data.personalInfo.fullName);
      } catch (error) {
        console.error('Failed to download portfolio:', error);
        alert('Failed to download portfolio. Please try again.');
      }
    } else {
      alert('Portfolio preview not available. Please try again.');
    }
  };

  const handleExportJSON = () => {
    exportToJSON(data);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${data.personalInfo.fullName} - Resume`,
          text: `Check out ${data.personalInfo.fullName}'s professional resume and portfolio`,
        });
      } catch (error) {
        console.error('Error sharing:', error);
        // Fallback: copy to clipboard when share fails
        const text = `${data.personalInfo.fullName} - Professional Resume\n\n${data.personalInfo.summary}`;
        navigator.clipboard.writeText(text);
        alert('Resume summary copied to clipboard!');
      }
    } else {
      // Fallback: copy to clipboard when share is not supported
      const text = `${data.personalInfo.fullName} - Professional Resume\n\n${data.personalInfo.summary}`;
      navigator.clipboard.writeText(text);
      alert('Resume summary copied to clipboard!');
    }
  };

  const renderSectionByOrder = (sections: string[], type: 'resume' | 'portfolio') => {
    const customization = type === 'resume' ? data.customization.resume : data.customization.portfolio;
    
    // Safe fallbacks for borders and spacing
    const safeBorders = customization.borders || { borderRadius: '8px' };
    const safeSpacing = customization.spacing || { 
      sectionSpacing: '2rem', 
      paragraphSpacing: '1rem', 
      lineHeight: '1.6' 
    };
    
    return sections.map(sectionId => {
      switch (sectionId) {
        case 'experience':
          return data.experience.length > 0 ? (
            <div key="experience" className="mb-8">
              <h2 
                className="text-2xl font-bold mb-4 border-b-2 pb-2"
                style={{ 
                  color: customization.colors.sectionHeaderText,
                  fontFamily: customization.fonts.sectionHeaders,
                  borderColor: customization.colors.primaryAccent,
                  marginBottom: safeSpacing.sectionSpacing
                }}
              >
                Experience
              </h2>
              <div className="space-y-6">
                {data.experience.map((exp) => (
                  <div 
                    key={exp.id}
                    style={{ marginBottom: safeSpacing.paragraphSpacing }}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 
                          className="text-lg font-semibold"
                          style={{ 
                            color: customization.colors.subHeaderText,
                            fontFamily: customization.fonts.subHeaders
                          }}
                        >
                          {exp.position}
                        </h3>
                        <p 
                          className="italic"
                          style={{ 
                            color: customization.colors.bodyText,
                            fontFamily: customization.fonts.bodyText
                          }}
                        >
                          {exp.company}
                        </p>
                      </div>
                      <span 
                        className="text-sm"
                        style={{ 
                          color: customization.colors.dateText,
                          fontFamily: customization.fonts.dates
                        }}
                      >
                        {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                      </span>
                    </div>
                    <p 
                      className="mb-2"
                      style={{ 
                        color: customization.colors.bodyText,
                        lineHeight: safeSpacing.lineHeight
                      }}
                    >
                      {exp.description}
                    </p>
                    {exp.achievements.length > 0 && (
                      <ul 
                        className="list-disc list-inside space-y-1"
                        style={{ 
                          color: customization.colors.bodyText,
                          lineHeight: safeSpacing.lineHeight
                        }}
                      >
                        {exp.achievements.map((achievement, index) => (
                          <li key={index}>{achievement}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : null;

        case 'projects':
          return data.projects.length > 0 ? (
            <div key="projects" className="mb-8">
              <h2 
                className="text-2xl font-bold mb-4 border-b-2 pb-2"
                style={{ 
                  color: customization.colors.sectionHeaderText,
                  fontFamily: customization.fonts.sectionHeaders,
                  borderColor: customization.colors.primaryAccent,
                  marginBottom: safeSpacing.sectionSpacing
                }}
              >
                Projects
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {data.projects.map((project) => (
                  <div 
                    key={project.id} 
                    className="border rounded-lg p-4"
                    style={{ 
                      borderColor: customization.colors.borderColor,
                      backgroundColor: customization.colors.cardBackground,
                      borderRadius: safeBorders.borderRadius
                    }}
                  >
                    <h3 
                      className="text-lg font-semibold mb-2"
                      style={{ 
                        color: customization.colors.subHeaderText,
                        fontFamily: customization.fonts.subHeaders
                      }}
                    >
                      {project.name}
                    </h3>
                    <p 
                      className="mb-3"
                      style={{ 
                        color: customization.colors.bodyText,
                        lineHeight: safeSpacing.lineHeight
                      }}
                    >
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {project.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="px-2 py-1 rounded-full text-xs"
                          style={{ 
                            backgroundColor: customization.colors.primaryAccent + '20',
                            color: customization.colors.primaryAccent
                          }}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                    <div className="flex space-x-4 text-sm">
                      {project.liveUrl && (
                        <a 
                          href={project.liveUrl} 
                          className="hover:underline"
                          style={{ color: customization.colors.linkText }}
                        >
                          Live Demo
                        </a>
                      )}
                      {project.githubUrl && (
                        <a 
                          href={project.githubUrl} 
                          className="hover:underline"
                          style={{ color: customization.colors.linkText }}
                        >
                          GitHub
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : null;

        case 'skills':
          return data.skills.length > 0 ? (
            <div key="skills" className="mb-8">
              <h2 
                className="text-2xl font-bold mb-4 border-b-2 pb-2"
                style={{ 
                  color: customization.colors.sectionHeaderText,
                  fontFamily: customization.fonts.sectionHeaders,
                  borderColor: customization.colors.primaryAccent,
                  marginBottom: safeSpacing.sectionSpacing
                }}
              >
                Skills
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {['Technical', 'Soft', 'Language', 'Tool'].map(category => {
                  const categorySkills = data.skills.filter(skill => skill.category === category);
                  return categorySkills.length > 0 ? (
                    <div key={category}>
                      <h3 
                        className="font-semibold mb-2"
                        style={{ 
                          color: customization.colors.sectionHeaderText,
                          fontFamily: customization.fonts.sectionHeaders
                        }}
                      >
                        {category} Skills
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {categorySkills.map((skill, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 rounded-full text-sm"
                            style={{ 
                              backgroundColor: customization.colors.sectionBackground,
                              color: customization.colors.bodyText,
                              border: `1px solid ${customization.colors.borderColor}`,
                              borderRadius: safeBorders.borderRadius
                            }}
                          >
                            {skill.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : null;
                })}
              </div>
            </div>
          ) : null;

        case 'education':
          return data.education.length > 0 ? (
            <div key="education" className="mb-8">
              <h2 
                className="text-2xl font-bold mb-4 border-b-2 pb-2"
                style={{ 
                  color: customization.colors.sectionHeaderText,
                  fontFamily: customization.fonts.sectionHeaders,
                  borderColor: customization.colors.primaryAccent,
                  marginBottom: safeSpacing.sectionSpacing
                }}
              >
                Education
              </h2>
              <div className="space-y-4">
                {data.education.map((edu) => (
                  <div 
                    key={edu.id}
                    style={{ marginBottom: safeSpacing.paragraphSpacing }}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 
                          className="text-lg font-semibold"
                          style={{ 
                            color: customization.colors.subHeaderText,
                            fontFamily: customization.fonts.subHeaders
                          }}
                        >
                          {edu.degree} in {edu.field}
                        </h3>
                        <p 
                          className="italic"
                          style={{ 
                            color: customization.colors.bodyText,
                            fontFamily: customization.fonts.bodyText
                          }}
                        >
                          {edu.institution}
                        </p>
                        {edu.gpa && (
                          <p style={{ 
                            color: customization.colors.bodyText,
                            lineHeight: safeSpacing.lineHeight
                          }}>
                            GPA: {edu.gpa}
                          </p>
                        )}
                        {edu.honors && (
                          <p style={{ 
                            color: customization.colors.bodyText,
                            lineHeight: safeSpacing.lineHeight
                          }}>
                            {edu.honors}
                          </p>
                        )}
                      </div>
                      <span 
                        className="text-sm"
                        style={{ 
                          color: customization.colors.dateText,
                          fontFamily: customization.fonts.dates
                        }}
                      >
                        {edu.startDate} - {edu.endDate}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : null;

        default:
          return null;
      }
    });
  };

  // Default section orders in case sectionOrder is undefined
  const defaultResumeOrder = ['experience', 'education', 'skills', 'projects'];
  const defaultPortfolioOrder = ['projects', 'experience', 'skills', 'education'];

  const currentCustomization = activeTab === 'resume' ? data.customization.resume : data.customization.portfolio;
  
  // Safe fallbacks for the main customization object
  const safeBorders = currentCustomization.borders || { borderRadius: '8px' };
  const safeSpacing = currentCustomization.spacing || { 
    sectionSpacing: '2rem', 
    paragraphSpacing: '1rem', 
    lineHeight: '1.6' 
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-gray-200/50 shadow-lg">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-4">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Your Resume is Ready!</h2>
          <p className="text-gray-600">Download your resume and portfolio</p>
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
              Resume Preview
            </button>
            <button
              onClick={() => setActiveTab('portfolio')}
              className={`px-6 py-2 rounded-md font-medium transition-all duration-200 ${
                activeTab === 'portfolio'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Portfolio Preview
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <button
            onClick={handleDownloadPDF}
            disabled={isGenerating}
            className="flex items-center justify-center space-x-2 px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="w-5 h-5" />
            <span>{isGenerating ? 'Generating...' : 'Download PDF'}</span>
          </button>

          <button
            onClick={handleDownloadPortfolio}
            className="flex items-center justify-center space-x-2 px-6 py-4 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <Globe className="w-5 h-5" />
            <span>Download Portfolio</span>
          </button>

          <button
            onClick={handleExportJSON}
            className="flex items-center justify-center space-x-2 px-6 py-4 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <Save className="w-5 h-5" />
            <span>Export Data</span>
          </button>

          <button
            onClick={handleShare}
            className="flex items-center justify-center space-x-2 px-6 py-4 bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-xl hover:from-orange-700 hover:to-orange-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <Share2 className="w-5 h-5" />
            <span>Share</span>
          </button>
        </div>

        {/* Preview Content */}
        <div 
          className="rounded-xl border overflow-hidden"
          style={{ 
            backgroundColor: currentCustomization.colors.pageBackground,
            borderColor: currentCustomization.colors.borderColor
          }}
        >
          {activeTab === 'resume' ? (
            <div 
              ref={resumePreviewRef}
              className="p-8"
              style={{ 
                backgroundColor: currentCustomization.colors.pageBackground,
                fontFamily: currentCustomization.fonts.bodyText
              }}
            >
              <div className="max-w-4xl mx-auto">
                {/* Resume Header */}
                <div 
                  className="text-center mb-8 p-6 rounded-lg"
                  style={{ 
                    backgroundColor: currentCustomization.colors.headerBackground,
                    borderRadius: safeBorders.borderRadius
                  }}
                >
                  <h1 
                    className="text-4xl font-bold mb-2"
                    style={{ 
                      color: currentCustomization.colors.mainHeaderText,
                      fontFamily: currentCustomization.fonts.mainHeader
                    }}
                  >
                    {data.personalInfo.fullName}
                  </h1>
                  <div 
                    className="mb-4"
                    style={{ 
                      color: currentCustomization.colors.contactText,
                      fontFamily: currentCustomization.fonts.contactInfo
                    }}
                  >
                    {data.personalInfo.email} | {data.personalInfo.phone} | {data.personalInfo.location}
                  </div>
                  {data.personalInfo.summary && (
                    <p 
                      className="max-w-3xl mx-auto"
                      style={{ 
                        color: currentCustomization.colors.bodyText,
                        lineHeight: safeSpacing.lineHeight
                      }}
                    >
                      {data.personalInfo.summary}
                    </p>
                  )}
                </div>

                {/* Render sections in custom order */}
                {renderSectionByOrder(data.sectionOrder?.resume || defaultResumeOrder, 'resume')}
              </div>
            </div>
          ) : (
            <div 
              ref={portfolioPreviewRef}
              data-portfolio-preview="true"
              style={{ fontFamily: currentCustomization.fonts.bodyText }}
            >
              {/* Portfolio Hero Section */}
              <div 
                className="p-8 text-center text-white"
                style={{ 
                  background: data.customization.portfolio.colors.heroBackground,
                  minHeight: '400px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                <h1 
                  className="text-4xl font-bold mb-4"
                  style={{ 
                    color: currentCustomization.colors.mainHeaderText,
                    fontFamily: currentCustomization.fonts.mainHeader
                  }}
                >
                  {data.personalInfo.fullName}
                </h1>
                <p className="text-xl opacity-90 mb-6">
                  {data.personalInfo.summary || 'Professional Portfolio'}
                </p>
                <div 
                  className="flex justify-center space-x-6 text-sm"
                  style={{ 
                    color: currentCustomization.colors.contactText,
                    fontFamily: currentCustomization.fonts.contactInfo
                  }}
                >
                  <span>{data.personalInfo.email}</span>
                  <span>{data.personalInfo.phone}</span>
                  <span>{data.personalInfo.location}</span>
                </div>
                
                {/* Social Links */}
                {(data.personalInfo.website || data.personalInfo.linkedin || data.personalInfo.github) && (
                  <div className="flex justify-center space-x-4 mt-6">
                    {data.personalInfo.website && (
                      <a 
                        href={data.personalInfo.website} 
                        className="px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors duration-200"
                        style={{ color: 'white' }}
                      >
                        Website
                      </a>
                    )}
                    {data.personalInfo.linkedin && (
                      <a 
                        href={data.personalInfo.linkedin} 
                        className="px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors duration-200"
                        style={{ color: 'white' }}
                      >
                        LinkedIn
                      </a>
                    )}
                    {data.personalInfo.github && (
                      <a 
                        href={data.personalInfo.github} 
                        className="px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors duration-200"
                        style={{ color: 'white' }}
                      >
                        GitHub
                      </a>
                    )}
                  </div>
                )}
              </div>
              
              {/* Portfolio Content */}
              <div 
                className="p-8"
                style={{ backgroundColor: currentCustomization.colors.pageBackground }}
              >
                {/* About Section */}
                {data.personalInfo.summary && (
                  <div 
                    className="mb-8 p-6 rounded-lg"
                    style={{ 
                      backgroundColor: currentCustomization.colors.sectionBackground,
                      borderRadius: safeBorders.borderRadius,
                      marginBottom: safeSpacing.sectionSpacing
                    }}
                  >
                    <h2 
                      className="text-2xl font-bold mb-4 border-b-2 pb-2"
                      style={{ 
                        color: currentCustomization.colors.sectionHeaderText,
                        fontFamily: currentCustomization.fonts.sectionHeaders,
                        borderColor: currentCustomization.colors.primaryAccent
                      }}
                    >
                      About Me
                    </h2>
                    <p 
                      style={{ 
                        color: currentCustomization.colors.bodyText,
                        lineHeight: safeSpacing.lineHeight
                      }}
                    >
                      {data.personalInfo.summary}
                    </p>
                  </div>
                )}

                {/* Render sections in custom portfolio order */}
                {renderSectionByOrder(data.sectionOrder?.portfolio || defaultPortfolioOrder, 'portfolio')}

                {/* Contact Section */}
                <div 
                  className="rounded-xl p-6 text-center"
                  style={{ 
                    backgroundColor: currentCustomization.colors.sectionBackground,
                    borderRadius: safeBorders.borderRadius
                  }}
                >
                  <h2 
                    className="text-2xl font-bold mb-4"
                    style={{ 
                      color: currentCustomization.colors.sectionHeaderText,
                      fontFamily: currentCustomization.fonts.sectionHeaders
                    }}
                  >
                    Get In Touch
                  </h2>
                  <div className="space-y-2">
                    <p style={{ 
                      color: currentCustomization.colors.bodyText,
                      fontFamily: currentCustomization.fonts.bodyText
                    }}>
                      <strong>Email:</strong> {data.personalInfo.email}
                    </p>
                    <p style={{ 
                      color: currentCustomization.colors.bodyText,
                      fontFamily: currentCustomization.fonts.bodyText
                    }}>
                      <strong>Phone:</strong> {data.personalInfo.phone}
                    </p>
                    <p style={{ 
                      color: currentCustomization.colors.bodyText,
                      fontFamily: currentCustomization.fonts.bodyText
                    }}>
                      <strong>Location:</strong> {data.personalInfo.location}
                    </p>
                    {(data.personalInfo.website || data.personalInfo.linkedin || data.personalInfo.github) && (
                      <div className="flex justify-center space-x-4 mt-4">
                        {data.personalInfo.website && (
                          <a 
                            href={data.personalInfo.website} 
                            className="hover:underline"
                            style={{ color: currentCustomization.colors.linkText }}
                          >
                            Website
                          </a>
                        )}
                        {data.personalInfo.linkedin && (
                          <a 
                            href={data.personalInfo.linkedin} 
                            className="hover:underline"
                            style={{ color: currentCustomization.colors.linkText }}
                          >
                            LinkedIn
                          </a>
                        )}
                        {data.personalInfo.github && (
                          <a 
                            href={data.personalInfo.github} 
                            className="hover:underline"
                            style={{ color: currentCustomization.colors.linkText }}
                          >
                            GitHub
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-between mt-8">
          <button
            onClick={onBack}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
          >
            Back to Customization
          </button>
          <button
            onClick={onSave}
            className="flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white font-medium rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <Save className="w-5 h-5" />
            <span>Save Session</span>
          </button>
        </div>
      </div>
    </div>
  );
};