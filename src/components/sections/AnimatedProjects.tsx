import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Project } from '../../types';
import { projects } from '../../data/projects';
import ScrollReveal from '../animations/ScrollReveal';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface AnimatedProjectsProps {
  isVisible?: boolean;
}

interface ProjectCardProps {
  project: Project;
  index: number;
  onImageClick: (project: Project, imageIndex: number) => void;
  description: string;
}

interface ImageModalProps {
  project: Project | null;
  imageIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
  onImageSelect: (index: number) => void;
}



// Create standardized descriptions (same length for all projects)
const getStandardizedDescription = (project: Project) => {
  const descriptions: { [key: string]: string } = {
    "imin": "A comprehensive social networking app that connects people through shared activities and events. Features real-time activity discovery, smart matching algorithms, and safety-first design for authentic social connections.",
    "kickstat": "The ultimate women's football companion app providing live scores, fixtures, and comprehensive updates from 28+ leagues across 10 countries. Includes team following and social media integration for fan engagement.",
    "property-watch": "A modernized property management application featuring null safety migration and latest Flutter updates. Includes enhanced UI components, bug fixes, and improved performance for seamless property tracking.",
    "recovr": "A comprehensive rehabilitation and recovery platform offering personalized rehab programs, mobility exercises, and strengthening routines. Features progress tracking, self-care guidance, and professional health support.",
    "phoneawaybox": "An innovative school phone management system using NFC technology for secure device storage. Tracks phone-free hours, promotes healthy digital habits, and provides comprehensive administrative controls.",
    "cheeky-events": "A unique social dating platform that connects strangers through organized events and activities. Focuses on meaningful interactions in safe, event-based environments with comprehensive matching features.",
    "ready-set-dance": "A complete entertainment app featuring Chrome Casting, Air Play, and comprehensive media playback capabilities. Includes background audio, lyrics display, offline functionality, and customer support integration.",
    "bluepixel-pmt": "A comprehensive project management solution featuring attendance tracking, employee management, salary processing, and real-time team communication. Includes detailed project monitoring and work hour tracking.",
    "ble-flutter-sdk": "A custom Bluetooth Low Energy SDK with comprehensive BLE functionality including device scanning, connection management, advertising, and data operations. Features native platform integration and robust architecture.",
    "smart-home": "An intuitive smart home automation app with elegant UI design for controlling various home appliances. Features MQTT protocol integration with AWS IoT Services for reliable and secure device management.",
    "haua": "A comprehensive femtech application providing intelligent menstrual cycle tracking, symptom analysis, and expert health resources. Features wellness recommendations, partner connectivity, and strong privacy protection.",
    "spanish-bpl": "An interactive Spanish language learning application designed for English speakers. Features comprehensive lessons, audio pronunciation guides, progress tracking, and premium content through in-app purchases.",
    "bondorbit": "A real-time proximity-based social networking app utilizing Bluetooth and location services for connecting nearby users. Features live chat, user following, and instant local community building capabilities.",
    "frekkel": "An advanced AI-powered skincare application utilizing facial recognition technology for skin issue detection. Provides personalized skincare routines, product recommendations, and comprehensive daily care plans."
  };
  return descriptions[project.id] || project.description;
};

