/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type LeadResponse = {
    id?: number;
    companyName?: string;
    contactPerson?: string;
    email?: string;
    phone?: string;
    website?: string;
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    requirements?: string;
    estimatedValue?: number;
    status?: LeadResponse.status;
    source?: LeadResponse.source;
    nextFollowUpDate?: string;
    notes?: string;
    createdAt?: string;
    updatedAt?: string;
};
export namespace LeadResponse {
    export enum status {
        NEW = 'NEW',
        CONTACTED = 'CONTACTED',
        QUALIFIED = 'QUALIFIED',
        PROPOSAL_SENT = 'PROPOSAL_SENT',
        NEGOTIATION = 'NEGOTIATION',
        WON = 'WON',
        LOST = 'LOST',
    }
    export enum source {
        WEBSITE = 'WEBSITE',
        WHATSAPP = 'WHATSAPP',
        FACEBOOK = 'FACEBOOK',
        INSTAGRAM = 'INSTAGRAM',
        REFERRAL = 'REFERRAL',
        EMAIL = 'EMAIL',
        PHONE = 'PHONE',
        OTHER = 'OTHER',
    }
}

