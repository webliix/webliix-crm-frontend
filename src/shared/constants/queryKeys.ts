export const queryKeys = {
  auth: {
    me: ["auth", "me"],
  },

  leads: {
    list: ["leads"],
    detail: (id: string) => ["lead", id],
  },
};
