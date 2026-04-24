import type { MetadataRoute } from 'next';

const baseUrl = 'https://www.myaipartner.co.za';

export default function sitemap(): MetadataRoute.Sitemap {
  const today = new Date();
  return [
    {
      url: `${baseUrl}/`,
      lastModified: today,
      priority: 1
    },
    { url: `${baseUrl}/#ai-strategy-consulting`, lastModified: today, priority: 0.8 },
    { url: `${baseUrl}/#business-process-automation`, lastModified: today, priority: 0.8 },
    { url: `${baseUrl}/#custom-software-development`, lastModified: today, priority: 0.8 },
    { url: `${baseUrl}/#mobile-app-development`, lastModified: today, priority: 0.8 },
    { url: `${baseUrl}/#ai-training-workforce`, lastModified: today, priority: 0.8 },
    { url: `${baseUrl}/#forensic-email-investigation`, lastModified: today, priority: 0.9 },
    { url: `${baseUrl}/#ai-speaking-executive-briefings`, lastModified: today, priority: 0.7 },
    { url: `${baseUrl}/#competitor-market-intelligence`, lastModified: today, priority: 0.7 },
    { url: `${baseUrl}/free-apps`, lastModified: today, priority: 0.7 },
    { url: `${baseUrl}/interest`, lastModified: today, priority: 0.8 }
  ];
}
