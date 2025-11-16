import { PasskeyManagmenet } from "@app/features/profile/components/ManagePasskeys";
import PageHeader from "@app/ui/layout/Header";
import { PageWrapper } from "@app/ui/layout/PageWrapper";

export default function PasskeyManagementPage() {
  return (
    <PageWrapper>
      <PageHeader returnUrl="/profile" title="Passkey managment" />
      <PasskeyManagmenet />
    </PageWrapper>
  );
}
