"use server";

import BetDetails from "./BetDetails";

interface PageProps {
  params: Promise<{ betId: string }>;
}
export default async function BetDetailsPage({ params }: PageProps) {
  const { betId } = await params;

  return <BetDetails betId={betId} />;
}
