/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EmployeeResponse } from './EmployeeResponse';
export type PayrollResponse = {
    id?: number;
    employee?: EmployeeResponse;
    payrollMonth?: string;
    grossSalary?: number;
    deductions?: number;
    netSalary?: number;
    status?: PayrollResponse.status;
    processedAt?: string;
    createdAt?: string;
};
export namespace PayrollResponse {
    export enum status {
        PENDING = 'PENDING',
        PAID = 'PAID',
        FAILED = 'FAILED',
    }
}

