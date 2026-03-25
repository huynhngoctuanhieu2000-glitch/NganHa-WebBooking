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
    staff: 'Staff',
    staffRandom: 'Random',
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
} as const;