// Project card with 3D effects and animations
const AnimatedProjectCard: React.FC<ProjectCardProps> = ({ project, index, onImageClick, description }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  // Detect touch device
  useEffect(() => {
    const checkTouchDevice = () => {
      setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
    };
    
    checkTouchDevice();
    window.addEventListener('resize', checkTouchDevice);
    
    return () => window.removeEventListener('resize', checkTouchDevice);
  }, []);

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 50,
      rotateX: -15,
      scale: 0.9
    },
    visible: { 
      opacity: 1, 
      y: 0,
      rotateX: 0,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: "easeOut" as const,
        delay: index * 0.08,
      }
    }
  };

  const hoverVariants = prefersReducedMotion ? {
    rest: {},
    hover: {}
  } : {
    rest: {
      scale: 1,
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
    },
    hover: {
      scale: isTouchDevice ? 1.02 : 1.03, // Uniform scale for entire card
      boxShadow: isTouchDevice 
        ? '0 15px 35px rgba(0, 0, 0, 0.4)' 
        : '0 20px 40px rgba(0, 0, 0, 0.5)',
      transition: {
        duration: isTouchDevice ? 0.2 : 0.3,
        ease: "easeOut" as const,
      }
    }
  };



  return (
    <motion.article
      className="group relative h-full"
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <motion.div
        className="bg-white border border-gray-200 rounded-2xl relative shadow-sm hover:shadow-lg transition-shadow duration-300 h-full flex flex-col"
        variants={hoverVariants}
        animate={isHovered ? 'hover' : 'rest'}
      >
        {/* Content section */}
        <div className="p-4 sm:p-6 relative flex-1 flex flex-col">
          {/* Project header with compact icon */}
          <div className="flex items-start gap-3 mb-3 sm:mb-4">
            <motion.div 
              className="flex-shrink-0"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-sm">
                <span className="text-white font-bold text-base sm:text-lg">
                  {project.title.charAt(0)}
                </span>
              </div>
            </motion.div>
            <div className="flex-1 min-w-0">
              <motion.h3 
                className="text-lg sm:text-xl font-bold text-gray-900 mb-1 truncate"
                animate={isHovered ? { x: 2 } : { x: 0 }}
                transition={{ duration: 0.2 }}
              >
                {project.title}
              </motion.h3>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                <span className="text-xs text-gray-500 font-medium">Project</span>
              </div>
            </div>
          </div>
          
          <motion.p 
            className="text-gray-600 mb-3 sm:mb-4 text-sm leading-relaxed line-clamp-3"
            animate={isHovered ? { x: 2 } : { x: 0 }}
            transition={{ duration: 0.2, delay: 0.05 }}
            style={{
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}
          >
            {description}
          </motion.p>

          {/* Technologies */}
          <motion.div 
            className="mb-3 sm:mb-4 flex-1"
            animate={isHovered ? { x: 2 } : { x: 0 }}
            transition={{ duration: 0.2, delay: 0.1 }}
          >
            <h4 className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">
              Tech Stack
            </h4>
            <div className="flex flex-wrap gap-1">
              {project.technologies.slice(0, 5).map((tech, techIndex) => (
                <motion.span
                  key={tech}
                  className="bg-gray-50 border border-gray-200 text-gray-700 px-2 py-1 rounded-md text-xs font-medium"
                  whileHover={{ scale: 1.02, backgroundColor: '#f3f4f6' }}
                  transition={{ duration: 0.15, delay: techIndex * 0.02 }}
                >
                  {tech}
                </motion.span>
              ))}
              {project.technologies.length > 5 && (
                <span className="text-gray-400 text-xs px-2 py-1 font-medium">
                  +{project.technologies.length - 5}
                </span>
              )}
            </div>
          </motion.div>

          {/* Project status indicator */}
          <motion.div 
            className="flex items-center gap-2 mt-auto pt-2 border-t border-gray-100"
            animate={isHovered ? { x: 2 } : { x: 0 }}
            transition={{ duration: 0.2, delay: 0.15 }}
          >
            <div className={`w-1.5 h-1.5 rounded-full ${
              project.status === 'in-progress' 
                ? 'bg-blue-500 animate-pulse' 
                : project.status === 'planned'
                ? 'bg-yellow-500'
                : 'bg-green-500'
            }`}></div>
            <span className="text-xs text-gray-500 font-medium">
              {project.status === 'in-progress' 
                ? 'In Progress' 
                : project.status === 'planned'
                ? 'Planned'
                : 'Completed'}
            </span>
          </motion.div>
        </div>
      </motion.div>
    </motion.article>
  );
};

