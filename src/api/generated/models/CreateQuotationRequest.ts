/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateQuotationItemRequest } from './CreateQuotationItemRequest';
export type CreateQuotationRequest = {
    customerId?: number;
    projectId?: number;
    issueDate?: string;
    validTill?: string;
    items?: Array<CreateQuotationItemRequest>;
    taxAmount?: number;
    discount?: number;
    status?: CreateQuotationRequest.status;
    notes?: string;
};
export namespace CreateQuotationRequest {
    export enum status {
        DRAFT = 'DRAFT',
        SENT = 'SENT',
        APPROVED = 'APPROVED',
        REJECTED = 'REJECTED',
        EXPIRED = 'EXPIRED',
    }
}

