/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { LeaveResponse } from './LeaveResponse';
import type { PageableObject } from './PageableObject';
import type { SortObject } from './SortObject';
export type PageLeaveResponse = {
    totalElements?: number;
    totalPages?: number;
    first?: boolean;
    last?: boolean;
    numberOfElements?: number;
    size?: number;
    content?: Array<LeaveResponse>;
    number?: number;
    sort?: SortObject;
    pageable?: PageableObject;
    empty?: boolean;
};

