import { useState, useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { Calendar, Tag, ArrowLeft, Loader } from 'lucide-react';
import { DatabaseService } from '../services/database';
import { BlogPost } from '../lib/supabase';

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPost();
  }, [slug]);

  const loadPost = async () => {
    if (!slug) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const postData = await DatabaseService.getBlogPostBySlug(slug);
      setPost(postData);
    } catch (error) {
      console.error('Error loading post:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-24 pb-16 flex items-center justify-center">
        <Loader className="w-8 h-8 animate-spin text-amber-400" />
      </div>
    );
  }

  if (!post) {
    return <Navigate to="/blog" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-24 pb-16">
      <article className="max-w-4xl mx-auto px-4">
        <Link
          to="/blog"
          className="inline-flex items-center space-x-2 text-amber-400 hover:text-amber-300 mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Blog</span>
        </Link>

        <div className="mb-8">
          <span className="inline-block px-4 py-2 bg-amber-400 text-slate-900 text-sm font-semibold rounded-full uppercase mb-4">
            {post.category}
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            {post.title}
          </h1>
          <div className="flex items-center space-x-1 text-slate-600 dark:text-slate-400">
            <Calendar className="w-4 h-4" />
            <time>
              {new Date(post.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </time>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-lg mb-8 aspect-video">
          <img
            src={post.featured_image}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="prose prose-invert prose-lg max-w-none mb-8">
          {post.content.split('\n\n').map((paragraph, index) => (
            <p key={index} className="text-slate-700 dark:text-slate-300 mb-6 leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>

        <div className="border-t border-slate-200 dark:border-slate-800 pt-8">
          <h3 className="text-slate-900 dark:text-white font-semibold mb-4 flex items-center space-x-2">
            <Tag className="w-5 h-5" />
            <span>Tags</span>
          </h3>
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-full text-sm font-medium border border-slate-200 dark:border-slate-700 hover:border-amber-400 hover:text-amber-400 transition-colors"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </article>
    </div>
  );
}
