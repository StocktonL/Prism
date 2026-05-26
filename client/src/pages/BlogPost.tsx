import { useEffect } from 'react'
import { Link, useParams, Navigate } from 'react-router-dom'
import { ArrowLeft, Clock, User } from 'lucide-react'
import { POSTS } from './Blog'

function renderMarkdown(content: string): string {
  return content
    .replace(/^## (.+)$/gm, '<h2 class="text-xl font-bold text-white mt-10 mb-4">$1</h2>')
    .replace(/^### (.+)$/gm, '<h3 class="text-base font-bold text-white mt-6 mb-3">$1</h3>')
    .replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-white">$1</strong>')
    .replace(/\*(.+?)\*/g, '<em class="text-slate-300">$1</em>')
    .replace(/^---$/gm, '<hr class="my-8 border-white/10" />')
    .replace(/^- (.+)$/gm, '<li class="ml-4 list-disc text-slate-300">$1</li>')
    .replace(/(<li[\s\S]*?<\/li>)/g, '<ul class="my-4 space-y-2">$1</ul>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-teal-400 underline hover:text-teal-300">$1</a>')
    .replace(/^(?!<[h|u|l|h]|---|\s*$)(.+)$/gm, '<p class="text-slate-400 leading-relaxed mb-4">$1</p>')
    .replace(/\n{2,}/g, '\n')
}

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>()
  const post = POSTS.find(p => p.slug === slug)

  useEffect(() => {
    if (post) {
      document.title = `${post.title} — Prizm Blog`
      const metaDesc = document.querySelector('meta[name="description"]')
      if (metaDesc) metaDesc.setAttribute('content', post.description)
    }
  }, [post])

  if (!post) return <Navigate to="/blog" replace />

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <nav className="sticky top-0 z-40 border-b border-white/5 bg-slate-950/90 backdrop-blur-md px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-teal-400 to-cyan-600 shadow-lg shadow-teal-900/50">
            <span className="text-xs font-black text-white">P</span>
          </div>
          <span className="text-base font-bold tracking-tight text-white">Prizm</span>
        </Link>
        <Link to="/blog" className="text-sm text-slate-400 hover:text-white transition-colors flex items-center gap-1.5">
          <ArrowLeft className="h-4 w-4" /> All posts
        </Link>
      </nav>

      <article className="max-w-2xl mx-auto px-6 py-16">
        <header className="mb-10">
          <h1 className="text-3xl font-black text-white leading-tight mb-4">{post.title}</h1>
          <p className="text-lg text-slate-400 mb-6 leading-relaxed">{post.description}</p>
          <div className="flex items-center gap-4 text-sm text-slate-500 border-t border-white/8 pt-6">
            <span className="flex items-center gap-1.5"><User className="h-4 w-4" /> Stockton Lundell</span>
            <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" /> {post.readTime}</span>
            <span>{post.date}</span>
          </div>
        </header>

        <div
          className="prose-content"
          dangerouslySetInnerHTML={{ __html: renderMarkdown(post.content) }}
        />

        <div className="mt-16 rounded-2xl bg-teal-500/10 border border-teal-500/20 p-8 text-center">
          <h2 className="text-xl font-black text-white mb-2">Ready to recover unused benefits?</h2>
          <p className="text-sm text-slate-400 mb-6">
            Prizm identifies patients with unused VSP and EyeMed benefits and sends personalized campaigns that bring them in.
            Founding customers get lifetime access at $199/month.
          </p>
          <a
            href="/founding"
            className="inline-block rounded-xl bg-teal-500 px-6 py-3 text-sm font-bold text-white hover:bg-teal-400 transition-colors shadow-lg shadow-teal-900/40"
          >
            See Founding Offer →
          </a>
        </div>
      </article>

      <footer className="border-t border-white/5 px-6 py-8 text-center">
        <p className="text-xs text-slate-600">© 2026 Prizm · <a href="mailto:stockton@prizmvision.com" className="hover:text-slate-400 transition-colors">stockton@prizmvision.com</a></p>
      </footer>
    </div>
  )
}
