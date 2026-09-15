/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type LeaveRequestDto = {
    employeeId?: number;
    leaveType?: LeaveRequestDto.leaveType;
    startDate?: string;
    endDate?: string;
    reason?: string;
};
export namespace LeaveRequestDto {
    export enum leaveType {
        ANNUAL = 'ANNUAL',
        SICK = 'SICK',
        CASUAL = 'CASUAL',
        UNPAID = 'UNPAID',
    }
}

