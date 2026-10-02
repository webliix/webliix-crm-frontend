import { useState, useMemo } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import SearchIcon from "@mui/icons-material/Search";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import PictureAsPdfOutlinedIcon from "@mui/icons-material/PictureAsPdfOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
import ImageIcon from "@mui/icons-material/Image";
import FolderZipOutlinedIcon from "@mui/icons-material/FolderZipOutlined";
import { DOCUMENT_CATEGORIES, type StoredDocument, type DocumentTypeCategory } from "../types/document.types";
import { documentService } from "../services/document.service";
import { tokens } from "@/theme/tokens";

interface DocumentExplorerProps {
  documents: StoredDocument[];
  onRefresh: () => void;
  allowUpload?: boolean;
  module?: string;
  referenceId?: number;
  productName?: string;
  customerName?: string;
  readOnly?: boolean;
}

export function DocumentExplorer({
  documents,
  onRefresh,
  allowUpload = true,
  module = "CUSTOMER",
  referenceId,
  productName,
  customerName,
  readOnly = false,
}: DocumentExplorerProps) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [docCategory, setDocCategory] = useState<DocumentTypeCategory>("CONTRACT");
  const [docNotes, setDocNotes] = useState("");

  const filteredDocs = useMemo(() => {
    return documents.filter((doc) => {
      const name = (doc.originalName || doc.fileName || doc.title || "").toLowerCase();
      const matchesSearch = !search || name.includes(search.toLowerCase());
      const matchesCategory =
        selectedCategory === "ALL" || doc.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [documents, search, selectedCategory]);

  const handleUploadSubmit = async () => {
    if (!selectedFile) return;
    setUploading(true);
    try {
      await documentService.uploadDocument(
        selectedFile,
        module,
        referenceId,
        docCategory,
        docNotes
      );
      setUploadDialogOpen(false);
      setSelectedFile(null);
      setDocNotes("");
      onRefresh();
    } catch (err) {
      console.error("Upload error:", err);
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = async (doc: StoredDocument) => {
    await documentService.downloadDocument(doc.id, doc.originalName || doc.fileName);
  };

  const handleDelete = async (docId: number) => {
    if (window.confirm("Are you sure you want to delete this document?")) {
      await documentService.deleteDocument(docId);
      onRefresh();
    }
  };

  const formatFileSize = (bytes: number) => {
    if (!bytes) return "0 KB";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  const getFileIcon = (contentType?: string, name?: string) => {
    const filename = (name || "").toLowerCase();
    if (contentType?.includes("pdf") || filename.endsWith(".pdf")) {
      return <PictureAsPdfOutlinedIcon sx={{ fontSize: 28, color: "#e11d48" }} />;
    }
    if (contentType?.includes("image") || filename.match(/\.(png|jpg|jpeg|svg|webp)$/)) {
      return <ImageIcon sx={{ fontSize: 28, color: "#8b5cf6" }} />;
    }
    if (filename.match(/\.(zip|tar|gz|rar|7z)$/)) {
      return <FolderZipOutlinedIcon sx={{ fontSize: 28, color: "#d97706" }} />;
    }
    if (filename.match(/\.(doc|docx|txt|rtf|md)$/)) {
      return <DescriptionOutlinedIcon sx={{ fontSize: 28, color: "#2563eb" }} />;
    }
    return <InsertDriveFileOutlinedIcon sx={{ fontSize: 28, color: tokens.colors.secondary[500] }} />;
  };

  const getCategoryMeta = (category?: DocumentTypeCategory) => {
    return DOCUMENT_CATEGORIES.find((c) => c.key === category) || {
      key: "OTHER" as DocumentTypeCategory,
      label: "General Document",
      color: "default" as const,
      description: "Standard document",
    };
  };

  return (
    <Box sx={{ display: "grid", gap: 2.5 }}>
      {/* Search, Filter & Action Toolbar */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "stretch", md: "center" },
          gap: 2,
        }}
      >
        <Box sx={{ maxWidth: { xs: "100%", md: 360 }, width: "100%" }}>
          <TextField
            size="small"
            fullWidth
            placeholder="Search documents by title, file name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ fontSize: 18, color: tokens.colors.secondary[400] }} />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        {allowUpload && !readOnly && (
          <Button
            variant="contained"
            startIcon={<CloudUploadOutlinedIcon />}
            onClick={() => setUploadDialogOpen(true)}
            sx={{
              fontWeight: 700,
              background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
              boxShadow: "0 4px 12px rgba(99, 102, 241, 0.25)",
            }}
          >
            Upload Document
          </Button>
        )}
      </Box>

      {/* Category Pills Filter */}
      <Box
        sx={{
          display: "flex",
          gap: 1,
          overflowX: "auto",
          pb: 1,
          "&::-webkit-scrollbar": { height: 4 },
          "&::-webkit-scrollbar-thumb": { backgroundColor: tokens.colors.secondary[200], borderRadius: 2 },
        }}
      >
        <Chip
          label={`All Documents (${documents.length})`}
          clickable
          color={selectedCategory === "ALL" ? "primary" : "default"}
          onClick={() => setSelectedCategory("ALL")}
          sx={{ fontWeight: 600, fontSize: "0.75rem", height: 28 }}
        />
        {DOCUMENT_CATEGORIES.map((cat) => {
          const count = documents.filter((d) => d.category === cat.key).length;
          if (count === 0 && selectedCategory !== cat.key) return null;
          return (
            <Chip
              key={cat.key}
              label={`${cat.label} (${count})`}
              clickable
              color={selectedCategory === cat.key ? "primary" : "default"}
              onClick={() => setSelectedCategory(cat.key)}
              sx={{ fontWeight: 600, fontSize: "0.75rem", height: 28 }}
            />
          );
        })}
      </Box>

      {/* Documents Grid */}
      {filteredDocs.length === 0 ? (
        <Card variant="outlined" sx={{ borderRadius: 2, p: 4, textAlign: "center", bgcolor: "action.hover" }}>
          <InsertDriveFileOutlinedIcon sx={{ fontSize: 48, color: tokens.colors.secondary[400], mb: 1 }} />
          <Typography variant="subtitle1" fontWeight={700} color={tokens.colors.secondary[800]}>
            {search || selectedCategory !== "ALL"
              ? "No matching documents found"
              : "No documents attached yet"}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 460, mx: "auto", mt: 0.5, mb: 2 }}>
            {search || selectedCategory !== "ALL"
              ? "Try adjusting your search terms or category filter."
              : "Upload client contracts, technical blueprints, deliverables, and invoices to make them accessible."}
          </Typography>
          {allowUpload && !readOnly && (
            <Button
              variant="outlined"
              startIcon={<CloudUploadOutlinedIcon />}
              onClick={() => setUploadDialogOpen(true)}
            >
              Upload First Document
            </Button>
          )}
        </Card>
      ) : (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" },
            gap: 2,
          }}
        >
          {filteredDocs.map((doc) => {
            const catMeta = getCategoryMeta(doc.category);
            return (
              <Card
                key={doc.id}
                variant="outlined"
                sx={{
                  borderRadius: 2,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    borderColor: tokens.colors.primary.main,
                    boxShadow: "0 4px 16px rgba(0, 0, 0, 0.06)",
                    transform: "translateY(-2px)",
                  },
                }}
              >
                <CardContent sx={{ p: 2.5 }}>
                  <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5, mb: 1.5 }}>
                    <Box
                      sx={{
                        p: 1,
                        borderRadius: 1.5,
                        bgcolor: tokens.colors.secondary[100],
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      {getFileIcon(doc.contentType, doc.originalName || doc.fileName)}
                    </Box>

                    <Box sx={{ minWidth: 0, flex: 1 }}>
                      <Typography
                        variant="subtitle2"
                        fontWeight={700}
                        color={tokens.colors.secondary[900]}
                        sx={{
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          lineHeight: 1.3,
                        }}
                      >
                        {doc.originalName || doc.fileName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 0.25 }}>
                        {formatFileSize(doc.fileSize)} • {new Date(doc.createdAt).toLocaleDateString()}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75, mt: 1.5, mb: 1 }}>
                    <Chip
                      label={catMeta.label}
                      size="small"
                      color={catMeta.color as any}
                      sx={{ fontSize: "0.6875rem", fontWeight: 700, height: 22 }}
                    />
                    {(productName || doc.productName) && (
                      <Chip
                        label={productName || doc.productName}
                        size="small"
                        variant="outlined"
                        sx={{ fontSize: "0.6875rem", fontWeight: 600, height: 22 }}
                      />
                    )}
                  </Box>
                </CardContent>

                <Box
                  sx={{
                    px: 2.5,
                    py: 1.5,
                    bgcolor: "action.hover",
                    borderTop: 1,
                    borderColor: "divider",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Button
                    size="small"
                    variant="contained"
                    startIcon={<FileDownloadOutlinedIcon sx={{ fontSize: 16 }} />}
                    onClick={() => handleDownload(doc)}
                    sx={{
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      borderRadius: 1.5,
                    }}
                  >
                    Download
                  </Button>

                  {!readOnly && (
                    <Tooltip title="Delete file">
                      <IconButton size="small" color="error" onClick={() => handleDelete(doc.id)}>
                        <DeleteOutlineIcon sx={{ fontSize: 18 }} />
                      </IconButton>
                    </Tooltip>
                  )}
                </Box>
              </Card>
            );
          })}
        </Box>
      )}

      {/* Upload Document Dialog */}
      <Dialog open={uploadDialogOpen} onClose={() => setUploadDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>
          Upload Document {customerName ? `for ${customerName}` : ""}
        </DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2.5, pt: 2 }}>
          <Box>
            <Typography variant="caption" fontWeight={700} color={tokens.colors.secondary[700]} sx={{ mb: 1, display: "block" }}>
              Document Type & Category
            </Typography>
            <TextField
              select
              fullWidth
              size="small"
              value={docCategory}
              onChange={(e) => setDocCategory(e.target.value as DocumentTypeCategory)}
            >
              {DOCUMENT_CATEGORIES.map((cat) => (
                <MenuItem key={cat.key} value={cat.key}>
                  <Box>
                    <Typography variant="body2" fontWeight={600}>
                      {cat.label}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {cat.description}
                    </Typography>
                  </Box>
                </MenuItem>
              ))}
            </TextField>
          </Box>

          <Box>
            <Typography variant="caption" fontWeight={700} color={tokens.colors.secondary[700]} sx={{ mb: 1, display: "block" }}>
              Select File (PDF, DOCX, ZIP, PNG, etc.)
            </Typography>
            <Box
              sx={{
                p: 3,
                border: "2px dashed",
                borderColor: selectedFile ? tokens.colors.primary.main : tokens.colors.secondary[300],
                borderRadius: 2,
                textAlign: "center",
                bgcolor: selectedFile ? "action.hover" : "background.paper",
                cursor: "pointer",
              }}
              onClick={() => document.getElementById("file-upload-input")?.click()}
            >
              <input
                id="file-upload-input"
                type="file"
                style={{ display: "none" }}
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    setSelectedFile(e.target.files[0]);
                  }
                }}
              />
              <CloudUploadOutlinedIcon sx={{ fontSize: 36, color: tokens.colors.primary.main, mb: 1 }} />
              <Typography variant="body2" fontWeight={600}>
                {selectedFile ? selectedFile.name : "Click or browse to choose a file"}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {selectedFile ? `${formatFileSize(selectedFile.size)} selected` : "Supports contracts, blueprints, images, and archives up to 50MB"}
              </Typography>
            </Box>
          </Box>

          <TextField
            multiline
            rows={2}
            fullWidth
            size="small"
            label="Internal Notes / Description (Optional)"
            placeholder="e.g. Master Service Agreement signed on October 2026"
            value={docNotes}
            onChange={(e) => setDocNotes(e.target.value)}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={() => setUploadDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            disabled={!selectedFile || uploading}
            onClick={handleUploadSubmit}
            sx={{ fontWeight: 700 }}
          >
            {uploading ? "Uploading..." : "Save & Attach Document"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
