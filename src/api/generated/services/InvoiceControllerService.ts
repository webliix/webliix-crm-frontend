/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApiResponseInvoiceDashboardResponse } from '../models/ApiResponseInvoiceDashboardResponse';
import type { ApiResponseInvoiceResponse } from '../models/ApiResponseInvoiceResponse';
import type { ApiResponsePageInvoiceResponse } from '../models/ApiResponsePageInvoiceResponse';
import type { ApiResponseVoid } from '../models/ApiResponseVoid';
import type { CreateInvoiceRequest } from '../models/CreateInvoiceRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class InvoiceControllerService {
    /**
     * @param id
     * @returns ApiResponseInvoiceResponse OK
     * @throws ApiError
     */
    public static get1(
        id: number,
    ): CancelablePromise<ApiResponseInvoiceResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/invoices/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @param id
     * @param requestBody
     * @returns ApiResponseInvoiceResponse OK
     * @throws ApiError
     */
    public static update1(
        id: number,
        requestBody: CreateInvoiceRequest,
    ): CancelablePromise<ApiResponseInvoiceResponse> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/invoices/{id}',
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
    public static delete1(
        id: number,
    ): CancelablePromise<ApiResponseVoid> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/invoices/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @param page
     * @param size
     * @returns ApiResponsePageInvoiceResponse OK
     * @throws ApiError
     */
    public static list1(
        page?: number,
        size: number = 20,
    ): CancelablePromise<ApiResponsePageInvoiceResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/invoices',
            query: {
                'page': page,
                'size': size,
            },
        });
    }
    /**
     * @param requestBody
     * @returns ApiResponseInvoiceResponse OK
     * @throws ApiError
     */
    public static create1(
        requestBody: CreateInvoiceRequest,
    ): CancelablePromise<ApiResponseInvoiceResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/invoices',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param keyword
     * @param page
     * @param size
     * @returns ApiResponsePageInvoiceResponse OK
     * @throws ApiError
     */
    public static search(
        keyword: string,
        page?: number,
        size: number = 20,
    ): CancelablePromise<ApiResponsePageInvoiceResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/invoices/search',
            query: {
                'keyword': keyword,
                'page': page,
                'size': size,
            },
        });
    }
    /**
     * @returns ApiResponseInvoiceDashboardResponse OK
     * @throws ApiError
     */
    public static dashboard2(): CancelablePromise<ApiResponseInvoiceDashboardResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/invoices/dashboard',
        });
    }
}
