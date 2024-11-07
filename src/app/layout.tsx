import "~/styles/globals.css";

import { type Metadata } from "next";
import Auth from "./context/auth";

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
      <Auth>
        <body className="bg-gray-600">{children}</body>
      </Auth>
    </html>
  );
}
