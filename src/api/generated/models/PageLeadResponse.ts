/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { LeadResponse } from './LeadResponse';
import type { PageableObject } from './PageableObject';
import type { SortObject } from './SortObject';
export type PageLeadResponse = {
    totalElements?: number;
    totalPages?: number;
    first?: boolean;
    last?: boolean;
    numberOfElements?: number;
    size?: number;
    content?: Array<LeadResponse>;
    number?: number;
    sort?: SortObject;
    pageable?: PageableObject;
    empty?: boolean;
};

