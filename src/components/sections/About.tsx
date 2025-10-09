import React from "react";
import { Github, Linkedin, Code, Smartphone, Award } from "lucide-react";
import { personalInfo } from "../../data/personalInfo";

interface AboutProps {
  isVisible: boolean;
}

const About: React.FC<AboutProps> = ({ isVisible }) => {
  const stats = [
    {
      icon: Code,
      value: "25+",
      label: "Projects Completed",
      color: "from-blue-100 to-cyan-100",
      iconColor: "text-blue-600",
      shadowColor: "hover:shadow-blue-500/25",
      ariaLabel: "25 plus projects completed",
    },
    {
      icon: Smartphone,
      value: "4+",
      label: "Years Experience",
      color: "from-purple-100 to-pink-100",
      iconColor: "text-purple-600",
      shadowColor: "hover:shadow-purple-500/25",
      ariaLabel: "4 plus years of experience",
    },
    {
      icon: Award,
      value: "4",
      label: "Awards Won",
      color: "from-orange-100 to-red-100",
      iconColor: "text-orange-600",
      shadowColor: "hover:shadow-orange-500/25",
      ariaLabel: "4 awards won",
    },
  ];

  return (
    <section
      id="about"
      className="py-20 relative"
      role="main"
      aria-labelledby="about-heading"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`transform transition-all duration-500 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <header className="text-center mb-16">
            <div className="backdrop-blur-md bg-white/80 border border-gray-200 rounded-2xl p-8 inline-block shadow-lg">
              <h2
                id="about-heading"
                className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-gray-900 via-blue-600 to-purple-600 bg-clip-text text-transparent"
              >
                About Me
              </h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                {personalInfo.tagline}
              </p>
            </div>
          </header>

          <div className="space-y-12">
            {/* My Journey - Full Width */}
            <article className="backdrop-blur-md bg-white/90 border border-gray-200 rounded-2xl p-8 shadow-xl">
              <h3 className="text-2xl font-bold mb-6 text-gray-900">
                My Journey
              </h3>
              <div className="space-y-6">
                <p className="text-gray-700 leading-relaxed">
                  {personalInfo.bio}
                </p>
                <p className="text-gray-700 leading-relaxed">
                  My journey began with a fascination for mobile technology and
                  the potential to create applications that could reach millions
                  of users across both iOS and Android platforms. Over the past{" "}
                  {personalInfo.yearsOfExperience} years, I've mastered
                  Flutter's ecosystem, from state management solutions like
                  BLoC, GetX, and Provider to advanced features like custom
                  animations, platform channels, and native integrations.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  I've successfully delivered 25+ mobile applications, ranging
                  from e-commerce platforms to fitness trackers, each optimized
                  for performance and user experience. My expertise includes
                  Firebase integration, REST API consumption, local database
                  management with Hive and SQLite, and implementing complex UI
                  designs with Flutter's rich widget system.
                </p>
              </div>
              <nav className="flex gap-4 mt-6" aria-label="Social media links">
                <a
                  href={personalInfo.socialLinks.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="backdrop-blur-md bg-gray-100 border border-gray-300 p-3 rounded-full text-gray-600 hover:bg-gray-200 hover:text-gray-900 transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  aria-label="Visit GitHub profile (opens in new tab)"
                >
                  <Github size={24} aria-hidden="true" />
                </a>
                <a
                  href={personalInfo.socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="backdrop-blur-md bg-gray-100 border border-gray-300 p-3 rounded-full text-gray-600 hover:bg-gray-200 hover:text-gray-900 transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  aria-label="Visit LinkedIn profile (opens in new tab)"
                >
                  <Linkedin size={24} aria-hidden="true" />
                </a>
                {personalInfo.socialLinks.medium && (
                  <a
                    href={personalInfo.socialLinks.medium}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="backdrop-blur-md bg-gray-100 border border-gray-300 p-3 rounded-full text-gray-600 hover:bg-gray-200 hover:text-gray-900 transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    aria-label="Visit Medium profile (opens in new tab)"
                  >
                    {/* Medium logo */}
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
              </nav>
            </article>

            {/* Statistics - Below Journey */}
            <div
              className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto"
              role="region"
              aria-label="Professional statistics"
            >
              {stats.map((stat) => {
                const IconComponent = stat.icon;
                return (
                  <div
                    key={stat.label}
                    className={`backdrop-blur-md bg-gradient-to-br ${stat.color} border border-gray-200 p-6 rounded-2xl text-center hover:shadow-2xl ${stat.shadowColor} transition-all duration-300 hover:scale-105 focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2`}
                    role="article"
                    aria-label={stat.ariaLabel}
                    tabIndex={0}
                  >
                    <IconComponent
                      size={32}
                      className={`${stat.iconColor} mx-auto mb-4`}
                      aria-hidden="true"
                    />
                    <h4
                      className="font-semibold text-gray-900 mb-2 text-2xl"
                      aria-label={`${stat.value} ${stat.label}`}
                    >
                      {stat.value}
                    </h4>
                    <p className="text-gray-600 text-sm" aria-hidden="true">
                      {stat.label}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
