/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApiResponseLeadResponse } from '../models/ApiResponseLeadResponse';
import type { ApiResponsePageLeadResponse } from '../models/ApiResponsePageLeadResponse';
import type { ApiResponseVoid } from '../models/ApiResponseVoid';
import type { CreateLeadRequest } from '../models/CreateLeadRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class LeadControllerService {
    /**
     * @param id
     * @returns ApiResponseLeadResponse OK
     * @throws ApiError
     */
    public static getLead(
        id: number,
    ): CancelablePromise<ApiResponseLeadResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/leads/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @param id
     * @param requestBody
     * @returns ApiResponseLeadResponse OK
     * @throws ApiError
     */
    public static updateLead(
        id: number,
        requestBody: CreateLeadRequest,
    ): CancelablePromise<ApiResponseLeadResponse> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/leads/{id}',
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
    public static deleteLead(
        id: number,
    ): CancelablePromise<ApiResponseVoid> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/leads/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @param page
     * @param size
     * @returns ApiResponsePageLeadResponse OK
     * @throws ApiError
     */
    public static getAllLeads(
        page?: number,
        size: number = 20,
    ): CancelablePromise<ApiResponsePageLeadResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/leads',
            query: {
                'page': page,
                'size': size,
            },
        });
    }
    /**
     * @param requestBody
     * @returns ApiResponseLeadResponse OK
     * @throws ApiError
     */
    public static createLead(
        requestBody: CreateLeadRequest,
    ): CancelablePromise<ApiResponseLeadResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/leads',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param id
     * @returns ApiResponseVoid OK
     * @throws ApiError
     */
    public static convertLead(
        id: number,
    ): CancelablePromise<ApiResponseVoid> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/leads/{id}/convert',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @param keyword
     * @param page
     * @param size
     * @returns ApiResponsePageLeadResponse OK
     * @throws ApiError
     */
    public static searchLeads(
        keyword: string,
        page?: number,
        size: number = 20,
    ): CancelablePromise<ApiResponsePageLeadResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/leads/search',
            query: {
                'keyword': keyword,
                'page': page,
                'size': size,
            },
        });
    }
}
