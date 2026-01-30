/** biome-ignore-all lint/a11y/noSvgWithoutTitle: <explanation> */
import type { IconProps } from "./types";

export function FilterIcon({ className }: IconProps) {
  return (
    <svg className={className} width="24px" height="24px" viewBox="0 0 24 24">
      <path d="M10 16h4a1 1 0 0 1 .117 1.993L14 18h-4a1 1 0 0 1-.117-1.993L10 16h4-4Zm-2-5h8a1 1 0 0 1 .117 1.993L16 13H8a1 1 0 0 1-.117-1.993L8 11h8-8ZM5 6h14a1 1 0 0 1 .117 1.993L19 8H5a1 1 0 0 1-.117-1.993L5 6h14H5Z" />
    </svg>
  );
}
