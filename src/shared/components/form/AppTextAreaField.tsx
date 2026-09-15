import { AppTextField } from "./AppTextField";

interface Props {
  name: string;
  label?: string;
  rows?: number;
}

export function AppTextAreaField({ name, label, rows = 4 }: Props) {
  return <AppTextField name={name} label={label} multiline rows={rows} />;
}
