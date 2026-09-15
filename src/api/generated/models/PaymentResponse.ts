/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type PaymentResponse = {
    id?: number;
    paymentNumber?: string;
    invoiceId?: number;
    customerId?: number;
    amount?: number;
    paymentDate?: string;
    paymentMethod?: PaymentResponse.paymentMethod;
    status?: PaymentResponse.status;
    transactionReference?: string;
    remarks?: string;
    createdAt?: string;
};
export namespace PaymentResponse {
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
    export enum status {
        PENDING = 'PENDING',
        SUCCESS = 'SUCCESS',
        FAILED = 'FAILED',
        REFUNDED = 'REFUNDED',
    }
}

