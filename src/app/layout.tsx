import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { AdminProvider } from "@/context/AdminContext";
import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "THREADCO – Wear Your Style",
  description: "Premium streetwear T-shirts for the bold. Shop men, women, oversized & graphic tees.",
  keywords: "t-shirts, streetwear, oversized tees, graphic tees, premium cotton",
  openGraph: {
    title: "THREADCO – Wear Your Style",
    description: "Premium streetwear T-shirts for the bold.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-white text-gray-900 antialiased`}>
        <AuthProvider>
          <AdminProvider>
            <CartProvider>
              <Navbar />
              <main className="pt-16">{children}</main>
              <Footer />
            </CartProvider>
          </AdminProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
