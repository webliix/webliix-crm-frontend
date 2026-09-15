export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken?: string;
}

export interface CurrentUser {
  id: string | number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  enabled?: boolean;
  roles: string[];
  permissions?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface UpdateProfilePayload {
  firstName: string;
  lastName: string;
  phone?: string;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}
