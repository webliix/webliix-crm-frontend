import { http } from "@/shared/services/http";

export interface UserItem {
  id: number;
  firstName: string;
  lastName?: string;
  email: string;
  phone?: string;
  jobTitle?: string;
  department?: string;
  bio?: string;
  enabled: boolean;
  emailVerified: boolean;
  roles: string[];
  permissions?: string[];
  createdAt?: string;
}

export interface CreateUserPayload {
  firstName: string;
  lastName?: string;
  email: string;
  password: string;
  phone?: string;
  jobTitle?: string;
  department?: string;
  role: string;
}

export interface UpdateUserPayload {
  firstName?: string;
  lastName?: string;
  phone?: string;
  jobTitle?: string;
  department?: string;
  bio?: string;
  role?: string;
  enabled?: boolean;
  emailVerified?: boolean;
}

export const userApi = {
  getAllUsers(search = "", page = 0, size = 20) {
    return http.get("/api/v1/users", { params: { search, page, size } });
  },

  getUserById(id: number) {
    return http.get(`/api/v1/users/${id}`);
  },

  createUser(data: CreateUserPayload) {
    return http.post("/api/v1/users", data);
  },

  updateUser(id: number, data: UpdateUserPayload) {
    return http.put(`/api/v1/users/${id}`, data);
  },

  deleteUser(id: number) {
    return http.delete(`/api/v1/users/${id}`);
  },
};
