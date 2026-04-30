export type Language = 'en' | 'my';

export interface Translations {
  // Common
  back: string;
  search: string;
  save: string;
  cancel: string;
  confirm: string;
  delete: string;
  edit: string;
  remove: string;
  share: string;
  loading: string;
  error: string;
  success: string;
  
  // Bottom Navigation
  nav: {
    home: string;
    orders: string;
    notifications: string;
    profile: string;
  };
  
  // Home Screen
  home: {
    greeting: string;
    searchPlaceholder: string;
    services: string;
    popularRestaurants: string;
    viewAll: string;
    featuredOffers: string;
    orderNow: string;
  };
  
  // Services
  services: {
    foodOrder: string;
    ninetyDaysReport: string;
    embassyLetter: string;
    places: string;
    news: string;
    otherServices: string;
    partnership: string;
    exchangeService: string;
  };
  
  // Restaurant
  restaurant: {
    menu: string;
    reviews: string;
    info: string;
    delivery: string;
    pickup: string;
    closed: string;
    rating: string;
    addToCart: string;
    customize: string;
  };
  
  // Cart
  cart: {
    title: string;
    empty: string;
    emptyMessage: string;
    browseCatalog: string;
    subtotal: string;
    deliveryFee: string;
    total: string;
    checkout: string;
    items: string;
    clearCart: string;
  };
  
  // Checkout
  checkout: {
    title: string;
    deliveryAddress: string;
    changeAddress: string;
    paymentMethod: string;
    changePayment: string;
    orderSummary: string;
    deliveryInstructions: string;
    placeOrder: string;
    contactless: string;
    leaveAtDoor: string;
  };
  
  // Orders
  orders: {
    title: string;
    trackOrder: string;
    orderPlaced: string;
    preparing: string;
    onTheWay: string;
    delivered: string;
    estimatedTime: string;
    orderDetails: string;
    reorder: string;
    help: string;
  };
  
  // Profile
  profile: {
    title: string;
    memberSince: string;
    orders: string;
    avgRating: string;
    totalSpent: string;
    orderHistory: string;
    favoriteRestaurants: string;
    savedAddresses: string;
    paymentMethods: string;
    reports: string;
    helpSupport: string;
    settings: string;
    bookmarks: string;
    logout: string;
  };
  
  // Settings
  settings: {
    title: string;
    accountInformation: string;
    fullName: string;
    email: string;
    phone: string;
    address: string;
    preferences: string;
    language: string;
    notifications: string;
    pushNotifications: string;
    emailNotifications: string;
    smsNotifications: string;
    security: string;
    changePassword: string;
    twoFactor: string;
    saveChanges: string;
  };
  
  // Notifications
  notifications: {
    title: string;
    markAllRead: string;
    today: string;
    yesterday: string;
    older: string;
    noNotifications: string;
    noNotificationsMessage: string;
  };
  
  // News
  news: {
    title: string;
    all: string;
    visa: string;
    community: string;
    events: string;
    jobs: string;
    business: string;
    trending: string;
    readMore: string;
    stayUpdated: string;
    subscribeMessage: string;
    subscribeNow: string;
    savedPosts: string;
    noSavedPosts: string;
    noSavedMessage: string;
    browseNews: string;
    aboutSaved: string;
    aboutSavedMessage: string;
  };
  
  // Places
  places: {
    title: string;
    searchPlaces: string;
    hospitals: string;
    embassies: string;
    temples: string;
    markets: string;
    schools: string;
    getDirections: string;
    call: string;
    openNow: string;
    closed: string;
  };
  
  // Reports
  reports: {
    title: string;
    ninetyDays: string;
    ninetyDaysDesc: string;
    embassy: string;
    embassyDesc: string;
    checkStatus: string;
    newRequest: string;
    pending: string;
    approved: string;
    rejected: string;
  };
  
