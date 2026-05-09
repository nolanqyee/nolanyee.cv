import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Nolan Yee's Personal Portfolio",
    description:
        "CS @ UT Austin. Building full-stack applications and AI tools. Founder of Bubble.",
    keywords: [
        "full-stack developer",
        "portfolio",
        "UT Austin",
        "AI tools",
        "web development",
        "software engineer",
    ],
    authors: [{ name: "Nolan Yee" }],
    creator: "Nolan Yee",
    metadataBase: new URL("https://nolanyee.cv"),
    alternates: {
        canonical: "https://nolanyee.cv",
    },
    openGraph: {
        type: "website",
        locale: "en_US",
        url: "https://nolanyee.cv",
        title: "Nolan Yee's Personal Portfolio",
        description:
            "Building full-stack applications, AI tools, and founding startups.",
        siteName: "Nolan Yee's Personal Portfolio",
    },
    twitter: {
        card: "summary_large_image",
        title: "Nolan Yee's Personal Portfolio",
        description: "Full-stack developer, AI enthusiast & startup founder",
    },
    robots: "index, follow",
};

const jsonLdSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Nolan Yee",
    url: "https://nolanyee.cv",
    description:
        "CS student at UT Austin building full-stack applications and AI tools",
    jobTitle: "Software Engineer & Startup Founder",
    sameAs: [
        "https://github.com/nolanqyee",
        "https://linkedin.com/in/nolanqyee",
    ],
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html
            lang="en"
            className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
        >
            <head>
                <meta charSet="utf-8" />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify(jsonLdSchema),
                    }}
                />
            </head>
            <body className="min-h-full flex flex-col">{children}</body>
        </html>
    );
}
