import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { personalInfo } from '../../data/personalInfo';
import { manageFocusForNavigation, announceToScreenReader } from '../../utils/accessibility';

interface NavigationProps {
  onScrollToSection: (sectionId: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ onScrollToSection }) => {
  const [activeSection, setActiveSection] = useState('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const sections = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'skills', label: 'Skills' },
    { id: 'projects', label: 'Projects' },
    { id: 'contact', label: 'Contact' }
  ];

  useEffect(() => {
    const handleScroll = () => {
      const sectionIds = ['home', 'about', 'skills', 'projects', 'contact'];
      const scrollPosition = window.scrollY + 100;

      for (const section of sectionIds) {
        const element = document.getElementById(section);
        if (element) {
          const offsetTop = element.offsetTop;
          const offsetHeight = element.offsetHeight;
          
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavigation = (sectionId: string) => {
    onScrollToSection(sectionId);
    setIsMobileMenuOpen(false);
    
    // Use accessibility utility for focus management
    manageFocusForNavigation(sectionId);
    
    // Announce navigation to screen readers
    const sectionLabel = sections.find(s => s.id === sectionId)?.label || sectionId;
    announceToScreenReader(`Navigated to ${sectionLabel} section`);
  };

  const handleKeyDown = (event: React.KeyboardEvent, sectionId: string) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleNavigation(sectionId);
    }
  };

  return (
    <nav 
      className="fixed top-0 left-0 right-0 z-50"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
        <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl shadow-xl">
          <div className="flex justify-between items-center h-16 px-6">
            {/* Logo/Brand */}
            <div 
              className="text-2xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent"
              role="banner"
              aria-label={`${personalInfo.name} - Portfolio`}
            >
              {personalInfo.name}
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex space-x-8" role="menubar">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => handleNavigation(section.id)}
                  onKeyDown={(e) => handleKeyDown(e, section.id)}
                  className={`capitalize transition-all duration-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-transparent ${
                    activeSection === section.id
                      ? 'text-white bg-white/20 backdrop-blur-sm'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                  role="menuitem"
                  aria-current={activeSection === section.id ? 'page' : undefined}
                  aria-label={`Navigate to ${section.label} section`}
                >
                  {section.label}
                </button>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-white p-2 rounded-lg hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-transparent transition-all duration-300"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
              aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Navigation Menu */}
          {isMobileMenuOpen && (
            <div 
              id="mobile-menu"
              className="md:hidden border-t border-white/20 backdrop-blur-md bg-white/5"
              role="menu"
              aria-label="Mobile navigation menu"
            >
              <div className="px-6 py-4 space-y-2">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => handleNavigation(section.id)}
                    onKeyDown={(e) => handleKeyDown(e, section.id)}
                    className={`block w-full text-left capitalize transition-all duration-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-transparent ${
                      activeSection === section.id
                        ? 'text-white bg-white/20 backdrop-blur-sm'
                        : 'text-white/80 hover:text-white hover:bg-white/10'
                    }`}
                    role="menuitem"
                    aria-current={activeSection === section.id ? 'page' : undefined}
                    aria-label={`Navigate to ${section.label} section`}
                  >
                    {section.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;