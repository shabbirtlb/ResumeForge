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
    
    document.body.appendChild(resumeElement);

    // Convert to canvas
    const canvas = await html2canvas(resumeElement, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff'
    });

    // Create PDF
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgData = canvas.toDataURL('image/png');
    
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    
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
  
  // Base styles with customization
  const baseStyles = `
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Georgia:wght@400;700&family=Roboto:wght@400;500;700&family=Montserrat:wght@400;500;600;700&family=Lato:wght@400;700&family=Open+Sans:wght@400;600;700&family=Playfair+Display:wght@400;700&display=swap');
      
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body { 
        font-family: '${customization.resume.fonts.body}', sans-serif; 
        line-height: 1.6; 
        color: ${customization.resume.colors.bodyText};
        background-color: ${customization.resume.colors.backgroundColor};
      }
      .resume { max-width: 800px; margin: 0 auto; }
      .header { text-align: center; margin-bottom: 30px; }
      .name { 
        font-size: 28px; 
        font-weight: bold; 
        margin-bottom: 10px; 
        color: ${customization.resume.colors.headerText};
        font-family: '${customization.resume.fonts.header}', sans-serif;
      }
      .contact { font-size: 14px; color: ${customization.resume.colors.bodyText}; }
      .section { 
        margin-bottom: 25px; 
        background-color: ${customization.resume.colors.sectionBackground};
        padding: 20px;
        border-radius: 8px;
        border: 1px solid ${customization.resume.colors.borderColor};
      }
      .section-title { 
        font-size: 18px; 
        font-weight: bold; 
        border-bottom: 2px solid ${customization.resume.colors.accentColor}; 
        padding-bottom: 5px; 
        margin-bottom: 15px; 
        color: ${customization.resume.colors.headerText};
        font-family: '${customization.resume.fonts.header}', sans-serif;
      }
      .item { margin-bottom: 15px; }
      .item-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px; }
      .item-title { 
        font-weight: bold; 
        color: ${customization.resume.colors.accentColor};
      }
      .item-subtitle { color: ${customization.resume.colors.bodyText}; font-style: italic; }
      .item-date { color: ${customization.resume.colors.bodyText}; font-size: 14px; }
      .skills-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 10px; }
      .skill-category { margin-bottom: 10px; }
      .skill-category-title { 
        font-weight: bold; 
        margin-bottom: 5px; 
        color: ${customization.resume.colors.headerText};
      }
      .skill-list { display: flex; flex-wrap: wrap; gap: 5px; }
      .skill-tag { 
        background: ${customization.resume.colors.accentColor}20; 
        color: ${customization.resume.colors.accentColor};
        padding: 2px 8px; 
        border-radius: 12px; 
        font-size: 12px; 
      }
    </style>
  `;

  // Template-specific styles
  const templateStyles = getTemplateStyles(templateId, customization.resume);

  const renderSectionByOrder = (sections: string[]) => {
    return sections.map(sectionId => {
      switch (sectionId) {
        case 'experience':
          return experience.length > 0 ? `
            <div class="section">
              <div class="section-title">Experience</div>
              ${experience.map(exp => `
                <div class="item">
                  <div class="item-header">
                    <div>
                      <div class="item-title">${exp.position}</div>
                      <div class="item-subtitle">${exp.company}</div>
                    </div>
                    <div class="item-date">${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}</div>
                  </div>
                  <p>${exp.description}</p>
                  ${exp.achievements.length > 0 ? `
                    <ul style="margin-left: 20px; margin-top: 5px;">
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
                    </div>
                    <div class="item-date">${edu.startDate} - ${edu.endDate}</div>
                  </div>
                  ${edu.gpa ? `<p>GPA: ${edu.gpa}</p>` : ''}
                  ${edu.honors ? `<p>${edu.honors}</p>` : ''}
                </div>
              `).join('')}
            </div>
          ` : '';

        case 'projects':
          return projects.length > 0 ? `
            <div class="section">
              <div class="section-title">Projects</div>
              ${projects.map(project => `
                <div class="item">
                  <div class="item-title">${project.name}</div>
                  <p>${project.description}</p>
                  <p><strong>Technologies:</strong> ${project.technologies.join(', ')}</p>
                  ${project.liveUrl || project.githubUrl ? `
                    <p>
                      ${project.liveUrl ? `<strong>Live:</strong> ${project.liveUrl}` : ''}
                      ${project.liveUrl && project.githubUrl ? ' | ' : ''}
                      ${project.githubUrl ? `<strong>GitHub:</strong> ${project.githubUrl}` : ''}
                    </p>
                  ` : ''}
                </div>
              `).join('')}
            </div>
          ` : '';

        case 'skills':
          return skills.length > 0 ? `
            <div class="section">
              <div class="section-title">Skills</div>
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
    ${templateStyles}
    <div class="resume">
      <div class="header">
        <div class="name">${personalInfo.fullName}</div>
        <div class="contact">
          ${personalInfo.email} | ${personalInfo.phone} | ${personalInfo.location}
          ${personalInfo.website ? ` | ${personalInfo.website}` : ''}
          ${personalInfo.linkedin ? ` | LinkedIn: ${personalInfo.linkedin}` : ''}
          ${personalInfo.github ? ` | GitHub: ${personalInfo.github}` : ''}
        </div>
      </div>

      ${personalInfo.summary ? `
        <div class="section">
          <div class="section-title">Professional Summary</div>
          <p>${personalInfo.summary}</p>
        </div>
      ` : ''}

      ${renderSectionByOrder(sectionOrder.resume)}
    </div>
  `;
};

const getTemplateStyles = (templateId: string, customization: any): string => {
  // Template styles now work with customization
  switch (templateId) {
    case 'modern-blue':
      return `
        <style>
          .section { box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
          .name { text-shadow: 1px 1px 2px rgba(0,0,0,0.1); }
        </style>
      `;
    case 'classic-black':
      return `
        <style>
          .section { border: 2px solid ${customization.colors.borderColor}; }
          .section-title { text-transform: uppercase; letter-spacing: 1px; }
        </style>
      `;
    case 'creative-gradient':
      return `
        <style>
          .header { 
            background: linear-gradient(135deg, ${customization.colors.accentColor} 0%, ${customization.colors.headerText} 100%); 
            color: white; 
            padding: 20px; 
            border-radius: 10px; 
            margin-bottom: 30px;
          }
          .name { color: white !important; }
          .contact { color: rgba(255,255,255,0.9) !important; }
        </style>
      `;
    case 'minimal-white':
      return `
        <style>
          .section { border: none; background: transparent; padding: 15px 0; }
          .section-title { border-bottom: 1px solid ${customization.colors.borderColor}; }
        </style>
      `;
    default:
      return '';
  }
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