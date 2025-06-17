import React, { useState } from 'react';
import { Download, Globe, FileText, Share2, Save, Upload } from 'lucide-react';
import { generateResumePDF, exportToJSON } from '../utils/pdfGenerator';
import { downloadPortfolioHTML } from '../utils/portfolioGenerator';
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
  const [activeSkillType, setActiveSkillType] = useState<'Technical' | 'Soft' | 'Language' | 'Tool'>('Technical');

  const handleDownloadPDF = async () => {
    try {
      setIsGenerating(true);
      await generateResumePDF(data, 'default');
    } catch (error) {
      console.error('Failed to generate PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadPortfolio = () => {
    downloadPortfolioHTML(data, 'default');
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

  // Portfolio preview component
  const renderPortfolioPreview = () => {
    const portfolioColors = data.customization.portfolio.colors;
    const portfolioFonts = data.customization.portfolio.fonts;
    const portfolioLayout = data.customization.portfolio.layout || { heroHeight: '80vh', animationSpeed: '0.3s' };
    const safeBorders = data.customization.portfolio.borders || { borderRadius: '8px' };
    const safeSpacing = data.customization.portfolio.spacing || { sectionSpacing: '2rem', paragraphSpacing: '1rem', lineHeight: '1.6' };
    
    // Get skills by category for the toggle functionality
    const skillCategories = ['Technical', 'Soft', 'Language', 'Tool'] as const;
    const availableCategories = skillCategories.filter(category => 
      data.skills.some(skill => skill.category === category)
    );
    
    // If no skills in current active category, switch to first available
    React.useEffect(() => {
      if (availableCategories.length > 0 && !availableCategories.includes(activeSkillType)) {
        setActiveSkillType(availableCategories[0]);
      }
    }, [data.skills]);
    
    const currentSkills = data.skills.filter(skill => skill.category === activeSkillType);
    
    return (
      <div className="bg-white rounded-lg border border-gray-300 overflow-hidden max-h-[600px] overflow-y-auto">
        {/* Hero Section */}
        <div 
          className="relative p-8 text-center text-white min-h-[300px] flex flex-col justify-center"
          style={{ 
            background: portfolioColors.heroBackground || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            fontFamily: portfolioFonts.mainHeader
          }}
        >
          {/* Animated Background Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-10 left-10 w-4 h-4 bg-white/20 rounded-full animate-pulse"></div>
            <div className="absolute top-20 right-16 w-6 h-6 bg-white/10 rounded-full animate-bounce"></div>
            <div className="absolute bottom-16 left-20 w-3 h-3 bg-white/30 rounded-full animate-ping"></div>
            <div className="absolute bottom-10 right-10 w-5 h-5 bg-white/15 rounded-full animate-pulse"></div>
          </div>
          
          <div className="relative z-10">
            <h1 
              className="text-4xl font-bold mb-4"
              style={{ 
                color: portfolioColors.mainHeaderText || '#ffffff',
                fontFamily: portfolioFonts.mainHeader
              }}
            >
              {data.personalInfo.fullName || 'John Doe'}
            </h1>
            <p className="text-xl opacity-90 mb-6">
              {data.personalInfo.summary || 'Full Stack Developer & Creative Problem Solver'}
            </p>
            
            {/* Contact Info */}
            <div className="flex flex-wrap justify-center gap-4 text-sm mb-6 opacity-90">
              <span>{data.personalInfo.email}</span>
              <span>•</span>
              <span>{data.personalInfo.phone}</span>
              <span>•</span>
              <span>{data.personalInfo.location}</span>
            </div>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                className="px-8 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg hover:bg-white/30 transition-all duration-300 transform hover:scale-105"
                style={{ color: portfolioColors.mainHeaderText || '#ffffff' }}
              >
                View My Work
              </button>
              <button 
                className="px-8 py-3 bg-white text-gray-900 rounded-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105"
              >
                Get In Touch
              </button>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div 
          className="sticky top-0 z-20 backdrop-blur-md border-b"
          style={{ 
            backgroundColor: portfolioColors.navigationBackground || '#ffffff',
            borderColor: portfolioColors.borderColor
          }}
        >
          <div className="flex justify-center space-x-8 py-4 text-sm font-medium">
            {['About', 'Experience', 'Projects', 'Skills', 'Contact'].map((item) => (
              <a 
                key={item}
                href="#"
                className="hover:scale-105 transition-transform duration-200"
                style={{ 
                  color: portfolioColors.bodyText,
                  fontFamily: portfolioFonts.bodyText
                }}
              >
                {item}
              </a>
            ))}
          </div>
        </div>

        {/* About Section */}
        <div 
          className="p-8"
          style={{ backgroundColor: portfolioColors.pageBackground }}
        >
          <h2 
            className="text-2xl font-bold text-center mb-6"
            style={{ 
              color: portfolioColors.sectionHeaderText,
              fontFamily: portfolioFonts.sectionHeaders
            }}
          >
            About Me
          </h2>
          <div 
            className="max-w-3xl mx-auto text-center"
            style={{ 
              color: portfolioColors.bodyText,
              fontFamily: portfolioFonts.bodyText,
              lineHeight: safeSpacing.lineHeight
            }}
          >
            <p>
              {data.personalInfo.summary || 'Passionate developer with expertise in modern web technologies and a commitment to creating exceptional user experiences. I love turning complex problems into simple, beautiful solutions.'}
            </p>
          </div>
        </div>

        {/* Featured Projects Section */}
        <div 
          className="p-8"
          style={{ backgroundColor: portfolioColors.alternateBackground }}
        >
          <h2 
            className="text-2xl font-bold text-center mb-8"
            style={{ 
              color: portfolioColors.sectionHeaderText,
              fontFamily: portfolioFonts.sectionHeaders
            }}
          >
            Featured Projects
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(data.projects.length > 0 ? data.projects.slice(0, 3) : [
              { name: 'E-Commerce Platform', description: 'Full-stack e-commerce solution with React and Node.js', technologies: ['React', 'Node.js', 'MongoDB'] },
              { name: 'Task Management App', description: 'Collaborative task management with real-time updates', technologies: ['Vue.js', 'Express', 'PostgreSQL'] },
              { name: 'Portfolio Website', description: 'Responsive portfolio with modern design', technologies: ['Next.js', 'Tailwind', 'Vercel'] }
            ]).map((project, index) => (
              <div 
                key={index}
                className="group rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                style={{ 
                  backgroundColor: portfolioColors.projectCardBackground || portfolioColors.cardBackground,
                  borderRadius: safeBorders.borderRadius
                }}
              >
                <div 
                  className="h-40 flex items-center justify-center text-5xl"
                  style={{ 
                    background: `linear-gradient(135deg, ${portfolioColors.primaryAccent}20, ${portfolioColors.secondaryAccent}20)`
                  }}
                >
                  {index === 0 ? '🛒' : index === 1 ? '📋' : '💼'}
                </div>
                <div className="p-6">
                  <h3 
                    className="font-bold text-lg mb-2"
                    style={{ 
                      color: portfolioColors.subHeaderText,
                      fontFamily: portfolioFonts.subHeaders
                    }}
                  >
                    {project.name}
                  </h3>
                  <p 
                    className="text-sm mb-4"
                    style={{ 
                      color: portfolioColors.bodyText,
                      fontFamily: portfolioFonts.bodyText,
                      lineHeight: safeSpacing.lineHeight
                    }}
                  >
                    {project.description || 'An amazing project showcasing modern web development techniques.'}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.map((tech, techIndex) => (
                      <span 
                        key={techIndex}
                        className="px-3 py-1 text-xs rounded-full font-medium"
                        style={{ 
                          backgroundColor: portfolioColors.skillTagBackground || portfolioColors.sectionBackground,
                          color: portfolioColors.primaryAccent
                        }}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  <div className="flex space-x-4">
                    <button 
                      className="text-sm font-medium hover:underline"
                      style={{ color: portfolioColors.linkText }}
                    >
                      Live Demo
                    </button>
                    <button 
                      className="text-sm font-medium hover:underline"
                      style={{ color: portfolioColors.linkText }}
                    >
                      GitHub
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Skills Section with Toggle */}
        <div 
          className="p-8"
          style={{ backgroundColor: portfolioColors.pageBackground }}
        >
          <h2 
            className="text-2xl font-bold text-center mb-8"
            style={{ 
              color: portfolioColors.sectionHeaderText,
              fontFamily: portfolioFonts.sectionHeaders
            }}
          >
            Skills & Expertise
          </h2>
          
          {/* Skill Category Toggle */}
          {availableCategories.length > 1 && (
            <div className="flex justify-center mb-8">
              <div 
                className="inline-flex rounded-lg p-1"
                style={{ backgroundColor: portfolioColors.sectionBackground }}
              >
                {availableCategories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setActiveSkillType(category)}
                    className={`px-4 py-2 rounded-md font-medium transition-all duration-200 ${
                      activeSkillType === category
                        ? 'shadow-sm transform scale-105'
                        : 'hover:scale-105'
                    }`}
                    style={{
                      backgroundColor: activeSkillType === category 
                        ? portfolioColors.primaryAccent 
                        : 'transparent',
                      color: activeSkillType === category 
                        ? '#ffffff' 
                        : portfolioColors.bodyText,
                      fontFamily: portfolioFonts.bodyText
                    }}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* Skills Display */}
          <div className="max-w-4xl mx-auto">
            {currentSkills.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {currentSkills.map((skill, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <span 
                      className="flex-1 text-lg font-medium"
                      style={{ 
                        color: portfolioColors.bodyText,
                        fontFamily: portfolioFonts.bodyText
                      }}
                    >
                      {skill.name}
                    </span>
                    <div className="flex-1">
                      <div 
                        className="h-3 rounded-full overflow-hidden"
                        style={{ backgroundColor: portfolioColors.borderColor }}
                      >
                        <div 
                          className="h-full rounded-full transition-all duration-1000 ease-out"
                          style={{ 
                            backgroundColor: portfolioColors.timelineAccent || portfolioColors.primaryAccent,
                            width: skill.level === 'Expert' ? '95%' : 
                                   skill.level === 'Advanced' ? '80%' : 
                                   skill.level === 'Intermediate' ? '65%' : '40%'
                          }}
                        />
                      </div>
                      <div className="flex justify-between text-xs mt-1">
                        <span style={{ color: portfolioColors.bodyText }}>
                          {skill.level}
                        </span>
                        <span style={{ color: portfolioColors.bodyText }}>
                          {skill.level === 'Expert' ? '95%' : 
                           skill.level === 'Advanced' ? '80%' : 
                           skill.level === 'Intermediate' ? '65%' : '40%'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p 
                  className="text-lg"
                  style={{ 
                    color: portfolioColors.bodyText,
                    fontFamily: portfolioFonts.bodyText
                  }}
                >
                  No {activeSkillType.toLowerCase()} skills added yet.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Contact Section */}
        <div 
          className="p-8 text-center"
          style={{ 
            background: `linear-gradient(135deg, ${portfolioColors.primaryAccent}10, ${portfolioColors.secondaryAccent}10)`
          }}
        >
          <h2 
            className="text-2xl font-bold mb-4"
            style={{ 
              color: portfolioColors.sectionHeaderText,
              fontFamily: portfolioFonts.sectionHeaders
            }}
          >
            Let's Work Together
          </h2>
          <p 
            className="text-lg mb-6 max-w-2xl mx-auto"
            style={{ 
              color: portfolioColors.bodyText,
              fontFamily: portfolioFonts.bodyText,
              lineHeight: safeSpacing.lineHeight
            }}
          >
            Ready to bring your ideas to life? I'm always excited to work on new projects and collaborate with amazing people.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              className="px-8 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 shadow-lg"
              style={{ 
                backgroundColor: portfolioColors.primaryAccent,
                color: '#ffffff'
              }}
            >
              Send Message
            </button>
            <button 
              className="px-8 py-3 border-2 rounded-lg font-medium transition-all duration-300 transform hover:scale-105"
              style={{ 
                borderColor: portfolioColors.primaryAccent,
                color: portfolioColors.primaryAccent
              }}
            >
              Download Resume
            </button>
          </div>
        </div>
      </div>
    );
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
              Portfolio Website
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
            renderPortfolioPreview()
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