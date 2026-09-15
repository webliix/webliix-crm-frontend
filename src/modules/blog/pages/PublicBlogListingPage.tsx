import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Chip from "@mui/material/Chip";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import StarIcon from "@mui/icons-material/Star";
import { AppCard } from "@/shared/components/ui/card";
import { AppButton } from "@/shared/components/ui/button";
import { AppTextField } from "@/shared/components/ui/form";
import { CardSkeleton, EmptyState } from "@/shared/components/ui/feedback";
import { usePublicBlogs, useBlogCategories } from "../hooks/useBlogPosts";
import { tokens } from "@/theme/tokens";
import type { BlogPost } from "../types/blog.types";

export function PublicBlogListingPage() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: posts = [], isLoading } = usePublicBlogs(selectedCategory === "ALL" ? undefined : selectedCategory);
  const { data: categories = [] } = useBlogCategories();

  const featuredPost = posts.find((p) => p.isFeatured) || posts[0];
  const remainingPosts = posts.filter((p) => p.id !== featuredPost?.id);

  const filteredPosts = remainingPosts.filter(
    (p) =>
      !searchQuery.trim() ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.summary?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tags?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f8fafc", py: 6 }}>
      <Container maxWidth="lg">
        {/* Header Section */}
        <Box sx={{ textAlign: "center", mb: 6 }}>
          <Typography
            variant="overline"
            fontWeight={800}
            color={tokens.colors.primary.main}
            sx={{ letterSpacing: 2 }}
          >
            WEBLIIX INSIGHTS & ENGINEERING
          </Typography>
          <Typography
            variant="h3"
            fontWeight={800}
            color={tokens.colors.secondary[900]}
            sx={{ mt: 1, mb: 2, fontSize: { xs: "2rem", md: "2.75rem" } }}
          >
            The Official Webliix Publication
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ maxWidth: 640, mx: "auto", fontSize: "1.1rem" }}
          >
            Deep architectural breakdowns, enterprise scaling strategies, and platform updates directly from our engineering team.
          </Typography>
        </Box>

        {/* Featured Hero Article */}
        {featuredPost && (
          <AppCard
            sx={{
              p: { xs: 2.5, md: 4 },
              mb: 6,
              cursor: "pointer",
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
              "&:hover": {
                transform: "translateY(-3px)",
                boxShadow: "0 16px 32px -8px rgba(0, 0, 0, 0.08)",
              },
            }}
            onClick={() => navigate(`/blog/${featuredPost.slug}`)}
          >
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1.2fr 1fr" }, gap: 4, alignItems: "center" }}>
              {featuredPost.coverImageUrl && (
                <Box
                  component="img"
                  src={featuredPost.coverImageUrl}
                  alt={featuredPost.title}
                  sx={{
                    width: "100%",
                    height: { xs: 220, md: 340 },
                    objectFit: "cover",
                    borderRadius: tokens.borderRadius.md,
                  }}
                />
              )}

              <Box sx={{ display: "grid", gap: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  <Chip
                    icon={<StarIcon sx={{ fontSize: 14 }} />}
                    label="FEATURED"
                    color="primary"
                    size="small"
                    sx={{ fontWeight: 800, borderRadius: 1 }}
                  />
                  {featuredPost.category && (
                    <Chip label={featuredPost.category} variant="outlined" size="small" sx={{ fontWeight: 600 }} />
                  )}
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, color: "text.secondary" }}>
                    <AccessTimeIcon sx={{ fontSize: 14 }} />
                    <Typography variant="caption">{featuredPost.readingTimeMinutes || 3} min read</Typography>
                  </Box>
                </Box>

                <Typography variant="h4" fontWeight={800} color={tokens.colors.secondary[900]} sx={{ lineHeight: 1.25 }}>
                  {featuredPost.title}
                </Typography>

                <Typography variant="body1" color={tokens.colors.secondary[700]} sx={{ lineHeight: 1.6 }}>
                  {featuredPost.summary || featuredPost.content?.slice(0, 180)}...
                </Typography>

                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", pt: 2 }}>
                  <Typography variant="caption" color="text.secondary">
                    By {featuredPost.authorName || "Webliix Editorial"} • {featuredPost.publishedAt ? new Date(featuredPost.publishedAt).toLocaleDateString() : ""}
                  </Typography>

                  <AppButton
                    appVariant="primary"
                    appSize="sm"
                    endIcon={<ArrowForwardIcon sx={{ fontSize: 16 }} />}
                  >
                    Read Article
                  </AppButton>
                </Box>
              </Box>
            </Box>
          </AppCard>
        )}

        {/* Search & Category Filter Bar */}
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 2,
            mb: 4,
          }}
        >
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            <AppButton
              appVariant={selectedCategory === "ALL" ? "primary" : "ghost"}
              appSize="sm"
              onClick={() => setSelectedCategory("ALL")}
            >
              All Topics
            </AppButton>
            {categories.map((cat) => (
              <AppButton
                key={cat.id}
                appVariant={selectedCategory === cat.name ? "primary" : "ghost"}
                appSize="sm"
                onClick={() => setSelectedCategory(cat.name)}
              >
                {cat.name}
              </AppButton>
            ))}
          </Box>

          <AppTextField
            placeholder="Search articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ maxWidth: 280 }}
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ fontSize: 18, color: "text.secondary" }} />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        {/* Article Grid */}
        {isLoading ? (
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)" }, gap: 3 }}>
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </Box>
        ) : filteredPosts.length === 0 ? (
          <EmptyState
            title="No Articles Found"
            message="There are no publications matching your search or category filter."
          />
        ) : (
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)" }, gap: 3 }}>
            {filteredPosts.map((post: BlogPost) => (
              <AppCard
                key={post.id}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  cursor: "pointer",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                  "&:hover": {
                    transform: "translateY(-3px)",
                    boxShadow: "0 12px 24px -6px rgba(0, 0, 0, 0.08)",
                  },
                }}
                onClick={() => navigate(`/blog/${post.slug}`)}
              >
                {post.coverImageUrl && (
                  <Box
                    component="img"
                    src={post.coverImageUrl}
                    alt={post.coverImageAlt || post.title}
                    sx={{ width: "100%", height: 190, objectFit: "cover" }}
                  />
                )}

                <Box sx={{ p: 2.5, flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                  <Box sx={{ display: "grid", gap: 1.5 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <Chip
                        label={post.category || "General"}
                        size="small"
                        color="primary"
                        variant="outlined"
                        sx={{ fontWeight: 600, fontSize: "0.7rem" }}
                      />
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, color: "text.secondary" }}>
                        <AccessTimeIcon sx={{ fontSize: 13 }} />
                        <Typography variant="caption">{post.readingTimeMinutes || 3} min</Typography>
                      </Box>
                    </Box>

                    <Typography variant="h6" fontWeight={700} color={tokens.colors.secondary[900]} sx={{ lineHeight: 1.3 }}>
                      {post.title}
                    </Typography>

                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.5 }}>
                      {post.summary?.slice(0, 110) || post.content?.slice(0, 110)}...
                    </Typography>
                  </Box>

                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", pt: 2, mt: 2, borderTop: `1px solid ${tokens.colors.secondary[100]}` }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, color: "text.secondary" }}>
                      <CalendarTodayIcon sx={{ fontSize: 13 }} />
                      <Typography variant="caption">
                        {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : ""}
                      </Typography>
                    </Box>

                    <Typography variant="caption" fontWeight={700} color={tokens.colors.primary.main}>
                      Read Article →
                    </Typography>
                  </Box>
                </Box>
              </AppCard>
            ))}
          </Box>
        )}
      </Container>
    </Box>
  );
}
export default PublicBlogListingPage;
