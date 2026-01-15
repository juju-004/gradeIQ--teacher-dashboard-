import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { AppToaster } from "@/components/AppToaster";
import { LoadingProvider } from "@/components/providers/LoadingProvider";

// Outfit Sans font
const outfitSans = Outfit({
  variable: "--font-outfit-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Grade IQ",
  description:
    "Grade IQ helps students and teachers analyze grades, track performance, and generate insights with ease.",
  icons: [
    { rel: "icon", url: "/giqlogo_dark.png", sizes: "32x32" },
    { rel: "icon", url: "/giqlogo_dark.png", sizes: "16x16" },
  ],
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${outfitSans.variable} antialiased flex`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <LoadingProvider />
          <AppToaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
