import { useState, useMemo } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import StarIcon from "@mui/icons-material/Star";
import { AppDataTable, type DataTableColumn } from "@/shared/components/ui/table";
import { AppButton } from "@/shared/components/ui/button";
import { AppTextField } from "@/shared/components/ui/form";
import { AppStatusChip } from "@/shared/components/ui/feedback";
import { useBlogPosts } from "../hooks/useBlogPosts";
import { useDeleteBlogPost, useSetPostStatus } from "../hooks/useBlogMutations";
import { tokens } from "@/theme/tokens";
import type { BlogPost, BlogPostStatus } from "../types/blog.types";

interface BlogTableProps {
  onEdit: (post: BlogPost) => void;
  onPreview: (post: BlogPost) => void;
}

export function BlogTable({ onEdit, onPreview }: BlogTableProps) {
  const [selectedStatus, setSelectedStatus] = useState<BlogPostStatus | "ALL">("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const statusParam = selectedStatus === "ALL" ? undefined : selectedStatus;
  const { data: posts = [], isLoading } = useBlogPosts(statusParam);
  const deleteMutation = useDeleteBlogPost();
  const setStatusMutation = useSetPostStatus();

  const filteredPosts = useMemo(() => {
    if (!searchQuery.trim()) return posts;
    const q = searchQuery.toLowerCase();
    return posts.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.slug.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q) ||
        p.authorName?.toLowerCase().includes(q) ||
        p.tags?.toLowerCase().includes(q)
    );
  }, [posts, searchQuery]);

  const handleDelete = (post: BlogPost) => {
    if (window.confirm(`Are you sure you want to permanently delete "${post.title}"?`)) {
      deleteMutation.mutate(post.id);
    }
  };

  const handleToggleStatus = (post: BlogPost) => {
    const nextStatus: BlogPostStatus = post.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED";
    setStatusMutation.mutate({ id: post.id, status: nextStatus });
  };

  const columns: DataTableColumn<BlogPost>[] = [
    {
      field: "title",
      headerName: "Article & Media",
      flex: 1.5,
      render: (_, row) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, minWidth: 260 }}>
          {row.coverImageUrl ? (
            <Box
              component="img"
              src={row.coverImageUrl}
              alt={row.title}
              sx={{
                width: 54,
                height: 38,
                borderRadius: 1,
                objectFit: "cover",
                border: `1px solid ${tokens.colors.secondary[200]}`,
              }}
            />
          ) : (
            <Box
              sx={{
                width: 54,
                height: 38,
                borderRadius: 1,
                bgcolor: tokens.colors.secondary[100],
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 10,
                color: tokens.colors.secondary[500],
              }}
            >
              No Media
            </Box>
          )}
          <Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              {row.isFeatured && (
                <StarIcon sx={{ fontSize: 16, color: tokens.colors.warning.main }} />
              )}
              <Typography variant="body2" fontWeight={700} color={tokens.colors.secondary[900]} noWrap sx={{ maxWidth: 300 }}>
                {row.title}
              </Typography>
            </Box>
            <Typography variant="caption" color="text.secondary" display="block">
              /blog/{row.slug} • {row.readingTimeMinutes || 3} min read
            </Typography>
          </Box>
        </Box>
      ),
    },
    {
      field: "category",
      headerName: "Category & Author",
      flex: 1,
      render: (_, row) => (
        <Box>
          <Chip
            label={row.category || "General"}
            size="small"
            variant="outlined"
            color="primary"
            sx={{ fontWeight: 600, borderRadius: 1 }}
          />
          <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.5 }}>
            By {row.authorName || "Editorial"}
          </Typography>
        </Box>
      ),
    },
    {
      field: "status",
      headerName: "Status",
      flex: 0.8,
      render: (_, row) => {
        let statusType: "success" | "warning" | "default" | "error" = "default";
        if (row.status === "PUBLISHED") statusType = "success";
        else if (row.status === "SCHEDULED") statusType = "warning";
        else if (row.status === "ARCHIVED") statusType = "error";

        return (
          <Box>
            <AppStatusChip status={statusType} label={row.status} />
            {row.status === "SCHEDULED" && row.scheduledPublishAt && (
              <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.5 }}>
                {new Date(row.scheduledPublishAt).toLocaleDateString()}
              </Typography>
            )}
          </Box>
        );
      },
    },
    {
      field: "engagement",
      headerName: "Engagement",
      flex: 0.9,
      render: (_, row) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, color: "text.secondary" }}>
            <VisibilityOutlinedIcon sx={{ fontSize: 16 }} />
            <Typography variant="caption">{row.viewsCount || 0}</Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, color: "#ef4444" }}>
            <FavoriteOutlinedIcon sx={{ fontSize: 16 }} />
            <Typography variant="caption">{row.likesCount || 0}</Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, color: tokens.colors.primary.main }}>
            <ChatBubbleOutlineIcon sx={{ fontSize: 16 }} />
            <Typography variant="caption">{row.commentsCount || 0}</Typography>
          </Box>
        </Box>
      ),
    },
    {
      field: "publishedAt",
      headerName: "Date",
      flex: 0.8,
      render: (_, row) => (
        <Typography variant="caption" color="text.secondary">
          {row.publishedAt ? new Date(row.publishedAt).toLocaleDateString() : new Date(row.createdAt).toLocaleDateString()}
        </Typography>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      align: "right",
      flex: 1.2,
      render: (_, row) => (
        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 0.5 }}>
          <AppButton
            appVariant="ghost"
            appSize="sm"
            onClick={() => onPreview(row)}
            startIcon={<OpenInNewIcon sx={{ fontSize: 16 }} />}
          >
            Preview
          </AppButton>

          <AppButton
            appVariant="secondary"
            appSize="sm"
            onClick={() => handleToggleStatus(row)}
            loading={setStatusMutation.isPending}
          >
            {row.status === "PUBLISHED" ? "Unpublish" : "Publish"}
          </AppButton>

          <AppButton
            appVariant="ghost"
            appSize="sm"
            onClick={() => onEdit(row)}
            startIcon={<EditOutlinedIcon sx={{ fontSize: 16 }} />}
          />

          <AppButton
            appVariant="danger"
            appSize="sm"
            onClick={() => handleDelete(row)}
            startIcon={<DeleteOutlineIcon sx={{ fontSize: 16 }} />}
          />
        </Box>
      ),
    },
  ];

  return (
    <Box sx={{ display: "grid", gap: 2.5 }}>
      {/* Search & Status Filters */}
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 2,
        }}
      >
        <AppTextField
          placeholder="Search articles by title, slug, tag, or author..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ maxWidth: 360 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ fontSize: 20, color: "text.secondary" }} />
              </InputAdornment>
            ),
          }}
        />

        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
          {(["ALL", "PUBLISHED", "SCHEDULED", "DRAFT", "ARCHIVED"] as const).map((st) => (
            <AppButton
              key={st}
              appVariant={selectedStatus === st ? "primary" : "ghost"}
              appSize="sm"
              onClick={() => setSelectedStatus(st)}
            >
              {st}
            </AppButton>
          ))}
        </Box>
      </Box>

      {/* Main Data Table */}
      <AppDataTable
        columns={columns}
        rows={filteredPosts}
        loading={isLoading}
        emptyTitle="No Blog Publications Found"
        emptyMessage="Create your first publication to start sharing technical articles and updates."
      />
    </Box>
  );
}
