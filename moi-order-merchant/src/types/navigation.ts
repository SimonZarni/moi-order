export type AuthStackParamList = {
  Login: undefined;
  OtpLogin: { phoneNumber?: string };
  Register: undefined;
};

export type KycStackParamList = {
  KycWizard: undefined;
  KycPending: undefined;
};

export type MerchantTabParamList = {
  Dashboard: undefined;
  Orders: undefined;
  Menu: undefined;
  Restaurant: undefined;
  Notifications: undefined;
  Profile: undefined;
};

export type MerchantStackParamList = {
  Tabs: undefined;
  OrderDetail: { orderId: string };
  OrderChat: { orderId: string; orderNumber?: string; completedAt: string | null; orderStatus: string };
  BusinessProfile: undefined;
  Reviews: undefined;
  CancelledOrders: undefined;
  Settings: undefined;
  ChangePassword: undefined;
  OperatingHours: undefined;
  EditMenuItem: { itemId: number };
};

export type RootStackParamList = {
  Auth: undefined;
  Kyc: undefined;
  Merchant: undefined;
};

export type WebScreen =
  | 'Dashboard'
  | 'Orders'
  | 'Menu'
  | 'Restaurant'
  | 'Analytics'
  | 'Notifications'
  | 'BusinessProfile'
  | 'Reviews'
  | 'CancelledOrders'
  | 'Settings';
