import { http } from "@/shared/services/http";
import { env } from "@/config/env";
import type { StoredDocument, DocumentTypeCategory } from "../types/document.types";

export const documentService = {
  /**
   * Fetch documents with optional module, referenceId, and category filters
   */
  async getDocuments(params?: {
    module?: string;
    referenceId?: number;
    category?: string;
  }): Promise<StoredDocument[]> {
    try {
      const response = await http.get<StoredDocument[] | { data: StoredDocument[] }>("/api/v1/storage/files", {
        params: {
          module: params?.module,
          referenceId: params?.referenceId,
        },
      });

      const rawList: any[] = Array.isArray(response.data)
        ? response.data
        : Array.isArray((response.data as any)?.data)
        ? (response.data as any).data
        : [];

      return rawList.map((doc) => {
        // Resolve category from original name, content type or stored metadata
        let category: DocumentTypeCategory = "OTHER";
        const name = (doc.originalName || doc.fileName || "").toLowerCase();

        if (name.includes("contract") || name.includes("agreement") || name.includes("sow")) {
          category = "CONTRACT";
        } else if (name.includes("spec") || name.includes("architecture") || name.includes("blueprint") || name.includes("schema")) {
          category = "SPECIFICATION";
        } else if (name.includes("brief") || name.includes("requirement") || name.includes("scope")) {
          category = "BRIEF";
        } else if (name.includes("deliverable") || name.includes("build") || name.includes("release") || name.includes("package")) {
          category = "DELIVERABLE";
        } else if (name.includes("proposal") || name.includes("quote") || name.includes("estimate")) {
          category = "PROPOSAL";
        } else if (name.includes("nda") || name.includes("confidential")) {
          category = "NDA";
        } else if (name.includes("design") || name.includes("figma") || name.includes("ui") || name.includes("brand")) {
          category = "DESIGN";
        } else if (name.includes("report") || name.includes("audit") || name.includes("security") || name.includes("review")) {
          category = "REPORT";
        } else if (name.includes("invoice") || name.includes("receipt") || name.includes("billing") || name.includes("payment")) {
          category = "INVOICE";
        }

        return {
          ...doc,
          category,
          title: doc.originalName || doc.fileName || `Document #${doc.id}`,
        };
      });
    } catch (error) {
      console.error("Failed to fetch documents:", error);
      return [];
    }
  },

  /**
   * Upload a new document with metadata
   */
  async uploadDocument(
    file: File,
    module: string = "CUSTOMER",
    referenceId?: number,
    category?: DocumentTypeCategory,
    notes?: string
  ): Promise<any> {
    const formData = new FormData();
    formData.append("file", file);
    if (category) formData.append("category", category);
    if (notes) formData.append("notes", notes);

    const queryParams = new URLSearchParams();
    if (module) queryParams.append("module", module);
    if (referenceId) queryParams.append("referenceId", String(referenceId));

    const url = `/api/v1/storage/upload?${queryParams.toString()}`;
    const response = await http.post(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  /**
   * Download a stored document by id
   */
  async downloadDocument(id: number, filename: string = "download"): Promise<void> {
    try {
      const response = await http.get(`/api/v1/storage/${id}`, {
        responseType: "blob",
      });

      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to download document:", error);
      // Fallback direct url with central base url
      const downloadUrl = `${env.apiBaseUrl}/api/v1/storage/${id}`;
      window.open(downloadUrl, "_blank");
    }
  },

  /**
   * Delete a stored document
   */
  async deleteDocument(id: number): Promise<void> {
    await http.delete(`/api/v1/storage/${id}`);
  },
};
