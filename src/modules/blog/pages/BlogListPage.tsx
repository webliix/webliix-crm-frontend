import { useState } from "react";
import Box from "@mui/material/Box";
import AddIcon from "@mui/icons-material/Add";
import ForumOutlinedIcon from "@mui/icons-material/ForumOutlined";
import { PageLayout } from "@/shared/components/ui/layout";
import { AppButton } from "@/shared/components/ui/button";
import { BlogStatsHeader } from "../components/BlogStatsHeader";
import { BlogTable } from "../components/BlogTable";
import { BlogEditorDrawer } from "../components/BlogEditorDrawer";
import { BlogPreviewDrawer } from "../components/BlogPreviewDrawer";
import { BlogCommentModerationDrawer } from "../components/BlogCommentModerationDrawer";
import type { BlogPost } from "../types/blog.types";

export function BlogListPage() {
  const [editorOpen, setEditorOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [moderationOpen, setModerationOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  const handleCreate = () => {
    setSelectedPost(null);
    setEditorOpen(true);
  };

  const handleEdit = (post: BlogPost) => {
    setSelectedPost(post);
    setEditorOpen(true);
  };

  const handlePreview = (post: BlogPost) => {
    setSelectedPost(post);
    setPreviewOpen(true);
  };

  return (
    <PageLayout
      title="Blog CMS & Publications"
      breadcrumbs={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Blog CMS" },
      ]}
      actions={
        <Box sx={{ display: "flex", gap: 1.5 }}>
          <AppButton
            appVariant="secondary"
            startIcon={<ForumOutlinedIcon sx={{ fontSize: 18 }} />}
            onClick={() => setModerationOpen(true)}
          >
            Moderate Comments
          </AppButton>

          <AppButton
            appVariant="primary"
            startIcon={<AddIcon sx={{ fontSize: 18 }} />}
            onClick={handleCreate}
          >
            New Article
          </AppButton>
        </Box>
      }
    >
      <Box sx={{ display: "grid", gap: 3 }}>
        {/* Metric Cards Header */}
        <BlogStatsHeader />

        {/* Searchable Articles Table */}
        <BlogTable onEdit={handleEdit} onPreview={handlePreview} />

        {/* Editor Drawer */}
        <BlogEditorDrawer
          open={editorOpen}
          post={selectedPost}
          onClose={() => setEditorOpen(false)}
        />

        {/* High-Fidelity Public Reader Preview Drawer */}
        <BlogPreviewDrawer
          open={previewOpen}
          post={selectedPost}
          onClose={() => setPreviewOpen(false)}
        />

        {/* Comment Moderation Center Drawer */}
        <BlogCommentModerationDrawer
          open={moderationOpen}
          onClose={() => setModerationOpen(false)}
        />
      </Box>
    </PageLayout>
  );
}
export default BlogListPage;
