import { MetadataRoute } from 'next'
import { projects, writeups } from '@/lib/data'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://raouf.sh'
  
  const projectUrls = Object.values(projects).map((project) => ({
    url: `${baseUrl}/projects/${project.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  const writeupUrls = writeups.map((post) => ({
    url: `${baseUrl}/write-ups/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: `${baseUrl}/projects`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/lab`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/write-ups`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/resume`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    ...projectUrls,
    ...writeupUrls,
  ]
}
