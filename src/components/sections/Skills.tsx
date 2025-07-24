import React from 'react';
import SkillBar from '../ui/SkillBar';
import { skills } from '../../data/skills';

interface SkillsProps {
  isVisible: boolean;
}

const Skills: React.FC<SkillsProps> = ({ isVisible }) => {
  return (
    <section 
      id="skills" 
      className="py-20 relative"
      role="main"
      aria-labelledby="skills-heading"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <header className="text-center mb-16">
            <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-8 inline-block">
              <h2 
                id="skills-heading"
                className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent"
              >
                Skills & Expertise
              </h2>
              <p className="text-white/70 text-lg max-w-2xl mx-auto">
                Technologies and tools I use to bring ideas to life
              </p>
            </div>
          </header>
          
          <div 
            className="grid md:grid-cols-2 gap-8"
            role="region"
            aria-label="Technical skills and proficiency levels"
          >
            {skills.map((skill, index) => (
              <SkillBar 
                key={skill.name} 
                skill={skill} 
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

export default Skills;