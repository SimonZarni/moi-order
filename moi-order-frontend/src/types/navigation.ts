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

  // ── Existing public screens ─────────────────────────────────────────────
  Places: undefined;
  PlaceDetail: { placeId: number };
};
