import React from "react";
import { Skill } from "../../types";
import AnimatedCounter from "../animations/AnimatedCounter";

interface SkillBarProps {
  skill: Skill;
  index: number;
  isVisible: boolean;
}

const SkillBar: React.FC<SkillBarProps> = ({ skill, index, isVisible }) => {
  const skillId = `skill-${skill.name.toLowerCase().replace(/\s+/g, "-")}`;

  return (
    <article
      className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-300 hover:shadow-md focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2"
      role="article"
      aria-labelledby={`${skillId}-name`}
      aria-describedby={`${skillId}-level`}
      tabIndex={0}
    >
      <div className="flex items-center justify-between mb-3">
        <h3 id={`${skillId}-name`} className="font-semibold text-gray-900">
          {skill.name}
        </h3>
        <span
          id={`${skillId}-level`}
          className="text-sm font-medium text-gray-600"
          aria-label={`Proficiency level: ${skill.proficiency} percent`}
        >
          <AnimatedCounter
            to={isVisible ? skill.proficiency : 0}
            suffix="%"
            duration={1.2}
            delay={index * 0.08}
            trigger="immediate"
            easing="easeOut"
          />
        </span>
      </div>
      <div
        className="w-full h-2 rounded-full bg-gray-100"
        role="progressbar"
        aria-valuenow={isVisible ? skill.proficiency : 0}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-labelledby={`${skillId}-name`}
        aria-describedby={`${skillId}-level`}
      >
        <div
          className={`h-2 rounded-full transition-all duration-1000 ease-out bg-gradient-to-r ${skill.color}`}
          style={{
            width: isVisible ? `${skill.proficiency}%` : "0%",
            transitionDelay: `${index * 80}ms`,
          }}
          aria-hidden="true"
        ></div>
      </div>
    </article>
  );
};

export default SkillBar;
