/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApiResponseCustomerResponse } from '../models/ApiResponseCustomerResponse';
import type { ApiResponseCustomerStatisticsResponse } from '../models/ApiResponseCustomerStatisticsResponse';
import type { ApiResponsePageCustomerResponse } from '../models/ApiResponsePageCustomerResponse';
import type { CreateCustomerRequest } from '../models/CreateCustomerRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class CustomerControllerService {
    /**
     * @param page
     * @param size
     * @returns ApiResponsePageCustomerResponse OK
     * @throws ApiError
     */
    public static getCustomers(
        page?: number,
        size: number = 20,
    ): CancelablePromise<ApiResponsePageCustomerResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/customers',
            query: {
                'page': page,
                'size': size,
            },
        });
    }
    /**
     * @param requestBody
     * @returns ApiResponseCustomerResponse OK
     * @throws ApiError
     */
    public static createCustomer(
        requestBody: CreateCustomerRequest,
    ): CancelablePromise<ApiResponseCustomerResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/customers',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param id
     * @returns ApiResponseCustomerResponse OK
     * @throws ApiError
     */
    public static getCustomer(
        id: number,
    ): CancelablePromise<ApiResponseCustomerResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/customers/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @returns ApiResponseCustomerStatisticsResponse OK
     * @throws ApiError
     */
    public static getStatistics1(): CancelablePromise<ApiResponseCustomerStatisticsResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/customers/statistics',
        });
    }
    /**
     * @param keyword
     * @param page
     * @param size
     * @returns ApiResponsePageCustomerResponse OK
     * @throws ApiError
     */
    public static searchCustomers(
        keyword: string,
        page?: number,
        size: number = 20,
    ): CancelablePromise<ApiResponsePageCustomerResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/customers/search',
            query: {
                'keyword': keyword,
                'page': page,
                'size': size,
            },
        });
    }
}
