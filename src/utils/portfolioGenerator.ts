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
  const portfolioFonts = portfolioCustomization.fonts || {
    mainHeader: 'Inter',
    sectionHeaders: 'Inter',
    subHeaders: 'Inter',
    bodyText: 'Inter',
    contactInfo: 'Inter',
    dates: 'Inter'
  };
  const portfolioColors = portfolioCustomization.colors || {
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
  const portfolioLayout = safeLayout;

  // Get available skill categories
  const availableCategories = ['Technical', 'Soft', 'Language', 'Tool'].filter(category => 
    skills.some(skill => skill.category === category)
  );

  return `<!DOCTYPE html>
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
        
        /* Timeline */
        .timeline {
            max-width: 800px;
            margin: 0 auto;
        }
        
        .timeline-item {
            background: ${portfolioColors.cardBackground};
            padding: 30px;
            margin-bottom: 30px;
            border-radius: ${safeBorders.borderRadius};
            box-shadow: 0 5px 15px rgba(0,0,0,0.08);
            border-left: 4px solid ${portfolioColors.primaryAccent};
        }
        
        .timeline-item h3 {
            color: ${portfolioColors.subHeaderText};
            margin-bottom: 5px;
            font-family: '${portfolioFonts.subHeaders}', sans-serif;
        }
        
        .timeline-item .company {
            color: ${portfolioColors.bodyText};
            font-style: italic;
            margin-bottom: 10px;
        }
        
        .timeline-item .date {
            color: ${portfolioColors.dateText};
            font-size: 0.9rem;
            margin-bottom: 15px;
            font-family: '${portfolioFonts.dates}', sans-serif;
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