import Link from 'next/link';
import { getAllCollections } from '@/lib/mdx';
import { Locale } from '@/types/post';
import { getTranslations } from '@/lib/i18n';
import collectionsData from '../../../../data/collections.json';

interface CollectionPageProps {
  params: Promise<{ locale: string }>;
}

export function generateStaticParams() {
  return [{ locale: 'ko' }, { locale: 'en' }];
}

type CollectionsData = {
  [slug: string]: {
    ko: { name: string; description: string };
    en: { name: string; description: string };
  };
};

export default async function CollectionPage({ params }: CollectionPageProps) {
  const { locale: localeParam } = await params;
  const locale = (localeParam === 'ko' || localeParam === 'en' ? localeParam : 'ko') as Locale;
  const translations = getTranslations(locale);
  const collections = getAllCollections(locale);
  const data = collectionsData as CollectionsData;

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <header className="mb-12">
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
          {translations.collection.title}
        </h1>
        <p className="text-neutral-600 dark:text-neutral-400">
          {translations.collection.description}
        </p>
      </header>

      {collections.length === 0 ? (
        <p className="text-neutral-500">{translations.collection.noCollection}</p>
      ) : (
        <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
          {collections.map((collection) => {
            const meta = data[collection.slug]?.[locale];
            const name = meta?.name ?? collection.slug;
            const description = meta?.description ?? '';

            return (
              <div key={collection.slug} className="group py-6">
                <Link href={`/${locale}/collection/${collection.slug}`} className="block">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h2 className="font-semibold text-lg text-neutral-900 dark:text-neutral-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {name}
                      </h2>
                      {description && (
                        <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                          {description}
                        </p>
                      )}
                      <div className="mt-3 flex items-center gap-3 text-xs text-neutral-500 dark:text-neutral-500">
                        <span>
                          {collection.postCount} {translations.collection.episodes}
                        </span>
                        <span>·</span>
                        <span>
                          {translations.collection.latestPost}: {collection.latestDate}
                        </span>
                      </div>
                    </div>
                    <span className="shrink-0 text-sm text-blue-600 dark:text-blue-400 group-hover:underline">
                      {translations.collection.viewCollection} →
                    </span>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
