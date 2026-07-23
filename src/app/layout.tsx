import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kin — Prototype Walkthrough",
  description:
    "Clickable prototype of Kin's flagship 2am flow: community post, Sentinel risk flag, nurse chat, and age-adaptive guide.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
