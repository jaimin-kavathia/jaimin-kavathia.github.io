import React, { useState, useEffect, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
} from "framer-motion";
import { Menu, X } from "lucide-react";
import { personalInfo } from "../../data/personalInfo";
import {
  manageFocusForNavigation,
  announceToScreenReader,
} from "../../utils/accessibility";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { easingFunctions } from "../../utils/easingFunctions";

const AnimatedNavigation: React.FC = () => {
  const [activeSection, setActiveSection] = useState("home");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll();
  const progressWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  const sections = [
    { id: "home", label: "Home" },
    { id: "about", label: "About" },
    { id: "skills", label: "Skills" },
    { id: "packages", label: "Packages" },
    { id: "projects", label: "Projects" },
    { id: "achievements", label: "Achievements" },
    { id: "contact", label: "Contact" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 50);

      const sectionIds = [
        "home",
        "about",
        "skills",
        "packages",
        "projects",
        "achievements",
        "contact",
      ];
      const scrollPos = scrollPosition + 100;

      for (const section of sectionIds) {
        const element = document.getElementById(section);
        if (element) {
          const offsetTop = element.offsetTop;
          const offsetHeight = element.offsetHeight;

          if (scrollPos >= offsetTop && scrollPos < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavigation = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (!element) return;

    setIsMobileMenuOpen(false);
    manageFocusForNavigation(sectionId);

    const sectionLabel =
      sections.find((s) => s.id === sectionId)?.label || sectionId;
    announceToScreenReader(`Navigated to ${sectionLabel} section`);

    const targetPosition = element.offsetTop - 80;
    const startPosition = window.scrollY;
    const distance = targetPosition - startPosition;
    const duration = prefersReducedMotion ? 0 : 1200;
    let startTime: number | null = null;

    const animateScroll = (currentTime: number) => {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / duration, 1);

      const easeInOutCubic = (t: number): number => {
        return t < 0.5
          ? 4 * t * t * t
          : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
      };

      const easedProgress = easeInOutCubic(progress);
      window.scrollTo(0, startPosition + distance * easedProgress);

      if (progress < 1) {
        requestAnimationFrame(animateScroll);
      }
    };

    if (duration > 0) {
      requestAnimationFrame(animateScroll);
    } else {
      window.scrollTo(0, targetPosition);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent, sectionId: string) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleNavigation(sectionId);
    }
  };

  return (
    <motion.nav
      ref={navRef}
      className="fixed top-0 left-0 right-0 z-50"
      role="navigation"
      aria-label="Main navigation"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{
        duration: prefersReducedMotion ? 0.1 : 0.6,
        ease: easingFunctions.easeOutBack,
      }}
    >
      <motion.div
        className="absolute top-0 left-0 h-1 bg-gradient-to-r from-blue-400 to-purple-500 z-10"
        style={{ width: progressWidth }}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.1 }}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
        <motion.div
          className={`transition-all duration-500 ease-out rounded-2xl shadow-xl ${
            isScrolled
              ? "backdrop-blur-md bg-white/95 border border-gray-200"
              : "backdrop-blur-sm bg-white/90 border border-gray-100"
          }`}
          animate={{
            backdropFilter: isScrolled ? "blur(12px)" : "blur(4px)",
            backgroundColor: isScrolled
              ? "rgba(255, 255, 255, 0.95)"
              : "rgba(255, 255, 255, 0.9)",
          }}
          transition={{ duration: prefersReducedMotion ? 0.1 : 0.5 }}
        >
          <div className="flex justify-between items-center h-16 px-6">
            <motion.div
              className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-blue-600 bg-clip-text text-transparent"
              role="banner"
              aria-label={`${personalInfo.name} - Portfolio`}
              whileHover={prefersReducedMotion ? {} : { scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              {personalInfo.name}
            </motion.div>

            <div className="hidden md:flex space-x-2 relative" role="menubar">
              {sections.map((section) => (
                <motion.button
                  key={section.id}
                  onClick={() => handleNavigation(section.id)}
                  onKeyDown={(e) => handleKeyDown(e, section.id)}
                  className={`relative capitalize transition-all duration-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                    activeSection === section.id
                      ? "text-gray-900 font-medium"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                  role="menuitem"
                  aria-current={
                    activeSection === section.id ? "page" : undefined
                  }
                  aria-label={`Navigate to ${section.label} section`}
                  whileHover={
                    prefersReducedMotion
                      ? {}
                      : {
                          scale: 1.05,
                          backgroundColor: "rgba(59, 130, 246, 0.1)",
                          y: -1,
                        }
                  }
                  whileFocus={
                    prefersReducedMotion
                      ? {}
                      : {
                          scale: 1.02,
                          backgroundColor: "rgba(59, 130, 246, 0.15)",
                          boxShadow: "0 0 0 2px rgba(59, 130, 246, 0.5)",
                        }
                  }
                  whileTap={prefersReducedMotion ? {} : { scale: 0.98 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                >
                  {section.label}

                  {activeSection === section.id && (
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full"
                      layoutId="activeIndicator"
                      initial={{ scaleX: 0, opacity: 0 }}
                      animate={{ scaleX: 1, opacity: 1 }}
                      transition={{
                        duration: prefersReducedMotion ? 0.1 : 0.3,
                        ease: "easeOut",
                      }}
                    />
                  )}

                  <motion.div
                    className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-400/10 to-purple-500/10 opacity-0"
                    whileHover={prefersReducedMotion ? {} : { opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  />
                </motion.button>
              ))}
            </div>

            <motion.button
              className="md:hidden text-gray-700 p-2 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
              aria-label={
                isMobileMenuOpen
                  ? "Close navigation menu"
                  : "Open navigation menu"
              }
              whileHover={
                prefersReducedMotion
                  ? {}
                  : {
                      scale: 1.1,
                      backgroundColor: "rgba(156, 163, 175, 0.1)",
                    }
              }
              whileFocus={
                prefersReducedMotion
                  ? {}
                  : {
                      scale: 1.05,
                      backgroundColor: "rgba(156, 163, 175, 0.15)",
                    }
              }
              whileTap={prefersReducedMotion ? {} : { scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <AnimatePresence mode="wait">
                {isMobileMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: prefersReducedMotion ? 0.1 : 0.2 }}
                  >
                    <X size={24} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: prefersReducedMotion ? 0.1 : 0.2 }}
                  >
                    <Menu size={24} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>

          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                id="mobile-menu"
                className="md:hidden border-t border-gray-200 backdrop-blur-md bg-white/95 overflow-hidden"
                role="menu"
                aria-label="Mobile navigation menu"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{
                  duration: prefersReducedMotion ? 0.1 : 0.3,
                  ease: "easeInOut",
                }}
              >
                <div className="px-6 py-4 space-y-2">
                  {sections.map((section, index) => (
                    <motion.button
                      key={section.id}
                      onClick={() => handleNavigation(section.id)}
                      onKeyDown={(e) => handleKeyDown(e, section.id)}
                      className={`relative block w-full text-left capitalize transition-all duration-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                        activeSection === section.id
                          ? "text-gray-900 bg-blue-100 backdrop-blur-sm font-medium"
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                      }`}
                      role="menuitem"
                      aria-current={
                        activeSection === section.id ? "page" : undefined
                      }
                      aria-label={`Navigate to ${section.label} section`}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{
                        delay: prefersReducedMotion ? 0 : index * 0.05,
                        duration: prefersReducedMotion ? 0.1 : 0.2,
                        ease: "easeOut",
                      }}
                      whileHover={
                        prefersReducedMotion
                          ? {}
                          : {
                              x: 4,
                              backgroundColor: "rgba(156, 163, 175, 0.15)",
                              scale: 1.02,
                            }
                      }
                      whileFocus={
                        prefersReducedMotion
                          ? {}
                          : {
                              x: 2,
                              backgroundColor: "rgba(156, 163, 175, 0.2)",
                              boxShadow: "0 0 0 2px rgba(59, 130, 246, 0.5)",
                            }
                      }
                      whileTap={prefersReducedMotion ? {} : { scale: 0.98 }}
                    >
                      {section.label}

                      {activeSection === section.id && (
                        <motion.div
                          className="absolute left-0 top-1/2 w-1 h-6 bg-gradient-to-b from-blue-400 to-purple-500 rounded-r-full"
                          initial={{ scaleY: 0, x: -4 }}
                          animate={{ scaleY: 1, x: 0 }}
                          transition={{
                            duration: prefersReducedMotion ? 0.1 : 0.3,
                            ease: "easeOut",
                          }}
                          style={{ transform: "translateY(-50%)" }}
                        />
                      )}

                      <motion.div
                        className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-400/5 to-purple-500/5 opacity-0"
                        whileHover={prefersReducedMotion ? {} : { opacity: 1 }}
                        transition={{ duration: 0.2 }}
                      />
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.nav>
  );
};

export default AnimatedNavigation;
