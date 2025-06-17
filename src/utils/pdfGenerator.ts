import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import type { ResumeData } from '../types';

// New function to generate PDF from exact preview HTML
export const generateResumePDFFromPreview = async (previewElement: HTMLElement, fullName: string): Promise<void> => {
  try {
    // Clone the preview element to avoid modifying the original
    const clonedElement = previewElement.cloneNode(true) as HTMLElement;
    
    // Create a temporary container for PDF generation
    const pdfContainer = document.createElement('div');
    pdfContainer.appendChild(clonedElement);
    
    // Style the container for optimal PDF generation
    pdfContainer.style.position = 'fixed';
    pdfContainer.style.top = '-10000px';
    pdfContainer.style.left = '-10000px';
    pdfContainer.style.width = '794px'; // A4 width in pixels at 96 DPI
    pdfContainer.style.backgroundColor = 'white';
    pdfContainer.style.padding = '40px';
    pdfContainer.style.margin = '0';
    pdfContainer.style.overflow = 'visible';
    pdfContainer.style.zIndex = '-1000';
    pdfContainer.style.fontFamily = 'Arial, sans-serif';
    
    // Apply additional styles to the cloned content
    clonedElement.style.width = '100%';
    clonedElement.style.maxWidth = 'none';
    clonedElement.style.margin = '0';
    clonedElement.style.padding = '0';
    clonedElement.style.backgroundColor = 'white';
    
    // Ensure all fonts are loaded and styles are applied
    const allStyles = Array.from(document.styleSheets)
      .map(styleSheet => {
        try {
          return Array.from(styleSheet.cssRules)
            .map(rule => rule.cssText)
            .join('\n');
        } catch (e) {
          return '';
        }
      })
      .join('\n');
    
    // Add styles to the container
    const styleElement = document.createElement('style');
    styleElement.textContent = `
      ${allStyles}
      
      /* PDF-specific optimizations */
      * {
        -webkit-print-color-adjust: exact !important;
        color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
      
      /* Ensure proper bullet points */
      ul {
        list-style-type: disc !important;
        margin-left: 20px !important;
        padding-left: 0 !important;
      }
      
      li {
        display: list-item !important;
        list-style-type: disc !important;
        margin-bottom: 4px !important;
      }
      
      /* Fix text alignment and spacing */
      .text-center { text-align: center !important; }
      .text-left { text-align: left !important; }
      .text-right { text-align: right !important; }
      
      /* Ensure proper spacing */
      .mb-2 { margin-bottom: 0.5rem !important; }
      .mb-4 { margin-bottom: 1rem !important; }
      .mb-8 { margin-bottom: 2rem !important; }
      .space-y-1 > * + * { margin-top: 0.25rem !important; }
      .space-y-6 > * + * { margin-top: 1.5rem !important; }
      
      /* Grid layouts for PDF */
      .grid { display: grid !important; }
      .md\\:grid-cols-2 { grid-template-columns: repeat(2, 1fr) !important; }
      .gap-6 { gap: 1.5rem !important; }
      .gap-2 { gap: 0.5rem !important; }
      
      /* Flexbox layouts */
      .flex { display: flex !important; }
      .flex-wrap { flex-wrap: wrap !important; }
      .justify-between { justify-content: space-between !important; }
      .justify-center { justify-content: center !important; }
      .items-start { align-items: flex-start !important; }
      .items-center { align-items: center !important; }
      .space-x-4 > * + * { margin-left: 1rem !important; }
      .space-x-6 > * + * { margin-left: 1.5rem !important; }
      
      /* Typography */
      .text-4xl { font-size: 2.25rem !important; line-height: 2.5rem !important; }
      .text-2xl { font-size: 1.5rem !important; line-height: 2rem !important; }
      .text-lg { font-size: 1.125rem !important; line-height: 1.75rem !important; }
      .text-sm { font-size: 0.875rem !important; line-height: 1.25rem !important; }
      .text-xs { font-size: 0.75rem !important; line-height: 1rem !important; }
      .font-bold { font-weight: 700 !important; }
      .font-semibold { font-weight: 600 !important; }
      .italic { font-style: italic !important; }
      
      /* Borders and backgrounds */
      .border { border-width: 1px !important; }
      .border-b-2 { border-bottom-width: 2px !important; }
      .rounded-lg { border-radius: 0.5rem !important; }
      .rounded-full { border-radius: 9999px !important; }
      
      /* Padding and margins */
      .p-2 { padding: 0.5rem !important; }
      .p-4 { padding: 1rem !important; }
      .p-6 { padding: 1.5rem !important; }
      .p-8 { padding: 2rem !important; }
      .px-2 { padding-left: 0.5rem !important; padding-right: 0.5rem !important; }
      .px-3 { padding-left: 0.75rem !important; padding-right: 0.75rem !important; }
      .py-1 { padding-top: 0.25rem !important; padding-bottom: 0.25rem !important; }
      .pb-2 { padding-bottom: 0.5rem !important; }
      
      /* Remove any hover effects for PDF */
      *:hover {
        transform: none !important;
        box-shadow: inherit !important;
      }
      
      /* Ensure proper page breaks */
      .mb-8 {
        page-break-inside: avoid !important;
      }
    `;
    
    pdfContainer.appendChild(styleElement);
    document.body.appendChild(pdfContainer);

    // Wait for fonts and rendering
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Calculate the actual content height
    const contentHeight = Math.max(
      pdfContainer.scrollHeight, 
      pdfContainer.offsetHeight, 
      clonedElement.scrollHeight,
      1123 // Minimum A4 height
    );
    
    // Generate canvas from the container
    const canvas = await html2canvas(pdfContainer, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      width: 794,
      height: contentHeight,
      logging: false,
      removeContainer: false,
      foreignObjectRendering: true,
      onclone: (clonedDoc) => {
        // Ensure all styles are properly applied in the cloned document
        const clonedContainer = clonedDoc.querySelector('div');
        if (clonedContainer) {
          clonedContainer.style.width = '794px';
          clonedContainer.style.backgroundColor = 'white';
          clonedContainer.style.padding = '40px';
          clonedContainer.style.margin = '0';
          clonedContainer.style.fontFamily = 'Arial, sans-serif';
        }
        
        // Fix bullet points in cloned document
        const lists = clonedDoc.querySelectorAll('ul');
        lists.forEach(list => {
          list.style.listStyleType = 'disc';
          list.style.marginLeft = '20px';
          list.style.paddingLeft = '0';
        });
        
        const listItems = clonedDoc.querySelectorAll('li');
        listItems.forEach(item => {
          item.style.display = 'list-item';
          item.style.listStyleType = 'disc';
          item.style.marginBottom = '4px';
        });
      }
    });

    // Create PDF
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true
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
    const fileName = `${fullName.replace(/\s+/g, '_')}_Resume.pdf`;
    pdf.save(fileName);

    // Clean up
    document.body.removeChild(pdfContainer);
  } catch (error) {
    console.error('Error generating PDF from preview:', error);
    throw new Error('Failed to generate PDF. Please try again.');
  }
};

