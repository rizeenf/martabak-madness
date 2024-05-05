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

const Cart = () => {
  const totalItem = 10;

  return (
    <Sheet>
      <SheetTrigger className="group flex sm:flex flex-row justify-center items-center gap-1">
        <ShoppingCart className="h-5 w-5 flex-shrink-0 group-hover:opacity-80" />
        <span className="text-xs group-hover:opacity-80">0</span>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Cart ({totalItem}) </SheetTitle>
        </SheetHeader>

        {totalItem > 0 ? (
          <>
            <div className="flex w-full flex-col">
              {/* TODO: CART ITEMS */}
              <ScrollArea className="h-[calc(100svh-190px)] w-full"></ScrollArea>
            </div>
            <div className="w-full text-sm my-2">
              <Separator />
              <div className="flex">
                <span className="flex-1">Shipping</span>
                <span>Free</span>
              </div>
              <div className="flex">
                <span className="flex-1">Transaction Fee</span>
                {formatPrice(0)}
              </div>
              <div className="flex">
                <span className="flex-1">Total</span>
                {formatPrice(1 + 0)}
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
            <span className="text-muted-foreground">Your cart is empty</span>
            <Link
              href="/menu"
              className={cn(buttonVariants({ variant: "link" }), "text-xs")}
            >
              Add items to your cart
            </Link>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default Cart;
