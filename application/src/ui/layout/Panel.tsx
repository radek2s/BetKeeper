import type { ReactNode } from "react";
import { Icon } from "../icon";
import type { IconType } from "../icon/types";

interface PanelProps {
  header?: PanelHeaderProps;
  children: ReactNode;
}
export function Panel({ header, children }: PanelProps) {
  return (
    <section className="panel">
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
