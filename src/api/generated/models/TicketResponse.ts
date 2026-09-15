/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type TicketResponse = {
    id?: number;
    ticketNumber?: string;
    title?: string;
    description?: string;
    customerId?: number;
    customerName?: string;
    projectId?: number;
    projectName?: string;
    createdBy?: string;
    assignedToId?: number;
    assignedToName?: string;
    priority?: TicketResponse.priority;
    status?: TicketResponse.status;
    category?: TicketResponse.category;
    dueDate?: string;
    closedAt?: string;
    slaHours?: number;
    responseTime?: number;
    resolutionTime?: number;
    createdAt?: string;
    updatedAt?: string;
};
export namespace TicketResponse {
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

