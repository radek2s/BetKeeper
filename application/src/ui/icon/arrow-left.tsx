/** biome-ignore-all lint/a11y/noSvgWithoutTitle: <explanation> */
import type { IconProps } from "./types";

export function ArrowLeftIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      height="24px"
      viewBox="0 -960 960 960"
      width="24px">
      <path d="m366.61-419.96 78.87 79.44q18.26 18.26 18.26 43.43 0 25.18-17.26 42.87-18.26 18.7-43.87 18.48-25.61-.22-43.87-18.48l-184-183.43q-18.83-18.83-18.83-43.78 0-24.96 18.83-43.22l185-184.44q17.69-18.26 43.09-18.26 25.39 0 43.65 18.7 17.26 18.26 17.26 43.43 0 25.18-18.26 42.87l-78.87 79.44h400.96q25.39 0 43.43 18.04t18.04 43.44q0 25.95-18.04 43.71t-43.43 17.76H366.61Z" />
    </svg>
  );
}
