import React from 'react';
import Navigation from '../ui/Navigation';

interface HeaderProps {
  activeSection: string;
  onSectionClick: (sectionId: string) => void;
}

const Header: React.FC<HeaderProps> = ({ activeSection, onSectionClick }) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <Navigation activeSection={activeSection} onSectionClick={onSectionClick} />
    </header>
  );
};

export default Header;