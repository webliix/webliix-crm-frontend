/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CustomerResponse } from './CustomerResponse';
import type { PageableObject } from './PageableObject';
import type { SortObject } from './SortObject';
export type PageCustomerResponse = {
    totalElements?: number;
    totalPages?: number;
    first?: boolean;
    last?: boolean;
    numberOfElements?: number;
    size?: number;
    content?: Array<CustomerResponse>;
    number?: number;
    sort?: SortObject;
    pageable?: PageableObject;
    empty?: boolean;
};

