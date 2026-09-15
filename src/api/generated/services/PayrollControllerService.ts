/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApiResponsePagePayrollResponse } from '../models/ApiResponsePagePayrollResponse';
import type { ApiResponsePayrollDashboardResponse } from '../models/ApiResponsePayrollDashboardResponse';
import type { ApiResponsePayrollResponse } from '../models/ApiResponsePayrollResponse';
import type { PayrollRequest } from '../models/PayrollRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class PayrollControllerService {
    /**
     * @param requestBody
     * @returns ApiResponsePayrollResponse OK
     * @throws ApiError
     */
    public static generatePayroll(
        requestBody: PayrollRequest,
    ): CancelablePromise<ApiResponsePayrollResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/payrolls/generate',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param page
     * @param size
     * @returns ApiResponsePagePayrollResponse OK
     * @throws ApiError
     */
    public static getPayrolls(
        page?: number,
        size: number = 20,
    ): CancelablePromise<ApiResponsePagePayrollResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/payrolls',
            query: {
                'page': page,
                'size': size,
            },
        });
    }
    /**
     * @param id
     * @returns ApiResponsePayrollResponse OK
     * @throws ApiError
     */
    public static getPayroll(
        id: number,
    ): CancelablePromise<ApiResponsePayrollResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/payrolls/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @param employeeId
     * @param page
     * @param size
     * @returns ApiResponsePagePayrollResponse OK
     * @throws ApiError
     */
    public static getPayrollsForEmployee(
        employeeId: number,
        page?: number,
        size: number = 20,
    ): CancelablePromise<ApiResponsePagePayrollResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/payrolls/employee/{employeeId}',
            path: {
                'employeeId': employeeId,
            },
            query: {
                'page': page,
                'size': size,
            },
        });
    }
    /**
     * @returns ApiResponsePayrollDashboardResponse OK
     * @throws ApiError
     */
    public static getDashboard2(): CancelablePromise<ApiResponsePayrollDashboardResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/payrolls/dashboard',
        });
    }
}
