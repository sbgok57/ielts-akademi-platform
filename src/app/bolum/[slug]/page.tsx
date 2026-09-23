import BolumView from "@/components/BolumView";

interface PageProps {
  params: { slug: string };
  searchParams?: Record<string, string | string[] | undefined>;
}

export default function BolumDynamicPage({ params }: PageProps) {
  return <BolumView slug={params.slug} />;
}
