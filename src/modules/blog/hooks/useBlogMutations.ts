import { useMutation, useQueryClient } from "@tanstack/react-query";
import { blogService } from "../services/blog.service";
import { notificationService } from "@/shared/notifications/notification.service";
import type {
  CreateBlogPostRequest,
  CreateBlogCommentRequest,
  BlogPostStatus,
  BlogCommentStatus,
} from "../types/blog.types";

export function useCreateBlogPost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateBlogPostRequest) => blogService.createPost(payload),
    onSuccess: (newPost) => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
      notificationService.success(`Article "${newPost?.title || ""}" created successfully!`);
    },
    onError: (err: any) => {
      notificationService.error(err?.message || "Failed to create blog post");
    },
  });
}

export function useUpdateBlogPost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: CreateBlogPostRequest }) =>
      blogService.updatePost(id, payload),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
      notificationService.success(`Article "${updated?.title || ""}" updated!`);
    },
    onError: (err: any) => {
      notificationService.error(err?.message || "Failed to update blog post");
    },
  });
}

export function useSetPostStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: BlogPostStatus }) =>
      blogService.setPostStatus(id, status),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
      notificationService.success(`Article status changed to ${variables.status}`);
    },
    onError: (err: any) => {
      notificationService.error(err?.message || "Failed to change article status");
    },
  });
}

export function useDeleteBlogPost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => blogService.deletePost(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
      notificationService.success("Article deleted successfully");
    },
    onError: (err: any) => {
      notificationService.error(err?.message || "Failed to delete article");
    },
  });
}

export function useLikeBlogPost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => blogService.likePost(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["blogs", "detail", id] });
      queryClient.invalidateQueries({ queryKey: ["blogs", "public-slug"] });
      queryClient.invalidateQueries({ queryKey: ["blogs", "list"] });
    },
  });
}

export function useAddBlogComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, comment }: { id: number; comment: CreateBlogCommentRequest }) =>
      blogService.addComment(id, comment),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["blogs", "comments", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["blogs", "detail", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["blogs", "admin-comments"] });
      notificationService.success("Comment submitted successfully!");
    },
    onError: (err: any) => {
      notificationService.error(err?.message || "Failed to post comment");
    },
  });
}

export function useUpdateCommentStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: BlogCommentStatus }) =>
      blogService.updateCommentStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs", "admin-comments"] });
      queryClient.invalidateQueries({ queryKey: ["blogs", "comments"] });
      notificationService.success("Comment moderation status updated");
    },
    onError: (err: any) => {
      notificationService.error(err?.message || "Failed to update comment");
    },
  });
}

export function useDeleteComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => blogService.deleteComment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs", "admin-comments"] });
      queryClient.invalidateQueries({ queryKey: ["blogs", "comments"] });
      notificationService.success("Comment deleted");
    },
    onError: (err: any) => {
      notificationService.error(err?.message || "Failed to delete comment");
    },
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: { name: string; slug?: string; description?: string }) =>
      blogService.createCategory(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs", "categories"] });
      notificationService.success("Category created");
    },
    onError: (err: any) => {
      notificationService.error(err?.message || "Failed to create category");
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => blogService.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs", "categories"] });
      notificationService.success("Category deleted");
    },
    onError: (err: any) => {
      notificationService.error(err?.message || "Failed to delete category");
    },
  });
}
