import { useState } from "react";
import Box from "@mui/material/Box";
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
import SendIcon from "@mui/icons-material/Send";
import ReplyIcon from "@mui/icons-material/Reply";
import { AppDrawer } from "@/shared/components/ui/dialog";
import { AppButton } from "@/shared/components/ui/button";
import { AppTextField } from "@/shared/components/ui/form";
import { AppCard } from "@/shared/components/ui/card";
import { useBlogComments, useRelatedPosts } from "../hooks/useBlogPosts";
import { useLikeBlogPost, useAddBlogComment } from "../hooks/useBlogMutations";
import { notificationService } from "@/shared/notifications/notification.service";
import { tokens } from "@/theme/tokens";
import type { BlogPost, BlogComment } from "../types/blog.types";

interface BlogPreviewDrawerProps {
  post: BlogPost | null;
  open: boolean;
  onClose: () => void;
}

export function BlogPreviewDrawer({ post, open, onClose }: BlogPreviewDrawerProps) {
  const [commentName, setCommentName] = useState("");
  const [commentText, setCommentText] = useState("");
  const [replyingToId, setReplyingToId] = useState<number | null>(null);

  const { data: comments = [] } = useBlogComments(post?.id ?? null);
  const { data: relatedPosts = [] } = useRelatedPosts(post?.id);
  const likeMutation = useLikeBlogPost();
  const addCommentMutation = useAddBlogComment();

  if (!post) return null;

  const handleLike = () => {
    likeMutation.mutate(post.id);
  };

  const handleCopyLink = () => {
    const url = post.canonicalUrl || `https://webliix.com/blog/${post.slug}`;
    navigator.clipboard.writeText(url);
    notificationService.success("Article link copied to clipboard!");
  };

  const handleShareSocial = (platform: "whatsapp" | "linkedin" | "twitter") => {
    const url = encodeURIComponent(post.canonicalUrl || `https://webliix.com/blog/${post.slug}`);
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
        url: post.canonicalUrl || `https://webliix.com/blog/${post.slug}`,
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
    <AppDrawer
      open={open}
      onClose={onClose}
      title="Public Publication Preview"
      subtitle={`Previewing live layout for webliix.com/blog/${post.slug}`}
      width="lg"
    >
      <Box sx={{ maxWidth: 840, mx: "auto", display: "grid", gap: 3.5, pb: 4 }}>
        {/* Category & Date */}
        <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 1.5 }}>
          {post.category && (
            <Chip
              label={post.category}
              color="primary"
              size="small"
              sx={{ fontWeight: 700, borderRadius: 1 }}
            />
          )}
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, color: "text.secondary" }}>
            <CalendarTodayIcon sx={{ fontSize: 14 }} />
            <Typography variant="caption">
              {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : "Unpublished Draft"}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, color: "text.secondary" }}>
            <AccessTimeIcon sx={{ fontSize: 14 }} />
            <Typography variant="caption">{post.readingTimeMinutes || 3} min read</Typography>
          </Box>
        </Box>

        {/* Article Headline */}
        <Typography variant="h4" fontWeight={800} color={tokens.colors.secondary[900]} sx={{ lineHeight: 1.25 }}>
          {post.title}
        </Typography>

        {/* Executive Summary */}
        {post.summary && (
          <Typography variant="h6" color={tokens.colors.secondary[700]} sx={{ fontWeight: 400, lineHeight: 1.5, fontStyle: "italic" }}>
            {post.summary}
          </Typography>
        )}

        {/* Author Byline & Social Sharing Bar */}
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 2,
            py: 1.5,
            borderTop: `1px solid ${tokens.colors.secondary[200]}`,
            borderBottom: `1px solid ${tokens.colors.secondary[200]}`,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Avatar sx={{ bgcolor: tokens.colors.primary.main, width: 42, height: 42, fontWeight: 700 }}>
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

          {/* Social Share Buttons */}
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

        {/* Hero Cover Image (Cloudinary Responsive CDN) */}
        {post.coverImageUrl && (
          <Box sx={{ borderRadius: tokens.borderRadius.lg, overflow: "hidden", border: `1px solid ${tokens.colors.secondary[200]}` }}>
            <Box
              component="img"
              src={post.coverImageUrl}
              alt={post.coverImageAlt || post.title}
              sx={{ width: "100%", maxHeight: 440, objectFit: "cover", display: "block" }}
            />
            {post.coverImageCaption && (
              <Typography variant="caption" color="text.secondary" sx={{ display: "block", textAlign: "center", p: 1, bgcolor: tokens.colors.secondary[50] }}>
                {post.coverImageCaption}
              </Typography>
            )}
          </Box>
        )}

        {/* Main Article Content Body */}
        <Box
          sx={{
            lineHeight: 1.8,
            fontSize: "1.05rem",
            color: tokens.colors.secondary[900],
            "& h2": { fontSize: "1.75rem", fontWeight: 700, mt: 3, mb: 1.5, color: tokens.colors.secondary[900] },
            "& h3": { fontSize: "1.35rem", fontWeight: 700, mt: 2.5, mb: 1, color: tokens.colors.secondary[900] },
            "& p": { mb: 2 },
            "& strong": { fontWeight: 700 },
            "& em": { fontStyle: "italic" },
            "& u": { textDecoration: "underline" },
            "& mark": { bgcolor: "#fef08a", px: 0.75, py: 0.25, borderRadius: 0.5 },
            "& .blog-quote, & blockquote": {
              borderLeft: `4px solid ${tokens.colors.primary.main}`,
              pl: 2,
              my: 2.5,
              fontStyle: "italic",
              color: tokens.colors.secondary[800],
              bgcolor: tokens.colors.secondary[50],
              py: 1.25,
              borderRadius: `0 ${tokens.borderRadius.md} ${tokens.borderRadius.md} 0`,
            },
            "& .info-box": {
              p: 2,
              my: 2.5,
              borderRadius: tokens.borderRadius.md,
              bgcolor: "#e0f2fe",
              borderLeft: "4px solid #0284c7",
              color: "#0369a1",
            },
            "& .warning-box": {
              p: 2,
              my: 2.5,
              borderRadius: tokens.borderRadius.md,
              bgcolor: "#fef3c7",
              borderLeft: "4px solid #d97706",
              color: "#b45309",
            },
            "& pre": {
              p: 2,
              borderRadius: tokens.borderRadius.md,
              bgcolor: "#1e1e1e",
              color: "#d4d4d4",
              overflowX: "auto",
              fontFamily: "monospace",
              my: 2,
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
              my: 2,
              "& th, & td": {
                border: `1px solid ${tokens.colors.secondary[300]}`,
                p: 1.25,
              },
              "& th": { bgcolor: tokens.colors.secondary[100], fontWeight: 700 },
            },
            "& img, & .blog-img": {
              maxWidth: "100%",
              height: "auto",
              borderRadius: tokens.borderRadius.md,
              my: 2,
              display: "block",
            },
            "& figure, & .blog-figure": {
              my: 3,
              mx: 0,
              textAlign: "center",
              "& img": { mx: "auto" },
              "& figcaption": { fontSize: "0.875rem", color: "text.secondary", mt: 1, fontStyle: "italic" },
            },
            "& video": {
              maxWidth: "100%",
              borderRadius: tokens.borderRadius.md,
              my: 2,
            },
            "& .btn-primary": {
              display: "inline-block",
              px: 2.5,
              py: 1,
              bgcolor: tokens.colors.primary.main,
              color: "#ffffff !important",
              fontWeight: 700,
              borderRadius: tokens.borderRadius.md,
              textDecoration: "none",
              my: 2,
            },
          }}
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Tags */}
        {post.tags && (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, pt: 2 }}>
            {post.tags.split(",").map((tag) => (
              <Chip key={tag.trim()} label={`#${tag.trim()}`} variant="outlined" size="small" />
            ))}
          </Box>
        )}

        {/* Engagement / Like Section */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            p: 2.5,
            borderRadius: tokens.borderRadius.lg,
            bgcolor: tokens.colors.secondary[50],
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
              {(post.viewsCount || 0).toLocaleString()} Total Reads & Views
            </Typography>
          </Box>

          <AppButton appVariant="ghost" onClick={handleCopyLink} startIcon={<ContentCopyIcon sx={{ fontSize: 16 }} />}>
            Copy Article URL
          </AppButton>
        </Box>

        <Divider />

        {/* Related Articles Section */}
        {relatedPosts.length > 0 && (
          <Box sx={{ display: "grid", gap: 2 }}>
            <Typography variant="h6" fontWeight={700} color={tokens.colors.secondary[900]}>
              Related Publications
            </Typography>
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" }, gap: 2 }}>
              {relatedPosts.map((related) => (
                <AppCard key={related.id} sx={{ p: 2, display: "flex", flexDirection: "column" }}>
                  {related.coverImageUrl && (
                    <Box
                      component="img"
                      src={related.coverImageUrl}
                      alt={related.title}
                      sx={{ width: "100%", height: 110, objectFit: "cover", borderRadius: 1, mb: 1.5 }}
                    />
                  )}
                  <Typography variant="subtitle2" fontWeight={700} color={tokens.colors.secondary[900]} noWrap>
                    {related.title}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, flex: 1 }}>
                    {related.summary?.slice(0, 70)}...
                  </Typography>
                </AppCard>
              ))}
            </Box>
          </Box>
        )}

        <Divider />

        {/* Threaded Comments & Discussion */}
        <Box sx={{ display: "grid", gap: 2.5 }}>
          <Typography variant="h6" fontWeight={700} color={tokens.colors.secondary[900]}>
            Reader Discussion & Community ({comments.length})
          </Typography>

          {/* Comment Form */}
          <AppCard sx={{ p: 2.5 }}>
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
                  placeholder="Write a constructive comment or question..."
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
                    Post Comment
                  </AppButton>
                </Box>
              </Box>
            </form>
          </AppCard>

          {/* Nested Comments Thread */}
          {comments.map((comment) => (
            <Box key={comment.id} sx={{ display: "grid", gap: 1.5 }}>
              <AppCard sx={{ p: 2 }}>
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

              {/* Nested Replies */}
              {comment.replies && comment.replies.length > 0 && (
                <Box sx={{ pl: 4, display: "grid", gap: 1 }}>
                  {comment.replies.map((reply: BlogComment) => (
                    <AppCard key={reply.id} sx={{ p: 1.5, bgcolor: tokens.colors.secondary[50] }}>
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
      </Box>
    </AppDrawer>
  );
}
