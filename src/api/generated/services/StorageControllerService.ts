/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { StoredFileResponse } from '../models/StoredFileResponse';
import type { UploadFileResponse } from '../models/UploadFileResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class StorageControllerService {
    /**
     * @param tenantId
     * @param module
     * @param referenceId
     * @param requestBody
     * @returns UploadFileResponse OK
     * @throws ApiError
     */
    public static upload(
        tenantId?: number,
        module?: string,
        referenceId?: number,
        requestBody?: {
            file: Blob;
        },
    ): CancelablePromise<UploadFileResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/storage/upload',
            query: {
                'tenantId': tenantId,
                'module': module,
                'referenceId': referenceId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param id
     * @returns binary OK
     * @throws ApiError
     */
    public static download(
        id: number,
    ): CancelablePromise<Blob> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/storage/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @param id
     * @returns any OK
     * @throws ApiError
     */
    public static delete2(
        id: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/storage/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @param id
     * @returns StoredFileResponse OK
     * @throws ApiError
     */
    public static metadata(
        id: number,
    ): CancelablePromise<StoredFileResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/storage/metadata/{id}',
            path: {
                'id': id,
            },
        });
    }
}
