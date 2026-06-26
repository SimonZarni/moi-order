/**
 * Master i18n strings file — English · Burmese · Thai.
 * Add every UI string here. Never hardcode user-visible text in components.
 *
 * Usage:
 *   const s = useStrings();
 *   <Text>{s.common.cancel}</Text>
 *   <Text>{s.status.pending_payment}</Text>
 */

import { useLocaleStore, type Locale } from '@/shared/store/localeStore';

// ─── Type ────────────────────────────────────────────────────────────────────

export interface AppStrings {
  // Common UI
  common: {
    loading:            string;
    error:              string;
    retry:              string;
    cancel:             string;
    confirm:            string;
    save:               string;
    back:               string;
    close:              string;
    submit:             string;
    continue:           string;
    search:             string;
    done:               string;
    couldNotLoad:       string;
    pullToRetry:        string;
    somethingWentWrong: string;
    payNow:             string;
    cancelOrder:        string;
    cancelling:         string;
    getStarted:         string;
    viewDownload:       string;
    saveToGallery:      string;
    selectAll:          string;
    deselectAll:        string;
    apply:              string;
    clear:              string;
    noResults:          string;
  };

  // Order / submission statuses
  status: {
    pending_payment:  string;
    processing:       string;
    completed:        string;
    payment_failed:   string;
    cancelled:        string;
    pending:          string;
  };

  // Auth screens
  auth: {
    tagline:          string;
    signIn:           string;
    signInSubtitle:   string;
    register:         string;
    registerSubtitle: string;
    email:            string;
    password:         string;
    phone:            string;
    fullName:         string;
    forgotPassword:   string;
    orSignInWith:     string;
    checkingEmail:    string;
    submitting:       string;
    sendOtp:          string;
    verifyOtp:        string;
    resendOtp:        string;
    resendIn:         string;
    otpSent:          string;
    goToLogin:          string;
    alreadyHaveAccount: string;
    noAccount:          string;
    createAccount:      string;
    tapHere:            string;
    haveAccountTap:     string;
    noAccountTap:       string;
  };

  // Search screen
  search: {
    placeholder:  string;
    all:          string;
    places:       string;
    tickets:      string;
    services:     string;
    searchAll:    string;
    searchAllSub: string;
    noResults:    string;
    noResultsSub: string;
  };

  // Home screen
  home: {
    hello:              string;
    welcome:            string;
    tagline1:           string;
    tagline2:           string;
    searchPlaceholder:  string;
    ourServices:        string;
    ninetyDayReport:    string;
    placesAndTickets:   string;
    attractions:        string;
    otherServices:      string;
    companyMore:        string;
    embassyServices:    string;
    embassyMore:        string;
    airportFastTrack:   string;
    airportSubtitle:    string;
    busTickets:         string;
    busSubtitle:        string;
    passport:           string;
    passportSubtitle:   string;
    foodOrder:          string;
    foodOrderSubtitle:  string;
  };

  // Orders / submissions
  orders: {
    title:              string;
    orderNum:           string;
    submitted:          string;
    ordered:            string;
    summary:            string;
    service:            string;
    status:             string;
    personalInfo:       string;
    documents:          string;
    awaitingConfirmation: string;
    viewDownloadResult: string;
    couldNotLoad:       string;
    pullToRetry:        string;
    // Orders list screen
    eyebrow:            string;
    subtitle:           string;
    signInToView:       string;
    signInTrack:        string;
    noServiceOrders:    string;
    noServiceSub:       string;
    noTicketOrders:     string;
    noTicketSub:        string;
    contactUs:          string;
    items:              string;
  };

  // Ticket orders
  tickets: {
    orderNum:           string;
    ordered:            string;
    visitDate:          string;
    items:              string;
    viewDownloadEticket: string;
    couldNotLoad:       string;
    selectDate:         string;
    whenVisiting:       string;
    available7Days:     string;
    chooseDay:          string;
    purchase:           string;
    total:              string;
  };

  // Tab bar
  tabs: {
    home:    string;
    map:     string;
    orders:  string;
    profile: string;
  };

  // Document shortcut cards (profile)
  shortcuts: {
    passportLabel:    string;
    passportSub:      string;
    ninetyLabel:      string;
    ninetySub:        string;
    myDocsLabel:      string;
    myDocsSub:        string;
  };

  // Moi Verified screen
  verified: {
    title:            string;
    subtitle:         string;
    youAreVerified:   string;
    whyVerify:        string;
    prioritySupport:  string;
    verifiedBadge:    string;
    fasterProcessing: string;
    requirements:     string;
    channels:         string;
    payments:         string;
  };

  // Become a Merchant screen
  merchant: {
    title:               string;
    subtitle:            string;
    introTitle:          string;
    introBody:           string;
    benefitReach:        string;
    benefitDashboard:    string;
    benefitPayouts:      string;
    applyButton:         string;
    draftTitle:          string;
    draftBody:           string;
    downloadApp:         string;
    cancelButton:        string;
    cancelConfirmTitle:  string;
    cancelConfirmBody:   string;
    cancelConfirmYes:    string;
    cancelConfirmNo:     string;
    underReviewTitle:    string;
    underReviewBody:     string;
    approvedTitle:       string;
    approvedBody:        string;
    openAppButton:       string;
    rejectedTitle:       string;
    rejectedBody:        string;
    reviewNotes:         string;
    applyAgainButton:    string;
  };

  // Profile
  profile: {
    personalInfo:       string;
    language:           string;
    activity:           string;
    security:           string;
    legal:              string;
    myOrders:           string;
    changePassword:     string;
    privacyPolicy:      string;
    termsConditions:    string;
    pdpa:               string;
    fullNamePlaceholder: string;
    dobPlaceholder:     string;
    currentPassword:    string;
    newPassword:        string;
    confirmNewPassword: string;
    updatePassword:     string;
    saveChanges:        string;
    customerSupport:    string;
    contactFacebook:    string;
    contactLine:        string;
    signOut:            string;
    deleteAccount:      string;
    linkedAccounts:     string;
    addEmail:           string;
    addEmailDesc:       string;
    becomeVerified:     string;
    becomeMerchant:     string;
    merchantApproved:   string;
    approvedBadge:      string;
    manageMenu:             string;
    merchantDashboardHint:  string;
    addThaiPhone:       string;
    alreadyConnected:   string;
    useGoogleLater:     string;
    useAppleLater:      string;
    useLineLater:       string;
    english:            string;
    burmese:            string;
    thai:               string;
  };

  // Document upload labels (form screens)
  docs: {
    passportBioPage:    string;
    visaPage:           string;
    oldSlip:            string;
    identityCardFront:  string;
    identityCardBack:   string;
    tm30:               string;
    upperBodyPhoto:     string;
    airplaneTicket:     string;
    passportSizePhoto:  string;
  };

  // Map / places
  map: {
    nearby:           string;
    all:              string;
    getDirections:    string;
    navigateOnMap:    string;
    filterByTags:     string;
    noTagsAvailable:  string;
    searchPlaceholder: string;
    couldNotLoad:     string;
  };

  // File upload errors
  upload: {
    photoLibraryRequired: string;
    fileTooLarge:         string;
    uploadFailed:         string;
  };

  // 90-day report form
  ninetyDay: {
    title:        string;
    fullName:     string;
    phone:        string;
    submit:       string;
    submitting:   string;
  };

  // Service form sections (shared across all service forms)
  form: {
    personalInfo:      string;
    requiredDocuments: string;
    fullName:          string;
    phoneNumber:       string;
  };

  // Service listing pages
  services: {
    availableServices:  string;
    selectType:         string;
    noServices:         string;
    unableToLoad:       string;
    // 90-Day Report page
    ninetyDayEyebrow:   string;
    ninetyDayTitle:     string;
    ninetyDaySubtitle:  string;
    ninetyDaySubmitted: string;
    // Company Services page
    companyEyebrow:     string;
    companyTitle:       string;
    companySubtitle:    string;
    // Other Services page
    otherEyebrow:       string;
    otherTitle:         string;
    otherSubtitle:      string;
    // Back labels
    backHome:           string;
    // Embassy Services page
    embassyEyebrow:     string;
    embassyTitle:       string;
    embassySubtitle:    string;
    // Passport & CI Services page
    passportCiEyebrow:  string;
    passportCiTitle:    string;
    passportCiSubtitle: string;
  };

  // Notifications screen
  notifs: {
    title:        string;
    markAllRead:  string;
    marking:      string;
    clearAll:     string;
    noNotifs:     string;
    loading:      string;
  };

  // Payment
  payment: {
    title:            string;
    amount:           string;
    status:           string;
    expires:          string;
    markAsPaid:       string;
    confirming:       string;
    promptpayQr:      string;
    expired:          string;
    regenerate:       string;
    generating:       string;
    contactUs:        string;
  };

