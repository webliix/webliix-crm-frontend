/**
 * Centralized formatting utilities for the entire Webliix platform.
 */

export function formatCurrency(
  amount: number | string | null | undefined,
  currency = "INR",
  locale = "en-IN"
): string {
  if (amount === null || amount === undefined || isNaN(Number(amount))) {
    return "₹0.00";
  }

  const num = Number(amount);

  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    }).format(num);
  } catch {
    return `₹${num.toFixed(2)}`;
  }
}

export function formatDate(
  dateInput: string | Date | null | undefined,
  options?: Intl.DateTimeFormatOptions
): string {
  if (!dateInput) return "-";
  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
  if (isNaN(date.getTime())) return "-";

  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
    ...options,
  };

  return new Intl.DateTimeFormat("en-IN", defaultOptions).format(date);
}

export function formatDateTime(dateInput: string | Date | null | undefined): string {
  return formatDate(dateInput, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatRelativeTime(dateInput: string | Date | null | undefined): string {
  if (!dateInput) return "-";
  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
  if (isNaN(date.getTime())) return "-";

  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "Just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} min ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hr ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;

  return formatDate(date);
}

export function formatNumber(num: number | string | null | undefined): string {
  if (num === null || num === undefined || isNaN(Number(num))) return "0";
  return new Intl.NumberFormat("en-IN").format(Number(num));
}

export function formatPercentage(value: number | string | null | undefined): string {
  if (value === null || value === undefined || isNaN(Number(value))) return "0%";
  return `${Number(value).toFixed(1)}%`;
}

export function capitalize(str: string | null | undefined): string {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export function truncateText(str: string | null | undefined, maxLength = 30): string {
  if (!str) return "";
  if (str.length <= maxLength) return str;
  return `${str.substring(0, maxLength)}...`;
}