  // Support
  support: {
    title: string;
    howCanWeHelp: string;
    searchPlaceholder: string;
    faq: string;
    contactUs: string;
    email: string;
    phone: string;
    chat: string;
    chatWithUs: string;
  };
  
  // Favorite Restaurants
  favorites: {
    title: string;
    noFavorites: string;
    noFavoritesMessage: string;
    explore: string;
    removeFromFavorites: string;
  };
  
  // Saved Addresses
  addresses: {
    title: string;
    addNew: string;
    noAddresses: string;
    noAddressesMessage: string;
    home: string;
    work: string;
    other: string;
    setDefault: string;
    default: string;
  };
  
  // Payment Methods
  payment: {
    title: string;
    addNew: string;
    noPayments: string;
    noPaymentsMessage: string;
    creditCard: string;
    cash: string;
    expiresOn: string;
    setDefault: string;
    default: string;
  };
  
  // Login
  login: {
    welcome: string;
    subtitle: string;
    phone: string;
    phonePlaceholder: string;
    password: string;
    passwordPlaceholder: string;
    forgotPassword: string;
    login: string;
    noAccount: string;
    signUp: string;
    or: string;
    continueGoogle: string;
    continueFacebook: string;
  };
  
  // Partnership
  partnership: {
    title: string;
    subtitle: string;
    restaurantPartner: string;
    restaurantDesc: string;
    deliveryPartner: string;
    deliveryDesc: string;
    applyNow: string;
    benefits: string;
  };
  
  // Exchange Service
  exchange: {
    title: string;
    fromCurrency: string;
    toCurrency: string;
    amount: string;
    exchangeRate: string;
    youWillReceive: string;
    convert: string;
  };
}

