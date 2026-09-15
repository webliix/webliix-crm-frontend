import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Chip from "@mui/material/Chip";
import Alert from "@mui/material/Alert";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import SaveIcon from "@mui/icons-material/Save";
import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import FormatUnderlinedIcon from "@mui/icons-material/FormatUnderlined";
import TitleIcon from "@mui/icons-material/Title";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";
import CodeIcon from "@mui/icons-material/Code";
import TableChartOutlinedIcon from "@mui/icons-material/TableChartOutlined";
import HorizontalRuleIcon from "@mui/icons-material/HorizontalRule";
import AddPhotoAlternateOutlinedIcon from "@mui/icons-material/AddPhotoAlternateOutlined";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import VisibilityIcon from "@mui/icons-material/Visibility";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import HighlightIcon from "@mui/icons-material/Highlight";
import SmartButtonIcon from "@mui/icons-material/SmartButton";
import CollectionsIcon from "@mui/icons-material/Collections";
import ImageIcon from "@mui/icons-material/Image";
import LinkIcon from "@mui/icons-material/Link";
import CategoryIcon from "@mui/icons-material/Category";
import CampaignIcon from "@mui/icons-material/Campaign";
import { AppDrawer } from "@/shared/components/ui/dialog";
import { AppButton } from "@/shared/components/ui/button";
import { AppTextField } from "@/shared/components/ui/form";
import { useCreateBlogPost, useUpdateBlogPost } from "../hooks/useBlogMutations";
import { useBlogCategories } from "../hooks/useBlogPosts";
import { blogService } from "../services/blog.service";
import { notificationService } from "@/shared/notifications/notification.service";
import { tokens } from "@/theme/tokens";
import type { BlogPost, CreateBlogPostRequest } from "../types/blog.types";

interface BlogEditorDrawerProps {
  post: BlogPost | null;
  open: boolean;
  onClose: () => void;
}

interface UploadedMediaItem {
  id: string;
  url: string;
  name: string;
  type: "image" | "video";
  uploadedAt: string;
}

