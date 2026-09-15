export function mapLeadPage(response: any) {
  return {
    rows: response?.data?.content ?? [],
    total: response?.data?.totalElements ?? 0,
    pages: response?.data?.totalPages ?? 0,
  };
}
