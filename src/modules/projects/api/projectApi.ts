import { http } from "@/shared/services/http";

export interface ProjectItem {
  id: number;
  projectName: string;
  projectCode: string;
  description?: string;
  budget?: number;
  startDate?: string;
  expectedEndDate?: string;
  dueDate?: string;
  actualEndDate?: string;
  status: string;
  priority?: string;
  progressPercentage: number;
  billable?: boolean;
  customerId?: number;
  customerName?: string;
  customerEmail?: string;
  customerCompanyName?: string;
  customer?: {
    id: number;
    companyName: string;
    contactPerson: string;
    email: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface ProjectMilestoneItem {
  id: number;
  projectId: number;
  milestoneName: string;
  description?: string;
  dueDate?: string;
  status?: string;
}

export interface ProjectTaskItem {
  id: number;
  projectId: number;
  taskName: string;
  description?: string;
  status: string;
  priority?: string;
  dueDate?: string;
}

export interface ProjectCommentItem {
  id: number;
  projectId: number;
  authorName: string;
  authorEmail: string;
  comment: string;
  createdAt: string;
}

export const projectApi = {
  async getProjects(page = 0, size = 20): Promise<{ content: ProjectItem[]; totalElements: number }> {
    try {
      const res = await http.get(`/api/v1/projects`, { params: { page, size } });
      const data = res.data?.data;
      if (Array.isArray(data)) {
        return { content: data, totalElements: data.length };
      }
      return {
        content: data?.content ?? [],
        totalElements: data?.totalElements ?? 0,
      };
    } catch (err) {
      return { content: [], totalElements: 0 };
    }
  },

  async getProject(id: number | string): Promise<ProjectItem | null> {
    try {
      const res = await http.get(`/api/v1/projects/${id}`);
      return res.data?.data ?? null;
    } catch {
      return null;
    }
  },

  async getMilestones(projectId: number | string): Promise<ProjectMilestoneItem[]> {
    try {
      const res = await http.get(`/api/v1/projects/${projectId}/milestones`);
      return res.data?.data ?? [];
    } catch {
      return [];
    }
  },

  async getTasks(projectId: number | string): Promise<ProjectTaskItem[]> {
    try {
      const res = await http.get(`/api/v1/projects/${projectId}/tasks`);
      return res.data?.data ?? [];
    } catch {
      return [];
    }
  },

  async getComments(projectId: number | string): Promise<ProjectCommentItem[]> {
    try {
      const res = await http.get(`/api/v1/projects/${projectId}/comments`);
      return res.data?.data ?? [];
    } catch {
      return [];
    }
  },

  async addComment(projectId: number | string, comment: string): Promise<ProjectCommentItem | null> {
    try {
      const res = await http.post(`/api/v1/projects/${projectId}/comments`, { comment });
      return res.data?.data ?? null;
    } catch {
      return null;
    }
  },
};
