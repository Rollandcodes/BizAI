/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://www.cypai.app",
  generateRobotsTxt: true,
  changefreq: "weekly",
  priority: 0.7,
  exclude: [
    "/dashboard",
    "/dashboard/*",
    "/api/*",
    "/success",
    "/payment",
    "/setup",
    "/whatsapp-sync",
    "/widget/*",
    "/chat/*",
  ],
  additionalPaths: async (config) => [
    await config.transform(config, "/"),
    await config.transform(config, "/pricing"),
    await config.transform(config, "/demo"),
    await config.transform(config, "/signup"),
    await config.transform(config, "/blog"),
    await config.transform(config, "/affiliate"),
    await config.transform(config, "/contact"),
    await config.transform(config, "/privacy"),
    await config.transform(config, "/terms"),
    await config.transform(config, "/how-it-works"),
    await config.transform(config, "/alternatives"),
    await config.transform(config, "/integrations"),
    // Vertical landing pages
    await config.transform(config, "/car-rentals"),
    await config.transform(config, "/restaurants"),
    await config.transform(config, "/hotels"),
    await config.transform(config, "/barbershops"),
    await config.transform(config, "/clinics"),
    await config.transform(config, "/student-housing"),
    // Legal pages
    await config.transform(config, "/privacy-policy"),
    await config.transform(config, "/terms-of-service"),
    await config.transform(config, "/refund-policy"),
  ],
  robotsTxtOptions: {
    policies: [
      { userAgent: "*", allow: "/" },
      { userAgent: "*", disallow: ["/api/", "/dashboard/", "/widget/"] },
    ],
  },
};
