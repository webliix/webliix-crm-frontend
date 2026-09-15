/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ExpenseResponse = {
    id?: number;
    expenseNumber?: string;
    category?: ExpenseResponse.category;
    description?: string;
    amount?: number;
    expenseDate?: string;
    paymentMethod?: ExpenseResponse.paymentMethod;
    vendor?: string;
    createdBy?: string;
    createdAt?: string;
};
export namespace ExpenseResponse {
    export enum category {
        SALARY = 'SALARY',
        HOSTING = 'HOSTING',
        SOFTWARE = 'SOFTWARE',
        MARKETING = 'MARKETING',
        OFFICE = 'OFFICE',
        TRAVEL = 'TRAVEL',
        HARDWARE = 'HARDWARE',
        OTHER = 'OTHER',
    }
    export enum paymentMethod {
        CASH = 'CASH',
        BANK_TRANSFER = 'BANK_TRANSFER',
        UPI = 'UPI',
        CHEQUE = 'CHEQUE',
        CREDIT_CARD = 'CREDIT_CARD',
        DEBIT_CARD = 'DEBIT_CARD',
        PAYPAL = 'PAYPAL',
        OTHER = 'OTHER',
    }
}

