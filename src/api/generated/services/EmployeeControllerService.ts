/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApiResponseEmployeeResponse } from '../models/ApiResponseEmployeeResponse';
import type { ApiResponseEmployeeStatisticsResponse } from '../models/ApiResponseEmployeeStatisticsResponse';
import type { ApiResponsePageEmployeeResponse } from '../models/ApiResponsePageEmployeeResponse';
import type { ApiResponseVoid } from '../models/ApiResponseVoid';
import type { EmployeeRequest } from '../models/EmployeeRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class EmployeeControllerService {
    /**
     * @param id
     * @returns ApiResponseEmployeeResponse OK
     * @throws ApiError
     */
    public static getEmployee(
        id: number,
    ): CancelablePromise<ApiResponseEmployeeResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/employees/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @param id
     * @param requestBody
     * @returns ApiResponseEmployeeResponse OK
     * @throws ApiError
     */
    public static updateEmployee(
        id: number,
        requestBody: EmployeeRequest,
    ): CancelablePromise<ApiResponseEmployeeResponse> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/employees/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param id
     * @returns ApiResponseVoid OK
     * @throws ApiError
     */
    public static deleteEmployee(
        id: number,
    ): CancelablePromise<ApiResponseVoid> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/employees/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @param page
     * @param size
     * @returns ApiResponsePageEmployeeResponse OK
     * @throws ApiError
     */
    public static getEmployees(
        page?: number,
        size: number = 20,
    ): CancelablePromise<ApiResponsePageEmployeeResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/employees',
            query: {
                'page': page,
                'size': size,
            },
        });
    }
    /**
     * @param requestBody
     * @returns ApiResponseEmployeeResponse OK
     * @throws ApiError
     */
    public static createEmployee(
        requestBody: EmployeeRequest,
    ): CancelablePromise<ApiResponseEmployeeResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/employees',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @returns ApiResponseEmployeeStatisticsResponse OK
     * @throws ApiError
     */
    public static getStatistics(): CancelablePromise<ApiResponseEmployeeStatisticsResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/employees/statistics',
        });
    }
}
