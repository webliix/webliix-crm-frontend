/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type CreateNotificationRequest = {
    title: string;
    message: string;
    recipient: string;
    recipientType?: string;
    channel: CreateNotificationRequest.channel;
    status?: CreateNotificationRequest.status;
    referenceType?: string;
    referenceId?: number;
};
export namespace CreateNotificationRequest {
    export enum channel {
        EMAIL = 'EMAIL',
        SMS = 'SMS',
        WHATSAPP = 'WHATSAPP',
        IN_APP = 'IN_APP',
        PUSH = 'PUSH',
    }
    export enum status {
        PENDING = 'PENDING',
        SENT = 'SENT',
        FAILED = 'FAILED',
        READ = 'READ',
    }
}

