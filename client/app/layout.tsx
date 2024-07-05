import type {Metadata} from "next";
import {Inter} from "next/font/google";
import "./globals.css";
import {ThemeProvider} from "@/components/providers/theme-provider";
import {Toaster} from "sonner";
import {ModalProvider} from "@/components/providers/modal-provider";

const inter = Inter({subsets: ["latin"]});

export const metadata: Metadata = {
    title: "Hound",
    description: "Análisis de similitudes entre códigos fuente.",
    icons: {
        icon: [
            {
                media: "(prefers-color-scheme: light)",
                url: "/logo.svg",
                href: "/logo.svg",
            },
            {
                media: "(prefers-color-scheme: dark)",
                url: "/logo-dark.svg",
                href: "/logo-dark.svg",
            },
        ],
    },
};

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" suppressHydrationWarning>
        <body className={inter.className}>
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
            storageKey="hound-theme"
        >
            <Toaster position="bottom-center"/>
            <ModalProvider/>
            {children}
        </ThemeProvider>
        </body>
        </html>
    );
}
