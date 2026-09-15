/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateInvoiceItemRequest } from './CreateInvoiceItemRequest';
export type CreateInvoiceRequest = {
    customerId?: number;
    projectId?: number;
    issueDate?: string;
    dueDate?: string;
    items?: Array<CreateInvoiceItemRequest>;
    taxAmount?: number;
    discountAmount?: number;
    notes?: string;
};

