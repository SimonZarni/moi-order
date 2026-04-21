import { NavigatorScreenParams } from '@react-navigation/native';

// Tab navigator screens — persistent, pre-rendered, instant switching.
export type TabParamList = {
  Home: undefined;
  Places: undefined;
  Orders: undefined;
  Profile: undefined;
};

export type RootStackParamList = {
  // ── Tab container (always the initial screen) ───────────────────────────
  MainTabs: NavigatorScreenParams<TabParamList> | undefined;

  // ── Auth flow (unauthenticated) ─────────────────────────────────────────
  Login: undefined;
  Register: undefined;

  // ── Tab routes kept here for TypeScript compat with coordinator hooks ───
  // At runtime these are handled by the tab navigator, not the root stack.
  Home: undefined;
  Orders: undefined;
  OrderDetail: { submissionId: number };
  NinetyDayReport: undefined;
  NinetyDayReportForm: {
    serviceTypeId: number;
    serviceTypeName: string;
    serviceTypeNameEn: string;
    price: number;
  };
  OtherServices: undefined;
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
    | { kind: 'submission'; submissionId: number }
    | { kind: 'ticket_order'; ticketOrderId: number };

  // ── Tickets ──────────────────────────────────────────────────────────────
  Tickets: undefined;
  TicketDetail: { ticketId: number };
  TicketDateSelection: {
    ticketId: number;
    /** JSON-encoded Record<variantId, quantity> */
    selectionsJson: string;
  };
  TicketOrderDetail: { ticketOrderId: number };

  // ── Existing public screens ─────────────────────────────────────────────
  Places: undefined;
  PlaceDetail: { placeId: number };

  // ── Profile ──────────────────────────────────────────────────────────────
  Profile: undefined;

  // ── Legal ─────────────────────────────────────────────────────────────────
  PrivacyPolicy: undefined;
  TermsAndConditions: undefined;
  PdpaNotice: undefined;
};
