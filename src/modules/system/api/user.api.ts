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

export interface RolePermissionAssignment {
  code?: string;
  permissionCode?: string;
  scope: "OWN" | "DEPARTMENT" | "ALL";
}

export interface PermissionItem {
  id: number;
  code: string;
  module: string;
  action: string;
  description: string;
}

export interface RoleItem {
  id: number;
  name: string;
  displayName: string;
  description?: string;
  isSystem: boolean;
  isSuperAdmin: boolean;
  active: boolean;
  permissions: RolePermissionAssignment[];
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

  // Role & Permission Management (Super Admin / Admin)
  getRoles() {
    return http.get("/api/v1/admin/roles");
  },

  getRoleById(id: number) {
    return http.get(`/api/v1/admin/roles/${id}`);
  },

  getPermissionsCatalog() {
    return http.get("/api/v1/admin/permissions");
  },

  createRole(data: { name: string; displayName: string; description?: string }) {
    return http.post("/api/v1/admin/roles", data);
  },

  updateRole(id: number, data: { displayName?: string; description?: string; active?: boolean }) {
    return http.put(`/api/v1/admin/roles/${id}`, data);
  },

  updateRolePermissions(id: number, permissions: RolePermissionAssignment[]) {
    return http.put(`/api/v1/admin/roles/${id}/permissions`, permissions);
  },

  deleteRole(id: number) {
    return http.delete(`/api/v1/admin/roles/${id}`);
  },

  updateUserRoles(userId: number, roleIds: number[]) {
    return http.put(`/api/v1/admin/users/${userId}/roles`, { roleIds });
  },
};
