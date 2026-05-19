import { MetadataRoute } from 'next'
import { projects, writeups } from '@/lib/data'
import { SITE_URL } from '@/lib/constants'

export const dynamic = 'force-static'

// Non-English locale prefixes
const LOCALE_PREFIXES = ['/fa', '/ar', '/zh', '/es'] as const

// Static routes that exist in every locale
const STATIC_ROUTES = [
  { path: '', changeFrequency: 'monthly' as const, priority: 1 },
  { path: '/projects', changeFrequency: 'weekly' as const, priority: 0.8 },
  { path: '/lab', changeFrequency: 'monthly' as const, priority: 0.7 },
  { path: '/write-ups', changeFrequency: 'weekly' as const, priority: 0.7 },
  { path: '/resume', changeFrequency: 'monthly' as const, priority: 0.5 },
  { path: '/about', changeFrequency: 'monthly' as const, priority: 0.6 },
  { path: '/contact', changeFrequency: 'monthly' as const, priority: 0.5 },
]

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  // English static routes (clean root paths)
  const enStaticUrls = STATIC_ROUTES.map(({ path, changeFrequency, priority }) => ({
    url: `${SITE_URL}${path || '/'}`,
    lastModified: now,
    changeFrequency,
    priority,
    alternates: {
      languages: Object.fromEntries([
        ['en', `${SITE_URL}${path || '/'}`],
        ...LOCALE_PREFIXES.map(prefix => [
          prefix.slice(1), // strip leading slash
          `${SITE_URL}${prefix}${path}`,
        ]),
      ]),
    },
  }))

  // Non-English static routes
  const localeStaticUrls = LOCALE_PREFIXES.flatMap(prefix =>
    STATIC_ROUTES.map(({ path, changeFrequency, priority }) => ({
      url: `${SITE_URL}${prefix}${path}`,
      lastModified: now,
      changeFrequency,
      priority: priority * 0.9,
    }))
  )

  // English project URLs with locale alternates
  const enProjectUrls = Object.values(projects).map(project => ({
    url: `${SITE_URL}/projects/${project.slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
    alternates: {
      languages: Object.fromEntries([
        ['en', `${SITE_URL}/projects/${project.slug}`],
        ...LOCALE_PREFIXES.map(prefix => [
          prefix.slice(1),
          `${SITE_URL}${prefix}/projects/${project.slug}`,
        ]),
      ]),
    },
  }))

  // Non-English project URLs
  const localeProjectUrls = LOCALE_PREFIXES.flatMap(prefix =>
    Object.values(projects).map(project => ({
      url: `${SITE_URL}${prefix}/projects/${project.slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }))
  )

  // English write-up URLs with locale alternates
  const enWriteupUrls = writeups.map(post => ({
    url: `${SITE_URL}/write-ups/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
    alternates: {
      languages: Object.fromEntries([
        ['en', `${SITE_URL}/write-ups/${post.slug}`],
        ...LOCALE_PREFIXES.map(prefix => [
          prefix.slice(1),
          `${SITE_URL}${prefix}/write-ups/${post.slug}`,
        ]),
      ]),
    },
  }))

  // Non-English write-up URLs
  const localeWriteupUrls = LOCALE_PREFIXES.flatMap(prefix =>
    writeups.map(post => ({
      url: `${SITE_URL}${prefix}/write-ups/${post.slug}`,
      lastModified: new Date(post.date),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }))
  )

  return [
    ...enStaticUrls,
    ...localeStaticUrls,
    ...enProjectUrls,
    ...localeProjectUrls,
    ...enWriteupUrls,
    ...localeWriteupUrls,
  ]
}
