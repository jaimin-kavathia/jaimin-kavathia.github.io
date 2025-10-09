import React, { useMemo, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { skills } from "../../data/skills";
import { Skill } from "../../types";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import {
  easingFunctions,
  animationDurations,
  staggerTimings,
} from "../../utils/easingFunctions";

interface AnimatedSkillsProps {
  isVisible: boolean;
}

interface SkillsByCategory {
  [key: string]: Skill[];
}

const AnimatedSkills: React.FC<AnimatedSkillsProps> = ({ isVisible }) => {
  const prefersReducedMotion = useReducedMotion();
  const [activeFilter, setActiveFilter] = useState<string>("all");
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
    if (activeFilter === "all") {
      return skillsByCategory;
    }
    return {
      [activeFilter]: skillsByCategory[activeFilter] || [],
    };
  }, [skillsByCategory, activeFilter]);

  const categoryOrder = ["mobile", "backend", "design", "tools"];
  const categoryLabels = {
    mobile: "Mobile Development",
    backend: "Backend & APIs",
    design: "Analytics & Design",
    tools: "Tools & Development",
  };

  const categoryIcons = {
    mobile: "📱",
    backend: "⚙️",
    design: "📊",
    tools: "🔧",
  };

  const categoryColors = {
    mobile: "from-blue-500 to-cyan-500",
    backend: "from-green-500 to-teal-500",
    design: "from-purple-500 to-pink-500",
    tools: "from-orange-500 to-red-500",
  };

  const filterOptions: any[] = [];

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
        delayChildren: prefersReducedMotion ? 0 : 0.1,
      },
    },
  };

  const categoryVariants = {
    hidden: {
      opacity: 0,
      y: prefersReducedMotion ? 0 : 30,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: prefersReducedMotion ? 0.01 : animationDurations.quick,
        ease: easingFunctions.easeOutCubic,
      },
    },
  };

  const skillVariants = {
    hidden: {
      opacity: 0,
      y: prefersReducedMotion ? 0 : 20,
      scale: prefersReducedMotion ? 1 : 0.9,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: prefersReducedMotion ? 0.01 : animationDurations.fast,
        ease: easingFunctions.easeOutBack,
      },
    },
  };

  return (
    <section
      id="skills"
      className="py-14 relative"
      role="main"
      aria-labelledby="skills-heading"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          variants={containerVariants}
        >
          <motion.header
            className="text-center mb-8"
            variants={categoryVariants}
          >
            <div className="inline-block">
              <h2
                id="skills-heading"
                className="text-2xl md:text-3xl font-bold mb-2 bg-gradient-to-r from-gray-900 via-blue-600 to-purple-600 bg-clip-text text-transparent"
              >
                Skills & Expertise
              </h2>
            </div>
          </motion.header>

          <motion.div
            id="skills-content"
            className="space-y-10 backdrop-blur-md bg-white/90 border border-gray-200 rounded-2xl p-6 md:p-8 shadow-sm"
            role="region"
            aria-label="Technical skills organized by category"
          >
            {(activeFilter === "all" ? categoryOrder : [activeFilter]).map(
              (category, categoryIndex) => {
                const categorySkills = filteredSkillsByCategory[category];
                if (!categorySkills || categorySkills.length === 0) return null;

                return (
                  <motion.div
                    key={`${activeFilter}-${category}`}
                    variants={categoryVariants}
                    className="space-y-6"
                  >
                    {activeFilter === "all" && (
                      <div className="mb-3">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm text-gray-700 bg-white">
                          <span className="text-base" aria-hidden="true">
                            {
                              categoryIcons[
                                category as keyof typeof categoryIcons
                              ]
                            }
                          </span>
                          <h3 className="font-semibold">
                            {
                              categoryLabels[
                                category as keyof typeof categoryLabels
                              ]
                            }
                          </h3>
                        </div>
                      </div>
                    )}

                    <motion.div
                      className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                      variants={{
                        hidden: { opacity: 0 },
                        visible: {
                          opacity: 1,
                          transition: {
                            staggerChildren: prefersReducedMotion
                              ? 0
                              : staggerTimings.tight,
                            delayChildren: prefersReducedMotion
                              ? 0
                              : categoryIndex * 0.05,
                          },
                        },
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
              }
            )}
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
  setHoveredSkill,
}) => {
  const skillId = `skill-${skill.name.toLowerCase().replace(/\s+/g, "-")}`;
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
        delay: prefersReducedMotion ? 0 : index * 0.05,
      },
    },
  };

  // Glow effect for high proficiency skills
  const glowVariants = {
    hidden: {
      boxShadow: "0 0 0 rgba(59, 130, 246, 0)",
      filter: "brightness(1)",
    },
    visible: {
      boxShadow: isHighProficiency
        ? "0 0 20px rgba(59, 130, 246, 0.4), 0 0 40px rgba(59, 130, 246, 0.2)"
        : "0 0 0 rgba(59, 130, 246, 0)",
      filter: isHighProficiency ? "brightness(1.1)" : "brightness(1)",
      transition: {
        duration: prefersReducedMotion ? 0.01 : animationDurations.medium,
        delay: prefersReducedMotion ? 0 : index * 0.05 + 0.2,
      },
    },
  };

  return (
    <motion.article
      className={`backdrop-blur-md bg-white/90 border border-gray-200 p-6 rounded-xl shadow-xl hover:bg-white/95 transition-all duration-300 focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 relative cursor-pointer ${
        isHighProficiency ? "ring-1 ring-blue-500/30" : ""
      } ${isHovered ? "bg-white/95 border-gray-300" : ""}`}
      role="article"
      aria-labelledby={`${skillId}-name`}
      aria-describedby={`${skillId}-level`}
      tabIndex={0}
      variants={variants}
      whileHover={
        prefersReducedMotion
          ? {}
          : {
              scale: 1.03,
              boxShadow: isHighProficiency
                ? "0 20px 40px -10px rgba(59, 130, 246, 0.3), 0 10px 20px -5px rgba(59, 130, 246, 0.2)"
                : "0 20px 40px -10px rgba(0, 0, 0, 0.2), 0 10px 20px -5px rgba(0, 0, 0, 0.1)",
              transition: {
                duration: 0.3,
                ease: [0.34, 1.26, 0.64, 1], // easeOutBack
              },
            }
      }
      onHoverStart={() => setHoveredSkill(skill.name)}
      onHoverEnd={() => setHoveredSkill(null)}
      onFocus={() => setHoveredSkill(skill.name)}
      onBlur={() => setHoveredSkill(null)}
      style={{ transformOrigin: "center" }}
    >
      <div className="flex items-center justify-center">
        <h4 id={`${skillId}-name`} className="font-semibold text-gray-900">
          {skill.name}
        </h4>
      </div>

      {/* no progress bar */}

      {/* no experience indicator */}
    </motion.article>
  );
};

export default AnimatedSkills;