export function BlogEditorDrawer({ post, open, onClose }: BlogEditorDrawerProps) {
  const isEditing = !!post;
  const createMutation = useCreateBlogPost();
  const updateMutation = useUpdateBlogPost();
  const { data: categories = [] } = useBlogCategories();

  const [activeTab, setActiveTab] = useState(0);
  const [editorMode, setEditorMode] = useState<"code" | "preview">("code");

  const coverInputRef = useRef<HTMLInputElement | null>(null);
  const inlineMediaInputRef = useRef<HTMLInputElement | null>(null);
  const galleryMediaInputRef = useRef<HTMLInputElement | null>(null);

  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [isUploadingInline, setIsUploadingInline] = useState(false);
  const [isUploadingGallery, setIsUploadingGallery] = useState(false);
  const [coverUrl, setCoverUrl] = useState<string>("");
  const [coverInputMode, setCoverInputMode] = useState<"upload" | "url">("upload");
  const [coverUrlInput, setCoverUrlInput] = useState<string>("");

  // Custom Inline Image URL states
  const [showUrlInsertBox, setShowUrlInsertBox] = useState(false);
  const [customImageUrl, setCustomImageUrl] = useState("");
  const [customImageAlt, setCustomImageAlt] = useState("");
  const [customImageCaption, setCustomImageCaption] = useState("");

  // Gallery URL input state
  const [galleryUrlInput, setGalleryUrlInput] = useState("");

  const [isFeatured, setIsFeatured] = useState(false);
  const [enableAds, setEnableAds] = useState(true);
  const [uploadedMediaList, setUploadedMediaList] = useState<UploadedMediaItem[]>([]);

  const { register, handleSubmit, reset, setValue, watch } = useForm<CreateBlogPostRequest>({
    defaultValues: {
      status: "DRAFT",
      category: "Engineering & Technology",
      authorName: "Webliix Editorial",
      readingTimeMinutes: 3,
      isFeatured: false,
      enableAds: true,
      adSenseClientId: "ca-pub-1234567890123456",
      adFormat: "auto",
      coverImageAlignment: "center",
      coverImageAspectRatio: "16:9",
    },
  });

  const contentWatch = watch("content") || "";
  const titleWatch = watch("title") || "";
  const summaryWatch = watch("summary") || "";
  const slugWatch = watch("slug") || "";
  const seoTitleWatch = watch("seoTitle") || "";
  const seoDescWatch = watch("seoDescription") || "";
  const statusWatch = watch("status") || "DRAFT";
  const ogImageUrlWatch = watch("ogImageUrl") || "";

  // Helper to extract image URLs from HTML or Markdown content
  const extractImagesFromContent = (htmlContent: string): UploadedMediaItem[] => {
    const items: UploadedMediaItem[] = [];
    const imgRegex = /<img[^>]+src=["']([^"']+)["'][^>]*>/gi;
    let match;
    let index = 1;
    while ((match = imgRegex.exec(htmlContent)) !== null) {
      const src = match[1];
      if (src && !items.some((i) => i.url === src)) {
        items.push({
          id: `extracted-${index++}`,
          url: src,
          name: `Inline Image ${index - 1}`,
          type: "image",
          uploadedAt: new Date().toLocaleDateString(),
        });
      }
    }
    const mdImgRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
    while ((match = mdImgRegex.exec(htmlContent)) !== null) {
      const alt = match[1] || `Inline Image ${index}`;
      const src = match[2];
      if (src && !items.some((i) => i.url === src)) {
        items.push({
          id: `extracted-md-${index++}`,
          url: src,
          name: alt,
          type: "image",
          uploadedAt: new Date().toLocaleDateString(),
        });
      }
    }
    return items;
  };

  // Sync post state
  useEffect(() => {
    if (post) {
      reset({
        title: post.title,
        slug: post.slug,
        summary: post.summary || "",
        content: post.content,
        coverImageUrl: post.coverImageUrl || "",
        coverImageAlt: post.coverImageAlt || "",
        coverImageCaption: post.coverImageCaption || "",
        authorName: post.authorName || "Webliix Editorial",
        category: post.category || "Engineering & Technology",
        tags: post.tags || "",
        status: post.status,
        isFeatured: post.isFeatured || false,
        readingTimeMinutes: post.readingTimeMinutes,
        seoTitle: post.seoTitle || "",
        seoDescription: post.seoDescription || "",
        canonicalUrl: post.canonicalUrl || "",
        ogImageUrl: post.ogImageUrl || "",
        enableAds: post.enableAds ?? true,
        adSenseClientId: post.adSenseClientId || "ca-pub-1234567890123456",
        topAdSlotId: post.topAdSlotId || "",
        inlineAdSlotId: post.inlineAdSlotId || "",
        bottomAdSlotId: post.bottomAdSlotId || "",
        adFormat: post.adFormat || "auto",
        coverImageAlignment: post.coverImageAlignment || "center",
        coverImageAspectRatio: post.coverImageAspectRatio || "16:9",
        scheduledPublishAt: post.scheduledPublishAt || null,
      });
      setCoverUrl(post.coverImageUrl || "");
      setCoverUrlInput(post.coverImageUrl || "");
      setIsFeatured(Boolean(post.isFeatured));
      setEnableAds(post.enableAds ?? true);

      const mediaItems: UploadedMediaItem[] = [];
      if (post.coverImageUrl) {
        mediaItems.push({
          id: "cover-img",
          url: post.coverImageUrl,
          name: "Cover / Hero Image",
          type: "image",
          uploadedAt: new Date().toLocaleDateString(),
        });
      }
      const extracted = extractImagesFromContent(post.content || "");
      extracted.forEach((item) => {
        if (!mediaItems.some((m) => m.url === item.url)) {
          mediaItems.push(item);
        }
      });
      setUploadedMediaList(mediaItems);
    } else {
      reset({
        title: "",
        slug: "",
        summary: "",
        content: "",
        coverImageUrl: "",
        coverImageAlt: "",
        coverImageCaption: "",
        authorName: "Webliix Editorial",
        category: "Engineering & Technology",
        tags: "",
        status: "DRAFT",
        isFeatured: false,
        readingTimeMinutes: 3,
        seoTitle: "",
        seoDescription: "",
        canonicalUrl: "",
        ogImageUrl: "",
        enableAds: true,
        adSenseClientId: "ca-pub-1234567890123456",
        topAdSlotId: "",
        inlineAdSlotId: "",
        bottomAdSlotId: "",
        adFormat: "auto",
        coverImageAlignment: "center",
        coverImageAspectRatio: "16:9",
        scheduledPublishAt: null,
      });
      setCoverUrl("");
      setCoverUrlInput("");
      setIsFeatured(false);
      setEnableAds(true);
      setUploadedMediaList([]);
    }
  }, [post, reset, open]);

  // Reading time estimate
  const readingTime = contentWatch
    ? Math.max(1, Math.ceil(contentWatch.replace(/<[^>]*>/g, " ").split(/\s+/).filter(Boolean).length / 200))
    : 1;

  // Insert HTML/Markdown snippet into content textarea at cursor
  const insertSnippet = (before: string, after: string = "", placeholder: string = "") => {
    const textarea = document.getElementById("blog-content-editor") as HTMLTextAreaElement | null;
    if (!textarea) {
      const newContent = contentWatch + "\n" + before + placeholder + after;
      setValue("content", newContent);
      return;
    }

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = contentWatch.substring(start, end) || placeholder;
    const replacement = before + selectedText + after;

    const updated = contentWatch.substring(0, start) + replacement + contentWatch.substring(end);
    setValue("content", updated);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, start + before.length + selectedText.length);
    }, 50);
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 50 * 1024 * 1024) {
      notificationService.error("File size exceeds 50MB limit. Please choose a smaller image or compress it.");
      return;
    }

    try {
      setIsUploadingCover(true);
      const media = await blogService.uploadMedia(file, "covers", titleWatch || file.name);
      setCoverUrl(media.secureUrl);
      setCoverUrlInput(media.secureUrl);
      setValue("coverImageUrl", media.secureUrl);
      setValue("ogImageUrl", media.secureUrl);

      setUploadedMediaList((prev) => [
        {
          id: String(media.id || Date.now()),
          url: media.secureUrl,
          name: file.name,
          type: "image",
          uploadedAt: new Date().toLocaleDateString(),
        },
        ...prev.filter((item) => item.url !== media.secureUrl),
      ]);

      notificationService.success("Cover image uploaded to CDN successfully!");
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || "Failed to upload cover image";
      notificationService.error(msg);
    } finally {
      setIsUploadingCover(false);
    }
  };

  const handleApplyCoverUrl = (urlToApply?: string) => {
    const targetUrl = (urlToApply || coverUrlInput || "").trim();
    if (!targetUrl) {
      notificationService.error("Please enter a valid Image URL");
      return;
    }
    setCoverUrl(targetUrl);
    setCoverUrlInput(targetUrl);
    setValue("coverImageUrl", targetUrl);
    setValue("ogImageUrl", targetUrl);

    setUploadedMediaList((prev) => [
      {
        id: `url-${Date.now()}`,
        url: targetUrl,
        name: "External Cover Image",
        type: "image",
        uploadedAt: new Date().toLocaleDateString(),
      },
      ...prev.filter((item) => item.url !== targetUrl),
    ]);

    notificationService.success("Cover image URL updated!");
  };

  const handleInlineMediaUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 50 * 1024 * 1024) {
      notificationService.error("File size exceeds 50MB limit. Please choose a smaller file.");
      return;
    }

    const isVideo = file.type.startsWith("video");
    const folder = isVideo ? "videos" : "content";

    try {
      setIsUploadingInline(true);
      const media = await blogService.uploadMedia(file, folder, file.name);

      setUploadedMediaList((prev) => [
        {
          id: String(media.id || Date.now()),
          url: media.secureUrl,
          name: file.name,
          type: isVideo ? "video" : "image",
          uploadedAt: new Date().toLocaleDateString(),
        },
        ...prev.filter((item) => item.url !== media.secureUrl),
      ]);

      if (isVideo) {
        const videoSnippet = `\n<video controls width="100%" poster="${media.secureUrl.replace(/\.[^/.]+$/, ".jpg")}" class="blog-video">\n  <source src="${media.secureUrl}" type="${file.type}">\n</video>\n<p class="caption">${file.name}</p>\n`;
        insertSnippet(videoSnippet);
      } else {
        const imageSnippet = `\n<figure class="blog-figure">\n  <img src="${media.secureUrl}" alt="${file.name}" class="blog-img" />\n  <figcaption>${file.name}</figcaption>\n</figure>\n`;
        insertSnippet(imageSnippet);
      }
      notificationService.success(`${isVideo ? "Video" : "Image"} uploaded and inserted as HTML tag!`);
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || "Failed to upload media";
      notificationService.error(msg);
    } finally {
      setIsUploadingInline(false);
      if (inlineMediaInputRef.current) inlineMediaInputRef.current.value = "";
    }
  };

  const handleInsertCustomImageUrl = () => {
    if (!customImageUrl.trim()) {
      notificationService.error("Please provide an Image URL");
      return;
    }

    const alt = customImageAlt.trim() || "Article Image";
    const caption = customImageCaption.trim();

    let snippet = "";
    if (caption) {
      snippet = `\n<figure class="blog-figure">\n  <img src="${customImageUrl.trim()}" alt="${alt}" class="blog-img" />\n  <figcaption>${caption}</figcaption>\n</figure>\n`;
    } else {
      snippet = `\n<img src="${customImageUrl.trim()}" alt="${alt}" class="blog-img" />\n`;
    }

    insertSnippet(snippet);

    setUploadedMediaList((prev) => [
      {
        id: `custom-url-${Date.now()}`,
        url: customImageUrl.trim(),
        name: alt,
        type: "image",
        uploadedAt: new Date().toLocaleDateString(),
      },
      ...prev.filter((item) => item.url !== customImageUrl.trim()),
    ]);

    setCustomImageUrl("");
    setCustomImageAlt("");
    setCustomImageCaption("");
    setShowUrlInsertBox(false);
    notificationService.success("Inserted image URL into article content!");
  };

  const handleGalleryMediaUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 50 * 1024 * 1024) {
      notificationService.error("File size exceeds 50MB limit. Please choose a smaller file.");
      return;
    }

    const isVideo = file.type.startsWith("video");
    const folder = isVideo ? "videos" : "content";

    try {
      setIsUploadingGallery(true);
      const media = await blogService.uploadMedia(file, folder, file.name);

      setUploadedMediaList((prev) => [
        {
          id: String(media.id || Date.now()),
          url: media.secureUrl,
          name: file.name,
          type: isVideo ? "video" : "image",
          uploadedAt: new Date().toLocaleDateString(),
        },
        ...prev.filter((item) => item.url !== media.secureUrl),
      ]);

      notificationService.success(`Uploaded ${file.name} to media gallery!`);
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || "Failed to upload to gallery";
      notificationService.error(msg);
    } finally {
      setIsUploadingGallery(false);
      if (galleryMediaInputRef.current) galleryMediaInputRef.current.value = "";
    }
  };

  const handleAddGalleryUrl = () => {
    if (!galleryUrlInput.trim()) {
      notificationService.error("Please enter a valid Image URL");
      return;
    }
    const newUrl = galleryUrlInput.trim();
    setUploadedMediaList((prev) => [
      {
        id: `gallery-url-${Date.now()}`,
        url: newUrl,
        name: "External Gallery Image",
        type: "image",
        uploadedAt: new Date().toLocaleDateString(),
      },
      ...prev.filter((item) => item.url !== newUrl),
    ]);
    setGalleryUrlInput("");
    notificationService.success("Image URL added to media gallery!");
  };

  const handleRemoveCover = () => {
    setCoverUrl("");
    setValue("coverImageUrl", "");
    if (coverInputRef.current) coverInputRef.current.value = "";
  };

  // Image actions for Gallery
  const handleSetAsCover = (url: string) => {
    setCoverUrl(url);
    setValue("coverImageUrl", url);
    notificationService.success("Set as article cover / hero image!");
  };

  const handleSetAsOgImage = (url: string) => {
    setValue("ogImageUrl", url);
    notificationService.success("Set as Open Graph social preview image!");
  };

  const handleInsertHtmlImgTag = (url: string, name: string) => {
    const htmlSnippet = `\n<img src="${url}" alt="${name || "Article Image"}" class="blog-img" />\n`;
    insertSnippet(htmlSnippet);
    setActiveTab(0);
    notificationService.success("Inserted <img> tag into article content!");
  };

  const handleInsertHtmlFigureTag = (url: string, name: string) => {
    const htmlSnippet = `\n<figure class="blog-figure">\n  <img src="${url}" alt="${name || "Article Image"}" class="blog-img" />\n  <figcaption>${name || "Image caption"}</figcaption>\n</figure>\n`;
    insertSnippet(htmlSnippet);
    setActiveTab(0);
    notificationService.success("Inserted <figure> with <figcaption> into article!");
  };

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    notificationService.success("Image URL copied to clipboard!");
  };

  const handleInsertAdSnippet = () => {
    const adSnippet = `\n<!-- Google Ads Unit Placement -->\n<div class="webliix-ad-slot" data-ad-format="auto" style="text-align:center; margin: 2rem 0; padding: 1rem; background: #f8fafc; border: 1px dashed #cbd5e1; border-radius: 8px;">\n  <span style="font-size:0.75rem; color:#94a3b8; font-weight:700; text-transform:uppercase;">Advertisement</span>\n</div>\n`;
    insertSnippet(adSnippet);
    setActiveTab(0);
    notificationService.success("Inserted Google Ad Unit placeholder into article!");
  };

  const onSubmit = (data: CreateBlogPostRequest) => {
    const payload: CreateBlogPostRequest = {
      ...data,
      coverImageUrl: coverUrl,
      isFeatured,
      enableAds,
      readingTimeMinutes: readingTime,
      seoTitle: data.seoTitle || data.title,
      seoDescription: data.seoDescription || data.summary,
    };

    if (isEditing && post) {
      updateMutation.mutate(
        { id: post.id, payload },
        {
          onSuccess: () => onClose(),
        }
      );
    } else {
      createMutation.mutate(payload, {
        onSuccess: () => onClose(),
      });
    }
  };

  return (
    <AppDrawer
      open={open}
      onClose={onClose}
      title={isEditing ? `Edit Article: ${post?.title}` : "Author New Blog Publication"}
      subtitle="HTML-formatted article content, Media Gallery, Google Ads monetization, and SEO controls"
      width="lg"
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Box sx={{ display: "grid", gap: 2.5 }}>
          {/* Top Navigation Tabs */}
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs value={activeTab} onChange={(_, val) => setActiveTab(val)}>
              <Tab label="1. Content & HTML Tags" icon={<CodeIcon sx={{ fontSize: 18 }} />} iconPosition="start" />
              <Tab
                label={`2. Media Gallery (${uploadedMediaList.length})`}
                icon={<CollectionsIcon sx={{ fontSize: 18 }} />}
                iconPosition="start"
              />
              <Tab label="3. SEO & Social Preview" icon={<VisibilityIcon sx={{ fontSize: 18 }} />} iconPosition="start" />
              <Tab label="4. Google Ads & Monetization" icon={<CampaignIcon sx={{ fontSize: 18 }} />} iconPosition="start" />
            </Tabs>
          </Box>

          {/* ============================================================ */}
          {/* TAB 1: ARTICLE CONTENT & HTML FORMATTING                     */}
          {/* ============================================================ */}
          {activeTab === 0 && (
            <Box sx={{ display: "grid", gap: 2.5 }}>
              {/* Title */}
              <Box>
                <Typography variant="caption" fontWeight={600} color={tokens.colors.secondary[700]} sx={{ mb: 0.5, display: "block" }}>
                  Article Title *
                </Typography>
                <AppTextField
                  placeholder="e.g. Building Enterprise Scalable Web Applications with Spring Boot & Cloudinary"
                  {...register("title", { required: true })}
                />
              </Box>

              {/* Slug, Category, Featured */}
              <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1.2fr 1fr auto" }, gap: 2, alignItems: "center" }}>
                <Box>
                  <Typography variant="caption" fontWeight={600} color={tokens.colors.secondary[700]} sx={{ mb: 0.5, display: "block" }}>
                    URL Slug (Auto-generated if empty)
                  </Typography>
                  <AppTextField placeholder="e.g. building-enterprise-scalable-web-apps" {...register("slug")} />
                </Box>

                <Box>
                  <Typography variant="caption" fontWeight={600} color={tokens.colors.secondary[700]} sx={{ mb: 0.5, display: "block" }}>
                    Category
                  </Typography>
                  <AppTextField select {...register("category")}>
                    {categories.map((cat) => (
                      <MenuItem key={cat.id} value={cat.name}>
                        {cat.name}
                      </MenuItem>
                    ))}
                  </AppTextField>
                </Box>

                <Box sx={{ pt: 2 }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={isFeatured}
                        onChange={(e) => setIsFeatured(e.target.checked)}
                        color="primary"
                      />
                    }
                    label="Featured Article"
                  />
                </Box>
              </Box>

              {/* Cover Image Upload & Direct Image URL Controls */}
              <Box sx={{ p: 2.5, bgcolor: tokens.colors.secondary[50], borderRadius: tokens.borderRadius.md, border: `1px solid ${tokens.colors.secondary[200]}` }}>
                <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", mb: 1.5, gap: 1 }}>
                  <Typography variant="subtitle2" fontWeight={700} color={tokens.colors.secondary[900]}>
                    Article Hero / Cover Image
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Box sx={{ bgcolor: tokens.colors.secondary[200], p: 0.5, borderRadius: 1, display: "flex", gap: 0.5 }}>
                      <AppButton
                        type="button"
                        appVariant={coverInputMode === "upload" ? "primary" : "ghost"}
                        appSize="sm"
                        onClick={() => setCoverInputMode("upload")}
                        startIcon={<CloudUploadOutlinedIcon sx={{ fontSize: 16 }} />}
                      >
                        📁 Upload File
                      </AppButton>
                      <AppButton
                        type="button"
                        appVariant={coverInputMode === "url" ? "primary" : "ghost"}
                        appSize="sm"
                        onClick={() => setCoverInputMode("url")}
                        startIcon={<LinkIcon sx={{ fontSize: 16 }} />}
                      >
                        🔗 Image URL
                      </AppButton>
                    </Box>
                    {coverUrl && (
                      <Chip label="Cover Active" color="success" size="small" sx={{ fontWeight: 700 }} />
                    )}
                  </Box>
                </Box>

                <input
                  type="file"
                  accept="image/*"
                  ref={coverInputRef}
                  style={{ display: "none" }}
                  onChange={handleCoverUpload}
                />

                {/* Input Mode 1: Local File Upload */}
                {coverInputMode === "upload" && !coverUrl && (
                  <Box
                    onClick={() => coverInputRef.current?.click()}
                    sx={{
                      p: 2.5,
                      border: `2px dashed ${tokens.colors.primary.main}`,
                      borderRadius: tokens.borderRadius.md,
                      bgcolor: "#ffffff",
                      textAlign: "center",
                      cursor: "pointer",
                      transition: "all 0.2s ease-in-out",
                      "&:hover": { bgcolor: tokens.colors.primary[50], borderColor: tokens.colors.primary.dark },
                    }}
                  >
                    <CloudUploadOutlinedIcon sx={{ fontSize: 32, color: tokens.colors.primary.main, mb: 0.5 }} />
                    <Typography variant="body2" fontWeight={700} color={tokens.colors.secondary[800]}>
                      {isUploadingCover ? "Uploading file to CDN..." : "Click or Drag & Drop to Upload Cover Image (Max 50MB)"}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Supports JPG, PNG, WEBP, GIF, SVG, AVIF
                    </Typography>
                  </Box>
                )}

                {/* Input Mode 2: Direct Image URL */}
                {coverInputMode === "url" && !coverUrl && (
                  <Box sx={{ p: 2, bgcolor: "#ffffff", borderRadius: tokens.borderRadius.md, border: `1px solid ${tokens.colors.secondary[300]}` }}>
                    <Typography variant="caption" fontWeight={600} color={tokens.colors.secondary[700]} sx={{ mb: 1, display: "block" }}>
                      Paste Direct Image URL (Unsplash, Cloudinary, AWS S3, or Web Link)
                    </Typography>
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <AppTextField
                        placeholder="https://images.unsplash.com/photo-12345678... or https://cdn.example.com/cover.jpg"
                        value={coverUrlInput}
                        onChange={(e) => setCoverUrlInput(e.target.value)}
                        size="small"
                        sx={{ flex: 1 }}
                      />
                      <AppButton
                        type="button"
                        appVariant="primary"
                        appSize="sm"
                        onClick={() => handleApplyCoverUrl()}
                        startIcon={<LinkIcon sx={{ fontSize: 16 }} />}
                      >
                        Apply Cover URL
                      </AppButton>
                    </Box>
                  </Box>
                )}

                {/* Active Cover Image Preview & Quick Actions */}
                {coverUrl && (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, alignItems: "center", p: 1.5, bgcolor: "#ffffff", borderRadius: tokens.borderRadius.md, border: `1px solid ${tokens.colors.secondary[300]}` }}>
                    <Box
                      component="img"
                      src={coverUrl}
                      alt="Cover preview"
                      sx={{ width: 140, height: 80, objectFit: "cover", borderRadius: 1, border: `1px solid ${tokens.colors.secondary[300]}` }}
                    />
                    <Box sx={{ flex: 1, minWidth: 200 }}>
                      <Typography variant="body2" fontWeight={700} noWrap sx={{ maxWidth: 380, color: tokens.colors.secondary[900] }}>
                        {coverUrl}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" display="block">
                        Active Article Hero / Cover Image
                      </Typography>
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}>
                        <AppButton
                          type="button"
                          appVariant="secondary"
                          appSize="sm"
                          onClick={() => coverInputRef.current?.click()}
                          loading={isUploadingCover}
                          startIcon={<CloudUploadOutlinedIcon sx={{ fontSize: 15 }} />}
                        >
                          Upload File
                        </AppButton>
                        <AppButton
                          type="button"
                          appVariant="ghost"
                          appSize="sm"
                          onClick={() => handleCopyUrl(coverUrl)}
                          startIcon={<ContentCopyIcon sx={{ fontSize: 15 }} />}
                        >
                          Copy Link
                        </AppButton>
                        <AppButton
                          type="button"
                          appVariant="danger"
                          appSize="sm"
                          startIcon={<DeleteOutlineIcon sx={{ fontSize: 15 }} />}
                          onClick={handleRemoveCover}
                        >
                          Remove Cover
                        </AppButton>
                      </Box>
                    </Box>
                  </Box>
                )}

                {/* Persistent Dual URL Input field below preview */}
                <Box sx={{ mt: 2 }}>
                  <Typography variant="caption" fontWeight={600} color={tokens.colors.secondary[700]} sx={{ mb: 0.5, display: "block" }}>
                    Cover Image Direct Link (Editable)
                  </Typography>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <AppTextField
                      placeholder="https://example.com/cover-image.jpg"
                      value={coverUrlInput}
                      onChange={(e) => {
                        setCoverUrlInput(e.target.value);
                        setCoverUrl(e.target.value);
                        setValue("coverImageUrl", e.target.value);
                      }}
                      size="small"
                      sx={{ flex: 1 }}
                    />
                    <AppButton
                      type="button"
                      appVariant="secondary"
                      appSize="sm"
                      onClick={() => handleApplyCoverUrl()}
                    >
                      Update
                    </AppButton>
                  </Box>
                </Box>

                {/* Cover Image Alignment & Aspect Ratio Controls */}
                <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2, mt: 2 }}>
                  <Box>
                    <Typography variant="caption" fontWeight={600} color={tokens.colors.secondary[700]} sx={{ mb: 0.5, display: "block" }}>
                      Cover Image Layout Alignment
                    </Typography>
                    <AppTextField select size="small" {...register("coverImageAlignment")}>
                      <MenuItem value="center">Centered (Standard)</MenuItem>
                      <MenuItem value="wide">Wide Banner</MenuItem>
                      <MenuItem value="full">Full Screen Width</MenuItem>
                      <MenuItem value="left">Floated Left</MenuItem>
                      <MenuItem value="right">Floated Right</MenuItem>
                    </AppTextField>
                  </Box>

                  <Box>
                    <Typography variant="caption" fontWeight={600} color={tokens.colors.secondary[700]} sx={{ mb: 0.5, display: "block" }}>
                      Aspect Ratio
                    </Typography>
                    <AppTextField select size="small" {...register("coverImageAspectRatio")}>
                      <MenuItem value="16:9">16:9 Landscape</MenuItem>
                      <MenuItem value="21:9">21:9 Ultra-Wide</MenuItem>
                      <MenuItem value="4:3">4:3 Standard</MenuItem>
                      <MenuItem value="1:1">1:1 Square</MenuItem>
                      <MenuItem value="auto">Original Auto</MenuItem>
                    </AppTextField>
                  </Box>
                </Box>
              </Box>

              {/* Cover Alt & Caption */}
              <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}>
                <AppTextField placeholder="Cover Image Alt Text" {...register("coverImageAlt")} />
                <AppTextField placeholder="Cover Image Caption / Credit" {...register("coverImageCaption")} />
              </Box>

              {/* Author & Tags */}
              <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}>
                <Box>
                  <Typography variant="caption" fontWeight={600} color={tokens.colors.secondary[700]} sx={{ mb: 0.5, display: "block" }}>
                    Author / Byline
                  </Typography>
                  <AppTextField placeholder="e.g. Webliix Engineering" {...register("authorName")} />
                </Box>

                <Box>
                  <Typography variant="caption" fontWeight={600} color={tokens.colors.secondary[700]} sx={{ mb: 0.5, display: "block" }}>
                    Tags (Comma separated)
                  </Typography>
                  <AppTextField placeholder="e.g. Engineering, Architecture, React, Cloudinary" {...register("tags")} />
                </Box>
              </Box>

              {/* Summary */}
              <Box>
                <Typography variant="caption" fontWeight={600} color={tokens.colors.secondary[700]} sx={{ mb: 0.5, display: "block" }}>
                  Executive Summary / Excerpt
                </Typography>
                <AppTextField
                  multiline
                  rows={2}
                  placeholder="Key takeaways and high-level summary of the article..."
                  {...register("summary")}
                />
              </Box>

              {/* ============================================================ */}
              {/* HTML TAG EDITOR & LIVE VISUAL PREVIEW TOGGLE                 */}
              {/* ============================================================ */}
              <Box>
                <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", mb: 1, gap: 1 }}>
                  <Typography variant="caption" fontWeight={700} color={tokens.colors.secondary[800]}>
                    Article Body (Formatted via HTML Tags) *
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Typography variant="caption" fontWeight={700} color={tokens.colors.primary.main}>
                      Est. Reading Time: ~{readingTime} min
                    </Typography>
                    <Box sx={{ bgcolor: tokens.colors.secondary[200], p: 0.5, borderRadius: 1, display: "flex", gap: 0.5 }}>
                      <AppButton
                        appVariant={editorMode === "code" ? "primary" : "ghost"}
                        appSize="sm"
                        onClick={() => setEditorMode("code")}
                        startIcon={<CodeIcon sx={{ fontSize: 16 }} />}
                      >
                        HTML Code
                      </AppButton>
                      <AppButton
                        appVariant={editorMode === "preview" ? "primary" : "ghost"}
                        appSize="sm"
                        onClick={() => setEditorMode("preview")}
                        startIcon={<VisibilityIcon sx={{ fontSize: 16 }} />}
                      >
                        Visual HTML Preview
                      </AppButton>
                    </Box>
                  </Box>
                </Box>

                {/* HTML Tag Formatting Toolbar */}
                {editorMode === "code" && (
                  <>
                    <Box
                      sx={{
                        p: 1.25,
                        borderRadius: `${tokens.borderRadius.md} ${tokens.borderRadius.md} 0 0`,
                        bgcolor: tokens.colors.secondary[100],
                        border: `1px solid ${tokens.colors.secondary[300]}`,
                        borderBottom: "none",
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 0.75,
                        alignItems: "center",
                      }}
                    >
                      {/* Headings */}
                      <AppButton appVariant="secondary" appSize="sm" onClick={() => insertSnippet("<h2>", "</h2>", "Section Heading")}>
                        <TitleIcon sx={{ fontSize: 16 }} /> &lt;h2&gt;
                      </AppButton>
                      <AppButton appVariant="secondary" appSize="sm" onClick={() => insertSnippet("<h3>", "</h3>", "Sub Heading")}>
                        <TitleIcon sx={{ fontSize: 14 }} /> &lt;h3&gt;
                      </AppButton>

                      {/* Formatting */}
                      <AppButton appVariant="ghost" appSize="sm" onClick={() => insertSnippet("<p>", "</p>", "Paragraph text goes here...")}>
                        &lt;p&gt;
                      </AppButton>
                      <AppButton appVariant="ghost" appSize="sm" onClick={() => insertSnippet("<strong>", "</strong>", "bold text")}>
                        <FormatBoldIcon sx={{ fontSize: 16 }} /> &lt;strong&gt;
                      </AppButton>
                      <AppButton appVariant="ghost" appSize="sm" onClick={() => insertSnippet("<em>", "</em>", "italic text")}>
                        <FormatItalicIcon sx={{ fontSize: 16 }} /> &lt;em&gt;
                      </AppButton>
                      <AppButton appVariant="ghost" appSize="sm" onClick={() => insertSnippet("<u>", "</u>", "underlined text")}>
                        <FormatUnderlinedIcon sx={{ fontSize: 16 }} /> &lt;u&gt;
                      </AppButton>
                      <AppButton appVariant="ghost" appSize="sm" onClick={() => insertSnippet("<mark>", "</mark>", "highlighted text")}>
                        <HighlightIcon sx={{ fontSize: 16 }} /> &lt;mark&gt;
                      </AppButton>

                      {/* Quotes & Alert Boxes */}
                      <AppButton appVariant="ghost" appSize="sm" onClick={() => insertSnippet('<blockquote class="blog-quote">\n  ', "\n</blockquote>", "Quote text here...")}>
                        <FormatQuoteIcon sx={{ fontSize: 16 }} /> &lt;blockquote&gt;
                      </AppButton>
                      <AppButton appVariant="ghost" appSize="sm" onClick={() => insertSnippet('<div class="info-box">\n  <strong>Info:</strong> ', "\n</div>", "Important note text...")}>
                        <InfoOutlinedIcon sx={{ fontSize: 16 }} /> Info Box
                      </AppButton>

                      {/* Lists */}
                      <AppButton appVariant="ghost" appSize="sm" onClick={() => insertSnippet('<ul class="blog-list">\n  <li>', "</li>\n  <li>Second item</li>\n</ul>", "First item")}>
                        <FormatListBulletedIcon sx={{ fontSize: 16 }} /> &lt;ul&gt;
                      </AppButton>
                      <AppButton appVariant="ghost" appSize="sm" onClick={() => insertSnippet('<ol class="blog-list">\n  <li>', "</li>\n  <li>Second item</li>\n</ol>", "First step")}>
                        <FormatListNumberedIcon sx={{ fontSize: 16 }} /> &lt;ol&gt;
                      </AppButton>

                      {/* Media, Links & Ad Slots */}
                      <AppButton appVariant="ghost" appSize="sm" onClick={() => insertSnippet('<a href="https://example.com" target="_blank" rel="noopener noreferrer">', "</a>", "Link text")}>
                        <LinkIcon sx={{ fontSize: 16 }} /> &lt;a&gt; Link
                      </AppButton>
                      <AppButton appVariant="ghost" appSize="sm" onClick={() => insertSnippet('<a href="https://webliix.com" class="btn-primary">', "</a>", "Call to Action Button")}>
                        <SmartButtonIcon sx={{ fontSize: 16 }} /> CTA Button
                      </AppButton>
                      <AppButton appVariant="ghost" appSize="sm" onClick={handleInsertAdSnippet}>
                        <CampaignIcon sx={{ fontSize: 16 }} /> Insert Google Ad Slot
                      </AppButton>
                      <AppButton appVariant="ghost" appSize="sm" onClick={() => insertSnippet('<pre><code class="language-javascript">\n', "\n</code></pre>", "// Your JavaScript code here")}>
                        <CodeIcon sx={{ fontSize: 16 }} /> &lt;code&gt;
                      </AppButton>
                      <AppButton appVariant="ghost" appSize="sm" onClick={() => insertSnippet('\n<table class="blog-table">\n  <thead>\n    <tr><th>Header 1</th><th>Header 2</th></tr>\n  </thead>\n  <tbody>\n    <tr><td>Data 1</td><td>Data 2</td></tr>\n  </tbody>\n</table>\n')}>
                        <TableChartOutlinedIcon sx={{ fontSize: 16 }} /> &lt;table&gt;
                      </AppButton>
                      <AppButton appVariant="ghost" appSize="sm" onClick={() => insertSnippet("\n<hr class=\"divider\" />\n")}>
                        <HorizontalRuleIcon sx={{ fontSize: 16 }} /> &lt;hr&gt;
                      </AppButton>

                      {/* Inline Uploaders & Image URL Input */}
                      <input
                        type="file"
                        accept="image/*,video/*"
                        ref={inlineMediaInputRef}
                        style={{ display: "none" }}
                        onChange={handleInlineMediaUpload}
                      />

                      <AppButton
                        type="button"
                        appVariant="secondary"
                        appSize="sm"
                        startIcon={<AddPhotoAlternateOutlinedIcon sx={{ fontSize: 16 }} />}
                        onClick={() => inlineMediaInputRef.current?.click()}
                        loading={isUploadingInline}
                      >
                        Upload & Insert HTML Img
                      </AppButton>

                      <AppButton
                        type="button"
                        appVariant="secondary"
                        appSize="sm"
                        startIcon={<LinkIcon sx={{ fontSize: 16 }} />}
                        onClick={() => setShowUrlInsertBox((prev) => !prev)}
                      >
                        Insert Image from URL
                      </AppButton>
                    </Box>

                    {/* Inline Image URL Form Box */}
                    {showUrlInsertBox && (
                      <Box sx={{ p: 2, bgcolor: tokens.colors.secondary[50], border: `1px solid ${tokens.colors.secondary[300]}`, borderBottom: "none", display: "grid", gap: 1.5 }}>
                        <Typography variant="subtitle2" fontWeight={700} color={tokens.colors.secondary[900]}>
                          🔗 Insert Image via Direct URL
                        </Typography>
                        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1.5fr 1fr 1fr auto" }, gap: 1.5, alignItems: "center" }}>
                          <AppTextField
                            placeholder="Image URL (https://images.unsplash.com/...)"
                            size="small"
                            value={customImageUrl}
                            onChange={(e) => setCustomImageUrl(e.target.value)}
                          />
                          <AppTextField
                            placeholder="Alt Text (e.g. Architecture)"
                            size="small"
                            value={customImageAlt}
                            onChange={(e) => setCustomImageAlt(e.target.value)}
                          />
                          <AppTextField
                            placeholder="Caption (Optional figure credit)"
                            size="small"
                            value={customImageCaption}
                            onChange={(e) => setCustomImageCaption(e.target.value)}
                          />
                          <Box sx={{ display: "flex", gap: 1 }}>
                            <AppButton
                              type="button"
                              appVariant="primary"
                              appSize="sm"
                              onClick={handleInsertCustomImageUrl}
                            >
                              Insert HTML Tag
                            </AppButton>
                            <AppButton
                              type="button"
                              appVariant="ghost"
                              appSize="sm"
                              onClick={() => setShowUrlInsertBox(false)}
                            >
                              Cancel
                            </AppButton>
                          </Box>
                        </Box>
                      </Box>
                    )}

                    {/* Content Textarea */}
                    <AppTextField
                      id="blog-content-editor"
                      multiline
                      rows={14}
                      placeholder="Write your article using standard HTML tags (e.g. <h2>Title</h2>, <p>Paragraph</p>, <img src='...' />)..."
                      {...register("content", { required: true })}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: `0 0 ${tokens.borderRadius.md} ${tokens.borderRadius.md}`,
                          fontFamily: "monospace",
                          fontSize: "0.95rem",
                          lineHeight: 1.6,
                        },
                      }}
                    />
                  </>
                )}

                {/* Live HTML Rendered Preview Mode */}
                {editorMode === "preview" && (
                  <Box
                    sx={{
                      minHeight: 400,
                      p: 3,
                      borderRadius: tokens.borderRadius.md,
                      bgcolor: "#ffffff",
                      border: `1px solid ${tokens.colors.secondary[300]}`,
                      lineHeight: 1.8,
                      fontSize: "1.05rem",
                      color: tokens.colors.secondary[900],
                      "& h2": { fontSize: "1.75rem", fontWeight: 700, mt: 3, mb: 1.5, color: tokens.colors.secondary[900] },
                      "& h3": { fontSize: "1.35rem", fontWeight: 700, mt: 2.5, mb: 1, color: tokens.colors.secondary[900] },
                      "& p": { mb: 2 },
                      "& strong": { fontWeight: 700 },
                      "& em": { fontStyle: "italic" },
                      "& u": { textDecoration: "underline" },
                      "& mark": { bgcolor: "#fef08a", px: 0.5, borderRadius: 0.5 },
                      "& .blog-quote, & blockquote": {
                        borderLeft: `4px solid ${tokens.colors.primary.main}`,
                        pl: 2,
                        my: 2.5,
                        fontStyle: "italic",
                        color: tokens.colors.secondary[700],
                        bgcolor: tokens.colors.secondary[50],
                        py: 1,
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
                        my: 2.5,
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
                        my: 2.5,
                        display: "block",
                      },
                      "& figure, & .blog-figure": {
                        my: 3,
                        mx: 0,
                        textAlign: "center",
                        "& img": { mx: "auto" },
                        "& figcaption": { fontSize: "0.875rem", color: "text.secondary", mt: 1, fontStyle: "italic" },
                      },
                      "& .btn-primary": {
                        display: "inline-block",
                        px: 2.5,
                        py: 1,
                        bgcolor: tokens.colors.primary.main,
                        color: "#ffffff",
                        fontWeight: 600,
                        borderRadius: tokens.borderRadius.md,
                        textDecoration: "none",
                        my: 2,
                      },
                    }}
                    dangerouslySetInnerHTML={{
                      __html: contentWatch || "<p><em>No HTML content authored yet. Switch to HTML Code tab to write content.</em></p>",
                    }}
                  />
                )}
              </Box>

              {/* Prebuilt HTML Formatting Templates Accordion */}
              <Accordion sx={{ bgcolor: tokens.colors.secondary[50], border: `1px solid ${tokens.colors.secondary[200]}` }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="subtitle2" fontWeight={700} color={tokens.colors.secondary[900]}>
                    💡 Quick HTML Formatting Guide & Prebuilt Article Templates
                  </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ display: "grid", gap: 1.5 }}>
                  <Alert severity="info">
                    You can insert standard HTML tags directly into your article content. Below are 1-click templates for rich article styling:
                  </Alert>

                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                    <AppButton
                      appVariant="secondary"
                      appSize="sm"
                      onClick={() =>
                        insertSnippet(
                          `<h2>Key Takeaways</h2>\n<div class="info-box">\n  <ul>\n    <li><strong>Point 1:</strong> High performance Cloudinary CDN delivery.</li>\n    <li><strong>Point 2:</strong> HTML tags for exact semantic structure.</li>\n  </ul>\n</div>\n`
                        )
                      }
                    >
                      + Insert Key Takeaways Box
                    </AppButton>

                    <AppButton
                      appVariant="secondary"
                      appSize="sm"
                      onClick={() =>
                        insertSnippet(
                          `<figure class="blog-figure">\n  <img src="${coverUrl || "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg"}" alt="Architecture Diagram" class="blog-img" />\n  <figcaption>Figure 1: High-level System Architecture Diagram</figcaption>\n</figure>\n`
                        )
                      }
                    >
                      + Insert Image with Figure Caption
                    </AppButton>

                    <AppButton
                      appVariant="secondary"
                      appSize="sm"
                      onClick={() =>
                        insertSnippet(
                          `<h2>Feature Comparison</h2>\n<table class="blog-table">\n  <thead>\n    <tr><th>Feature</th><th>Basic Plan</th><th>Enterprise Plan</th></tr>\n  </thead>\n  <tbody>\n    <tr><td>CDN Storage</td><td>10 GB</td><td>Unlimited Cloudinary CDN</td></tr>\n    <tr><td>HTML Editor</td><td>Standard</td><td>Advanced HTML Tags</td></tr>\n  </tbody>\n</table>\n`
                        )
                      }
                    >
                      + Insert Comparison Table
                    </AppButton>
                  </Box>
                </AccordionDetails>
              </Accordion>
            </Box>
          )}

          {/* ============================================================ */}
          {/* TAB 2: UPLOADED IMAGES & PLACEMENT GUIDE                     */}
          {/* ============================================================ */}
          {activeTab === 1 && (
            <Box sx={{ display: "grid", gap: 3 }}>
              <Box
                sx={{
                  p: 2.5,
                  borderRadius: tokens.borderRadius.md,
                  bgcolor: tokens.colors.secondary[50],
                  border: `1px solid ${tokens.colors.secondary[200]}`,
                  display: "grid",
                  gap: 2,
                }}
              >
                <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 2 }}>
                  <Box sx={{ maxWidth: 550 }}>
                    <Typography variant="subtitle1" fontWeight={700} color={tokens.colors.secondary[900]}>
                      Uploaded Article Images & Media Gallery
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Upload files or register external image URLs. Use 1-click actions to set cover image, social preview, or insert HTML tags.
                    </Typography>
                  </Box>

                  <input
                    type="file"
                    accept="image/*,video/*"
                    ref={galleryMediaInputRef}
                    style={{ display: "none" }}
                    onChange={handleGalleryMediaUpload}
                  />

                  <AppButton
                    type="button"
                    appVariant="primary"
                    startIcon={<CloudUploadOutlinedIcon sx={{ fontSize: 18 }} />}
                    onClick={() => galleryMediaInputRef.current?.click()}
                    loading={isUploadingGallery}
                  >
                    Upload New Image File
                  </AppButton>
                </Box>

                {/* Add External Image URL to Gallery Bar */}
                <Box sx={{ p: 1.5, bgcolor: "#ffffff", borderRadius: tokens.borderRadius.md, border: `1px dashed ${tokens.colors.secondary[300]}` }}>
                  <Typography variant="caption" fontWeight={600} color={tokens.colors.secondary[700]} sx={{ mb: 0.75, display: "block" }}>
                    Add Image via External URL
                  </Typography>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <AppTextField
                      placeholder="https://images.unsplash.com/photo-... or https://cdn.example.com/image.png"
                      size="small"
                      value={galleryUrlInput}
                      onChange={(e) => setGalleryUrlInput(e.target.value)}
                      sx={{ flex: 1 }}
                    />
                    <AppButton
                      type="button"
                      appVariant="secondary"
                      appSize="sm"
                      onClick={handleAddGalleryUrl}
                      startIcon={<LinkIcon sx={{ fontSize: 16 }} />}
                    >
                      Add to Gallery
                    </AppButton>
                  </Box>
                </Box>
              </Box>

              {uploadedMediaList.length === 0 ? (
                <Box
                  sx={{
                    p: 4,
                    textAlign: "center",
                    border: `2px dashed ${tokens.colors.secondary[300]}`,
                    borderRadius: tokens.borderRadius.md,
                  }}
                >
                  <ImageIcon sx={{ fontSize: 44, color: tokens.colors.secondary[400], mb: 1 }} />
                  <Typography variant="subtitle1" fontWeight={700} color={tokens.colors.secondary[800]}>
                    No Uploaded Images Yet
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Upload images to Cloudinary CDN to manage where and how to use them in your article.
                  </Typography>
                  <AppButton
                    appVariant="secondary"
                    onClick={() => galleryMediaInputRef.current?.click()}
                  >
                    Upload First Image
                  </AppButton>
                </Box>
              ) : (
                <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" }, gap: 2.5 }}>
                  {uploadedMediaList.map((media) => {
                    const isCurrentCover = media.url === coverUrl;
                    const isCurrentOg = media.url === ogImageUrlWatch;

                    return (
                      <Card
                        key={media.id || media.url}
                        variant="outlined"
                        sx={{
                          borderRadius: tokens.borderRadius.md,
                          borderColor: isCurrentCover ? tokens.colors.primary.main : tokens.colors.secondary[300],
                          borderWidth: isCurrentCover ? 2 : 1,
                        }}
                      >
                        <Box sx={{ position: "relative" }}>
                          <CardMedia
                            component="img"
                            height="160"
                            image={media.url}
                            alt={media.name}
                            sx={{ objectFit: "cover" }}
                          />
                          <Box sx={{ position: "absolute", top: 8, right: 8, display: "flex", gap: 0.5 }}>
                            {isCurrentCover && (
                              <Chip label="Cover Image" color="primary" size="small" sx={{ fontWeight: 700 }} />
                            )}
                            {isCurrentOg && (
                              <Chip label="OG Social Image" color="secondary" size="small" sx={{ fontWeight: 700 }} />
                            )}
                          </Box>
                        </Box>

                        <CardContent sx={{ p: 2, pb: 1 }}>
                          <Typography variant="subtitle2" fontWeight={700} noWrap color={tokens.colors.secondary[900]}>
                            {media.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" display="block" noWrap sx={{ fontFamily: "monospace", mb: 1.5 }}>
                            {media.url}
                          </Typography>

                          <Typography variant="caption" fontWeight={700} color={tokens.colors.secondary[700]} display="block" sx={{ mb: 1 }}>
                            WHERE & HOW TO USE THIS IMAGE:
                          </Typography>

                          <Box sx={{ display: "grid", gap: 1 }}>
                            <AppButton
                              appVariant={isCurrentCover ? "ghost" : "secondary"}
                              appSize="sm"
                              startIcon={<CategoryIcon sx={{ fontSize: 14 }} />}
                              onClick={() => handleSetAsCover(media.url)}
                              disabled={isCurrentCover}
                            >
                              {isCurrentCover ? "✓ Set as Cover / Hero Image" : "Use as Article Cover / Hero Image"}
                            </AppButton>

                            <AppButton
                              appVariant={isCurrentOg ? "ghost" : "secondary"}
                              appSize="sm"
                              startIcon={<VisibilityIcon sx={{ fontSize: 14 }} />}
                              onClick={() => handleSetAsOgImage(media.url)}
                              disabled={isCurrentOg}
                            >
                              {isCurrentOg ? "✓ Set as Open Graph Social Image" : "Use as Social Share Image (OG)"}
                            </AppButton>

                            <AppButton
                              appVariant="primary"
                              appSize="sm"
                              startIcon={<CodeIcon sx={{ fontSize: 14 }} />}
                              onClick={() => handleInsertHtmlImgTag(media.url, media.name)}
                            >
                              Insert HTML &lt;img&gt; into Article Body
                            </AppButton>

                            <AppButton
                              appVariant="ghost"
                              appSize="sm"
                              startIcon={<ImageIcon sx={{ fontSize: 14 }} />}
                              onClick={() => handleInsertHtmlFigureTag(media.url, media.name)}
                            >
                              Insert &lt;figure&gt; with Caption
                            </AppButton>
                          </Box>
                        </CardContent>

                        <CardActions sx={{ p: 2, pt: 0, justifyContent: "space-between" }}>
                          <AppButton
                            appVariant="ghost"
                            appSize="sm"
                            startIcon={<ContentCopyIcon sx={{ fontSize: 14 }} />}
                            onClick={() => handleCopyUrl(media.url)}
                          >
                            Copy Direct URL
                          </AppButton>
                        </CardActions>
                      </Card>
                    );
                  })}
                </Box>
              )}
            </Box>
          )}

          {/* ============================================================ */}
          {/* TAB 3: SEO, META & SOCIAL PREVIEW                            */}
          {/* ============================================================ */}
          {activeTab === 2 && (
            <Box sx={{ display: "grid", gap: 3 }}>
              <Box
                sx={{
                  p: 2.5,
                  borderRadius: tokens.borderRadius.md,
                  bgcolor: "#ffffff",
                  border: `1px solid ${tokens.colors.secondary[200]}`,
                }}
              >
                <Typography variant="subtitle2" fontWeight={700} color={tokens.colors.secondary[900]} sx={{ mb: 1.5 }}>
                  Google Search Result Preview (SERP)
                </Typography>
                <Box sx={{ fontFamily: "Arial, sans-serif" }}>
                  <Typography variant="caption" color="text.secondary" display="block">
                    https://webliix.com › blog › {slugWatch || "article-slug"}
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{ color: "#1a0dab", fontWeight: 500, fontSize: "1.1rem", "&:hover": { textDecoration: "underline" }, cursor: "pointer" }}
                  >
                    {seoTitleWatch || titleWatch || "Enter an article title to preview Google SERP"}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#4d5156", mt: 0.5 }}>
                    {seoDescWatch || summaryWatch || "Enter a meta description or summary to see how search engines display your snippet."}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: "grid", gap: 2 }}>
                <Box>
                  <Typography variant="caption" fontWeight={600} color={tokens.colors.secondary[700]} sx={{ mb: 0.5, display: "block" }}>
                    SEO Meta Title (Recommended: 50-60 characters)
                  </Typography>
                  <AppTextField
                    placeholder="Custom search title tag (Leave empty to use article title)"
                    {...register("seoTitle")}
                  />
                </Box>

                <Box>
                  <Typography variant="caption" fontWeight={600} color={tokens.colors.secondary[700]} sx={{ mb: 0.5, display: "block" }}>
                    SEO Meta Description (Recommended: 120-160 characters)
                  </Typography>
                  <AppTextField
                    multiline
                    rows={3}
                    placeholder="Custom meta description for search engines and social shares"
                    {...register("seoDescription")}
                  />
                </Box>

                <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}>
                  <Box>
                    <Typography variant="caption" fontWeight={600} color={tokens.colors.secondary[700]} sx={{ mb: 0.5, display: "block" }}>
                      Canonical URL
                    </Typography>
                    <AppTextField
                      placeholder="https://webliix.com/blog/your-slug"
                      {...register("canonicalUrl")}
                    />
                  </Box>

                  <Box>
                    <Typography variant="caption" fontWeight={600} color={tokens.colors.secondary[700]} sx={{ mb: 0.5, display: "block" }}>
                      Open Graph Social Image URL
                    </Typography>
                    <AppTextField
                      placeholder="Custom 1200x630 OG image URL"
                      {...register("ogImageUrl")}
                    />
                  </Box>
                </Box>
              </Box>
            </Box>
          )}

          {/* ============================================================ */}
          {/* TAB 4: GOOGLE ADS & MONETIZATION SETTINGS                    */}
          {/* ============================================================ */}
          {activeTab === 3 && (
            <Box sx={{ display: "grid", gap: 3 }}>
              <Box
                sx={{
                  p: 2.5,
                  borderRadius: tokens.borderRadius.md,
                  bgcolor: tokens.colors.secondary[50],
                  border: `1px solid ${tokens.colors.secondary[200]}`,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Box>
                  <Typography variant="subtitle1" fontWeight={700} color={tokens.colors.secondary[900]}>
                    Google AdSense & Custom Banner Monetization
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Configure Google Ads banner placements, AdSense client IDs, and ad slot IDs for this article.
                  </Typography>
                </Box>

                <FormControlLabel
                  control={
                    <Switch
                      checked={enableAds}
                      onChange={(e) => {
                        setEnableAds(e.target.checked);
                        setValue("enableAds", e.target.checked);
                      }}
                      color="primary"
                    />
                  }
                  label="Enable Ads on Article"
                />
              </Box>

              {enableAds && (
                <Box sx={{ display: "grid", gap: 2.5 }}>
                  <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}>
                    <Box>
                      <Typography variant="caption" fontWeight={600} color={tokens.colors.secondary[700]} sx={{ mb: 0.5, display: "block" }}>
                        Google AdSense Client ID (ca-pub-XXXXXXXXXXXXXX)
                      </Typography>
                      <AppTextField
                        placeholder="e.g. ca-pub-1234567890123456"
                        {...register("adSenseClientId")}
                      />
                    </Box>

                    <Box>
                      <Typography variant="caption" fontWeight={600} color={tokens.colors.secondary[700]} sx={{ mb: 0.5, display: "block" }}>
                        Ad Format
                      </Typography>
                      <AppTextField select {...register("adFormat")}>
                        <MenuItem value="auto">Auto (Responsive)</MenuItem>
                        <MenuItem value="horizontal">Horizontal Banner</MenuItem>
                        <MenuItem value="rectangle">Medium Rectangle</MenuItem>
                        <MenuItem value="fluid">In-Feed Fluid</MenuItem>
                      </AppTextField>
                    </Box>
                  </Box>

                  {/* Ad Slot IDs */}
                  <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" }, gap: 2 }}>
                    <Box>
                      <Typography variant="caption" fontWeight={600} color={tokens.colors.secondary[700]} sx={{ mb: 0.5, display: "block" }}>
                        Top Article Ad Slot ID
                      </Typography>
                      <AppTextField placeholder="e.g. 9876543210" {...register("topAdSlotId")} />
                    </Box>

                    <Box>
                      <Typography variant="caption" fontWeight={600} color={tokens.colors.secondary[700]} sx={{ mb: 0.5, display: "block" }}>
                        Mid-Content In-Feed Ad Slot ID
                      </Typography>
                      <AppTextField placeholder="e.g. 8765432109" {...register("inlineAdSlotId")} />
                    </Box>

                    <Box>
                      <Typography variant="caption" fontWeight={600} color={tokens.colors.secondary[700]} sx={{ mb: 0.5, display: "block" }}>
                        Bottom Article Ad Slot ID
                      </Typography>
                      <AppTextField placeholder="e.g. 7654321098" {...register("bottomAdSlotId")} />
                    </Box>
                  </Box>

                  <Alert severity="info" action={<AppButton appVariant="secondary" appSize="sm" onClick={handleInsertAdSnippet}>+ Insert Custom Ad Unit</AppButton>}>
                    Ads are automatically inserted at the Top and Bottom of published articles when Enabled. You can also insert mid-article Ad Units using the button above.
                  </Alert>
                </Box>
              )}
            </Box>
          )}

          {/* ============================================================ */}
          {/* BOTTOM PUBLICATION STATE & SAVE TOOLBAR                      */}
          {/* ============================================================ */}
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 2,
              pt: 2.5,
              borderTop: `1px solid ${tokens.colors.secondary[200]}`,
            }}
          >
            <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography variant="body2" fontWeight={600} color={tokens.colors.secondary[800]}>
                  Publish State:
                </Typography>
                <AppTextField
                  select
                  size="small"
                  sx={{ width: 160 }}
                  {...register("status")}
                >
                  <MenuItem value="DRAFT">DRAFT</MenuItem>
                  <MenuItem value="SCHEDULED">SCHEDULED</MenuItem>
                  <MenuItem value="PUBLISHED">PUBLISHED</MenuItem>
                  <MenuItem value="ARCHIVED">ARCHIVED</MenuItem>
                </AppTextField>
              </Box>

              {statusWatch === "SCHEDULED" && (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography variant="caption" fontWeight={600}>
                    Schedule Time:
                  </Typography>
                  <AppTextField
                    type="datetime-local"
                    size="small"
                    {...register("scheduledPublishAt")}
                  />
                </Box>
              )}
            </Box>

            <Box sx={{ display: "flex", gap: 1.5 }}>
              <AppButton appVariant="ghost" onClick={onClose}>
                Cancel
              </AppButton>
              <AppButton
                type="submit"
                appVariant="primary"
                startIcon={<SaveIcon sx={{ fontSize: 18 }} />}
                loading={createMutation.isPending || updateMutation.isPending}
                loadingText="Saving..."
              >
                {isEditing ? "Update Publication" : "Save Publication"}
              </AppButton>
            </Box>
          </Box>
        </Box>
      </form>
    </AppDrawer>
  );
}

export default BlogEditorDrawer;