  // Food ordering — restaurant detail + item detail
  restaurant: {
    listTitle:               string; // "Restaurants" — header title on the restaurant list screen
    couldNotLoad:            string; // "Could not load restaurant."
    closesAt:                string; // "Closes at {time}"
    reopensAt:               string; // "Reopens at {time}"
    statusOpen:              string;
    statusClosed:            string;
    statusPaused:            string;
    popularPicks:            string;
    promotions:              string;
    recommendations:         string;
    noItemsYet:              string;
    specialInstructions:     string;
    instructionsPlaceholder: string;
    addToCart:               string; // prefix — caller appends " · {price}"
    customizable:            string;
    unavailable:             string;
    required:                string;
    optional:                string;
    chooseOne:               string; // "Choose 1"
    chooseAtLeast:           string; // "Choose at least {n}"
    chooseUpTo:              string; // "Choose up to {n}"
    payViaLine:              string; // "Pay via LINE"
    chatWithRestaurant:      string; // "Chat with Restaurant"
    contactNoLabel:          string; // "Contact No"
    contactNoPlaceholder:    string; // "Your phone number"
    contactNoRequired:       string; // "Contact number is required"
  };
  chat: {
    notice:          string;
    noMessages:      string;
    cannotLoad:      string;
    locked:          string;
    willClose:       string;
    typePlaceholder: string;
    addPhoto:        string;
    replyTo:         string;
    cancelReply:     string;
    photo:           string;
    reply:           string;
    copyText:        string;
    deleteMessage:   string;
  };
}

// ─── English ─────────────────────────────────────────────────────────────────

const en: AppStrings = {
  common: {
    loading:            'Loading…',
    error:              'Error',
    retry:              'Retry',
    cancel:             'Cancel',
    confirm:            'Confirm',
    save:               'Save',
    back:               'Back',
    close:              'Close',
    submit:             'Submit',
    continue:           'Continue',
    search:             'Search',
    done:               'Done',
    couldNotLoad:       'Could not load',
    pullToRetry:        'Pull down to retry',
    somethingWentWrong: 'Something went wrong. Please try again.',
    payNow:             'Pay Now',
    cancelOrder:        'Cancel Order',
    cancelling:         'Cancelling…',
    getStarted:         'Get Started',
    viewDownload:       'View / Download',
    saveToGallery:      'Save to Gallery',
    selectAll:          'Select All',
    deselectAll:        'Deselect All',
    apply:              'Apply',
    clear:              'Clear',
    noResults:          'No results found',
  },
  status: {
    pending_payment:  'Pending Payment',
    processing:       'Processing',
    completed:        'Completed',
    payment_failed:   'Payment Failed',
    cancelled:        'Cancelled',
    pending:          'Pending',
  },
  auth: {
    tagline:            'Fast · Reliable · Trusted',
    signIn:             'Sign In',
    signInSubtitle:     'Welcome back — let\'s get you in.',
    register:           'Create Your Account',
    registerSubtitle:   'Join thousands who trust MOI Order.',
    email:              'Email',
    password:           'Password',
    phone:              'Phone number',
    fullName:           'Full Name',
    forgotPassword:     'Forgot password?',
    orSignInWith:       'Or sign in with',
    checkingEmail:      'Checking…',
    submitting:         'Submitting…',
    sendOtp:            'Send OTP',
    verifyOtp:          'Verify',
    resendOtp:          'Resend OTP',
    resendIn:           'Resend in',
    otpSent:            'OTP sent',
    goToLogin:          'Already have an account? Sign In',
    alreadyHaveAccount: 'Already have an account?',
    noAccount:          'Don\'t have an account?',
    createAccount:      'Create Account',
    tapHere:            'Click here',
    haveAccountTap:     'Already have an account? Click here',
    noAccountTap:       'Don\'t have an account? Click here',
  },
  search: {
    placeholder:  'Search places, tickets, services…',
    all:          'All',
    places:       '📍 Places',
    tickets:      '🎟 Tickets',
    services:     '⚙️ Services',
    searchAll:    'Search everything',
    searchAllSub: 'Find places, tickets, and services',
    noResults:    'No results',
    noResultsSub: 'Try a different search term',
  },
  home: {
    hello:              'Hello, {name}',
    welcome:            'Welcome',
    tagline1:           'Your all-in-one',
    tagline2:           'app',
    searchPlaceholder:  'Search places, tickets, services…',
    ourServices:        'Our Services',
    ninetyDayReport:    '90-Day Report',
    placesAndTickets:   'Places & Tickets',
    attractions:        'Attractions & Landmarks',
    otherServices:      'Other Services',
    companyMore:        'Company & more',
    embassyServices:    'Embassy Support Letters',
    embassyMore:        'Support letters & more',
    airportFastTrack:   'Airport Fast Track',
    airportSubtitle:    'Priority airport service',
    busTickets:         'Bus Tickets',
    busSubtitle:        'Routes & schedules',
    passport:           'Passport / CI',
    passportSubtitle:   'Document services',
    foodOrder:          'Food Order',
    foodOrderSubtitle:  'Food delivery',
  },
  orders: {
    title:              'My Orders',
    orderNum:           'Order #{id}',
    submitted:          'Submitted',
    ordered:            'Ordered',
    summary:            'Summary',
    service:            'Service',
    status:             'Status',
    personalInfo:       'Personal Info',
    documents:          'Documents',
    awaitingConfirmation: '🔔 We have notified our admins about your order. Please prepare for payment once it is confirmed.',
    viewDownloadResult: 'View / Download Result',
    couldNotLoad:       'Could not load order',
    pullToRetry:        'Pull down to retry',
    eyebrow:            'My Activity',
    subtitle:           'Your service submissions & tickets',
    signInToView:       'Sign in to view orders',
    signInTrack:        'Track your service submissions and ticket bookings in one place.',
    noServiceOrders:    'No service orders yet',
    noServiceSub:       'Your service submissions will appear here once you place an order.',
    noTicketOrders:     'No ticket orders yet',
    noTicketSub:        'Your ticket bookings will appear here.',
    contactUs:          'Contact Us',
    items:              'Items',
  },
  tickets: {
    orderNum:           'Ticket Order #{id}',
    ordered:            'Ordered',
    visitDate:          'Visit Date',
    items:              'Items',
    viewDownloadEticket: 'View / Download E-Ticket',
    couldNotLoad:       'Could not load order',
    selectDate:         'Select Date',
    whenVisiting:       'When are you visiting?',
    available7Days:     'Available for the next 7 days',
    chooseDay:          'Choose a day',
    purchase:           'Purchase',
    total:              'Total',
  },
  profile: {
    personalInfo:       'Personal Info',
    language:           'Language',
    activity:           'Activity',
    security:           'Security',
    legal:              'Legal',
    myOrders:           'My Orders',
    changePassword:     'Change Password',
    privacyPolicy:      'Privacy Policy',
    termsConditions:    'Terms & Conditions',
    pdpa:               'Personal Data Protection Act',
    fullNamePlaceholder: 'Full name',
    dobPlaceholder:     'Date of birth',
    currentPassword:    'Current password',
    newPassword:        'New password',
    confirmNewPassword: 'Confirm new password',
    updatePassword:     'Update Password',
    saveChanges:        'Save Changes',
    customerSupport:    'Customer Support',
    contactFacebook:    'Contact us on Facebook',
    contactLine:        'Contact us on LINE',
    signOut:            'Sign Out',
    deleteAccount:      'Delete Account',
    linkedAccounts:     'Linked Accounts',
    addEmail:           'Add your real email',
    addEmailDesc:       'You signed in without an email address. Add one so your account can receive updates.',
    becomeVerified:     'Become Moi Verified',
    becomeMerchant:     'Become a Merchant',
    merchantApproved:   'Merchant Account',
    approvedBadge:      'Approved',
    manageMenu:             'Manage Menu',
    merchantDashboardHint:  'Your account is already a verified merchant. Log into the Merchant Dashboard using the same credentials as this account.',
    addThaiPhone:           'Add a Thai phone number for OTP login',
    alreadyConnected:   'Already connected to this account',
    useGoogleLater:     'Use Google to sign in later',
    useAppleLater:      'Use Apple to sign in later',
    useLineLater:       'Use LINE to sign in later',
    english:            'English',
    burmese:            'မြန်မာ',
    thai:               'ภาษาไทย',
  },
  docs: {
    passportBioPage:    'Passport Bio Page',
    visaPage:           'Visa Page',
    oldSlip:            'Old 90-Day Report Slip',
    identityCardFront:  'Identity Card (Front)',
    identityCardBack:   'Identity Card (Back)',
    tm30:               'TM30 Document',
    upperBodyPhoto:     'Upper Body Photo',
    airplaneTicket:     'Airplane Ticket',
    passportSizePhoto:  'Passport Size Photo',
  },
  map: {
    nearby:           '📍 Nearby',
    all:              '🌐 All',
    getDirections:    '🗺 Get Directions',
    navigateOnMap:    '▶ Navigate on Map',
    filterByTags:     'Filter by Tags',
    noTagsAvailable:  'No tags available',
    searchPlaceholder: 'Search places, services…',
    couldNotLoad:     'Could not load map',
  },
  upload: {
    photoLibraryRequired: 'Photo library access is required to upload documents.',
    fileTooLarge:         'Could not upload. Total upload size is too large (max 50 MB per request).',
    uploadFailed:         'Upload failed. Please try again.',
  },
  ninetyDay: {
    title:      '90-Day Report',
    fullName:   'Full Name',
    phone:      'Phone Number',
    submit:     'Submit',
    submitting: 'Submitting…',
  },
  payment: {
    title:          'Payment',
    amount:         'Amount',
    status:         'Status',
    expires:        'Expires',
    markAsPaid:     'Mark as Paid',
    confirming:     'Confirming…',
    promptpayQr:    'PromptPay QR Code',
    expired:        'Expired',
    regenerate:     'Regenerate QR',
    generating:     'Generating…',
    contactUs:      'Contact Us',
  },
  tabs: {
    home:    'Home',
    map:     'Map',
    orders:  'Orders',
    profile: 'Profile',
  },
  shortcuts: {
    passportLabel: 'Passport',
    passportSub:   'Bio & visa pages',
    ninetyLabel:   '90-Day',
    ninetySub:     'Report slips',
    myDocsLabel:   'My Docs',
    myDocsSub:     'Permits, IDs & more',
  },
  verified: {
    title:            'Become Moi Verified',
    subtitle:         'Unlock your full account potential',
    youAreVerified:   'You are Moi Verified!',
    whyVerify:        'Why get verified?',
    prioritySupport:  'Priority support from our customer team',
    verifiedBadge:    'Verified badge displayed on your profile',
    fasterProcessing: 'Faster processing for all service submissions',
    requirements:     'Requirements',
    channels:         'Connected to at least 2 sign-in channels',
    payments:         'Completed at least 3 payments',
  },
  merchant: {
    title:              'Become a Merchant',
    subtitle:           'Open your own shop on Moi Order',
    introTitle:         'Grow your business with Moi Order',
    introBody:          'Apply to open your own restaurant or shop and reach thousands of customers.',
    benefitReach:       'Reach more customers across the app',
    benefitDashboard:   'Manage orders and menu from your own dashboard',
    benefitPayouts:     'Receive payouts directly to your account',
    applyButton:        'Apply Now',
    draftTitle:         'Application started',
    draftBody:          'Visit https://merchant.moiorder.com and login with the same login method or credentials as this account.',
    downloadApp:        'Download Moi Merchant',
    cancelButton:       'Cancel Application',
    cancelConfirmTitle: 'Cancel application?',
    cancelConfirmBody:  'Your draft application will be removed. You can apply again later.',
    cancelConfirmYes:   'Yes, cancel',
    cancelConfirmNo:    'No, keep it',
    underReviewTitle:   'Application under review',
    underReviewBody:    'Our team is reviewing your application. We will notify you once a decision is made.',
    approvedTitle:      'You are now a merchant!',
    approvedBody:       'Your application was approved. Open the "Moi Merchant" app and log in with the same email and password to manage your shop.',
    openAppButton:      'Open Moi Merchant',
    rejectedTitle:      'Application not approved',
    rejectedBody:       'Your application was not approved this time. You can review the notes below and apply again.',
    reviewNotes:        'Reviewer notes',
    applyAgainButton:   'Apply Again',
  },
  form: {
    personalInfo:      'Personal Information',
    requiredDocuments: 'Required Documents',
    fullName:          'Full Name',
    phoneNumber:       'Phone Number',
  },
  services: {
    availableServices:  'Available Services',
    selectType:         'Select Type',
    noServices:         'No services available at the moment.',
    unableToLoad:       'Unable to load services. Please try again.',
    ninetyDayEyebrow:   '90-Day Report',
    ninetyDayTitle:     '90-Day Report',
    ninetyDaySubtitle:  'Select the report type that matches your visa category.',
    ninetyDaySubmitted: "Your 90-day report has been submitted.\nWe'll process it and notify you shortly.",
    companyEyebrow:     'Business & Company',
    companyTitle:       'Company Services',
    companySubtitle:    'Company registration and business documentation.',
    otherEyebrow:       'Registration & More',
    otherTitle:         'Other Services',
    otherSubtitle:      'Additional immigration and registration services.',
    backHome:           'Home',
    embassyEyebrow:     'Embassy Services',
    embassyTitle:       'Embassy Services',
    embassySubtitle:    'Embassy support letters and documentation services.',
    passportCiEyebrow:  'Documents',
    passportCiTitle:    'Passport / CI Services',
    passportCiSubtitle: 'Passport and certificate of identity services.',
  },
  notifs: {
    title:        'Notifications',
    markAllRead:  'Mark all read',
    marking:      'Marking…',
    clearAll:     'Clear all',
    noNotifs:     'No notifications',
    loading:      'Loading…',
  },
  restaurant: {
    listTitle:               'Restaurants',
    couldNotLoad:            'Could not load restaurant.',
    closesAt:                'Closes at {time}',
    reopensAt:               'Reopens at {time}',
    statusOpen:              'Open',
    statusClosed:            'Closed',
    statusPaused:            'Paused',
    popularPicks:            'Popular Picks',
    promotions:              'Promotions',
    recommendations:         'Recommendations',
    noItemsYet:              'No items yet',
    specialInstructions:     'Special Instructions (optional)',
    instructionsPlaceholder: 'e.g. no spice, extra sauce…',
    addToCart:               'Add to Cart',
    customizable:            'Customizable',
    unavailable:             'Sold Out',
    required:                'Required',
    optional:                'Optional',
    chooseOne:               'Choose 1',
    chooseAtLeast:           'Choose at least {n}',
    chooseUpTo:              'Choose up to {n}',
    payViaLine:              'Pay via LINE',
    chatWithRestaurant:      'Chat with Restaurant',
    contactNoLabel:          'Contact No',
    contactNoPlaceholder:    'Your phone number',
    contactNoRequired:       'Contact number is required',
  },
  chat: {
    notice:          'Chat disappears 3 hours after order complete. Do not share sensitive info. Admin are watching!',
    noMessages:      'No messages yet. Say hello!',
    cannotLoad:      'Could not load messages.',
    locked:          'Chat has closed. Messages are deleted 3 hours after order completion.',
    willClose:       'Chat will close 3 hours after order completion.',
    typePlaceholder: 'Type a message…',
    addPhoto:        'Attach photo',
    replyTo:         'Reply to',
    cancelReply:     'Cancel reply',
    photo:           'Photo',
    reply:           'Reply',
    copyText:        'Copy text',
    deleteMessage:   'Delete message',
  },
};

