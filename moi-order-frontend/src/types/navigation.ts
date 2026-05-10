import { NavigatorScreenParams } from '@react-navigation/native';

// Tab navigator screens — persistent, pre-rendered, instant switching.
export type TabParamList = {
  Home: undefined;
  Map: undefined;
  Orders: { tab?: 'services' | 'tickets' } | undefined;
  Profile: undefined;
};

export type RootStackParamList = {
  // ── Tab container (always the initial screen) ───────────────────────────
  MainTabs: NavigatorScreenParams<TabParamList> | undefined;

  // ── Auth flow (unauthenticated) ─────────────────────────────────────────
  Login: undefined;
  Register: undefined;
  EmailRegister: undefined;
  ForgotPassword: { prefillEmail?: string } | undefined;
  EmailOtp: {
    email: string;
    purpose: 'registration' | 'password_reset';
    name?: string;
  };
  SetPassword: {
    email: string;
    verifiedToken: string;
    purpose: 'registration' | 'password_reset';
    name?: string;
  };
  // ── Tab routes kept here for TypeScript compat with coordinator hooks ───
  // At runtime these are handled by the tab navigator, not the root stack.
  Home: undefined;
  Orders: undefined;
  OrderDetail: { submissionId: string };
  NinetyDayReport: undefined;
  NinetyDayReportForm: {
    serviceTypeId: number;
    serviceTypeName: string;
    serviceTypeNameEn: string;
    price: number;
  };
  OtherServices: undefined;
  EmbassyServices: undefined;
  CompanyServices: undefined;
  PassportCiServices: undefined;
  CompanyRegistrationForm: {
    serviceTypeId: number;
    price: number;
  };
  AirportFastTrackForm: {
    serviceTypeId: number;
    price: number;
  };
  EmbassyResidentialForm: {
    serviceTypeId: number;
    price: number;
  };
  EmbassyCarLicenseForm: {
    serviceTypeId: number;
    price: number;
  };
  EmbassyBankForm: {
    serviceTypeId: number;
    price: number;
  };
  EmbassyVisaRecommendationForm: {
    serviceTypeId: number;
    price: number;
  };
  TestServiceForm: {
    serviceTypeId: number;
    price: number;
  };
  GenericServiceForm: {
    serviceTypeId: number;
    serviceId: number;
    serviceName: string;
    price: number;
  };

  // ── Payment ──────────────────────────────────────────────────────────────
  Payment:
    | { kind: 'submission'; submissionId: string }
    | { kind: 'ticket_order'; ticketOrderId: string };

  // ── Tickets ──────────────────────────────────────────────────────────────
  Tickets: undefined;
  TicketDetail: { ticketId: number };
  TicketDateSelection: {
    ticketId: number;
    /** JSON-encoded Record<variantId, quantity> */
    selectionsJson: string;
  };
  TicketOrderDetail: { ticketOrderId: string };

  // ── Existing public screens ─────────────────────────────────────────────
  Places: undefined;
  PlaceDetail: { placeId: number };

  // ── Global search ─────────────────────────────────────────────────────────
  Search: undefined;

  // ── Profile ──────────────────────────────────────────────────────────────
  Profile: undefined;

  // ── Notifications ────────────────────────────────────────────────────────
  Notifications: undefined;

  // ── Legal ─────────────────────────────────────────────────────────────────
  PrivacyPolicy: undefined;
  TermsAndConditions: undefined;
  PdpaNotice: undefined;

  // ── Document vault (OCR) ──────────────────────────────────────────────────
  PassportVault: undefined;
  NinetyDayVault: undefined;
  MyDocuments: undefined;

  // ── Profile extras ────────────────────────────────────────────────────────
  MoiVerified: undefined;
  UpdatePhone: undefined;
  UpdateEmail: undefined;

  // ── Emergency Contacts ────────────────────────────────────────────────────
  EmergencyContactList:   { type: import('./enums').EmergencyContactType };
  EmergencyContactDetail: { contactId: number };

  // ── Food ordering ─────────────────────────────────────────────────────────
  Food: undefined;
  RestaurantDetail: { restaurantId: number };
  RestaurantMap: undefined;
  CartOrders: undefined;
  Checkout: undefined;
  FoodOrderDetail: { orderId: string };
  OrderChat: { orderId: string; orderNumber: string | null; restaurantName: string | null };
};
