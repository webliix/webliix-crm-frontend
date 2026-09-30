import { BrandLoader } from "./BrandLoader";

export interface LoadingScreenProps {
  message?: string;
  fullscreen?: boolean;
}

export function LoadingScreen({
  message = "Loading Webliix...",
  fullscreen = false,
}: LoadingScreenProps) {
  return (
    <BrandLoader
      message={message}
      fullScreen={fullscreen}
      size={fullscreen ? "large" : "medium"}
    />
  );
}
