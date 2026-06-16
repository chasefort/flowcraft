import type { Metadata } from "next";
import { Geist, Geist_Mono, Fraunces } from "next/font/google";
import "./globals.css";
import { Backdrop } from "@/components/Backdrop";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Flowcraft — AI Content Planning Workflow",
  description:
    "An agentic content-planning workflow that turns messy team inputs — a URL, campaign goals, audience, and brand voice — into a structured content strategy and review-ready draft posts.",
  openGraph: {
    title: "Flowcraft — AI Content Planning Workflow",
    description:
      "From messy inputs to usable marketing output. Research → themes → pillars → drafts → human review.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Backdrop />
        {children}
      </body>
    </html>
  );
}
