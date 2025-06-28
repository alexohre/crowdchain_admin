import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./connection/Providers";
import { WalletProvider } from "./connection/WalletProvider";

export const metadata: Metadata = {
  title: "Crowdchain",
  description: "A Decentralised crowd funding platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
      >
        <Providers>
          <WalletProvider>{children}</WalletProvider>
        </Providers>
      </body>
    </html>
  );
}
