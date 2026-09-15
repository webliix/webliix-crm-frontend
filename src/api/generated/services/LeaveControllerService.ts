/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApiResponseLeaveBalanceResponse } from '../models/ApiResponseLeaveBalanceResponse';
import type { ApiResponseLeaveResponse } from '../models/ApiResponseLeaveResponse';
import type { ApiResponsePageLeaveBalanceResponse } from '../models/ApiResponsePageLeaveBalanceResponse';
import type { ApiResponsePageLeaveResponse } from '../models/ApiResponsePageLeaveResponse';
import type { LeaveBalanceRequest } from '../models/LeaveBalanceRequest';
import type { LeaveRequestDto } from '../models/LeaveRequestDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class LeaveControllerService {
    /**
     * @param id
     * @returns ApiResponseLeaveResponse OK
     * @throws ApiError
     */
    public static rejectLeave(
        id: number,
    ): CancelablePromise<ApiResponseLeaveResponse> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/leaves/{id}/reject',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @param id
     * @returns ApiResponseLeaveResponse OK
     * @throws ApiError
     */
    public static approveLeave(
        id: number,
    ): CancelablePromise<ApiResponseLeaveResponse> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/leaves/{id}/approve',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @param page
     * @param size
     * @returns ApiResponsePageLeaveResponse OK
     * @throws ApiError
     */
    public static getLeaves(
        page?: number,
        size: number = 20,
    ): CancelablePromise<ApiResponsePageLeaveResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/leaves',
            query: {
                'page': page,
                'size': size,
            },
        });
    }
    /**
     * @param requestBody
     * @returns ApiResponseLeaveResponse OK
     * @throws ApiError
     */
    public static applyLeave(
        requestBody: LeaveRequestDto,
    ): CancelablePromise<ApiResponseLeaveResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/leaves',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param page
     * @param size
     * @returns ApiResponsePageLeaveBalanceResponse OK
     * @throws ApiError
     */
    public static getLeaveBalances(
        page?: number,
        size: number = 20,
    ): CancelablePromise<ApiResponsePageLeaveBalanceResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/leaves/balances',
            query: {
                'page': page,
                'size': size,
            },
        });
    }
    /**
     * @param requestBody
     * @returns ApiResponseLeaveBalanceResponse OK
     * @throws ApiError
     */
    public static createLeaveBalance(
        requestBody: LeaveBalanceRequest,
    ): CancelablePromise<ApiResponseLeaveBalanceResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/leaves/balances',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param id
     * @returns ApiResponseLeaveResponse OK
     * @throws ApiError
     */
    public static getLeave(
        id: number,
    ): CancelablePromise<ApiResponseLeaveResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/leaves/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @param id
     * @returns ApiResponseLeaveBalanceResponse OK
     * @throws ApiError
     */
    public static getLeaveBalance(
        id: number,
    ): CancelablePromise<ApiResponseLeaveBalanceResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/leaves/balances/{id}',
            path: {
                'id': id,
            },
        });
    }
}
