import React, { useState } from 'react';
import { announceToScreenReader } from '../../utils/accessibility';

interface ContactFormProps {
  onSubmit?: (formData: { name: string; email: string; message: string }) => void;
}

const ContactForm: React.FC<ContactFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const [errors, setErrors] = useState({
    name: '',
    email: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {
      name: '',
      email: '',
      message: ''
    };

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      // Announce validation errors to screen readers
      const errorCount = Object.values(errors).filter(error => error !== '').length;
      announceToScreenReader(`Form has ${errorCount} validation error${errorCount > 1 ? 's' : ''}. Please check the fields and try again.`, 'assertive');
      return;
    }

    setIsSubmitting(true);
    announceToScreenReader('Submitting your message, please wait.');

    try {
      // Simulate form submission
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (onSubmit) {
        onSubmit(formData);
      }

      setIsSubmitted(true);
      setFormData({ name: '', email: '', message: '' });
      announceToScreenReader('Message sent successfully! Thank you for reaching out.');
    } catch (error) {
      console.error('Form submission error:', error);
      announceToScreenReader('There was an error sending your message. Please try again.', 'assertive');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div 
        className="backdrop-blur-md bg-white/90 border border-gray-200 rounded-2xl p-8 shadow-xl text-center"
        role="alert"
        aria-live="polite"
        aria-labelledby="success-heading"
      >
        <div className="text-green-600 text-6xl mb-4" aria-hidden="true">✓</div>
        <h3 id="success-heading" className="text-xl font-bold text-gray-900 mb-2">Message Sent!</h3>
        <p className="text-gray-700 mb-4">Thank you for reaching out. I'll get back to you soon!</p>
        <button
          onClick={() => setIsSubmitted(false)}
          className="backdrop-blur-md bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-4 rounded-lg font-semibold hover:shadow-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          aria-label="Send another message - Return to contact form"
        >
          Send Another Message
        </button>
      </div>
    );
  }

  return (
    <div className="backdrop-blur-md bg-white/90 border border-gray-200 rounded-2xl p-8 shadow-xl">
      <form 
        onSubmit={handleSubmit} 
        className="space-y-6"
        role="form"
        aria-labelledby="contact-form-heading"
        noValidate
      >
        <h3 id="contact-form-heading" className="sr-only">Contact Form</h3>
        
        <div>
          <label htmlFor="contact-name" className="sr-only">Your Name (required)</label>
          <input 
            id="contact-name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Your Name"
            required
            aria-required="true"
            aria-invalid={errors.name ? 'true' : 'false'}
            aria-describedby={errors.name ? 'name-error' : undefined}
            className={`w-full px-4 py-3 rounded-lg backdrop-blur-sm bg-white/80 border text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 transition-all ${
              errors.name 
                ? 'border-red-400 focus:border-red-400 focus:ring-red-400/50' 
                : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500/50'
            }`}
          />
          {errors.name && (
            <p id="name-error" className="text-red-400 text-sm mt-1" role="alert" aria-live="polite">
              {errors.name}
            </p>
          )}
        </div>
        
        <div>
          <label htmlFor="contact-email" className="sr-only">Your Email Address (required)</label>
          <input 
            id="contact-email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Your Email"
            required
            aria-required="true"
            aria-invalid={errors.email ? 'true' : 'false'}
            aria-describedby={errors.email ? 'email-error' : undefined}
            className={`w-full px-4 py-3 rounded-lg backdrop-blur-sm bg-white/80 border text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 transition-all ${
              errors.email 
                ? 'border-red-400 focus:border-red-400 focus:ring-red-400/50' 
                : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500/50'
            }`}
          />
          {errors.email && (
            <p id="email-error" className="text-red-400 text-sm mt-1" role="alert" aria-live="polite">
              {errors.email}
            </p>
          )}
        </div>
        
        <div>
          <label htmlFor="contact-message" className="sr-only">Your Message (required)</label>
          <textarea 
            id="contact-message"
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            placeholder="Your Message"
            rows={5}
            required
            aria-required="true"
            aria-invalid={errors.message ? 'true' : 'false'}
            aria-describedby={errors.message ? 'message-error' : undefined}
            className={`w-full px-4 py-3 rounded-lg backdrop-blur-sm bg-white/80 border text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 transition-all resize-none ${
              errors.message 
                ? 'border-red-400 focus:border-red-400 focus:ring-red-400/50' 
                : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500/50'
            }`}
          />
          {errors.message && (
            <p id="message-error" className="text-red-400 text-sm mt-1" role="alert" aria-live="polite">
              {errors.message}
            </p>
          )}
        </div>
        
        <button 
          type="submit"
          disabled={isSubmitting}
          aria-describedby={isSubmitting ? 'submit-status' : undefined}
          className={`w-full backdrop-blur-md bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:shadow-2xl hover:shadow-blue-500/25 transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
            isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isSubmitting ? 'Sending...' : 'Send Message'}
        </button>
        {isSubmitting && (
          <p id="submit-status" className="sr-only" aria-live="polite">
            Form is being submitted, please wait.
          </p>
        )}
      </form>
    </div>
  );
};

export default ContactForm;