// Image gallery modal with smooth transitions
const ImageModal: React.FC<ImageModalProps> = ({ 
  project, 
  imageIndex, 
  isOpen, 
  onClose, 
  onNext, 
  onPrev,
  onImageSelect
}) => {
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // Detect touch device
  useEffect(() => {
    const checkTouchDevice = () => {
      setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
    };
    
    checkTouchDevice();
    window.addEventListener('resize', checkTouchDevice);
    
    return () => window.removeEventListener('resize', checkTouchDevice);
  }, []);

  // Handle touch gestures for image navigation
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && project && imageIndex < project.images.length - 1) {
      // Add haptic feedback if available
      if ('vibrate' in navigator) {
        navigator.vibrate(50);
      }
      onNext();
    }
    if (isRightSwipe && imageIndex > 0) {
      // Add haptic feedback if available
      if ('vibrate' in navigator) {
        navigator.vibrate(50);
      }
      onPrev();
    }
  };

  if (!project) return null;

  const modalVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
      y: 50,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut" as const,
      }
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      y: 50,
      transition: {
        duration: 0.2,
      }
    }
  };

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={onClose}
          />
          
          {/* Modal content */}
          <motion.div
            className="relative max-w-4xl w-full max-h-[90vh] bg-white/10 backdrop-blur-md border border-white/20 rounded-xl overflow-hidden"
            variants={modalVariants}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <motion.button
              className="absolute top-4 right-4 z-10 bg-black/50 backdrop-blur-sm rounded-full p-2 text-white hover:bg-black/70 transition-colors"
              onClick={onClose}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <X size={20} />
            </motion.button>

            {/* Image */}
            <div 
              className="aspect-video relative"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <motion.img
                key={imageIndex}
                src={project.images[imageIndex]}
                alt={`${project.title} screenshot ${imageIndex + 1}`}
                className="w-full h-full object-cover"
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                drag={isTouchDevice ? false : undefined} // Disable drag on touch devices to prevent conflicts
              />
              
              {/* Navigation arrows */}
              {project.images.length > 1 && (
                <>
                  <motion.button
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 backdrop-blur-sm rounded-full p-2 text-white hover:bg-black/70 transition-colors"
                    onClick={onPrev}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    ←
                  </motion.button>
                  <motion.button
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 backdrop-blur-sm rounded-full p-2 text-white hover:bg-black/70 transition-colors"
                    onClick={onNext}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    →
                  </motion.button>
                </>
              )}
            </div>

            {/* Project info */}
            <div className="p-6">
              <h3 className="text-2xl font-bold text-white mb-2">{project.title}</h3>
              <p className="text-white/80 mb-4">{project.longDescription || project.description}</p>
              
              {/* Image indicators */}
              {project.images.length > 1 && (
                <div className="flex gap-2 justify-center">
                  {project.images.map((_, index) => (
                    <motion.button
                      key={index}
                      className={`w-3 h-3 rounded-full transition-colors ${
                        index === imageIndex ? 'bg-white' : 'bg-white/40'
                      } ${isTouchDevice ? 'w-4 h-4' : 'w-3 h-3'}`} // Larger touch targets on mobile
                      onClick={() => onImageSelect(index)}
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                      aria-label={`Go to image ${index + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const AnimatedProjects: React.FC<AnimatedProjectsProps> = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showAllProjects, setShowAllProjects] = useState(false);
  const [screenSize, setScreenSize] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');

  // Detect screen size
  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setScreenSize('mobile');
      } else if (width < 1024) {
        setScreenSize('tablet');
      } else {
        setScreenSize('desktop');
      }
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Determine how many projects to show initially based on screen size
  const getInitialProjectCount = () => {
    switch (screenSize) {
      case 'mobile': return 2;   // 1 column = 2 projects
      case 'tablet': return 4;   // 2 columns = 4 projects
      case 'desktop': return 6;  // 3 columns = 6 projects
      default: return 6;
    }
  };

  // Show projects based on screen size or all if showAllProjects is true
  const displayedProjects = showAllProjects ? projects : projects.slice(0, getInitialProjectCount());

  const handleImageClick = (project: Project, imageIndex: number) => {
    setSelectedProject(project);
    setSelectedImageIndex(imageIndex);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => {
      setSelectedProject(null);
      setSelectedImageIndex(0);
    }, 300);
  };

  const handleNextImage = () => {
    if (selectedProject && selectedImageIndex < selectedProject.images.length - 1) {
      setSelectedImageIndex(selectedImageIndex + 1);
    }
  };

  const handlePrevImage = () => {
    if (selectedImageIndex > 0) {
      setSelectedImageIndex(selectedImageIndex - 1);
    }
  };

  const handleImageIndicatorClick = (index: number) => {
    setSelectedImageIndex(index);
  };

  return (
    <>
      <section 
        id="projects" 
        className="py-16 relative"
        role="main"
        aria-labelledby="projects-heading"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal animation="fade" delay={0.2}>
            <header className="text-center mb-16">
              <div className="backdrop-blur-md bg-white/80 border border-gray-200 rounded-3xl p-8 inline-block shadow-xl max-w-4xl mx-auto">
                <motion.h2 
                  id="projects-heading"
                  className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-gray-900 via-blue-600 to-purple-600 bg-clip-text text-transparent"
                  initial={{ backgroundPosition: '200% 0' }}
                  animate={{ backgroundPosition: '-200% 0' }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                  style={{
                    backgroundSize: '200% 100%',
                  }}
                >
                  My Projects
                </motion.h2>
                <motion.p 
                  className="text-gray-600 text-lg max-w-2xl mx-auto"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                >
                  A showcase of my latest work and achievements
                </motion.p>
              </div>
            </header>
          </ScrollReveal>
          
          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedProjects.map((project, index) => (
              <AnimatedProjectCard
                key={project.id}
                project={project}
                index={index}
                onImageClick={handleImageClick}
                description={getStandardizedDescription(project)}
              />
            ))}
          </div>

          {/* View All / View Less Button */}
          <div className="text-center mt-8 sm:mt-12">
            <motion.button
              onClick={() => setShowAllProjects(!showAllProjects)}
              className="backdrop-blur-md bg-white/80 border border-gray-200 rounded-full px-6 sm:px-8 py-3 sm:py-4 shadow-xl hover:bg-white/90 transition-all duration-300 font-medium text-gray-700 hover:text-gray-900 text-sm sm:text-base"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {showAllProjects ? (
                <>
                  <span>View Less</span>
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 ml-2 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                </>
              ) : (
                <>
                  <span className="hidden sm:inline">View All Projects ({projects.length})</span>
                  <span className="sm:hidden">View All ({projects.length})</span>
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 ml-2 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </>
              )}
            </motion.button>
          </div>


        </div>
      </section>

      {/* Image Modal */}
      <ImageModal
        project={selectedProject}
        imageIndex={selectedImageIndex}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onNext={handleNextImage}
        onPrev={handlePrevImage}
        onImageSelect={handleImageIndicatorClick}
      />
    </>
  );
};

export default AnimatedProjects;