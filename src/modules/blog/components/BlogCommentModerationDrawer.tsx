import { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import ReportProblemOutlinedIcon from "@mui/icons-material/ReportProblemOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { AppDrawer } from "@/shared/components/ui/dialog";
import { AppButton } from "@/shared/components/ui/button";
import { AppCard } from "@/shared/components/ui/card";
import { EmptyState, CardSkeleton } from "@/shared/components/ui/feedback";
import { useAdminComments } from "../hooks/useBlogPosts";
import { useUpdateCommentStatus, useDeleteComment } from "../hooks/useBlogMutations";
import { tokens } from "@/theme/tokens";
import type { BlogCommentStatus } from "../types/blog.types";

interface BlogCommentModerationDrawerProps {
  open: boolean;
  onClose: () => void;
}

export function BlogCommentModerationDrawer({ open, onClose }: BlogCommentModerationDrawerProps) {
  const [selectedTab, setSelectedTab] = useState<number>(0);
  const statuses: (BlogCommentStatus | undefined)[] = [undefined, "PENDING", "APPROVED", "SPAM", "REJECTED"];
  const currentStatus = statuses[selectedTab];

  const { data: comments = [], isLoading } = useAdminComments(currentStatus);
  const updateStatusMutation = useUpdateCommentStatus();
  const deleteMutation = useDeleteComment();

  const handleStatusChange = (commentId: number, status: BlogCommentStatus) => {
    updateStatusMutation.mutate({ id: commentId, status });
  };

  const handleDelete = (commentId: number) => {
    if (window.confirm("Are you sure you want to permanently delete this comment?")) {
      deleteMutation.mutate(commentId);
    }
  };

  return (
    <AppDrawer
      open={open}
      onClose={onClose}
      title="Blog Comment Moderation Center"
      subtitle="Review reader engagements, prevent spam, and moderate community discussions"
      width="lg"
    >
      <Box sx={{ display: "grid", gap: 2.5 }}>
        {/* Status Filter Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs value={selectedTab} onChange={(_, val) => setSelectedTab(val)}>
            <Tab label="All Comments" />
            <Tab label="Pending Review" />
            <Tab label="Approved" />
            <Tab label="Spam / Flagged" />
            <Tab label="Rejected" />
          </Tabs>
        </Box>

        {/* Comment List */}
        {isLoading ? (
          <Box sx={{ display: "grid", gap: 1.5 }}>
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </Box>
        ) : comments.length === 0 ? (
          <EmptyState
            title="No Comments Found"
            message="There are no comments matching this moderation status."
          />
        ) : (
          <Box sx={{ display: "grid", gap: 2 }}>
            {comments.map((comment) => (
              <AppCard key={comment.id} sx={{ p: 2.5 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1 }}>
                  <Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Typography variant="subtitle2" fontWeight={700} color={tokens.colors.secondary[900]}>
                        {comment.authorName}
                      </Typography>
                      {comment.authorEmail && (
                        <Typography variant="caption" color="text.secondary">
                          ({comment.authorEmail})
                        </Typography>
                      )}
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      Posted on {new Date(comment.createdAt).toLocaleString()} • Post ID #{comment.postId}
                    </Typography>
                  </Box>

                  <Chip
                    size="small"
                    label={comment.status}
                    color={
                      comment.status === "APPROVED"
                        ? "success"
                        : comment.status === "PENDING"
                        ? "warning"
                        : "error"
                    }
                  />
                </Box>

                <Typography
                  variant="body2"
                  color={tokens.colors.secondary[800]}
                  sx={{ my: 1.5, whiteSpace: "pre-wrap", bgcolor: tokens.colors.secondary[50], p: 1.5, borderRadius: 1 }}
                >
                  {comment.content}
                </Typography>

                {/* Moderation Actions */}
                <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "flex-end", gap: 1, pt: 1 }}>
                  {comment.status !== "APPROVED" && (
                    <AppButton
                      appVariant="secondary"
                      appSize="sm"
                      startIcon={<CheckCircleOutlineIcon sx={{ fontSize: 16 }} />}
                      onClick={() => handleStatusChange(comment.id, "APPROVED")}
                      loading={updateStatusMutation.isPending}
                    >
                      Approve
                    </AppButton>
                  )}

                  {comment.status !== "REJECTED" && (
                    <AppButton
                      appVariant="ghost"
                      appSize="sm"
                      startIcon={<HighlightOffIcon sx={{ fontSize: 16 }} />}
                      onClick={() => handleStatusChange(comment.id, "REJECTED")}
                      loading={updateStatusMutation.isPending}
                    >
                      Reject
                    </AppButton>
                  )}

                  {comment.status !== "SPAM" && (
                    <AppButton
                      appVariant="ghost"
                      appSize="sm"
                      startIcon={<ReportProblemOutlinedIcon sx={{ fontSize: 16 }} />}
                      onClick={() => handleStatusChange(comment.id, "SPAM")}
                      loading={updateStatusMutation.isPending}
                    >
                      Mark Spam
                    </AppButton>
                  )}

                  <AppButton
                    appVariant="danger"
                    appSize="sm"
                    startIcon={<DeleteOutlineIcon sx={{ fontSize: 16 }} />}
                    onClick={() => handleDelete(comment.id)}
                    loading={deleteMutation.isPending}
                  >
                    Delete
                  </AppButton>
                </Box>
              </AppCard>
            ))}
          </Box>
        )}
      </Box>
    </AppDrawer>
  );
}
