/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AutomationDashboardResponse } from '../models/AutomationDashboardResponse';
import type { AutomationExecutionResponse } from '../models/AutomationExecutionResponse';
import type { AutomationRuleResponse } from '../models/AutomationRuleResponse';
import type { CreateAutomationRuleRequest } from '../models/CreateAutomationRuleRequest';
import type { UpdateAutomationRuleRequest } from '../models/UpdateAutomationRuleRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AutomationControllerService {
    /**
     * @param id
     * @param requestBody
     * @returns AutomationRuleResponse OK
     * @throws ApiError
     */
    public static updateRule(
        id: number,
        requestBody: UpdateAutomationRuleRequest,
    ): CancelablePromise<AutomationRuleResponse> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/automation/rules/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param id
     * @returns any OK
     * @throws ApiError
     */
    public static deleteRule(
        id: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/automation/rules/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @param triggerType
     * @param requestBody
     * @returns AutomationExecutionResponse OK
     * @throws ApiError
     */
    public static executeTrigger(
        triggerType: 'LEAD_CREATED' | 'LEAD_CONVERTED' | 'PROJECT_CREATED' | 'PROJECT_COMPLETED' | 'QUOTATION_APPROVED' | 'INVOICE_CREATED' | 'INVOICE_PAID' | 'PAYMENT_RECEIVED' | 'TICKET_CREATED' | 'TICKET_ASSIGNED' | 'EMPLOYEE_CREATED' | 'LEAVE_APPROVED' | 'PAYROLL_GENERATED',
        requestBody?: Record<string, any>,
    ): CancelablePromise<AutomationExecutionResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/automation/triggers/{triggerType}/execute',
            path: {
                'triggerType': triggerType,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @returns AutomationRuleResponse OK
     * @throws ApiError
     */
    public static getRules(): CancelablePromise<Array<AutomationRuleResponse>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/automation/rules',
        });
    }
    /**
     * @param requestBody
     * @returns AutomationRuleResponse OK
     * @throws ApiError
     */
    public static createRule(
        requestBody: CreateAutomationRuleRequest,
    ): CancelablePromise<AutomationRuleResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/automation/rules',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @returns AutomationExecutionResponse OK
     * @throws ApiError
     */
    public static getExecutions(): CancelablePromise<Array<AutomationExecutionResponse>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/automation/executions',
        });
    }
    /**
     * @returns AutomationDashboardResponse OK
     * @throws ApiError
     */
    public static getDashboard4(): CancelablePromise<AutomationDashboardResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/automation/dashboard',
        });
    }
}