// ─── Burmese ─────────────────────────────────────────────────────────────────

const mm: AppStrings = {
  common: {
    loading:            'ဖတ်နေသည်…',
    error:              'အမှား',
    retry:              'ထပ်ကြိုးစားပါ',
    cancel:             'ပယ်ဖျက်ပါ',
    confirm:            'အတည်ပြုပါ',
    save:               'သိမ်းဆည်းပါ',
    back:               'နောက်သို့',
    close:              'ပိတ်ပါ',
    submit:             'တင်သွင်းပါ',
    continue:           'ဆက်လက်ဆောင်ရွက်ပါ',
    search:             'ရှာဖွေပါ',
    done:               'ပြီးပါပြီ',
    couldNotLoad:       'ဖတ်မရနိုင်ပါ',
    pullToRetry:        'ပြန်ကြိုးစားရန် ဆွဲချပါ',
    somethingWentWrong: 'တစ်ခုခုမှားယွင်းနေသည်။ ထပ်ကြိုးစားပါ။',
    payNow:             'ယခု ငွေပေးချေပါ',
    cancelOrder:        'အော်ဒါပယ်ဖျက်ပါ',
    cancelling:         'ပယ်ဖျက်နေသည်…',
    getStarted:         'အကောင့်ဖွင့်ရန်',
    viewDownload:       'ကြည့်ရန် / ဒေါင်းလုဒ်',
    saveToGallery:      'ပြပွဲသို့ သိမ်းဆည်းပါ',
    selectAll:          'အားလုံးရွေးပါ',
    deselectAll:        'အားလုံးဖယ်ရှားပါ',
    apply:              'အသုံးချပါ',
    clear:              'ရှင်းပါ',
    noResults:          'ရလဒ်မတွေ့ပါ',
  },
  status: {
    pending_payment:  'ငွေပေးချေရန်',
    processing:       'ဆောင်ရွက်နေသည်',
    completed:        'ပြီးဆုံးသည်',
    payment_failed:   'ငွေပေးချေမှု မအောင်မြင်ပါ',
    cancelled:        'ပယ်ဖျက်ပြီးသည်',
    pending:          'စောင့်ဆိုင်းနေသည်',
  },
  auth: {
    tagline:            'မြန်ဆန် · ယုံကြည်စိတ်ချ · တိကျ',
    signIn:             'အကောင့်ဝင်ရန်',
    signInSubtitle:     'ကြိုဆိုပါသည် — အကောင့်ဝင်ပါ',
    register:           'အကောင့်ဖွင့်ပါ',
    registerSubtitle:   'MOI Order ဖြင့် သင်၏နေထိုင်ရေး ကို မြှင့်တင်လိုက်ပါ ',
    email:              'အီးမေးလ်',
    password:           'စကားဝှက်',
    phone:              'ဖုန်းနံပါတ်',
    fullName:           'နာမည်အပြည့်အစုံ',
    forgotPassword:     'စကားဝှက် မေ့နေသလား?',
    orSignInWith:       'သို့မဟုတ် ဖြင့် ဝင်ရောက်ပါ',
    checkingEmail:      'စစ်ဆေးနေသည်…',
    submitting:         'တင်သွင်းနေသည်…',
    sendOtp:            'OTP ပို့ပါ',
    verifyOtp:          'အတည်ပြုပါ',
    resendOtp:          'OTP ပြန်ပို့ပါ',
    resendIn:           'ပြန်ပို့ရမည့်အချိန်',
    otpSent:            'OTP ပို့ပြီးပါပြီ',
    goToLogin:          'အကောင့်ရှိပြီးသားလား? ဝင်ရောက်ပါ',
    alreadyHaveAccount: 'အကောင့်ရှိပြီးသားဆိုလျှင်',
    noAccount:          'အကောင့်မရှိသေးဘူးလား?',
    createAccount:      'အကောင့်ဖွင့်ပါ',
    tapHere:            'နှိပ်ရန်',
    haveAccountTap:     'အကောင့်ရှိပါသလား? နှိပ်ရန်',
    noAccountTap:       'အကောင့်ဖွင့်လိုပါသလား? နှိပ်ရန်',
  },
  search: {
    placeholder:  'ရှာဖွေရန်',
    all:          'အားလုံး',
    places:       '📍 နေရာများ',
    tickets:      '🎟 လက်မှတ်များ',
    services:     '⚙️ ၀န်ဆောင်မှုများ',
    searchAll:    'ရှာဖွေပါ',
    searchAllSub: 'နေရာများ၊ လက်မှတ်များ၊ ၀န်ဆောင်မှုများ ရှာနိုင်သည်',
    noResults:    'ရလဒ်မတွေ့ပါ',
    noResultsSub: 'အခြားစကားလုံးဖြင့် ထပ်ကြိုးစားပါ',
  },
  home: {
    hello:              'မင်္ဂလာပါ, {name}',
    welcome:            'ကြိုဆိုပါသည်',
    tagline1:           'Your all-in-one',
    tagline2:           'app',
    searchPlaceholder:  'နေရာများ၊ လက်မှတ်များ၊ ၀န်ဆောင်မှုများ ရှာဖွေပါ…',
    ourServices:        '၀န်ဆောင်မှုများ',
    ninetyDayReport:    'ရက် ၉၀ တုံး',
    placesAndTickets:   'နေရာများ & လက်မှတ်',
    attractions:        'လည်ပတ်စရာများနှင့် ထင်ရှားသောနေရာများ',
    otherServices:      'အခြား၀န်ဆောင်မှုများ',
    companyMore:        'ကုမ္ပဏီနှင့် အခြားအချက်အလက်များ',
    embassyServices:    'သံရုံးထောက်ခံစာများ',
    embassyMore:        'ထောက်ခံစာများနှင့် အခြားကဏ္ဍများ',
    airportFastTrack:   'Airport Fast Track',
    airportSubtitle:    'လေဆိပ် အထူး၀န်ဆောင်မှု',
    busTickets:         'ကားလက်မှတ်များ',
    busSubtitle:        'ကားလိုင်းများနှင့် အချိန်ဇယားများ',
    passport:           'Passport / CI',
    passportSubtitle:   'Document services',
    foodOrder:          'အစားအသောက်မှာယူရန်',
    foodOrderSubtitle:  'အစားအသောက် ပို့ဆောင်ရေး',
  },
  orders: {
    title:              'ကျွနိုပ်၏အော်ဒါများ',
    orderNum:           'အော်ဒါ #{id}',
    submitted:          'တင်သွင်းခဲ့သည်',
    ordered:            'မှာယူခဲ့သည်',
    summary:            'အကျဉ်းချုပ်',
    service:            '၀န်ဆောင်မှု',
    status:             'အခြေအနေ',
    personalInfo:       'ကိုယ်ရေးအချက်အလက်',
    documents:          'စာရွက်စာတမ်းများ',
    awaitingConfirmation: '🔔 သင်၏အော်ဒါကို ကျွန်ုပ်တို့အဖွဲ့ထံ အကြောင်းကြားပြီးဖြစ်သည်။ အတည်ပြုပြီးနောက် ငွေပေးချေမှုအတွက် ကြိုတင်ပြင်ဆင်ထားပါ။',
    viewDownloadResult: 'ရလဒ်ကြည့်ရှုရန် / ဒေါင်းလုဒ်',
    couldNotLoad:       'အော်ဒါ ဖတ်မရနိုင်ပါ',
    pullToRetry:        'ပြန်ကြိုးစားရန် ဆွဲချပါ',
    eyebrow:            'လုပ်ဆောင်ချက်များ',
    subtitle:           'သင်၏ ၀န်ဆောင်မှုတင်ခြင်းများနှင့် လက်မှတ်များ',
    signInToView:       'အော်ဒါများကြည့်ရန် ဝင်ရောက်ပါ',
    signInTrack:        'သင်၏ ၀န်ဆောင်မှုများနှင့် လက်မှတ်မှာယူမှုများကို တစ်နေရာတည်း ကြည့်ရှုပါ',
    noServiceOrders:    '၀န်ဆောင်မှုအော်ဒါ မရှိသေးပါ',
    noServiceSub:       'အော်ဒါတင်သွင်းပြီးနောက် ဤနေရာတွင် ပြသမည်',
    noTicketOrders:     'လက်မှတ်အော်ဒါ မရှိသေးပါ',
    noTicketSub:        'လက်မှတ်မှာယူမှုများ ဤနေရာတွင် ပြသမည်',
    contactUs:          'ဆက်သွယ်ရန်',
    items:              'ပစ္စည်းများ',
  },
  tickets: {
    orderNum:           'လက်မှတ်အော်ဒါ #{id}',
    ordered:            'မှာယူခဲ့သည်',
    visitDate:          'သွားရောက်မည့်နေ့',
    items:              'ပစ္စည်းများ',
    viewDownloadEticket: 'E-Ticket ကြည့်ရန် / ဒေါင်းလုဒ်',
    couldNotLoad:       'အော်ဒါ ဖတ်မရနိုင်ပါ',
    selectDate:         'နေ့ရက်ရွေးပါ',
    whenVisiting:       'ဘယ်နေ့ သွားမလဲ?',
    available7Days:     'နောက် ၇ ရက်အတွင်း ရနိုင်သည်',
    chooseDay:          'နေ့ရက်တစ်ခု ရွေးပါ',
    purchase:           'ဝယ်ယူပါ',
    total:              'စုစုပေါင်း',
  },
  profile: {
    personalInfo:       'ကိုယ်ရေးအချက်အလက်',
    language:           'ဘာသာစကား',
    activity:           'လုပ်ဆောင်ချက်များ',
    security:           'လုံခြုံရေး',
    legal:              'ဥပဒေရေးရာ',
    myOrders:           'ကျွနိုပ်၏အော်ဒါများ',
    changePassword:     'စကားဝှက်ပြောင်းရန်',
    privacyPolicy:      'ကိုယ်ရေးအချက်အလက်မူဝါဒ',
    termsConditions:    'စည်းကမ်းချက်များ',
    pdpa:               'ကိုယ်ရေးအချက်အလက် ကာကွယ်ရေးဥပဒေ',
    fullNamePlaceholder: 'နာမည်အပြည့်အစုံ',
    dobPlaceholder:     'မွေးသက္ကရာဇ်',
    currentPassword:    'လက်ရှိစကားဝှက်',
    newPassword:        'စကားဝှက်အသစ်',
    confirmNewPassword: 'စကားဝှက်အသစ်ကိုအတည်ပြုပါ',
    updatePassword:     'စကားဝှက်အသစ်ပြောင်းရန်',
    saveChanges:        'သိမ်းဆည်းမည်',
    customerSupport:    'ဖောက်သည်ပံ့ပိုးမှု',
    contactFacebook:    'Facebook တွင် ဆက်သွယ်ပါ',
    contactLine:        'LINE တွင် ဆက်သွယ်ပါ',
    signOut:            'အကောင့်ထွက်မည်',
    deleteAccount:      'အကောင့်ဖျက်မည်',
    linkedAccounts:     'ချိတ်ဆက်ထားသောအကောင့်များ',
    addEmail:           'သင်၏ အီးမေးလ်ထည့်ပါ',
    addEmailDesc:       'အီးမေးလ်မပါဘဲ ဝင်ရောက်ထားသည်။ အကောင့်သတင်းများ လက်ခံရရှိရန် ထည့်ပါ။',
    becomeVerified:     'Moi Verified ရယူပါ',
    becomeMerchant:     'အရောင်းသမားအဖြစ် လျှောက်ထားရန်',
    merchantApproved:   'အရောင်းသမား အကောင့်',
    approvedBadge:      'အတည်ပြုပြီး',
    manageMenu:             'မီနူးစီမံပါ',
    merchantDashboardHint:  'သင့်အကောင့်သည် အရောင်းသမားအဖြစ် အတည်ပြုပြီးပါပြီ။ ဤအကောင့်နှင့် တူညီသော အချက်အလက်များဖြင့် Merchant Dashboard သို့ ဝင်ရောက်ပါ။',
    addThaiPhone:           'OTP ဖြင့် ဝင်ရောက်ရန် ထိုင်းဖုန်းနံပါတ် ထည့်ပါ',
    alreadyConnected:   'ဤအကောင့်နှင့် ချိတ်ဆက်ပြီးပါပြီ',
    useGoogleLater:     'Google ဖြင့် ဝင်ရောက်နိုင်သည်',
    useAppleLater:      'Apple ဖြင့် ဝင်ရောက်နိုင်သည်',
    useLineLater:       'LINE ဖြင့် ဝင်ရောက်နိုင်သည်',
    english:            'English',
    burmese:            'မြန်မာ',
    thai:               'ภาษาไทย',
  },
  docs: {
    passportBioPage:    'ပတ်စပို့ (ရှေ့မျက်နှာ)',
    visaPage:           'ဗီဇာ မျက်နှာ',
    oldSlip:            'ရက် ၉၀ စလစ်အဟောင်း',
    identityCardFront:  'မှတ်ပုံတင် (အရှေ့)',
    identityCardBack:   'မှတ်ပုံတင် (အနောက်)',
    tm30:               'TM30 စာရွက်',
    upperBodyPhoto:     'ကိုယ်ပိုင်ပုံ (ခါးပေါ်)',
    airplaneTicket:     'လေယာဉ်လက်မှတ်',
    passportSizePhoto:  'ပတ်စ်ပို့ ဓာတ်ပုံ',
  },
  map: {
    nearby:           '📍 နီးစပ်ရာ',
    all:              '🌐 အားလုံး',
    getDirections:    '🗺 လမ်းညွှန်ရယူပါ',
    navigateOnMap:    '▶ မြေပုံပေါ်တွင် သွားပါ',
    filterByTags:     'တဂ်ဖြင့် စစ်ထုတ်ပါ',
    noTagsAvailable:  'တဂ်များ မရှိပါ',
    searchPlaceholder: 'နေရာများ၊ ၀န်ဆောင်မှုများ ရှာဖွေပါ…',
    couldNotLoad:     'မြေပုံ ဖတ်မရနိုင်ပါ',
  },
  upload: {
    photoLibraryRequired: 'စာရွက်စာတမ်းများ တင်ရန် ဓာတ်ပုံ library ခွင့်ပြုချက် လိုအပ်သည်',
    fileTooLarge:         'တင်မရပါ။ ဖိုင်အရွယ်အစားသည် အကြီးဆုံး 50 MB ဖြစ်သည်',
    uploadFailed:         'တင်မရပါ။ ထပ်ကြိုးစားပါ။',
  },
  ninetyDay: {
    title:      'ရက် ၉၀ တုံး',
    fullName:   'နာမည်အပြည့်အစုံ',
    phone:      'ဖုန်းနံပါတ်',
    submit:     'တင်သွင်းပါ',
    submitting: 'တင်သွင်းနေသည်…',
  },
  payment: {
    title:          'ငွေပေးချေမှု',
    amount:         'ပမာဏ',
    status:         'အခြေအနေ',
    expires:        'သက်တမ်းကုန်ဆုံးချိန်',
    markAsPaid:     'ပေးချေပြီးဟု မှတ်ပါ',
    confirming:     'အတည်ပြုနေသည်…',
    promptpayQr:    'PromptPay QR ကုဒ်',
    expired:        'သက်တမ်းကုန်ပြီ',
    regenerate:     'QR ပြန်ဖန်တီးပါ',
    generating:     'ဖန်တီးနေသည်…',
    contactUs:      'ဆက်သွယ်ရန်',
  },
  tabs: {
    home:    'ပင်မ',
    map:     'မြေပုံ',
    orders:  'အော်ဒါများ',
    profile: 'ပရိုဖိုင်',
  },
  shortcuts: {
    passportLabel: 'ပတ်စပို့',
    passportSub:   'ပတ်စပို့နှင့် ဗီဇာ စာမျက်နှာ',
    ninetyLabel:   'ရက် ၉၀',
    ninetySub:     'ရက်၉၀တုံး စလစ်များ',
    myDocsLabel:   'စာရွက်စာတမ်း',
    myDocsSub:     'လိုင်စင်၊ စာရွက်စာတမ်း နှင့် အခြား',
  },
  verified: {
    title:            'Moi Verified ရယူပါ',
    subtitle:         'သင်၏ အကောင့်အပြည့်အစုံ ဖွင့်ပါ',
    youAreVerified:   'သင် Moi Verified ဖြစ်ပြီ!',
    whyVerify:        'ဘာကြောင့် Verified ရယူရမလဲ?',
    prioritySupport:  'ဖောက်သည်ဝန်ဆောင်မှုတွင် ဦးစားပေးဆက်ဆံမှု',
    verifiedBadge:    'Verified ဘတ်ဂ် သင်၏ ပရိုဖိုင်တွင် ပြသမည်',
    fasterProcessing: '၀န်ဆောင်မှုများ ပိုမိုမြန်ဆန်စွာ ဆောင်ရွက်ပေးမည်',
    requirements:     'လိုအပ်ချက်များ',
    channels:         'အနည်းဆုံး ဝင်ရောက်ချန်နယ် ၂ ခု ချိတ်ဆက်ပါ',
    payments:         'အနည်းဆုံး ၃ ကြိမ် ငွေပေးချေပြီးဖြစ်ရမည်',
  },
  merchant: {
    title:              'အရောင်းသမားအဖြစ် လျှောက်ထားရန်',
    subtitle:           'Moi Order တွင် သင့်ဆိုင်ကို ဖွင့်ပါ',
    introTitle:         'Moi Order နှင့်အတူ သင့်လုပ်ငန်းကို တိုးချဲ့ပါ',
    introBody:          'သင့်ဆိုင် (သို့) စားသောက်ဆိုင်ကို ဖွင့်ရန် လျှောက်ထားပြီး ဖောက်သည်များစွာထံ ရောက်ရှိပါ။',
    benefitReach:       'အက်ပ်တစ်ခုလုံးရှိ ဖောက်သည်များထံ ရောက်ရှိနိုင်မည်',
    benefitDashboard:   'သင့်ကိုယ်ပိုင် dashboard မှ အော်ဒါနှင့် မီနူးကို စီမံနိုင်မည်',
    benefitPayouts:     'သင့်အကောင့်သို့ တိုက်ရိုက်ငွေလက်ခံနိုင်မည်',
    applyButton:        'လျှောက်ထားမည်',
    draftTitle:         'လျှောက်လွှာ စတင်ပြီးပါပြီ',
    draftBody:          'https://merchant.moiorder.com သို့ ဝင်ရောက်ပြီး ဤအကောင့်နှင့် တူညီသော လော့ဂ်အင်နည်းလမ်း သို့မဟုတ် အထောက်အထားများဖြင့် ဝင်ရောက်ပါ။',
    downloadApp:        'Moi Merchant ဒေါင်းလုဒ်လုပ်ရန်',
    cancelButton:       'လျှောက်လွှာ ပယ်ဖျက်မည်',
    cancelConfirmTitle: 'လျှောက်လွှာကို ပယ်ဖျက်မလား?',
    cancelConfirmBody:  'သင့် Draft လျှောက်လွှာကို ဖယ်ရှားပါမည်။ နောက်ပိုင်းတွင် ပြန်လည်လျှောက်ထားနိုင်ပါသည်။',
    cancelConfirmYes:   'ဟုတ်၊ ပယ်ဖျက်မည်',
    cancelConfirmNo:    'မပယ်ဖျက်တော့ပါ',
    underReviewTitle:   'လျှောက်လွှာကို စိစစ်နေပါသည်',
    underReviewBody:    'ကျွန်ုပ်တို့အဖွဲ့မှ သင့်လျှောက်လွှာကို စိစစ်နေပါသည်။ ဆုံးဖြတ်ချက်ရရှိပါက အကြောင်းကြားပါမည်။',
    approvedTitle:      'သင်သည် အရောင်းသမားတစ်ဦး ဖြစ်လာပါပြီ!',
    approvedBody:       'သင့်လျှောက်လွှာကို အတည်ပြုပြီးပါပြီ။ "Moi Merchant" အက်ပ်ကို ဖွင့်ပြီး ဤအကောင့်နှင့် တူညီသော အီးမေးလ်နှင့် စကားဝှက်ဖြင့် ဝင်ရောက်ပြီး သင့်ဆိုင်ကို စီမံပါ။',
    openAppButton:      'Moi Merchant ဖွင့်ရန်',
    rejectedTitle:      'လျှောက်လွှာ အတည်မပြုခဲ့ပါ',
    rejectedBody:       'ယခုအကြိမ် သင့်လျှောက်လွှာကို အတည်မပြုခဲ့ပါ။ အောက်ပါမှတ်ချက်များကို ကြည့်ပြီး ပြန်လည်လျှောက်ထားနိုင်ပါသည်။',
    reviewNotes:        'စိစစ်သူ၏ မှတ်ချက်',
    applyAgainButton:   'ပြန်လည်လျှောက်ထားမည်',
  },
  form: {
    personalInfo:      'ကိုယ်ရေးအချက်အလက်',
    requiredDocuments: 'လိုအပ်သောစာရွက်စာတမ်းများ',
    fullName:          'နာမည်အပြည့်အစုံ',
    phoneNumber:       'ဖုန်းနံပါတ်',
  },
  services: {
    availableServices:  '၀န်ဆောင်မှုများ',
    selectType:         'အမျိုးအစားရွေးပါ',
    noServices:         'ယခုအချိန်တွင် ၀န်ဆောင်မှုများ မရှိသေးပါ',
    unableToLoad:       '၀န်ဆောင်မှုများ ဖတ်မရပါ။ ထပ်ကြိုးစားပါ',
    ninetyDayEyebrow:   'ရက် ၉၀ တုံး',
    ninetyDayTitle:     'ရက် ၉၀ တုံး',
    ninetyDaySubtitle:  'သင်၏ ဗီဇာအမျိုးအစားနှင့် ကိုက်ညီသော ၀န်ဆောင်မှုကို ရွေးပါ',
    ninetyDaySubmitted: 'သင်၏ ရက် ၉၀ တုံးကို တင်သွင်းပြီးပါပြီ။\nကျွန်ုပ်တို့ ဆောင်ရွက်ပေးပြီး အကြောင်းကြားပါမည်',
    companyEyebrow:     'စီးပွားရေးနှင့် ကုမ္ပဏီ',
    companyTitle:       'ကုမ္ပဏီ၀န်ဆောင်မှုများ',
    companySubtitle:    'ကုမ္ပဏီမှတ်ပုံတင်ခြင်းနှင့် စီးပွားရေးစာရွက်စာတမ်းများ',
    otherEyebrow:       'မှတ်ပုံတင်ခြင်းနှင့် အခြားကဏ္ဍများ',
    otherTitle:         'အခြား၀န်ဆောင်မှုများ',
    otherSubtitle:      'မှတ်ပုံတင်ခြင်းနှင့် အခြားဝန်ဆောင်မှုများ',
    backHome:           'ပင်မ',
    embassyEyebrow:     'သံရုံးဝန်ဆောင်မှုများ',
    embassyTitle:       'သံရုံးထောက်ခံစာများ',
    embassySubtitle:    'သံရုံး ထောက်ခံစာများနှင့် စာရွက်စာတမ်း ဝန်ဆောင်မှုများ',
    passportCiEyebrow:  'စာရွက်စာတမ်းများ',
    passportCiTitle:    'နိုင်ငံကူးလက်မှတ် / CI',
    passportCiSubtitle: 'နိုင်ငံကူးလက်မှတ်နှင့် CI ဝန်ဆောင်မှုများ',
  },
  notifs: {
    title:        'အကြောင်းကြားချက်များ',
    markAllRead:  'အားလုံး ဖတ်ပြီးဟုသတ်မှတ်ပါ',
    marking:      'သတ်မှတ်နေသည်…',
    clearAll:     'အားလုံးဖျက်ပါ',
    noNotifs:     'အကြောင်းကြားချက်မရှိပါ',
    loading:      'ဖတ်နေသည်…',
  },
  restaurant: {
    listTitle:               'စားသောက်ဆိုင်များ',
    couldNotLoad:            'စားသောက်ဆိုင်ကို ဖွင့်မရပါ။',
    closesAt:                '{time} တွင် ပိတ်သည်',
    reopensAt:               '{time} တွင် ပြန်ဖွင့်သည်',
    statusOpen:              'ဖွင့်ထား',
    statusClosed:            'ပိတ်ထား',
    statusPaused:            'ယာယီရပ်ဆိုင်း',
    popularPicks:            'လူကြိုက်များသော ဟင်းများ',
    promotions:              'ပရိုမိုးရှင်း',
    recommendations:         'အကြံပြုချက်များ',
    noItemsYet:              'ပစ္စည်းမရှိသေးပါ',
    specialInstructions:     'အထူးညွှန်ကြားချက် (ရွေးချယ်နိုင်)',
    instructionsPlaceholder: 'ဥပမာ ဆီမထည့်နဲ့၊ ဆော့စ်ပိုထည့်…',
    addToCart:               'ခြင်းတောင်းထဲ ထည့်မည်',
    customizable:            'စိတ်ကြိုက်ရွေးချယ်နိုင်',
    unavailable:             'ကုန်သွားပြီ',
    required:                'မဖြစ်မနေ',
    optional:                'ရွေးချယ်နိုင်',
    chooseOne:               'တစ်ခုရွေးချယ်ပါ',
    chooseAtLeast:           'အနည်းဆုံး {n} ခုရွေးချယ်ပါ',
    chooseUpTo:              'အများဆုံး {n} ခုအထိ ရွေးချယ်နိုင်',
    payViaLine:              'ေငွေပေးချေရန် Line',
    chatWithRestaurant:      'ဆိုင်နှင့် ချတ်ဆွေးနွေးမည်',
    contactNoLabel:          'ဆက်သွယ်ရန် နံပါတ်',
    contactNoPlaceholder:    'ဖုန်းနံပါတ်',
    contactNoRequired:       'ဆက်သွယ်ရန် နံပါတ် ဖြည့်ပေးပါ',
  },
  chat: {
    notice:          'ချတ်သည် မှာယူမှု ပြီးဆုံးပြီး ၃ နာရီ အကြာတွင် ပျောက်ကွယ်သွားမည်။ လျှို့ဝှက်သော အချက်အလက်များ မျှဝေခြင်း မပြုပါနှင့်။ Admin မှ ကြည့်ရှုနေသည်!',
    noMessages:      'မက်ဆေ့ မရှိသေးပါ။ မင်္ဂလာပါ ဆိုပြောလိုက်ပါ!',
    cannotLoad:      'မက်ဆေ့များ ဖတ်မရနိုင်ပါ။',
    locked:          'ချတ် ပိတ်သွားပြီ။ မှာယူမှု ပြီးဆုံးပြီး ၃ နာရီ အကြာတွင် မက်ဆေ့များ ဖျက်မည်။',
    willClose:       'မှာယူမှု ပြီးဆုံးပြီး ၃ နာရီ အကြာတွင် ချတ် ပိတ်မည်။',
    typePlaceholder: 'မက်ဆေ့ ရေးရန်…',
    addPhoto:        'ဓာတ်ပုံ ပူးတွဲရန်',
    replyTo:         'ပြန်ဆိုရန်',
    cancelReply:     'ပြန်ဆိုမှု ပယ်ဖျက်ရန်',
    photo:           'ဓာတ်ပုံ',
    reply:           'ပြန်ဆို',
    copyText:        'စာသား ကူးယူရန်',
    deleteMessage:   'မက်ဆေ့ ဖျက်ရန်',
  },
};

