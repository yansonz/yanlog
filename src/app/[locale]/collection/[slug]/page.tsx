import Link from 'next/link';
import { Metadata } from 'next';
import { getAllCollectionSlugs, getPostsByCollection } from '@/lib/mdx';
import { Locale, PostMeta } from '@/types/post';
import { getTranslations } from '@/lib/i18n';
import { generatePageMetadata, generateCollectionJsonLd } from '@/lib/metadata';
import collectionsData from '../../../../../data/collections.json';

interface CollectionDetailPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

type CollectionsData = {
  [slug: string]: {
    ko: { name: string; description: string };
    en: { name: string; description: string };
  };
};

export function generateStaticParams() {
  const locales: Locale[] = ['ko', 'en'];
  const params: { locale: string; slug: string }[] = [];

  for (const locale of locales) {
    const slugs = getAllCollectionSlugs(locale);
    slugs.forEach(slug => {
      params.push({ locale, slug });
    });
  }

  return params;
}

export async function generateMetadata({ params }: CollectionDetailPageProps): Promise<Metadata> {
  const { locale: localeParam, slug } = await params;
  const locale = (localeParam === 'ko' || localeParam === 'en' ? localeParam : 'ko') as Locale;
  const data = collectionsData as CollectionsData;
  const meta = data[slug]?.[locale];
  const name = meta?.name ?? slug;
  const description = meta?.description ?? '';

  return generatePageMetadata({
    title: name,
    description,
    locale,
    path: `/${locale}/collection/${slug}`,
  });
}

function PostItem({ post, locale, order }: { post: PostMeta; locale: Locale; order: number }) {
  return (
    <article className="group">
      <Link href={`/${locale}/blog/${post.slug}`} className="block py-4">
        <div className="flex items-start gap-4">
          <span className="shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800 text-sm font-medium text-neutral-500 dark:text-neutral-400 mt-0.5">
            {order}
          </span>
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1">
              <h2 className="font-medium text-neutral-900 dark:text-neutral-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {post.title}
              </h2>
              <time className="text-sm text-neutral-500 dark:text-neutral-500 shrink-0">
                {post.date}
              </time>
            </div>
            <p className="mt-1 text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed">
              {post.description}
            </p>
          </div>
        </div>
      </Link>
    </article>
  );
}

export default async function CollectionDetailPage({ params }: CollectionDetailPageProps) {
  const { locale: localeParam, slug } = await params;
  const locale = (localeParam === 'ko' || localeParam === 'en' ? localeParam : 'ko') as Locale;
  const translations = getTranslations(locale);
  const posts = getPostsByCollection(slug, locale);
  const data = collectionsData as CollectionsData;
  const meta = data[slug]?.[locale];
  const collectionName = meta?.name ?? slug;
  const collectionDescription = meta?.description ?? '';

  // JSON-LD: ItemList + BreadcrumbList
  const { itemList, breadcrumb } = generateCollectionJsonLd(
    slug,
    collectionName,
    collectionDescription,
    posts.map(p => ({ slug: p.slug, title: p.title })),
    locale
  );

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <header className="mb-12">
        <div className="mb-4">
          <Link
            href={`/${locale}/collection`}
            className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            ← {translations.collection.backToCollections}
          </Link>
        </div>
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
          {collectionName}
        </h1>
        {collectionDescription && (
          <p className="text-neutral-600 dark:text-neutral-400 mb-3">
            {collectionDescription}
          </p>
        )}
        <p className="text-sm text-neutral-500 dark:text-neutral-500">
          {posts.length} {posts.length === 1 ? translations.collection.episode : translations.collection.episodes}
        </p>
      </header>

      {posts.length === 0 ? (
        <p className="text-neutral-500">{translations.collection.noCollection}</p>
      ) : (
        <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
          {posts.map((post, index) => (
            <PostItem
              key={post.slug}
              post={post}
              locale={locale}
              order={index + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}
