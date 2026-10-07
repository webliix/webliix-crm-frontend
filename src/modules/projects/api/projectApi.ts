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
  documentationUrl?: string;
  architectureNotes?: string;
  customer?: {
    id: number;
    companyName: string;
    contactPerson: string;
    email: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateProjectPayload {
  projectName: string;
  description?: string;
  budget?: number;
  startDate?: string;
  expectedEndDate?: string;
  actualEndDate?: string;
  status?: string;
  priority?: string;
  customerId?: number;
  billable?: boolean;
  documentationUrl?: string;
  architectureNotes?: string;
  autoGeneratePhases?: boolean;
}

export interface ProjectMilestoneItem {
  id: number;
  projectId: number;
  title: string;
  milestoneName?: string;
  description?: string;
  dueDate?: string;
  completed?: boolean;
  completedAt?: string;
  status?: string;
}

export interface ProjectTaskItem {
  id: number;
  projectId: number;
  title: string;
  taskName?: string;
  description?: string;
  status: string;
  priority?: string;
  assignedTo?: string;
  startDate?: string;
  dueDate?: string;
  completedAt?: string;
}

export interface ProjectCommentItem {
  id: number;
  projectId: number;
  authorId?: number;
  authorName?: string;
  authorRole?: string;
  message: string;
  comment?: string;
  createdAt: string;
}

export const projectApi = {
  async getProjects(page = 0, size = 20, customerId?: number): Promise<{ content: ProjectItem[]; totalElements: number }> {
    try {
      const res = await http.get(`/api/v1/projects`, { params: { page, size, customerId } });
      const data = res.data?.data;
      if (Array.isArray(data)) {
        return { content: data, totalElements: data.length };
      }
      return {
        content: data?.content ?? [],
        totalElements: data?.totalElements ?? 0,
      };
    } catch {
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

  async createProject(payload: CreateProjectPayload): Promise<ProjectItem | null> {
    try {
      const res = await http.post(`/api/v1/projects`, payload);
      return res.data?.data ?? null;
    } catch {
      return null;
    }
  },

  async updateProject(id: number | string, payload: Partial<CreateProjectPayload>): Promise<ProjectItem | null> {
    try {
      const res = await http.put(`/api/v1/projects/${id}`, payload);
      return res.data?.data ?? null;
    } catch {
      return null;
    }
  },

  async updateProjectProgress(
    projectId: number | string,
    progressPercentage?: number,
    status?: string,
    updateNote?: string
  ): Promise<ProjectItem | null> {
    try {
      const res = await http.patch(`/api/v1/projects/${projectId}/progress`, null, {
        params: {
          progressPercentage,
          status,
          updateNote,
        },
      });
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

  async addMilestone(
    projectId: number | string,
    payload: { title: string; description?: string; dueDate?: string; completed?: boolean }
  ): Promise<ProjectMilestoneItem | null> {
    try {
      const res = await http.post(`/api/v1/projects/${projectId}/milestones`, payload);
      return res.data?.data ?? null;
    } catch {
      return null;
    }
  },

  async updateMilestone(
    projectId: number | string,
    milestoneId: number | string,
    payload: { title?: string; description?: string; dueDate?: string; completed?: boolean }
  ): Promise<ProjectMilestoneItem | null> {
    try {
      const res = await http.put(`/api/v1/projects/${projectId}/milestones/${milestoneId}`, payload);
      return res.data?.data ?? null;
    } catch {
      return null;
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

  async addTask(
    projectId: number | string,
    payload: { title: string; description?: string; status?: string; assignedTo?: string; dueDate?: string }
  ): Promise<ProjectTaskItem | null> {
    try {
      const res = await http.post(`/api/v1/projects/${projectId}/tasks`, payload);
      return res.data?.data ?? null;
    } catch {
      return null;
    }
  },

  async updateTask(
    projectId: number | string,
    taskId: number | string,
    payload: { title?: string; description?: string; status?: string; assignedTo?: string; dueDate?: string }
  ): Promise<ProjectTaskItem | null> {
    try {
      const res = await http.put(`/api/v1/projects/${projectId}/tasks/${taskId}`, payload);
      return res.data?.data ?? null;
    } catch {
      return null;
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

  async addComment(
    projectId: number | string,
    payload: { message: string; authorName?: string; authorRole?: string }
  ): Promise<ProjectCommentItem | null> {
    try {
      const res = await http.post(`/api/v1/projects/${projectId}/comments`, payload);
      return res.data?.data ?? null;
    } catch {
      return null;
    }
  },

  async getProjectMembers(projectId: number | string): Promise<ProjectMemberItem[]> {
    try {
      const res = await http.get(`/api/v1/projects/${projectId}/members`);
      return res.data?.data ?? [];
    } catch {
      return [];
    }
  },

  async addProjectMember(
    projectId: number | string,
    payload: { employeeId?: number; userId?: number; roleInProject?: string; assignedDate?: string }
  ): Promise<ProjectMemberItem | null> {
    try {
      const res = await http.post(`/api/v1/projects/${projectId}/members`, payload);
      return res.data?.data ?? null;
    } catch {
      return null;
    }
  },

  async removeProjectMember(projectId: number | string, memberId: number | string): Promise<boolean> {
    try {
      await http.delete(`/api/v1/projects/${projectId}/members/${memberId}`);
      return true;
    } catch {
      return false;
    }
  },
};

export interface ProjectMemberItem {
  id: number;
  projectId: number;
  userId?: number;
  employeeId?: number;
  employeeName?: string;
  employeeEmail?: string;
  employeeCode?: string;
  designationName?: string;
  departmentName?: string;
  roleInProject: string;
  assignedDate?: string;
}

