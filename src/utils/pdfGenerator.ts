import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import type { ResumeData } from '../types';

export const generateResumePDF = async (resumeData: ResumeData, templateId: string): Promise<void> => {
  try {
    // Create a temporary div with the resume content
    const resumeElement = document.createElement('div');
    resumeElement.innerHTML = generateResumeHTML(resumeData, templateId);
    resumeElement.style.width = '210mm'; // A4 width
    resumeElement.style.minHeight = '297mm'; // A4 height
    resumeElement.style.padding = '20mm';
    resumeElement.style.backgroundColor = 'white';
    resumeElement.style.position = 'absolute';
    resumeElement.style.left = '-9999px';
    resumeElement.style.top = '0';
    resumeElement.style.zIndex = '-1000';
    
    document.body.appendChild(resumeElement);

    // Wait for fonts to load
    await document.fonts.ready;

    // Convert to canvas with higher quality
    const canvas = await html2canvas(resumeElement, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: resumeData.customization.resume.colors.pageBackground,
      width: resumeElement.scrollWidth,
      height: resumeElement.scrollHeight,
      logging: false
    });

    // Create PDF
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgData = canvas.toDataURL('image/png', 1.0);
    
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    
    // Calculate aspect ratio to fit content properly
    const canvasAspectRatio = canvas.width / canvas.height;
    const pdfAspectRatio = pdfWidth / pdfHeight;
    
    let finalWidth = pdfWidth;
    let finalHeight = pdfHeight;
    
    if (canvasAspectRatio > pdfAspectRatio) {
      finalHeight = pdfWidth / canvasAspectRatio;
    } else {
      finalWidth = pdfHeight * canvasAspectRatio;
    }
    
    pdf.addImage(imgData, 'PNG', 0, 0, finalWidth, finalHeight);
    
    // Download the PDF
    pdf.save(`${resumeData.personalInfo.fullName.replace(/\s+/g, '_')}_Resume.pdf`);

    // Clean up
    document.body.removeChild(resumeElement);
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Failed to generate PDF');
  }
};

