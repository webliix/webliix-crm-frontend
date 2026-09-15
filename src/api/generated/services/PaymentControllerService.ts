/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApiResponsePagePaymentResponse } from '../models/ApiResponsePagePaymentResponse';
import type { ApiResponsePaymentResponse } from '../models/ApiResponsePaymentResponse';
import type { PaymentRequest } from '../models/PaymentRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class PaymentControllerService {
    /**
     * @param page
     * @param size
     * @returns ApiResponsePagePaymentResponse OK
     * @throws ApiError
     */
    public static getPayments(
        page?: number,
        size: number = 20,
    ): CancelablePromise<ApiResponsePagePaymentResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/payments',
            query: {
                'page': page,
                'size': size,
            },
        });
    }
    /**
     * @param requestBody
     * @returns ApiResponsePaymentResponse OK
     * @throws ApiError
     */
    public static recordPayment(
        requestBody: PaymentRequest,
    ): CancelablePromise<ApiResponsePaymentResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/payments',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param id
     * @returns ApiResponsePaymentResponse OK
     * @throws ApiError
     */
    public static getPayment(
        id: number,
    ): CancelablePromise<ApiResponsePaymentResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/payments/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @param invoiceId
     * @param page
     * @param size
     * @returns ApiResponsePagePaymentResponse OK
     * @throws ApiError
     */
    public static getInvoicePayments(
        invoiceId: number,
        page?: number,
        size: number = 20,
    ): CancelablePromise<ApiResponsePagePaymentResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/invoices/{invoiceId}/payments',
            path: {
                'invoiceId': invoiceId,
            },
            query: {
                'page': page,
                'size': size,
            },
        });
    }
    /**
     * @param customerId
     * @param page
     * @param size
     * @returns ApiResponsePagePaymentResponse OK
     * @throws ApiError
     */
    public static getCustomerPayments(
        customerId: number,
        page?: number,
        size: number = 20,
    ): CancelablePromise<ApiResponsePagePaymentResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/customers/{customerId}/payments',
            path: {
                'customerId': customerId,
            },
            query: {
                'page': page,
                'size': size,
            },
        });
    }
}
