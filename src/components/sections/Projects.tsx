import React from 'react';
import ProjectCard from '../ui/ProjectCard';
import { projects } from '../../data/projects';

interface ProjectsProps {
  isVisible: boolean;
}

const Projects: React.FC<ProjectsProps> = ({ isVisible }) => {
  // Filter to show only featured projects, or first 6 if none are featured
  const featuredProjects = projects.filter(project => project.featured);
  const displayProjects = featuredProjects.length > 0 ? featuredProjects : projects.slice(0, 6);

  return (
    <section 
      id="projects" 
      className="py-20 relative"
      role="main"
      aria-labelledby="projects-heading"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <header className="text-center mb-16">
            <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-8 inline-block">
              <h2 
                id="projects-heading"
                className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent"
              >
                Featured Projects
              </h2>
              <p className="text-white/70 text-lg max-w-2xl mx-auto">
                A showcase of my latest work and achievements
              </p>
            </div>
          </header>
          
          <div 
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            role="region"
            aria-label="Portfolio projects gallery"
          >
            {displayProjects.map((project, index) => (
              <ProjectCard 
                key={project.id} 
                project={project} 
                index={index} 
                isVisible={isVisible} 
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Projects;