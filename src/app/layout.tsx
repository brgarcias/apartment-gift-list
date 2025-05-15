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

const dynamicFavicon = (colorScheme: "light" | "dark") => {
  const fill = colorScheme === "dark" ? "fff" : "000";
  const svg = `
    <svg version="1.0" xmlns="http://www.w3.org/2000/svg"
      width="500.000000pt" height="500.000000pt" viewBox="0 0 500.000000 500.000000"
      preserveAspectRatio="xMidYMid meet">

      <g transform="translate(0.000000,500.000000) scale(0.100000,-0.100000)"
      fill="#000000" stroke="none">
      <style>
        path, text {
          fill: #${fill};
        }
        @media (prefers-color-scheme: dark) {
          path, text { fill: #fff }
        }
        @media (prefers-color-scheme: light) {
          path, text { fill: #000 }
        }
      </style>
      <path d="M2220 4809 c-416 -48 -851 -232 -1185 -502 -164 -133 -348 -335 -475
      -522 -273 -405 -416 -934 -380 -1414 25 -346 95 -612 234 -896 242 -492 641
      -878 1141 -1102 242 -109 494 -168 821 -193 210 -16 499 13 724 74 402 107
      733 297 1029 589 418 412 651 929 691 1526 53 811 -344 1606 -1033 2068 -293
      197 -672 334 -1029 372 -113 13 -429 12 -538 0z m540 -60 c318 -33 658 -152
      942 -330 516 -323 891 -856 1012 -1434 71 -342 64 -723 -19 -1045 -63 -243
      -201 -546 -334 -730 -242 -334 -511 -566 -860 -739 -316 -158 -641 -234 -1001
      -234 -183 0 -296 12 -475 50 -667 141 -1242 587 -1549 1200 -113 225 -179 437
      -222 714 -19 124 -21 430 -5 564 65 518 285 970 650 1336 363 364 866 605
      1351 648 69 6 143 13 165 15 54 5 229 -3 345 -15z"/>
      <path d="M2382 3902 c-11 -7 -11 -122 -3 -633 21 -1274 32 -1805 37 -1826 3
      -18 11 -23 35 -23 19 0 32 6 36 17 8 21 -32 2446 -41 2460 -5 8 -54 11 -64 5z"/>
      <path d="M2521 3901 c-12 -8 -13 -75 -8 -438 10 -645 27 -1552 35 -1810 l7
      -228 29 -3 c16 -2 32 0 37 5 5 5 5 240 -1 559 -5 302 -15 842 -21 1199 -6 358
      -14 666 -18 685 -7 37 -32 49 -60 31z"/>
      <path d="M1285 3389 c-4 -13 -41 -98 -82 -189 -101 -222 -92 -203 -176 -395
      -101 -229 -249 -566 -358 -811 -49 -110 -89 -206 -89 -212 0 -13 116 -15 159
      -3 22 6 76 120 198 416 8 19 19 20 351 23 l343 2 15 -37 c8 -21 49 -120 91
      -220 l77 -182 50 -6 c66 -8 132 -1 128 14 -2 13 -418 987 -555 1301 -44 102
      -90 208 -101 235 -12 28 -26 59 -33 69 -10 18 -11 18 -18 -5z m60 -489 c20
      -52 77 -189 126 -303 49 -114 89 -210 89 -212 0 -3 -122 -5 -271 -5 -213 0
      -270 3 -266 13 30 72 259 603 264 610 9 14 19 -3 58 -103z"/>
      <path d="M3419 3099 c-3 -1280 -2 -1311 12 -1321 9 -6 109 -7 259 -4 312 6
      375 20 501 112 164 119 198 381 75 567 -42 64 -84 98 -162 134 l-56 25 45 47
      c58 59 84 113 97 198 28 177 -52 352 -192 424 -98 51 -152 60 -370 66 l-208 6
      -1 -254z m459 66 c95 -29 139 -89 149 -203 12 -147 -36 -241 -144 -282 -41
      -15 -91 -23 -175 -27 l-118 -6 0 273 0 273 119 -7 c65 -3 141 -13 169 -21z
      m47 -675 c161 -31 245 -122 246 -264 1 -112 -35 -183 -118 -236 -66 -42 -163
      -60 -327 -60 l-141 0 2 287 c2 159 3 290 3 292 0 8 276 -8 335 -19z"/>
      </g>
      </svg>
  `.trim();

  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
};

export const metadata: Metadata = {
  manifest: "favicon/manifest.json",
  icons: {
    icon: [
      {
        url: dynamicFavicon("light"),
        type: "image/svg+xml",
        media: "(prefers-color-scheme: light)",
        sizes: "any",
      },
      {
        url: dynamicFavicon("dark"),
        type: "image/svg+xml",
        media: "(prefers-color-scheme: dark)",
        sizes: "any",
      },
      {
        url: "favicon/favicon.ico",
        type: "image/x-icon",
        sizes: "48x48",
      },
    ],
    apple: [
      {
        url: "/favicon/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },
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
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
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
      <head>
        <link
          rel="alternate icon"
          href="favicon/favicon.ico"
          type="image/x-icon"
        />
      </head>
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
