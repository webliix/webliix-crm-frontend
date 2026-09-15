export const leadQueryKeys = {
  all: ["leads"],
  list: (page: number, size: number, keyword?: string) => ["leads", page, size, keyword],
  detail: (id: number) => ["lead", id],
};
