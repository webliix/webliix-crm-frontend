import { http } from "@/shared/services/http";

export type ReviewPlatform = 'WEBSITE' | 'GOOGLE' | 'TRUSTPILOT' | 'LINKEDIN' | 'OTHER';

export interface ReviewItem {
  id: number;
  authorName: string;
  companyName?: string;
  email?: string;
  rating: number;
  reviewText: string;
  platform: ReviewPlatform;
  platformUrl?: string;
  serviceUsed?: string;
  approved: boolean;
  featured: boolean;
  publishConsent?: boolean;
  createdAt: string;
}

export interface CreateReviewPayload {
  authorName: string;
  companyName?: string;
  email?: string;
  rating: number;
  reviewText: string;
  platform: ReviewPlatform;
  platformUrl?: string;
  serviceUsed?: string;
  publishConsent?: boolean;
}

export const reviewApi = {
  getAllReviews(page = 0, size = 20) {
    return http.get("/api/v1/reviews", { params: { page, size } });
  },

  createReview(data: CreateReviewPayload) {
    return http.post("/api/v1/reviews", data);
  },

  toggleApproved(id: number) {
    return http.put(`/api/v1/reviews/${id}/toggle-approved`);
  },

  toggleFeatured(id: number) {
    return http.put(`/api/v1/reviews/${id}/toggle-featured`);
  },

  deleteReview(id: number) {
    return http.delete(`/api/v1/reviews/${id}`);
  },
};
