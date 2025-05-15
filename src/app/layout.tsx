import { Poppins } from "next/font/google";
import "./globals.css";
import "@/fonts/line-awesome-1.3.0/css/line-awesome.css";
import "@/styles/index.scss";
import "rc-slider/assets/index.css";
import Footer from "@/shared/Footer/Footer";
import SiteHeader from "@/app/SiteHeader";
import CommonClient from "./CommonClient";
import { Metadata, Viewport } from "next";
import { Providers } from "./providers";

const poppins = Poppins({
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  manifest: "favicon/manifest.json",
  icons: [
    {
      rel: "icon",
      type: "image/png",
      sizes: "192x192",
      url: "favicon/android-icon-192x192.png",
    },
    {
      rel: "icon",
      type: "image/png",
      sizes: "32x32",
      url: "favicon/favicon-32x32.png",
    },
    {
      rel: "icon",
      type: "image/png",
      sizes: "96x96",
      url: "favicon/favicon-96x96.png",
    },
    {
      rel: "icon",
      type: "image/png",
      sizes: "16x16",
      url: "favicon/favicon-16x16.png",
    },
    {
      rel: "apple-touch-icon",
      sizes: "57x57",
      url: "favicon/apple-icon-57x57.png",
      type: "image/png",
    },
    {
      rel: "apple-touch-icon",
      sizes: "60x60",
      url: "favicon/apple-icon-60x60.png",
      type: "image/png",
    },
    {
      rel: "apple-touch-icon",
      sizes: "72x72",
      url: "favicon/apple-icon-72x72.png",
      type: "image/png",
    },
    {
      rel: "apple-touch-icon",
      sizes: "76x76",
      url: "favicon/apple-icon-76x76.png",
      type: "image/png",
    },
    {
      rel: "apple-touch-icon",
      sizes: "114x114",
      url: "favicon/apple-icon-114x114.png",
      type: "image/png",
    },
    {
      rel: "apple-touch-icon",
      sizes: "120x120",
      url: "favicon/apple-icon-120x120.png",
      type: "image/png",
    },
    {
      rel: "apple-touch-icon",
      sizes: "144x144",
      url: "favicon/apple-icon-144x144.png",
      type: "image/png",
    },
    {
      rel: "apple-touch-icon",
      sizes: "152x152",
      url: "favicon/apple-icon-152x152.png",
      type: "image/png",
    },
    {
      rel: "apple-touch-icon",
      sizes: "180x180",
      url: "favicon/apple-icon-180x180.png",
      type: "image/png",
    },
  ],
  authors: {
    name: "Amanda Bruno",
    url: "https://abcasanova.com.br/",
  },
  keywords: "amanda, bruno, noivado, casa nova, cha, casa, casal, festa",
  title: {
    default: "Amanda e Bruno — Chá de Casa Nova",
    template: "%s | Amanda e Bruno — Chá de Casa Nova",
  },
  robots: {
    index: true,
    follow: true,
  },
  description:
    "Amanda e Bruno estão se casando! Ajude-nos a montar nossa casa nova.",
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  initialScale: 1,
  width: "device-width",
};

export default function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: any;
}) {
  return (
    <html lang="en" className={`${poppins.className} scroll-smooth`}>
      <head />
      <body className="bg-white text-base dark:bg-neutral-900 text-neutral-900 dark:text-neutral-200">
        <Providers>
          <SiteHeader />
          {children}
          <CommonClient />
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
