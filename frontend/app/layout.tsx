import type { Metadata } from "next";
import "./globals.css";
import ThemeRegistry from "@/components/ThemeRegistry";
import AuthProviderWrapper from "@/components/AuthProviderWrapper";
import { getRootCssVariablesStyle } from "@/lib/theme";

export const metadata: Metadata = {
  title: "Project 3 Boba Shop",
  description: "A boba shop website for Project 3",
  icons: {
    icon: [
      { url: "/favicon.ico" },
    ],
    apple: [{ url: "/apple-touch-icon.png" }],
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className="antialiased"
      >
        <style
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: getRootCssVariablesStyle() }}
        />
        <ThemeRegistry>
          <AuthProviderWrapper>{children}</AuthProviderWrapper>
        </ThemeRegistry>
      </body>
    </html>
  );
}
