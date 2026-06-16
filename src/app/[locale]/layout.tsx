import { Geist, Geist_Mono } from 'next/font/google';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import RSSLink from '@/components/RSSLink';
import { Locale } from '@/types/post';
import { generateWebSiteJsonLd } from '@/lib/metadata';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export function generateStaticParams() {
  return [{ locale: 'ko' }, { locale: 'en' }];
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale: localeParam } = await params;
  const locale = (localeParam === 'ko' || localeParam === 'en' ? localeParam : 'ko') as Locale;
  const websiteJsonLd = generateWebSiteJsonLd();

  return (
    <>
      {/* lang 속성을 locale에 맞게 동적 설정 */}
      <script
        dangerouslySetInnerHTML={{
          __html: `document.documentElement.lang = '${locale === 'en' ? 'en' : 'ko'}';`,
        }}
      />
      {/* JSON-LD: WebSite structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      <div className={`${geistSans.variable} ${geistMono.variable} flex flex-col min-h-screen`}>
        <Header locale={locale} />
        <main className="flex-1">{children}</main>
        <Footer locale={locale} />
        <RSSLink locale={locale} />
      </div>
    </>
  );
}
