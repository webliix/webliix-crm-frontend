/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type CreateProjectRequest = {
    projectName?: string;
    description?: string;
    budget?: number;
    startDate?: string;
    expectedEndDate?: string;
    actualEndDate?: string;
    status?: CreateProjectRequest.status;
    priority?: CreateProjectRequest.priority;
    customerId?: number;
    billable?: boolean;
};
export namespace CreateProjectRequest {
    export enum status {
        PLANNING = 'PLANNING',
        IN_PROGRESS = 'IN_PROGRESS',
        ON_HOLD = 'ON_HOLD',
        TESTING = 'TESTING',
        COMPLETED = 'COMPLETED',
        CANCELLED = 'CANCELLED',
    }
    export enum priority {
        LOW = 'LOW',
        MEDIUM = 'MEDIUM',
        HIGH = 'HIGH',
        CRITICAL = 'CRITICAL',
    }
}

