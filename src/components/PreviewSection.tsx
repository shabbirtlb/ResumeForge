import React, { useState, useEffect } from 'react';
import { Download, Globe, FileText, Share2, Save, Upload, ExternalLink } from 'lucide-react';
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
  const [activeSection, setActiveSection] = useState<string>('about');

  // Move availableCategories and useEffect to top level
  const skillCategories = ['Technical', 'Soft', 'Language', 'Tool'] as const;
  const availableCategories = skillCategories.filter(category => 
    data.skills.some(skill => skill.category === category)
  );

  // Move useEffect to top level of component
  useEffect(() => {
    if (availableCategories.length > 0 && !availableCategories.includes(activeSkillType)) {
      setActiveSkillType(availableCategories[0]);
    }
  }, [data.skills, activeSkillType, availableCategories]);

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

  const handleOpenPortfolioInNewTab = () => {
    const portfolioHTML = generatePortfolioHTMLForPreview(data);
    const blob = new Blob([portfolioHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
    
    // Clean up the URL after a delay
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const generatePortfolioHTMLForPreview = (data: ResumeData): string => {
    const { personalInfo, experience, education, projects, skills, sectionOrder, customization } = data;
    const portfolioColors = customization.portfolio.colors;
    const portfolioFonts = customization.portfolio.fonts;
    const portfolioLayout = customization.portfolio.layout || { heroHeight: '80vh', animationSpeed: '0.3s' };
    const safeBorders = customization.portfolio.borders || { borderRadius: '8px' };
    const safeSpacing = customization.portfolio.spacing || { sectionSpacing: '2rem', paragraphSpacing: '1rem', lineHeight: '1.6' };

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${personalInfo.fullName} - Portfolio</title>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Georgia:wght@400;700&family=Roboto:wght@400;500;700&family=Montserrat:wght@400;500;600;700&family=Lato:wght@400;700&family=Open+Sans:wght@400;600;700&family=Playfair+Display:wght@400;700&display=swap" rel="stylesheet">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        html {
            scroll-behavior: smooth;
        }
        
        body {
            font-family: '${portfolioFonts.bodyText}', sans-serif;
            line-height: ${safeSpacing.lineHeight};
            color: ${portfolioColors.bodyText};
            background-color: ${portfolioColors.pageBackground};
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 20px;
        }
        
        /* Header */
        .header {
            background: ${portfolioColors.heroBackground};
            color: ${portfolioColors.mainHeaderText};
            padding: 100px 0;
            text-align: center;
            position: relative;
            overflow: hidden;
            min-height: ${portfolioLayout.heroHeight};
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .header::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: ${portfolioColors.heroOverlay || 'rgba(0,0,0,0.1)'};
        }
        
        .header-content {
            position: relative;
            z-index: 10;
        }
        
        .header h1 {
            font-size: 3.5rem;
            margin-bottom: 20px;
            font-weight: 700;
            font-family: '${portfolioFonts.mainHeader}', sans-serif;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }
        
        .header .subtitle {
            font-size: 1.5rem;
            margin-bottom: 30px;
            opacity: 0.95;
            font-weight: 300;
        }
        
        .contact-info {
            display: flex;
            justify-content: center;
            gap: 30px;
            margin-bottom: 40px;
            flex-wrap: wrap;
        }
        
        .contact-info span {
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 1rem;
            opacity: 0.9;
        }
        
        .cta-buttons {
            display: flex;
            gap: 20px;
            justify-content: center;
            flex-wrap: wrap;
        }
        
        .btn {
            padding: 15px 30px;
            border-radius: ${safeBorders.borderRadius};
            font-weight: 600;
            text-decoration: none;
            transition: all 0.3s ease;
            cursor: pointer;
            border: none;
            font-size: 1rem;
        }
        
        .btn-primary {
            background: rgba(255,255,255,0.2);
            color: ${portfolioColors.mainHeaderText};
            border: 2px solid rgba(255,255,255,0.3);
            backdrop-filter: blur(10px);
        }
        
        .btn-primary:hover {
            background: rgba(255,255,255,0.3);
            transform: translateY(-2px);
        }
        
        .btn-secondary {
            background: white;
            color: ${portfolioColors.primaryAccent};
            border: 2px solid white;
        }
        
        .btn-secondary:hover {
            background: ${portfolioColors.primaryAccent};
            color: white;
            transform: translateY(-2px);
        }
        
        /* Navigation */
        .nav {
            background: ${portfolioColors.navigationBackground || '#ffffff'};
            box-shadow: 0 2px 20px rgba(0,0,0,0.1);
            position: sticky;
            top: 0;
            z-index: 100;
            backdrop-filter: blur(10px);
        }
        
        .nav ul {
            list-style: none;
            display: flex;
            justify-content: center;
            padding: 20px 0;
            flex-wrap: wrap;
            gap: 10px;
        }
        
        .nav li {
            margin: 0 20px;
        }
        
        .nav a {
            text-decoration: none;
            color: ${portfolioColors.bodyText};
            font-weight: 600;
            font-size: 1rem;
            padding: 10px 15px;
            border-radius: ${safeBorders.borderRadius};
            transition: all 0.3s ease;
            position: relative;
        }
        
        .nav a:hover, .nav a.active {
            color: ${portfolioColors.primaryAccent};
            background: ${portfolioColors.primaryAccent}10;
            transform: translateY(-2px);
        }
        
        /* Sections */
        .section {
            padding: 80px 0;
            position: relative;
        }
        
        .section:nth-child(even) {
            background: ${portfolioColors.alternateBackground};
        }
        
        .section-title {
            text-align: center;
            font-size: 3rem;
            margin-bottom: 60px;
            color: ${portfolioColors.sectionHeaderText};
            font-family: '${portfolioFonts.sectionHeaders}', sans-serif;
            font-weight: 700;
            position: relative;
        }
        
        .section-title::after {
            content: '';
            position: absolute;
            bottom: -15px;
            left: 50%;
            transform: translateX(-50%);
            width: 80px;
            height: 4px;
            background: ${portfolioColors.primaryAccent};
            border-radius: 2px;
        }
        
        /* About */
        .about-content {
            max-width: 800px;
            margin: 0 auto;
            text-align: center;
            font-size: 1.2rem;
            line-height: 1.8;
            color: ${portfolioColors.bodyText};
        }
        
        /* Projects */
        .projects-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
            gap: 40px;
            margin-top: 50px;
        }
        
        .project-card {
            background: ${portfolioColors.projectCardBackground || portfolioColors.cardBackground};
            border-radius: ${safeBorders.borderRadius};
            overflow: hidden;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            transition: all 0.3s ease;
            border: 1px solid ${portfolioColors.borderColor};
        }
        
        .project-card:hover {
            transform: translateY(-10px);
            box-shadow: 0 20px 40px rgba(0,0,0,0.15);
        }
        
        .project-image {
            height: 200px;
            background: linear-gradient(135deg, ${portfolioColors.primaryAccent}, ${portfolioColors.secondaryAccent});
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 4rem;
            position: relative;
            overflow: hidden;
        }
        
        .project-content {
            padding: 30px;
        }
        
        .project-content h3 {
            margin-bottom: 15px;
            color: ${portfolioColors.subHeaderText};
            font-family: '${portfolioFonts.subHeaders}', sans-serif;
            font-size: 1.5rem;
            font-weight: 600;
        }
        
        .project-content p {
            color: ${portfolioColors.bodyText};
            margin-bottom: 20px;
            line-height: 1.6;
        }
        
        .tech-tags {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            margin-bottom: 25px;
        }
        
        .tech-tag {
            background: ${portfolioColors.skillTagBackground || portfolioColors.sectionBackground};
            color: ${portfolioColors.primaryAccent};
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 0.9rem;
            font-weight: 500;
        }
        
        .project-links {
            display: flex;
            gap: 20px;
        }
        
        .project-links a {
            color: ${portfolioColors.linkText};
            text-decoration: none;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 8px;
            transition: all 0.3s ease;
        }
        
        .project-links a:hover {
            color: ${portfolioColors.primaryAccent};
            transform: translateY(-2px);
        }
        
        /* Skills */
        .skills-container {
            max-width: 1000px;
            margin: 0 auto;
        }
        
        .skills-toggle {
            display: flex;
            justify-content: center;
            margin-bottom: 50px;
        }
        
        .skills-toggle-inner {
            display: inline-flex;
            background: ${portfolioColors.sectionBackground};
            border-radius: ${safeBorders.borderRadius};
            padding: 8px;
            gap: 4px;
        }
        
        .skill-toggle-btn {
            padding: 12px 24px;
            border: none;
            background: transparent;
            color: ${portfolioColors.bodyText};
            font-weight: 600;
            border-radius: ${safeBorders.borderRadius};
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .skill-toggle-btn.active {
            background: ${portfolioColors.primaryAccent};
            color: white;
            transform: scale(1.05);
        }
        
        .skills-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 30px;
        }
        
        .skill-item {
            display: flex;
            align-items: center;
            gap: 20px;
            padding: 20px;
            background: ${portfolioColors.cardBackground};
            border-radius: ${safeBorders.borderRadius};
            box-shadow: 0 5px 15px rgba(0,0,0,0.08);
            transition: all 0.3s ease;
        }
        
        .skill-item:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 25px rgba(0,0,0,0.12);
        }
        
        .skill-name {
            flex: 1;
            font-weight: 600;
            color: ${portfolioColors.bodyText};
            font-size: 1.1rem;
        }
        
        .skill-progress {
            flex: 1;
        }
        
        .skill-bar {
            height: 8px;
            background: ${portfolioColors.borderColor};
            border-radius: 4px;
            overflow: hidden;
            margin-bottom: 8px;
        }
        
        .skill-fill {
            height: 100%;
            background: linear-gradient(90deg, ${portfolioColors.primaryAccent}, ${portfolioColors.secondaryAccent});
            border-radius: 4px;
            transition: width 1s ease-out;
        }
        
        .skill-level {
            display: flex;
            justify-content: space-between;
            font-size: 0.9rem;
            color: ${portfolioColors.bodyText};
            opacity: 0.8;
        }
        
        /* Contact */
        .contact-section {
            background: linear-gradient(135deg, ${portfolioColors.primaryAccent}15, ${portfolioColors.secondaryAccent}15);
            text-align: center;
        }
        
        .contact-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 30px;
            margin-top: 50px;
        }
        
        .contact-item {
            background: ${portfolioColors.cardBackground};
            padding: 30px;
            border-radius: ${safeBorders.borderRadius};
            box-shadow: 0 5px 15px rgba(0,0,0,0.08);
            transition: all 0.3s ease;
        }
        
        .contact-item:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 25px rgba(0,0,0,0.12);
        }
        
        .contact-item i {
            font-size: 2rem;
            color: ${portfolioColors.primaryAccent};
            margin-bottom: 15px;
        }
        
        .contact-item h3 {
            margin-bottom: 10px;
            color: ${portfolioColors.subHeaderText};
            font-weight: 600;
        }
        
        .contact-item a {
            color: ${portfolioColors.linkText};
            text-decoration: none;
            font-weight: 500;
        }
        
        .contact-item a:hover {
            color: ${portfolioColors.primaryAccent};
        }
        
        /* Responsive */
        @media (max-width: 768px) {
            .header h1 {
                font-size: 2.5rem;
            }
            
            .header .subtitle {
                font-size: 1.2rem;
            }
            
            .contact-info {
                flex-direction: column;
                gap: 15px;
            }
            
            .cta-buttons {
                flex-direction: column;
                align-items: center;
            }
            
            .nav ul {
                flex-direction: column;
                gap: 5px;
            }
            
            .nav li {
                margin: 0;
            }
            
            .projects-grid {
                grid-template-columns: 1fr;
            }
            
            .skills-grid {
                grid-template-columns: 1fr;
            }
            
            .section {
                padding: 50px 0;
            }
            
            .section-title {
                font-size: 2rem;
            }
        }
        
        /* Animations */
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .fade-in-up {
            animation: fadeInUp 0.6s ease-out;
        }
    </style>
