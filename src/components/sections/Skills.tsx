import React from "react";
import { Zap, Smartphone, Wrench, BarChart3, Server } from "lucide-react";
import SkillBar from "../ui/SkillBar";
import { skills } from "../../data/skills";

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
      <div className="container-site">
        <div
          className={`transform transition-all duration-1000 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <header className="text-center mb-12 md:mb-16">
            <div className="inline-block">
              <h2
                id="skills-heading"
                className="text-3xl md:text-4xl font-bold mb-3 text-gray-900"
              >
                Skills & Expertise
              </h2>
              <p className="text-gray-600 text-base md:text-lg max-w-2xl mx-auto">
                Technologies and tools I use to bring ideas to life
              </p>
            </div>
          </header>

          {(() => {
            const categories: {
              key: "mobile" | "backend" | "tools" | "design";
              label: string;
              Icon: React.FC<any>;
            }[] = [
              { key: "mobile", label: "Mobile Development", Icon: Smartphone },
              { key: "backend", label: "Backend & APIs", Icon: Server },
              { key: "tools", label: "Tools & Workflow", Icon: Wrench },
              { key: "design", label: "Analytics & Design", Icon: BarChart3 },
            ];

            return (
              <div
                className="space-y-10 md:space-y-12"
                role="region"
                aria-label="Technical skills and proficiency levels"
              >
                {categories.map(({ key, label, Icon }) => {
                  const group = skills.filter((s) => s.category === key);
                  if (group.length === 0) return null;
                  return (
                    <section key={key} aria-labelledby={`skills-group-${key}`}>
                      <div className="flex items-center gap-2 mb-4">
                        <Icon
                          className="h-5 w-5 text-blue-600"
                          aria-hidden="true"
                        />
                        <h3
                          id={`skills-group-${key}`}
                          className="text-lg font-semibold text-gray-900"
                        >
                          {label}
                        </h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                        {group.map((skill, index) => (
                          <SkillBar
                            key={skill.name}
                            skill={skill}
                            index={index}
                            isVisible={isVisible}
                          />
                        ))}
                      </div>
                    </section>
                  );
                })}
              </div>
            );
          })()}
        </div>
      </div>
    </section>
  );
};

export default Skills;