// Legacy function - kept for backward compatibility but now uses the new approach
export const generateResumePDF = async (resumeData: ResumeData, templateId: string): Promise<void> => {
  // This function is kept for backward compatibility but should not be used
  // The new approach extracts HTML directly from the preview
  console.warn('generateResumePDF is deprecated. Use generateResumePDFFromPreview instead.');
  
  // Fallback to old method if needed
  try {
    const pdfContainer = document.createElement('div');
    pdfContainer.innerHTML = generatePDFHTML(resumeData);
    
    pdfContainer.style.position = 'fixed';
    pdfContainer.style.top = '-10000px';
    pdfContainer.style.left = '-10000px';
    pdfContainer.style.width = '794px';
    pdfContainer.style.backgroundColor = 'white';
    pdfContainer.style.padding = '0';
    pdfContainer.style.margin = '0';
    pdfContainer.style.overflow = 'visible';
    pdfContainer.style.zIndex = '-1000';
    
    document.body.appendChild(pdfContainer);
    await new Promise(resolve => setTimeout(resolve, 1000));

    const contentHeight = Math.max(pdfContainer.scrollHeight, pdfContainer.offsetHeight, 1123);
    
    const canvas = await html2canvas(pdfContainer, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      width: 794,
      height: contentHeight,
      logging: false,
      removeContainer: false,
    });

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const imgData = canvas.toDataURL('image/png', 1.0);
    const pdfWidth = 210;
    const pdfHeight = 297;
    const imgHeight = (canvas.height * pdfWidth) / canvas.width;
    
    if (imgHeight <= pdfHeight) {
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, imgHeight);
    } else {
      let position = 0;
      const pageHeight = pdfHeight;
      
      while (position < imgHeight) {
        if (position > 0) {
          pdf.addPage();
        }
        pdf.addImage(imgData, 'PNG', 0, -position, pdfWidth, imgHeight);
        position += pageHeight;
      }
    }

    const fileName = `${resumeData.personalInfo.fullName.replace(/\s+/g, '_')}_Resume.pdf`;
    pdf.save(fileName);
    document.body.removeChild(pdfContainer);
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Failed to generate PDF. Please try again.');
  }
};

