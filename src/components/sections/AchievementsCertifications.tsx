import React from 'react';
import { motion } from 'framer-motion';
import { Award, FileText, ExternalLink, Calendar, Building } from 'lucide-react';
import { achievements, certifications } from '../../data/achievements';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { animationDurations, staggerTimings } from '../../utils/easingFunctions';

interface AchievementsCertificationsProps {
    isVisible: boolean;
}

const AchievementsCertifications: React.FC<AchievementsCertificationsProps> = ({ isVisible }) => {
    const prefersReducedMotion = useReducedMotion();

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: prefersReducedMotion ? 0 : staggerTimings.normal,
                delayChildren: prefersReducedMotion ? 0 : 0.2
            }
        }
    };

    const itemVariants = {
        hidden: {
            opacity: 0,
            y: prefersReducedMotion ? 0 : 30
        },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: prefersReducedMotion ? 0.01 : animationDurations.normal
            }
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long'
        });
    };

    return (
        <section
            id="achievements"
            className="py-20 relative"
            role="main"
            aria-labelledby="achievements-heading"
        >
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial="hidden"
                    animate={isVisible ? "visible" : "hidden"}
                    variants={containerVariants}
                >
                    {/* Section Header */}
                    <motion.header
                        className="text-center mb-16"
                        variants={itemVariants}
                    >
                        <div className="backdrop-blur-md bg-white/80 border border-gray-200 rounded-2xl p-8 inline-block shadow-lg">
                            <h2
                                id="achievements-heading"
                                className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-gray-900 via-blue-600 to-purple-600 bg-clip-text text-transparent"
                            >
                                Achievements & Certifications
                            </h2>
                            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                                Recognition and professional development milestones
                            </p>
                        </div>
                    </motion.header>

                    <div className="grid lg:grid-cols-2 gap-12">
                        {/* Achievements Section */}
                        <motion.div variants={itemVariants}>
                            <div className="backdrop-blur-md bg-white/90 border border-gray-200 rounded-2xl p-8 shadow-xl h-full">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="bg-gradient-to-br from-yellow-100 to-orange-100 border border-yellow-200 p-3 rounded-full">
                                        <Award size={24} className="text-yellow-600" aria-hidden="true" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900">Achievements</h3>
                                </div>

                                <div className="space-y-4">
                                    {achievements.map((achievement, index) => (
                                        <motion.div
                                            key={achievement.id}
                                            className="border border-gray-200 rounded-xl p-4 hover:bg-gray-50 transition-all duration-300"
                                            variants={itemVariants}
                                            transition={{ delay: index * 0.1 }}
                                        >
                                            <div className="flex items-start gap-3">
                                                <div className="bg-yellow-100 p-2 rounded-lg mt-1">
                                                    <Award size={16} className="text-yellow-600" />
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="font-semibold text-gray-900 mb-1">
                                                        {achievement.title}
                                                    </h4>
                                                    {achievement.description && (
                                                        <p className="text-gray-600 text-sm mb-2">
                                                            {achievement.description}
                                                        </p>
                                                    )}
                                                    <div className="flex items-center gap-4 text-xs text-gray-500">
                                                        <div className="flex items-center gap-1">
                                                            <Calendar size={12} />
                                                            <span>{formatDate(achievement.date)}</span>
                                                        </div>
                                                        {achievement.organization && (
                                                            <div className="flex items-center gap-1">
                                                                <Building size={12} />
                                                                <span>{achievement.organization}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>

                        {/* Certifications Section */}
                        <motion.div variants={itemVariants}>
                            <div className="backdrop-blur-md bg-white/90 border border-gray-200 rounded-2xl p-8 shadow-xl h-full">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="bg-gradient-to-br from-blue-100 to-purple-100 border border-blue-200 p-3 rounded-full">
                                        <FileText size={24} className="text-blue-600" aria-hidden="true" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900">Certifications</h3>
                                </div>

                                <div className="space-y-6">
                                    {certifications.map((certification, index) => (
                                        <motion.div
                                            key={certification.id}
                                            className="border border-gray-200 rounded-xl p-6 hover:bg-gray-50 transition-all duration-300"
                                            variants={itemVariants}
                                            transition={{ delay: index * 0.1 }}
                                        >
                                            <div className="flex items-start gap-4">
                                                <div className="bg-blue-100 p-3 rounded-lg">
                                                    <FileText size={20} className="text-blue-600" />
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="font-semibold text-gray-900 mb-2">
                                                        {certification.title}
                                                    </h4>
                                                    <div className="flex items-center gap-2 mb-3">
                                                        <span className="text-blue-600 font-medium">{certification.issuer}</span>
                                                        <span className="text-gray-400">•</span>
                                                        <span className="text-gray-600 text-sm">{certification.date}</span>
                                                    </div>

                                                    {certification.description && (
                                                        <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                                                            {certification.description}
                                                        </p>
                                                    )}

                                                    {certification.skills && (
                                                        <div className="flex flex-wrap gap-2 mb-4">
                                                            {certification.skills.map((skill) => (
                                                                <span
                                                                    key={skill}
                                                                    className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                                                                >
                                                                    {skill}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    )}

                                                    {certification.credentialUrl && (
                                                        <a
                                                            href={certification.credentialUrl}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
                                                        >
                                                            <ExternalLink size={14} />
                                                            View Certificate
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default AchievementsCertifications;