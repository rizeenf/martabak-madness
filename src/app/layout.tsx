import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Navbar from "@/components/Navbar";
import AuthProvider from "@/components/AuthProvider";
import QueryProvider from "@/components/QueryProvider";
import { Toaster}from "sonner"

const poppins = Poppins({
  weight: ["400", "700", "800"],
  subsets: ["latin"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "MartabakMadness",
  description:
    "MartabakMadness is your ultimate destination for indulging in the delightful world of martabak. Discover a wide array of sweet and savory flavors, topped with an assortment of delectable ingredients. Order conveniently through our food delivery app and satisfy your cravings for this beloved Indonesian street food delicacy",
  keywords:
    "Martabak Delivery,  Indonesian Food,  Martabak Flavors,  Toppings Variety,  Food Delivery App,  Culinary Experience,  Indonesian Cuisine, Food Ordering,  Online Food Delivery",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn(poppins.className, "h-full antialiased font-sans")}>
        <AuthProvider>
          <QueryProvider>
            <main className="flex flex-col min-h-screen relative">
            <Toaster position="top-right" closeButton  richColors />
              <Navbar />
              {children}
            </main>
          </QueryProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
