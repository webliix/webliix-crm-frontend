/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type NotificationResponse = {
    id?: number;
    title?: string;
    message?: string;
    recipient?: string;
    recipientType?: string;
    channel?: NotificationResponse.channel;
    status?: NotificationResponse.status;
    referenceType?: string;
    referenceId?: number;
    sentAt?: string;
    readAt?: string;
    createdAt?: string;
    updatedAt?: string;
};
export namespace NotificationResponse {
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

