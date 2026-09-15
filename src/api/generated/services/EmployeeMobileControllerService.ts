/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class EmployeeMobileControllerService {
    /**
     * @returns string OK
     * @throws ApiError
     */
    public static checkOut(): CancelablePromise<Record<string, string>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/mobile/check-out',
        });
    }
    /**
     * @returns string OK
     * @throws ApiError
     */
    public static checkIn(): CancelablePromise<Record<string, string>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/mobile/check-in',
        });
    }
    /**
     * @returns any OK
     * @throws ApiError
     */
    public static payroll(): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/mobile/payroll',
        });
    }
    /**
     * @returns any OK
     * @throws ApiError
     */
    public static leave(): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/mobile/leave',
        });
    }
    /**
     * @returns any OK
     * @throws ApiError
     */
    public static attendance(): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/mobile/attendance',
        });
    }
}
