import type { Metadata } from "next";
import "./globals.css";
import AnalyticsProvider from "@/components/AnalyticsProvider";

export const metadata: Metadata = {
  title: "YANSO's Blog",
  description: "기술 관련 글과 좋아하는 활동을 아카이빙하기 위한 공간입니다.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // lang은 [locale]/layout.tsx에서 suppressHydrationWarning을 통해 동적으로 설정됩니다.
  return (
    <html lang="ko" suppressHydrationWarning className="dark">
      <head />
      <body className="antialiased bg-neutral-950 text-neutral-50">
        <AnalyticsProvider />
        {children}
      </body>
    </html>
  );
}
