/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApiResponseExpenseResponse } from '../models/ApiResponseExpenseResponse';
import type { ApiResponsePageExpenseResponse } from '../models/ApiResponsePageExpenseResponse';
import type { ExpenseRequest } from '../models/ExpenseRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ExpenseControllerService {
    /**
     * @param page
     * @param size
     * @returns ApiResponsePageExpenseResponse OK
     * @throws ApiError
     */
    public static getExpenses(
        page?: number,
        size: number = 20,
    ): CancelablePromise<ApiResponsePageExpenseResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/expenses',
            query: {
                'page': page,
                'size': size,
            },
        });
    }
    /**
     * @param requestBody
     * @returns ApiResponseExpenseResponse OK
     * @throws ApiError
     */
    public static createExpense(
        requestBody: ExpenseRequest,
    ): CancelablePromise<ApiResponseExpenseResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/expenses',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param id
     * @returns ApiResponseExpenseResponse OK
     * @throws ApiError
     */
    public static getExpense(
        id: number,
    ): CancelablePromise<ApiResponseExpenseResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/expenses/{id}',
            path: {
                'id': id,
            },
        });
    }
}
