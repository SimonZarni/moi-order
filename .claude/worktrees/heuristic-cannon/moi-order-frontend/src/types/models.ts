// More interfaces added here as features are built

export interface ApiResponse<T> {
  data: T;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
  };
}

export interface ApiError {
  message: string;
  code: string;
  errors?: Record<string, string[]>;
  status: number;
}

export interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  created_at: string;
}
