# EmailJS Integration Setup

## Overview
This portfolio uses EmailJS to handle contact form submissions directly from the frontend without requiring a backend server.

## Configuration
The following environment variables are required in your `.env` file:

```env
VITE_EMAILJS_SERVICE_ID=service_1hjdvlp
VITE_EMAILJS_TEMPLATE_ID=template_88l1ctz
VITE_EMAILJS_PUBLIC_KEY=a9SLPbOVTS7_G6GpX
VITE_EMAILJS_PRIVATE_KEY=HpCbhi90qifuzSt1IYqWs
```

## Features
- ✅ Contact form modal with validation
- ✅ Real-time form validation
- ✅ Loading states and success/error messages
- ✅ Fallback to mailto link if service fails
- ✅ Accessibility support
- ✅ Mobile responsive design

## Usage
1. Click the email button in the footer
2. Fill out the contact form
3. Submit to send email directly to jaiminkavathia30@gmail.com

## Development
- EmailJS configuration is tested on app startup in development mode
- Check browser console for configuration status
- Use `sendTestEmail()` function for testing

## Security
- Environment variables are prefixed with `VITE_` for Vite compatibility
- Private key is used for additional security
- All credentials are stored in `.env` file (gitignored)

## Troubleshooting
If emails aren't sending:
1. Check browser console for errors
2. Verify all environment variables are set
3. Ensure EmailJS service and template IDs are correct
4. Check EmailJS dashboard for quota limits