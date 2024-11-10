import "~/styles/globals.css";

import { type Metadata } from "next";

import Navbar from "~/components/navbar";
import FootBar from "~/components/footer";

export const metadata: Metadata = {
  title: "Wiki",
  description: "Wiki",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="bg-gray-600">
        <Navbar />
        {children}
        <FootBar />
      </body>
    </html>
  );
}
