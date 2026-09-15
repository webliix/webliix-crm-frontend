/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApiResponseListProjectCommentResponse } from '../models/ApiResponseListProjectCommentResponse';
import type { ApiResponseListProjectMemberResponse } from '../models/ApiResponseListProjectMemberResponse';
import type { ApiResponseListProjectMilestoneResponse } from '../models/ApiResponseListProjectMilestoneResponse';
import type { ApiResponseListProjectTaskResponse } from '../models/ApiResponseListProjectTaskResponse';
import type { ApiResponsePageProjectResponse } from '../models/ApiResponsePageProjectResponse';
import type { ApiResponseProjectCommentResponse } from '../models/ApiResponseProjectCommentResponse';
import type { ApiResponseProjectDashboardResponse } from '../models/ApiResponseProjectDashboardResponse';
import type { ApiResponseProjectMemberResponse } from '../models/ApiResponseProjectMemberResponse';
import type { ApiResponseProjectMilestoneResponse } from '../models/ApiResponseProjectMilestoneResponse';
import type { ApiResponseProjectResponse } from '../models/ApiResponseProjectResponse';
import type { ApiResponseProjectTaskResponse } from '../models/ApiResponseProjectTaskResponse';
import type { ApiResponseVoid } from '../models/ApiResponseVoid';
import type { CreateProjectCommentRequest } from '../models/CreateProjectCommentRequest';
import type { CreateProjectMemberRequest } from '../models/CreateProjectMemberRequest';
import type { CreateProjectMilestoneRequest } from '../models/CreateProjectMilestoneRequest';
import type { CreateProjectRequest } from '../models/CreateProjectRequest';
import type { CreateProjectTaskRequest } from '../models/CreateProjectTaskRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ProjectControllerService {
    /**
     * @param projectId
     * @param taskId
     * @param requestBody
     * @returns ApiResponseProjectTaskResponse OK
     * @throws ApiError
     */
    public static updateProjectTask(
        projectId: number,
        taskId: number,
        requestBody: CreateProjectTaskRequest,
    ): CancelablePromise<ApiResponseProjectTaskResponse> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/projects/{projectId}/tasks/{taskId}',
            path: {
                'projectId': projectId,
                'taskId': taskId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param projectId
     * @param taskId
     * @returns ApiResponseVoid OK
     * @throws ApiError
     */
    public static deleteProjectTask(
        projectId: number,
        taskId: number,
    ): CancelablePromise<ApiResponseVoid> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/projects/{projectId}/tasks/{taskId}',
            path: {
                'projectId': projectId,
                'taskId': taskId,
            },
        });
    }
    /**
     * @param projectId
     * @param milestoneId
     * @param requestBody
     * @returns ApiResponseProjectMilestoneResponse OK
     * @throws ApiError
     */
    public static updateProjectMilestone(
        projectId: number,
        milestoneId: number,
        requestBody: CreateProjectMilestoneRequest,
    ): CancelablePromise<ApiResponseProjectMilestoneResponse> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/projects/{projectId}/milestones/{milestoneId}',
            path: {
                'projectId': projectId,
                'milestoneId': milestoneId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param projectId
     * @param milestoneId
     * @returns ApiResponseVoid OK
     * @throws ApiError
     */
    public static deleteProjectMilestone(
        projectId: number,
        milestoneId: number,
    ): CancelablePromise<ApiResponseVoid> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/projects/{projectId}/milestones/{milestoneId}',
            path: {
                'projectId': projectId,
                'milestoneId': milestoneId,
            },
        });
    }
    /**
     * @param id
     * @returns ApiResponseProjectResponse OK
     * @throws ApiError
     */
    public static getProject(
        id: number,
    ): CancelablePromise<ApiResponseProjectResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/projects/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @param id
     * @param requestBody
     * @returns ApiResponseProjectResponse OK
     * @throws ApiError
     */
    public static updateProject(
        id: number,
        requestBody: CreateProjectRequest,
    ): CancelablePromise<ApiResponseProjectResponse> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/projects/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param id
     * @returns ApiResponseVoid OK
     * @throws ApiError
     */
    public static deleteProject(
        id: number,
    ): CancelablePromise<ApiResponseVoid> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/projects/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @param page
     * @param size
     * @returns ApiResponsePageProjectResponse OK
     * @throws ApiError
     */
    public static getProjects(
        page?: number,
        size: number = 20,
    ): CancelablePromise<ApiResponsePageProjectResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/projects',
            query: {
                'page': page,
                'size': size,
            },
        });
    }
    /**
     * @param requestBody
     * @returns ApiResponseProjectResponse OK
     * @throws ApiError
     */
    public static createProject(
        requestBody: CreateProjectRequest,
    ): CancelablePromise<ApiResponseProjectResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/projects',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param projectId
     * @returns ApiResponseListProjectTaskResponse OK
     * @throws ApiError
     */
    public static getProjectTasks(
        projectId: number,
    ): CancelablePromise<ApiResponseListProjectTaskResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/projects/{projectId}/tasks',
            path: {
                'projectId': projectId,
            },
        });
    }
    /**
     * @param projectId
     * @param requestBody
     * @returns ApiResponseProjectTaskResponse OK
     * @throws ApiError
     */
    public static addProjectTask(
        projectId: number,
        requestBody: CreateProjectTaskRequest,
    ): CancelablePromise<ApiResponseProjectTaskResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/projects/{projectId}/tasks',
            path: {
                'projectId': projectId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param projectId
     * @param taskId
     * @returns ApiResponseListProjectCommentResponse OK
     * @throws ApiError
     */
    public static getProjectComments(
        projectId: number,
        taskId: number,
    ): CancelablePromise<ApiResponseListProjectCommentResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/projects/{projectId}/tasks/{taskId}/comments',
            path: {
                'projectId': projectId,
                'taskId': taskId,
            },
        });
    }
    /**
     * @param projectId
     * @param taskId
     * @param requestBody
     * @returns ApiResponseProjectCommentResponse OK
     * @throws ApiError
     */
    public static addProjectComment(
        projectId: number,
        taskId: number,
        requestBody: CreateProjectCommentRequest,
    ): CancelablePromise<ApiResponseProjectCommentResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/projects/{projectId}/tasks/{taskId}/comments',
            path: {
                'projectId': projectId,
                'taskId': taskId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param projectId
     * @returns ApiResponseListProjectMilestoneResponse OK
     * @throws ApiError
     */
    public static getProjectMilestones(
        projectId: number,
    ): CancelablePromise<ApiResponseListProjectMilestoneResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/projects/{projectId}/milestones',
            path: {
                'projectId': projectId,
            },
        });
    }
    /**
     * @param projectId
     * @param requestBody
     * @returns ApiResponseProjectMilestoneResponse OK
     * @throws ApiError
     */
    public static addProjectMilestone(
        projectId: number,
        requestBody: CreateProjectMilestoneRequest,
    ): CancelablePromise<ApiResponseProjectMilestoneResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/projects/{projectId}/milestones',
            path: {
                'projectId': projectId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param projectId
     * @returns ApiResponseListProjectMemberResponse OK
     * @throws ApiError
     */
    public static getProjectMembers(
        projectId: number,
    ): CancelablePromise<ApiResponseListProjectMemberResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/projects/{projectId}/members',
            path: {
                'projectId': projectId,
            },
        });
    }
    /**
     * @param projectId
     * @param requestBody
     * @returns ApiResponseProjectMemberResponse OK
     * @throws ApiError
     */
    public static addProjectMember(
        projectId: number,
        requestBody: CreateProjectMemberRequest,
    ): CancelablePromise<ApiResponseProjectMemberResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/projects/{projectId}/members',
            path: {
                'projectId': projectId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param keyword
     * @param page
     * @param size
     * @returns ApiResponsePageProjectResponse OK
     * @throws ApiError
     */
    public static searchProjects(
        keyword: string,
        page?: number,
        size: number = 20,
    ): CancelablePromise<ApiResponsePageProjectResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/projects/search',
            query: {
                'keyword': keyword,
                'page': page,
                'size': size,
            },
        });
    }
    /**
     * @returns ApiResponseProjectDashboardResponse OK
     * @throws ApiError
     */
    public static getDashboard1(): CancelablePromise<ApiResponseProjectDashboardResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/projects/dashboard',
        });
    }
    /**
     * @param projectId
     * @param memberId
     * @returns ApiResponseVoid OK
     * @throws ApiError
     */
    public static removeProjectMember(
        projectId: number,
        memberId: number,
    ): CancelablePromise<ApiResponseVoid> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/projects/{projectId}/members/{memberId}',
            path: {
                'projectId': projectId,
                'memberId': memberId,
            },
        });
    }
}
