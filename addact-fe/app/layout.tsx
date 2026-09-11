import type { Metadata } from "next";
import { Geist, Geist_Mono, Montserrat, Poppins } from "next/font/google";
import { getGlobalSetting } from "@/graphql/queries/getGlobalSetting";
import { getHeaderData } from "@/graphql/queries/getHeader";
import { getFooterData } from "@/graphql/queries/getFooter";
import { getStrapiMediaUrl } from "@/lib/media";
import Header from "@/components/templates/header";
import Footer from "@/components/templates/Footer";
import "./globals.css";
import "../styles/custom.scss";
import LayoutWrapper from "./LayoutWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  display: "swap",
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const globalData = await getGlobalSetting().catch(() => null);
  const favicon = globalData?.globalSetting?.brandAssets?.favicon;
  const faviconUrl = favicon?.url ? getStrapiMediaUrl(favicon.url) : "/favicon.ico";

  return {
    title: {
      default: "Addact Technologies | Digital Experience Solutions",
      template: "%s | Addact Technologies",
    },
    description: "Enterprise Digital Experience & Headless Engineering Solutions",
    icons: {
      icon: faviconUrl,
      shortcut: faviconUrl,
      apple: faviconUrl,
    },
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [globalData, headerData, footerData] = await Promise.all([
    getGlobalSetting().catch(() => null),
    getHeaderData("global").catch(() => null),
    getFooterData("global").catch(() => null),
  ]);

  const theme = globalData?.globalSetting?.themeColors;
  const typography = globalData?.globalSetting?.typographyLayout;
  const brandAssets = globalData?.globalSetting?.brandAssets;
  const favicon = brandAssets?.favicon;
  const faviconUrl = favicon?.url ? getStrapiMediaUrl(favicon.url) : null;

  return (
    <html lang="en">
      <head>
        <meta
          name="google-site-verification"
          content="YqKQYm1Ppyy0SPQ6Fs2swuVEI9kcjqLNc1Ovys8rQlA"
        />
        {faviconUrl && <link rel="icon" href={faviconUrl} />}
        <style>{`
          :root {
            --brand-blue: ${theme?.brandBlue || "#3C4CFF"};
            --bg-dark: ${theme?.darkBackground || "#0F0F0F"};
            --bg-light: ${theme?.lightBackground || "#F4F4F4"};
            --card-bg: ${theme?.cardBackground || "#FFFFFF"};
            --text-primary: ${theme?.textPrimary || "#000000"};
            --text-muted: ${theme?.textMuted || "#2E2E2E"};
            --border-radius: ${typography?.defaultBorderRadius || "16px"};
            --container-max-width: ${typography?.containerMaxWidth || "1600px"};
          }
        `}</style>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${montserrat.variable} ${poppins.variable} antialiased flex flex-col min-h-screen bg-[#0F0F0F] text-white`}
      >
        <Header headerData={headerData} />
        <LayoutWrapper>
          <div className="flex-1">{children}</div>
        </LayoutWrapper>
        <Footer data={footerData} />
      </body>
    </html>
  );
}

