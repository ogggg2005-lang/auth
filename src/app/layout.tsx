import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Product Explorer",
  description: "สำรวจรายการสินค้า",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
