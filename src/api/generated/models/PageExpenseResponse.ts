/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ExpenseResponse } from './ExpenseResponse';
import type { PageableObject } from './PageableObject';
import type { SortObject } from './SortObject';
export type PageExpenseResponse = {
    totalElements?: number;
    totalPages?: number;
    first?: boolean;
    last?: boolean;
    numberOfElements?: number;
    size?: number;
    content?: Array<ExpenseResponse>;
    number?: number;
    sort?: SortObject;
    pageable?: PageableObject;
    empty?: boolean;
};

