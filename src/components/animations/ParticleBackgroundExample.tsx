import React from 'react';
import ParticleBackground from './ParticleBackground';

/**
 * Example usage of the enhanced ParticleBackground component
 * demonstrating the advanced background effects implemented in task 7.2
 */
const ParticleBackgroundExample: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Hero Section with Advanced Background Effects */}
      <section className="relative h-screen flex items-center justify-center">
        <ParticleBackground
          sectionVariant="hero"
          enableGradientAnimation={true}
          enableMouseFollowing={true}
          enableMouseInteraction={true}
          enableParallax={true}
          colorTheme="gradient"
          particleCount={60}
          shapeCount={10}
          animationSpeed={1.2}
          enablePerformanceMode={false}
          className="hero-background"
          zIndex={-1}
        />
        <div className="relative z-10 text-center">
          <h1 className="text-6xl font-bold mb-4">Hero Section</h1>
          <p className="text-xl">Advanced gradient animations and mouse-following particles</p>
        </div>
      </section>

      {/* Skills Section with Section-Specific Effects */}
      <section className="relative h-screen flex items-center justify-center bg-gray-800">
        <ParticleBackground
          sectionVariant="skills"
          enableGradientAnimation={true}
          enableMouseFollowing={true}
          colorTheme="gradient"
          particleCount={40}
          shapeCount={6}
          animationSpeed={1.0}
          enablePerformanceMode={false}
          zIndex={-1}
        />
        <div className="relative z-10 text-center">
          <h2 className="text-4xl font-bold mb-4">Skills Section</h2>
          <p className="text-lg">Orange/red gradient theme with moderate particle intensity</p>
        </div>
      </section>

      {/* Projects Section with Performance Mode */}
      <section className="relative h-screen flex items-center justify-center bg-gray-700">
        <ParticleBackground
          sectionVariant="projects"
          enableGradientAnimation={true}
          enableMouseFollowing={true}
          colorTheme="blue"
          particleCount={30}
          shapeCount={5}
          animationSpeed={0.9}
          enablePerformanceMode={true}
          zIndex={-1}
        />
        <div className="relative z-10 text-center">
          <h2 className="text-4xl font-bold mb-4">Projects Section</h2>
          <p className="text-lg">Cyan/blue theme with performance optimizations enabled</p>
        </div>
      </section>

      {/* Contact Section with Subtle Effects */}
      <section className="relative h-screen flex items-center justify-center bg-gray-600">
        <ParticleBackground
          sectionVariant="contact"
          enableGradientAnimation={true}
          enableMouseFollowing={false}
          colorTheme="purple"
          particleCount={20}
          shapeCount={4}
          animationSpeed={0.7}
          enablePerformanceMode={true}
          zIndex={-1}
        />
        <div className="relative z-10 text-center">
          <h2 className="text-4xl font-bold mb-4">Contact Section</h2>
          <p className="text-lg">Purple theme with reduced intensity and no mouse following</p>
        </div>
      </section>
    </div>
  );
};

export default ParticleBackgroundExample;