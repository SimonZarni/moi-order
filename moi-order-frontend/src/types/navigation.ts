export type RootStackParamList = {
  // ── Auth flow (unauthenticated) ─────────────────────────────────────────
  Login: undefined;
  Register: undefined;

  // ── Main app (authenticated) ────────────────────────────────────────────
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
