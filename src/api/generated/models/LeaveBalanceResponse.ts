/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EmployeeResponse } from './EmployeeResponse';
export type LeaveBalanceResponse = {
    id?: number;
    employee?: EmployeeResponse;
    leaveType?: LeaveBalanceResponse.leaveType;
    allocationDays?: number;
    usedDays?: number;
    remainingDays?: number;
    updatedAt?: string;
};
export namespace LeaveBalanceResponse {
    export enum leaveType {
        ANNUAL = 'ANNUAL',
        SICK = 'SICK',
        CASUAL = 'CASUAL',
        UNPAID = 'UNPAID',
    }
}

