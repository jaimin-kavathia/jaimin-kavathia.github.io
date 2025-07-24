import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Mail, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import { personalInfo } from '../data/personalInfo';
import { useEmailForm } from '../hooks/useEmailForm';

interface ContactFormProps {
  isOpen: boolean;
  onClose: () => void;
}

const ContactForm: React.FC<ContactFormProps> = ({ isOpen, onClose }) => {
  console.log('🔥 ContactForm rendered - isOpen:', isOpen);
  
  const {
    formData,
    errors,
    isLoading,
    isSuccess,
    errorMessage,
    updateField,
    submitForm,
    resetForm,
    clearMessages
  } = useEmailForm();
  
  console.log('🔥 useEmailForm hook data:', { formData, errors, isLoading, isSuccess, errorMessage });
  
  const nameInputRef = useRef<HTMLInputElement>(null);

  // Focus name input when modal opens
  useEffect(() => {
    if (isOpen && nameInputRef.current) {
      setTimeout(() => nameInputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    console.log('🔥 FORM SUBMIT TRIGGERED!');
    e.preventDefault();
    console.log('�  PREVENT DEFAULT CALLED!');
    
    const submitTimestamp = new Date().toISOString();
    console.log(`📧 [${submitTimestamp}] ContactForm.handleSubmit - Form submitted by user`);
    console.log('🎯 Form submission triggered from ContactForm component');
    console.log('📋 Current form state before submission:');
    console.log('- Form data:', formData);
    console.log('- Current errors:', errors);
    console.log('- Loading state:', isLoading);
    console.log('- Success state:', isSuccess);
    
    console.log('🔥 ABOUT TO CALL submitForm()');
    await submitForm();
    console.log('🔥 submitForm() COMPLETED');
    
    console.log(`✅ [${new Date().toISOString()}] ContactForm.handleSubmit completed`);
  };

  const handleClose = () => {
    const closeTimestamp = new Date().toISOString();
    console.log(`🚪 [${closeTimestamp}] ContactForm.handleClose - Modal closing`);
    console.log('🧹 Resetting form state and closing modal');
    resetForm();
    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleBackdropClick}
      >
        <motion.div
          className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", duration: 0.3 }}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Mail className="w-5 h-5" />
                <h2 className="text-lg font-semibold">Get In Touch</h2>
              </div>
              <button
                onClick={handleClose}
                className="p-1 hover:bg-white/20 rounded-full transition-colors"
                aria-label="Close contact form"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Success Message */}
            <AnimatePresence>
              {isSuccess && (
                <motion.div
                  className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-2 text-green-800"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <CheckCircle className="w-5 h-5 flex-shrink-0" />
                  <p className="text-sm">Message sent successfully! I'll get back to you soon.</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Error Message */}
            <AnimatePresence>
              {errorMessage && (
                <motion.div
                  className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <div className="flex items-start space-x-2 text-red-800">
                    <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm">{errorMessage}</p>
                      <p className="text-xs mt-1">
                        You can also email me directly at{' '}
                        <a
                          href={`mailto:${personalInfo.email}`}
                          className="underline hover:no-underline"
                        >
                          {personalInfo.email}
                        </a>
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>



            {/* Form */}
            <form 
              onSubmit={handleSubmit} 
              className="space-y-4"
              onInvalid={(e) => console.log('🔥 FORM INVALID:', e)}
              onReset={(e) => console.log('🔥 FORM RESET:', e)}
            >
              {/* Name Field */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Your Name *
                </label>
                <input
                  ref={nameInputRef}
                  type="text"
                  id="name"
                  value={formData.from_name}
                  onChange={(e) => updateField('from_name', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                    errors.name ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="Enter your full name"
                  disabled={isLoading}
                />
                {errors.name && (
                  <p className="mt-1 text-xs text-red-600">{errors.name}</p>
                )}
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Your Email *
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.from_email}
                  onChange={(e) => updateField('from_email', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                    errors.email ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="your.email@example.com"
                  disabled={isLoading}
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-red-600">{errors.email}</p>
                )}
              </div>

              {/* Subject Field */}
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                  Subject *
                </label>
                <input
                  type="text"
                  id="subject"
                  value={formData.subject}
                  onChange={(e) => updateField('subject', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                    errors.subject ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="What's this about?"
                  disabled={isLoading}
                />
                {errors.subject && (
                  <p className="mt-1 text-xs text-red-600">{errors.subject}</p>
                )}
              </div>

              {/* Message Field */}
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Message *
                </label>
                <textarea
                  id="message"
                  rows={4}
                  value={formData.message}
                  onChange={(e) => updateField('message', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors resize-none ${
                    errors.message ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="Tell me about your project or question..."
                  disabled={isLoading}
                />
                {errors.message && (
                  <p className="mt-1 text-xs text-red-600">{errors.message}</p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  {formData.message.length}/1000 characters
                </p>
              </div>

              {/* Submit Button */}
              <div className="flex space-x-3 pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2"
                >
                  {isLoading ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Send Message</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    console.log('🔥 DIRECT TEST BUTTON CLICKED!');
                    try {
                      // Call the email service directly with test data
                      console.log('📧 Calling email service directly...');
                      const { emailService } = await import('../services/emailService');
                      
                      // Use the test method
                      console.log('📧 Running emailService.testEmailService()...');
                      const result = await emailService.testEmailService();
                      console.log('📧 Direct test result:', result);
                      
                      if (result.success) {
                        alert('✅ Direct test email sent successfully!');
                      } else {
                        alert(`❌ Direct test failed: ${result.message}`);
                      }
                    } catch (error) {
                      console.error('❌ Direct test error:', error);
                      alert(`❌ Direct test error: ${error}`);
                    }
                  }}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
                >
                  Direct Test
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      const { emailService } = await import('../services/emailService');
                      const config = emailService.getConfig();
                      const isAvailable = emailService.isServiceAvailable();
                      
                      console.log('📧 EmailJS Configuration:', config);
                      console.log('📧 Service Available:', isAvailable);
                      
                      alert(`EmailJS Configuration:\n- Service ID: ${config.serviceId}\n- Template ID: ${config.templateId}\n- Public Key: ${config.publicKey}\n- Service Available: ${isAvailable ? 'Yes' : 'No'}`);
                    } catch (error) {
                      console.error('Error checking config:', error);
                      alert(`Error checking config: ${error}`);
                    }
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                >
                  Check Config
                </button>
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                >
                  Cancel
                </button>
              </div>


            </form>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ContactForm;