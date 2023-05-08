import { IPagination } from '../interfaces/pagination.interface';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PaginationService {
  constructor() {
    // empty
  }

  public pagination(
    data: any[] = [],
    total: number = 0,
    currentPage: number = 0,
    limit: number = 10,
  ): IPagination {
    const totalPages = Math.ceil(total / limit);
    const nextPage = currentPage + 1;
    const previousPage = currentPage - 1;
    return {
      results: data,
      metaData: {
        currentPage,
        firstPage: total ? 1 : 0,
        lastPage: totalPages,
        nextPage: nextPage > totalPages ? currentPage : nextPage,
        pageSize: limit,
        previousPage: previousPage < 1 ? currentPage : previousPage,
        totalRecords: total,
        totalPages: totalPages,
      },
    };
  }
}