const generateResumeHTML = (data: ResumeData, templateId: string): string => {
  const { personalInfo, experience, education, projects, skills, sectionOrder, customization } = data;
  const resumeCustomization = customization.resume;
  
  // Safe fallbacks for customization
  const safeSpacing = resumeCustomization.spacing || { 
    sectionSpacing: '2rem', 
    paragraphSpacing: '1rem', 
    lineHeight: '1.6' 
  };
  const safeBorders = resumeCustomization.borders || { borderRadius: '8px' };
  
  // Base styles with proper customization
  const baseStyles = `
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Georgia:wght@400;700&family=Roboto:wght@400;500;700&family=Montserrat:wght@400;500;600;700&family=Lato:wght@400;700&family=Open+Sans:wght@400;600;700&family=Playfair+Display:wght@400;700&family=Poppins:wght@400;500;600;700&family=Source+Sans+Pro:wght@400;600;700&display=swap');
      
      * { 
        margin: 0; 
        padding: 0; 
        box-sizing: border-box; 
      }
      
      body { 
        font-family: '${resumeCustomization.fonts.bodyText}', sans-serif; 
        line-height: ${safeSpacing.lineHeight}; 
        color: ${resumeCustomization.colors.bodyText};
        background-color: ${resumeCustomization.colors.pageBackground};
        font-size: 14px;
      }
      
      .resume { 
        max-width: 800px; 
        margin: 0 auto; 
        background-color: ${resumeCustomization.colors.pageBackground};
        padding: 40px;
      }
      
      .header { 
        text-align: center; 
        margin-bottom: ${safeSpacing.sectionSpacing}; 
        padding: 30px;
        background-color: ${resumeCustomization.colors.headerBackground};
        border-radius: ${safeBorders.borderRadius};
      }
      
      .name { 
        font-size: 32px; 
        font-weight: bold; 
        margin-bottom: 10px; 
        color: ${resumeCustomization.colors.mainHeaderText};
        font-family: '${resumeCustomization.fonts.mainHeader}', sans-serif;
      }
      
      .contact { 
        font-size: 14px; 
        color: ${resumeCustomization.colors.contactText};
        font-family: '${resumeCustomization.fonts.contactInfo}', sans-serif;
        margin-bottom: 15px;
      }
      
      .summary {
        font-size: 16px;
        color: ${resumeCustomization.colors.bodyText};
        line-height: ${safeSpacing.lineHeight};
        max-width: 600px;
        margin: 0 auto;
      }
      
      .section { 
        margin-bottom: ${safeSpacing.sectionSpacing}; 
        background-color: ${resumeCustomization.colors.sectionBackground};
        padding: 25px;
        border-radius: ${safeBorders.borderRadius};
        border: 1px solid ${resumeCustomization.colors.borderColor};
      }
      
      .section-title { 
        font-size: 20px; 
        font-weight: bold; 
        border-bottom: 3px solid ${resumeCustomization.colors.primaryAccent}; 
        padding-bottom: 8px; 
        margin-bottom: 20px; 
        color: ${resumeCustomization.colors.sectionHeaderText};
        font-family: '${resumeCustomization.fonts.sectionHeaders}', sans-serif;
        text-transform: uppercase;
        letter-spacing: 1px;
      }
      
      .item { 
        margin-bottom: ${safeSpacing.paragraphSpacing}; 
        padding-bottom: 15px;
        border-bottom: 1px solid ${resumeCustomization.colors.dividerColor};
      }
      
      .item:last-child {
        border-bottom: none;
        margin-bottom: 0;
      }
      
      .item-header { 
        display: flex; 
        justify-content: space-between; 
        align-items: flex-start; 
        margin-bottom: 8px; 
        flex-wrap: wrap;
      }
      
      .item-title { 
        font-weight: bold; 
        color: ${resumeCustomization.colors.subHeaderText};
        font-family: '${resumeCustomization.fonts.subHeaders}', sans-serif;
        font-size: 16px;
      }
      
      .item-subtitle { 
        color: ${resumeCustomization.colors.bodyText}; 
        font-style: italic; 
        margin-top: 2px;
        font-size: 14px;
      }
      
      .item-date { 
        color: ${resumeCustomization.colors.dateText}; 
        font-size: 12px;
        font-family: '${resumeCustomization.fonts.dates}', sans-serif;
        font-weight: 500;
        white-space: nowrap;
      }
      
      .item-description {
        color: ${resumeCustomization.colors.bodyText};
        line-height: ${safeSpacing.lineHeight};
        margin-top: 8px;
        font-size: 14px;
      }
      
      .achievements {
        margin-top: 10px;
        margin-left: 20px;
      }
      
      .achievements li {
        color: ${resumeCustomization.colors.bodyText};
        margin-bottom: 4px;
        line-height: ${safeSpacing.lineHeight};
      }
      
      .skills-grid { 
        display: grid; 
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); 
        gap: 20px; 
      }
      
      .skill-category { 
        margin-bottom: 15px; 
      }
      
      .skill-category-title { 
        font-weight: bold; 
        margin-bottom: 8px; 
        color: ${resumeCustomization.colors.sectionHeaderText};
        font-family: '${resumeCustomization.fonts.sectionHeaders}', sans-serif;
        font-size: 14px;
      }
      
      .skill-list { 
        display: flex; 
        flex-wrap: wrap; 
        gap: 6px; 
      }
      
      .skill-tag { 
        background: ${resumeCustomization.colors.primaryAccent}20; 
        color: ${resumeCustomization.colors.primaryAccent};
        padding: 4px 12px; 
        border-radius: 15px; 
        font-size: 12px; 
        font-weight: 500;
        border: 1px solid ${resumeCustomization.colors.primaryAccent}40;
      }
      
      .projects-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 20px;
      }
      
      .project-card {
        background: ${resumeCustomization.colors.cardBackground};
        border: 1px solid ${resumeCustomization.colors.borderColor};
        border-radius: ${safeBorders.borderRadius};
        padding: 20px;
        box-shadow: 0 2px 4px ${resumeCustomization.colors.shadowColor};
      }
      
      .project-title {
        font-weight: bold;
        color: ${resumeCustomization.colors.subHeaderText};
        font-family: '${resumeCustomization.fonts.subHeaders}', sans-serif;
        margin-bottom: 8px;
        font-size: 16px;
      }
      
      .project-description {
        color: ${resumeCustomization.colors.bodyText};
        line-height: ${safeSpacing.lineHeight};
        margin-bottom: 12px;
        font-size: 14px;
      }
      
      .project-tech {
        font-weight: 500;
        color: ${resumeCustomization.colors.bodyText};
        margin-bottom: 8px;
        font-size: 13px;
      }
      
      .project-links {
        color: ${resumeCustomization.colors.linkText};
        font-size: 12px;
      }
      
      .link-separator {
        color: ${resumeCustomization.colors.bodyText};
        margin: 0 8px;
      }
    </style>
  `;

  const renderSectionByOrder = (sections: string[]) => {
    return sections.map(sectionId => {
      switch (sectionId) {
        case 'experience':
          return experience.length > 0 ? `
            <div class="section">
              <div class="section-title">Professional Experience</div>
              ${experience.map(exp => `
                <div class="item">
                  <div class="item-header">
                    <div>
                      <div class="item-title">${exp.position}</div>
                      <div class="item-subtitle">${exp.company}</div>
                    </div>
                    <div class="item-date">${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}</div>
                  </div>
                  <div class="item-description">${exp.description}</div>
                  ${exp.achievements.length > 0 ? `
                    <ul class="achievements">
                      ${exp.achievements.map(achievement => `<li>${achievement}</li>`).join('')}
                    </ul>
                  ` : ''}
                </div>
              `).join('')}
            </div>
          ` : '';

        case 'education':
          return education.length > 0 ? `
            <div class="section">
              <div class="section-title">Education</div>
              ${education.map(edu => `
                <div class="item">
                  <div class="item-header">
                    <div>
                      <div class="item-title">${edu.degree} in ${edu.field}</div>
                      <div class="item-subtitle">${edu.institution}</div>
                      ${edu.gpa ? `<div style="color: ${resumeCustomization.colors.bodyText}; font-size: 13px; margin-top: 4px;">GPA: ${edu.gpa}</div>` : ''}
                      ${edu.honors ? `<div style="color: ${resumeCustomization.colors.bodyText}; font-size: 13px; margin-top: 2px;">${edu.honors}</div>` : ''}
                    </div>
                    <div class="item-date">${edu.startDate} - ${edu.endDate}</div>
                  </div>
                </div>
              `).join('')}
            </div>
          ` : '';

        case 'projects':
          return projects.length > 0 ? `
            <div class="section">
              <div class="section-title">Projects</div>
              <div class="projects-grid">
                ${projects.map(project => `
                  <div class="project-card">
                    <div class="project-title">${project.name}</div>
                    <div class="project-description">${project.description}</div>
                    <div class="project-tech"><strong>Technologies:</strong> ${project.technologies.join(', ')}</div>
                    ${project.liveUrl || project.githubUrl ? `
                      <div class="project-links">
                        ${project.liveUrl ? `<strong>Live:</strong> ${project.liveUrl}` : ''}
                        ${project.liveUrl && project.githubUrl ? '<span class="link-separator">|</span>' : ''}
                        ${project.githubUrl ? `<strong>GitHub:</strong> ${project.githubUrl}` : ''}
                      </div>
                    ` : ''}
                  </div>
                `).join('')}
              </div>
            </div>
          ` : '';

        case 'skills':
          return skills.length > 0 ? `
            <div class="section">
              <div class="section-title">Skills & Expertise</div>
              <div class="skills-grid">
                ${['Technical', 'Soft', 'Language', 'Tool'].map(category => {
                  const categorySkills = skills.filter(skill => skill.category === category);
                  return categorySkills.length > 0 ? `
                    <div class="skill-category">
                      <div class="skill-category-title">${category} Skills</div>
                      <div class="skill-list">
                        ${categorySkills.map(skill => `
                          <span class="skill-tag">${skill.name}</span>
                        `).join('')}
                      </div>
                    </div>
                  ` : '';
                }).join('')}
              </div>
            </div>
          ` : '';

        default:
          return '';
      }
    }).join('');
  };

  return `
    ${baseStyles}
    <div class="resume">
      <div class="header">
        <div class="name">${personalInfo.fullName}</div>
        <div class="contact">
          ${personalInfo.email} • ${personalInfo.phone} • ${personalInfo.location}
          ${personalInfo.website ? ` • ${personalInfo.website}` : ''}
          ${personalInfo.linkedin ? ` • LinkedIn: ${personalInfo.linkedin}` : ''}
          ${personalInfo.github ? ` • GitHub: ${personalInfo.github}` : ''}
        </div>
        ${personalInfo.summary ? `
          <div class="summary">${personalInfo.summary}</div>
        ` : ''}
      </div>

      ${renderSectionByOrder(sectionOrder.resume)}
    </div>
  `;
};

export const exportToJSON = (data: ResumeData): void => {
  const dataStr = JSON.stringify(data, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `${data.personalInfo.fullName.replace(/\s+/g, '_')}_resume_data.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
};