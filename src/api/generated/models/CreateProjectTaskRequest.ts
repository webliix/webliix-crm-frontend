/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type CreateProjectTaskRequest = {
    title?: string;
    description?: string;
    status?: CreateProjectTaskRequest.status;
    assignedTo?: number;
    startDate?: string;
    dueDate?: string;
};
export namespace CreateProjectTaskRequest {
    export enum status {
        TODO = 'TODO',
        IN_PROGRESS = 'IN_PROGRESS',
        REVIEW = 'REVIEW',
        BLOCKED = 'BLOCKED',
        DONE = 'DONE',
    }
}

