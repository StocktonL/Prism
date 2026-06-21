import { useEffect } from 'react'
import { Link, useParams, Navigate } from 'react-router-dom'
import { Clock, User } from 'lucide-react'
import { POSTS } from './Blog'
import SiteNav from '../components/SiteNav'

function renderMarkdown(content: string): string {
  return content
    .replace(/^## (.+)$/gm, '<h2 class="font-display text-2xl font-semibold text-slate-900 mt-12 mb-4">$1</h2>')
    .replace(/^### (.+)$/gm, '<h3 class="font-display text-lg font-semibold text-slate-900 mt-6 mb-2">$1</h3>')
    .replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-slate-900">$1</strong>')
    .replace(/\*(.+?)\*/g, '<em class="text-slate-700 not-italic">$1</em>')
    .replace(/^---$/gm, '<hr class="my-8 border-slate-200" />')
    .replace(/^\d+\. (.+)$/gm, '<li class="text-slate-700 leading-relaxed list-decimal ml-6">$1</li>')
    .replace(/^- (.+)$/gm, '<li class="text-slate-700 leading-relaxed list-disc ml-6">$1</li>')
    .replace(/((?:<li[^>]*>.*?<\/li>\n?)+)/g, (match) => {
      const isOrdered = match.includes('list-decimal')
      const tag = isOrdered ? 'ol' : 'ul'
      return `<${tag} class="my-4 space-y-2">${match}</${tag}>`
    })
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-teal-700 underline underline-offset-2 hover:text-teal-800 transition-colors">$1</a>')
    .replace(/^(?!<[huo]|<\/|---|\s*$)(.+)$/gm, '<p class="text-slate-600 leading-relaxed mb-4">$1</p>')
    .replace(/\n{2,}/g, '\n')
}

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>()
  const post = POSTS.find(p => p.slug === slug)

  useEffect(() => {
    if (!post) return

    const url = `https://prizmvision.com/blog/${post.slug}`

    document.title = `${post.title} — Prizm Blog`

    const setMeta = (selector: string, attr: string, value: string) => {
      let el = document.querySelector(selector)
      if (!el) {
        el = document.createElement('meta')
        selector.split(/[\[\]="]+/).filter(Boolean).forEach((part, i, arr) => {
          if (i < arr.length - 1) el!.setAttribute(arr[i - 1] ?? 'name', part)
        })
        document.head.appendChild(el)
      }
      el.setAttribute(attr, value)
    }

    // Standard meta
    const metaDesc = document.querySelector('meta[name="description"]')
    if (metaDesc) metaDesc.setAttribute('content', post.description)

    // Canonical
    let canonical = document.querySelector('link[rel="canonical"]')
    if (!canonical) { canonical = document.createElement('link'); canonical.setAttribute('rel', 'canonical'); document.head.appendChild(canonical) }
    canonical.setAttribute('href', url)

    // Open Graph
    const ogTags: [string, string][] = [
      ['og:type', 'article'],
      ['og:url', url],
      ['og:title', `${post.title} — Prizm Blog`],
      ['og:description', post.description],
      ['og:site_name', 'Prizm'],
    ]
    ogTags.forEach(([property, content]) => {
      let el = document.querySelector(`meta[property="${property}"]`)
      if (!el) { el = document.createElement('meta'); el.setAttribute('property', property); document.head.appendChild(el) }
      el.setAttribute('content', content)
    })

    // BlogPosting JSON-LD schema
    const schemaId = 'blog-post-schema'
    let schema = document.getElementById(schemaId)
    if (!schema) { schema = document.createElement('script'); schema.id = schemaId; schema.setAttribute('type', 'application/ld+json'); document.head.appendChild(schema) }
    schema.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: post.title,
      description: post.description,
      url,
      datePublished: post.date,
      dateModified: post.date,
      author: { '@type': 'Person', name: 'Stockton Lundell', jobTitle: 'Founder, Prizm' },
      publisher: { '@type': 'Organization', name: 'Prizm', url: 'https://prizmvision.com' },
      mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    })

    return () => {
      schema?.remove()
      canonical?.setAttribute('href', 'https://prizmvision.com')
    }
  }, [post])

  if (!post) return <Navigate to="/blog" replace />

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <SiteNav />

      <article className="max-w-2xl mx-auto px-6 py-16">
        <Link to="/blog" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-teal-700 transition-colors mb-8">
          ← All posts
        </Link>
        <header className="mb-10">
          <h1 className="font-display text-3xl sm:text-4xl font-semibold text-slate-900 leading-tight tracking-tight mb-4">{post.title}</h1>
          <p className="text-lg text-slate-600 mb-6 leading-relaxed">{post.description}</p>
          <div className="flex items-center gap-4 text-sm text-slate-500 border-t border-slate-200 pt-6">
            <span className="flex items-center gap-1.5"><User className="h-4 w-4" /> Stockton Lundell</span>
            <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" /> {post.readTime}</span>
            <span>{post.date}</span>
          </div>
          <p className="text-xs text-slate-400 mt-3">5 years in optometry B2B SaaS · Founder, Prizm</p>
        </header>

        <div
          className="prose-content"
          dangerouslySetInnerHTML={{ __html: renderMarkdown(post.content) }}
        />

        <div className="mt-16 rounded-2xl bg-teal-50 border border-teal-100 p-8 text-center">
          <h2 className="font-display text-2xl font-semibold text-slate-900 mb-2">Ready to recover unused benefits?</h2>
          <p className="text-sm text-slate-600 mb-6">
            Prizm identifies patients with unused VSP and EyeMed benefits and sends personalized campaigns that bring them in.
            Founding customers get lifetime access at $199/month.
          </p>
          <a
            href="/founding"
            className="inline-block rounded-xl bg-teal-700 px-6 py-3 text-sm font-semibold text-white hover:bg-teal-800 transition-colors shadow-lg shadow-teal-900/15"
          >
            See Founding Offer →
          </a>
        </div>
      </article>

      <footer className="border-t border-slate-200 px-6 py-8 text-center">
        <p className="text-xs text-slate-500">© 2026 Prizm · <a href="mailto:stockton@prizmvision.com" className="hover:text-slate-700 transition-colors">stockton@prizmvision.com</a></p>
      </footer>
    </div>
  )
}
