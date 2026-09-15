/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AuditDashboardResponse } from '../models/AuditDashboardResponse';
import type { AuditSearchRequest } from '../models/AuditSearchRequest';
import type { PageAuditLogResponse } from '../models/PageAuditLogResponse';
import type { UserActivityResponse } from '../models/UserActivityResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AuditControllerService {
    /**
     * @param id
     * @returns UserActivityResponse OK
     * @throws ApiError
     */
    public static getUserActivity(
        id: number,
    ): CancelablePromise<Array<UserActivityResponse>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/users/{id}/activity',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @param searchRequest
     * @returns PageAuditLogResponse OK
     * @throws ApiError
     */
    public static searchAudit(
        searchRequest: AuditSearchRequest,
    ): CancelablePromise<PageAuditLogResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/audit',
            query: {
                'searchRequest': searchRequest,
            },
        });
    }
    /**
     * @returns AuditDashboardResponse OK
     * @throws ApiError
     */
    public static getDashboard5(): CancelablePromise<AuditDashboardResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/audit/dashboard',
        });
    }
}
