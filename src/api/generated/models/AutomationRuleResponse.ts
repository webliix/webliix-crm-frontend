/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type AutomationRuleResponse = {
    id?: number;
    name?: string;
    description?: string;
    triggerType?: AutomationRuleResponse.triggerType;
    conditionJson?: string;
    actionJson?: string;
    enabled?: boolean;
    createdAt?: string;
    updatedAt?: string;
};
export namespace AutomationRuleResponse {
    export enum triggerType {
        LEAD_CREATED = 'LEAD_CREATED',
        LEAD_CONVERTED = 'LEAD_CONVERTED',
        PROJECT_CREATED = 'PROJECT_CREATED',
        PROJECT_COMPLETED = 'PROJECT_COMPLETED',
        QUOTATION_APPROVED = 'QUOTATION_APPROVED',
        INVOICE_CREATED = 'INVOICE_CREATED',
        INVOICE_PAID = 'INVOICE_PAID',
        PAYMENT_RECEIVED = 'PAYMENT_RECEIVED',
        TICKET_CREATED = 'TICKET_CREATED',
        TICKET_ASSIGNED = 'TICKET_ASSIGNED',
        EMPLOYEE_CREATED = 'EMPLOYEE_CREATED',
        LEAVE_APPROVED = 'LEAVE_APPROVED',
        PAYROLL_GENERATED = 'PAYROLL_GENERATED',
    }
}

