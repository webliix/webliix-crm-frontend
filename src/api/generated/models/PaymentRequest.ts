/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type PaymentRequest = {
    invoiceId?: number;
    amount?: number;
    paymentDate?: string;
    paymentMethod?: PaymentRequest.paymentMethod;
    transactionReference?: string;
    remarks?: string;
};
export namespace PaymentRequest {
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

