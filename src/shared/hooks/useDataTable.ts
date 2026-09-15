import { useState } from "react";

export function useDataTable(initialPage = 0, initialSize = 20, initialSearch = "") {
  const [page, setPage] = useState<number>(initialPage);
  const [size, setSize] = useState<number>(initialSize);
  const [search, setSearch] = useState<string>(initialSearch);

  return {
    page,
    size,
    search,
    setPage,
    setSize,
    setSearch,
  };
}
