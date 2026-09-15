/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { SystemSettingRequest } from '../models/SystemSettingRequest';
import type { SystemSettingResponse } from '../models/SystemSettingResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class SystemSettingControllerService {
    /**
     * @param id
     * @param requestBody
     * @returns SystemSettingResponse OK
     * @throws ApiError
     */
    public static updateSetting(
        id: number,
        requestBody: SystemSettingRequest,
    ): CancelablePromise<SystemSettingResponse> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/settings/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @returns SystemSettingResponse OK
     * @throws ApiError
     */
    public static getAllSettings(): CancelablePromise<Array<SystemSettingResponse>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/settings',
        });
    }
    /**
     * @param requestBody
     * @returns SystemSettingResponse OK
     * @throws ApiError
     */
    public static createSetting(
        requestBody: SystemSettingRequest,
    ): CancelablePromise<SystemSettingResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/settings',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param key
     * @returns SystemSettingResponse OK
     * @throws ApiError
     */
    public static getSetting(
        key: string,
    ): CancelablePromise<SystemSettingResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/settings/{key}',
            path: {
                'key': key,
            },
        });
    }
}
