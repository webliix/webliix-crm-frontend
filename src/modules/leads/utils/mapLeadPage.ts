export function mapLeadPage(response: any) {
  if (!response) return { rows: [], total: 0, pages: 0 };
  const content =
    response?.data?.data?.content ||
    response?.data?.content ||
    response?.content ||
    response?.data?.data ||
    response?.data ||
    (Array.isArray(response) ? response : []);

  const total =
    response?.data?.data?.totalElements ??
    response?.data?.totalElements ??
    response?.totalElements ??
    (Array.isArray(content) ? content.length : 0);

  const pages =
    response?.data?.data?.totalPages ??
    response?.data?.totalPages ??
    response?.totalPages ??
    (total > 0 ? 1 : 0);

  return {
    rows: Array.isArray(content) ? content : [],
    total,
    pages,
  };
}
