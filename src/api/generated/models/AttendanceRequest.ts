/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type AttendanceRequest = {
    employeeId?: number;
    attendanceDate?: string;
    checkInTime?: string;
    checkOutTime?: string;
    status?: AttendanceRequest.status;
};
export namespace AttendanceRequest {
    export enum status {
        PRESENT = 'PRESENT',
        ABSENT = 'ABSENT',
        HALF_DAY = 'HALF_DAY',
        LEAVE = 'LEAVE',
    }
}

