export interface IPagination {
  results: any[];
  metaData: {
    currentPage: number;
    firstPage: number;
    lastPage: number;
    nextPage: number;
    pageSize: number;
    previousPage: number;
    totalRecords: number;
    totalPages: number;
  };
}
