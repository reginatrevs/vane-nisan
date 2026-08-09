import type { Metadata, Viewport } from "next";
import { Bodoni_Moda, EB_Garamond, Jost } from "next/font/google";
import { LocaleProvider } from "@/lib/locale";
import { event } from "@/content/event";
import "./globals.css";

/** Big display date — "26 AUGUST 2026". Swap this one to change that face. */
const display = Bodoni_Moda({
  variable: "--font-display",
  subsets: ["latin", "latin-ext"],
  weight: ["500", "600", "700"],
  display: "swap",
});

/** Italic serif used for the invite line, address and time. */
const serif = EB_Garamond({
  variable: "--font-serif",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

const body = Jost({
  variable: "--font-body",
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500"],
  display: "swap",
});

const titleText = `${event.bride.name} & ${event.groom.name}`;

export const metadata: Metadata = {
  title: titleText,
  description: "Join us as we celebrate our engagement.",
  openGraph: {
    title: titleText,
    description: "Join us as we celebrate our engagement.",
    type: "website",
  },
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#f7efe2",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${serif.variable} ${body.variable}`}
    >
      <body className="antialiased">
        <LocaleProvider>{children}</LocaleProvider>
      </body>
    </html>
  );
}
