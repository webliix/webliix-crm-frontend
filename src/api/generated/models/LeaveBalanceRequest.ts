/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type LeaveBalanceRequest = {
    employeeId?: number;
    leaveType?: LeaveBalanceRequest.leaveType;
    allocationDays?: number;
};
export namespace LeaveBalanceRequest {
    export enum leaveType {
        ANNUAL = 'ANNUAL',
        SICK = 'SICK',
        CASUAL = 'CASUAL',
        UNPAID = 'UNPAID',
    }
}

