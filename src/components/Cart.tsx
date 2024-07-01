'use client'
import React from "react";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { ScrollArea } from "./ui/scroll-area";
import { ShoppingCart } from "lucide-react";
import { cn, formatPrice } from "@/lib/utils";
import { Separator } from "./ui/separator";
import Link from "next/link";
import { buttonVariants } from "./ui/button";
import { useCartStore } from "@/utils/store";
import CartItem from "./CartItem";

const Cart = () => {
  // const totalItems = 10;

  const { products, totalItems, totalPrice, removeFromCart } = useCartStore()

  return (
    <Sheet>
      <SheetTrigger className="group flex sm:flex flex-row justify-center items-center gap-1">
        <ShoppingCart className="h-5 w-5 flex-shrink-0 group-hover:opacity-80" />
        <span className="text-xs group-hover:opacity-80">{totalItems}</span>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Cart ({totalItems}) </SheetTitle>
        </SheetHeader>

        {totalItems > 0 ? (
          <>
            <div className="flex w-full flex-col">
              {/* TODO: CART ITEMS */}
              <ScrollArea className="h-[calc(100svh-190px)] w-full">
                {products.map((product, idx) => (
                  <CartItem product={product} key={idx} />
                ))}
              </ScrollArea>
            </div>
            <div className="w-full text-sm my-2">
              <Separator />
              <div className="flex">
                <span className="flex-1">Biaya aplikasi</span>
                {formatPrice(1000)}
              </div>
              <div className="flex">
                <span className="flex-1">Total</span>
                {formatPrice(totalPrice + 1000)}
              </div>
              <Separator />
            </div>
            <SheetFooter>
              <SheetTrigger asChild>
                <Link
                  href={"/cart"}
                  className={buttonVariants({
                    variant: "default",
                    className: "w-full",
                  })}
                >
                  Checkout
                </Link>
              </SheetTrigger>
            </SheetFooter>
          </>
        ) : (
          <div className="flex h-full flex-col items-center justify-center space-y-1">
              <span className="text-muted-foreground">Kamu belum memiliki pesanan.</span>
            <Link
              href="/menu"
              className={cn(buttonVariants({ variant: "link" }), "text-xs")}
            >
                Pesan sekarang &rarr;
            </Link>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default Cart;
