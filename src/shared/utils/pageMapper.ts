export function mapPage<T>(pageResponse: any) {
  return {
    rows: pageResponse?.content ?? [],
    total: pageResponse?.totalElements ?? 0,
    pages: pageResponse?.totalPages ?? 0,
  } as { rows: T[]; total: number; pages: number };
}
