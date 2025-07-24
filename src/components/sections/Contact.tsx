import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';
import ContactForm from '../ui/ContactForm';
import { personalInfo } from '../../data/personalInfo';

interface ContactProps {
  isVisible: boolean;
}

const Contact: React.FC<ContactProps> = ({ isVisible }) => {
  const handleFormSubmit = (formData: { name: string; email: string; message: string }) => {
    console.log('Form submitted:', formData);
    // Here you would typically send the data to your backend or email service
  };

  return (
    <section 
      id="contact" 
      className="py-20 relative"
      role="main"
      aria-labelledby="contact-heading"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`transform transition-all duration-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
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
          
          <div className="grid md:grid-cols-2 gap-12">
            <div 
              className="space-y-8"
              role="region"
              aria-label="Contact information"
            >
              <div 
                className="backdrop-blur-md bg-white/90 border border-gray-200 rounded-xl p-6 hover:bg-white/95 transition-all duration-300 focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 shadow-lg"
                tabIndex={0}
                role="article"
                aria-label="Email contact information"
              >
                <div className="flex items-center gap-4">
                  <div className="bg-gradient-to-br from-blue-100 to-cyan-100 border border-gray-200 p-3 rounded-full backdrop-blur-sm">
                    <Mail size={24} className="text-blue-600" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Email</h3>
                    <p className="text-gray-700">
                      <a 
                        href={`mailto:${personalInfo.email}`}
                        className="hover:text-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
                        aria-label={`Send email to ${personalInfo.email}`}
                      >
                        {personalInfo.email}
                      </a>
                    </p>
                  </div>
                </div>
              </div>
              
              <div 
                className="backdrop-blur-md bg-white/90 border border-gray-200 rounded-xl p-6 hover:bg-white/95 transition-all duration-300 focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 shadow-lg"
                tabIndex={0}
                role="article"
                aria-label="Phone contact information"
              >
                <div className="flex items-center gap-4">
                  <div className="bg-gradient-to-br from-purple-100 to-pink-100 border border-gray-200 p-3 rounded-full backdrop-blur-sm">
                    <Phone size={24} className="text-purple-600" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Phone</h3>
                    <p className="text-gray-700">
                      <a 
                        href={`tel:${personalInfo.phone}`}
                        className="hover:text-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
                        aria-label={`Call ${personalInfo.phone}`}
                      >
                        {personalInfo.phone}
                      </a>
                    </p>
                  </div>
                </div>
              </div>
              
              <div 
                className="backdrop-blur-md bg-white/90 border border-gray-200 rounded-xl p-6 hover:bg-white/95 transition-all duration-300 focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 shadow-lg"
                tabIndex={0}
                role="article"
                aria-label="Location information"
              >
                <div className="flex items-center gap-4">
                  <div className="bg-gradient-to-br from-green-100 to-emerald-100 border border-gray-200 p-3 rounded-full backdrop-blur-sm">
                    <MapPin size={24} className="text-green-600" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Location</h3>
                    <p className="text-gray-700">{personalInfo.location}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <ContactForm onSubmit={handleFormSubmit} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;