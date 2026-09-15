/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { QuotationItemResponse } from './QuotationItemResponse';
export type QuotationResponse = {
    id?: number;
    quotationNumber?: string;
    customerId?: number;
    projectId?: number;
    issueDate?: string;
    validTill?: string;
    subtotal?: number;
    taxAmount?: number;
    discount?: number;
    totalAmount?: number;
    status?: QuotationResponse.status;
    notes?: string;
    items?: Array<QuotationItemResponse>;
    converted?: boolean;
    convertedAt?: string;
    createdAt?: string;
    updatedAt?: string;
};
export namespace QuotationResponse {
    export enum status {
        DRAFT = 'DRAFT',
        SENT = 'SENT',
        APPROVED = 'APPROVED',
        REJECTED = 'REJECTED',
        EXPIRED = 'EXPIRED',
    }
}

