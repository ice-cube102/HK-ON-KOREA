import emailjs from '@emailjs/browser';

// Service to send email using EmailJS. 
// Uses environment variables for configuration.
// Make sure to set VITE_EMAILJS_SERVICE_ID, VITE_EMAILJS_TEMPLATE_ID, and VITE_EMAILJS_PUBLIC_KEY in .env

export interface InquiryData {
  id: string;
  name: string;
  contact: string;
  email: string;
  content: string;
  type: string;
  date: string;
}

export const sendInquiryEmail = async (data: InquiryData) => {
  const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
  const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
  const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

  if (!serviceId || !templateId || !publicKey) {
    console.warn("EmailJS credentials are not set. Saving locally only.");
    // We mock success if API keys are missing so the local storage flow works for testing.
    return { status: 200, text: "Mocked Success" };
  }

  // Map the inquiry data to the template parameters in EmailJS
  const templateParams = {
    from_name: data.name,
    from_email: data.email,
    contact: data.contact,
    inquiry_type: data.type,
    message: data.content,
  };

  try {
    const response = await emailjs.send(serviceId, templateId, templateParams, publicKey);
    return response;
  } catch (error) {
    console.error("Failed to send email:", error);
    throw error;
  }
};

export const saveInquiryToLocal = (data: InquiryData) => {
  try {
    const existing = localStorage.getItem('hkon_inquiries');
    const inquiries: InquiryData[] = existing ? JSON.parse(existing) : [];
    inquiries.push(data);
    localStorage.setItem('hkon_inquiries', JSON.stringify(inquiries));
  } catch (err) {
    console.error("Failed to save to local storage", err);
  }
};

export const getLocalInquiries = (): InquiryData[] => {
  try {
    const existing = localStorage.getItem('hkon_inquiries');
    return existing ? JSON.parse(existing) : [];
  } catch (err) {
    console.error("Failed to load from local storage", err);
    return [];
  }
};
