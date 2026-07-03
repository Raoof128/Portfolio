import { writeups } from "@/lib/data";
import { notFound } from "next/navigation";
import { buildAlternates } from "@/lib/seo";
import { getDictionary, type Locale } from "@/i18n";
import { WriteupDetailClient } from "./WriteupDetailClient";

export function generateStaticParams() {
  return writeups.map((post) => ({
    slug: post.slug,
  }));
}

export const dynamicParams = false;

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Locale is present in params at runtime (parent [locale] segment) for canonical.
interface MetadataProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({ params }: MetadataProps) {
  const { locale, slug } = await params;
  const post = writeups.find((p) => p.slug === slug);
  const t = await getDictionary(locale as Locale);
  if (!post) return { title: t.seo.not_found_title };

  return {
    title: `${post.title} | ${t.seo.write_ups_title}`,
    description: post.takeaway,
    alternates: buildAlternates(`/write-ups/${slug}`, locale),
    openGraph: {
      title: `${post.title} | Mohammad Raouf Abedini`,
      description: post.takeaway,
    },
    twitter: {
      card: "summary",
      title: `${post.title} | Mohammad Raouf Abedini`,
      description: post.takeaway,
    },
  };
}

export default async function WriteupPage({ params }: PageProps) {
  const { slug } = await params;
  const post = writeups.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  return <WriteupDetailClient post={post} />;
}
