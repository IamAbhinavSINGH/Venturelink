import type { Metadata } from "next";
import localFont from "next/font/local";
import { Providers } from "./providers";
import "./globals.css";

const raleway = localFont({
  src : './fonts/Raleway.ttf',
  weight : '100 900'
});

export const metadata: Metadata = {
  title: "Venture Link",
  description: "Find the best investors for your startups",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${raleway}`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
