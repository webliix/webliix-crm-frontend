import { useQuery } from "@tanstack/react-query";
import { blogService } from "../services/blog.service";
import type { BlogPostStatus, BlogCommentStatus } from "../types/blog.types";

export function useBlogPosts(status?: BlogPostStatus) {
  return useQuery({
    queryKey: ["blogs", "list", status],
    queryFn: () => blogService.getAllPosts(status),
    staleTime: 30 * 1000,
  });
}

export function useBlogPostDetails(postId: number | null) {
  return useQuery({
    queryKey: ["blogs", "detail", postId],
    queryFn: () => (postId ? blogService.getPostById(postId) : null),
    enabled: !!postId,
  });
}

export function useBlogStatistics() {
  return useQuery({
    queryKey: ["blogs", "statistics"],
    queryFn: () => blogService.getStatistics(),
    staleTime: 60 * 1000,
  });
}

export function useBlogComments(postId: number | null) {
  return useQuery({
    queryKey: ["blogs", "comments", postId],
    queryFn: () => (postId ? blogService.getPublicThreadedComments(postId) : []),
    enabled: !!postId,
  });
}

export function useAdminComments(status?: BlogCommentStatus) {
  return useQuery({
    queryKey: ["blogs", "admin-comments", status],
    queryFn: () => blogService.getCommentsForModeration(status),
    staleTime: 15 * 1000,
  });
}

export function useBlogCategories() {
  return useQuery({
    queryKey: ["blogs", "categories"],
    queryFn: () => blogService.getAllCategories(),
    staleTime: 60 * 1000,
  });
}

export function useBlogTags() {
  return useQuery({
    queryKey: ["blogs", "tags"],
    queryFn: () => blogService.getAllTags(),
    staleTime: 60 * 1000,
  });
}

export function useBlogMedia() {
  return useQuery({
    queryKey: ["blogs", "media"],
    queryFn: () => blogService.getAllMedia(),
    staleTime: 30 * 1000,
  });
}

export function usePublicBlogs(category?: string) {
  return useQuery({
    queryKey: ["blogs", "public", category],
    queryFn: () => blogService.getPublicPublishedPosts(category),
    staleTime: 60 * 1000,
  });
}

export function usePublicPostBySlug(slug?: string) {
  return useQuery({
    queryKey: ["blogs", "public-slug", slug],
    queryFn: () => (slug ? blogService.getPublicPostBySlug(slug) : null),
    enabled: !!slug,
  });
}

export function useRelatedPosts(postId?: number) {
  return useQuery({
    queryKey: ["blogs", "related", postId],
    queryFn: () => (postId ? blogService.getRelatedPosts(postId) : []),
    enabled: !!postId,
  });
}
