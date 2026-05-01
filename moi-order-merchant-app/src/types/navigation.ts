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
  Orders: undefined;
  Menu: undefined;
  Profile: undefined;
};

export type RootStackParamList = {
  Auth: undefined;
  Kyc: undefined;
  Merchant: undefined;
};
