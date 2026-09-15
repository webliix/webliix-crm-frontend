/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApiResponseAttendanceResponse } from '../models/ApiResponseAttendanceResponse';
import type { ApiResponsePageAttendanceResponse } from '../models/ApiResponsePageAttendanceResponse';
import type { AttendanceRequest } from '../models/AttendanceRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AttendanceControllerService {
    /**
     * @param page
     * @param size
     * @returns ApiResponsePageAttendanceResponse OK
     * @throws ApiError
     */
    public static getAttendance(
        page?: number,
        size: number = 20,
    ): CancelablePromise<ApiResponsePageAttendanceResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/attendance',
            query: {
                'page': page,
                'size': size,
            },
        });
    }
    /**
     * @param requestBody
     * @returns ApiResponseAttendanceResponse OK
     * @throws ApiError
     */
    public static recordAttendance(
        requestBody: AttendanceRequest,
    ): CancelablePromise<ApiResponseAttendanceResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/attendance',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param employeeId
     * @param page
     * @param size
     * @returns ApiResponsePageAttendanceResponse OK
     * @throws ApiError
     */
    public static getEmployeeAttendance(
        employeeId: number,
        page?: number,
        size: number = 20,
    ): CancelablePromise<ApiResponsePageAttendanceResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/employees/{employeeId}/attendance',
            path: {
                'employeeId': employeeId,
            },
            query: {
                'page': page,
                'size': size,
            },
        });
    }
}