</head>
<body>
    <!-- Header -->
    <header class="header" id="home">
        <div class="container">
            <div class="header-content fade-in-up">
                <h1>${personalInfo.fullName}</h1>
                <p class="subtitle">${personalInfo.summary || 'Full Stack Developer & Creative Problem Solver'}</p>
                
                <div class="contact-info">
                    <span><i class="fas fa-envelope"></i> ${personalInfo.email}</span>
                    <span><i class="fas fa-phone"></i> ${personalInfo.phone}</span>
                    <span><i class="fas fa-map-marker-alt"></i> ${personalInfo.location}</span>
                </div>
                
                <div class="cta-buttons">
                    <a href="#projects" class="btn btn-primary">View My Work</a>
                    <a href="#contact" class="btn btn-secondary">Get In Touch</a>
                </div>
            </div>
        </div>
    </header>

    <!-- Navigation -->
    <nav class="nav">
        <ul>
            <li><a href="#home">Home</a></li>
            <li><a href="#about">About</a></li>
            ${data.experience.length > 0 ? '<li><a href="#experience">Experience</a></li>' : ''}
            ${data.projects.length > 0 ? '<li><a href="#projects">Projects</a></li>' : ''}
            ${data.skills.length > 0 ? '<li><a href="#skills">Skills</a></li>' : ''}
            ${data.education.length > 0 ? '<li><a href="#education">Education</a></li>' : ''}
            <li><a href="#contact">Contact</a></li>
        </ul>
    </nav>

    <!-- About Section -->
    <section id="about" class="section">
        <div class="container">
            <h2 class="section-title">About Me</h2>
            <div class="about-content fade-in-up">
                <p>${personalInfo.summary || 'Passionate developer with expertise in modern web technologies and a commitment to creating exceptional user experiences. I love turning complex problems into simple, beautiful solutions.'}</p>
            </div>
        </div>
    </section>

    ${data.projects.length > 0 ? `
    <!-- Projects Section -->
    <section id="projects" class="section">
        <div class="container">
            <h2 class="section-title">Featured Projects</h2>
            <div class="projects-grid">
                ${data.projects.map((project, index) => `
                <div class="project-card fade-in-up">
                    <div class="project-image">
                        ${project.imageUrl ? `<img src="${project.imageUrl}" alt="${project.name}" style="width: 100%; height: 100%; object-fit: cover;">` : 
                          index === 0 ? '🚀' : index === 1 ? '💻' : index === 2 ? '🎨' : '⚡'}
                    </div>
                    <div class="project-content">
                        <h3>${project.name}</h3>
                        <p>${project.description}</p>
                        <div class="tech-tags">
                            ${project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                        </div>
                        <div class="project-links">
                            ${project.liveUrl ? `<a href="${project.liveUrl}" target="_blank"><i class="fas fa-external-link-alt"></i> Live Demo</a>` : ''}
                            ${project.githubUrl ? `<a href="${project.githubUrl}" target="_blank"><i class="fab fa-github"></i> GitHub</a>` : ''}
                        </div>
                    </div>
                </div>
                `).join('')}
            </div>
        </div>
    </section>
    ` : ''}

    ${data.skills.length > 0 ? `
    <!-- Skills Section -->
    <section id="skills" class="section">
        <div class="container">
            <h2 class="section-title">Skills & Expertise</h2>
            <div class="skills-container">
                ${availableCategories.length > 1 ? `
                <div class="skills-toggle">
                    <div class="skills-toggle-inner">
                        ${availableCategories.map((category, index) => `
                        <button class="skill-toggle-btn ${index === 0 ? 'active' : ''}" onclick="showSkills('${category}')">${category}</button>
                        `).join('')}
                    </div>
                </div>
                ` : ''}
                
                ${availableCategories.map((category, categoryIndex) => `
                <div id="skills-${category}" class="skills-grid ${categoryIndex === 0 ? '' : 'hidden'}">
                    ${data.skills.filter(skill => skill.category === category).map(skill => `
                    <div class="skill-item fade-in-up">
                        <div class="skill-name">${skill.name}</div>
                        <div class="skill-progress">
                            <div class="skill-bar">
                                <div class="skill-fill" style="width: ${
                                  skill.level === 'Expert' ? '95%' : 
                                  skill.level === 'Advanced' ? '80%' : 
                                  skill.level === 'Intermediate' ? '65%' : '40%'
                                }"></div>
                            </div>
                            <div class="skill-level">
                                <span>${skill.level}</span>
                                <span>${
                                  skill.level === 'Expert' ? '95%' : 
                                  skill.level === 'Advanced' ? '80%' : 
                                  skill.level === 'Intermediate' ? '65%' : '40%'
                                }</span>
                            </div>
                        </div>
                    </div>
                    `).join('')}
                </div>
                `).join('')}
            </div>
        </div>
    </section>
    ` : ''}

    ${data.experience.length > 0 ? `
    <!-- Experience Section -->
    <section id="experience" class="section">
        <div class="container">
            <h2 class="section-title">Experience</h2>
            <div class="timeline">
                ${data.experience.map(exp => `
                <div class="timeline-item fade-in-up">
                    <h3>${exp.position}</h3>
                    <div class="company">${exp.company}</div>
                    <div class="date">${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}</div>
                    <p>${exp.description}</p>
                    ${exp.achievements.length > 0 ? `
                    <ul style="margin-top: 15px; margin-left: 20px;">
                        ${exp.achievements.map(achievement => `<li>${achievement}</li>`).join('')}
                    </ul>
                    ` : ''}
                </div>
                `).join('')}
            </div>
        </div>
    </section>
    ` : ''}

    ${data.education.length > 0 ? `
    <!-- Education Section -->
    <section id="education" class="section">
        <div class="container">
            <h2 class="section-title">Education</h2>
            <div class="timeline">
                ${data.education.map(edu => `
                <div class="timeline-item fade-in-up">
                    <h3>${edu.degree} in ${edu.field}</h3>
                    <div class="company">${edu.institution}</div>
                    <div class="date">${edu.startDate} - ${edu.endDate}</div>
                    ${edu.gpa ? `<p>GPA: ${edu.gpa}</p>` : ''}
                    ${edu.honors ? `<p>${edu.honors}</p>` : ''}
                </div>
                `).join('')}
            </div>
        </div>
    </section>
    ` : ''}

    <!-- Contact Section -->
    <section id="contact" class="section contact-section">
        <div class="container">
            <h2 class="section-title">Let's Work Together</h2>
            <p style="font-size: 1.2rem; margin-bottom: 40px; max-width: 600px; margin-left: auto; margin-right: auto;">
                Ready to bring your ideas to life? I'm always excited to work on new projects and collaborate with amazing people.
            </p>
            
            <div class="contact-grid">
                <div class="contact-item fade-in-up">
                    <i class="fas fa-envelope"></i>
                    <h3>Email</h3>
                    <a href="mailto:${personalInfo.email}">${personalInfo.email}</a>
                </div>
                <div class="contact-item fade-in-up">
                    <i class="fas fa-phone"></i>
                    <h3>Phone</h3>
                    <span>${personalInfo.phone}</span>
                </div>
                <div class="contact-item fade-in-up">
                    <i class="fas fa-map-marker-alt"></i>
                    <h3>Location</h3>
                    <span>${personalInfo.location}</span>
                </div>
                ${personalInfo.linkedin ? `
                <div class="contact-item fade-in-up">
                    <i class="fab fa-linkedin"></i>
                    <h3>LinkedIn</h3>
                    <a href="${personalInfo.linkedin}" target="_blank">Connect with me</a>
                </div>
                ` : ''}
                ${personalInfo.github ? `
                <div class="contact-item fade-in-up">
                    <i class="fab fa-github"></i>
                    <h3>GitHub</h3>
                    <a href="${personalInfo.github}" target="_blank">View my code</a>
                </div>
                ` : ''}
                ${personalInfo.website ? `
                <div class="contact-item fade-in-up">
                    <i class="fas fa-globe"></i>
                    <h3>Website</h3>
                    <a href="${personalInfo.website}" target="_blank">Visit my site</a>
                </div>
                ` : ''}
            </div>
        </div>
    </section>

    <script>
        // Smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Active navigation highlighting
        window.addEventListener('scroll', () => {
            const sections = document.querySelectorAll('section[id]');
            const navLinks = document.querySelectorAll('.nav a[href^="#"]');
            
            let current = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop - 100;
                if (window.pageYOffset >= sectionTop) {
                    current = section.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === '#' + current) {
                    link.classList.add('active');
                }
            });
        });

        // Skills toggle functionality
        function showSkills(category) {
            // Hide all skill sections
            document.querySelectorAll('[id^="skills-"]').forEach(section => {
                section.classList.add('hidden');
            });
            
            // Show selected category
            document.getElementById('skills-' + category).classList.remove('hidden');
            
            // Update button states
            document.querySelectorAll('.skill-toggle-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            event.target.classList.add('active');
        }

        // Add fade-in animation on scroll
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        document.querySelectorAll('.fade-in-up').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
            observer.observe(el);
        });

        // Add hidden class style
        const style = document.createElement('style');
        style.textContent = '.hidden { display: none !important; }';
        document.head.appendChild(style);
    </script>
