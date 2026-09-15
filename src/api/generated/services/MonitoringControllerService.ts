/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApiResponseMapStringObject } from '../models/ApiResponseMapStringObject';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class MonitoringControllerService {
    /**
     * @returns ApiResponseMapStringObject OK
     * @throws ApiError
     */
    public static getMonitoringDashboard(): CancelablePromise<ApiResponseMapStringObject> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/monitoring/dashboard',
        });
    }
}
