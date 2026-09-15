/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApiResponseListMonthlyRevenueResponse } from '../models/ApiResponseListMonthlyRevenueResponse';
import type { ApiResponseProfitResponse } from '../models/ApiResponseProfitResponse';
import type { ApiResponseRevenueStatisticsResponse } from '../models/ApiResponseRevenueStatisticsResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ReportControllerService {
    /**
     * @returns ApiResponseRevenueStatisticsResponse OK
     * @throws ApiError
     */
    public static getRevenueStatistics(): CancelablePromise<ApiResponseRevenueStatisticsResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/reports/revenue',
        });
    }
    /**
     * @returns ApiResponseListMonthlyRevenueResponse OK
     * @throws ApiError
     */
    public static getMonthlyRevenue(): CancelablePromise<ApiResponseListMonthlyRevenueResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/reports/revenue/monthly',
        });
    }
    /**
     * @returns ApiResponseProfitResponse OK
     * @throws ApiError
     */
    public static getProfitStatistics(): CancelablePromise<ApiResponseProfitResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/reports/profit',
        });
    }
}
