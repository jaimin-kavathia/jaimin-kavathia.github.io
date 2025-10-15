import { lazy, Suspense, useState, useEffect } from "react";
import AnimatedNavigation from "./components/sections/AnimatedNavigation";
import LazySection from "./components/LazySection";
import PageTransition from "./components/animations/PageTransition";
import SectionTransition from "./components/animations/SectionTransition";
import ErrorState from "./components/animations/ErrorState";
import ContactForm from "./components/ContactForm";
import { useIntersectionObserver } from "./hooks/useIntersectionObserver";
import useSectionTransitions from "./hooks/useSectionTransitions";
import { personalInfo } from "./data/personalInfo";
import { initializeAccessibilityEnhancements } from "./utils/accessibility";
import { initializePerformanceOptimization } from "./utils/performance";
import { initializeFirebase } from "./services/firebase";
import { logVisit } from "./services/analyticsService";

// Lazy load sections for better performance
const AnimatedHero = lazy(
  () => import("./components/sections/AnimatedHeroSimple")
);
const About = lazy(() => import("./components/sections/About"));
const AnimatedSkills = lazy(
  () => import("./components/sections/AnimatedSkills")
);
const AnimatedProjects = lazy(
  () => import("./components/sections/AnimatedProjects")
);
const Packages = lazy(() => import("./components/sections/Packages"));
const AchievementsCertifications = lazy(
  () => import("./components/sections/AchievementsCertifications")
);
const Contact = lazy(() => import("./components/sections/Contact"));

