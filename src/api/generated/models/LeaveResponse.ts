/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EmployeeResponse } from './EmployeeResponse';
export type LeaveResponse = {
    id?: number;
    employee?: EmployeeResponse;
    leaveType?: LeaveResponse.leaveType;
    startDate?: string;
    endDate?: string;
    reason?: string;
    status?: LeaveResponse.status;
    approvedBy?: string;
    approvedAt?: string;
    createdAt?: string;
    updatedAt?: string;
};
export namespace LeaveResponse {
    export enum leaveType {
        ANNUAL = 'ANNUAL',
        SICK = 'SICK',
        CASUAL = 'CASUAL',
        UNPAID = 'UNPAID',
    }
    export enum status {
        PENDING = 'PENDING',
        APPROVED = 'APPROVED',
        REJECTED = 'REJECTED',
    }
}

