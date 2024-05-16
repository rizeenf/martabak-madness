import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatPrice = (
  price: number | string,
  options: {
    currency?: "USD" | "IDR";
    notation?: Intl.NumberFormatOptions["notation"];
  } = {}
) => {
  const { currency = "IDR", notation = "standard" } = options;

  const numericPrice = typeof price === "string" ? parseFloat(price) : price;

  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency,
    notation,
  }).format(numericPrice);
};


export const allowedImageSources = [
  {
    protocol: "https",
    hostname: "upload.wikimedia.org",
    port: "",
    pathname: "**",
  },
  {
    protocol: "https",
    hostname: "*.instagram.com",
    port: "",
    pathname: "**",
  },
  {
    protocol: "https",
    hostname: "images.unsplash.com",
    port: "",
    pathname: "**",
  },
  {
    protocol: "https",
    hostname: "images.pexels.com",
    port: "",
    pathname: "**",
  },
  {
    protocol: "https",
    hostname: "*.pinimg.com",
    port: "",
    pathname: "**",
  },
];
