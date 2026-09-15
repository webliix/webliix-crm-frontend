export function enumToLabel(value?: string | null) {
  if (!value) return "";
  // replace underscores, lowercase, then title case each word
  return value
    .toLowerCase()
    .replace(/_/g, " ")
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}
