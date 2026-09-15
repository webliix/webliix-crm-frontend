/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { InvoiceItemResponse } from './InvoiceItemResponse';
export type InvoiceResponse = {
    id?: number;
    invoiceNumber?: string;
    customerId?: number;
    projectId?: number;
    issueDate?: string;
    dueDate?: string;
    subtotal?: number;
    taxAmount?: number;
    discountAmount?: number;
    totalAmount?: number;
    paidAmount?: number;
    pendingAmount?: number;
    status?: InvoiceResponse.status;
    notes?: string;
    items?: Array<InvoiceItemResponse>;
    createdAt?: string;
    updatedAt?: string;
};
export namespace InvoiceResponse {
    export enum status {
        DRAFT = 'DRAFT',
        SENT = 'SENT',
        PARTIALLY_PAID = 'PARTIALLY_PAID',
        PAID = 'PAID',
        OVERDUE = 'OVERDUE',
        CANCELLED = 'CANCELLED',
    }
}

