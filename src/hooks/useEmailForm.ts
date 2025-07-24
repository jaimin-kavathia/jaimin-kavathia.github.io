import { useState, useCallback } from 'react';
import { emailService, EmailFormData } from '../services/emailService';
import { validateForm, FormErrors } from '../utils/validation';

interface UseEmailFormReturn {
  formData: EmailFormData;
  errors: FormErrors;
  isLoading: boolean;
  isSuccess: boolean;
  errorMessage: string;
  updateField: (field: keyof EmailFormData, value: string) => void;
  submitForm: () => Promise<void>;
  resetForm: () => void;
  clearMessages: () => void;
}

const initialFormData: EmailFormData = {
  from_name: '',
  from_email: '',
  subject: '',
  message: '',
};

export const useEmailForm = (): UseEmailFormReturn => {
  const [formData, setFormData] = useState<EmailFormData>(initialFormData);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const updateField = useCallback((field: keyof EmailFormData, value: string) => {
    console.log(`🔥 updateField called: ${field} = "${value}"`);
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear field error when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
    
    // Clear success/error messages when user modifies form
    if (isSuccess || errorMessage) {
      setIsSuccess(false);
      setErrorMessage('');
    }
  }, [errors, isSuccess, errorMessage]);

  const submitForm = useCallback(async () => {
    const submitTimestamp = new Date().toISOString();
    console.log(`🚀 [${submitTimestamp}] useEmailForm.submitForm called`);
    console.log('📝 Current form data:', formData);
    console.log('📊 Form data validation:');
    console.log('- Name length:', formData.from_name.length);
    console.log('- Email format:', /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.from_email) ? '✅ Valid' : '❌ Invalid');
    console.log('- Subject length:', formData.subject.length);
    console.log('- Message length:', formData.message.length);
    
    // Clear previous messages
    setIsSuccess(false);
    setErrorMessage('');
    
    // Validate form
    const validationStartTime = Date.now();
    const validation = validateForm(formData);
    const validationDuration = Date.now() - validationStartTime;
    
    console.log(`✅ [${new Date().toISOString()}] Validation completed in ${validationDuration}ms:`, validation);
    setErrors(validation.errors);
    
    if (!validation.isValid) {
      console.log('❌ Form validation failed - stopping submission');
      console.log('🔍 Validation errors:', validation.errors);
      return;
    }
    
    console.log('✅ Form validation passed - proceeding with email send');

    // Check if email service is available
    const serviceAvailable = emailService.isServiceAvailable();
    console.log('🔧 Email service availability check:', serviceAvailable);
    console.log('🔧 Email service config:', emailService.getConfig());
    
    if (!serviceAvailable) {
      const errorMsg = 'Email service is currently unavailable. Please try the mailto link below or contact directly.';
      console.error('❌ Email service not available:', errorMsg);
      setErrorMessage(errorMsg);
      return;
    }

    console.log('📤 Starting email send process...');
    setIsLoading(true);
    
    try {
      const emailStartTime = Date.now();
      console.log(`📧 [${new Date().toISOString()}] Calling emailService.sendEmail...`);
      
      const response = await emailService.sendEmail(formData);
      
      const emailDuration = Date.now() - emailStartTime;
      const responseTimestamp = new Date().toISOString();
      
      console.log(`📬 [${responseTimestamp}] Email service response received in ${emailDuration}ms:`, response);
      
      if (response.success) {
        console.log('✅ Email sent successfully - updating UI state');
        console.log('🧹 Clearing form data and errors');
        setIsSuccess(true);
        setFormData(initialFormData); // Clear form on success
        setErrors({});
        
        console.log('📊 Success metrics:');
        console.log('- Total submission time:', Date.now() - new Date(submitTimestamp).getTime(), 'ms');
        console.log('- Email send time:', emailDuration, 'ms');
        console.log('- Validation time:', validationDuration, 'ms');
      } else {
        console.error('❌ Email send failed:', response.message);
        console.error('🔍 Error details:', response.error);
        setErrorMessage(response.message);
      }
    } catch (error) {
      const errorTimestamp = new Date().toISOString();
      console.error(`💥 [${errorTimestamp}] Unexpected error during form submission:`, error);
      console.error('🔍 Error analysis:');
      console.error('- Error type:', typeof error);
      console.error('- Error name:', (error as any)?.name);
      console.error('- Error message:', (error as any)?.message);
      console.error('- Error stack:', (error as any)?.stack);
      
      const fallbackMsg = 'An unexpected error occurred. Please try again or contact directly.';
      console.error('🔄 Setting fallback error message:', fallbackMsg);
      setErrorMessage(fallbackMsg);
    } finally {
      const finalTimestamp = new Date().toISOString();
      const totalDuration = Date.now() - new Date(submitTimestamp).getTime();
      console.log(`🏁 [${finalTimestamp}] Form submission completed in ${totalDuration}ms`);
      setIsLoading(false);
    }
  }, [formData]);

  const resetForm = useCallback(() => {
    setFormData(initialFormData);
    setErrors({});
    setIsSuccess(false);
    setErrorMessage('');
    setIsLoading(false);
  }, []);

  const clearMessages = useCallback(() => {
    setIsSuccess(false);
    setErrorMessage('');
  }, []);

  return {
    formData,
    errors,
    isLoading,
    isSuccess,
    errorMessage,
    updateField,
    submitForm,
    resetForm,
    clearMessages,
  };
};