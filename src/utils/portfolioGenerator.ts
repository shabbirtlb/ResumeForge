import type { ResumeData } from '../types';

export const generatePortfolioHTML = (data: ResumeData, templateId: string): string => {
  const { personalInfo, experience, education, projects, skills, sectionOrder, customization } = data;
  const portfolioCustomization = customization.portfolio;

  // Safe fallbacks for customization - use exact same logic as preview
  const safeSpacing = portfolioCustomization.spacing || { 
    sectionSpacing: '4rem', 
    paragraphSpacing: '1.5rem', 
    lineHeight: '1.7' 
  };
  const safeBorders = portfolioCustomization.borders || { borderRadius: '12px' };
  const safeLayout = portfolioCustomization.layout || { 
    heroHeight: '100vh', 
    cardShadow: '0 10px 25px rgba(0,0,0,0.1)', 
    animationSpeed: '0.3s' 
  };
  const safeFonts = portfolioCustomization.fonts || {
    mainHeader: 'Inter',
    sectionHeaders: 'Inter',
    subHeaders: 'Inter',
    bodyText: 'Inter',
    contactInfo: 'Inter',
    dates: 'Inter'
  };
  const safeColors = portfolioCustomization.colors || {
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
  };

  const renderSectionByOrder = (sections: string[]) => {
    return sections.map(sectionId => {
      switch (sectionId) {
        case 'experience':
          return experience.length > 0 ? `
            <section id="experience" class="section">
              <div class="container">
                <h2 class="section-title">Experience</h2>
                <div class="timeline">
                  ${experience.map(exp => `
                  <div class="timeline-item">
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
          ` : '';

        case 'projects':
          return projects.length > 0 ? `
            <section id="projects" class="section">
              <div class="container">
                <h2 class="section-title">Projects</h2>
                <div class="projects-grid">
                  ${projects.map(project => `
                  <div class="project-card">
                    <div class="project-image">
                      ${project.imageUrl ? `<img src="${project.imageUrl}" alt="${project.name}" style="width: 100%; height: 100%; object-fit: cover;">` : '<i class="fas fa-code"></i>'}
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
          ` : '';

        case 'skills':
          return skills.length > 0 ? `
            <section id="skills" class="section">
              <div class="container">
                <h2 class="section-title">Skills</h2>
                <div class="skills-container">
                  ${['Technical', 'Soft', 'Language', 'Tool'].map(category => {
                    const categorySkills = skills.filter(skill => skill.category === category);
                    return categorySkills.length > 0 ? `
                      <div class="skills-category">
                        <h3>${category} Skills</h3>
                        <div class="skills-list">
                          ${categorySkills.map(skill => `<div class="skill-item">${skill.name}</div>`).join('')}
                        </div>
                      </div>
                    ` : '';
                  }).join('')}
                </div>
              </div>
            </section>
          ` : '';

        case 'education':
          return education.length > 0 ? `
            <section id="education" class="section">
              <div class="container">
                <h2 class="section-title">Education</h2>
                <div class="timeline">
                  ${education.map(edu => `
                  <div class="timeline-item">
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
          ` : '';

        default:
          return '';
      }
    }).join('');
  };

  const baseHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${personalInfo.fullName} - Portfolio</title>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Georgia:wght@400;700&family=Roboto:wght@400;500;700&family=Montserrat:wght@400;500;600;700&family=Lato:wght@400;700&family=Open+Sans:wght@400;600;700&family=Playfair+Display:wght@400;700&family=Poppins:wght@400;500;600;700&family=Source+Sans+Pro:wght@400;600;700&display=swap" rel="stylesheet">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: '${safeFonts.bodyText}', sans-serif;
            line-height: ${safeSpacing.lineHeight};
            color: ${safeColors.bodyText};
            background-color: ${safeColors.pageBackground};
            scroll-behavior: smooth;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 20px;
        }
        
        /* Header */
        .header {
            background: ${safeColors.heroBackground};
            color: ${safeColors.mainHeaderText};
            padding: 100px 0;
            text-align: center;
            min-height: ${safeLayout.heroHeight};
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            overflow: hidden;
        }
        
        .header::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: ${safeColors.heroOverlay || 'rgba(0,0,0,0.1)'};
            z-index: 1;
        }
        
        .header-content {
            position: relative;
            z-index: 2;
        }
        
        .header h1 {
            font-size: 3.5rem;
            margin-bottom: 20px;
            font-weight: 700;
            font-family: '${safeFonts.mainHeader}', sans-serif;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
            animation: fadeInUp 1s ease-out;
        }
        
        .header .subtitle {
            font-size: 1.5rem;
            margin-bottom: 30px;
            opacity: 0.95;
            animation: fadeInUp 1s ease-out 0.2s both;
        }
        
        .contact-info {
            display: flex;
            justify-content: center;
            gap: 30px;
            margin-bottom: 40px;
            flex-wrap: wrap;
            animation: fadeInUp 1s ease-out 0.4s both;
        }
        
        .contact-item {
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 1.1rem;
            color: ${safeColors.contactText};
            font-family: '${safeFonts.contactInfo}', sans-serif;
        }
        
        .social-links {
            display: flex;
            justify-content: center;
            gap: 25px;
            margin-top: 40px;
            flex-wrap: wrap;
            animation: fadeInUp 1s ease-out 0.6s both;
        }
        
        .social-links a {
            color: ${safeColors.mainHeaderText};
            font-size: 2rem;
            transition: all ${safeLayout.animationSpeed} ease;
            padding: 15px;
            border-radius: 50%;
            background: rgba(255,255,255,0.1);
            backdrop-filter: blur(10px);
        }
        
        .social-links a:hover {
            transform: translateY(-5px) scale(1.1);
            background: rgba(255,255,255,0.2);
            box-shadow: ${safeLayout.cardShadow};
        }
        
        /* Navigation */
        .nav {
            background: ${safeColors.navigationBackground || safeColors.cardBackground};
            box-shadow: ${safeLayout.cardShadow};
            position: sticky;
            top: 0;
            z-index: 100;
            border-bottom: 1px solid ${safeColors.borderColor};
            backdrop-filter: blur(10px);
        }
        
        .nav ul {
            list-style: none;
            display: flex;
            justify-content: center;
            padding: 25px 0;
            flex-wrap: wrap;
            gap: 10px;
        }
        
        .nav li {
            margin: 0 20px;
        }
        
        .nav a {
            text-decoration: none;
            color: ${safeColors.bodyText};
            font-weight: 600;
            font-size: 1.1rem;
            transition: all ${safeLayout.animationSpeed} ease;
            padding: 10px 20px;
            border-radius: ${safeBorders.borderRadius};
            position: relative;
            overflow: hidden;
        }
        
        .nav a::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
            transition: left 0.5s;
        }
        
        .nav a:hover {
            color: ${safeColors.primaryAccent};
            background: ${safeColors.primaryAccent}10;
            transform: translateY(-2px);
        }
        
        .nav a:hover::before {
            left: 100%;
        }
        
        /* Sections */
        .section {
            padding: ${safeSpacing.sectionSpacing} 0;
            position: relative;
        }
        
        .section:nth-child(even) {
            background: ${safeColors.alternateBackground};
        }
        
        .section-title {
            text-align: center;
            font-size: 3rem;
            margin-bottom: 60px;
            color: ${safeColors.sectionHeaderText};
            font-family: '${safeFonts.sectionHeaders}', sans-serif;
            font-weight: 700;
            position: relative;
            animation: fadeInUp 0.8s ease-out;
        }
        
        .section-title::after {
            content: '';
            position: absolute;
            bottom: -15px;
            left: 50%;
            transform: translateX(-50%);
            width: 80px;
            height: 4px;
            background: linear-gradient(90deg, ${safeColors.primaryAccent}, ${safeColors.secondaryAccent});
            border-radius: 2px;
        }
        
        /* About */
        .about-content {
            max-width: 800px;
            margin: 0 auto;
            text-align: center;
            font-size: 1.2rem;
            line-height: ${safeSpacing.lineHeight};
            color: ${safeColors.bodyText};
            padding: 40px;
            background: ${safeColors.cardBackground};
            border-radius: ${safeBorders.borderRadius};
            box-shadow: ${safeLayout.cardShadow};
            animation: fadeInUp 0.8s ease-out;
        }
        
        /* Timeline */
        .timeline {
            max-width: 900px;
            margin: 0 auto;
            position: relative;
        }
        
        .timeline::before {
            content: '';
            position: absolute;
            left: 50%;
            top: 0;
            bottom: 0;
            width: 4px;
            background: linear-gradient(180deg, ${safeColors.primaryAccent}, ${safeColors.secondaryAccent});
            transform: translateX(-50%);
            border-radius: 2px;
        }
        
        .timeline-item {
            background: ${safeColors.cardBackground};
            padding: 40px;
            margin-bottom: 40px;
            border-radius: ${safeBorders.borderRadius};
            box-shadow: ${safeLayout.cardShadow};
            border-left: 6px solid ${safeColors.primaryAccent};
            position: relative;
            margin-left: 60px;
            animation: slideInLeft 0.8s ease-out;
            transition: all ${safeLayout.animationSpeed} ease;
        }
        
        .timeline-item:hover {
            transform: translateY(-5px);
            box-shadow: 0 20px 40px rgba(0,0,0,0.15);
        }
        
        .timeline-item::before {
            content: '';
            position: absolute;
            left: -60px;
            top: 50%;
            transform: translateY(-50%);
            width: 20px;
            height: 20px;
            background: ${safeColors.primaryAccent};
            border-radius: 50%;
            border: 4px solid ${safeColors.cardBackground};
            box-shadow: 0 0 0 4px ${safeColors.primaryAccent}30;
        }
        
        .timeline-item h3 {
            color: ${safeColors.subHeaderText};
            margin-bottom: 8px;
            font-family: '${safeFonts.subHeaders}', sans-serif;
            font-size: 1.4rem;
            font-weight: 600;
        }
        
        .timeline-item .company {
            color: ${safeColors.primaryAccent};
            font-style: italic;
            margin-bottom: 12px;
            font-weight: 500;
            font-size: 1.1rem;
        }
        
        .timeline-item .date {
            color: ${safeColors.dateText};
            font-size: 0.95rem;
            margin-bottom: 20px;
            font-family: '${safeFonts.dates}', sans-serif;
            font-weight: 500;
        }
        
        .timeline-item p {
            line-height: ${safeSpacing.lineHeight};
            color: ${safeColors.bodyText};
        }
        
        /* Projects */
        .projects-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
            gap: 40px;
            margin-top: 60px;
        }
        
        .project-card {
            background: ${safeColors.projectCardBackground || safeColors.cardBackground};
            border-radius: ${safeBorders.borderRadius};
            overflow: hidden;
            box-shadow: ${safeLayout.cardShadow};
            transition: all ${safeLayout.animationSpeed} ease;
            border: 1px solid ${safeColors.borderColor};
            animation: fadeInUp 0.8s ease-out;
        }
        
        .project-card:hover {
            transform: translateY(-10px) scale(1.02);
            box-shadow: 0 25px 50px rgba(0,0,0,0.2);
        }
        
        .project-image {
            height: 250px;
            background: linear-gradient(135deg, ${safeColors.primaryAccent}, ${safeColors.secondaryAccent});
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 4rem;
            position: relative;
            overflow: hidden;
        }
        
        .project-image::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%);
            transform: translateX(-100%);
            transition: transform 0.6s;
        }
        
        .project-card:hover .project-image::before {
            transform: translateX(100%);
        }
        
        .project-content {
            padding: 30px;
        }
        
        .project-content h3 {
            margin-bottom: 15px;
            color: ${safeColors.subHeaderText};
            font-family: '${safeFonts.subHeaders}', sans-serif;
            font-size: 1.3rem;
            font-weight: 600;
        }
        
        .project-content p {
            color: ${safeColors.bodyText};
            margin-bottom: 20px;
            line-height: ${safeSpacing.lineHeight};
        }
        
        .tech-tags {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            margin-bottom: 25px;
        }
        
        .tech-tag {
            background: ${safeColors.skillTagBackground || safeColors.primaryAccent + '20'};
            color: ${safeColors.primaryAccent};
            padding: 6px 15px;
            border-radius: 25px;
            font-size: 0.85rem;
            font-weight: 500;
            border: 1px solid ${safeColors.primaryAccent}30;
            transition: all ${safeLayout.animationSpeed} ease;
        }
        
        .tech-tag:hover {
            background: ${safeColors.primaryAccent};
            color: white;
            transform: translateY(-2px);
        }
        
        .project-links {
            display: flex;
            gap: 20px;
        }
        
        .project-links a {
            color: ${safeColors.linkText};
            text-decoration: none;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 10px 20px;
            border: 2px solid ${safeColors.linkText};
            border-radius: ${safeBorders.borderRadius};
            transition: all ${safeLayout.animationSpeed} ease;
        }
        
        .project-links a:hover {
            background: ${safeColors.linkText};
            color: white;
            transform: translateY(-2px);
        }
        
        /* Skills */
        .skills-container {
            max-width: 1000px;
            margin: 0 auto;
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 40px;
        }
        
        .skills-category {
            background: ${safeColors.cardBackground};
            padding: 30px;
            border-radius: ${safeBorders.borderRadius};
            box-shadow: ${safeLayout.cardShadow};
            border-top: 4px solid ${safeColors.primaryAccent};
            animation: fadeInUp 0.8s ease-out;
            transition: all ${safeLayout.animationSpeed} ease;
        }
        
        .skills-category:hover {
            transform: translateY(-5px);
            box-shadow: 0 20px 40px rgba(0,0,0,0.15);
        }
        
        .skills-category h3 {
            margin-bottom: 25px;
            color: ${safeColors.sectionHeaderText};
            font-family: '${safeFonts.sectionHeaders}', sans-serif;
            font-size: 1.3rem;
            font-weight: 600;
            text-align: center;
        }
        
        .skills-list {
            display: flex;
            flex-wrap: wrap;
            gap: 12px;
        }
        
        .skill-item {
            background: ${safeColors.skillTagBackground || safeColors.alternateBackground};
            padding: 12px 20px;
            border-radius: 30px;
            font-weight: 500;
            color: ${safeColors.bodyText};
            border: 1px solid ${safeColors.borderColor};
            transition: all ${safeLayout.animationSpeed} ease;
            cursor: default;
        }
        
        .skill-item:hover {
            background: ${safeColors.primaryAccent};
            color: white;
            transform: translateY(-3px);
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        }
        
        /* Contact */
        .contact-section {
            background: ${safeColors.sectionBackground};
            padding: ${safeSpacing.sectionSpacing} 0;
        }
        
        .contact-content {
            text-align: center;
            max-width: 700px;
            margin: 0 auto;
            background: ${safeColors.cardBackground};
            padding: 50px;
            border-radius: ${safeBorders.borderRadius};
            box-shadow: ${safeLayout.cardShadow};
            animation: fadeInUp 0.8s ease-out;
        }
        
        .contact-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 30px;
            margin-top: 40px;
        }
        
        .contact-item-large {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 15px;
            padding: 25px;
            background: ${safeColors.alternateBackground};
            border-radius: ${safeBorders.borderRadius};
            transition: all ${safeLayout.animationSpeed} ease;
        }
        
        .contact-item-large:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 25px rgba(0,0,0,0.1);
        }
        
        .contact-item-large i {
            color: ${safeColors.primaryAccent};
            font-size: 2rem;
        }
        
        .contact-item-large a {
            color: ${safeColors.linkText};
            text-decoration: none;
            font-weight: 500;
            transition: color ${safeLayout.animationSpeed} ease;
        }
        
        .contact-item-large a:hover {
            color: ${safeColors.primaryAccent};
        }
        
        /* Footer */
        .footer {
            background: ${safeColors.footerBackground || safeColors.sectionHeaderText};
            color: white;
            text-align: center;
            padding: 40px 0;
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
        
        @keyframes slideInLeft {
            from {
                opacity: 0;
                transform: translateX(-50px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
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
            
            .nav ul {
                flex-direction: column;
                gap: 10px;
                padding: 20px 0;
            }
            
            .nav li {
                margin: 0;
            }
            
            .projects-grid {
                grid-template-columns: 1fr;
            }
            
            .timeline::before {
                left: 20px;
            }
            
            .timeline-item {
                margin-left: 50px;
            }
            
            .timeline-item::before {
                left: -45px;
            }
            
            .section {
                padding: 60px 0;
            }
            
            .section-title {
                font-size: 2.2rem;
            }
            
            .skills-container {
                grid-template-columns: 1fr;
            }
            
            .contact-grid {
                grid-template-columns: 1fr;
            }
        }
        
        @media (max-width: 480px) {
            .container {
                padding: 0 15px;
            }
            
            .header {
                padding: 60px 0;
            }
            
            .header h1 {
                font-size: 2rem;
            }
            
            .social-links a {
                font-size: 1.5rem;
                padding: 12px;
            }
            
            .timeline-item {
                margin-left: 0;
                border-left: none;
                border-top: 4px solid ${safeColors.primaryAccent};
            }
            
            .timeline::before {
                display: none;
            }
            
            .timeline-item::before {
                display: none;
            }
        }
    </style>
</head>
<body>
    <!-- Header -->
    <header class="header">
        <div class="container">
            <div class="header-content">
                <h1>${personalInfo.fullName}</h1>
                <p class="subtitle">${personalInfo.summary || 'Professional Portfolio'}</p>
                
                <div class="contact-info">
                    <div class="contact-item">
                        <i class="fas fa-envelope"></i>
                        ${personalInfo.email}
                    </div>
                    <div class="contact-item">
                        <i class="fas fa-phone"></i>
                        ${personalInfo.phone}
                    </div>
                    <div class="contact-item">
                        <i class="fas fa-map-marker-alt"></i>
                        ${personalInfo.location}
                    </div>
                </div>
                
                <div class="social-links">
                    ${personalInfo.website ? `<a href="${personalInfo.website}" target="_blank" title="Website"><i class="fas fa-globe"></i></a>` : ''}
                    ${personalInfo.linkedin ? `<a href="${personalInfo.linkedin}" target="_blank" title="LinkedIn"><i class="fab fa-linkedin"></i></a>` : ''}
                    ${personalInfo.github ? `<a href="${personalInfo.github}" target="_blank" title="GitHub"><i class="fab fa-github"></i></a>` : ''}
                </div>
            </div>
        </div>
    </header>

    <!-- Navigation -->
    <nav class="nav">
        <ul>
            <li><a href="#about">About</a></li>
            ${sectionOrder.portfolio.includes('experience') ? '<li><a href="#experience">Experience</a></li>' : ''}
            ${sectionOrder.portfolio.includes('projects') ? '<li><a href="#projects">Projects</a></li>' : ''}
            ${sectionOrder.portfolio.includes('skills') ? '<li><a href="#skills">Skills</a></li>' : ''}
            ${sectionOrder.portfolio.includes('education') ? '<li><a href="#education">Education</a></li>' : ''}
            <li><a href="#contact">Contact</a></li>
        </ul>
    </nav>

    <!-- About Section -->
    <section id="about" class="section">
        <div class="container">
            <h2 class="section-title">About Me</h2>
            <div class="about-content">
                <p>${personalInfo.summary || 'Passionate professional with expertise in various technologies and a commitment to delivering high-quality solutions.'}</p>
            </div>
        </div>
    </section>

    <!-- Dynamic Sections in Custom Order -->
    ${renderSectionByOrder(sectionOrder.portfolio)}

    <!-- Contact Section -->
    <section id="contact" class="contact-section">
        <div class="container">
            <h2 class="section-title">Get In Touch</h2>
            <div class="contact-content">
                <p style="font-size: 1.2rem; margin-bottom: 30px; color: ${safeColors.bodyText};">
                    Let's connect and discuss opportunities
                </p>
                <div class="contact-grid">
                    <div class="contact-item-large">
                        <i class="fas fa-envelope"></i>
                        <div>
                            <strong>Email</strong>
                            <br>
                            <a href="mailto:${personalInfo.email}">${personalInfo.email}</a>
                        </div>
                    </div>
                    <div class="contact-item-large">
                        <i class="fas fa-phone"></i>
                        <div>
                            <strong>Phone</strong>
                            <br>
                            <a href="tel:${personalInfo.phone}">${personalInfo.phone}</a>
                        </div>
                    </div>
                    <div class="contact-item-large">
                        <i class="fas fa-map-marker-alt"></i>
                        <div>
                            <strong>Location</strong>
                            <br>
                            ${personalInfo.location}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
        <div class="container">
            <p>&copy; ${new Date().getFullYear()} ${personalInfo.fullName}. All rights reserved.</p>
            <p style="margin-top: 10px; opacity: 0.8;">Built with ResumeForge</p>
        </div>
    </footer>

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

        // Add scroll animations
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

        // Observe all animated elements
        document.querySelectorAll('.timeline-item, .project-card, .skills-category, .about-content, .contact-content').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
            observer.observe(el);
        });

        // Add active navigation highlighting
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
                link.style.color = '${safeColors.bodyText}';
                link.style.background = 'transparent';
                if (link.getAttribute('href') === '#' + current) {
                    link.style.color = '${safeColors.primaryAccent}';
                    link.style.background = '${safeColors.primaryAccent}10';
                }
            });
        });

        // Add loading animation
        window.addEventListener('load', () => {
            document.body.style.opacity = '1';
        });

        // Initialize
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 0.5s ease-in';
    </script>
</body>
</html>
  `;

  return baseHTML;
};

export const downloadPortfolioHTML = (data: ResumeData, templateId: string): void => {
  const html = generatePortfolioHTML(data, templateId);
  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `${data.personalInfo.fullName.replace(/\s+/g, '_')}_portfolio.html`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
};