/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApiResponseListPlan } from '../models/ApiResponseListPlan';
import type { ApiResponsePlan } from '../models/ApiResponsePlan';
import type { ApiResponseSubscription } from '../models/ApiResponseSubscription';
import type { SubscriptionRequest } from '../models/SubscriptionRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class BillingControllerService {
    /**
     * @param requestBody
     * @returns ApiResponseSubscription OK
     * @throws ApiError
     */
    public static createSubscription(
        requestBody: SubscriptionRequest,
    ): CancelablePromise<ApiResponseSubscription> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/billing/subscriptions',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param tenantId
     * @returns ApiResponseSubscription OK
     * @throws ApiError
     */
    public static getSubscription(
        tenantId: number,
    ): CancelablePromise<ApiResponseSubscription> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/billing/subscriptions/{tenantId}',
            path: {
                'tenantId': tenantId,
            },
        });
    }
    /**
     * @returns ApiResponseListPlan OK
     * @throws ApiError
     */
    public static getPlans(): CancelablePromise<ApiResponseListPlan> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/billing/plans',
        });
    }
    /**
     * @param id
     * @returns ApiResponsePlan OK
     * @throws ApiError
     */
    public static getPlan(
        id: number,
    ): CancelablePromise<ApiResponsePlan> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/billing/plans/{id}',
            path: {
                'id': id,
            },
        });
    }
}
