const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ourstime.com"

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl,
  generateRobotsTxt: true,
  sitemapSize: 7000,
  changefreq: "daily",
  priority: 0.7,
}
