/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type AutomationExecutionResponse = {
    id?: number;
    ruleId?: number;
    status?: AutomationExecutionResponse.status;
    executionTime?: string;
    errorMessage?: string;
    createdAt?: string;
};
export namespace AutomationExecutionResponse {
    export enum status {
        SUCCESS = 'SUCCESS',
        FAILED = 'FAILED',
        RUNNING = 'RUNNING',
    }
}

