import emailjs from '@emailjs/browser';

interface EmailJSConfig {
  serviceId: string;
  templateId: string;
  publicKey: string;
  privateKey: string;
}

interface EmailFormData {
  from_name: string;
  from_email: string;
  subject: string;
  message: string;
}

interface EmailResponse {
  success: boolean;
  message: string;
  error?: string;
}

class EmailService {
  private config: EmailJSConfig;
  private isInitialized: boolean = false;

  constructor() {
    this.config = {
      serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID || '',
      templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID || '',
      publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY || '',
      privateKey: import.meta.env.VITE_EMAILJS_PRIVATE_KEY || '',
    };
    
    this.validateConfig();
    this.initializeService();
  }

  private validateConfig(): void {
    const missingVars: string[] = [];
    
    if (!this.config.serviceId) missingVars.push('VITE_EMAILJS_SERVICE_ID');
    if (!this.config.templateId) missingVars.push('VITE_EMAILJS_TEMPLATE_ID');
    if (!this.config.publicKey) missingVars.push('VITE_EMAILJS_PUBLIC_KEY');
    if (!this.config.privateKey) missingVars.push('VITE_EMAILJS_PRIVATE_KEY');

    if (missingVars.length > 0) {
      console.warn('Missing EmailJS environment variables:', missingVars);
      console.warn('Email functionality may not work properly');
    }
  }

  private initializeService(): void {
    try {
      if (this.config.publicKey) {
        console.log('🔧 Initializing EmailJS with public key:', this.config.publicKey);
        
        // Initialize EmailJS with the public key
        emailjs.init(this.config.publicKey);
        
        // Verify initialization
        this.isInitialized = true;
        console.log('✅ EmailJS service initialized successfully');
        
        // Log initialization status to help with debugging
        console.log('📧 EmailJS Initialization Status:');
        console.log('- Public Key:', this.config.publicKey);
        console.log('- Service ID:', this.config.serviceId);
        console.log('- Template ID:', this.config.templateId);
        console.log('- Initialized:', this.isInitialized);
      } else {
        console.error('❌ Cannot initialize EmailJS: Public key is missing');
      }
    } catch (error) {
      console.error('❌ Failed to initialize EmailJS:', error);
      console.error('Error details:', error);
      this.isInitialized = false;
    }
  }

