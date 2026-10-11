import { Desktop } from "@/components/os/Desktop";
import { resolveLocale, getDictionary } from "@/i18n";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = resolveLocale(rawLocale);
  const dictionary = await getDictionary(locale);
  return <Desktop locale={locale} role={dictionary.hero.researcher} />;
}
