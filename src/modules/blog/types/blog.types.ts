export type BlogPostStatus = "DRAFT" | "SCHEDULED" | "PUBLISHED" | "ARCHIVED";
export type BlogCommentStatus = "PENDING" | "APPROVED" | "REJECTED" | "SPAM";
export type BlogResourceType = "IMAGE" | "VIDEO";

export interface BlogComment {
  id: number;
  postId: number;
  parentId?: number | null;
  authorName: string;
  authorEmail?: string;
  authorWebsite?: string;
  content: string;
  status: BlogCommentStatus;
  createdAt: string;
  updatedAt?: string;
  replies?: BlogComment[];
}

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  summary?: string;
  content: string;
  coverImageUrl?: string;
  coverImageAlt?: string;
  coverImageCaption?: string;
  authorName?: string;
  authorId?: number;
  category?: string;
  tags?: string;
  status: BlogPostStatus;
  isFeatured?: boolean;
  viewsCount: number;
  likesCount: number;
  commentsCount?: number;
  readingTimeMinutes: number;
  seoTitle?: string;
  seoDescription?: string;
  canonicalUrl?: string;
  ogImageUrl?: string;
  enableAds?: boolean;
  adSenseClientId?: string;
  topAdSlotId?: string;
  inlineAdSlotId?: string;
  bottomAdSlotId?: string;
  adFormat?: string;
  coverImageAlignment?: string;
  coverImageAspectRatio?: string;
  scheduledPublishAt?: string | null;
  publishedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  comments?: BlogComment[];
}

export interface CreateBlogPostRequest {
  title: string;
  slug?: string;
  summary?: string;
  content: string;
  coverImageUrl?: string;
  coverImageAlt?: string;
  coverImageCaption?: string;
  authorName?: string;
  category?: string;
  tags?: string;
  status?: BlogPostStatus;
  isFeatured?: boolean;
  readingTimeMinutes?: number;
  seoTitle?: string;
  seoDescription?: string;
  canonicalUrl?: string;
  ogImageUrl?: string;
  enableAds?: boolean;
  adSenseClientId?: string;
  topAdSlotId?: string;
  inlineAdSlotId?: string;
  bottomAdSlotId?: string;
  adFormat?: string;
  coverImageAlignment?: string;
  coverImageAspectRatio?: string;
  scheduledPublishAt?: string | null;
}

export interface BlogMedia {
  id: number;
  publicId: string;
  secureUrl: string;
  resourceType: BlogResourceType;
  format?: string;
  width?: number;
  height?: number;
  fileSize?: number;
  altText?: string;
  caption?: string;
  folder?: string;
  postId?: number;
  createdAt: string;
}

export interface BlogCategory {
  id: number;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  postCount?: number;
  createdAt?: string;
}

export interface BlogTag {
  id: number;
  name: string;
  slug: string;
  postCount?: number;
  createdAt?: string;
}

export interface BlogStatistics {
  totalPosts: number;
  publishedPosts: number;
  draftPosts: number;
  totalViews: number;
  totalLikes: number;
  totalComments: number;
}

export interface CreateBlogCommentRequest {
  parentId?: number | null;
  authorName: string;
  authorEmail?: string;
  authorWebsite?: string;
  content: string;
}
