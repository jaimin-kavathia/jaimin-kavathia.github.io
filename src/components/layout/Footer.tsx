import React from "react";
import { Github, Linkedin } from "lucide-react";
import { personalInfo } from "../../data/personalInfo";

const Footer: React.FC = () => {
  return (
    <footer className="py-12 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-8">
          <div className="text-center">
            <div className="text-2xl font-bold mb-4 bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
              {personalInfo.name}
            </div>
            <p className="text-white/60 mb-6">{personalInfo.tagline}</p>
            <div className="flex justify-center space-x-6 mb-6">
              <a
                href={personalInfo.socialLinks.github}
                target="_blank"
                rel="noopener noreferrer"
                className="backdrop-blur-sm bg-white/10 border border-white/20 p-3 rounded-full text-white/80 hover:text-white hover:bg-white/20 transition-all duration-300 hover:scale-110"
                aria-label="GitHub Profile"
              >
                <Github size={24} />
              </a>
              <a
                href={personalInfo.socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="backdrop-blur-sm bg-white/10 border border-white/20 p-3 rounded-full text-white/80 hover:text-white hover:bg-white/20 transition-all duration-300 hover:scale-110"
                aria-label="LinkedIn Profile"
              >
                <Linkedin size={24} />
              </a>
              {personalInfo.socialLinks.medium && (
                <a
                  href={personalInfo.socialLinks.medium}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="backdrop-blur-sm bg-white/10 border border-white/20 p-3 rounded-full text-white/80 hover:text-white hover:bg-white/20 transition-all duration-300 hover:scale-110"
                  aria-label="Medium Profile"
                >
                  <svg
                    className="w-6 h-6"
                    viewBox="0 0 1043.63 592.71"
                    fill="currentColor"
                    aria-hidden="true"
                    role="img"
                  >
                    <title>Medium</title>
                    <path d="M588.67 296.35c0 163.67-131.27 296.36-293.83 296.36S1 460.02 1 296.35 132.27 0 294.84 0s293.83 132.69 293.83 296.35zM887.75 296.35c0 154.22-65.64 279.27-146.63 279.27s-146.63-125.05-146.63-279.27S660.13 17.08 741.12 17.08 887.75 142.13 887.75 296.35zM1042.63 296.35c0 141.43-23.31 255.98-52.06 255.98s-52.06-114.55-52.06-255.98 23.31-255.98 52.06-255.98 52.06 114.55 52.06 255.98z" />
                  </svg>
                </a>
              )}
            </div>
            <div className="pt-6 border-t border-white/10 text-white/50 text-sm">
              © {new Date().getFullYear()} {personalInfo.name}. All rights
              reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