</body>
</html>
    `;
  };

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(`portfolio-${sectionId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
    
    const currentSkills = data.skills.filter(skill => skill.category === activeSkillType);
    
    return (
      <div className="bg-white rounded-lg border border-gray-300 overflow-hidden max-h-[600px] overflow-y-auto">
        {/* Hero Section */}
        <div 
          id="portfolio-home"
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
                onClick={() => scrollToSection('projects')}
                className="px-8 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg hover:bg-white/30 transition-all duration-300 transform hover:scale-105"
                style={{ color: portfolioColors.mainHeaderText || '#ffffff' }}
              >
                View My Work
              </button>
              <button 
                onClick={() => scrollToSection('contact')}
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
            {[
              { id: 'home', label: 'Home' },
              { id: 'about', label: 'About' },
              ...(data.experience.length > 0 ? [{ id: 'experience', label: 'Experience' }] : []),
              ...(data.projects.length > 0 ? [{ id: 'projects', label: 'Projects' }] : []),
              ...(data.skills.length > 0 ? [{ id: 'skills', label: 'Skills' }] : []),
              ...(data.education.length > 0 ? [{ id: 'education', label: 'Education' }] : []),
              { id: 'contact', label: 'Contact' }
            ].map((item) => (
              <button 
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`hover:scale-105 transition-transform duration-200 px-3 py-2 rounded ${
                  activeSection === item.id ? 'bg-blue-100 text-blue-600' : ''
                }`}
                style={{ 
                  color: activeSection === item.id ? portfolioColors.primaryAccent : portfolioColors.bodyText,
                  fontFamily: portfolioFonts.bodyText
                }}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* About Section */}
        <div 
          id="portfolio-about"
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
        {data.projects.length > 0 && (
          <div 
            id="portfolio-projects"
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
        )}

        {/* Skills Section with Toggle */}
        {data.skills.length > 0 && (
          <div 
            id="portfolio-skills"
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
        )}

        {/* Experience Section */}
        {data.experience.length > 0 && (
          <div 
            id="portfolio-experience"
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
              Experience
            </h2>
            <div className="max-w-4xl mx-auto space-y-6">
              {data.experience.map((exp) => (
                <div 
                  key={exp.id}
                  className="p-6 rounded-lg shadow-lg border-l-4"
                  style={{ 
                    backgroundColor: portfolioColors.cardBackground,
                    borderLeftColor: portfolioColors.primaryAccent,
                    borderRadius: safeBorders.borderRadius
                  }}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 
                        className="text-xl font-bold"
                        style={{ 
                          color: portfolioColors.subHeaderText,
                          fontFamily: portfolioFonts.subHeaders
                        }}
                      >
                        {exp.position}
                      </h3>
                      <p 
                        className="text-lg italic"
                        style={{ 
                          color: portfolioColors.bodyText,
                          fontFamily: portfolioFonts.bodyText
                        }}
                      >
                        {exp.company}
                      </p>
                    </div>
                    <span 
                      className="text-sm font-medium px-3 py-1 rounded-full"
                      style={{ 
                        color: portfolioColors.primaryAccent,
                        backgroundColor: portfolioColors.primaryAccent + '20',
                        fontFamily: portfolioFonts.dates
                      }}
                    >
                      {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                    </span>
                  </div>
                  <p 
                    className="mb-4"
                    style={{ 
                      color: portfolioColors.bodyText,
                      lineHeight: safeSpacing.lineHeight
                    }}
                  >
                    {exp.description}
                  </p>
                  {exp.achievements.length > 0 && (
                    <ul 
                      className="list-disc list-inside space-y-2"
                      style={{ 
                        color: portfolioColors.bodyText,
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
        )}

        {/* Education Section */}
        {data.education.length > 0 && (
          <div 
            id="portfolio-education"
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
              Education
            </h2>
            <div className="max-w-4xl mx-auto space-y-6">
              {data.education.map((edu) => (
                <div 
                  key={edu.id}
                  className="p-6 rounded-lg shadow-lg"
                  style={{ 
                    backgroundColor: portfolioColors.cardBackground,
                    borderRadius: safeBorders.borderRadius
                  }}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 
                        className="text-xl font-bold"
                        style={{ 
                          color: portfolioColors.subHeaderText,
                          fontFamily: portfolioFonts.subHeaders
                        }}
                      >
                        {edu.degree} in {edu.field}
                      </h3>
                      <p 
                        className="text-lg italic mb-2"
                        style={{ 
                          color: portfolioColors.bodyText,
                          fontFamily: portfolioFonts.bodyText
                        }}
                      >
                        {edu.institution}
                      </p>
                      {edu.gpa && (
                        <p style={{ 
                          color: portfolioColors.bodyText,
                          lineHeight: safeSpacing.lineHeight
                        }}>
                          GPA: {edu.gpa}
                        </p>
                      )}
                      {edu.honors && (
                        <p style={{ 
                          color: portfolioColors.bodyText,
                          lineHeight: safeSpacing.lineHeight
                        }}>
                          {edu.honors}
                        </p>
                      )}
                    </div>
                    <span 
                      className="text-sm font-medium px-3 py-1 rounded-full"
                      style={{ 
                        color: portfolioColors.primaryAccent,
                        backgroundColor: portfolioColors.primaryAccent + '20',
                        fontFamily: portfolioFonts.dates
                      }}
                    >
                      {edu.startDate} - {edu.endDate}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Contact Section */}
        <div 
          id="portfolio-contact"
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
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div 
              className="p-4 rounded-lg"
              style={{ backgroundColor: portfolioColors.cardBackground }}
            >
              <div className="text-2xl mb-2">📧</div>
              <h3 
                className="font-semibold mb-1"
                style={{ color: portfolioColors.subHeaderText }}
              >
                Email
              </h3>
              <p style={{ color: portfolioColors.bodyText }}>{data.personalInfo.email}</p>
            </div>
            
            <div 
              className="p-4 rounded-lg"
              style={{ backgroundColor: portfolioColors.cardBackground }}
            >
              <div className="text-2xl mb-2">📱</div>
              <h3 
                className="font-semibold mb-1"
                style={{ color: portfolioColors.subHeaderText }}
              >
                Phone
              </h3>
              <p style={{ color: portfolioColors.bodyText }}>{data.personalInfo.phone}</p>
            </div>
            
            <div 
              className="p-4 rounded-lg"
              style={{ backgroundColor: portfolioColors.cardBackground }}
            >
              <div className="text-2xl mb-2">📍</div>
              <h3 
                className="font-semibold mb-1"
                style={{ color: portfolioColors.subHeaderText }}
              >
                Location
              </h3>
              <p style={{ color: portfolioColors.bodyText }}>{data.personalInfo.location}</p>
            </div>
          </div>
          
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
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
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
            onClick={handleOpenPortfolioInNewTab}
            className="flex items-center justify-center space-x-2 px-6 py-4 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-xl hover:from-indigo-700 hover:to-indigo-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <ExternalLink className="w-5 h-5" />
            <span>Open in New Tab</span>
          </button>

          <button
            onClick={handleExportJSON}
            className="flex items-center justify-center space-x-2 px-6 py-4 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <Save className="w-5 h-5" />
            <span>Export Data</span>
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