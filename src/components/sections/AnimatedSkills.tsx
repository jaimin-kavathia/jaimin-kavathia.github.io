import React, { useMemo, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { skills } from '../../data/skills';
import { Skill } from '../../types';
import AnimatedCounter from '../animations/AnimatedCounter';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { easingFunctions, animationDurations, staggerTimings } from '../../utils/easingFunctions';

interface AnimatedSkillsProps {
  isVisible: boolean;
}

interface SkillsByCategory {
  [key: string]: Skill[];
}

const AnimatedSkills: React.FC<AnimatedSkillsProps> = ({ isVisible }) => {
  const prefersReducedMotion = useReducedMotion();
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);

  // Group skills by category for staggered reveals
  const skillsByCategory = useMemo(() => {
    return skills.reduce((acc: SkillsByCategory, skill) => {
      if (!acc[skill.category]) {
        acc[skill.category] = [];
      }
      acc[skill.category].push(skill);
      return acc;
    }, {});
  }, []);

  // Filter skills based on active filter
  const filteredSkillsByCategory = useMemo(() => {
    if (activeFilter === 'all') {
      return skillsByCategory;
    }
    return {
      [activeFilter]: skillsByCategory[activeFilter] || []
    };
  }, [skillsByCategory, activeFilter]);

  const categoryOrder = ['mobile', 'backend', 'design', 'tools'];
  const categoryLabels = {
    mobile: 'Mobile Development',
    backend: 'Backend & APIs',
    design: 'Analytics & Design',
    tools: 'Tools & Development'
  };

  const categoryIcons = {
    mobile: '📱',
    backend: '⚙️',
    design: '📊',
    tools: '🔧'
  };

  const categoryColors = {
    mobile: 'from-blue-500 to-cyan-500',
    backend: 'from-green-500 to-teal-500',
    design: 'from-purple-500 to-pink-500',
    tools: 'from-orange-500 to-red-500'
  };

  const filterOptions = [
    { key: 'all', label: 'All Skills', icon: '🎯' },
    { key: 'mobile', label: 'Mobile', icon: '📱' },
    { key: 'backend', label: 'Backend', icon: '⚙️' },
    { key: 'design', label: 'Design', icon: '🎨' },
    { key: 'tools', label: 'Tools', icon: '🔧' }
  ];

  const handleFilterChange = useCallback((filter: string) => {
    setActiveFilter(filter);
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: prefersReducedMotion ? 0 : staggerTimings.tight,
        delayChildren: prefersReducedMotion ? 0 : 0.1
      }
    }
  };

  const categoryVariants = {
    hidden: { 
      opacity: 0, 
      y: prefersReducedMotion ? 0 : 30 
    },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: prefersReducedMotion ? 0.01 : animationDurations.quick,
        ease: easingFunctions.easeOutCubic
      }
    }
  };

  const skillVariants = {
    hidden: { 
      opacity: 0, 
      y: prefersReducedMotion ? 0 : 20,
      scale: prefersReducedMotion ? 1 : 0.9
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: { 
        duration: prefersReducedMotion ? 0.01 : animationDurations.fast,
        ease: easingFunctions.easeOutBack
      }
    }
  };

  return (
    <section 
      id="skills" 
      className="py-20 relative"
      role="main"
      aria-labelledby="skills-heading"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          variants={containerVariants}
        >
          <motion.header 
            className="text-center mb-16"
            variants={categoryVariants}
          >
            <div className="backdrop-blur-md bg-white/80 border border-gray-200 rounded-3xl p-8 inline-block shadow-xl max-w-4xl mx-auto">
              <h2 
                id="skills-heading"
                className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-gray-900 via-blue-600 to-purple-600 bg-clip-text text-transparent"
              >
                Skills & Expertise
              </h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-8">
                Technologies and tools I use to bring ideas to life
              </p>
              
              {/* Filter Buttons */}
              <motion.div 
                className="flex flex-wrap justify-center gap-3"
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: {
                      staggerChildren: prefersReducedMotion ? 0 : 0.05,
                      delayChildren: prefersReducedMotion ? 0 : 0.1
                    }
                  }
                }}
                role="tablist"
                aria-label="Filter skills by category"
              >
                {filterOptions.map((option) => (
                  <motion.button
                    key={option.key}
                    onClick={() => handleFilterChange(option.key)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 backdrop-blur-sm border focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                      activeFilter === option.key
                        ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/25'
                        : 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200 hover:text-gray-900'
                    }`}
                    variants={{
                      hidden: { opacity: 0, scale: 0.8 },
                      visible: { 
                        opacity: 1, 
                        scale: 1,
                        transition: { duration: prefersReducedMotion ? 0.01 : 0.15 }
                      }
                    }}
                    whileHover={prefersReducedMotion ? {} : { scale: 1.05 }}
                    whileTap={prefersReducedMotion ? {} : { scale: 0.95 }}
                    role="tab"
                    aria-selected={activeFilter === option.key}
                    aria-controls="skills-content"
                  >
                    <span className="mr-2" aria-hidden="true">{option.icon}</span>
                    {option.label}
                  </motion.button>
                ))}
              </motion.div>
            </div>
          </motion.header>
          
          <motion.div 
            id="skills-content"
            className="space-y-16"
            role="region"
            aria-label="Technical skills organized by category"
          >
              {(activeFilter === 'all' ? categoryOrder : [activeFilter]).map((category, categoryIndex) => {
                const categorySkills = filteredSkillsByCategory[category];
                if (!categorySkills || categorySkills.length === 0) return null;

                return (
                  <motion.div
                    key={`${activeFilter}-${category}`}
                    variants={categoryVariants}
                    className="space-y-6"
                  >
                    {activeFilter === 'all' && (
                      <div className="text-center mb-12">
                        <motion.div 
                          className={`inline-flex items-center gap-4 px-8 py-4 bg-gradient-to-r ${categoryColors[category as keyof typeof categoryColors]} rounded-full border border-white/20 shadow-lg text-white backdrop-blur-md`}
                          whileHover={prefersReducedMotion ? {} : { 
                            scale: 1.05,
                            boxShadow: "0 20px 40px -10px rgba(0, 0, 0, 0.3)"
                          }}
                        >
                          <motion.span 
                            className="text-3xl" 
                            aria-hidden="true"
                            animate={!prefersReducedMotion ? {
                              rotate: [0, 10, -10, 0],
                              transition: { duration: 2, repeat: Infinity }
                            } : {}}
                          >
                            {categoryIcons[category as keyof typeof categoryIcons]}
                          </motion.span>
                          <h3 className="text-xl font-bold">
                            {categoryLabels[category as keyof typeof categoryLabels]}
                          </h3>
                        </motion.div>
                      </div>
                    )}
                    
                    <motion.div 
                      className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                      variants={{
                        hidden: { opacity: 0 },
                        visible: {
                          opacity: 1,
                          transition: {
                            staggerChildren: prefersReducedMotion ? 0 : staggerTimings.tight,
                            delayChildren: prefersReducedMotion ? 0 : categoryIndex * 0.05
                          }
                        }
                      }}
                    >
                      {categorySkills.map((skill, skillIndex) => (
                        <AnimatedSkillBar
                          key={skill.name}
                          skill={skill}
                          index={skillIndex}
                          isVisible={isVisible}
                          prefersReducedMotion={prefersReducedMotion}
                          variants={skillVariants}
                          hoveredSkill={hoveredSkill}
                          setHoveredSkill={setHoveredSkill}
                        />
                      ))}
                    </motion.div>
                  </motion.div>
                );
              })}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

interface AnimatedSkillBarProps {
  skill: Skill;
  index: number;
  isVisible: boolean;
  prefersReducedMotion: boolean;
  variants: any;
  hoveredSkill: string | null;
  setHoveredSkill: (skill: string | null) => void;
}

const AnimatedSkillBar: React.FC<AnimatedSkillBarProps> = ({ 
  skill, 
  index, 
  isVisible, 
  prefersReducedMotion,
  variants,
  hoveredSkill,
  setHoveredSkill
}) => {
  const skillId = `skill-${skill.name.toLowerCase().replace(/\s+/g, '-')}`;
  const isHovered = hoveredSkill === skill.name;
  const isHighProficiency = skill.proficiency >= 85;

  // Skill bar fill animation with elastic easing
  const skillBarVariants = {
    hidden: { width: "0%" },
    visible: { 
      width: `${skill.proficiency}%`,
      transition: { 
        duration: prefersReducedMotion ? 0.01 : animationDurations.smooth,
        ease: prefersReducedMotion ? "linear" : easingFunctions.easeOutElastic,
        delay: prefersReducedMotion ? 0 : index * 0.05
      }
    }
  };

  // Glow effect for high proficiency skills
  const glowVariants = {
    hidden: { 
      boxShadow: "0 0 0 rgba(59, 130, 246, 0)",
      filter: "brightness(1)"
    },
    visible: { 
      boxShadow: isHighProficiency 
        ? "0 0 20px rgba(59, 130, 246, 0.4), 0 0 40px rgba(59, 130, 246, 0.2)" 
        : "0 0 0 rgba(59, 130, 246, 0)",
      filter: isHighProficiency ? "brightness(1.1)" : "brightness(1)",
      transition: { 
        duration: prefersReducedMotion ? 0.01 : animationDurations.medium,
        delay: prefersReducedMotion ? 0 : index * 0.05 + 0.2
      }
    }
  };

  return (
    <motion.article 
      className={`backdrop-blur-md bg-white/90 border border-gray-200 p-6 rounded-xl shadow-xl hover:bg-white/95 transition-all duration-300 focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 relative cursor-pointer ${
        isHighProficiency ? 'ring-1 ring-blue-500/30' : ''
      } ${isHovered ? 'bg-white/95 border-gray-300' : ''}`}
      role="article"
      aria-labelledby={`${skillId}-name`}
      aria-describedby={`${skillId}-level`}
      tabIndex={0}
      variants={variants}
      whileHover={prefersReducedMotion ? {} : { 
        scale: 1.03,
        boxShadow: isHighProficiency 
          ? "0 20px 40px -10px rgba(59, 130, 246, 0.3), 0 10px 20px -5px rgba(59, 130, 246, 0.2)"
          : "0 20px 40px -10px rgba(0, 0, 0, 0.2), 0 10px 20px -5px rgba(0, 0, 0, 0.1)",
        transition: { 
          duration: 0.3,
          ease: [0.34, 1.26, 0.64, 1] // easeOutBack
        }
      }}
      onHoverStart={() => setHoveredSkill(skill.name)}
      onHoverEnd={() => setHoveredSkill(null)}
      onFocus={() => setHoveredSkill(skill.name)}
      onBlur={() => setHoveredSkill(null)}
      style={{ transformOrigin: "center" }}
    >
      <div className="flex justify-between items-center mb-3">
        <h4 id={`${skillId}-name`} className="font-semibold text-gray-900">
          {skill.name}
        </h4>
        <span 
          id={`${skillId}-level`}
          className={`text-sm font-medium ${
            isHighProficiency ? 'text-blue-600' : 'text-gray-700'
          }`}
          aria-label={`Proficiency level: ${skill.proficiency} percent`}
        >
          <AnimatedCounter
            key={`${skill.name}-${isVisible}`}
            to={isVisible ? skill.proficiency : 0}
            suffix="%"
            duration={prefersReducedMotion ? 0.01 : animationDurations.dramatic}
            delay={prefersReducedMotion ? 0 : index * 0.1}
            trigger="immediate"
            easing="easeOut"
          />
        </span>
      </div>
      
      <div 
        className="w-full bg-gray-200 rounded-full h-3 backdrop-blur-sm overflow-hidden"
        role="progressbar"
        aria-valuenow={isVisible ? skill.proficiency : 0}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-labelledby={`${skillId}-name`}
        aria-describedby={`${skillId}-level`}
      >
        <motion.div 
          className={`bg-gradient-to-r ${skill.color} h-3 rounded-full shadow-lg relative`}
          variants={skillBarVariants}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          aria-hidden="true"
        >
          {/* Glow effect overlay for high proficiency skills */}
          {isHighProficiency && (
            <motion.div
              className={`absolute inset-0 bg-gradient-to-r ${skill.color} rounded-full`}
              variants={glowVariants}
              initial="hidden"
              animate={isVisible ? "visible" : "hidden"}
            />
          )}
          
          {/* Shimmer effect for skill bars */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-full"
            initial={{ x: "-100%" }}
            animate={isVisible && !prefersReducedMotion ? { 
              x: "100%",
              transition: {
                duration: 2,
                delay: index * 0.1 + 1,
                ease: "easeInOut"
              }
            } : {}}
          />
        </motion.div>
      </div>
      
      {/* Experience indicator */}
      <div className="mt-2 text-xs text-gray-600">
        {skill.yearsOfExperience} year{skill.yearsOfExperience !== 1 ? 's' : ''} experience
      </div>
    </motion.article>
  );
};

export default AnimatedSkills;