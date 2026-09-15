export const leadSourceOptions = [
  "WEBSITE",
  "WHATSAPP",
  "FACEBOOK",
  "INSTAGRAM",
  "REFERRAL",
  "EMAIL",
  "PHONE",
  "OTHER",
] as const;

export type LeadSource = (typeof leadSourceOptions)[number];
