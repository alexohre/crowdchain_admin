import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { StarknetProvider } from "./components/starknet-provider";
import RouteGuard from "./components/route-guard";
import { Toaster } from "react-hot-toast";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "800"],
});

export const metadata: Metadata = {
  title: "CrowdChain Admin - Dashboard",
  description: "Admin dashboard for CrowdChain decentralized crowdfunding platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <StarknetProvider>
          <RouteGuard>
            <Toaster position="top-center" />
            {children}
          </RouteGuard>
        </StarknetProvider>    
      </body>
    </html>
  );
}
