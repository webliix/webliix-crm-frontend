/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PageableObject } from './PageableObject';
import type { ProjectResponse } from './ProjectResponse';
import type { SortObject } from './SortObject';
export type PageProjectResponse = {
    totalElements?: number;
    totalPages?: number;
    first?: boolean;
    last?: boolean;
    numberOfElements?: number;
    size?: number;
    content?: Array<ProjectResponse>;
    number?: number;
    sort?: SortObject;
    pageable?: PageableObject;
    empty?: boolean;
};

