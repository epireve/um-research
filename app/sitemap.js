export default function sitemap() {
  const baseUrl = 'https://um-research-supervisor-matching.vercel.app';
  
  // This would normally come from a database query
  const supervisors = [
    { id: 'chiam-yin-kia', lastModified: new Date() },
    { id: 'su-moon-ting', lastModified: new Date() },
    { id: 'siti-hafizah', lastModified: new Date() },
  ];

  const supervisorUrls = supervisors.map((supervisor) => ({
    url: `${baseUrl}/supervisors/${supervisor.id}`,
    lastModified: supervisor.lastModified,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
    },
    ...supervisorUrls,
  ];
} 