function App() {
  const { isVisible } = useIntersectionObserver();
  const { scrollToSection: smoothScrollToSection } = useSectionTransitions();

  // Detect device capabilities for performance optimization
  const [performanceMode, setPerformanceMode] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isContactFormOpen, setIsContactFormOpen] = useState(false);

  useEffect(() => {
    const detectPerformanceMode = () => {
      const isLowEnd =
        navigator.hardwareConcurrency <= 4 ||
        (navigator as any).deviceMemory <= 4 ||
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        );
      const isMobile = window.innerWidth <= 768;

      setPerformanceMode(isLowEnd || isMobile);
    };

    detectPerformanceMode();
    window.addEventListener("resize", detectPerformanceMode);
    return () => window.removeEventListener("resize", detectPerformanceMode);
  }, []);

  // Initialize accessibility, performance, and analytics
  useEffect(() => {
    // Initialize accessibility enhancements
    initializeAccessibilityEnhancements();

    // Initialize performance monitoring and optimization
    initializePerformanceOptimization();

    // Initialize Firebase and log a visit
    try {
      const { db } = initializeFirebase();
      console.log("✅ Firebase initialized. Firestore ready:", !!db);
      logVisit();
    } catch (err) {
      console.warn("⚠️ Firebase initialization failed:", err);
    }
  }, []);

  // Simulate initial loading - just for the JK logo loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 50); // Very short delay to avoid gradient loading
    return () => clearTimeout(timer);
  }, []);

  const handleRetry = () => {
    setHasError(false);
    window.location.reload();
  };

  return (
    <PageTransition isLoading={isLoading} showLogo={true}>
      <div className="min-h-screen bg-white relative overflow-x-hidden">
        {/* Error State */}
        <ErrorState
          isVisible={hasError}
          title="Application Error"
          message="Something went wrong while loading the portfolio"
          type="error"
          onRetry={handleRetry}
          onDismiss={() => setHasError(false)}
        />

        {/* Skip to main content link for keyboard navigation */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 bg-gray-900 text-white px-4 py-2 rounded-lg font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
          onClick={(e) => {
            e.preventDefault();
            smoothScrollToSection("main-content");
          }}
        >
          Skip to main content
        </a>

        {/* Navigation */}
        <AnimatedNavigation />

        {/* Main Content */}
        <main
          id="main-content"
          tabIndex={-1}
          role="main"
          aria-label="Portfolio content"
        >
          {/* Hero Section - Always load immediately */}
          <SectionTransition
            id="home"
            animationType="fade"
            optimizeForMobile={performanceMode}
          >
            <Suspense
              fallback={
                <div className="min-h-screen flex items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500/30"></div>
                </div>
              }
            >
              <AnimatedHero
                isVisible={isVisible.home}
                onScrollToSection={smoothScrollToSection}
              />
            </Suspense>
          </SectionTransition>

          {/* About Section */}
          <SectionTransition
            id="about"
            animationType="slide"
            direction="up"
            optimizeForMobile={performanceMode}
          >
            <LazySection rootMargin="150px 0px">
              <About isVisible={isVisible.about} />
            </LazySection>
          </SectionTransition>

          {/* Skills Section (temporarily hidden) */}
          <div id="skills" className="hidden" aria-hidden="true" />

          {/* Packages Section */}
          <SectionTransition
            id="packages"
            animationType="fade"
            optimizeForMobile={performanceMode}
          >
            <LazySection rootMargin="100px 0px">
              <Packages isVisible={isVisible.packages} />
            </LazySection>
          </SectionTransition>

          {/* Projects Section */}
          <SectionTransition
            id="projects"
            animationType="scale"
            optimizeForMobile={performanceMode}
          >
            <LazySection rootMargin="100px 0px">
              <AnimatedProjects isVisible={isVisible.projects} />
            </LazySection>
          </SectionTransition>

          {/* Achievements & Certifications Section */}
          <SectionTransition
            id="achievements"
            animationType="slide"
            direction="up"
            optimizeForMobile={performanceMode}
          >
            <LazySection rootMargin="100px 0px">
              <AchievementsCertifications isVisible={isVisible.achievements} />
            </LazySection>
          </SectionTransition>

          {/* Contact Section */}
          <SectionTransition
            id="contact"
            animationType="slide"
            direction="up"
            optimizeForMobile={performanceMode}
          >
            <LazySection rootMargin="50px 0px">
              <Contact isVisible={isVisible.contact} />
            </LazySection>
          </SectionTransition>
        </main>

        {/* Footer */}
        <footer
          className="py-12 relative"
          role="contentinfo"
          aria-label="Site footer"
        >
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="backdrop-blur-md bg-white/80 border border-gray-200 rounded-2xl p-8 shadow-lg">
              <div className="text-center">
                <div
                  className="text-2xl font-bold mb-4 bg-gradient-to-r from-gray-900 via-blue-600 to-purple-600 bg-clip-text text-transparent"
                  role="text"
                  aria-label={`${personalInfo.name} - Portfolio footer`}
                >
                  {personalInfo.name}
                </div>
                <p className="text-gray-600 mb-6">{personalInfo.tagline}</p>
                <nav
                  className="flex justify-center space-x-6 mb-6"
                  aria-label="Social media links"
                  role="navigation"
                >
                  <a
                    href={personalInfo.socialLinks.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="backdrop-blur-sm bg-gray-100 border border-gray-300 p-3 rounded-full text-gray-600 hover:text-gray-900 hover:bg-gray-200 transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    aria-label="Visit GitHub profile (opens in new tab)"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      role="img"
                    >
                      <title>GitHub</title>
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                  </a>
                  <a
                    href={personalInfo.socialLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="backdrop-blur-sm bg-gray-100 border border-gray-300 p-3 rounded-full text-gray-600 hover:text-gray-900 hover:bg-gray-200 transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    aria-label="Visit LinkedIn profile (opens in new tab)"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      role="img"
                    >
                      <title>LinkedIn</title>
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  </a>
                  {personalInfo.socialLinks.medium && (
                    <a
                      href={personalInfo.socialLinks.medium}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="backdrop-blur-sm bg-gray-100 border border-gray-300 p-3 rounded-full text-gray-600 hover:text-gray-900 hover:bg-gray-200 transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      aria-label="Visit Medium profile (opens in new tab)"
                    >
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
                  <button
                    onClick={() => setIsContactFormOpen(true)}
                    className="backdrop-blur-sm bg-gray-100 border border-gray-300 p-3 rounded-full text-gray-600 hover:text-gray-900 hover:bg-gray-200 transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    aria-label="Open contact form"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      role="img"
                    >
                      <title>Email</title>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </button>
                </nav>
                <div className="pt-6 border-t border-gray-200 text-gray-500 text-sm">
                  <p
                    role="text"
                    aria-label={`Copyright 2024 ${personalInfo.name}. All rights reserved.`}
                  >
                    © 2024 {personalInfo.name}. All rights reserved.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </footer>

        {/* Contact Form Modal */}
        <ContactForm
          isOpen={isContactFormOpen}
          onClose={() => setIsContactFormOpen(false)}
        />

        {/* Performance Monitor (development only) */}
        {typeof window !== "undefined" &&
          window.location.hostname === "localhost" && (
            <div className="fixed top-4 right-4 z-50 bg-black/80 text-white text-xs p-2 rounded">
              Dev Mode
            </div>
          )}
      </div>
    </PageTransition>
  );
}

export default App;
