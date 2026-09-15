/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ProjectTaskResponse = {
    id?: number;
    projectId?: number;
    title?: string;
    description?: string;
    status?: ProjectTaskResponse.status;
    assignedTo?: number;
    startDate?: string;
    dueDate?: string;
    completedAt?: string;
};
export namespace ProjectTaskResponse {
    export enum status {
        TODO = 'TODO',
        IN_PROGRESS = 'IN_PROGRESS',
        REVIEW = 'REVIEW',
        BLOCKED = 'BLOCKED',
        DONE = 'DONE',
    }
}

