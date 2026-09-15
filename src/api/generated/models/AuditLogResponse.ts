/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type AuditLogResponse = {
    id?: number;
    userId?: number;
    username?: string;
    action?: AuditLogResponse.action;
    module?: AuditLogResponse.module;
    entityType?: string;
    entityId?: string;
    oldValue?: string;
    newValue?: string;
    ipAddress?: string;
    userAgent?: string;
    status?: string;
    createdAt?: string;
};
export namespace AuditLogResponse {
    export enum action {
        CREATE = 'CREATE',
        UPDATE = 'UPDATE',
        DELETE = 'DELETE',
        LOGIN = 'LOGIN',
        LOGOUT = 'LOGOUT',
        APPROVE = 'APPROVE',
        REJECT = 'REJECT',
        ASSIGN = 'ASSIGN',
        GENERATE = 'GENERATE',
        EXPORT = 'EXPORT',
    }
    export enum module {
        AUTH = 'AUTH',
        CRM = 'CRM',
        CUSTOMER = 'CUSTOMER',
        PROJECT = 'PROJECT',
        FINANCE = 'FINANCE',
        HR = 'HR',
        PAYROLL = 'PAYROLL',
        TICKET = 'TICKET',
        NOTIFICATION = 'NOTIFICATION',
        AUTOMATION = 'AUTOMATION',
    }
}

