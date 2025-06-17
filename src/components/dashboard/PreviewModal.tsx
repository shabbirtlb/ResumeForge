import React, { useState } from 'react';
import { X, Download, Globe, Maximize2 } from 'lucide-react';
import { generateResumePDF } from '../../utils/pdfGenerator';
import { downloadPortfolioHTML } from '../../utils/portfolioGenerator';
import type { SavedResume } from '../../types';

interface PreviewModalProps {
  resume: SavedResume;
  onClose: () => void;
}

export const PreviewModal: React.FC<PreviewModalProps> = ({ resume, onClose }) => {
  const [activeTab, setActiveTab] = useState<'resume' | 'portfolio'>('resume');
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const handleDownloadPDF = async () => {
    try {
      setIsGeneratingPDF(true);
      await generateResumePDF(resume.data, 'default');
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handleDownloadPortfolio = () => {
    try {
      downloadPortfolioHTML(resume.data, 'default');
    } catch (error) {
      console.error('Error generating portfolio:', error);
      alert('Failed to generate portfolio. Please try again.');
    }
  };

  const handleOpenInNewTab = () => {
    const newWindow = window.open('', '_blank', 'width=1200,height=800,scrollbars=yes');
    if (newWindow) {
      if (activeTab === 'resume') {
        newWindow.document.write(generateResumePreviewHTML(resume));
      } else {
        newWindow.document.write(generatePortfolioPreviewHTML(resume));
      }
      newWindow.document.close();
    }
  };

  const renderSectionByOrder = (sections: string[], type: 'resume' | 'portfolio') => {
    const customization = type === 'resume' ? resume.data.customization.resume : resume.data.customization.portfolio;
    
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
          return resume.data.experience.length > 0 ? (
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
                {resume.data.experience.map((exp) => (
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
          return resume.data.projects.length > 0 ? (
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
                {resume.data.projects.map((project) => (
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
          return resume.data.skills.length > 0 ? (
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
                  const categorySkills = resume.data.skills.filter(skill => skill.category === category);
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
          return resume.data.education.length > 0 ? (
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
                {resume.data.education.map((edu) => (
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

  const currentCustomization = activeTab === 'resume' ? resume.data.customization.resume : resume.data.customization.portfolio;
  
  // Safe fallbacks for the main customization object
  const safeBorders = currentCustomization.borders || { borderRadius: '8px' };
  const safeSpacing = currentCustomization.spacing || { 
    sectionSpacing: '2rem', 
    paragraphSpacing: '1rem', 
    lineHeight: '1.6' 
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{resume.title}</h2>
            <p className="text-gray-600">{resume.data.personalInfo.fullName}</p>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Tab Navigation */}
            <div className="bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setActiveTab('resume')}
                className={`px-4 py-2 rounded-md font-medium transition-all duration-200 ${
                  activeTab === 'resume'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Resume
              </button>
              <button
                onClick={() => setActiveTab('portfolio')}
                className={`px-4 py-2 rounded-md font-medium transition-all duration-200 ${
                  activeTab === 'portfolio'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Portfolio
              </button>
            </div>

            {/* Action Buttons */}
            <button
              onClick={handleOpenInNewTab}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              title="Open in new tab"
            >
              <Maximize2 className="w-5 h-5" />
            </button>

            <button
              onClick={activeTab === 'resume' ? handleDownloadPDF : handleDownloadPortfolio}
              disabled={isGeneratingPDF}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {activeTab === 'resume' ? <Download className="w-4 h-4" /> : <Globe className="w-4 h-4" />}
              <span>
                {activeTab === 'resume' 
                  ? (isGeneratingPDF ? 'Generating...' : 'Download PDF')
                  : 'Download Portfolio'
                }
              </span>
            </button>

            <button
              onClick={onClose}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          <div 
            className="rounded-xl border overflow-hidden"
            style={{ 
              backgroundColor: currentCustomization.colors.pageBackground,
              borderColor: currentCustomization.colors.borderColor
            }}
          >
            {activeTab === 'resume' ? (
              <div 
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
                      {resume.data.personalInfo.fullName}
                    </h1>
                    <div 
                      className="mb-4"
                      style={{ 
                        color: currentCustomization.colors.contactText,
                        fontFamily: currentCustomization.fonts.contactInfo
                      }}
                    >
                      {resume.data.personalInfo.email} | {resume.data.personalInfo.phone} | {resume.data.personalInfo.location}
                    </div>
                    {resume.data.personalInfo.summary && (
                      <p 
                        className="max-w-3xl mx-auto"
                        style={{ 
                          color: currentCustomization.colors.bodyText,
                          lineHeight: safeSpacing.lineHeight
                        }}
                      >
                        {resume.data.personalInfo.summary}
                      </p>
                    )}
                  </div>

                  {/* Render sections in custom order */}
                  {renderSectionByOrder(resume.data.sectionOrder?.resume || defaultResumeOrder, 'resume')}
                </div>
              </div>
            ) : (
              <div style={{ fontFamily: currentCustomization.fonts.bodyText }}>
                <div 
                  className="p-8 text-center text-white"
                  style={{ background: resume.data.customization.portfolio.colors.heroBackground }}
                >
                  <h1 
                    className="text-4xl font-bold mb-2"
                    style={{ 
                      color: currentCustomization.colors.mainHeaderText,
                      fontFamily: currentCustomization.fonts.mainHeader
                    }}
                  >
                    {resume.data.personalInfo.fullName}
                  </h1>
                  <p className="opacity-90">
                    {resume.data.personalInfo.summary || 'Professional Portfolio'}
                  </p>
                  <div 
                    className="flex justify-center space-x-6 text-sm mt-4"
                    style={{ 
                      color: currentCustomization.colors.contactText,
                      fontFamily: currentCustomization.fonts.contactInfo
                    }}
                  >
                    <span>{resume.data.personalInfo.email}</span>
                    <span>{resume.data.personalInfo.phone}</span>
                    <span>{resume.data.personalInfo.location}</span>
                  </div>
                </div>
                
                <div 
                  className="p-8"
                  style={{ backgroundColor: currentCustomization.colors.pageBackground }}
                >
                  {/* About Section */}
                  {resume.data.personalInfo.summary && (
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
                        {resume.data.personalInfo.summary}
                      </p>
                    </div>
                  )}

                  {/* Render sections in custom portfolio order */}
                  {renderSectionByOrder(resume.data.sectionOrder?.portfolio || defaultPortfolioOrder, 'portfolio')}

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
                        <strong>Email:</strong> {resume.data.personalInfo.email}
                      </p>
                      <p style={{ 
                        color: currentCustomization.colors.bodyText,
                        fontFamily: currentCustomization.fonts.bodyText
                      }}>
                        <strong>Phone:</strong> {resume.data.personalInfo.phone}
                      </p>
                      <p style={{ 
                        color: currentCustomization.colors.bodyText,
                        fontFamily: currentCustomization.fonts.bodyText
                      }}>
                        <strong>Location:</strong> {resume.data.personalInfo.location}
                      </p>
                      {(resume.data.personalInfo.website || resume.data.personalInfo.linkedin || resume.data.personalInfo.github) && (
                        <div className="flex justify-center space-x-4 mt-4">
                          {resume.data.personalInfo.website && (
                            <a 
                              href={resume.data.personalInfo.website} 
                              className="hover:underline"
                              style={{ color: currentCustomization.colors.linkText }}
                            >
                              Website
                            </a>
                          )}
                          {resume.data.personalInfo.linkedin && (
                            <a 
                              href={resume.data.personalInfo.linkedin} 
                              className="hover:underline"
                              style={{ color: currentCustomization.colors.linkText }}
                            >
                              LinkedIn
                            </a>
                          )}
                          {resume.data.personalInfo.github && (
                            <a 
                              href={resume.data.personalInfo.github} 
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
        </div>
      </div>
    </div>
  );
};

// Helper functions for generating HTML for new tab
const generateResumePreviewHTML = (resume: SavedResume): string => {
  const customization = resume.data.customization.resume;
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>${resume.title} - Resume Preview</title>
      <style>
        body { 
          font-family: '${customization.fonts.bodyText}', Arial, sans-serif; 
          margin: 20px; 
          background-color: ${customization.colors.pageBackground};
          color: ${customization.colors.bodyText};
        }
        .header { 
          text-align: center; 
          margin-bottom: 30px; 
          padding: 20px;
          background-color: ${customization.colors.headerBackground};
          border-radius: 8px;
        }
        .name { 
          font-size: 32px; 
          font-weight: bold; 
          color: ${customization.colors.mainHeaderText};
          margin-bottom: 10px;
        }
        .contact { 
          color: ${customization.colors.contactText}; 
          margin-bottom: 15px;
        }
        .section { 
          margin-bottom: 25px; 
          background-color: ${customization.colors.sectionBackground};
          padding: 20px;
          border-radius: 8px;
        }
        .section-title { 
          font-size: 20px; 
          font-weight: bold; 
          border-bottom: 3px solid ${customization.colors.primaryAccent}; 
          padding-bottom: 8px; 
          margin-bottom: 15px; 
          color: ${customization.colors.sectionHeaderText};
        }
        .item { margin-bottom: 15px; }
        .item-header { display: flex; justify-content: space-between; margin-bottom: 8px; }
        .item-title { font-weight: bold; color: ${customization.colors.subHeaderText}; }
        .item-subtitle { color: ${customization.colors.bodyText}; font-style: italic; }
        .item-date { color: ${customization.colors.dateText}; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="name">${resume.data.personalInfo.fullName}</div>
        <div class="contact">${resume.data.personalInfo.email} | ${resume.data.personalInfo.phone} | ${resume.data.personalInfo.location}</div>
        ${resume.data.personalInfo.summary ? `<p>${resume.data.personalInfo.summary}</p>` : ''}
      </div>
      
      ${resume.data.experience.length > 0 ? `
        <div class="section">
          <div class="section-title">Experience</div>
          ${resume.data.experience.map(exp => `
            <div class="item">
              <div class="item-header">
                <div>
                  <div class="item-title">${exp.position}</div>
                  <div class="item-subtitle">${exp.company}</div>
                </div>
                <div class="item-date">${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}</div>
              </div>
              <p>${exp.description}</p>
            </div>
          `).join('')}
        </div>
      ` : ''}
      
      ${resume.data.education.length > 0 ? `
        <div class="section">
          <div class="section-title">Education</div>
          ${resume.data.education.map(edu => `
            <div class="item">
              <div class="item-header">
                <div>
                  <div class="item-title">${edu.degree} in ${edu.field}</div>
                  <div class="item-subtitle">${edu.institution}</div>
                </div>
                <div class="item-date">${edu.startDate} - ${edu.endDate}</div>
              </div>
            </div>
          `).join('')}
        </div>
      ` : ''}
    </body>
    </html>
  `;
};

const generatePortfolioPreviewHTML = (resume: SavedResume): string => {
  const customization = resume.data.customization.portfolio;
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>${resume.title} - Portfolio Preview</title>
      <style>
        body { 
          font-family: '${customization.fonts.bodyText}', Arial, sans-serif; 
          margin: 0; 
          background-color: ${customization.colors.pageBackground};
          color: ${customization.colors.bodyText};
        }
        .hero { 
          background: ${customization.colors.heroBackground}; 
          color: ${customization.colors.mainHeaderText}; 
          padding: 60px 20px; 
          text-align: center; 
        }
        .hero h1 { 
          font-size: 48px; 
          margin-bottom: 20px; 
          font-weight: bold;
        }
        .content { padding: 40px 20px; max-width: 1200px; margin: 0 auto; }
        .section { 
          margin-bottom: 40px; 
          background-color: ${customization.colors.sectionBackground};
          padding: 30px;
          border-radius: 12px;
        }
        .section-title { 
          font-size: 28px; 
          font-weight: bold; 
          margin-bottom: 20px; 
          color: ${customization.colors.sectionHeaderText};
          border-bottom: 3px solid ${customization.colors.primaryAccent};
          padding-bottom: 10px;
        }
      </style>
    </head>
    <body>
      <div class="hero">
        <h1>${resume.data.personalInfo.fullName}</h1>
        <p>${resume.data.personalInfo.summary || 'Professional Portfolio'}</p>
        <p>${resume.data.personalInfo.email} | ${resume.data.personalInfo.phone} | ${resume.data.personalInfo.location}</p>
      </div>
      
      <div class="content">
        ${resume.data.personalInfo.summary ? `
          <div class="section">
            <div class="section-title">About Me</div>
            <p>${resume.data.personalInfo.summary}</p>
          </div>
        ` : ''}
        
        ${resume.data.projects.length > 0 ? `
          <div class="section">
            <div class="section-title">Projects</div>
            ${resume.data.projects.map(project => `
              <div style="margin-bottom: 20px; padding: 20px; background: ${customization.colors.cardBackground}; border-radius: 8px;">
                <h3 style="color: ${customization.colors.subHeaderText};">${project.name}</h3>
                <p>${project.description}</p>
                <p><strong>Technologies:</strong> ${project.technologies.join(', ')}</p>
              </div>
            `).join('')}
          </div>
        ` : ''}
      </div>
    </body>
    </html>
  `;
};