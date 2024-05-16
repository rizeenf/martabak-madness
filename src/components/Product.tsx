"use client"
import { formatPrice } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { ProductOptions, User } from "@/config/type";
import { ShoppingCart, Store } from "lucide-react";
import { Skeleton } from "./ui/skeleton";

type Product = {
  id: string;
  title: string;
  desc?: string;
  img?: string;
  price: number;
  options?: ProductOptions[];
  user: User;
};

const Product = ({ product, index }: { product: Product, index: number }) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, index * 200);

    return () => clearTimeout(timer);
  }, [index]);


  if (!product || !isVisible) return <ProductPlaceholder />;

  return <div key={product.id} className="flex flex-col gap-2 p-2 border border-gray-100 rounded group shadow-md">
    <Link href={`/product/${product.id}`} className="group-hover:opacity-85 flex flex-col gap-2">
      <div className="relative aspect-square h-[16rem] w-[16rem] min-w-fit overflow-hidden rounded">
        {product.img && (
          <Image
            alt={product.title}
            src={product.img}
            width={256}
            height={256}
            className="absolute object-cover"
          />
        )}
      </div>
      <div className="flex flexrow justify-between p-1">
        <div className="flex flex-col gap-2">
          <h1 className="font-semibold text-gray-700">{product.title}</h1>
          <span className="font-medium text-xl text-gray-900">{formatPrice(product.price)}</span>
          <div className="text-sm text-gray-600 flex flex-row gap-1 items-center">
            <Store className="h-3 w-3" />
            <span className="">{product?.user?.name}</span>
          </div>
        </div>
        <Link href={`/product/${product.id}`}>
          <Button>
            <ShoppingCart className="h-5 w-5 flex-shrink-0 group-hover:opacity-80" /> +
          </Button>
        </Link>
      </div>
    </Link>
  </div>;
};

export default Product;


const ProductPlaceholder = () => {
  return (
    <div className="flex flex-col w-[16rem]">
      <div className="relative bg-zinc-100 aspect-square w-full overflow-hidden rounded-xl">
        <Skeleton className="h-full w-full" />
      </div>
      <Skeleton className="mt-4 w-2/3 h-4 rounded-lg" />
      <div className="flex flex-row justify-between">
        <Skeleton className="mt-2 w-16 h-4 rounded-lg" />
        <Skeleton className="mt-2 w-12 h-8 rounded-lg" />
      </div>
    </div>
  );
};
