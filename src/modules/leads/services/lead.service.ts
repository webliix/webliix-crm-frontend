import { LeadControllerService } from "@/api/generated";

export const leadService = {
  getAll(page?: number, size = 20) {
    return LeadControllerService.getAllLeads(page, size);
  },

  getById(id: number) {
    return LeadControllerService.getLead(id);
  },

  create(data: Parameters<typeof LeadControllerService.createLead>[0]) {
    return LeadControllerService.createLead(data);
  },

  update(id: number, data: Parameters<typeof LeadControllerService.updateLead>[1]) {
    return LeadControllerService.updateLead(id, data);
  },

  delete(id: number) {
    return LeadControllerService.deleteLead(id);
  },

  search(keyword: string, page?: number, size = 20) {
    return LeadControllerService.searchLeads(keyword, page, size);
  },

  convert(id: number) {
    return LeadControllerService.convertLead(id);
  },
};
