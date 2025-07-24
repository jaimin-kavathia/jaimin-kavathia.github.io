import React from 'react';
import { ChevronDown, Download } from 'lucide-react';
import { personalInfo } from '../../data/personalInfo';
import { announceToScreenReader } from '../../utils/accessibility';

interface HeroProps {
  isVisible: boolean;
  onScrollToSection: (sectionId: string) => void;
}

const Hero: React.FC<HeroProps> = ({ isVisible, onScrollToSection }) => {
  const handleKeyDown = (event: React.KeyboardEvent, action: () => void) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      action();
    }
  };

  const handleScrollToProjects = () => {
    onScrollToSection('projects');
    announceToScreenReader('Navigating to projects section');
  };

  const handleDownloadCV = () => {
    // This would typically trigger a download or open a PDF
    announceToScreenReader('CV download initiated');
    console.log('Download CV clicked');
    // In a real implementation, this would trigger the actual download
    // window.open('/path/to/cv.pdf', '_blank');
  };

  return (
    <section 
      id="home" 
      className="min-h-screen flex items-center justify-center relative"
      role="banner"
      aria-label="Hero section - Introduction"
    >
      <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
        <div className={`transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-3xl p-12 shadow-2xl">
            <header>
              <h1 className="text-5xl md:text-7xl font-bold mb-6">
                <span 
                  className="bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent"
                  role="text"
                  aria-label={`${personalInfo.name}, Portfolio`}
                >
                  {personalInfo.name}
                </span>
              </h1>
              <h2 className="text-2xl md:text-4xl font-bold mb-6">
                <span 
                  className="bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent"
                  role="text"
                  aria-label={`Professional title: ${personalInfo.title}`}
                >
                  {personalInfo.title}
                </span>
              </h2>
            </header>
            <p 
              className="text-xl md:text-2xl text-white/80 mb-8 max-w-2xl mx-auto"
              role="text"
              aria-label={`Professional summary: ${personalInfo.tagline} with ${personalInfo.yearsOfExperience} years of experience`}
            >
              {personalInfo.tagline} - {personalInfo.yearsOfExperience} years of experience delivering exceptional user experiences
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center" role="group" aria-label="Call to action buttons">
              <button 
                onClick={handleScrollToProjects}
                onKeyDown={(e) => handleKeyDown(e, handleScrollToProjects)}
                className="backdrop-blur-md bg-gradient-to-r from-blue-500/80 to-purple-500/80 border border-white/30 text-white px-8 py-3 rounded-full font-semibold hover:shadow-2xl hover:shadow-blue-500/25 transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-transparent"
                aria-label="View my work - Navigate to projects section"
                type="button"
              >
                View My Work
              </button>
              <button 
                onClick={handleDownloadCV}
                onKeyDown={(e) => handleKeyDown(e, handleDownloadCV)}
                className="backdrop-blur-md bg-white/10 border border-white/30 text-white px-8 py-3 rounded-full font-semibold hover:bg-white/20 hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-transparent"
                aria-label="Download CV - Download resume as PDF"
                type="button"
              >
                <Download size={20} aria-hidden="true" />
                Download CV
              </button>
            </div>
          </div>
        </div>
      </div>
      <button
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-transparent rounded-full"
        onClick={() => onScrollToSection('about')}
        onKeyDown={(e) => handleKeyDown(e, () => onScrollToSection('about'))}
        aria-label="Scroll down to about section"
        type="button"
      >
        <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-full p-3 hover:bg-white/20 transition-all duration-300">
          <ChevronDown size={24} className="text-white/60" aria-hidden="true" />
        </div>
      </button>
    </section>
  );
};

export default Hero;