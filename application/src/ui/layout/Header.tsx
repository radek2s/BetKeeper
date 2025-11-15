import Link from "next/link";
import type { ReactNode } from "react";
import { IconButton } from "../button/IconButton";

interface Props {
  title: string;
  returnUrl: string;
  children?: ReactNode;
}
export function PageHeader({ title, returnUrl, children }: Props) {
  return (
    <header className="my-4 px-4 flex w-full justify-between">
      <div className="flex gap-2 items-center">
        <Link href={returnUrl}>
          <IconButton icon="chevron-left" />
        </Link>
        <h1>{title}</h1>
      </div>
      {children}
    </header>
  );
}

export default PageHeader;
