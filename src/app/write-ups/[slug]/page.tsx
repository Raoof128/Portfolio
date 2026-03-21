import { writeups } from "@/lib/data";
import { notFound } from "next/navigation";
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

export async function generateMetadata({ params }: PageProps) {
    const { slug } = await params;
    const post = writeups.find((p) => p.slug === slug);
    if (!post) return { title: "Not Found" };

    return {
      title: `${post.title} | Write-ups`,
      description: post.takeaway,
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
