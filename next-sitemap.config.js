const fs = require('node:fs');
const path = require('node:path');

function getBlogSlugs() {
  const postsDir = path.join(process.cwd(), 'app', 'blog', 'posts');

  if (!fs.existsSync(postsDir)) {
    return [];
  }

  return fs
    .readdirSync(postsDir)
    .filter((name) => name.endsWith('.ts'))
    .filter((name) => !['index.ts', 'types.ts'].includes(name))
    .map((name) => name.replace(/\.ts$/, ''));
}

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://www.cypai.app',
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  sitemapSize: 5000,
  exclude: [
    '/dashboard-login',
    '/dashboard',
    '/login',
    '/signup',
    '/payment',
    '/success',
    '/chat/*',
    '/widget/*',
  ],
  additionalPaths: async (config) => {
    const staticRoutes = [
      '/',
      '/demo',
      '/pricing',
      '/blog',
      '/contact',
      '/affiliate',
      '/privacy',
      '/terms',
    ];

    const blogRoutes = getBlogSlugs().map((slug) => `/blog/${slug}`);

    const uniqueRoutes = [...new Set([...staticRoutes, ...blogRoutes])];

    return uniqueRoutes.map((loc) => ({
      loc,
      changefreq: 'daily',
      priority: loc === '/' ? 1.0 : 0.7,
      lastmod: new Date().toISOString(),
      alternateRefs: config.alternateRefs ?? [],
    }));
  },
};
