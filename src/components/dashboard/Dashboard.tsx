import React, { useState, useEffect } from 'react';
import { Plus, FileText, Edit, Trash2, Download, Eye, Search, Filter, Calendar, Copy, ExternalLink } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useResumeStorage } from '../../hooks/useResumeStorage';
import { generateResumePDF } from '../../utils/pdfGenerator';
import { downloadPortfolioHTML } from '../../utils/portfolioGenerator';
import type { SavedResume, ResumeData } from '../../types';

interface DashboardProps {
  onCreateNew: () => void;
  onEditResume: (resumeData: ResumeData) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onCreateNew, onEditResume }) => {
  const { user, logout } = useAuth();
  const { getSavedResumes, deleteResume, duplicateResume } = useResumeStorage();
  const [savedResumes, setSavedResumes] = useState<SavedResume[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBy, setFilterBy] = useState<'all' | 'recent' | 'templates'>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [downloadingPDF, setDownloadingPDF] = useState<string | null>(null);

  useEffect(() => {
    loadSavedResumes();
  }, [user]);

  const loadSavedResumes = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      const resumes = await getSavedResumes();
      setSavedResumes(resumes);
    } catch (error) {
      console.error('Error loading resumes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteResume = async (id: string) => {
    if (!confirm('Are you sure you want to delete this resume?')) return;
    
    try {
      await deleteResume(id);
      setSavedResumes(prev => prev.filter(resume => resume.id !== id));
    } catch (error) {
      console.error('Error deleting resume:', error);
      alert('Failed to delete resume. Please try again.');
    }
  };

  const handleDuplicateResume = async (resume: SavedResume) => {
    try {
      const newId = await duplicateResume(resume);
      await loadSavedResumes(); // Refresh the list
    } catch (error) {
      console.error('Error duplicating resume:', error);
      alert('Failed to duplicate resume. Please try again.');
    }
  };

  const handleDownloadPDF = async (resume: SavedResume) => {
    try {
      setDownloadingPDF(resume.id);
      await generateResumePDF(resume.data, 'default');
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setDownloadingPDF(null);
    }
  };

  const handleDownloadPortfolio = (resume: SavedResume) => {
    try {
      downloadPortfolioHTML(resume.data, 'default');
    } catch (error) {
      console.error('Error generating portfolio:', error);
      alert('Failed to generate portfolio. Please try again.');
    }
  };

  const handlePreviewResume = (resume: SavedResume) => {
    // Create a temporary preview window
    const previewWindow = window.open('', '_blank', 'width=800,height=600,scrollbars=yes');
    if (previewWindow) {
      previewWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>${resume.title} - Preview</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .section { margin-bottom: 25px; }
            .section-title { font-size: 18px; font-weight: bold; border-bottom: 2px solid #2563eb; padding-bottom: 5px; margin-bottom: 15px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>${resume.data.personalInfo.fullName}</h1>
            <p>${resume.data.personalInfo.email} | ${resume.data.personalInfo.phone} | ${resume.data.personalInfo.location}</p>
          </div>
          ${resume.data.personalInfo.summary ? `
            <div class="section">
              <div class="section-title">Professional Summary</div>
              <p>${resume.data.personalInfo.summary}</p>
            </div>
          ` : ''}
          <div class="section">
            <div class="section-title">Experience</div>
            ${resume.data.experience.map(exp => `
              <div style="margin-bottom: 15px;">
                <h3>${exp.position} at ${exp.company}</h3>
                <p><em>${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}</em></p>
                <p>${exp.description}</p>
              </div>
            `).join('')}
          </div>
        </body>
        </html>
      `);
      previewWindow.document.close();
    }
  };

  const filteredResumes = savedResumes.filter(resume => {
    const matchesSearch = resume.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resume.data.personalInfo.fullName.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterBy === 'all') return matchesSearch;
    if (filterBy === 'templates') return matchesSearch && resume.isTemplate;
    if (filterBy === 'recent') {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return matchesSearch && new Date(resume.updatedAt) > weekAgo;
    }
    
    return matchesSearch;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your resumes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md border-b border-gray-200/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                ResumeForge Dashboard
              </h1>
              <p className="text-gray-600">Welcome back, {user?.fullName}</p>
            </div>
            <button
              onClick={logout}
              className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Resumes</p>
                <p className="text-2xl font-bold text-gray-900">{savedResumes.length}</p>
              </div>
              <FileText className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Templates</p>
                <p className="text-2xl font-bold text-gray-900">
                  {savedResumes.filter(r => r.isTemplate).length}
                </p>
              </div>
              <Edit className="w-8 h-8 text-purple-500" />
            </div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Recent Updates</p>
                <p className="text-2xl font-bold text-gray-900">
                  {savedResumes.filter(r => {
                    const weekAgo = new Date();
                    weekAgo.setDate(weekAgo.getDate() - 7);
                    return new Date(r.updatedAt) > weekAgo;
                  }).length}
                </p>
              </div>
              <Calendar className="w-8 h-8 text-green-500" />
            </div>
          </div>
        </div>

        {/* Actions and Filters */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50 shadow-lg mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <button
              onClick={onCreateNew}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <Plus className="w-5 h-5" />
              <span>Create New Resume</span>
            </button>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search resumes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  value={filterBy}
                  onChange={(e) => setFilterBy(e.target.value as any)}
                  className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                >
                  <option value="all">All Resumes</option>
                  <option value="recent">Recent</option>
                  <option value="templates">Templates</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Resumes Grid */}
        {filteredResumes.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-12 border border-gray-200/50 shadow-lg text-center">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {savedResumes.length === 0 ? 'No resumes yet' : 'No resumes found'}
            </h3>
            <p className="text-gray-600 mb-6">
              {savedResumes.length === 0 
                ? 'Create your first resume to get started'
                : 'Try adjusting your search or filter criteria'
              }
            </p>
            {savedResumes.length === 0 && (
              <button
                onClick={onCreateNew}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
              >
                Create Your First Resume
              </button>
            )}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResumes.map((resume) => (
              <div
                key={resume.id}
                className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-200 group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors duration-200">
                      {resume.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      {resume.data.personalInfo.fullName}
                    </p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span>Created {formatDate(resume.createdAt)}</span>
                      <span>Updated {formatDate(resume.updatedAt)}</span>
                    </div>
                  </div>
                  {resume.isTemplate && (
                    <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                      Template
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onEditResume(resume.data)}
                      className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors duration-200"
                      title="Edit"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDuplicateResume(resume)}
                      className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors duration-200"
                      title="Duplicate"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteResume(resume.id)}
                      className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors duration-200"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => handlePreviewResume(resume)}
                      className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                      title="Preview Resume"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <div className="relative group">
                      <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                        <Download className="w-4 h-4" />
                      </button>
                      <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                        <button
                          onClick={() => handleDownloadPDF(resume)}
                          disabled={downloadingPDF === resume.id}
                          className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 rounded-t-lg disabled:opacity-50"
                        >
                          {downloadingPDF === resume.id ? 'Generating PDF...' : 'Download PDF'}
                        </button>
                        <button
                          onClick={() => handleDownloadPortfolio(resume)}
                          className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 rounded-b-lg"
                        >
                          Download Portfolio
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};