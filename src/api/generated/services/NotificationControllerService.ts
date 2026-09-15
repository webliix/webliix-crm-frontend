/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApiResponseListNotificationResponse } from '../models/ApiResponseListNotificationResponse';
import type { ApiResponseNotificationDashboardResponse } from '../models/ApiResponseNotificationDashboardResponse';
import type { ApiResponseNotificationPreferenceResponse } from '../models/ApiResponseNotificationPreferenceResponse';
import type { ApiResponseNotificationResponse } from '../models/ApiResponseNotificationResponse';
import type { ApiResponseVoid } from '../models/ApiResponseVoid';
import type { CreateNotificationRequest } from '../models/CreateNotificationRequest';
import type { NotificationPreferenceRequest } from '../models/NotificationPreferenceRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class NotificationControllerService {
    /**
     * @param recipient
     * @returns ApiResponseVoid OK
     * @throws ApiError
     */
    public static markAllAsRead(
        recipient: string,
    ): CancelablePromise<ApiResponseVoid> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/notifications/{recipient}/read-all',
            path: {
                'recipient': recipient,
            },
        });
    }
    /**
     * @param id
     * @returns ApiResponseNotificationResponse OK
     * @throws ApiError
     */
    public static markAsRead(
        id: number,
    ): CancelablePromise<ApiResponseNotificationResponse> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/notifications/{id}/read',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @param requestBody
     * @returns ApiResponseNotificationPreferenceResponse OK
     * @throws ApiError
     */
    public static updatePreferences(
        requestBody: NotificationPreferenceRequest,
    ): CancelablePromise<ApiResponseNotificationPreferenceResponse> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/notifications/preferences',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns ApiResponseNotificationPreferenceResponse OK
     * @throws ApiError
     */
    public static createPreferences(
        requestBody: NotificationPreferenceRequest,
    ): CancelablePromise<ApiResponseNotificationPreferenceResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/notifications/preferences',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns ApiResponseNotificationResponse OK
     * @throws ApiError
     */
    public static createNotification(
        requestBody: CreateNotificationRequest,
    ): CancelablePromise<ApiResponseNotificationResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/notifications',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param recipient
     * @returns ApiResponseListNotificationResponse OK
     * @throws ApiError
     */
    public static getNotifications(
        recipient: string,
    ): CancelablePromise<ApiResponseListNotificationResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/notifications/{recipient}',
            path: {
                'recipient': recipient,
            },
        });
    }
    /**
     * @param recipient
     * @returns ApiResponseListNotificationResponse OK
     * @throws ApiError
     */
    public static getUnreadNotifications(
        recipient: string,
    ): CancelablePromise<ApiResponseListNotificationResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/notifications/{recipient}/unread',
            path: {
                'recipient': recipient,
            },
        });
    }
    /**
     * @param id
     * @returns ApiResponseNotificationResponse OK
     * @throws ApiError
     */
    public static getNotification(
        id: number,
    ): CancelablePromise<ApiResponseNotificationResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/notifications/{id}/detail',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @param userId
     * @returns ApiResponseNotificationPreferenceResponse OK
     * @throws ApiError
     */
    public static getPreferences(
        userId: number,
    ): CancelablePromise<ApiResponseNotificationPreferenceResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/notifications/preferences/{userId}',
            path: {
                'userId': userId,
            },
        });
    }
    /**
     * @returns ApiResponseNotificationDashboardResponse OK
     * @throws ApiError
     */
    public static getDashboard3(): CancelablePromise<ApiResponseNotificationDashboardResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/notifications/dashboard',
        });
    }
}
