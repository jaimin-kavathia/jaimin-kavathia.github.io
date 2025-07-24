import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePerformanceOptimization } from '../../hooks/usePerformanceOptimization';

interface PerformanceMonitorProps {
  enabled?: boolean;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  showDetails?: boolean;
}

/**
 * Development-only performance monitoring component
 * Shows FPS, memory usage, and performance warnings
 */
const PerformanceMonitor: React.FC<PerformanceMonitorProps> = ({
  enabled = process.env.NODE_ENV === 'development',
  position = 'top-right',
  showDetails = false
}) => {
  const { metrics, settings } = usePerformanceOptimization({
    enableMonitoring: enabled,
    adaptivePerformance: true
  });
  
  const [isExpanded, setIsExpanded] = useState(false);
  const [warnings, setWarnings] = useState<string[]>([]);

  // Track performance warnings
  useEffect(() => {
    const newWarnings: string[] = [];
    
    if (metrics.fps < 30) {
      newWarnings.push(`Low FPS: ${metrics.fps}`);
    }
    
    if (metrics.memoryUsage && metrics.memoryUsage > 0.8) {
      newWarnings.push(`High memory: ${(metrics.memoryUsage * 100).toFixed(1)}%`);
    }
    
    if (!settings.enableComplexAnimations) {
      newWarnings.push('Complex animations disabled');
    }
    
    if (!settings.enableParticles) {
      newWarnings.push('Particles disabled');
    }
    
    setWarnings(newWarnings);
  }, [metrics, settings]);

  if (!enabled) return null;

  const positionClasses = {
    'top-left': 'top-4 left-4',
    'top-right': 'top-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4'
  };

  const getPerformanceColor = () => {
    if (metrics.fps >= 50) return 'text-green-400 border-green-400';
    if (metrics.fps >= 30) return 'text-yellow-400 border-yellow-400';
    return 'text-red-400 border-red-400';
  };

  return (
    <motion.div
      className={`fixed ${positionClasses[position]} z-50 pointer-events-auto`}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className={`bg-black/90 backdrop-blur-sm rounded-lg border-l-4 ${getPerformanceColor()} p-3 font-mono text-sm cursor-pointer select-none`}
        onClick={() => setIsExpanded(!isExpanded)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {/* Compact view */}
        <div className="flex items-center gap-2">
          <div className="text-white">
            FPS: <span className={getPerformanceColor().split(' ')[0]}>{metrics.fps}</span>
          </div>
          {warnings.length > 0 && (
            <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
          )}
          <div className="text-white/60 text-xs">
            {isExpanded ? '▼' : '▶'}
          </div>
        </div>

        {/* Expanded view */}
        <AnimatePresence>
          {(isExpanded || showDetails) && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="mt-3 pt-3 border-t border-white/20 space-y-2 overflow-hidden"
            >
              {/* Performance metrics */}
              <div className="space-y-1">
                <div className="text-white/80 text-xs">Performance:</div>
                <div className="text-white/60 text-xs">
                  Device: {metrics.deviceCapabilities}
                </div>
                {metrics.memoryUsage && (
                  <div className="text-white/60 text-xs">
                    Memory: {(metrics.memoryUsage * 100).toFixed(1)}%
                  </div>
                )}
              </div>

              {/* Animation settings */}
              <div className="space-y-1">
                <div className="text-white/80 text-xs">Animations:</div>
                <div className="text-white/60 text-xs">
                  Complex: {settings.enableComplexAnimations ? '✓' : '✗'}
                </div>
                <div className="text-white/60 text-xs">
                  Particles: {settings.enableParticles ? `✓ (${settings.maxParticleCount})` : '✗'}
                </div>
                <div className="text-white/60 text-xs">
                  GPU: {settings.enableGPUAcceleration ? '✓' : '✗'}
                </div>
              </div>

              {/* Warnings */}
              {warnings.length > 0 && (
                <div className="space-y-1">
                  <div className="text-red-400 text-xs">Warnings:</div>
                  {warnings.map((warning, index) => (
                    <div key={index} className="text-red-300 text-xs">
                      • {warning}
                    </div>
                  ))}
                </div>
              )}

              {/* Performance tips */}
              {metrics.isLowPerformance && (
                <div className="space-y-1">
                  <div className="text-yellow-400 text-xs">Tips:</div>
                  <div className="text-yellow-300 text-xs">
                    • Close other browser tabs
                  </div>
                  <div className="text-yellow-300 text-xs">
                    • Enable hardware acceleration
                  </div>
                  <div className="text-yellow-300 text-xs">
                    • Reduce browser zoom level
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

export default PerformanceMonitor;

/**
 * Simple FPS counter component
 */
export const FPSCounter: React.FC<{ enabled?: boolean }> = ({ 
  enabled = process.env.NODE_ENV === 'development' 
}) => {
  const { metrics } = usePerformanceOptimization({ enableMonitoring: enabled });

  if (!enabled) return null;

  return (
    <div className="fixed top-4 left-4 bg-black/80 text-white px-2 py-1 rounded text-xs font-mono z-50">
      {metrics.fps} FPS
    </div>
  );
};

/**
 * Memory usage indicator
 */
export const MemoryIndicator: React.FC<{ enabled?: boolean }> = ({ 
  enabled = process.env.NODE_ENV === 'development' 
}) => {
  const { metrics } = usePerformanceOptimization({ enableMonitoring: enabled });

  if (!enabled || !metrics.memoryUsage) return null;

  const memoryPercent = metrics.memoryUsage * 100;
  const getColor = () => {
    if (memoryPercent < 50) return 'text-green-400';
    if (memoryPercent < 80) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="fixed top-4 left-20 bg-black/80 text-white px-2 py-1 rounded text-xs font-mono z-50">
      <span className={getColor()}>
        MEM: {memoryPercent.toFixed(1)}%
      </span>
    </div>
  );
};