// ─── Thai ─────────────────────────────────────────────────────────────────────

const th: AppStrings = {
  common: {
    loading:            'กำลังโหลด…',
    error:              'ข้อผิดพลาด',
    retry:              'ลองอีกครั้ง',
    cancel:             'ยกเลิก',
    confirm:            'ยืนยัน',
    save:               'บันทึก',
    back:               'กลับ',
    close:              'ปิด',
    submit:             'ส่ง',
    continue:           'ดำเนินการต่อ',
    search:             'ค้นหา',
    done:               'เสร็จสิ้น',
    couldNotLoad:       'ไม่สามารถโหลดได้',
    pullToRetry:        'ดึงลงเพื่อลองอีกครั้ง',
    somethingWentWrong: 'เกิดข้อผิดพลาด กรุณาลองอีกครั้ง',
    payNow:             'ชำระเงินเลย',
    cancelOrder:        'ยกเลิกคำสั่งซื้อ',
    cancelling:         'กำลังยกเลิก…',
    getStarted:         'เริ่มต้นใช้งาน',
    viewDownload:       'ดู / ดาวน์โหลด',
    saveToGallery:      'บันทึกลงแกลเลอรี',
    selectAll:          'เลือกทั้งหมด',
    deselectAll:        'ยกเลิกการเลือกทั้งหมด',
    apply:              'ใช้งาน',
    clear:              'ล้าง',
    noResults:          'ไม่พบผลลัพธ์',
  },
  status: {
    pending_payment:  'รอการชำระเงิน',
    processing:       'กำลังดำเนินการ',
    completed:        'เสร็จสมบูรณ์',
    payment_failed:   'การชำระเงินล้มเหลว',
    cancelled:        'ยกเลิกแล้ว',
    pending:          'รอดำเนินการ',
  },
  auth: {
    tagline:            'รวดเร็ว · เชื่อถือได้ · ไว้วางใจได้',
    signIn:             'เข้าสู่ระบบ',
    signInSubtitle:     'ยินดีต้อนรับกลับ — มาเข้าสู่ระบบกัน',
    register:           'สร้างบัญชีของคุณ',
    registerSubtitle:   'เข้าร่วมกับผู้ใช้หลายพันคนที่ไว้วางใจ MOI Order',
    email:              'อีเมล',
    password:           'รหัสผ่าน',
    phone:              'หมายเลขโทรศัพท์',
    fullName:           'ชื่อ-นามสกุล',
    forgotPassword:     'ลืมรหัสผ่าน?',
    orSignInWith:       'หรือเข้าสู่ระบบด้วย',
    checkingEmail:      'กำลังตรวจสอบ…',
    submitting:         'กำลังส่ง…',
    sendOtp:            'ส่ง OTP',
    verifyOtp:          'ยืนยัน',
    resendOtp:          'ส่ง OTP อีกครั้ง',
    resendIn:           'ส่งอีกครั้งใน',
    otpSent:            'ส่ง OTP แล้ว',
    goToLogin:          'มีบัญชีอยู่แล้ว? เข้าสู่ระบบ',
    alreadyHaveAccount: 'มีบัญชีอยู่แล้ว?',
    noAccount:          'ยังไม่มีบัญชี?',
    createAccount:      'สร้างบัญชี',
    tapHere:            'แตะที่นี่',
    haveAccountTap:     'มีบัญชีอยู่แล้ว? แตะที่นี่',
    noAccountTap:       'ยังไม่มีบัญชี? แตะที่นี่',
  },
  search: {
    placeholder:  'ค้นหา...',
    all:          'ทั้งหมด',
    places:       '📍 สถานที่',
    tickets:      '🎟 ตั๋ว',
    services:     '⚙️ บริการ',
    searchAll:    'ค้นหาทุกอย่าง',
    searchAllSub: 'ค้นหาสถานที่ ตั๋ว และบริการ',
    noResults:    'ไม่พบผลลัพธ์',
    noResultsSub: 'ลองคำค้นหาอื่น',
  },
  home: {
    hello:              'สวัสดี, {name}',
    welcome:            'ยินดีต้อนรับ',
    tagline1:           'Your all-in-one',
    tagline2:           'app',
    searchPlaceholder:  'ค้นหาสถานที่ ตั๋ว บริการ…',
    ourServices:        'บริการของเรา',
    ninetyDayReport:    'รายงาน 90 วัน',
    placesAndTickets:   'สถานที่ & ตั๋ว',
    attractions:        'สถานที่ท่องเที่ยวและแลนด์มาร์ก',
    otherServices:      'บริการอื่นๆ',
    companyMore:        'บริษัท & เพิ่มเติม',
    embassyServices:    'หนังสือรับรองสถานทูต',
    embassyMore:        'หนังสือสนับสนุน & เพิ่มเติม',
    airportFastTrack:   'ด่านพิเศษสนามบิน',
    airportSubtitle:    'บริการพิเศษสนามบิน',
    busTickets:         'ตั๋วรถบัส',
    busSubtitle:        'เส้นทาง & ตารางเวลา',
    passport:           'หนังสือเดินทาง / CI',
    passportSubtitle:   'บริการเอกสาร',
    foodOrder:          'สั่งอาหาร',
    foodOrderSubtitle:  'จัดส่งอาหาร',
  },
  orders: {
    title:              'คำสั่งซื้อของฉัน',
    orderNum:           'คำสั่งซื้อ #{id}',
    submitted:          'ส่งแล้ว',
    ordered:            'สั่งแล้ว',
    summary:            'สรุป',
    service:            'บริการ',
    status:             'สถานะ',
    personalInfo:       'ข้อมูลส่วนตัว',
    documents:          'เอกสาร',
    awaitingConfirmation: '🔔 เราได้แจ้งผู้ดูแลระบบเกี่ยวกับคำสั่งซื้อของคุณแล้ว กรุณาเตรียมชำระเงินเมื่อได้รับการยืนยัน',
    viewDownloadResult: 'ดู / ดาวน์โหลดผลลัพธ์',
    couldNotLoad:       'ไม่สามารถโหลดคำสั่งซื้อได้',
    pullToRetry:        'ดึงลงเพื่อลองอีกครั้ง',
    eyebrow:            'กิจกรรมของฉัน',
    subtitle:           'คำขอบริการและตั๋วของคุณ',
    signInToView:       'เข้าสู่ระบบเพื่อดูคำสั่งซื้อ',
    signInTrack:        'ติดตามการส่งบริการและการจองตั๋วในที่เดียว',
    noServiceOrders:    'ยังไม่มีคำสั่งบริการ',
    noServiceSub:       'คำสั่งบริการจะปรากฏที่นี่เมื่อคุณสั่ง',
    noTicketOrders:     'ยังไม่มีคำสั่งตั๋ว',
    noTicketSub:        'การจองตั๋วจะปรากฏที่นี่',
    contactUs:          'ติดต่อเรา',
    items:              'รายการ',
  },
  tickets: {
    orderNum:           'คำสั่งซื้อตั๋ว #{id}',
    ordered:            'สั่งแล้ว',
    visitDate:          'วันที่เยี่ยมชม',
    items:              'รายการ',
    viewDownloadEticket: 'ดู / ดาวน์โหลด E-Ticket',
    couldNotLoad:       'ไม่สามารถโหลดคำสั่งซื้อได้',
    selectDate:         'เลือกวันที่',
    whenVisiting:       'คุณจะไปเยี่ยมชมวันไหน?',
    available7Days:     'พร้อมใช้งานใน 7 วันข้างหน้า',
    chooseDay:          'เลือกวัน',
    purchase:           'ซื้อ',
    total:              'รวม',
  },
  profile: {
    personalInfo:       'ข้อมูลส่วนตัว',
    language:           'ภาษา',
    activity:           'กิจกรรม',
    security:           'ความปลอดภัย',
    legal:              'กฎหมาย',
    myOrders:           'คำสั่งซื้อของฉัน',
    changePassword:     'เปลี่ยนรหัสผ่าน',
    privacyPolicy:      'นโยบายความเป็นส่วนตัว',
    termsConditions:    'ข้อกำหนดและเงื่อนไข',
    pdpa:               'พระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล',
    fullNamePlaceholder: 'ชื่อ-นามสกุล',
    dobPlaceholder:     'วันเกิด',
    currentPassword:    'รหัสผ่านปัจจุบัน',
    newPassword:        'รหัสผ่านใหม่',
    confirmNewPassword: 'ยืนยันรหัสผ่านใหม่',
    updatePassword:     'อัปเดตรหัสผ่าน',
    saveChanges:        'บันทึกการเปลี่ยนแปลง',
    customerSupport:    'บริการลูกค้า',
    contactFacebook:    'ติดต่อเราทาง Facebook',
    contactLine:        'ติดต่อเราทาง LINE',
    signOut:            'ออกจากระบบ',
    deleteAccount:      'ลบบัญชี',
    linkedAccounts:     'บัญชีที่เชื่อมต่อ',
    addEmail:           'เพิ่มอีเมลของคุณ',
    addEmailDesc:       'คุณเข้าสู่ระบบโดยไม่มีอีเมล เพิ่มอีเมลเพื่อรับการอัปเดต',
    becomeVerified:     'กลายเป็น Moi Verified',
    becomeMerchant:     'สมัครเป็นร้านค้า',
    merchantApproved:   'บัญชีร้านค้า',
    approvedBadge:      'อนุมัติแล้ว',
    manageMenu:             'จัดการเมนู',
    merchantDashboardHint:  'บัญชีของคุณได้รับการยืนยันเป็นร้านค้าแล้ว กรุณาเข้าสู่ระบบ Merchant Dashboard ด้วยข้อมูลเดียวกับบัญชีนี้',
    addThaiPhone:           'เพิ่มเบอร์โทรไทยสำหรับเข้าสู่ระบบด้วย OTP',
    alreadyConnected:   'เชื่อมต่อกับบัญชีนี้แล้ว',
    useGoogleLater:     'ใช้ Google เข้าสู่ระบบในภายหลัง',
    useAppleLater:      'ใช้ Apple เข้าสู่ระบบในภายหลัง',
    useLineLater:       'ใช้ LINE เข้าสู่ระบบในภายหลัง',
    english:            'English',
    burmese:            'မြန်မာ',
    thai:               'ภาษาไทย',
  },
  docs: {
    passportBioPage:    'หน้าชีวประวัติหนังสือเดินทาง',
    visaPage:           'หน้าวีซ่า',
    oldSlip:            'ใบแจ้ง 90 วันเดิม',
    identityCardFront:  'บัตรประชาชน (ด้านหน้า)',
    identityCardBack:   'บัตรประชาชน (ด้านหลัง)',
    tm30:               'เอกสาร TM30',
    upperBodyPhoto:     'รูปถ่ายครึ่งตัว',
    airplaneTicket:     'ตั๋วเครื่องบิน',
    passportSizePhoto:  'รูปถ่ายขนาดพาสปอร์ต',
  },
  map: {
    nearby:           '📍 ใกล้ฉัน',
    all:              '🌐 ทั้งหมด',
    getDirections:    '🗺 รับเส้นทาง',
    navigateOnMap:    '▶ นำทางบนแผนที่',
    filterByTags:     'กรองตามแท็ก',
    noTagsAvailable:  'ไม่มีแท็ก',
    searchPlaceholder: 'ค้นหาสถานที่ บริการ…',
    couldNotLoad:     'ไม่สามารถโหลดแผนที่ได้',
  },
  upload: {
    photoLibraryRequired: 'ต้องการสิทธิ์เข้าถึงคลังรูปภาพเพื่ออัปโหลดเอกสาร',
    fileTooLarge:         'ไม่สามารถอัปโหลดได้ ขนาดไฟล์รวมใหญ่เกินไป (สูงสุด 50 MB)',
    uploadFailed:         'อัปโหลดล้มเหลว กรุณาลองอีกครั้ง',
  },
  ninetyDay: {
    title:      'รายงาน 90 วัน',
    fullName:   'ชื่อ-นามสกุล',
    phone:      'หมายเลขโทรศัพท์',
    submit:     'ส่ง',
    submitting: 'กำลังส่ง…',
  },
  payment: {
    title:          'การชำระเงิน',
    amount:         'จำนวนเงิน',
    status:         'สถานะ',
    expires:        'หมดอายุ',
    markAsPaid:     'ทำเครื่องหมายว่าชำระแล้ว',
    confirming:     'กำลังยืนยัน…',
    promptpayQr:    'QR Code PromptPay',
    expired:        'หมดอายุแล้ว',
    regenerate:     'สร้าง QR ใหม่',
    generating:     'กำลังสร้าง…',
    contactUs:      'ติดต่อเรา',
  },
  tabs: {
    home:    'หน้าหลัก',
    map:     'แผนที่',
    orders:  'คำสั่งซื้อ',
    profile: 'โปรไฟล์',
  },
  shortcuts: {
    passportLabel: 'หนังสือเดินทาง',
    passportSub:   'หน้าชีวประวัติ & หน้าวีซ่า',
    ninetyLabel:   '90 วัน',
    ninetySub:     'ใบแจ้ง 90 วัน',
    myDocsLabel:   'เอกสาร',
    myDocsSub:     'ใบอนุญาต บัตรประชาชน & อื่นๆ',
  },
  verified: {
    title:            'กลายเป็น Moi Verified',
    subtitle:         'ปลดล็อกศักยภาพบัญชีของคุณ',
    youAreVerified:   'คุณเป็น Moi Verified แล้ว!',
    whyVerify:        'ทำไมต้องได้รับการยืนยัน?',
    prioritySupport:  'บริการลูกค้าแบบพิเศษ',
    verifiedBadge:    'แสดงตราสัญลักษณ์ Verified บนโปรไฟล์',
    fasterProcessing: 'ดำเนินการบริการได้รวดเร็วขึ้น',
    requirements:     'เงื่อนไข',
    channels:         'เชื่อมต่ออย่างน้อย 2 ช่องทางเข้าสู่ระบบ',
    payments:         'ชำระเงินสำเร็จอย่างน้อย 3 ครั้ง',
  },
  merchant: {
    title:              'สมัครเป็นร้านค้า',
    subtitle:           'เปิดร้านของคุณบน Moi Order',
    introTitle:         'เติบโตไปกับ Moi Order',
    introBody:          'สมัครเพื่อเปิดร้านอาหารหรือร้านค้าของคุณเองและเข้าถึงลูกค้าได้มากขึ้น',
    benefitReach:       'เข้าถึงลูกค้าได้มากขึ้นทั่วทั้งแอป',
    benefitDashboard:   'จัดการคำสั่งซื้อและเมนูจากแดชบอร์ดของคุณเอง',
    benefitPayouts:     'รับเงินเข้าบัญชีของคุณโดยตรง',
    applyButton:        'สมัครตอนนี้',
    draftTitle:         'เริ่มใบสมัครแล้ว',
    draftBody:          'เข้าไปที่ https://merchant.moiorder.com และเข้าสู่ระบบด้วยวิธีหรือข้อมูลเข้าสู่ระบบเดียวกับบัญชีนี้',
    downloadApp:        'ดาวน์โหลด Moi Merchant',
    cancelButton:       'ยกเลิกใบสมัคร',
    cancelConfirmTitle: 'ยกเลิกใบสมัครหรือไม่?',
    cancelConfirmBody:  'ใบสมัครฉบับร่างของคุณจะถูกลบ คุณสามารถสมัครใหม่ได้ภายหลัง',
    cancelConfirmYes:   'ใช่ ยกเลิก',
    cancelConfirmNo:    'ไม่ เก็บไว้',
    underReviewTitle:   'ใบสมัครอยู่ระหว่างการตรวจสอบ',
    underReviewBody:    'ทีมงานของเรากำลังตรวจสอบใบสมัครของคุณ เราจะแจ้งให้ทราบเมื่อมีผลการพิจารณา',
    approvedTitle:      'คุณเป็นร้านค้าแล้ว!',
    approvedBody:       'ใบสมัครของคุณได้รับการอนุมัติแล้ว เปิดแอป "Moi Merchant" แล้วเข้าสู่ระบบด้วยอีเมลและรหัสผ่านเดียวกันเพื่อจัดการร้านของคุณ',
    openAppButton:      'เปิด Moi Merchant',
    rejectedTitle:      'ใบสมัครไม่ได้รับการอนุมัติ',
    rejectedBody:       'ใบสมัครของคุณไม่ได้รับการอนุมัติในครั้งนี้ คุณสามารถดูหมายเหตุด้านล่างและสมัครใหม่ได้',
    reviewNotes:        'หมายเหตุจากผู้ตรวจสอบ',
    applyAgainButton:   'สมัครอีกครั้ง',
  },
  form: {
    personalInfo:      'ข้อมูลส่วนตัว',
    requiredDocuments: 'เอกสารที่ต้องการ',
    fullName:          'ชื่อ-นามสกุล',
    phoneNumber:       'หมายเลขโทรศัพท์',
  },
  services: {
    availableServices:  'บริการที่มี',
    selectType:         'เลือกประเภท',
    noServices:         'ไม่มีบริการในขณะนี้',
    unableToLoad:       'ไม่สามารถโหลดบริการได้ กรุณาลองอีกครั้ง',
    ninetyDayEyebrow:   'รายงาน 90 วัน',
    ninetyDayTitle:     'รายงาน 90 วัน',
    ninetyDaySubtitle:  'เลือกประเภทรายงานที่ตรงกับหมวดหมู่วีซ่าของคุณ',
    ninetyDaySubmitted: 'ส่งรายงาน 90 วันของคุณแล้ว\nเราจะดำเนินการและแจ้งให้ทราบ',
    companyEyebrow:     'ธุรกิจ & บริษัท',
    companyTitle:       'บริการบริษัท',
    companySubtitle:    'จดทะเบียนบริษัทและเอกสารธุรกิจ',
    otherEyebrow:       'การจดทะเบียน & อื่นๆ',
    otherTitle:         'บริการอื่นๆ',
    otherSubtitle:      'บริการตรวจคนเข้าเมืองและการจดทะเบียนเพิ่มเติม',
    backHome:           'หน้าหลัก',
    embassyEyebrow:     'บริการสถานทูต',
    embassyTitle:       'บริการสถานทูต',
    embassySubtitle:    'บริการหนังสือรับรองสถานทูตและเอกสาร',
    passportCiEyebrow:  'เอกสาร',
    passportCiTitle:    'หนังสือเดินทาง / CI',
    passportCiSubtitle: 'บริการหนังสือเดินทางและใบรับรองตัวตน',
  },
  notifs: {
    title:        'การแจ้งเตือน',
    markAllRead:  'ทำเครื่องหมายอ่านทั้งหมด',
    marking:      'กำลังทำเครื่องหมาย…',
    clearAll:     'ล้างทั้งหมด',
    noNotifs:     'ไม่มีการแจ้งเตือน',
    loading:      'กำลังโหลด…',
  },
  restaurant: {
    listTitle:               'ร้านอาหาร',
    couldNotLoad:            'ไม่สามารถโหลดร้านอาหารได้',
    closesAt:                'ปิดเวลา {time}',
    reopensAt:               'เปิดอีกครั้งเวลา {time}',
    statusOpen:              'เปิด',
    statusClosed:            'ปิด',
    statusPaused:            'หยุดชั่วคราว',
    popularPicks:            'เมนูยอดนิยม',
    promotions:              'โปรโมชัน',
    recommendations:         'แนะนำ',
    noItemsYet:              'ยังไม่มีเมนู',
    specialInstructions:     'คำแนะนำพิเศษ (ถ้ามี)',
    instructionsPlaceholder: 'เช่น ไม่ใส่พริก, เพิ่มซอส…',
    addToCart:               'เพิ่มในตะกร้า',
    customizable:            'ปรับแต่งได้',
    unavailable:             'สินค้าหมด',
    required:                'จำเป็น',
    optional:                'เพิ่มเติม',
    chooseOne:               'เลือก 1 อย่าง',
    chooseAtLeast:           'เลือกอย่างน้อย {n} อย่าง',
    chooseUpTo:              'เลือกได้สูงสุด {n} อย่าง',
    payViaLine:              'ชำระผ่าน LINE',
    chatWithRestaurant:      'แชทกับร้านอาหาร',
    contactNoLabel:          'เบอร์ติดต่อ',
    contactNoPlaceholder:    'หมายเลขโทรศัพท์ของคุณ',
    contactNoRequired:       'กรุณากรอกเบอร์ติดต่อ',
  },
  chat: {
    notice:          'แชทจะหายไปภายใน 3 ชั่วโมงหลังจากคำสั่งซื้อเสร็จสิ้น อย่าแชร์ข้อมูลส่วนตัว ผู้ดูแลกำลังตรวจสอบอยู่!',
    noMessages:      'ยังไม่มีข้อความ ทักทายกันก่อนเลย!',
    cannotLoad:      'โหลดข้อความไม่ได้',
    locked:          'แชทถูกปิดแล้ว ข้อความจะถูกลบหลังจาก 3 ชั่วโมงหลังคำสั่งซื้อเสร็จ',
    willClose:       'แชทจะปิดภายใน 3 ชั่วโมงหลังจากคำสั่งซื้อเสร็จสิ้น',
    typePlaceholder: 'พิมพ์ข้อความ…',
    addPhoto:        'แนบรูปภาพ',
    replyTo:         'ตอบกลับ',
    cancelReply:     'ยกเลิกการตอบกลับ',
    photo:           'รูปภาพ',
    reply:           'ตอบกลับ',
    copyText:        'คัดลอกข้อความ',
    deleteMessage:   'ลบข้อความ',
  },
};

// ─── Exports ─────────────────────────────────────────────────────────────────

export const STRINGS: Record<Locale, AppStrings> = { en, mm, th };

/** Hook — returns strings for the current locale. */
export function useStrings(): AppStrings {
  const locale = useLocaleStore((s) => s.locale);
  return STRINGS[locale];
}

/** Pure function — useful outside components (hooks, utils). */
export function getStrings(locale: Locale): AppStrings {
  return STRINGS[locale];
}

/** Translate a status code to the current locale's label. */
export function useStatusLabel(status: string): string {
  const s = useStrings();
  return (s.status as Record<string, string>)[status] ?? status;
}
