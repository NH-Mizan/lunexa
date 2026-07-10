import { AuthSessionProvider } from "@/components/Auth/AuthSessionProvider";
import Footer from "@/components/Layouts/Footer";
import MainHeader from "@/components/Layouts/Header";
import SocialIcons from "@/components/Layouts/SocialIcon";
import ScrollToTopButton from "@/components/Layouts/ScrollerTop";
import ToastProvider from "@/components/Providers/ToastProvider";
import { Suspense } from "react";
import { HomePageSkeleton } from "@/components/Skeletons";
import { getBrands, getCategories, SITE_URL } from "@/lib/api";
import { getAuthenticatedUser } from "@/lib/auth";
import "./globals.css";


export const metadata = {
  metadataBase: new URL(SITE_URL),

  title: {
    default: "Sell-Pixers | Best Online Shopping Platform",
    template: "%s | Sell-Pixers",
  },

  description:
    "Sell-Pixers is a modern e-commerce platform where you can buy quality products at the best price.",

  keywords: [
    "Sell-Pixers",
    "E-commerce",
    "Online Shopping",
    "Buy Products Online",
  ],

  authors: [{ name: "NH Mizan" }],
  creator: "NH Mizan",

  icons: {
    icon: "/images/sell.jpg",
  },

  openGraph: {
    title: "Sell-Pixers | Best Online Shopping Platform",
    description:
      "Shop smart with Sell-Pixers. Discover quality products at affordable prices.",
    url: SITE_URL,
    siteName: "Sell-Pixers",
    images: [
      {
        url: "/images/sell.jpg",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Sell-Pixers",
    description:
      "Modern e-commerce platform with premium quality products.",
    images: ["/images/sell.jpg"],
  },

  robots: {
    index: true,
    follow: true,
  },
};


export default async function RootLayout({ children }) {
  const [categories, brands, user] = await Promise.all([
    getCategories(),
    getBrands(),
    getAuthenticatedUser(),
  ]);

  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased" suppressHydrationWarning>
        <AuthSessionProvider user={user}>
          <MainHeader initialCategories={categories} brands={brands} />
          <Suspense fallback={<HomePageSkeleton />}>
            <main>{children}</main>
          </Suspense>
          <ToastProvider />
          <Footer />
          <SocialIcons />
          <ScrollToTopButton />
        </AuthSessionProvider>
      </body>
    </html>
  );
}
