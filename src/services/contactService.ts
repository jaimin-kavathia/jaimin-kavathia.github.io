import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { getDb } from './firebase';

export interface ContactFormData {
  from_name: string;
  from_email: string;
  subject: string;
  message: string;
}

export interface ContactResponse {
  success: boolean;
  message: string;
  error?: string;
}

export const saveContactSubmission = async (data: ContactFormData): Promise<ContactResponse> => {
  try {
    const db = getDb();
    const payload = {
      ...data,
      createdAt: serverTimestamp(),
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
      referer: typeof document !== 'undefined' ? document.referrer : '',
      page: typeof location !== 'undefined' ? location.pathname : '/',
    };
    await addDoc(collection(db, 'contact_submissions'), payload);
    return { success: true, message: 'Message submitted successfully!' };
  } catch (error: any) {
    console.error('Failed to save contact submission:', error);
    return { success: false, message: 'Failed to submit. Please try again.', error: String(error?.message || error) };
  }
};