const generatePDFHTML = (data: ResumeData): string => {
  const { personalInfo, experience, education, projects, skills, sectionOrder, customization } = data;
  const resumeCustomization = customization.resume;
  
  // Use safe fallbacks for customization - exact same logic as preview
  const safeSpacing = resumeCustomization.spacing || { 
    sectionSpacing: '2rem', 
    paragraphSpacing: '1rem', 
    lineHeight: '1.6' 
  };
  const safeBorders = resumeCustomization.borders || { borderRadius: '8px' };
  const safeFonts = resumeCustomization.fonts || {
    mainHeader: 'Inter',
    sectionHeaders: 'Inter',
    subHeaders: 'Inter',
    bodyText: 'Inter',
    contactInfo: 'Inter',
    dates: 'Inter'
  };
  const safeColors = resumeCustomization.colors || {
    mainHeaderText: '#1f2937',
    sectionHeaderText: '#374151',
    subHeaderText: '#4b5563',
    bodyText: '#6b7280',
    contactText: '#6b7280',
    dateText: '#9ca3af',
    linkText: '#2563eb',
    pageBackground: '#ffffff',
    headerBackground: '#f9fafb',
    sectionBackground: '#f3f4f6',
    cardBackground: '#ffffff',
    alternateBackground: '#f8fafc',
    primaryAccent: '#2563eb',
    secondaryAccent: '#3b82f6',
    borderColor: '#e5e7eb',
    dividerColor: '#d1d5db',
    shadowColor: '#00000010',
    hoverColor: '#1d4ed8',
    activeColor: '#1e40af'
  };
  
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
                      ${exp.achievements.map(achievement => `<li class="achievement-item">${achievement}</li>`).join('')}
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
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Georgia:wght@400;700&family=Roboto:wght@400;500;700&family=Montserrat:wght@400;500;600;700&family=Lato:wght@400;700&family=Open+Sans:wght@400;600;700&family=Playfair+Display:wght@400;700&family=Poppins:wght@400;500;600;700&family=Source+Sans+Pro:wght@400;600;700&display=swap');
      
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      
      body {
        font-family: '${safeFonts.bodyText}', Arial, sans-serif;
        font-size: 14px;
        line-height: ${safeSpacing.lineHeight};
        color: ${safeColors.bodyText};
        background: ${safeColors.pageBackground};
      }
      
      .pdf-container {
        width: 794px;
        min-height: 1123px;
        padding: 40px;
        background: ${safeColors.pageBackground};
        margin: 0;
        box-sizing: border-box;
      }
      
      .header {
        text-align: center;
        margin-bottom: 30px;
        padding: 25px;
        background: ${safeColors.headerBackground};
        border-radius: ${safeBorders.borderRadius};
        border: 1px solid ${safeColors.borderColor};
      }
      
      .name {
        font-size: 28px;
        font-weight: bold;
        color: ${safeColors.mainHeaderText};
        margin-bottom: 8px;
        letter-spacing: 1px;
        font-family: '${safeFonts.mainHeader}', Arial, sans-serif;
      }
      
      .contact-info {
        font-size: 13px;
        color: ${safeColors.contactText};
        margin-bottom: 15px;
        line-height: 1.3;
        font-family: '${safeFonts.contactInfo}', Arial, sans-serif;
      }
      
      .summary {
        font-size: 14px;
        color: ${safeColors.bodyText};
        line-height: ${safeSpacing.lineHeight};
        max-width: 600px;
        margin: 0 auto;
        text-align: center;
        font-family: '${safeFonts.bodyText}', Arial, sans-serif;
      }
      
      .section {
        margin-bottom: ${safeSpacing.sectionSpacing};
        page-break-inside: avoid;
        background: ${safeColors.sectionBackground};
        padding: 20px;
        border-radius: ${safeBorders.borderRadius};
        border: 1px solid ${safeColors.borderColor};
      }
      
      .section-title {
        font-size: 16px;
        font-weight: bold;
        color: ${safeColors.sectionHeaderText};
        text-transform: uppercase;
        letter-spacing: 1.5px;
        border-bottom: 2px solid ${safeColors.primaryAccent};
        padding-bottom: 6px;
        margin-bottom: 18px;
        font-family: '${safeFonts.sectionHeaders}', Arial, sans-serif;
      }
      
      .experience-item,
      .education-item {
        margin-bottom: 20px;
        padding-bottom: 15px;
        border-bottom: 1px solid ${safeColors.dividerColor};
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
        color: ${safeColors.subHeaderText};
        margin-bottom: 3px;
        font-family: '${safeFonts.subHeaders}', Arial, sans-serif;
      }
      
      .company,
      .institution {
        font-size: 13px;
        color: ${safeColors.bodyText};
        font-style: italic;
        margin-bottom: 2px;
        font-family: '${safeFonts.bodyText}', Arial, sans-serif;
      }
      
      .date {
        font-size: 12px;
        color: ${safeColors.dateText};
        font-weight: 500;
        font-family: '${safeFonts.dates}', Arial, sans-serif;
      }
      
      .description {
        font-size: 13px;
        color: ${safeColors.bodyText};
        line-height: ${safeSpacing.lineHeight};
        margin-top: 8px;
        font-family: '${safeFonts.bodyText}', Arial, sans-serif;
      }
      
      .achievements {
        margin-top: 12px;
        margin-left: 0;
        padding-left: 0;
        list-style: none;
      }
      
      .achievement-item {
        font-size: 13px;
        color: ${safeColors.bodyText};
        margin-bottom: 4px;
        line-height: 1.4;
        font-family: '${safeFonts.bodyText}', Arial, sans-serif;
        position: relative;
        padding-left: 20px;
      }
      
      .achievement-item::before {
        content: "•";
        color: ${safeColors.primaryAccent};
        font-weight: bold;
        position: absolute;
        left: 0;
        top: 0;
        font-size: 16px;
        line-height: 1.2;
      }
      
      .gpa,
      .honors {
        font-size: 12px;
        color: ${safeColors.bodyText};
        margin-top: 2px;
        font-family: '${safeFonts.bodyText}', Arial, sans-serif;
      }
      
      .projects-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 20px;
      }
      
      .project-item {
        background: ${safeColors.cardBackground};
        padding: 15px;
        border-radius: ${safeBorders.borderRadius};
        border: 1px solid ${safeColors.borderColor};
      }
      
      .project-name {
        font-size: 14px;
        font-weight: bold;
        color: ${safeColors.subHeaderText};
        margin-bottom: 6px;
        font-family: '${safeFonts.subHeaders}', Arial, sans-serif;
      }
      
      .project-description {
        font-size: 12px;
        color: ${safeColors.bodyText};
        line-height: 1.3;
        margin-bottom: 8px;
        font-family: '${safeFonts.bodyText}', Arial, sans-serif;
      }
      
      .project-tech {
        font-size: 11px;
        color: ${safeColors.bodyText};
        margin-bottom: 6px;
        font-family: '${safeFonts.bodyText}', Arial, sans-serif;
      }
      
      .project-links {
        font-size: 10px;
        color: ${safeColors.linkText};
        font-family: '${safeFonts.bodyText}', Arial, sans-serif;
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
        color: ${safeColors.sectionHeaderText};
        margin-bottom: 8px;
        font-family: '${safeFonts.sectionHeaders}', Arial, sans-serif;
      }
      
      .skills-list {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
      }
      
      .skill-tag {
        background: ${safeColors.primaryAccent}20;
        color: ${safeColors.primaryAccent};
        padding: 4px 10px;
        border-radius: 12px;
        font-size: 11px;
        font-weight: 500;
        border: 1px solid ${safeColors.primaryAccent}40;
        font-family: '${safeFonts.bodyText}', Arial, sans-serif;
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