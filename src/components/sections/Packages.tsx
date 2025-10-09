import React from "react";
import { Github, ExternalLink } from "lucide-react";
import { packages } from "../../data/packages";

interface PackagesProps {
  isVisible: boolean;
}

const Packages: React.FC<PackagesProps> = ({ isVisible }) => {
  return (
    <section
      id="packages"
      className="py-20 relative"
      role="main"
      aria-labelledby="packages-heading"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`transform transition-all duration-700 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <header className="text-center mb-10">
            <h2
              id="packages-heading"
              className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-600 to-purple-600 bg-clip-text text-transparent"
            >
              Open-source Package — built by me
            </h2>
          </header>

          {(() => {
            const pkg = packages[0];
            if (!pkg) return null;

            return (
              <article
                className="mx-auto max-w-3xl rounded-2xl shadow-[0_10px_40px_rgba(2,6,23,0.12)] overflow-hidden border border-gray-200 bg-white"
                role="article"
                aria-labelledby={`${pkg.id}-title`}
              >
                <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-6 py-6 md:px-8">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3
                        id={`${pkg.id}-title`}
                        className="text-2xl md:text-3xl font-extrabold text-white"
                      >
                        {pkg.name}
                      </h3>
                      <p className="text-blue-100 mt-1 max-w-2xl">
                        {pkg.description}
                      </p>
                    </div>
                    <span className="shrink-0 text-xs px-2 py-1 rounded bg-white/20 text-white border border-white/30">
                      {pkg.version}
                    </span>
                  </div>
                </div>

                <div className="p-6 md:p-8">
                  <div className="grid md:grid-cols-2 gap-6 items-start">
                    <div className="space-y-5">
                      <div>
                        <div className="flex flex-wrap gap-2">
                          {pkg.technologies.map((tech) => (
                            <span
                              key={tech}
                              className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-700 border border-gray-200"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                      <ul className="grid gap-2 text-sm text-gray-700">
                        <li className="flex items-start gap-2">
                          <span className="mt-1 h-1.5 w-1.5 rounded-full bg-blue-500"></span>
                          Adaptive UI for iOS and Android
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="mt-1 h-1.5 w-1.5 rounded-full bg-blue-500"></span>
                          Camera and Gallery support
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="mt-1 h-1.5 w-1.5 rounded-full bg-blue-500"></span>
                          Permissions handling included
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="mt-1 h-1.5 w-1.5 rounded-full bg-blue-500"></span>
                          Lightweight and customizable
                        </li>
                      </ul>
                    </div>

                    <div className="space-y-3">
                      <nav
                        className="flex flex-col gap-3"
                        aria-label={`Links for ${pkg.name}`}
                      >
                        {pkg.githubUrl && (
                          <a
                            href={pkg.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex justify-center items-center gap-2 h-11 px-4 rounded-lg text-white bg-gray-900 hover:bg-black border border-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            aria-label={`View ${pkg.name} on GitHub (opens in new tab)`}
                          >
                            <Github size={16} aria-hidden="true" />
                            <span className="text-sm">GitHub</span>
                          </a>
                        )}
                        {pkg.pubDevUrl && (
                          <a
                            href={pkg.pubDevUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex justify-center items-center gap-2 h-11 px-4 rounded-lg text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            aria-label={`View ${pkg.name} on pub.dev (opens in new tab)`}
                          >
                            <ExternalLink size={16} aria-hidden="true" />
                            <span className="text-sm">pub.dev</span>
                          </a>
                        )}
                        {pkg.blogUrl && (
                          <a
                            href={pkg.blogUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex justify-center items-center gap-2 h-11 px-4 rounded-lg text-green-700 bg-green-50 hover:bg-green-100 border border-green-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            aria-label={`Read blog about ${pkg.name} (opens in new tab)`}
                          >
                            <ExternalLink size={16} aria-hidden="true" />
                            <span className="text-sm">Blog</span>
                          </a>
                        )}
                      </nav>

                      {/* no bullets on the buttons column */}
                    </div>
                  </div>
                </div>
              </article>
            );
          })()}
        </div>
      </div>
    </section>
  );
};

export default Packages;
