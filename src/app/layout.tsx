import { Poppins } from "next/font/google";
import "./globals.css";
import "@/fonts/line-awesome-1.3.0/css/line-awesome.css";
import "@/styles/index.scss";
import "rc-slider/assets/index.css";
import Footer from "@/shared/Footer/Footer";
import SiteHeader from "@/app/SiteHeader";
import CommonClient from "./CommonClient";
import { ToastProvider } from "@/contexts/ToastContext";
import { FeedbackProvider } from "@/contexts/FeedbackContext";
import { AuthProvider } from "@/contexts/AuthContext";

const poppins = Poppins({
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

export default function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: any;
}) {
  return (
    <html lang="en" className={`${poppins.className} scroll-smooth`}>
      <body className="bg-white text-base dark:bg-neutral-900 text-neutral-900 dark:text-neutral-200">
        <AuthProvider>
          <ToastProvider>
            <FeedbackProvider>
              <SiteHeader />
              {children}
              <CommonClient />
              <Footer />
            </FeedbackProvider>
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
