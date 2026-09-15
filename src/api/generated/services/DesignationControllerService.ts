/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApiResponseDesignationResponse } from '../models/ApiResponseDesignationResponse';
import type { ApiResponsePageDesignationResponse } from '../models/ApiResponsePageDesignationResponse';
import type { DesignationRequest } from '../models/DesignationRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class DesignationControllerService {
    /**
     * @param page
     * @param size
     * @returns ApiResponsePageDesignationResponse OK
     * @throws ApiError
     */
    public static getDesignations(
        page?: number,
        size: number = 20,
    ): CancelablePromise<ApiResponsePageDesignationResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/designations',
            query: {
                'page': page,
                'size': size,
            },
        });
    }
    /**
     * @param requestBody
     * @returns ApiResponseDesignationResponse OK
     * @throws ApiError
     */
    public static createDesignation(
        requestBody: DesignationRequest,
    ): CancelablePromise<ApiResponseDesignationResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/designations',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}
