import Box from "@mui/material/Box";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import EditNoteOutlinedIcon from "@mui/icons-material/EditNoteOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { AppStatCard } from "@/shared/components/ui/card";
import { CardSkeleton } from "@/shared/components/ui/feedback";
import { useBlogStatistics, useBlogPosts } from "../hooks/useBlogPosts";

export function BlogStatsHeader() {
  const { data: stats, isLoading: isStatsLoading } = useBlogStatistics();
  const { data: posts = [], isLoading: isListLoading } = useBlogPosts();

  if (isStatsLoading || isListLoading) {
    return (
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" },
          gap: 2.5,
        }}
      >
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </Box>
    );
  }

  const totalCount = stats?.totalPosts ?? posts.length;
  const publishedCount =
    stats?.publishedPosts ?? posts.filter((p) => p.status === "PUBLISHED").length;
  const draftCount =
    stats?.draftPosts ?? posts.filter((p) => p.status === "DRAFT").length;
  const totalViews =
    stats?.totalViews ?? posts.reduce((acc, p) => acc + (p.viewsCount || 0), 0);
  const totalLikes =
    stats?.totalLikes ?? posts.reduce((acc, p) => acc + (p.likesCount || 0), 0);

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" },
        gap: 2.5,
      }}
    >
      <AppStatCard
        title="Total Articles"
        value={totalCount}
        icon={<ArticleOutlinedIcon sx={{ fontSize: 24 }} />}
        color="primary"
        subtitle="All blog publications"
      />

      <AppStatCard
        title="Published Live"
        value={publishedCount}
        icon={<CheckCircleOutlineIcon sx={{ fontSize: 24 }} />}
        color="success"
        subtitle="Live on webliix.com"
      />

      <AppStatCard
        title="Drafts & In-Review"
        value={draftCount}
        icon={<EditNoteOutlinedIcon sx={{ fontSize: 24 }} />}
        color="warning"
        subtitle="Pending publications"
      />

      <AppStatCard
        title="Total Readers & Views"
        value={totalViews.toLocaleString()}
        icon={<VisibilityOutlinedIcon sx={{ fontSize: 24 }} />}
        color="info"
        subtitle={`${totalLikes.toLocaleString()} total likes`}
      />
    </Box>
  );
}