  async sendEmail(formData: EmailFormData): Promise<EmailResponse> {
    const timestamp = new Date().toISOString();
    console.log(`🚀 [${timestamp}] Starting email send process...`);
    console.log('📧 EmailJS Configuration Check:');
    console.log('- Service ID:', this.config.serviceId ? '✅ Set' : '❌ Missing');
    console.log('- Template ID:', this.config.templateId ? '✅ Set' : '❌ Missing');
    console.log('- Public Key:', this.config.publicKey ? '✅ Set' : '❌ Missing');
    console.log('- Private Key:', this.config.privateKey ? '✅ Set' : '❌ Missing');
    console.log('- Initialized:', this.isInitialized ? '✅ Yes' : '❌ No');

    if (!this.isInitialized) {
      const errorLog = `❌ [${timestamp}] Email service is not initialized`;
      console.error(errorLog);
      console.error('🔍 Initialization failed - check environment variables and service setup');
      return {
        success: false,
        message: 'Email service is not properly configured',
        error: 'SERVICE_NOT_INITIALIZED'
      };
    }

    try {
      console.log(`📝 [${timestamp}] Form data received:`);
      console.log('- Name:', formData.from_name);
      console.log('- Email:', formData.from_email);
      console.log('- Subject:', formData.subject);
      console.log('- Message length:', formData.message.length);
      
      const emailData = {
        from_name: formData.from_name,
        from_email: formData.from_email,
        subject: formData.subject,
        message: formData.message,
        to_email: 'jaiminkavathia30@gmail.com',
        to_name: 'Jaimin Kavathia',
      };

      console.log(`📤 [${timestamp}] Sending email with EmailJS...`);
      console.log('- Service ID:', this.config.serviceId);
      console.log('- Template ID:', this.config.templateId);
      console.log('- Email payload:', JSON.stringify(emailData, null, 2));
      
      const requestStartTime = Date.now();
      console.log(`⏱️ [${timestamp}] Request started at:`, new Date(requestStartTime).toISOString());
      
      const response = await emailjs.send(
        this.config.serviceId,
        this.config.templateId,
        emailData
      );

      const requestEndTime = Date.now();
      const requestDuration = requestEndTime - requestStartTime;
      const responseTimestamp = new Date().toISOString();
      
      console.log(`✅ [${responseTimestamp}] EMAIL SENT SUCCESSFULLY!`);
      console.log(`⏱️ Request completed in: ${requestDuration}ms`);
      console.log('📬 EmailJS Response Details:');
      console.log('- Status Code:', response.status);
      console.log('- Status Text:', response.text);
      console.log('- Full Response:', JSON.stringify(response, null, 2));
      console.log('📊 Success Metrics:');
      console.log('- Request Duration:', `${requestDuration}ms`);
      console.log('- Response Size:', JSON.stringify(response).length, 'bytes');
      console.log('- Timestamp:', responseTimestamp);
      
      // Show success alert with details
      alert(`✅ EMAIL SENT SUCCESSFULLY!\n\nDetails:\n- Duration: ${requestDuration}ms\n- Status: ${response.status}\n- Time: ${responseTimestamp}\n\nCheck console for full details.`);
      
      return {
        success: true,
        message: 'Email sent successfully! Thank you for your message.'
      };
    } catch (error: any) {
      const errorTimestamp = new Date().toISOString();
      const requestEndTime = Date.now();
      const requestDuration = requestEndTime - (Date.now() - 1000); // Approximate duration
      
      console.error(`❌ [${errorTimestamp}] EMAIL SEND FAILED!`);
      console.error(`⏱️ Request failed after: ${requestDuration}ms`);
      console.error('🔍 Error Analysis:');
      console.error('- Error Type:', typeof error);
      console.error('- Error Name:', error.name);
      console.error('- Error Message:', error.message);
      console.error('- Error Status:', error.status);
      console.error('- Error Text:', error.text);
      console.error('- Error Stack:', error.stack);
      console.error('- Full Error Object:', JSON.stringify(error, Object.getOwnPropertyNames(error), 2));
      
      // Network and connectivity checks
      console.error('🌐 Network Status:');
      console.error('- Online:', navigator.onLine);
      console.error('- Connection Type:', (navigator as any).connection?.effectiveType || 'unknown');
      console.error('- User Agent:', navigator.userAgent);
      
      // Request details for debugging
      console.error('📤 Failed Request Details:');
      console.error('- Service ID:', this.config.serviceId);
      console.error('- Template ID:', this.config.templateId);
      console.error('- Public Key (first 10 chars):', this.config.publicKey?.substring(0, 10) + '...');
      console.error('- Timestamp:', errorTimestamp);
      
      let errorMessage = 'Failed to send email. Please try again.';
      let debugInfo = '';
      
      if (error.status === 400) {
        errorMessage = 'Invalid email data. Please check your information.';
        debugInfo = 'Error 400: Check template variables and service configuration';
        console.error('🔍 Error 400 Analysis: Check template variables and service configuration');
        console.error('- Verify template ID exists in EmailJS dashboard');
        console.error('- Check template variable names match payload');
        console.error('- Ensure all required template fields are provided');
      } else if (error.status === 401) {
        errorMessage = 'Email service authentication failed.';
        debugInfo = 'Error 401: Check public/private keys';
        console.error('🔍 Error 401 Analysis: Authentication failed');
        console.error('- Verify public key is correct');
        console.error('- Check if service is properly configured in EmailJS dashboard');
        console.error('- Ensure account is active and not suspended');
      } else if (error.status === 404) {
        errorMessage = 'Email service or template not found.';
        debugInfo = 'Error 404: Check service ID and template ID';
        console.error('🔍 Error 404 Analysis: Resource not found');
        console.error('- Verify service ID exists in EmailJS dashboard');
        console.error('- Check template ID is correct and published');
        console.error('- Ensure service is connected to email provider');
      } else if (error.status === 429) {
        errorMessage = 'Too many requests. Please wait a moment and try again.';
        debugInfo = 'Error 429: Rate limit exceeded';
        console.error('🔍 Error 429 Analysis: Rate limit exceeded');
        console.error('- Check EmailJS dashboard for quota limits');
        console.error('- Wait before retrying');
        console.error('- Consider upgrading plan if needed');
      } else if (!navigator.onLine) {
        errorMessage = 'No internet connection. Please check your connection and try again.';
        debugInfo = 'Network: No internet connection';
        console.error('🔍 Network Error: No internet connection');
        console.error('- Check network connectivity');
        console.error('- Try refreshing the page');
        console.error('- Check firewall/proxy settings');
      } else if (error.name === 'TypeError' && error.message.includes('fetch')) {
        errorMessage = 'Network error. Please check your connection and try again.';
        debugInfo = 'Network: Fetch error';
        console.error('🔍 Network Error: Fetch failed');
        console.error('- Possible CORS issue');
        console.error('- Network connectivity problem');
        console.error('- Server unreachable');
      } else {
        debugInfo = `Unknown error: ${error.message || 'No details available'}`;
        console.error('🔍 Unknown Error Analysis:');
        console.error('- This is an unexpected error type');
        console.error('- Check EmailJS service status');
        console.error('- Verify all configuration is correct');
      }
      
      // Show detailed error alert
      alert(`❌ EMAIL SEND FAILED!\n\nError: ${error.text || error.message}\nStatus: ${error.status || 'Unknown'}\nDebug: ${debugInfo}\nTime: ${errorTimestamp}\n\nCheck console for detailed analysis.`);
      
      return {
        success: false,
        message: errorMessage,
        error: error.text || error.message || 'UNKNOWN_ERROR'
      };
    }
  }

  isServiceAvailable(): boolean {
    return this.isInitialized && 
           !!this.config.serviceId && 
           !!this.config.templateId && 
           !!this.config.publicKey;
  }

  getConfig(): Partial<EmailJSConfig> {
    return {
      serviceId: this.config.serviceId ? '[CONFIGURED]' : '[MISSING]',
      templateId: this.config.templateId ? '[CONFIGURED]' : '[MISSING]',
      publicKey: this.config.publicKey ? '[CONFIGURED]' : '[MISSING]',
      privateKey: this.config.privateKey ? '[CONFIGURED]' : '[MISSING]',
    };
  }

  // Direct test method for debugging
  async testEmailService(): Promise<EmailResponse> {
    console.log('🧪 Running direct EmailJS test...');
    
    const testData: EmailFormData = {
      from_name: 'Test User',
      from_email: 'test@example.com',
      subject: 'Test Email from Portfolio',
      message: 'This is a test email to verify EmailJS integration is working correctly.',
    };
    
    try {
      return await this.sendEmail(testData);
    } catch (error) {
      console.error('❌ Direct test failed:', error);
      return {
        success: false,
        message: 'Direct test failed',
        error: String(error)
      };
    }
  }
}

// Export singleton instance
export const emailService = new EmailService();

// Add to window for easy testing in browser console
if (typeof window !== 'undefined') {
  (window as any).emailService = emailService;
  (window as any).testEmailService = () => emailService.testEmailService();
}

export type { EmailFormData, EmailResponse };