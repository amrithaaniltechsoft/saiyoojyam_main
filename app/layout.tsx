import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Saiyoojyam Ladies Hostels",
  description: "Comfortable, safe, and welcoming living spaces for working women in Kakkanad & Infopark.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased font-sans">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Courgette&family=League+Spartan:wght@100..900&family=Uncial+Antiqua&family=Varela+Round&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
