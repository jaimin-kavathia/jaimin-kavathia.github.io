import React from 'react';
import { Github, ExternalLink } from 'lucide-react';
import { Project } from '../../types';

interface ProjectCardProps {
  project: Project;
  index: number;
  isVisible: boolean;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, index, isVisible }) => {
  return (
    <article 
      className={`backdrop-blur-md bg-white/10 border border-white/20 rounded-xl shadow-xl hover:shadow-2xl hover:bg-white/15 transition-all duration-300 overflow-hidden transform hover:scale-105 focus-within:ring-2 focus-within:ring-blue-400 focus-within:ring-offset-2 focus-within:ring-offset-transparent ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
      }`}
      style={{ transitionDelay: `${index * 100}ms` }}
      role="article"
      aria-labelledby={`project-title-${project.id}`}
      aria-describedby={`project-description-${project.id}`}
    >
      <div className="aspect-video bg-gradient-to-br from-white/10 to-white/5 overflow-hidden">
        <img 
          src={project.images[0]} 
          alt={`Screenshot of ${project.title} project showing the main interface`}
          className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
          loading="lazy"
          decoding="async"
        />
      </div>
      <div className="p-6">
        <header>
          <h3 id={`project-title-${project.id}`} className="text-xl font-bold mb-2 text-white">
            {project.title}
          </h3>
        </header>
        <p 
          id={`project-description-${project.id}`}
          className="text-white/80 mb-4 text-sm leading-relaxed"
        >
          {project.description}
        </p>
        <div 
          className="flex flex-wrap gap-2 mb-4"
          role="list"
          aria-label={`Technologies used in ${project.title}`}
        >
          {project.technologies.map((tech) => (
            <span 
              key={tech}
              className="backdrop-blur-sm bg-gradient-to-r from-blue-500/30 to-purple-500/30 border border-white/20 text-white px-3 py-1 rounded-full text-sm font-medium"
              role="listitem"
              aria-label={`Technology: ${tech}`}
            >
              {tech}
            </span>
          ))}
        </div>
        <nav className="flex gap-4" aria-label={`Links for ${project.title} project`}>
          {project.githubUrl && (
            <a 
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-white/80 hover:text-white transition-colors backdrop-blur-sm bg-white/10 border border-white/20 px-3 py-2 rounded-lg hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-transparent"
              aria-label={`View source code for ${project.title} on GitHub (opens in new tab)`}
            >
              <Github size={16} aria-hidden="true" />
              <span className="text-sm">Code</span>
            </a>
          )}
          {project.demoUrl && (
            <a 
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-white/80 hover:text-white transition-colors backdrop-blur-sm bg-white/10 border border-white/20 px-3 py-2 rounded-lg hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-transparent"
              aria-label={`View live demo of ${project.title} (opens in new tab)`}
            >
              <ExternalLink size={16} aria-hidden="true" />
              <span className="text-sm">Demo</span>
            </a>
          )}
        </nav>
      </div>
    </article>
  );
};

export default ProjectCard;