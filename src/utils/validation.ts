export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

export const validateEmail = (email: string): ValidationResult => {
  if (!email.trim()) {
    return { isValid: false, error: 'Email is required' };
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, error: 'Please enter a valid email address' };
  }
  
  return { isValid: true };
};

export const validateName = (name: string): ValidationResult => {
  if (!name.trim()) {
    return { isValid: false, error: 'Name is required' };
  }
  
  if (name.trim().length < 2) {
    return { isValid: false, error: 'Name must be at least 2 characters long' };
  }
  
  return { isValid: true };
};

export const validateSubject = (subject: string): ValidationResult => {
  if (!subject.trim()) {
    return { isValid: false, error: 'Subject is required' };
  }
  
  if (subject.trim().length < 3) {
    return { isValid: false, error: 'Subject must be at least 3 characters long' };
  }
  
  return { isValid: true };
};

export const validateMessage = (message: string): ValidationResult => {
  if (!message.trim()) {
    return { isValid: false, error: 'Message is required' };
  }
  
  if (message.trim().length < 10) {
    return { isValid: false, error: 'Message must be at least 10 characters long' };
  }
  
  if (message.trim().length > 1000) {
    return { isValid: false, error: 'Message must be less than 1000 characters' };
  }
  
  return { isValid: true };
};

export const validateForm = (formData: {
  from_name: string;
  from_email: string;
  subject: string;
  message: string;
}): { isValid: boolean; errors: FormErrors } => {
  const errors: FormErrors = {};
  
  const nameValidation = validateName(formData.from_name);
  if (!nameValidation.isValid) {
    errors.name = nameValidation.error;
  }
  
  const emailValidation = validateEmail(formData.from_email);
  if (!emailValidation.isValid) {
    errors.email = emailValidation.error;
  }
  
  const subjectValidation = validateSubject(formData.subject);
  if (!subjectValidation.isValid) {
    errors.subject = subjectValidation.error;
  }
  
  const messageValidation = validateMessage(formData.message);
  if (!messageValidation.isValid) {
    errors.message = messageValidation.error;
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};