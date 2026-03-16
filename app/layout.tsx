import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Contact LIT School | Get Admissions Info & Apply",
  description:
    "Ready to start? Get admissions info, program details, or talk to our team. Reach out today — your creator career begins here. Contact us now.",
  openGraph: {
    title: "Contact LIT School | Get Admissions Info & Apply",
    description:
      "Ready to start? Get admissions info, program details, or talk to our team. Reach out today — your creator career begins here.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable}`}>
        {children}
      </body>
    </html>
  );
}
