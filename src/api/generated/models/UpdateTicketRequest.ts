/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type UpdateTicketRequest = {
    title?: string;
    description?: string;
    customerId?: number;
    projectId?: number;
    createdBy?: string;
    assignedToId?: number;
    priority?: UpdateTicketRequest.priority;
    status?: UpdateTicketRequest.status;
    category?: UpdateTicketRequest.category;
    dueDate?: string;
    slaHours?: number;
    responseTime?: number;
    resolutionTime?: number;
};
export namespace UpdateTicketRequest {
    export enum priority {
        LOW = 'LOW',
        MEDIUM = 'MEDIUM',
        HIGH = 'HIGH',
        CRITICAL = 'CRITICAL',
    }
    export enum status {
        OPEN = 'OPEN',
        IN_PROGRESS = 'IN_PROGRESS',
        WAITING_FOR_CUSTOMER = 'WAITING_FOR_CUSTOMER',
        RESOLVED = 'RESOLVED',
        CLOSED = 'CLOSED',
        REOPENED = 'REOPENED',
    }
    export enum category {
        BUG = 'BUG',
        FEATURE_REQUEST = 'FEATURE_REQUEST',
        SUPPORT = 'SUPPORT',
        MAINTENANCE = 'MAINTENANCE',
        BILLING = 'BILLING',
        OTHER = 'OTHER',
    }
}

