import type { ReactNode } from "react";
import { Icon } from "../icon";
import type { IconType } from "../icon/types";

interface PanelProps {
  header?: PanelHeaderProps;
  children: ReactNode;
  className?: string;
}
export function Panel({ header, children, className }: PanelProps) {
  return (
    <section className={`panel ${className}`}>
      {header && <PanelHeader title={header.title} icon={header.icon} />}
      {children}
    </section>
  );
}

interface PanelHeaderProps {
  title: string;
  icon: IconType;
}
function PanelHeader({ icon, title }: PanelHeaderProps) {
  return (
    <h2 className="my-2 flex gap-2 items-center">
      <Icon name={icon} />
      {title}
    </h2>
  );
}
