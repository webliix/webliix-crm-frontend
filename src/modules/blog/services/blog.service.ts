import { http } from "@/shared/services/http";
import type {
  BlogPost,
  CreateBlogPostRequest,
  BlogStatistics,
  BlogComment,
  CreateBlogCommentRequest,
  BlogMedia,
  BlogCategory,
  BlogTag,
  BlogPostStatus,
  BlogCommentStatus,
} from "../types/blog.types";

export const blogService = {
  // Admin Posts
  async getAllPosts(status?: BlogPostStatus): Promise<BlogPost[]> {
    const res = await http.get("/api/v1/blogs", { params: { status, size: 100 } });
    return res.data?.data?.content ?? res.data?.data ?? [];
  },

  async getPostById(id: number): Promise<BlogPost> {
    const res = await http.get(`/api/v1/blogs/${id}`);
    return res.data?.data;
  },

  async createPost(payload: CreateBlogPostRequest): Promise<BlogPost> {
    const res = await http.post("/api/v1/blogs", payload);
    return res.data?.data;
  },

  async updatePost(id: number, payload: CreateBlogPostRequest): Promise<BlogPost> {
    const res = await http.put(`/api/v1/blogs/${id}`, payload);
    return res.data?.data;
  },

  async deletePost(id: number): Promise<void> {
    await http.delete(`/api/v1/blogs/${id}`);
  },

  async setPostStatus(id: number, status: BlogPostStatus): Promise<void> {
    await http.put(`/api/v1/blogs/${id}/status`, null, { params: { status } });
  },

  async getStatistics(): Promise<BlogStatistics> {
    const res = await http.get("/api/v1/blogs/statistics");
    return res.data?.data;
  },

  // Media Storage via Cloudinary
  async uploadMedia(
    file: File,
    folder: string = "content",
    altText?: string,
    caption?: string,
    postId?: number
  ): Promise<BlogMedia> {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);
    if (altText) formData.append("altText", altText);
    if (caption) formData.append("caption", caption);
    if (postId) formData.append("postId", postId.toString());

    const res = await http.post("/api/v1/blogs/media/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return res.data?.data;
  },

  async deleteMedia(id: number): Promise<void> {
    await http.delete(`/api/v1/blogs/media/${id}`);
  },

  async getAllMedia(): Promise<BlogMedia[]> {
    const res = await http.get("/api/v1/blogs/media", { params: { size: 100 } });
    return res.data?.data?.content ?? res.data?.data ?? [];
  },

  // Comment Moderation
  async getCommentsForModeration(status?: BlogCommentStatus): Promise<BlogComment[]> {
    const res = await http.get("/api/v1/blogs/comments", { params: { status, size: 100 } });
    return res.data?.data?.content ?? res.data?.data ?? [];
  },

  async updateCommentStatus(commentId: number, status: BlogCommentStatus): Promise<BlogComment> {
    const res = await http.put(`/api/v1/blogs/comments/${commentId}/status`, { status });
    return res.data?.data;
  },

  async deleteComment(commentId: number): Promise<void> {
    await http.delete(`/api/v1/blogs/comments/${commentId}`);
  },

  // Categories & Tags
  async getAllCategories(): Promise<BlogCategory[]> {
    const res = await http.get("/api/v1/public/blogs/categories");
    return res.data?.data ?? [];
  },

  async createCategory(payload: { name: string; slug?: string; description?: string; imageUrl?: string }): Promise<BlogCategory> {
    const res = await http.post("/api/v1/blogs/categories", payload);
    return res.data?.data;
  },

  async deleteCategory(id: number): Promise<void> {
    await http.delete(`/api/v1/blogs/categories/${id}`);
  },

  async getAllTags(): Promise<BlogTag[]> {
    const res = await http.get("/api/v1/public/blogs/tags");
    return res.data?.data ?? [];
  },

  async createTag(payload: { name: string; slug?: string }): Promise<BlogTag> {
    const res = await http.post("/api/v1/blogs/tags", payload);
    return res.data?.data;
  },

  // Public Endpoints
  async getPublicPublishedPosts(category?: string): Promise<BlogPost[]> {
    const res = await http.get("/api/v1/public/blogs", { params: { category, size: 50 } });
    return res.data?.data?.content ?? res.data?.data ?? [];
  },

  async getPublicFeaturedPosts(): Promise<BlogPost[]> {
    const res = await http.get("/api/v1/public/blogs/featured");
    return res.data?.data ?? [];
  },

  async getPublicPostBySlug(slug: string): Promise<BlogPost> {
    const res = await http.get(`/api/v1/public/blogs/${slug}`);
    return res.data?.data;
  },

  async getRelatedPosts(postId: number, limit: number = 3): Promise<BlogPost[]> {
    const res = await http.get(`/api/v1/public/blogs/${postId}/related`, { params: { limit } });
    return res.data?.data ?? [];
  },

  async searchPublicPosts(keyword: string): Promise<BlogPost[]> {
    const res = await http.get("/api/v1/public/blogs/search", { params: { keyword, size: 20 } });
    return res.data?.data?.content ?? res.data?.data ?? [];
  },

  async likePost(id: number): Promise<boolean> {
    const res = await http.post(`/api/v1/public/blogs/${id}/like`);
    return Boolean(res.data?.data);
  },

  async recordView(id: number): Promise<boolean> {
    const res = await http.post(`/api/v1/public/blogs/${id}/view`);
    return Boolean(res.data?.data);
  },

  async addComment(id: number, comment: CreateBlogCommentRequest): Promise<BlogComment> {
    const res = await http.post(`/api/v1/public/blogs/${id}/comments`, comment);
    return res.data?.data;
  },

  async getPublicThreadedComments(id: number): Promise<BlogComment[]> {
    const res = await http.get(`/api/v1/public/blogs/${id}/comments`);
    return res.data?.data ?? [];
  },
};
