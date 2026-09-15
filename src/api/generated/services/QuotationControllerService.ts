/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApiResponsePageQuotationResponse } from '../models/ApiResponsePageQuotationResponse';
import type { ApiResponseQuotationResponse } from '../models/ApiResponseQuotationResponse';
import type { ApiResponseVoid } from '../models/ApiResponseVoid';
import type { CreateQuotationRequest } from '../models/CreateQuotationRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class QuotationControllerService {
    /**
     * @param id
     * @returns ApiResponseQuotationResponse OK
     * @throws ApiError
     */
    public static get(
        id: number,
    ): CancelablePromise<ApiResponseQuotationResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/quotations/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @param id
     * @param requestBody
     * @returns ApiResponseQuotationResponse OK
     * @throws ApiError
     */
    public static update(
        id: number,
        requestBody: CreateQuotationRequest,
    ): CancelablePromise<ApiResponseQuotationResponse> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/quotations/{id}',
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
    public static delete(
        id: number,
    ): CancelablePromise<ApiResponseVoid> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/quotations/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @param page
     * @param size
     * @returns ApiResponsePageQuotationResponse OK
     * @throws ApiError
     */
    public static list(
        page?: number,
        size: number = 20,
    ): CancelablePromise<ApiResponsePageQuotationResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/quotations',
            query: {
                'page': page,
                'size': size,
            },
        });
    }
    /**
     * @param requestBody
     * @returns ApiResponseQuotationResponse OK
     * @throws ApiError
     */
    public static create(
        requestBody: CreateQuotationRequest,
    ): CancelablePromise<ApiResponseQuotationResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/quotations',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param id
     * @returns ApiResponseVoid OK
     * @throws ApiError
     */
    public static convertToInvoice(
        id: number,
    ): CancelablePromise<ApiResponseVoid> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/quotations/{id}/convert',
            path: {
                'id': id,
            },
        });
    }
}
