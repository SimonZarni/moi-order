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
};

export type MerchantStackParamList = {
  Tabs: undefined;
  OrderDetail: { orderId: number };
  OrderChat: { orderId: number };
};

export type RootStackParamList = {
  Auth: undefined;
  Kyc: undefined;
  Merchant: undefined;
};

export type WebScreen = 'Dashboard' | 'Orders' | 'Menu' | 'Restaurant' | 'Analytics';
