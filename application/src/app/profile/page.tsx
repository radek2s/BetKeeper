/** biome-ignore-all lint/performance/noImgElement: <explanation> */
"use server";

import getEmailProvider from "@app/server/email/providers";
import ClientProfilePage from "./ProfilePage";

export default async function ProfilePage() {
  const emailProviderDefined = getEmailProvider() !== null;
  return <ClientProfilePage emailProviderAvailable={emailProviderDefined} />;
}
