import React from 'react';
import { Skill } from '../../types';
import AnimatedCounter from '../animations/AnimatedCounter';

interface SkillBarProps {
  skill: Skill;
  index: number;
  isVisible: boolean;
}

const SkillBar: React.FC<SkillBarProps> = ({ skill, index, isVisible }) => {
  const skillId = `skill-${skill.name.toLowerCase().replace(/\s+/g, '-')}`;
  
  return (
    <article 
      className="backdrop-blur-md bg-white/10 border border-white/20 p-6 rounded-xl shadow-xl hover:shadow-2xl hover:bg-white/15 transition-all duration-300 focus-within:ring-2 focus-within:ring-blue-400 focus-within:ring-offset-2 focus-within:ring-offset-transparent"
      role="article"
      aria-labelledby={`${skillId}-name`}
      aria-describedby={`${skillId}-level`}
      tabIndex={0}
    >
      <div className="flex justify-between items-center mb-3">
        <h3 id={`${skillId}-name`} className="font-semibold text-white">
          {skill.name}
        </h3>
        <span 
          id={`${skillId}-level`}
          className="text-sm font-medium text-white/80"
          aria-label={`Proficiency level: ${skill.proficiency} percent`}
        >
          <AnimatedCounter
            to={isVisible ? skill.proficiency : 0}
            suffix="%"
            duration={1.5}
            delay={index * 0.1}
            trigger="immediate"
            easing="easeOut"
          />
        </span>
      </div>
      <div 
        className="w-full bg-white/20 rounded-full h-2 backdrop-blur-sm"
        role="progressbar"
        aria-valuenow={isVisible ? skill.proficiency : 0}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-labelledby={`${skillId}-name`}
        aria-describedby={`${skillId}-level`}
      >
        <div 
          className={`bg-gradient-to-r ${skill.color} h-2 rounded-full transition-all duration-1000 ease-out shadow-lg`}
          style={{ 
            width: isVisible ? `${skill.proficiency}%` : '0%',
            transitionDelay: `${index * 100}ms`
          }}
          aria-hidden="true"
        ></div>
      </div>
    </article>
  );
};

export default SkillBar;