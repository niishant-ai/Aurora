import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DocumentDesk } from "@/components/document-desk";
import { getAssetDetail } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const detail = await getAssetDetail(id);
  return { title: detail?.asset.title ?? "Record" };
}

export default async function DocumentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const detail = await getAssetDetail(id);
  if (!detail) notFound();
  return <DocumentDesk detail={detail} />;
}
