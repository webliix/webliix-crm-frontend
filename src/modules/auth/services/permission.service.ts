export const permissionService = {
  hasPermission(permissions: string[], permission: string) {
    return permissions.includes(permission);
  },
};
