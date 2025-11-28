"use server";
interface PageProps {
  params: Promise<{ betId: string }>;
}
export default async function BetDetailsPage({ params }: PageProps) {
  const { betId } = await params;
  return <div>Welcome in bet - {betId}!</div>;
}
