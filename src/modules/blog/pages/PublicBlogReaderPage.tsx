import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import ShareIcon from "@mui/icons-material/Share";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import TwitterIcon from "@mui/icons-material/Twitter";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SendIcon from "@mui/icons-material/Send";
import ReplyIcon from "@mui/icons-material/Reply";
import { AppButton } from "@/shared/components/ui/button";
import { AppTextField } from "@/shared/components/ui/form";
import { AppCard } from "@/shared/components/ui/card";
import { CardSkeleton, EmptyState } from "@/shared/components/ui/feedback";
import { usePublicPostBySlug, useBlogComments, useRelatedPosts } from "../hooks/useBlogPosts";
import { useLikeBlogPost, useAddBlogComment } from "../hooks/useBlogMutations";
import { notificationService } from "@/shared/notifications/notification.service";
import { tokens } from "@/theme/tokens";
import type { BlogComment } from "../types/blog.types";

export function PublicBlogReaderPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const [commentName, setCommentName] = useState("");
  const [commentText, setCommentText] = useState("");
  const [replyingToId, setReplyingToId] = useState<number | null>(null);

  const { data: post, isLoading } = usePublicPostBySlug(slug);
  const { data: comments = [] } = useBlogComments(post?.id ?? null);
  const { data: relatedPosts = [] } = useRelatedPosts(post?.id);

  const likeMutation = useLikeBlogPost();
  const addCommentMutation = useAddBlogComment();

  // Update document title & inject SEO meta
  useEffect(() => {
    if (post) {
      document.title = `${post.seoTitle || post.title} | Webliix`;

      // Update meta description
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement("meta");
        metaDesc.setAttribute("name", "description");
        document.head.appendChild(metaDesc);
      }
      metaDesc.setAttribute("content", post.seoDescription || post.summary || post.title);

      // JSON-LD Structured Data
      const scriptId = "blog-jsonld";
      let script = document.getElementById(scriptId) as HTMLScriptElement | null;
      if (!script) {
        script = document.createElement("script");
        script.id = scriptId;
        script.type = "application/ld+json";
        document.head.appendChild(script);
      }
      script.text = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": post.seoTitle || post.title,
        "description": post.seoDescription || post.summary,
        "image": post.ogImageUrl || post.coverImageUrl,
        "author": { "@type": "Organization", "name": post.authorName || "Webliix" },
        "publisher": { "@type": "Organization", "name": "Webliix" },
        "datePublished": post.publishedAt || post.createdAt,
        "dateModified": post.updatedAt,
        "mainEntityOfPage": { "@type": "WebPage", "@id": post.canonicalUrl || window.location.href },
      });
    }
  }, [post]);

  if (isLoading) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <CardSkeleton />
      </Container>
    );
  }

  if (!post) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <EmptyState
          title="Article Not Found"
          message="The publication you are looking for does not exist or is not published yet."
          actionText="Back to All Articles"
          onAction={() => navigate("/blog")}
        />
      </Container>
    );
  }

  const handleLike = () => {
    likeMutation.mutate(post.id);
  };

  const handleCopyLink = () => {
    const url = post.canonicalUrl || window.location.href;
    navigator.clipboard.writeText(url);
    notificationService.success("Article link copied to clipboard!");
  };

  const handleShareSocial = (platform: "whatsapp" | "linkedin" | "twitter") => {
    const url = encodeURIComponent(post.canonicalUrl || window.location.href);
    const title = encodeURIComponent(post.title);

    let shareUrl = "";
    if (platform === "whatsapp") shareUrl = `https://api.whatsapp.com/send?text=${title}%20${url}`;
    if (platform === "linkedin") shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
    if (platform === "twitter") shareUrl = `https://twitter.com/intent/tweet?text=${title}&url=${url}`;

    window.open(shareUrl, "_blank", "noopener,noreferrer");
  };

  const handleNativeShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.summary || post.title,
        url: post.canonicalUrl || window.location.href,
      });
    } else {
      handleCopyLink();
    }
  };

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentName.trim() || !commentText.trim()) return;

    addCommentMutation.mutate(
      {
        id: post.id,
        comment: {
          authorName: commentName.trim(),
          content: commentText.trim(),
          parentId: replyingToId,
        },
      },
      {
        onSuccess: () => {
          setCommentText("");
          setReplyingToId(null);
        },
      }
    );
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f8fafc", py: 6 }}>
      <Container maxWidth="md">
        {/* Back Link */}
        <Box sx={{ mb: 4 }}>
          <AppButton
            appVariant="ghost"
            appSize="sm"
            startIcon={<ArrowBackIcon sx={{ fontSize: 16 }} />}
            onClick={() => navigate("/blog")}
          >
            Back to Publications
          </AppButton>
        </Box>

        {/* Article Header */}
        <Box sx={{ display: "grid", gap: 3, mb: 4 }}>
          <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 1.5 }}>
            {post.category && (
              <Chip label={post.category} color="primary" size="small" sx={{ fontWeight: 700, borderRadius: 1 }} />
            )}
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, color: "text.secondary" }}>
              <CalendarTodayIcon sx={{ fontSize: 14 }} />
              <Typography variant="caption">
                {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : ""}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, color: "text.secondary" }}>
              <AccessTimeIcon sx={{ fontSize: 14 }} />
              <Typography variant="caption">{post.readingTimeMinutes || 3} min read</Typography>
            </Box>
          </Box>

          <Typography variant="h3" fontWeight={800} color={tokens.colors.secondary[900]} sx={{ lineHeight: 1.2 }}>
            {post.title}
          </Typography>

          {post.summary && (
            <Typography variant="h6" color={tokens.colors.secondary[700]} sx={{ fontWeight: 400, lineHeight: 1.6, fontStyle: "italic" }}>
              {post.summary}
            </Typography>
          )}

          {/* Author & Share Bar */}
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 2,
              py: 2,
              borderTop: `1px solid ${tokens.colors.secondary[200]}`,
              borderBottom: `1px solid ${tokens.colors.secondary[200]}`,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Avatar sx={{ bgcolor: tokens.colors.primary.main, width: 44, height: 44, fontWeight: 700 }}>
                {post.authorName?.charAt(0) || "W"}
              </Avatar>
              <Box>
                <Typography variant="subtitle2" fontWeight={700} color={tokens.colors.secondary[900]}>
                  {post.authorName || "Webliix Editorial"}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Verified Publisher • Webliix Hub
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <AppButton appVariant="ghost" appSize="sm" onClick={handleNativeShare} startIcon={<ShareIcon sx={{ fontSize: 16 }} />}>
                Share
              </AppButton>
              <AppButton appVariant="ghost" appSize="sm" onClick={() => handleShareSocial("whatsapp")}>
                <WhatsAppIcon sx={{ fontSize: 18, color: "#25D366" }} />
              </AppButton>
              <AppButton appVariant="ghost" appSize="sm" onClick={() => handleShareSocial("linkedin")}>
                <LinkedInIcon sx={{ fontSize: 18, color: "#0077B5" }} />
              </AppButton>
              <AppButton appVariant="ghost" appSize="sm" onClick={() => handleShareSocial("twitter")}>
                <TwitterIcon sx={{ fontSize: 18, color: "#1DA1F2" }} />
              </AppButton>
              <AppButton appVariant="ghost" appSize="sm" onClick={handleCopyLink}>
                <ContentCopyIcon sx={{ fontSize: 16 }} />
              </AppButton>
            </Box>
          </Box>
        </Box>

        {/* Top Google Ad Slot Banner */}
        {post.enableAds && post.topAdSlotId && (
          <Box sx={{ p: 2, mb: 4, bgcolor: "#f8fafc", border: `1px dashed ${tokens.colors.secondary[300]}`, borderRadius: tokens.borderRadius.md, textAlign: "center" }}>
            <Typography variant="caption" color="text.secondary" fontWeight={700} display="block" sx={{ mb: 1, textTransform: "uppercase" }}>
              Advertisement
            </Typography>
            <Box
              component="ins"
              className="adsbygoogle"
              sx={{ display: "block" }}
              data-ad-client={post.adSenseClientId || "ca-pub-1234567890123456"}
              data-ad-slot={post.topAdSlotId}
              data-ad-format={post.adFormat || "auto"}
              data-full-width-responsive="true"
            />
          </Box>
        )}

        {/* Hero Cover Image */}
        {post.coverImageUrl && (
          <Box
            sx={{
              borderRadius: tokens.borderRadius.lg,
              overflow: "hidden",
              mb: 4,
              border: `1px solid ${tokens.colors.secondary[200]}`,
              aspectRatio: post.coverImageAspectRatio === "21:9" ? "21/9" : post.coverImageAspectRatio === "4:3" ? "4/3" : post.coverImageAspectRatio === "1:1" ? "1/1" : "16/9",
            }}
          >
            <Box
              component="img"
              src={post.coverImageUrl}
              alt={post.coverImageAlt || post.title}
              sx={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />
            {post.coverImageCaption && (
              <Typography variant="caption" color="text.secondary" sx={{ display: "block", textAlign: "center", p: 1, bgcolor: tokens.colors.secondary[50] }}>
                {post.coverImageCaption}
              </Typography>
            )}
          </Box>
        )}

        {/* Article Body */}
        <Box
          sx={{
            lineHeight: 1.8,
            fontSize: "1.1rem",
            color: tokens.colors.secondary[900],
            "& h2": { fontSize: "1.85rem", fontWeight: 700, mt: 4, mb: 2, color: tokens.colors.secondary[900] },
            "& h3": { fontSize: "1.4rem", fontWeight: 700, mt: 3, mb: 1.5, color: tokens.colors.secondary[900] },
            "& p": { mb: 2.5 },
            "& strong": { fontWeight: 700 },
            "& em": { fontStyle: "italic" },
            "& u": { textDecoration: "underline" },
            "& mark": { bgcolor: "#fef08a", px: 0.75, py: 0.25, borderRadius: 0.5 },
            "& .blog-quote, & blockquote": {
              borderLeft: `4px solid ${tokens.colors.primary.main}`,
              pl: 2.5,
              my: 3,
              fontStyle: "italic",
              color: tokens.colors.secondary[800],
              bgcolor: tokens.colors.secondary[50],
              py: 1.5,
              borderRadius: `0 ${tokens.borderRadius.md} ${tokens.borderRadius.md} 0`,
            },
            "& .info-box": {
              p: 2.5,
              my: 3,
              borderRadius: tokens.borderRadius.md,
              bgcolor: "#e0f2fe",
              borderLeft: "4px solid #0284c7",
              color: "#0369a1",
              fontSize: "1.05rem",
            },
            "& .warning-box": {
              p: 2.5,
              my: 3,
              borderRadius: tokens.borderRadius.md,
              bgcolor: "#fef3c7",
              borderLeft: "4px solid #d97706",
              color: "#b45309",
              fontSize: "1.05rem",
            },
            "& pre": {
              p: 2.5,
              borderRadius: tokens.borderRadius.md,
              bgcolor: "#1e1e1e",
              color: "#d4d4d4",
              overflowX: "auto",
              fontFamily: "monospace",
              my: 3,
            },
            "& code": {
              bgcolor: tokens.colors.secondary[100],
              px: 0.75,
              py: 0.25,
              borderRadius: 0.5,
              fontSize: "0.9em",
            },
            "& table, & .blog-table": {
              width: "100%",
              borderCollapse: "collapse",
              my: 3,
              "& th, & td": {
                border: `1px solid ${tokens.colors.secondary[300]}`,
                p: 1.5,
              },
              "& th": { bgcolor: tokens.colors.secondary[100], fontWeight: 700 },
            },
            "& img, & .blog-img": {
              maxWidth: "100%",
              height: "auto",
              borderRadius: tokens.borderRadius.md,
              my: 3,
              display: "block",
            },
            "& figure, & .blog-figure": {
              my: 3.5,
              mx: 0,
              textAlign: "center",
              "& img": { mx: "auto" },
              "& figcaption": { fontSize: "0.9rem", color: "text.secondary", mt: 1.25, fontStyle: "italic" },
            },
            "& video": {
              maxWidth: "100%",
              borderRadius: tokens.borderRadius.md,
              my: 3,
            },
            "& .btn-primary": {
              display: "inline-block",
              px: 3,
              py: 1.25,
              bgcolor: tokens.colors.primary.main,
              color: "#ffffff !important",
              fontWeight: 700,
              borderRadius: tokens.borderRadius.md,
              textDecoration: "none",
              my: 2.5,
              transition: "transform 0.2s ease",
              "&:hover": { transform: "translateY(-2px)" },
            },
            "& .webliix-ad-slot": {
              my: 4,
              p: 2,
              bgcolor: "#f8fafc",
              border: `1px dashed ${tokens.colors.secondary[300]}`,
              borderRadius: tokens.borderRadius.md,
              textAlign: "center",
            },
          }}
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Bottom Google Ad Slot Banner */}
        {post.enableAds && post.bottomAdSlotId && (
          <Box sx={{ p: 2, my: 4, bgcolor: "#f8fafc", border: `1px dashed ${tokens.colors.secondary[300]}`, borderRadius: tokens.borderRadius.md, textAlign: "center" }}>
            <Typography variant="caption" color="text.secondary" fontWeight={700} display="block" sx={{ mb: 1, textTransform: "uppercase" }}>
              Advertisement
            </Typography>
            <Box
              component="ins"
              className="adsbygoogle"
              sx={{ display: "block" }}
              data-ad-client={post.adSenseClientId || "ca-pub-1234567890123456"}
              data-ad-slot={post.bottomAdSlotId}
              data-ad-format={post.adFormat || "auto"}
              data-full-width-responsive="true"
            />
          </Box>
        )}

        {/* Tags */}
        {post.tags && (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, my: 4 }}>
            {post.tags.split(",").map((tag) => (
              <Chip key={tag.trim()} label={`#${tag.trim()}`} variant="outlined" size="small" />
            ))}
          </Box>
        )}

        {/* Engagement Section */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            p: 3,
            my: 4,
            borderRadius: tokens.borderRadius.lg,
            bgcolor: "#ffffff",
            border: `1px solid ${tokens.colors.secondary[200]}`,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <AppButton
              appVariant={post.likesCount > 0 ? "primary" : "secondary"}
              startIcon={post.likesCount > 0 ? <FavoriteIcon sx={{ color: "#ef4444" }} /> : <FavoriteBorderIcon />}
              onClick={handleLike}
              loading={likeMutation.isPending}
            >
              {post.likesCount || 0} Likes
            </AppButton>
            <Typography variant="body2" color="text.secondary">
              {(post.viewsCount || 0).toLocaleString()} Total Reads
            </Typography>
          </Box>

          <AppButton appVariant="ghost" onClick={handleCopyLink} startIcon={<ContentCopyIcon sx={{ fontSize: 16 }} />}>
            Copy Link
          </AppButton>
        </Box>

        <Divider sx={{ my: 4 }} />

        {/* Related Articles */}
        {relatedPosts.length > 0 && (
          <Box sx={{ display: "grid", gap: 2.5, mb: 6 }}>
            <Typography variant="h5" fontWeight={800} color={tokens.colors.secondary[900]}>
              Related Articles
            </Typography>
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" }, gap: 2.5 }}>
              {relatedPosts.map((related) => (
                <AppCard
                  key={related.id}
                  sx={{
                    p: 2,
                    cursor: "pointer",
                    transition: "transform 0.2s ease",
                    "&:hover": { transform: "translateY(-3px)" },
                  }}
                  onClick={() => navigate(`/blog/${related.slug}`)}
                >
                  {related.coverImageUrl && (
                    <Box
                      component="img"
                      src={related.coverImageUrl}
                      alt={related.title}
                      sx={{ width: "100%", height: 120, objectFit: "cover", borderRadius: 1, mb: 1.5 }}
                    />
                  )}
                  <Typography variant="subtitle2" fontWeight={700} color={tokens.colors.secondary[900]} noWrap>
                    {related.title}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: "block" }}>
                    {related.summary?.slice(0, 75)}...
                  </Typography>
                </AppCard>
              ))}
            </Box>
          </Box>
        )}

        <Divider sx={{ my: 4 }} />

        {/* Threaded Comments & Discussion */}
        <Box sx={{ display: "grid", gap: 3 }}>
          <Typography variant="h5" fontWeight={800} color={tokens.colors.secondary[900]}>
            Discussion ({comments.length})
          </Typography>

          {/* Comment Form */}
          <AppCard sx={{ p: 3 }}>
            <form onSubmit={handlePostComment}>
              <Box sx={{ display: "grid", gap: 2 }}>
                {replyingToId && (
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", bgcolor: tokens.colors.primary.light, p: 1, borderRadius: 1 }}>
                    <Typography variant="caption" fontWeight={600} color={tokens.colors.primary.contrastText}>
                      Replying to comment #{replyingToId}
                    </Typography>
                    <AppButton appVariant="ghost" appSize="sm" onClick={() => setReplyingToId(null)}>
                      Cancel Reply
                    </AppButton>
                  </Box>
                )}

                <AppTextField
                  placeholder="Your Name *"
                  value={commentName}
                  onChange={(e) => setCommentName(e.target.value)}
                  size="small"
                  required
                />

                <AppTextField
                  multiline
                  rows={3}
                  placeholder="Join the discussion..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  required
                />

                <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                  <AppButton
                    type="submit"
                    appVariant="primary"
                    startIcon={<SendIcon sx={{ fontSize: 16 }} />}
                    loading={addCommentMutation.isPending}
                    loadingText="Posting..."
                  >
                    Submit Comment
                  </AppButton>
                </Box>
              </Box>
            </form>
          </AppCard>

          {/* Nested Comments Thread */}
          {comments.map((comment) => (
            <Box key={comment.id} sx={{ display: "grid", gap: 1.5 }}>
              <AppCard sx={{ p: 2.5 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 0.5 }}>
                  <Typography variant="subtitle2" fontWeight={700} color={tokens.colors.secondary[900]}>
                    {comment.authorName}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </Typography>
                </Box>
                <Typography variant="body2" color={tokens.colors.secondary[800]} sx={{ my: 1 }}>
                  {comment.content}
                </Typography>
                <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                  <AppButton
                    appVariant="ghost"
                    appSize="sm"
                    startIcon={<ReplyIcon sx={{ fontSize: 14 }} />}
                    onClick={() => setReplyingToId(comment.id)}
                  >
                    Reply
                  </AppButton>
                </Box>
              </AppCard>

              {/* Replies */}
              {comment.replies && comment.replies.length > 0 && (
                <Box sx={{ pl: 4, display: "grid", gap: 1.5 }}>
                  {comment.replies.map((reply: BlogComment) => (
                    <AppCard key={reply.id} sx={{ p: 2, bgcolor: tokens.colors.secondary[50] }}>
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Typography variant="caption" fontWeight={700} color={tokens.colors.secondary[900]}>
                          {reply.authorName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(reply.createdAt).toLocaleDateString()}
                        </Typography>
                      </Box>
                      <Typography variant="body2" color={tokens.colors.secondary[800]} sx={{ mt: 0.5 }}>
                        {reply.content}
                      </Typography>
                    </AppCard>
                  ))}
                </Box>
              )}
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
}
export default PublicBlogReaderPage;
