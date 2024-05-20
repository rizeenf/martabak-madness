import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Navbar from "@/components/Navbar";
import AuthProvider from "@/components/AuthProvider";
import QueryProvider from "@/components/QueryProvider";
import { Toaster } from "sonner"

const poppins = Poppins({
  weight: ["400", "700", "800"],
  subsets: ["latin"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Jualan Makanan",
  description:
    "JualanMakanan adalah destinasi utama Anda untuk    menikmati dunia makanan yang lezat. Temukan beragam rasa    manis dan gurih, dengan berbagai pilihan topping yang    menggugah selera. Pesan dengan mudah melalui aplikasi    pengiriman makanan kami dan puaskan hasrat Anda akan    makanan Indonesia yang terkenal ini.",
  keywords:
    "Indonesian Food,  Martabak Flavors,  Toppings Variety,  Food Delivery App,  Culinary Experience,  Indonesian Cuisine, Food Ordering,  Online Food Delivery",
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
              <Toaster position="top-center" richColors duration={1500} />
              <Navbar />
              {children}
            </main>
          </QueryProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
