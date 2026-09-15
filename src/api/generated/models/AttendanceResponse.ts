/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type AttendanceResponse = {
    id?: number;
    employeeId?: number;
    attendanceDate?: string;
    checkInTime?: string;
    checkOutTime?: string;
    workingHours?: number;
    status?: AttendanceResponse.status;
};
export namespace AttendanceResponse {
    export enum status {
        PRESENT = 'PRESENT',
        ABSENT = 'ABSENT',
        HALF_DAY = 'HALF_DAY',
        LEAVE = 'LEAVE',
    }
}

