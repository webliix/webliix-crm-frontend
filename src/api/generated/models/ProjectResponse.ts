/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ProjectResponse = {
    id?: number;
    projectCode?: string;
    projectName?: string;
    description?: string;
    budget?: number;
    startDate?: string;
    expectedEndDate?: string;
    actualEndDate?: string;
    status?: ProjectResponse.status;
    priority?: ProjectResponse.priority;
    customerId?: number;
    progressPercentage?: number;
    billable?: boolean;
    createdAt?: string;
    updatedAt?: string;
};
export namespace ProjectResponse {
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

