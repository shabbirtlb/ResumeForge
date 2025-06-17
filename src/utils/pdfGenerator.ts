import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import type { ResumeData } from '../types';

export const generateResumePDF = async (resumeData: ResumeData, templateId: string): Promise<void> => {
  try {
    // Create a temporary container for the PDF content
    const pdfContainer = document.createElement('div');
    pdfContainer.innerHTML = generatePDFHTML(resumeData);
    
    // Style the container for PDF generation
    pdfContainer.style.position = 'fixed';
    pdfContainer.style.top = '-10000px';
    pdfContainer.style.left = '-10000px';
    pdfContainer.style.width = '794px'; // A4 width in pixels at 96 DPI
    pdfContainer.style.minHeight = '1123px'; // A4 height in pixels at 96 DPI
    pdfContainer.style.backgroundColor = 'white';
    pdfContainer.style.padding = '0';
    pdfContainer.style.margin = '0';
    pdfContainer.style.fontFamily = 'Arial, sans-serif';
    pdfContainer.style.fontSize = '14px';
    pdfContainer.style.lineHeight = '1.4';
    pdfContainer.style.color = '#000000';
    
    document.body.appendChild(pdfContainer);

    // Wait for any fonts to load
    await new Promise(resolve => setTimeout(resolve, 500));

    // Generate canvas from the container
    const canvas = await html2canvas(pdfContainer, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      width: 794,
      height: Math.max(1123, pdfContainer.scrollHeight),
      logging: false,
      removeContainer: false
    });

    // Create PDF
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const imgData = canvas.toDataURL('image/png', 1.0);
    const pdfWidth = 210; // A4 width in mm
    const pdfHeight = 297; // A4 height in mm
    
    // Calculate the height needed for the content
    const imgHeight = (canvas.height * pdfWidth) / canvas.width;
    
    if (imgHeight <= pdfHeight) {
      // Content fits on one page
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, imgHeight);
    } else {
      // Content needs multiple pages
      let position = 0;
      const pageHeight = pdfHeight;
      
      while (position < imgHeight) {
        if (position > 0) {
          pdf.addPage();
        }
        
        const remainingHeight = imgHeight - position;
        const currentPageHeight = Math.min(pageHeight, remainingHeight);
        
        pdf.addImage(imgData, 'PNG', 0, -position, pdfWidth, imgHeight);
        position += pageHeight;
      }
    }

    // Download the PDF
    const fileName = `${resumeData.personalInfo.fullName.replace(/\s+/g, '_')}_Resume.pdf`;
    pdf.save(fileName);

    // Clean up
    document.body.removeChild(pdfContainer);
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Failed to generate PDF. Please try again.');
  }
};

