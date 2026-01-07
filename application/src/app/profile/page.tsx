/** biome-ignore-all lint/performance/noImgElement: <explanation> */
"use server";

import ClientProfilePage from "./ProfilePage";

export default async function ProfilePage() {
  return <ClientProfilePage />;
}
