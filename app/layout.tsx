import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ParkEx Garasjemegling",
  description: "Kjøp og selg garasjer med budrunder i sanntid."
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="no">
      <body>{children}</body>
    </html>
  );
}

