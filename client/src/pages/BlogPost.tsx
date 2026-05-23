import { useEffect } from 'react'
import { Link, useParams, Navigate } from 'react-router-dom'
import { ArrowLeft, Clock, User } from 'lucide-react'
import { POSTS } from './Blog'

function renderMarkdown(content: string): string {
  return content
    .replace(/^## (.+)$/gm, '<h2 class="text-2xl font-bold text-slate-900 mt-10 mb-4">$1</h2>')
    .replace(/^### (.+)$/gm, '<h3 class="text-lg font-bold text-slate-900 mt-6 mb-3">$1</h3>')
    .replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-slate-900">$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/^---$/gm, '<hr class="my-8 border-slate-100" />')
    .replace(/^- (.+)$/gm, '<li class="ml-4 list-disc text-slate-700">$1</li>')
    .replace(/(<li[\s\S]*?<\/li>)/g, '<ul class="my-4 space-y-2">$1</ul>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-teal-600 underline hover:text-teal-700">$1</a>')
    .replace(/^(?!<[h|u|l|h]|---|\s*$)(.+)$/gm, '<p class="text-slate-700 leading-relaxed mb-4">$1</p>')
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
    <div className="min-h-screen bg-white">
      <nav className="border-b border-slate-100 px-6 py-4">
        <Link to="/blog" className="text-sm font-medium text-slate-500 hover:text-slate-800 flex items-center gap-1.5">
          <ArrowLeft className="h-4 w-4" /> Back to Blog
        </Link>
      </nav>

      <article className="max-w-2xl mx-auto px-6 py-16">
        <header className="mb-10">
          <h1 className="text-3xl font-black text-slate-900 leading-tight mb-4">{post.title}</h1>
          <p className="text-lg text-slate-500 mb-6">{post.description}</p>
          <div className="flex items-center gap-4 text-sm text-slate-400 border-t border-slate-100 pt-6">
            <span className="flex items-center gap-1.5"><User className="h-4 w-4" /> Stockton Lundell</span>
            <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" /> {post.readTime}</span>
            <span>{post.date}</span>
          </div>
        </header>

        <div
          className="prose-content text-slate-700"
          dangerouslySetInnerHTML={{ __html: renderMarkdown(post.content) }}
        />

        <div className="mt-16 rounded-2xl bg-teal-50 border border-teal-100 p-8 text-center">
          <h2 className="text-xl font-black text-slate-900 mb-2">Ready to recover unused benefits?</h2>
          <p className="text-sm text-slate-600 mb-6">
            Prizm identifies patients with unused VSP and EyeMed benefits and sends personalized campaigns that bring them in.
            Founding customers get lifetime access at $199/month.
          </p>
          <a
            href="/founding"
            className="inline-block rounded-xl bg-teal-500 px-6 py-3 text-sm font-bold text-white hover:bg-teal-400 transition-colors"
          >
            See Founding Offer →
          </a>
        </div>
      </article>
    </div>
  )
}
