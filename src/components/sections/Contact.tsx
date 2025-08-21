import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageCircle, ArrowRight } from 'lucide-react';
import ContactForm from '../ContactForm';
import { personalInfo } from '../../data/personalInfo';
import { saveContactSubmission } from '../../services/contactService';

interface ContactProps {
  isVisible: boolean;
}

const Contact: React.FC<ContactProps> = ({ isVisible }) => {
  const [isContactFormOpen, setIsContactFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setSubmitStatus({
        type: 'error',
        message: 'Please fill in all required fields.'
      });
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: '' });

    try {
      const result = await saveContactSubmission({
        from_name: formData.name,
        from_email: formData.email,
        subject: 'Contact Form Submission',
        message: formData.message
      });

      if (result.success) {
        setSubmitStatus({
          type: 'success',
          message: result.message
        });
        setFormData({ name: '', email: '', message: '' });
      } else {
        setSubmitStatus({
          type: 'error',
          message: result.message
        });
      }
    } catch (error) {
      setSubmitStatus({
        type: 'error',
        message: 'An unexpected error occurred. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section 
      id="contact" 
      className="py-20 relative"
      role="main"
      aria-labelledby="contact-heading"
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-100/30 to-purple-100/30 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-cyan-100/30 to-blue-100/30 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className={`transform transition-all duration-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          {/* Header - Restored Original Design */}
          <header className="text-center mb-16">
            <div className="backdrop-blur-md bg-white/80 border border-gray-200 rounded-2xl p-8 inline-block shadow-lg">
              <h2 
                id="contact-heading"
                className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-gray-900 via-blue-600 to-purple-600 bg-clip-text text-transparent"
              >
                Get In Touch
              </h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Ready to bring your mobile app idea to life? Let's discuss your project!
              </p>
            </div>
          </header>
          
          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            {/* Left Side - Contact Information */}
            <div className="space-y-8">
              <div className="text-center lg:text-left mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Let's Connect</h3>
                <p className="text-gray-600 text-lg">
                  Choose your preferred way to reach out. I'm always excited to hear about new projects!
                </p>
              </div>

              {/* Contact Cards */}
              <div className="space-y-6">
                {/* Email Card */}
                <div className="group relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                  <div className="relative backdrop-blur-md bg-white/90 border border-gray-200/50 rounded-2xl p-6 hover:bg-white/95 hover:border-blue-300/50 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/20 transform hover:-translate-y-1">
                <div className="flex items-center gap-4">
                      <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-4 rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-500">
                        <Mail size={28} className="text-white" />
                  </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-900 text-lg mb-1">Email</h4>
                        <p className="text-gray-600 mb-2">Perfect for detailed project discussions</p>
                      <a 
                        href={`mailto:${personalInfo.email}`}
                          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors group-hover:gap-3"
                      >
                        {personalInfo.email}
                          <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                      </a>
                      </div>
                  </div>
                </div>
              </div>
              
                {/* Phone Card */}
                <div className="group relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                  <div className="relative backdrop-blur-md bg-white/90 border border-gray-200/50 rounded-2xl p-6 hover:bg-white/95 hover:border-purple-300/50 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/20 transform hover:-translate-y-1">
                <div className="flex items-center gap-4">
                      <div className="bg-gradient-to-br from-purple-500 to-pink-600 p-4 rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-500">
                        <Phone size={28} className="text-white" />
                  </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-900 text-lg mb-1">Phone</h4>
                        <p className="text-gray-600 mb-2">Great for quick calls and urgent matters</p>
                      <a 
                        href={`tel:${personalInfo.phone}`}
                          className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium transition-colors group-hover:gap-3"
                      >
                        {personalInfo.phone}
                          <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                      </a>
                      </div>
                  </div>
                </div>
              </div>
              
                {/* Location Card */}
                <div className="group relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                  <div className="relative backdrop-blur-md bg-white/90 border border-gray-200/50 rounded-2xl p-6 hover:bg-white/95 hover:border-green-300/50 transition-all duration-500 hover:shadow-2xl hover:shadow-green-500/20 transform hover:-translate-y-1">
                <div className="flex items-center gap-4">
                      <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-4 rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-500">
                        <MapPin size={28} className="text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-900 text-lg mb-1">Location</h4>
                        <p className="text-gray-600 mb-2">Available for local and remote projects</p>
                        <span className="text-green-600 font-medium">{personalInfo.location}</span>
                      </div>
                  </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right Side - Functional Contact Form */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-3xl blur-2xl"></div>
              <div className="relative backdrop-blur-md bg-white/95 border border-gray-200/50 rounded-3xl p-8 shadow-2xl">
                {/* Form Header */}
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-4 shadow-lg">
                    <MessageCircle size={32} className="text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Send a Message</h3>
                  <p className="text-gray-600">
                    Tell me about your project and I'll get back to you within 24 hours!
                  </p>
                </div>

                {/* Status Messages */}
                {submitStatus.type && (
                  <div className={`mb-6 p-4 rounded-xl text-center ${
                    submitStatus.type === 'success' 
                      ? 'bg-green-50 border border-green-200 text-green-700' 
                      : 'bg-red-50 border border-red-200 text-red-700'
                  }`}>
                    {submitStatus.message}
                  </div>
                )}

                {/* Functional Contact Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Your Name *
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 bg-white/80 backdrop-blur-sm"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="your.email@example.com"
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 bg-white/80 backdrop-blur-sm"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                      Project Details *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={3}
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Describe your project, timeline, and any specific requirements..."
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 bg-white/80 backdrop-blur-sm resize-none"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="group w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white py-3 px-6 rounded-xl font-semibold text-base shadow-lg hover:shadow-xl hover:shadow-blue-500/25 transform hover:-translate-y-0.5 disabled:transform-none transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed"
                  >
                    <span className="flex items-center justify-center gap-2">
                      {isSubmitting ? 'Sending...' : 'Send Message'}
                      {!isSubmitting && <Send size={18} className="group-hover:translate-x-1 transition-transform" />}
                    </span>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Form Modal - Still available for advanced features */}
      <ContactForm 
        isOpen={isContactFormOpen} 
        onClose={() => setIsContactFormOpen(false)} 
      />
    </section>
  );
};

export default Contact;