export const translations: Record<Language, Translations> = {
  en: {
    // Common
    back: 'Back',
    search: 'Search',
    save: 'Save',
    cancel: 'Cancel',
    confirm: 'Confirm',
    delete: 'Delete',
    edit: 'Edit',
    remove: 'Remove',
    share: 'Share',
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    
    // Bottom Navigation
    nav: {
      home: 'Home',
      orders: 'Orders',
      notifications: 'Notifications',
      profile: 'Profile',
    },
    
    // Home Screen
    home: {
      greeting: 'Hello, John!',
      searchPlaceholder: 'Search restaurants or dishes...',
      services: 'Our Services',
      popularRestaurants: 'Popular Restaurants',
      viewAll: 'View All',
      featuredOffers: 'Featured Offers',
      orderNow: 'Order Now',
    },
    
    // Services
    services: {
      foodOrder: 'Food Order',
      ninetyDaysReport: '90 Days Report',
      embassyLetter: 'Embassy Letter',
      places: 'Places',
      news: 'Work Permit & Pink Card',
      otherServices: 'News & Other Services',
      partnership: 'Partnership',
      exchangeService: 'Exchange Service',
    },
    
    // Restaurant
    restaurant: {
      menu: 'Menu',
      reviews: 'Reviews',
      info: 'Info',
      delivery: 'Delivery',
      pickup: 'Pickup',
      closed: 'Closed',
      rating: 'Rating',
      addToCart: 'Add to Cart',
      customize: 'Customize',
    },
    
    // Cart
    cart: {
      title: 'Your Cart',
      empty: 'Your cart is empty',
      emptyMessage: 'Add some delicious items from our restaurants to get started!',
      browseCatalog: 'Browse Catalog',
      subtotal: 'Subtotal',
      deliveryFee: 'Delivery Fee',
      total: 'Total',
      checkout: 'Checkout',
      items: 'items',
      clearCart: 'Clear Cart',
    },
    
    // Checkout
    checkout: {
      title: 'Checkout',
      deliveryAddress: 'Delivery Address',
      changeAddress: 'Change',
      paymentMethod: 'Payment Method',
      changePayment: 'Change',
      orderSummary: 'Order Summary',
      deliveryInstructions: 'Delivery Instructions (Optional)',
      placeOrder: 'Place Order',
      contactless: 'Contactless Delivery',
      leaveAtDoor: 'Leave at door',
    },
    
    // Orders
    orders: {
      title: 'Track Order',
      trackOrder: 'Track Your Order',
      orderPlaced: 'Order Placed',
      preparing: 'Preparing',
      onTheWay: 'On the Way',
      delivered: 'Delivered',
      estimatedTime: 'Estimated delivery',
      orderDetails: 'Order Details',
      reorder: 'Reorder',
      help: 'Help',
    },
    
    // Profile
    profile: {
      title: 'Profile',
      memberSince: 'Member since',
      orders: 'Orders',
      avgRating: 'Avg Rating',
      totalSpent: 'Total Spent',
      orderHistory: 'Order History',
      favoriteRestaurants: 'Favorite Restaurants',
      savedAddresses: 'Saved Addresses',
      paymentMethods: 'Payment Methods',
      reports: 'Reports',
      helpSupport: 'Help & Support',
      settings: 'Settings',
      bookmarks: 'Bookmarks',
      logout: 'Logout',
    },
    
    // Settings
    settings: {
      title: 'Settings',
      accountInformation: 'Account Information',
      fullName: 'Full Name',
      email: 'Email',
      phone: 'Phone',
      address: 'Address',
      preferences: 'Preferences',
      language: 'Language',
      notifications: 'Notifications',
      pushNotifications: 'Push Notifications',
      emailNotifications: 'Email Notifications',
      smsNotifications: 'SMS Notifications',
      security: 'Security',
      changePassword: 'Change Password',
      twoFactor: 'Two-Factor Authentication',
      saveChanges: 'Save Changes',
    },
    
    // Notifications
    notifications: {
      title: 'Notifications',
      markAllRead: 'Mark all as read',
      today: 'Today',
      yesterday: 'Yesterday',
      older: 'Older',
      noNotifications: 'No notifications yet',
      noNotificationsMessage: "You're all caught up! We'll notify you when something new arrives.",
    },
    
    // News
    news: {
      title: 'သတင်း အချက်အလက်',
      all: 'All',
      visa: 'Visa & Immigration',
      community: 'Community',
      events: 'Events',
      jobs: 'Jobs',
      business: 'Business',
      trending: 'Trending Now',
      readMore: 'Read More',
      stayUpdated: 'Stay Updated',
      subscribeMessage: 'Subscribe to our newsletter for the latest news and updates',
      subscribeNow: 'Subscribe Now',
      savedPosts: 'Saved Posts',
      noSavedPosts: 'No Saved Posts Yet',
      noSavedMessage: 'Start saving news articles you want to read later. Your saved posts will appear here.',
      browseNews: 'Browse News',
      aboutSaved: 'About Saved Posts',
      aboutSavedMessage: 'Your saved articles are stored locally and will be available until you clear them or log out.',
    },
    
    // Places
    places: {
      title: 'Places',
      searchPlaces: 'Search places...',
      hospitals: 'Hospitals',
      embassies: 'Embassies',
      temples: 'Temples',
      markets: 'Markets',
      schools: 'Schools',
      getDirections: 'Get Directions',
      call: 'Call',
      openNow: 'Open Now',
      closed: 'Closed',
    },
    
    // Reports
    reports: {
      title: 'Reports & Documents',
      ninetyDays: '90 Days Report',
      ninetyDaysDesc: 'Submit your 90-day stay report',
      embassy: 'Embassy Letter',
      embassyDesc: 'Request embassy documents',
      checkStatus: 'Check Status',
      newRequest: 'New Request',
      pending: 'Pending',
      approved: 'Approved',
      rejected: 'Rejected',
    },
    
    // Support
    support: {
      title: 'Help & Support',
      howCanWeHelp: 'How can we help you?',
      searchPlaceholder: 'Search for help...',
      faq: 'Frequently Asked Questions',
      contactUs: 'Contact Us',
      email: 'Email',
      phone: 'Phone',
      chat: 'Live Chat',
      chatWithUs: 'Chat with us',
    },
    
    // Favorite Restaurants
    favorites: {
      title: 'Favorite Restaurants',
      noFavorites: 'No Favorites Yet',
      noFavoritesMessage: 'Start adding your favorite restaurants to see them here.',
      explore: 'Explore Restaurants',
      removeFromFavorites: 'Remove from Favorites',
    },
    
    // Saved Addresses
    addresses: {
      title: 'Saved Addresses',
      addNew: 'Add New Address',
      noAddresses: 'No Saved Addresses',
      noAddressesMessage: 'Add your frequently used addresses for faster checkout.',
      home: 'Home',
      work: 'Work',
      other: 'Other',
      setDefault: 'Set as default',
      default: 'Default',
    },
    
    // Payment Methods
    payment: {
      title: 'Payment Methods',
      addNew: 'Add New Payment Method',
      noPayments: 'No Payment Methods',
      noPaymentsMessage: 'Add your payment methods for quick and secure checkout.',
      creditCard: 'Credit/Debit Card',
      cash: 'Cash on Delivery',
      expiresOn: 'Expires',
      setDefault: 'Set as default',
      default: 'Default',
    },
    
    // Login
    login: {
      welcome: 'Welcome to MoiOrder',
      subtitle: 'Your favorite food delivery service',
      phone: 'Phone Number',
      phonePlaceholder: 'Enter your phone number',
      password: 'Password',
      passwordPlaceholder: 'Enter your password',
      forgotPassword: 'Forgot Password?',
      login: 'Login',
      noAccount: "Don't have an account?",
      signUp: 'Sign Up',
      or: 'Or continue with',
      continueGoogle: 'Continue with Google',
      continueFacebook: 'Continue with Facebook',
    },
    
    // Partnership
    partnership: {
      title: 'Partner with MoiOrder',
      subtitle: 'Grow your business with us',
      restaurantPartner: 'Restaurant Partner',
      restaurantDesc: 'Join our platform and reach thousands of customers',
      deliveryPartner: 'Delivery Partner',
      deliveryDesc: 'Earn flexible income as a delivery rider',
      applyNow: 'Apply Now',
      benefits: 'Benefits',
    },
    
    // Exchange Service
    exchange: {
      title: 'Currency Exchange',
      fromCurrency: 'From',
      toCurrency: 'To',
      amount: 'Amount',
      exchangeRate: 'Exchange Rate',
      youWillReceive: 'You will receive',
      convert: 'Convert',
    },
  },
  
  my: {
    // Common
    back: 'နောက်သို့',
    search: 'ရှာဖွေရန်',
    save: 'သိမ်းဆည်းရန်',
    cancel: 'ပယ်ဖျက်ရန်',
    confirm: 'အတည်ပြုရန်',
    delete: 'ဖျက်ရန်',
    edit: 'ပြင်ဆင်ရန်',
    remove: 'ဖယ်ရှားရန်',
    share: 'မျှဝေရန်',
    loading: 'ခေတ္တစောင့်ပါ...',
    error: 'အမှား',
    success: 'အောင်မြင်ပါသည်',
    
    // Bottom Navigation
    nav: {
      home: 'ပင်မ',
      orders: 'မှာယူမှုများ',
      notifications: 'နိုတီ',
      profile: 'ပရိုဖိုင်',
    },
    
    // Home Screen
    home: {
      greeting: 'မင်္ဂလာပါ John!',
      searchPlaceholder: 'စားသောက်ဆိုင် သို့မဟုတ် အစားအစာများ ရှာဖွေပါ...',
      services: 'ကျွန်ုပ်တို့၏ ဝန်ဆောင်မှုများ',
      popularRestaurants: 'လူကြိုက်များသော စားသောက်ဆိုင်များ',
      viewAll: 'အားလုံးကြည့်ရန်',
      featuredOffers: 'အထူးကမ်းလှမ်းချက်များ',
      orderNow: 'ယခုမှာယူရန်',
    },
    
    // Services
    services: {
      foodOrder: 'အစားသောက် မှာယူရန်',
      ninetyDaysReport: 'ရက် ၉၀တုံး',
      embassyLetter: 'သံရုံးဆိုင်ရာ',
      places: 'အလည်ပတ် နေရာများ',
      news: 'ဝေါ့ပါမစ်နှင့် ပန်းရောင်ဘတ်',
      otherServices: 'သတင်းနှင့် ခြားဝန်ဆောင်မှုများ',
      partnership: 'လုပ်ငန်းခွဲခြင်း',
      exchangeService: 'ငွေလဲလှယ်ခြင်း',
    },
    
    // Restaurant
    restaurant: {
      menu: 'မီနူး',
      reviews: 'သုံးသပ်ချက်များ',
      info: 'အချက်အလက်',
      delivery: 'ပို့ဆောင်ခြင်း',
      pickup: 'ကိုယ်တိုင်လာယူခြင်း',
      closed: 'ပိတ်ထားသည်',
      rating: 'အဆင့်သတ်မှတ်ချက်',
      addToCart: 'တွန်းလှည်းထဲသို့ထည့်ရန်',
      customize: 'စိတ်ကြိုက်ပြင်ဆင်ရန်',
    },
    
    // Cart
    cart: {
      title: 'သင်၏တွန်းလှည်း',
      empty: 'သင်၏တွန်းလှည်း ဗလာဖြစ်နေသည်',
      emptyMessage: 'စတင်ရန် ကျွန်ုပ်တို့စားသောက်ဆိုင်များမှ အရသာရှိသော ပစ္စည်းများထည့်ပါ!',
      browseCatalog: 'ကတ်တလောက်ကြည့်ရှုရန်',
      subtotal: 'စုစုပေါင်း',
      deliveryFee: 'ပို့ဆောင်ခ',
      total: 'စုစုပေါင်းကျသင့်ငွေ',
      checkout: 'ငွေချေရန်',
      items: 'ပစ္စည်းများ',
      clearCart: 'တွန်းလှည်းရှင်းလင်းရန်',
    },
    
    // Checkout
    checkout: {
      title: 'ငွေချေရန်',
      deliveryAddress: 'ပို့ဆောင်ရမည့်လိပ်စာ',
      changeAddress: 'ပြောင်းရန်',
      paymentMethod: 'ငွေပေးချေမှုနည်းလမ်း',
      changePayment: 'ပြောင်းရန်',
      orderSummary: 'မှာယူမှု အကျဉ်းချုပ်',
      deliveryInstructions: 'ပို့ဆောင်ရေး ညွှန်ကြားချက်များ (ရွေးချယ်)',
      placeOrder: 'မှာယူမှုအတည်ပြုရန်',
      contactless: 'ထိတွေ့မှု မရှိ ပို့ဆောင်ခြင်း',
      leaveAtDoor: 'တံခါးဝတွင် ထားပေးပါ',
    },
    
    // Orders
    orders: {
      title: 'မှာယူမှု ခြေရာခံခြင်း',
      trackOrder: 'သင်၏မှာယူမှုကို ခြေရာခံပါ',
      orderPlaced: 'မှာယူမှုပြုလုပ်ပြီး',
      preparing: 'ပြင်ဆင်နေသည်',
      onTheWay: 'လမ်းတွင်ရှိသည်',
      delivered: 'ပို့ဆောင်ပြီး',
      estimatedTime: 'ခန့်မှန်းချိန်',
      orderDetails: 'မှာယူမှု အသေးစိတ်',
      reorder: 'ပြန်လည်မှာယူရန်',
      help: 'အကူအညီ',
    },
    
    // Profile
    profile: {
      title: 'ပရိုဖိုင်',
      memberSince: 'အကောာင့်ဝင်ရောက်သည့်နေ့',
      orders: 'မှာယူမှုများ',
      avgRating: 'ပျမ်းမျှအဆင့်',
      totalSpent: 'စုစုပေါင်းသုံးစွဲငွေ',
      orderHistory: 'မှာယူမှု မှတ်တမ်း',
      favoriteRestaurants: 'အကြိုက်ဆုံး စားသောက်ဆိုင်များ',
      savedAddresses: 'သိမ်းဆည်းထားသော လိပ်စာများ',
      paymentMethods: 'ငွေပေးချေမှု နည်းလမ်းများ',
      reports: 'အစီရင်ခံစာများ',
      helpSupport: 'အကူအညီနှင့် ပံ့ပိုးမှု',
      settings: 'ဆက်တင်များ',
      bookmarks: 'မှတ်သားမှုများ',
      logout: 'ထွက်ရန်',
    },
    
    // Settings
    settings: {
      title: 'ဆက်တင်များ',
      accountInformation: 'အကောင့် အချက်အလက်',
      fullName: 'အမည်အပြည့်အစုံ',
      email: 'အီးမေးလ်',
      phone: 'ဖုန်းနံပါတ်',
      address: 'လိပ်စာ',
      preferences: 'နှစ်သက်မှုများ',
      language: 'ဘာသာစကား',
      notifications: 'အကြောင်းကြားချက်များ',
      pushNotifications: 'Push အကြောင်းကြားချက်များ',
      emailNotifications: 'အီးမေးလ် အကြောင်းကြားချက်များ',
      smsNotifications: 'SMS အကြောင်းကြားချက်များ',
      security: 'လုံခြုံရေး',
      changePassword: 'စကားဝှက်ပြောင်းရန်',
      twoFactor: 'နှစ်ဆင့်စစ်ဆေးခြင်း',
      saveChanges: 'ပြောင်းလဲမှုများသိမ်းဆည်းရန်',
    },
    
    // Notifications
    notifications: {
      title: 'အကြောင်းကြားချက်များ',
      markAllRead: 'အားလုံးဖတ်ပြီးအဖြစ် မှတ်သားရန်',
      today: 'ယနေ့',
      yesterday: 'မနေ့က',
      older: 'ယခင်',
      noNotifications: 'အကြောင်းကြားချက်မရှိသေးပါ',
      noNotificationsMessage: 'သင် အားလုံးပြီးပါပြီ! အသစ်တစ်ခုခု ရောက်လာသောအခါ အကြောင်းကြားပေးပါမည်။',
    },
    
    // News
    news: {
      title: 'သတင်း အချက်အလက်',
      all: 'အားလုံး',
      visa: 'ဗီဇာနှင့် လူဝင်မှု',
      community: 'အသိုင်းအဝိုင်း',
      events: 'ပွဲများ',
      jobs: 'အလုပ်အကိုင်',
      business: 'စီးပွားရေး',
      trending: 'ယခုခေတ်စား',
      readMore: 'ပိုမိုဖတ်ရှုရန်',
      stayUpdated: 'အပ်ဒိတ်ရယူပါ',
      subscribeMessage: 'နောက်ဆုံးပေါ် သတင်းများနှင့် အပ်ဒိတ်များအတွက် ကျွန်ုပ်တို့၏ သတင်းလွှာကို စာရင်းသွင်းပါ',
      subscribeNow: 'ယခုစာရင်းသွင်းပါ',
      savedPosts: 'သိမ်းဆည်းထားသော ပို့စ်များ',
      noSavedPosts: 'သိမ်းဆည်းထားသော ပို့စ်မရှိသေးပါ',
      noSavedMessage: 'နောက်မှဖတ်ရှုလိုသော သတင်းဆောင်းပါးများကို သိမ်းဆည်းပါ။ သင့်သိမ်းဆည်းထားသော ပို့စ်များကို ဤနေရာတွင် ပေါ်လာပါမည်။',
      browseNews: 'သတင်းများကြည့်ရှုရန်',
      aboutSaved: 'သိမ်းဆည်းထားသော ပို့စ်များအကြောင်း',
      aboutSavedMessage: 'သင့်သိမ်းဆည်းထားသော ဆောင်းပါးများကို ဒေသတွင်း သိမ်းဆည်းထားပြီး ရှင်းလင်းခြင်း သို့မဟုတ် ထွက်ခြင်းမပြုမချင်း ရရှိနိုင်ပါမည်။',
    },
    
    // Places
    places: {
      title: 'နေရာများ',
      searchPlaces: 'နေရာများရှာဖွေပါ...',
      hospitals: 'ဆေးရုံများ',
      embassies: 'သံရုံးများ',
      temples: 'ဘုရားကျောင်းများ',
      markets: 'ဈေးများ',
      schools: 'ကျောင်းများ',
      getDirections: 'လမ်းညွှန်ရယူရန်',
      call: 'ဖုန်းခေါ်ဆိုရန်',
      openNow: 'ယခုဖွင့်နေသည်',
      closed: 'ပိတ်ထားသည်',
    },
    
    // Reports
    reports: {
      title: 'အစီရင်ခံစာများနှင့် စာရွက်စာတမ်းများ',
      ninetyDays: '၉၀ ရက် အစီရင်ခံစာ',
      ninetyDaysDesc: 'သင်၏ ၉၀ ရက် နေထိုင်မှု အစီရင်ခံစာ တင်သွင်းပါ',
      embassy: 'သံရုံးစာ',
      embassyDesc: 'သံရုံးစာရွက်စာတမ်းများ တောင်းဆိုပါ',
      checkStatus: 'အခြေအနေစစ်ဆေးရန်',
      newRequest: 'တောင်းဆိုချက်အသစ်',
      pending: 'ဆောင်ရွက်ဆဲ',
      approved: 'အတည်ပြုပြီး',
      rejected: 'ပယ်ချပြီး',
    },
    
    // Support
    support: {
      title: 'အကူအညီနှင့် ပံ့ပိုးမှု',
      howCanWeHelp: 'ကျွန်ုပ်တို့ သင့်ကို မည်သို့ကူညီနိုင်ပါသလဲ?',
      searchPlaceholder: 'အကူအညီရှာဖွေပါ...',
      faq: 'မကြာခဏမေးသော မေးခွန်းများ',
      contactUs: 'ကျွန်ုပ်တို့ကို ဆက်သွယ်ပါ',
      email: 'အီးမေးလ်',
      phone: 'ဖုန်း',
      chat: 'တိုက်ရိုက် ချတ်',
      chatWithUs: 'ကျွန်ုပ်တို့နှင့် ချတ်ပြောပါ',
    },
    
    // Favorite Restaurants
    favorites: {
      title: 'အကြိုက်ဆုံး စားသောက်ဆိုင်များ',
      noFavorites: 'အကြိုက်ဆုံးများ မရှိသေးပါ',
      noFavoritesMessage: 'သင့်အကြိုက်ဆုံး စားသောက်ဆိုင်များကို ထည့်သွင်းပါ။',
      explore: 'စားသောက်ဆိုင်များ ရှာဖွေရန်',
      removeFromFavorites: 'အကြိုက်ဆုံးများမှ ဖယ်ရှားရန်',
    },
    
    // Saved Addresses
    addresses: {
      title: 'သိမ်းဆည်းထားသော လိပ်စာများ',
      addNew: 'လိပ်စာအသစ် ထည့်ရန်',
      noAddresses: 'သိမ်းဆည်းထားသော လိပ်စာများ မရှိပါ',
      noAddressesMessage: 'မကြာခဏအသုံးပြုသော လိပ်စာများကို ထည့်ပြီး ပိုမိုမြန်ဆန်စွာ ငွေချေပါ။',
      home: 'အိမ်',
      work: 'ရုံး',
      other: 'အခြား',
      setDefault: 'ပုံသေအဖြစ် သတ်မှတ်ရန်',
      default: 'ပုံသေ',
    },
    
    // Payment Methods
    payment: {
      title: 'ငွေပေးချေမှု နည်းလမ်းများ',
      addNew: 'ငွေပေးချေမှု နည်းလမ်းအသစ် ထည့်ရန်',
      noPayments: 'ငွေပေးချေမှု နည်းလမ်းများ မရှိပါ',
      noPaymentsMessage: 'မြန်ဆန်ပြီး လုံခြုံသော ငွေချေခြင်းအတွက် ငွေပေးချေမှု နည်းလမ်းများ ထည့်ပါ။',
      creditCard: 'ခရက်ဒစ်/ဒက်ဘစ် ကတ်',
      cash: 'ငွေသားဖြင့် ပေးချေခြင်း',
      expiresOn: 'သက်တမ်းကုန်ဆုံးရက်',
      setDefault: 'ပုံသေအဖြစ် သတ်မှတ်ရန်',
      default: 'ပုံသေ',
    },
    
    // Login
    login: {
      welcome: 'MoiOrder မှ ကြိုဆိုပါသည်',
      subtitle: 'သင့်အကြိုက်ဆုံး အစားအစာ ပို့ဆောင်ရေး ဝန်ဆောင်မှု',
      phone: 'ဖုန်းနံပါတ်',
      phonePlaceholder: 'သင့်ဖုန်းနံပါတ်ကို ထည့်ပါ',
      password: 'စကားဝှက်',
      passwordPlaceholder: 'သင့်စကားဝှက်ကို ထည့်ပါ',
      forgotPassword: 'စကားဝှက်မေ့နေပါသလား?',
      login: 'ဝင်ရောက်ရန်',
      noAccount: 'အကောင့်မရှိသေးပါသလား?',
      signUp: 'အကောင့်ဖွင့်ရန်',
      or: 'သို့မဟုတ် ဆက်လက်ရန်',
      continueGoogle: 'Google ဖြင့် ဆက်လက်ရန်',
      continueFacebook: 'Facebook ဖြင့် ဆက်လက်ရန်',
    },
    
    // Partnership
    partnership: {
      title: 'MoiOrder နှင့် လုပ်ဖော်ကိုင်ဖက်ပြုပါ',
      subtitle: 'ကျွန်ုပ်တို့နှင့်အတူ သင့်လုပ်ငန်းကို တိုးချဲ့ပါ',
      restaurantPartner: 'စားသောက်ဆိုင် လုပ်ဖော်ကိုင်ဖက်',
      restaurantDesc: 'ကျွန်ုပ်တို့ပလက်ဖောင်းတွင် ပါဝင်ပြီး ထောင်ပေါင်းများစွာသော ဖောက်သည်များကို ရောက်ရှိပါ',
      deliveryPartner: 'ပို့ဆောင်ရေး လုပ်ဖော်ကိုင်ဖက်',
      deliveryDesc: 'ပို့ဆောင်ရေးမောင်းနှင်သူအဖြစ် ပြောင်းလွယ်ပြင်လွယ် ဝင်ငွေရယူပါ',
      applyNow: 'ယခုလျှောက်ထားပါ',
      benefits: 'အကျိုးကျေးဇူးများ',
    },
    
    // Exchange Service
    exchange: {
      title: 'ငွေကြေးလဲလှယ်ခြင်း',
      fromCurrency: 'မှ',
      toCurrency: 'သို့',
      amount: 'ပမာဏ',
      exchangeRate: 'လဲလှယ်နှုန်း',
      youWillReceive: 'သင်ရရိမည်',
      convert: 'ပြောင်းလဲရန်',
    },
  },
};

export function useTranslation(language: Language) {
  return translations[language];
}