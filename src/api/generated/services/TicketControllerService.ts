/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApiResponseListTicketResponse } from '../models/ApiResponseListTicketResponse';
import type { ApiResponseTicketAttachmentResponse } from '../models/ApiResponseTicketAttachmentResponse';
import type { ApiResponseTicketCommentResponse } from '../models/ApiResponseTicketCommentResponse';
import type { ApiResponseTicketDashboardResponse } from '../models/ApiResponseTicketDashboardResponse';
import type { ApiResponseTicketResponse } from '../models/ApiResponseTicketResponse';
import type { AssignTicketRequest } from '../models/AssignTicketRequest';
import type { CreateTicketAttachmentRequest } from '../models/CreateTicketAttachmentRequest';
import type { CreateTicketCommentRequest } from '../models/CreateTicketCommentRequest';
import type { CreateTicketRequest } from '../models/CreateTicketRequest';
import type { UpdateTicketRequest } from '../models/UpdateTicketRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class TicketControllerService {
    /**
     * @param id
     * @returns ApiResponseTicketResponse OK
     * @throws ApiError
     */
    public static getTicket(
        id: number,
    ): CancelablePromise<ApiResponseTicketResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/tickets/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @param id
     * @param requestBody
     * @returns ApiResponseTicketResponse OK
     * @throws ApiError
     */
    public static updateTicket(
        id: number,
        requestBody: UpdateTicketRequest,
    ): CancelablePromise<ApiResponseTicketResponse> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/tickets/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param id
     * @param requestBody
     * @returns ApiResponseTicketResponse OK
     * @throws ApiError
     */
    public static assignTicket(
        id: number,
        requestBody: AssignTicketRequest,
    ): CancelablePromise<ApiResponseTicketResponse> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/tickets/{id}/assign',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @returns ApiResponseListTicketResponse OK
     * @throws ApiError
     */
    public static getTickets(): CancelablePromise<ApiResponseListTicketResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/tickets',
        });
    }
    /**
     * @param requestBody
     * @returns ApiResponseTicketResponse OK
     * @throws ApiError
     */
    public static createTicket(
        requestBody: CreateTicketRequest,
    ): CancelablePromise<ApiResponseTicketResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/tickets',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param id
     * @param requestBody
     * @returns ApiResponseTicketCommentResponse OK
     * @throws ApiError
     */
    public static addComment(
        id: number,
        requestBody: CreateTicketCommentRequest,
    ): CancelablePromise<ApiResponseTicketCommentResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/tickets/{id}/comments',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param id
     * @param requestBody
     * @returns ApiResponseTicketAttachmentResponse OK
     * @throws ApiError
     */
    public static addAttachment(
        id: number,
        requestBody: CreateTicketAttachmentRequest,
    ): CancelablePromise<ApiResponseTicketAttachmentResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/tickets/{id}/attachments',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @returns ApiResponseTicketDashboardResponse OK
     * @throws ApiError
     */
    public static getDashboard(): CancelablePromise<ApiResponseTicketDashboardResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/tickets/dashboard',
        });
    }
}
