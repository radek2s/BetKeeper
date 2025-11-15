import { IconButton } from "@app/ui/button/IconButton";
import PageHeader from "@app/ui/layout/Header";

export function UserPageHeader() {
  return (
    <PageHeader title="Users management" returnUrl="/profile">
      <IconButton icon="more" />
    </PageHeader>
  );
}
