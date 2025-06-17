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

  // Get all computed styles for the element and its descendants
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
        ${allStyles}
        
        ${inlineStyles}
        
        /* Additional portfolio-specific styles */
        body {
            margin: 0;
            padding: 0;
            scroll-behavior: smooth;
        }
        
        /* Ensure proper styling for links */
        a {
            text-decoration: none;
            transition: all 0.3s ease;
        }
        
        a:hover {
            text-decoration: underline;
        }
        
        /* Responsive adjustments */
        @media (max-width: 768px) {
            .grid {
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
  const extractStyles = (el: Element, selector: string = '') => {
    if (el.nodeType === Node.ELEMENT_NODE) {
      const htmlEl = el as HTMLElement;
      
      // Get computed styles
      const computedStyle = window.getComputedStyle(htmlEl);
      
      // Create a unique selector for this element
      let elementSelector = htmlEl.tagName.toLowerCase();
      
      if (htmlEl.id) {
        elementSelector = `#${htmlEl.id}`;
      } else if (htmlEl.className) {
        const classes = htmlEl.className.split(' ').filter(c => c.trim());
        if (classes.length > 0) {
          elementSelector = `.${classes.join('.')}`;
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
        'margin',
        'padding',
        'border',
        'border-radius',
        'display',
        'flex-direction',
        'justify-content',
        'align-items',
        'grid-template-columns',
        'gap',
        'text-align',
        'opacity',
        'transform',
        'transition'
      ];
      
      let elementStyles = '';
      importantStyles.forEach(prop => {
        const value = computedStyle.getPropertyValue(prop);
        if (value && value !== 'initial' && value !== 'normal') {
          elementStyles += `${prop}: ${value}; `;
        }
      });
      
      if (elementStyles) {
        styles += `${elementSelector} { ${elementStyles} }\n`;
      }
      
      // Process children
      Array.from(htmlEl.children).forEach((child, index) => {
        extractStyles(child, `${elementSelector} > *:nth-child(${index + 1})`);
      });
    }
  };
  
  extractStyles(element);
  return styles;
};

// Legacy function for backward compatibility (now just calls the new function)
export const generatePortfolioHTML = (data: ResumeData, templateId: string): string => {
  // This function is kept for backward compatibility but should not be used
  // The new approach extracts HTML directly from the preview
  console.warn('generatePortfolioHTML is deprecated. Use downloadPortfolioFromPreview instead.');
  return '';
};

export const downloadPortfolioHTML = (data: ResumeData, templateId: string): void => {
  // This function is kept for backward compatibility but should not be used
  console.warn('downloadPortfolioHTML is deprecated. Use downloadPortfolioFromPreview instead.');
};