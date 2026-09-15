/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PortalAuthRequest } from '../models/PortalAuthRequest';
import type { PortalAuthResponse } from '../models/PortalAuthResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class PortalAuthControllerService {
    /**
     * @param token
     * @param password
     * @returns any OK
     * @throws ApiError
     */
    public static resetPassword(
        token: string,
        password: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/portal/auth/reset-password',
            query: {
                'token': token,
                'password': password,
            },
        });
    }
    /**
     * @param requestBody
     * @returns PortalAuthResponse OK
     * @throws ApiError
     */
    public static login(
        requestBody: PortalAuthRequest,
    ): CancelablePromise<PortalAuthResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/portal/auth/login',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param email
     * @returns any OK
     * @throws ApiError
     */
    public static forgotPassword(
        email: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/portal/auth/forgot-password',
            query: {
                'email': email,
            },
        });
    }
}
