import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { blogCollections, readingMinutes, type BlogPost } from '@/lib/blog';
import { logoThumbnail } from '@/lib/logo-thumbnail';

export function BlogCard({ post }: { post: BlogPost }) {
  const collection = blogCollections.find((c) => c.slug === post.collection)!;
  return (
    <article className="blog-card">
      <div className="blog-card-art">
        <span className="blog-card-topic">{post.topic}</span>
        {collection.logo && (
          <Image
            src={logoThumbnail(collection.logo, 'card')}
            alt={`${collection.brand} logo`}
            width={64}
            height={64}
            loading="eager"
          />
        )}
        <span className="blog-card-brand">{collection.brand}</span>
      </div>
      <div className="blog-card-body">
        <p className="blog-meta">
          Practical guide · {readingMinutes(post)} min read
        </p>
        <h3>
          <Link href={`/blog/${post.slug}/`} prefetch={false}>
            {post.title}
          </Link>
        </h3>
        <p>{post.description}</p>
        <Link
          className="text-link"
          href={`/blog/${post.slug}/`}
          prefetch={false}
          aria-label={`Read: ${post.title}`}
        >
          Read article <ArrowUpRight size={16} aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}
