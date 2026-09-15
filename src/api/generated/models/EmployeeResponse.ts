/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type EmployeeResponse = {
    id?: number;
    employeeCode?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    departmentId?: number;
    departmentName?: string;
    designationId?: number;
    designationName?: string;
    joiningDate?: string;
    salary?: number;
    employmentType?: EmployeeResponse.employmentType;
    active?: boolean;
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    emergencyContact?: string;
    createdAt?: string;
    updatedAt?: string;
};
export namespace EmployeeResponse {
    export enum employmentType {
        FULL_TIME = 'FULL_TIME',
        PART_TIME = 'PART_TIME',
        CONTRACT = 'CONTRACT',
        INTERN = 'INTERN',
        FREELANCER = 'FREELANCER',
    }
}

