import React from 'react';
import { Github, Linkedin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="py-12 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-8">
          <div className="text-center">
            <div className="text-2xl font-bold mb-4 bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
              Jaimin Kavathia
            </div>
            <p className="text-white/60 mb-6">
              Creating beautiful mobile experiences, one app at a time.
            </p>
            <div className="flex justify-center space-x-6 mb-6">
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="backdrop-blur-sm bg-white/10 border border-white/20 p-3 rounded-full text-white/80 hover:text-white hover:bg-white/20 transition-all duration-300 hover:scale-110"
                aria-label="GitHub Profile"
              >
                <Github size={24} />
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="backdrop-blur-sm bg-white/10 border border-white/20 p-3 rounded-full text-white/80 hover:text-white hover:bg-white/20 transition-all duration-300 hover:scale-110"
                aria-label="LinkedIn Profile"
              >
                <Linkedin size={24} />
              </a>
            </div>
            <div className="pt-6 border-t border-white/10 text-white/50 text-sm">
              © {new Date().getFullYear()} Jaimin Kavathia. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;