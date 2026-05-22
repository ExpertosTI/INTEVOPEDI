import { getPublishedCourses } from '@/lib/data';
import { siteConfig } from '@/lib/site';

export default async function sitemap() {
  const courses = await getPublishedCourses();
  const baseUrl = siteConfig.baseUrl;

  const staticRoutes = ['', '/cursos', '/participantes', '/grupo-atrevete', '/recursos', '/verificar'].map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: path === '' ? 1 : 0.7
  }));

  const courseRoutes = courses.map((course) => ({
    url: `${baseUrl}/cursos/${course.slug}`,
    lastModified: new Date(course.updatedAt || course.startDate),
    changeFrequency: 'weekly',
    priority: 0.8
  }));

  return [...staticRoutes, ...courseRoutes];
}
