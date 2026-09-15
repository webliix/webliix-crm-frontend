/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApiResponseDepartmentResponse } from '../models/ApiResponseDepartmentResponse';
import type { ApiResponsePageDepartmentResponse } from '../models/ApiResponsePageDepartmentResponse';
import type { ApiResponseVoid } from '../models/ApiResponseVoid';
import type { DepartmentRequest } from '../models/DepartmentRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class DepartmentControllerService {
    /**
     * @param id
     * @param requestBody
     * @returns ApiResponseDepartmentResponse OK
     * @throws ApiError
     */
    public static updateDepartment(
        id: number,
        requestBody: DepartmentRequest,
    ): CancelablePromise<ApiResponseDepartmentResponse> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/departments/{id}',
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
    public static deleteDepartment(
        id: number,
    ): CancelablePromise<ApiResponseVoid> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/departments/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @param page
     * @param size
     * @returns ApiResponsePageDepartmentResponse OK
     * @throws ApiError
     */
    public static getDepartments(
        page?: number,
        size: number = 20,
    ): CancelablePromise<ApiResponsePageDepartmentResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/departments',
            query: {
                'page': page,
                'size': size,
            },
        });
    }
    /**
     * @param requestBody
     * @returns ApiResponseDepartmentResponse OK
     * @throws ApiError
     */
    public static createDepartment(
        requestBody: DepartmentRequest,
    ): CancelablePromise<ApiResponseDepartmentResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/departments',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}
