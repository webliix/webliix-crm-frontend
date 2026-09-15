/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type EmployeeRequest = {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    departmentId?: number;
    designationId?: number;
    joiningDate?: string;
    salary?: number;
    employmentType?: EmployeeRequest.employmentType;
    active?: boolean;
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    emergencyContact?: string;
};
export namespace EmployeeRequest {
    export enum employmentType {
        FULL_TIME = 'FULL_TIME',
        PART_TIME = 'PART_TIME',
        CONTRACT = 'CONTRACT',
        INTERN = 'INTERN',
        FREELANCER = 'FREELANCER',
    }
}

