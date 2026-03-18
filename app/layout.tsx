import type { Metadata } from "next";
import { Bricolage_Grotesque } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const openSauceOne = localFont({
  src: [
    {
      path: "../public/fonts/fonnts.com-456214/body-font/fonnts.com-OpenSauceOne-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/fonnts.com-456214/body-font/fonnts.com-OpenSauceOne-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/fonts/fonnts.com-456214/body-font/fonnts.com-OpenSauceOne-SemiBold.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../public/fonts/fonnts.com-456214/body-font/fonnts.com-OpenSauceOne-Bold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-open-sauce",
  display: "swap",
});

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
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
      <body className={`${openSauceOne.variable} ${bricolage.variable}`}>
        {children}
      </body>
    </html>
  );
}
