import type { ResumeData } from '../types';

export const generatePortfolioHTML = (data: ResumeData, templateId: string): string => {
  const { personalInfo, experience, education, projects, skills, sectionOrder, customization } = data;

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
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Georgia:wght@400;700&family=Roboto:wght@400;500;700&family=Montserrat:wght@400;500;600;700&family=Lato:wght@400;700&family=Open+Sans:wght@400;600;700&family=Playfair+Display:wght@400;700&display=swap" rel="stylesheet">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: '${customization.portfolio.fonts.body}', sans-serif;
            line-height: 1.6;
            color: ${customization.portfolio.colors.bodyText};
            background-color: ${customization.portfolio.colors.backgroundColor};
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 20px;
        }
        
        /* Header */
        .header {
            background: ${customization.portfolio.colors.heroBackground};
            color: ${customization.portfolio.colors.headerText};
            padding: 100px 0;
            text-align: center;
        }
        
        .header h1 {
            font-size: 3rem;
            margin-bottom: 10px;
            font-weight: 300;
            font-family: '${customization.portfolio.fonts.header}', sans-serif;
        }
        
        .header p {
            font-size: 1.2rem;
            margin-bottom: 30px;
            opacity: 0.9;
        }
        
        .social-links {
            display: flex;
            justify-content: center;
            gap: 20px;
            margin-top: 30px;
            flex-wrap: wrap;
        }
        
        .social-links a {
            color: ${customization.portfolio.colors.headerText};
            font-size: 1.5rem;
            transition: transform 0.3s ease;
        }
        
        .social-links a:hover {
            transform: translateY(-3px);
        }
        
        /* Navigation */
        .nav {
            background: ${customization.portfolio.colors.cardBackground};
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            position: sticky;
            top: 0;
            z-index: 100;
            border-bottom: 1px solid ${customization.portfolio.colors.borderColor};
        }
        
        .nav ul {
            list-style: none;
            display: flex;
            justify-content: center;
            padding: 20px 0;
            flex-wrap: wrap;
        }
        
        .nav li {
            margin: 0 15px;
        }
        
        .nav a {
            text-decoration: none;
            color: ${customization.portfolio.colors.bodyText};
            font-weight: 500;
            transition: color 0.3s ease;
        }
        
        .nav a:hover {
            color: ${customization.portfolio.colors.accentColor};
        }
        
        /* Sections */
        .section {
            padding: 80px 0;
            background-color: ${customization.portfolio.colors.sectionBackground};
        }
        
        .section:nth-child(even) {
            background: ${customization.portfolio.colors.backgroundColor};
        }
        
        .section-title {
            text-align: center;
            font-size: 2.5rem;
            margin-bottom: 50px;
            color: ${customization.portfolio.colors.headerText};
            font-family: '${customization.portfolio.fonts.header}', sans-serif;
        }
        
        /* About */
        .about-content {
            max-width: 800px;
            margin: 0 auto;
            text-align: center;
            font-size: 1.1rem;
            line-height: 1.8;
            color: ${customization.portfolio.colors.bodyText};
        }
        
        /* Timeline */
        .timeline {
            max-width: 800px;
            margin: 0 auto;
        }
        
        .timeline-item {
            background: ${customization.portfolio.colors.cardBackground};
            padding: 30px;
            margin-bottom: 30px;
            border-radius: 10px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
            border-left: 4px solid ${customization.portfolio.colors.accentColor};
        }
        
        .timeline-item h3 {
            color: ${customization.portfolio.colors.accentColor};
            margin-bottom: 5px;
            font-family: '${customization.portfolio.fonts.header}', sans-serif;
        }
        
        .timeline-item .company {
            color: ${customization.portfolio.colors.bodyText};
            font-style: italic;
            margin-bottom: 10px;
        }
        
        .timeline-item .date {
            color: ${customization.portfolio.colors.bodyText};
            opacity: 0.7;
            font-size: 0.9rem;
            margin-bottom: 15px;
        }
        
        /* Projects */
        .projects-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
            gap: 30px;
            margin-top: 50px;
        }
        
        .project-card {
            background: ${customization.portfolio.colors.cardBackground};
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
            transition: transform 0.3s ease;
            border: 1px solid ${customization.portfolio.colors.borderColor};
        }
        
        .project-card:hover {
            transform: translateY(-5px);
        }
        
        .project-image {
            height: 200px;
            background: ${customization.portfolio.colors.accentColor};
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 3rem;
        }
        
        .project-content {
            padding: 25px;
        }
        
        .project-content h3 {
            margin-bottom: 10px;
            color: ${customization.portfolio.colors.headerText};
            font-family: '${customization.portfolio.fonts.header}', sans-serif;
        }
        
        .project-content p {
            color: ${customization.portfolio.colors.bodyText};
            margin-bottom: 15px;
        }
        
        .tech-tags {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            margin-bottom: 20px;
        }
        
        .tech-tag {
            background: ${customization.portfolio.colors.accentColor}20;
            color: ${customization.portfolio.colors.accentColor};
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 0.8rem;
        }
        
        .project-links {
            display: flex;
            gap: 15px;
        }
        
        .project-links a {
            color: ${customization.portfolio.colors.accentColor};
            text-decoration: none;
            font-weight: 500;
        }
        
        /* Skills */
        .skills-container {
            max-width: 800px;
            margin: 0 auto;
        }
        
        .skills-category {
            margin-bottom: 40px;
        }
        
        .skills-category h3 {
            margin-bottom: 20px;
            color: ${customization.portfolio.colors.headerText};
            font-family: '${customization.portfolio.fonts.header}', sans-serif;
        }
        
        .skills-list {
            display: flex;
            flex-wrap: wrap;
            gap: 15px;
        }
        
        .skill-item {
            background: ${customization.portfolio.colors.cardBackground};
            padding: 15px 25px;
            border-radius: 25px;
            box-shadow: 0 3px 10px rgba(0,0,0,0.1);
            font-weight: 500;
            color: ${customization.portfolio.colors.bodyText};
            border: 1px solid ${customization.portfolio.colors.borderColor};
        }
        
        /* Contact */
        .contact-info {
            text-align: center;
            max-width: 600px;
            margin: 0 auto;
        }
        
        .contact-item {
            margin-bottom: 20px;
            font-size: 1.1rem;
            color: ${customization.portfolio.colors.bodyText};
        }
        
        .contact-item i {
            color: ${customization.portfolio.colors.accentColor};
            margin-right: 10px;
            width: 20px;
        }
        
        .contact-item a {
            color: ${customization.portfolio.colors.accentColor};
            text-decoration: none;
        }
        
        /* Footer */
        .footer {
            background: ${customization.portfolio.colors.headerText};
            color: white;
            text-align: center;
            padding: 30px 0;
        }
        
        /* Responsive */
        @media (max-width: 768px) {
            .header h1 {
                font-size: 2rem;
            }
            
            .nav ul {
                flex-direction: column;
                gap: 10px;
            }
            
            .nav li {
                margin: 0;
            }
            
            .projects-grid {
                grid-template-columns: 1fr;
            }
            
            .social-links {
                flex-wrap: wrap;
            }
            
            .section {
                padding: 40px 0;
            }
        }
    </style>
</head>
<body>
    <!-- Header -->
    <header class="header">
        <div class="container">
            <h1>${personalInfo.fullName}</h1>
            <p>${personalInfo.summary || 'Professional Portfolio'}</p>
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
            
            <div class="social-links">
                ${personalInfo.website ? `<a href="${personalInfo.website}" target="_blank"><i class="fas fa-globe"></i></a>` : ''}
                ${personalInfo.linkedin ? `<a href="${personalInfo.linkedin}" target="_blank"><i class="fab fa-linkedin"></i></a>` : ''}
                ${personalInfo.github ? `<a href="${personalInfo.github}" target="_blank"><i class="fab fa-github"></i></a>` : ''}
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
    <section id="contact" class="section">
        <div class="container">
            <h2 class="section-title">Get In Touch</h2>
            <div class="contact-info">
                <div class="contact-item">
                    <i class="fas fa-envelope"></i>
                    <a href="mailto:${personalInfo.email}">${personalInfo.email}</a>
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
        </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
        <div class="container">
            <p>&copy; ${new Date().getFullYear()} ${personalInfo.fullName}. All rights reserved.</p>
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
                        behavior: 'smooth'
                    });
                }
            });
        });
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