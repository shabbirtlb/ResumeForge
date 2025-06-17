import type { ResumeData } from '../types';

// Function to extract exact HTML from preview and download it
export const downloadPortfolioFromPreview = (previewElement: HTMLElement, fullName: string): void => {
  try {
    // Clone the preview element to avoid modifying the original
    const clonedElement = previewElement.cloneNode(true) as HTMLElement;
    
    // Get all computed styles from the preview element and its children
    const extractedHTML = extractCompleteHTML(clonedElement, fullName);
    
    // Create and download the file
    const blob = new Blob([extractedHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `${fullName.replace(/\s+/g, '_')}_portfolio.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error downloading portfolio:', error);
    throw new Error('Failed to download portfolio');
  }
};

// Function to extract complete HTML with all styles
const extractCompleteHTML = (element: HTMLElement, fullName: string): string => {
  // Get all stylesheets from the current document
  const allStyles = Array.from(document.styleSheets)
    .map(styleSheet => {
      try {
        return Array.from(styleSheet.cssRules)
          .map(rule => rule.cssText)
          .join('\n');
      } catch (e) {
        // Handle cross-origin stylesheets
        return '';
      }
    })
    .join('\n');

  // Get inline styles from the element
  const inlineStyles = extractInlineStyles(element);
  
  // Create the complete HTML document
  const completeHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${fullName} - Portfolio</title>
    
    <!-- Font Awesome -->
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    
    <!-- Google Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Georgia:wght@400;700&family=Roboto:wght@400;500;700&family=Montserrat:wght@400;500;600;700&family=Lato:wght@400;700&family=Open+Sans:wght@400;600;700&family=Playfair+Display:wght@400;700&family=Poppins:wght@400;500;600;700&family=Source+Sans+Pro:wght@400;600;700&display=swap" rel="stylesheet">
    
    <!-- Extracted Styles -->
    <style>
        /* Reset and base styles */
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            margin: 0;
            padding: 0;
            scroll-behavior: smooth;
            font-family: Inter, system-ui, -apple-system, sans-serif;
            line-height: 1.6;
        }
        
        /* Tailwind CSS classes - essential ones */
        .text-4xl { font-size: 2.25rem; line-height: 2.5rem; }
        .text-2xl { font-size: 1.5rem; line-height: 2rem; }
        .text-lg { font-size: 1.125rem; line-height: 1.75rem; }
        .text-sm { font-size: 0.875rem; line-height: 1.25rem; }
        .text-xs { font-size: 0.75rem; line-height: 1rem; }
        
        .font-bold { font-weight: 700; }
        .font-semibold { font-weight: 600; }
        .font-medium { font-weight: 500; }
        .italic { font-style: italic; }
        
        .text-center { text-align: center; }
        .text-white { color: white; }
        
        .p-2 { padding: 0.5rem; }
        .p-4 { padding: 1rem; }
        .p-6 { padding: 1.5rem; }
        .p-8 { padding: 2rem; }
        .px-2 { padding-left: 0.5rem; padding-right: 0.5rem; }
        .px-3 { padding-left: 0.75rem; padding-right: 0.75rem; }
        .py-1 { padding-top: 0.25rem; padding-bottom: 0.25rem; }
        .pb-2 { padding-bottom: 0.5rem; }
        
        .m-0 { margin: 0; }
        .mb-2 { margin-bottom: 0.5rem; }
        .mb-4 { margin-bottom: 1rem; }
        .mb-8 { margin-bottom: 2rem; }
        .mt-4 { margin-top: 1rem; }
        
        .flex { display: flex; }
        .grid { display: grid; }
        .block { display: block; }
        .inline-flex { display: inline-flex; }
        
        .flex-wrap { flex-wrap: wrap; }
        .justify-between { justify-content: space-between; }
        .justify-center { justify-content: center; }
        .items-start { align-items: flex-start; }
        .items-center { align-items: center; }
        .space-x-2 > * + * { margin-left: 0.5rem; }
        .space-x-4 > * + * { margin-left: 1rem; }
        .space-x-6 > * + * { margin-left: 1.5rem; }
        .space-y-1 > * + * { margin-top: 0.25rem; }
        .space-y-6 > * + * { margin-top: 1.5rem; }
        
        .md\\:grid-cols-2 { grid-template-columns: repeat(2, 1fr); }
        .gap-2 { gap: 0.5rem; }
        .gap-6 { gap: 1.5rem; }
        
        .border { border-width: 1px; }
        .border-b-2 { border-bottom-width: 2px; }
        .rounded-lg { border-radius: 0.5rem; }
        .rounded-xl { border-radius: 0.75rem; }
        .rounded-full { border-radius: 9999px; }
        
        .shadow-lg { box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); }
        
        .opacity-90 { opacity: 0.9; }
        
        .max-w-3xl { max-width: 48rem; }
        .max-w-4xl { max-width: 56rem; }
        .mx-auto { margin-left: auto; margin-right: auto; }
        
        .overflow-hidden { overflow: hidden; }
        
        /* List styles */
        ul {
            list-style-type: disc;
            margin-left: 20px;
            padding-left: 0;
        }
        
        li {
            display: list-item;
            list-style-type: disc;
            margin-bottom: 4px;
        }
        
        /* Links */
        a {
            text-decoration: none;
            transition: all 0.3s ease;
        }
        
        a:hover {
            text-decoration: underline;
        }
        
        /* Responsive adjustments */
        @media (max-width: 768px) {
            .md\\:grid-cols-2 {
                grid-template-columns: 1fr !important;
            }
            
            .flex {
                flex-direction: column;
                gap: 1rem;
            }
            
            .text-4xl {
                font-size: 2rem !important;
            }
            
            .text-2xl {
                font-size: 1.5rem !important;
            }
            
            .p-8 {
                padding: 1rem !important;
            }
            
            .space-x-6 > * + * {
                margin-left: 0 !important;
                margin-top: 0.5rem;
            }
        }
        
        /* Print styles */
        @media print {
            body {
                background: white !important;
            }
            
            .rounded-xl,
            .rounded-lg {
                border-radius: 0 !important;
            }
            
            .shadow-lg {
                box-shadow: none !important;
            }
        }
        
        /* Extracted styles from the application */
        ${allStyles}
        
        /* Inline styles from the preview */
        ${inlineStyles}
    </style>
</head>
<body>
    ${element.outerHTML}
    
    <!-- Navigation Script -->
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

        // Initialize animations on load
        window.addEventListener('load', () => {
            // Observe elements for animation
            document.querySelectorAll('.mb-8, .p-6, .rounded-lg').forEach(el => {
                if (el.style.opacity !== '1') {
                    el.style.opacity = '0';
                    el.style.transform = 'translateY(30px)';
                    el.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
                    observer.observe(el);
                }
            });
            
            // Fade in the body
            document.body.style.opacity = '1';
        });

        // Initialize
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 0.5s ease-in';
    </script>
</body>
</html>
  `;

  return completeHTML;
};

// Function to extract inline styles from elements
const extractInlineStyles = (element: HTMLElement): string => {
  let styles = '';
  
  // Function to recursively extract styles
  const extractStyles = (el: Element, depth: number = 0) => {
    if (el.nodeType === Node.ELEMENT_NODE && depth < 10) { // Prevent infinite recursion
      const htmlEl = el as HTMLElement;
      
      // Get computed styles
      const computedStyle = window.getComputedStyle(htmlEl);
      
      // Create a selector for this element
      let elementSelector = htmlEl.tagName.toLowerCase();
      
      if (htmlEl.id) {
        elementSelector = `#${htmlEl.id}`;
      } else if (htmlEl.className) {
        const classes = htmlEl.className.split(' ').filter(c => c.trim() && !c.includes(':'));
        if (classes.length > 0) {
          elementSelector = `.${classes.slice(0, 3).join('.')}`;
        }
      }
      
      // Extract important styles
      const importantStyles = [
        'color',
        'background-color',
        'background',
        'font-family',
        'font-size',
        'font-weight',
        'line-height',
        'text-align',
        'border',
        'border-radius',
        'padding',
        'margin',
        'display',
        'flex-direction',
        'justify-content',
        'align-items',
        'grid-template-columns',
        'gap'
      ];
      
      let elementStyles = '';
      importantStyles.forEach(prop => {
        const value = computedStyle.getPropertyValue(prop);
        if (value && value !== 'initial' && value !== 'normal' && value !== 'auto') {
          elementStyles += `${prop}: ${value}; `;
        }
      });
      
      if (elementStyles) {
        styles += `${elementSelector} { ${elementStyles} }\n`;
      }
      
      // Process children (limit depth to prevent performance issues)
      if (depth < 5) {
        Array.from(htmlEl.children).forEach(child => {
          extractStyles(child, depth + 1);
        });
      }
    }
  };
  
  extractStyles(element);
  return styles;
};

// Legacy function for backward compatibility
export const generatePortfolioHTML = (data: ResumeData, templateId: string): string => {
  console.warn('generatePortfolioHTML is deprecated. Use downloadPortfolioFromPreview instead.');
  return '';
};

export const downloadPortfolioHTML = (data: ResumeData, templateId: string): void => {
  console.warn('downloadPortfolioHTML is deprecated. Use downloadPortfolioFromPreview instead.');
  
  // Fallback: try to find the portfolio preview element and use the new method
  const portfolioPreview = document.querySelector('[data-portfolio-preview]') as HTMLElement;
  if (portfolioPreview) {
    downloadPortfolioFromPreview(portfolioPreview, data.personalInfo.fullName);
  } else {
    alert('Portfolio preview not available. Please try again from the preview section.');
  }
};