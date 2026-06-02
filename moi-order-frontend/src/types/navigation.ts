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
  OtherServices: undefined;
  EmbassyServices: undefined;
  CompanyServices: undefined;
  PassportCiServices: undefined;
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
    /** JSON-encoded SelectionItem[] — see features/tickets/types.ts */
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
  AppVersion: undefined;

  // ── Emergency Contacts ────────────────────────────────────────────────────
  EmergencyContactList:   { type: import('./enums').EmergencyContactType };
  EmergencyContactDetail: { contactId: number };

  // ── System
  Maintenance: { message: string; details: string; retryAfter?: number };

  // ── Food ordering ─────────────────────────────────────────────────────────
  Food: undefined;
  RestaurantDetail: { restaurantId: number };
  MenuItemDetail: { restaurantId: number; menuItemId: number };
  RestaurantMap: undefined;
  Cart: undefined;
  FoodOrders: undefined;
  Checkout: { selectedAddressId?: number } | undefined;
  FoodOrderDetail: { orderId: string };
  OrderChat: { orderId: string; orderNumber: string | null; restaurantName: string | null };

  // ── Address management ────────────────────────────────────────────────────
  AddressList: { mode: 'select' | 'manage' };
  AddEditAddress: {
    addressId?: number;
    pickedLat?: number;
    pickedLng?: number;
    pickedAddress?: string;
  };
  MapPicker: { initialLat?: number; initialLng?: number; initialAddress?: string };
};
