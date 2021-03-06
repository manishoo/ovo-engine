import { Pagination } from "@Types/common"

export function createPagination(page: number, size: number, count: number): Pagination {

  return {
    page: page,
    size: size,
    totalCount: count,
    totalPages: Math.ceil(count / size),
    hasNext: page !== Math.ceil(count / size)
  }
}