const generatePDFHTML = (data: ResumeData): string => {
  const { personalInfo, experience, education, projects, skills, sectionOrder, customization } = data;
  const resumeCustomization = customization.resume;
  
  // Use safe fallbacks
  const safeSpacing = resumeCustomization.spacing || { 
    sectionSpacing: '24px', 
    paragraphSpacing: '12px', 
    lineHeight: '1.4' 
  };
  const safeBorders = resumeCustomization.borders || { borderRadius: '6px' };
  
  const renderSectionByOrder = (sections: string[]) => {
    return sections.map(sectionId => {
      switch (sectionId) {
        case 'experience':
          return experience.length > 0 ? `
            <div class="section">
              <h2 class="section-title">PROFESSIONAL EXPERIENCE</h2>
              ${experience.map(exp => `
                <div class="experience-item">
                  <div class="experience-header">
                    <div class="experience-left">
                      <h3 class="position">${exp.position}</h3>
                      <div class="company">${exp.company}</div>
                    </div>
                    <div class="experience-right">
                      <div class="date">${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}</div>
                    </div>
                  </div>
                  <div class="description">${exp.description}</div>
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
              <h2 class="section-title">EDUCATION</h2>
              ${education.map(edu => `
                <div class="education-item">
                  <div class="education-header">
                    <div class="education-left">
                      <h3 class="degree">${edu.degree} in ${edu.field}</h3>
                      <div class="institution">${edu.institution}</div>
                      ${edu.gpa ? `<div class="gpa">GPA: ${edu.gpa}</div>` : ''}
                      ${edu.honors ? `<div class="honors">${edu.honors}</div>` : ''}
                    </div>
                    <div class="education-right">
                      <div class="date">${edu.startDate} - ${edu.endDate}</div>
                    </div>
                  </div>
                </div>
              `).join('')}
            </div>
          ` : '';

        case 'projects':
          return projects.length > 0 ? `
            <div class="section">
              <h2 class="section-title">PROJECTS</h2>
              <div class="projects-grid">
                ${projects.map(project => `
                  <div class="project-item">
                    <h3 class="project-name">${project.name}</h3>
                    <div class="project-description">${project.description}</div>
                    <div class="project-tech"><strong>Technologies:</strong> ${project.technologies.join(', ')}</div>
                    ${project.liveUrl || project.githubUrl ? `
                      <div class="project-links">
                        ${project.liveUrl ? `<span><strong>Live:</strong> ${project.liveUrl}</span>` : ''}
                        ${project.liveUrl && project.githubUrl ? ' | ' : ''}
                        ${project.githubUrl ? `<span><strong>GitHub:</strong> ${project.githubUrl}</span>` : ''}
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
              <h2 class="section-title">SKILLS</h2>
              <div class="skills-container">
                ${['Technical', 'Soft', 'Language', 'Tool'].map(category => {
                  const categorySkills = skills.filter(skill => skill.category === category);
                  return categorySkills.length > 0 ? `
                    <div class="skills-category">
                      <h4 class="skills-category-title">${category} Skills</h4>
                      <div class="skills-list">
                        ${categorySkills.map(skill => `<span class="skill-tag">${skill.name}</span>`).join('')}
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
    <style>
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      
      body {
        font-family: 'Arial', sans-serif;
        font-size: 14px;
        line-height: 1.4;
        color: #333333;
        background: white;
      }
      
      .pdf-container {
        width: 794px;
        min-height: 1123px;
        padding: 40px;
        background: white;
        margin: 0;
      }
      
      .header {
        text-align: center;
        margin-bottom: 30px;
        padding: 25px;
        background: #f8f9fa;
        border-radius: 8px;
        border: 1px solid #e9ecef;
      }
      
      .name {
        font-size: 28px;
        font-weight: bold;
        color: #2c3e50;
        margin-bottom: 8px;
        letter-spacing: 1px;
      }
      
      .contact-info {
        font-size: 13px;
        color: #555555;
        margin-bottom: 15px;
        line-height: 1.3;
      }
      
      .summary {
        font-size: 14px;
        color: #444444;
        line-height: 1.5;
        max-width: 600px;
        margin: 0 auto;
        text-align: center;
      }
      
      .section {
        margin-bottom: 25px;
        page-break-inside: avoid;
      }
      
      .section-title {
        font-size: 16px;
        font-weight: bold;
        color: #2c3e50;
        text-transform: uppercase;
        letter-spacing: 1.5px;
        border-bottom: 2px solid #3498db;
        padding-bottom: 6px;
        margin-bottom: 18px;
      }
      
      .experience-item,
      .education-item {
        margin-bottom: 20px;
        padding-bottom: 15px;
        border-bottom: 1px solid #e9ecef;
      }
      
      .experience-item:last-child,
      .education-item:last-child {
        border-bottom: none;
        margin-bottom: 0;
      }
      
      .experience-header,
      .education-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 8px;
      }
      
      .experience-left,
      .education-left {
        flex: 1;
      }
      
      .experience-right,
      .education-right {
        text-align: right;
        min-width: 120px;
      }
      
      .position,
      .degree {
        font-size: 15px;
        font-weight: bold;
        color: #2c3e50;
        margin-bottom: 3px;
      }
      
      .company,
      .institution {
        font-size: 13px;
        color: #7f8c8d;
        font-style: italic;
        margin-bottom: 2px;
      }
      
      .date {
        font-size: 12px;
        color: #95a5a6;
        font-weight: 500;
      }
      
      .description {
        font-size: 13px;
        color: #444444;
        line-height: 1.4;
        margin-top: 8px;
      }
      
      .achievements {
        margin-top: 8px;
        margin-left: 18px;
      }
      
      .achievements li {
        font-size: 13px;
        color: #444444;
        margin-bottom: 3px;
        line-height: 1.3;
      }
      
      .gpa,
      .honors {
        font-size: 12px;
        color: #555555;
        margin-top: 2px;
      }
      
      .projects-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 20px;
      }
      
      .project-item {
        background: #f8f9fa;
        padding: 15px;
        border-radius: 6px;
        border: 1px solid #e9ecef;
      }
      
      .project-name {
        font-size: 14px;
        font-weight: bold;
        color: #2c3e50;
        margin-bottom: 6px;
      }
      
      .project-description {
        font-size: 12px;
        color: #444444;
        line-height: 1.3;
        margin-bottom: 8px;
      }
      
      .project-tech {
        font-size: 11px;
        color: #555555;
        margin-bottom: 6px;
      }
      
      .project-links {
        font-size: 10px;
        color: #3498db;
      }
      
      .skills-container {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 20px;
      }
      
      .skills-category {
        margin-bottom: 15px;
      }
      
      .skills-category-title {
        font-size: 13px;
        font-weight: bold;
        color: #2c3e50;
        margin-bottom: 8px;
      }
      
      .skills-list {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
      }
      
      .skill-tag {
        background: #ecf0f1;
        color: #2c3e50;
        padding: 4px 10px;
        border-radius: 12px;
        font-size: 11px;
        font-weight: 500;
        border: 1px solid #bdc3c7;
      }
      
      @media print {
        .pdf-container {
          width: 100%;
          padding: 20px;
        }
        
        .section {
          page-break-inside: avoid;
        }
        
        .experience-item,
        .education-item,
        .project-item {
          page-break-inside: avoid;
        }
      }
    </style>
    
    <div class="pdf-container">
      <div class="header">
        <div class="name">${personalInfo.fullName}</div>
        <div class="contact-info">
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