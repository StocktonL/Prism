export default function Sitemap() {
  const pages = [
    { url: 'https://prizmvision.com/', label: 'Home', lastmod: '2026-05-26', priority: '1.0' },
    { url: 'https://prizmvision.com/founding', label: 'Founding Offer', lastmod: '2026-05-26', priority: '0.9' },
    { url: 'https://prizmvision.com/blog', label: 'Blog', lastmod: '2026-06-04', priority: '0.7' },
    { url: 'https://prizmvision.com/blog/optometry-patient-outreach-campaigns', label: 'Blog: Optometry Patient Outreach Campaigns', lastmod: '2026-05-31', priority: '0.8' },
    { url: 'https://prizmvision.com/blog/vision-benefits-expiring-patients', label: 'Blog: Vision Benefits Expiring Patients', lastmod: '2026-05-31', priority: '0.8' },
    { url: 'https://prizmvision.com/blog/vision-benefit-reminder-software-guide', label: 'Blog: Vision Benefit Reminder Software Guide', lastmod: '2026-06-04', priority: '0.8' },
  ]

  return (
    <div className="min-h-screen bg-white py-16 px-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Sitemap</h1>
        <p className="text-gray-500 mb-2 text-sm">
          Sitemap XML:{' '}
          <a href="/sitemap.xml" className="text-teal-600 underline">
            https://prizmvision.com/sitemap.xml
          </a>
        </p>
        <p className="text-gray-400 text-xs mb-8">Last updated: June 4, 2026</p>

        <div className="divide-y divide-gray-100 border border-gray-200 rounded-lg overflow-hidden">
          {pages.map((page) => (
            <div key={page.url} className="flex items-center justify-between px-5 py-4 hover:bg-gray-50">
              <div>
                <a
                  href={page.url}
                  className="text-teal-700 font-medium hover:underline block text-sm"
                >
                  {page.url}
                </a>
                <span className="text-gray-400 text-xs">{page.label} — last modified {page.lastmod}</span>
              </div>
              <span className="text-xs text-gray-300 ml-4 shrink-0">priority {page.priority}</span>
            </div>
          ))}
        </div>

        <p className="text-xs text-gray-400 mt-8">
          To submit to Google Search Console, paste{' '}
          <span className="font-mono bg-gray-100 px-1 rounded">https://prizmvision.com/sitemap.xml</span>{' '}
          into the Sitemaps section.
        </p>
      </div>
    </div>
  )
}
