// ═══════════════════════════════════════
// BookingForm i18n Text Dictionary
// ═══════════════════════════════════════

export const t = {
  // Section badge
  badge: 'Reservation',

  // Main heading
  heading: 'Book Your',
  headingHighlight: 'Experience',

  // Step labels
  steps: {
    service: 'Select Service',
    details: 'Your Details',
    confirm: 'Confirm',
  },

  // Field labels
  fields: {
    name: 'Full Name',
    namePlaceholder: 'Enter your full name',
    email: 'Email Address',
    emailPlaceholder: 'example@email.com',
    phone: 'Phone Number',
    phonePlaceholder: '+84 90 123 4567',
    note: 'Additional Note',
    notePlaceholder: 'Any special requests or details we should know about?',
    date: 'Date',
    datePlaceholder: 'Select date',
    time: 'Time',
    timePlaceholder: 'Select time',
    branch: 'Branch',
    staff: 'Therapist Preference',
    staffAny: 'No Preference',
    staffMale: 'Male',
    staffFemale: 'Female',
    guests: 'Guests',
  },

  // Summary
  summary: {
    title: 'Booking Summary',
    service: 'Service',
    duration: 'Duration',
    durationUnit: 'min',
    date: 'Date',
    time: 'Time',
    branch: 'Branch',
    guests: 'Guests',
    staff: 'Staff',
    total: 'Total',
    noServiceSelected: 'No service selected',
  },

  // Buttons
  buttons: {
    next: 'Continue',
    back: 'Back',
    confirm: 'Confirm Booking',
    processing: 'Processing...',
  },

  // Terms
  terms: {
    agree: 'I agree to the',
    link: 'Terms & Conditions',
  },

  // Validation
  validation: {
    selectService: 'Please select a service to continue',
    fillRequired: 'Please fill in all required fields',
    agreeTerms: 'Please agree to the Terms & Conditions',
  },

  // Booking success screen
  success: {
    badge: 'Confirmed',
    title: 'Booking Successful!',
    subtitle: 'Thank you for choosing Ngan Ha Spa. We look forward to seeing you.',
    bookingCode: 'Booking Code',
    customerName: 'Name',
    phone: 'Phone',
    services: 'Services',
    dateTime: 'Date & Time',
    branch: 'Branch',
    total: 'Total',
    backHome: 'Back to Home',
    bookMore: 'Book Another',
    note: '\u2022 Please arrive 10 minutes early · Bring this booking code',
  },
} as const;
