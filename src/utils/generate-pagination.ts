/*
 * generate-pagination.ts
 * Copyright: Ouranos Studio 2019. All rights reserved.
 */

import { Pagination } from '@Types/common'


export function createPagination(page: number, size: number, count: number, items: {id: any}[] = []): Pagination {
  return {
    page,
    size,
    totalCount: count,
    totalPages: Math.ceil(count / size),
    hasNext: count > 0 && page !== Math.ceil(count / size),
    lastId: items.length > 0 ? items[items.length - 1].id : undefined,
  }
}
