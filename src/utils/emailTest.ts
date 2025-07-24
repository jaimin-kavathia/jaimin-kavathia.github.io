// Simple test utility to verify EmailJS configuration
import { emailService } from '../services/emailService';

export const testEmailJSConfiguration = () => {
  console.log('EmailJS Configuration Test:');
  console.log('Service Available:', emailService.isServiceAvailable());
  console.log('Configuration:', emailService.getConfig());
  
  if (!emailService.isServiceAvailable()) {
    console.warn('EmailJS is not properly configured. Check environment variables:');
    console.warn('- VITE_EMAILJS_SERVICE_ID');
    console.warn('- VITE_EMAILJS_TEMPLATE_ID');
    console.warn('- VITE_EMAILJS_PUBLIC_KEY');
    console.warn('- VITE_EMAILJS_PRIVATE_KEY');
  } else {
    console.log('✅ EmailJS is properly configured and ready to use!');
  }
};

// Test function for development
export const sendTestEmail = async () => {
  console.log('🔥 sendTestEmail called');
  
  if (!emailService.isServiceAvailable()) {
    console.error('EmailJS service is not available');
    return;
  }

  const testData = {
    from_name: 'Test User',
    from_email: 'test@example.com',
    subject: 'Test Email from Portfolio',
    message: 'This is a test email to verify EmailJS integration is working correctly.',
  };

  try {
    const result = await emailService.sendEmail(testData);
    console.log('Test email result:', result);
    return result;
  } catch (error) {
    console.error('Test email failed:', error);
    return { success: false, message: 'Test failed', error };
  }
};

// Add this to window for easy testing
if (typeof window !== 'undefined') {
  (window as any).sendTestEmail = sendTestEmail;
  (window as any).emailService = emailService;
}